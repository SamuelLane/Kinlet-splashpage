import { getSupabaseServiceClient } from "./server";

export const PARTNER_LOGOS_BUCKET = "partner-logos";
export const MAX_LOGO_BYTES = 2 * 1024 * 1024;
export const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png"] as const;

export type AllowedLogoType = (typeof ALLOWED_LOGO_TYPES)[number];

export function isAllowedLogoType(type: string): type is AllowedLogoType {
  return (ALLOWED_LOGO_TYPES as readonly string[]).includes(type);
}

export async function uploadPartnerLogo(
  file: File,
  submissionId: string,
): Promise<string> {
  const supabase = getSupabaseServiceClient();
  const ext = file.type === "image/png" ? "png" : "jpg";
  const path = `${submissionId}/logo.${ext}`;

  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from(PARTNER_LOGOS_BUCKET)
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error(`Logo upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(PARTNER_LOGOS_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}
