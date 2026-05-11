import type { LocationInput, PassIntakeInput } from "@/lib/schemas/pass-intake";

const businessTypeLabels: Record<string, string> = {
  restaurant: "Restaurant",
  cafe: "Cafe",
  play_space: "Play space",
  activity: "Activity / experience",
  retail: "Retail",
  other: "Other",
};

const posSystemLabels: Record<string, string> = {
  square: "Square",
  toast: "Toast",
  clover: "Clover",
  shopify: "Shopify",
  lightspeed: "Lightspeed",
  stripe: "Stripe",
  revel: "Revel",
  touchbistro: "TouchBistro",
  aloha: "Aloha",
  micros: "Oracle MICROS",
  none: "No POS / cash only",
  other: "Other",
};

const franchiseAuthorityLabels: Record<string, string> = {
  independent: "Can partner independently",
  approval_needed: "Franchisor approval needed",
  unsure: "Not sure",
};

const redemptionCadenceLabels: Record<string, string> = {
  every_visit: "Every visit",
  monthly: "Once a month",
  quarterly: "Once every three months",
  yearly: "Once a year",
};

const weekdayLabels: Record<string, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

const weekdayOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function validDaysLabel(loc: LocationInput): string | null {
  if (!loc.valid_days || loc.valid_days.length === 0) return null;
  if (loc.valid_days.length === 7) return "Every day";
  return weekdayOrder
    .filter((d) => loc.valid_days.includes(d as never))
    .map((d) => weekdayLabels[d])
    .join(", ");
}

function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(value: string) {
  return escape(value).replace(/\n/g, "<br />");
}

function businessTypeLabel(submission: PassIntakeInput) {
  if (submission.business_type === "other" && submission.business_type_other) {
    return submission.business_type_other;
  }
  return (
    businessTypeLabels[submission.business_type] ?? submission.business_type
  );
}

function posLabel(loc: LocationInput): string | null {
  if (!loc.pos_system) return null;
  if (loc.pos_system === "other" && loc.pos_system_other) {
    return loc.pos_system_other;
  }
  return posSystemLabels[loc.pos_system] ?? loc.pos_system;
}

function formatAddress(loc: LocationInput) {
  return `${loc.street}, ${loc.city}, ${loc.state} ${loc.zip}`;
}

function locationHtml(loc: LocationInput, index: number, total: number) {
  const heading =
    total > 1 ? `<h3 style="margin: 24px 0 8px; font-size: 1rem;">Location ${index + 1}</h3>` : "";
  const rows: Array<[string, string | null | undefined]> = [
    ["Address", formatAddress(loc)],
    ["Offer", loc.offer_description],
    ["Valid days", validDaysLabel(loc)],
    ["Restrictions", loc.offer_restrictions],
    ["Preferred promo code", loc.preferred_promo_code],
    ["POS system", posLabel(loc)],
  ];
  const tableRows = rows
    .filter(([, v]) => v && String(v).length > 0)
    .map(
      ([label, value]) =>
        `<tr><td style="padding: 6px 0; color: #666; vertical-align: top; width: 140px;">${escape(label)}</td><td style="padding: 6px 0;">${nl2br(String(value))}</td></tr>`,
    )
    .join("");
  return `${heading}<table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%;">${tableRows}</table>`;
}

function locationText(loc: LocationInput, index: number, total: number) {
  const header = total > 1 ? `=== Location ${index + 1} ===\n` : "";
  const rows: Array<[string, string | null | undefined]> = [
    ["Address", formatAddress(loc)],
    ["Offer", loc.offer_description],
    ["Valid days", validDaysLabel(loc)],
    ["Restrictions", loc.offer_restrictions],
    ["Preferred promo code", loc.preferred_promo_code],
    ["POS system", posLabel(loc)],
  ];
  return (
    header +
    rows
      .filter(([, v]) => v && String(v).length > 0)
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n")
  );
}

export function renderConfirmationEmail(submission: PassIntakeInput) {
  const businessType = businessTypeLabel(submission);
  const total = submission.locations.length;

  const subject = `Thanks for your interest in Kinlet Perks`;

  const franchiseBlock = submission.is_franchise
    ? `<p><strong>Franchise:</strong> ${escape(submission.franchise_brand_name ?? "")}${submission.franchise_authority ? ` — ${escape(franchiseAuthorityLabels[submission.franchise_authority] ?? submission.franchise_authority)}` : ""}</p>`
    : "";

  const locationsHtml = submission.locations
    .map((loc, i) => locationHtml(loc, i, total))
    .join("");

  const html = `<!DOCTYPE html>
<html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #2a2a2a; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h2 style="margin: 0 0 16px; color: #2a2a2a;">Thanks, ${escape(submission.submitter_name)} 👋</h2>
  <p>We received your interest in becoming a Kinlet Perks partner for <strong>${escape(submission.business_name)}</strong>. Here's what you sent us:</p>
  <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 16px 0; width: 100%;">
    <tr><td style="padding: 6px 0; color: #666; vertical-align: top; width: 140px;">Business</td><td style="padding: 6px 0;">${escape(submission.business_name)}</td></tr>
    <tr><td style="padding: 6px 0; color: #666; vertical-align: top;">Type</td><td style="padding: 6px 0;">${escape(businessType)}</td></tr>
    <tr><td style="padding: 6px 0; color: #666; vertical-align: top;">Locations</td><td style="padding: 6px 0;">${total}</td></tr>
    <tr><td style="padding: 6px 0; color: #666; vertical-align: top;">Redemption</td><td style="padding: 6px 0;">${escape(redemptionCadenceLabels[submission.redemption_cadence] ?? submission.redemption_cadence)}</td></tr>
  </table>
  ${franchiseBlock}
  ${locationsHtml}
  <p style="margin-top: 24px;">Joining Kinlet Perks is free and zero-risk — we send local families your way, and you honor the offers above. We'll review your submission and reach out within a few business days with next steps.</p>
  <p>If anything looks off or you'd like to add details, just reply to this email.</p>
  <p style="margin-top: 32px;">— The Kinlet team</p>
  <hr style="border: 0; border-top: 1px solid #eee; margin: 32px 0 16px;" />
  <p style="font-size: 12px; color: #999;">You received this email because you submitted the Kinlet Perks partner intake form at trykinlet.com. If this wasn't you, please ignore this message.</p>
</body></html>`;

  const franchiseTextBlock = submission.is_franchise
    ? `\nFranchise: ${submission.franchise_brand_name ?? ""}${submission.franchise_authority ? ` — ${franchiseAuthorityLabels[submission.franchise_authority] ?? submission.franchise_authority}` : ""}\n`
    : "";

  const locationsText = submission.locations
    .map((loc, i) => locationText(loc, i, total))
    .join("\n\n");

  const text = `Thanks, ${submission.submitter_name}!

We received your interest in becoming a Kinlet Perks partner for ${submission.business_name}. Here's what you sent us:

Business: ${submission.business_name}
Type: ${businessType}
Locations: ${total}
Redemption: ${redemptionCadenceLabels[submission.redemption_cadence] ?? submission.redemption_cadence}
${franchiseTextBlock}
${locationsText}

Joining Kinlet Perks is free and zero-risk — we send local families your way, and you honor the offers above. We'll review your submission and reach out within a few business days with next steps.

If anything looks off or you'd like to add details, just reply to this email.

— The Kinlet team

---
You received this email because you submitted the Kinlet Perks partner intake form at trykinlet.com.`;

  return { subject, html, text };
}

export function renderNotificationEmail(submission: PassIntakeInput) {
  const businessType = businessTypeLabel(submission);
  const total = submission.locations.length;

  const subject = submission.is_franchise
    ? `[Franchise] New Kinlet Perks intake: ${submission.business_name}`
    : `New Kinlet Perks intake: ${submission.business_name}`;

  const sharedRows: Array<[string, string | undefined | null]> = [
    [
      "Submitter",
      `${submission.submitter_name} (${submission.submitter_role})`,
    ],
    ["Email", submission.submitter_email],
    ["Business", submission.business_name],
    ["Type", businessType],
    ["Locations", String(total)],
    [
      "Redemption cadence",
      redemptionCadenceLabels[submission.redemption_cadence] ??
        submission.redemption_cadence,
    ],
    ["Website / IG", submission.business_website],
    ["Phone", submission.business_phone],
    ["Notes", submission.additional_notes],
    ["Marketing opt-in", submission.marketing_opt_in ? "Yes" : "No"],
  ];

  if (submission.is_franchise) {
    sharedRows.splice(
      4,
      0,
      ["Franchise brand", submission.franchise_brand_name],
      [
        "Franchise authority",
        submission.franchise_authority
          ? (franchiseAuthorityLabels[submission.franchise_authority] ??
            submission.franchise_authority)
          : null,
      ],
    );
  }

  if (submission.logo_url) {
    sharedRows.push(["Logo", submission.logo_url]);
  }

  const sharedTableRows = sharedRows
    .filter(([, value]) => value && String(value).length > 0)
    .map(
      ([label, value]) =>
        `<tr><td style="padding: 6px 0; color: #666; vertical-align: top; width: 160px;">${escape(label)}</td><td style="padding: 6px 0;">${nl2br(String(value))}</td></tr>`,
    )
    .join("");

  const franchiseBanner = submission.is_franchise
    ? `<p style="margin: 0 0 16px; padding: 10px 14px; background: #fff3e6; border-left: 3px solid #f4a261;"><strong>Franchise lead:</strong> ${escape(submission.franchise_brand_name ?? "")} — ${escape(submission.franchise_authority ? (franchiseAuthorityLabels[submission.franchise_authority] ?? submission.franchise_authority) : "no authority specified")}</p>`
    : "";

  const logoBlock = submission.logo_url
    ? `<p style="margin-top: 12px;"><img src="${escape(submission.logo_url)}" alt="${escape(submission.business_name)} logo" style="max-width: 200px; max-height: 100px; border-radius: 6px; border: 1px solid #eee;" /></p>`
    : "";

  const locationsHtml = submission.locations
    .map((loc, i) => locationHtml(loc, i, total))
    .join("");

  const html = `<!DOCTYPE html>
<html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #2a2a2a; max-width: 680px; margin: 0 auto; padding: 24px;">
  <h2 style="margin: 0 0 8px;">New Kinlet Perks intake</h2>
  <p style="margin: 0 0 16px; color: #666;">${escape(submission.business_name)} — ${total} location${total === 1 ? "" : "s"}</p>
  ${franchiseBanner}
  <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%;">${sharedTableRows}</table>
  ${logoBlock}
  ${locationsHtml}
  <p style="margin-top: 24px;"><a href="mailto:${escape(submission.submitter_email)}">Reply to ${escape(submission.submitter_name)}</a></p>
</body></html>`;

  const sharedText = sharedRows
    .filter(([, value]) => value && String(value).length > 0)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  const locationsText = submission.locations
    .map((loc, i) => locationText(loc, i, total))
    .join("\n\n");

  const text = `${sharedText}\n\n${locationsText}`;

  return { subject, html, text };
}
