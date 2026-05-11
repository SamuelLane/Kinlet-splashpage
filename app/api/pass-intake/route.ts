import { NextResponse } from "next/server";
import { passIntakeSchema } from "@/lib/schemas/pass-intake";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import {
  ALLOWED_LOGO_TYPES,
  MAX_LOGO_BYTES,
  isAllowedLogoType,
  uploadPartnerLogo,
} from "@/lib/supabase/storage";
import { getEmailTransport } from "@/lib/email/transport";
import {
  renderConfirmationEmail,
  renderNotificationEmail,
} from "@/lib/email/render";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid form data" },
      { status: 400 },
    );
  }

  const payloadRaw = formData.get("payload");
  if (typeof payloadRaw !== "string") {
    return NextResponse.json(
      { ok: false, error: "Missing payload" },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(payloadRaw);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const parsed = passIntakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const submission = parsed.data;

  const logoEntry = formData.get("logo");
  let logoFile: File | null = null;
  if (logoEntry && logoEntry instanceof File && logoEntry.size > 0) {
    if (!isAllowedLogoType(logoEntry.type)) {
      return NextResponse.json(
        {
          ok: false,
          error: `Logo must be one of: ${ALLOWED_LOGO_TYPES.join(", ")}`,
        },
        { status: 400 },
      );
    }
    if (logoEntry.size > MAX_LOGO_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Logo must be 2MB or smaller" },
        { status: 400 },
      );
    }
    logoFile = logoEntry;
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  const supabase = getSupabaseServiceClient();

  const { data: submissionRow, error: insertError } = await supabase
    .from("pass_intake_submissions")
    .insert({
      submitter_name: submission.submitter_name,
      submitter_email: submission.submitter_email,
      submitter_role: submission.submitter_role,
      business_name: submission.business_name,
      business_type: submission.business_type!,
      business_type_other: submission.business_type_other ?? null,
      business_website: submission.business_website ?? null,
      business_phone: submission.business_phone ?? null,
      is_franchise: submission.is_franchise,
      franchise_brand_name: submission.is_franchise
        ? (submission.franchise_brand_name ?? null)
        : null,
      franchise_authority: submission.is_franchise
        ? (submission.franchise_authority ?? null)
        : null,
      redemption_cadence: submission.redemption_cadence,
      additional_notes: submission.additional_notes ?? null,
      marketing_opt_in: submission.marketing_opt_in,
      ip_address: ip,
      user_agent: userAgent,
    })
    .select("id")
    .single();

  if (insertError || !submissionRow) {
    console.error("[pass-intake] supabase insert failed", insertError);
    return NextResponse.json(
      { ok: false, error: "Could not save submission. Please try again." },
      { status: 500 },
    );
  }

  const submissionId = submissionRow.id;

  let logoUrl: string | null = null;
  if (logoFile) {
    try {
      logoUrl = await uploadPartnerLogo(logoFile, submissionId);
      const { error: updateError } = await supabase
        .from("pass_intake_submissions")
        .update({ logo_url: logoUrl })
        .eq("id", submissionId);
      if (updateError) {
        console.error("[pass-intake] logo_url update failed", updateError);
      }
    } catch (err) {
      console.error("[pass-intake] logo upload failed", err);
    }
  }

  const { error: locationsError } = await supabase
    .from("pass_intake_locations")
    .insert(
      submission.locations.map((loc) => ({
        submission_id: submissionId,
        street: loc.street,
        city: loc.city,
        state: loc.state,
        zip: loc.zip,
        offer_description: loc.offer_description,
        offer_restrictions: loc.offer_restrictions ?? null,
        valid_days: loc.valid_days ?? [],
        preferred_promo_code: loc.preferred_promo_code?.trim() || null,
        pos_system: loc.pos_system ?? null,
        pos_system_other:
          loc.pos_system === "other" ? (loc.pos_system_other ?? null) : null,
      })),
    );

  if (locationsError) {
    console.error("[pass-intake] locations insert failed", locationsError);
    await supabase
      .from("pass_intake_submissions")
      .delete()
      .eq("id", submissionId);
    return NextResponse.json(
      { ok: false, error: "Could not save locations. Please try again." },
      { status: 500 },
    );
  }

  const transport = getEmailTransport();
  const from = process.env.EMAIL_FROM ?? process.env.SMTP_USER!;
  const notificationTo =
    process.env.INTAKE_NOTIFICATION_EMAIL ?? process.env.SMTP_USER!;

  const enriched = { ...submission, logo_url: logoUrl ?? undefined };
  const confirmation = renderConfirmationEmail(enriched);
  const notification = renderNotificationEmail(enriched);

  await Promise.allSettled([
    transport.sendMail({
      from,
      to: submission.submitter_email,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
    }),
    transport.sendMail({
      from,
      to: notificationTo,
      replyTo: submission.submitter_email,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    }),
  ]).then((results) => {
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(
          `[pass-intake] email ${i === 0 ? "confirmation" : "notification"} failed`,
          r.reason,
        );
      }
    });
  });

  return NextResponse.json({ ok: true });
}
