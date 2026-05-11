import { z } from "zod";

export const businessTypes = [
  "restaurant",
  "cafe",
  "play_space",
  "activity",
  "retail",
  "other",
] as const;

export const weekdays = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;

export const redemptionCadences = [
  "every_visit",
  "monthly",
  "quarterly",
  "yearly",
] as const;

export const posSystems = [
  "square",
  "toast",
  "clover",
  "shopify",
  "lightspeed",
  "stripe",
  "revel",
  "touchbistro",
  "aloha",
  "micros",
  "none",
  "other",
] as const;

export const franchiseAuthorities = [
  "independent",
  "approval_needed",
  "unsure",
] as const;

export const MAX_LOCATIONS = 10;

export const locationSchema = z
  .object({
    street: z.string().min(1, "Required").max(200),
    city: z.string().min(1, "Required").max(100),
    state: z.string().min(1, "Required").max(50),
    zip: z.string().min(1, "Required").max(20),
    offer_description: z.string().min(1, "Required").max(1000),
    offer_restrictions: z.string().max(1000).optional(),
    valid_days: z.array(z.enum(weekdays)),
    preferred_promo_code: z.string().max(50).optional(),
    pos_system: z.enum(posSystems).optional(),
    pos_system_other: z.string().max(100).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.pos_system === "other" &&
      !(data.pos_system_other && data.pos_system_other.length > 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pos_system_other"],
        message: "Please name your POS system",
      });
    }
  });

export const passIntakeSchema = z
  .object({
    submitter_name: z.string().min(1, "Required").max(100),
    submitter_email: z.string().email("Enter a valid email"),
    submitter_role: z.string().min(1, "Required").max(100),
    business_name: z.string().min(1, "Required").max(150),
    business_type: z.enum(businessTypes),
    business_type_other: z.string().max(100).optional(),
    business_website: z.string().max(200).optional(),
    business_phone: z.string().max(50).optional(),
    is_franchise: z.boolean(),
    franchise_brand_name: z.string().max(150).optional(),
    franchise_authority: z.enum(franchiseAuthorities).optional(),
    redemption_cadence: z.enum(redemptionCadences),
    logo_url: z.string().url().optional(),
    additional_notes: z.string().max(1000).optional(),
    marketing_opt_in: z.boolean(),
    locations: z
      .array(locationSchema)
      .min(1, "Add at least one location")
      .max(MAX_LOCATIONS, `Maximum ${MAX_LOCATIONS} locations`),
  })
  .superRefine((data, ctx) => {
    if (
      data.business_type === "other" &&
      !(data.business_type_other && data.business_type_other.length > 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["business_type_other"],
        message: "Please describe your business type",
      });
    }
    if (data.is_franchise) {
      if (
        !(data.franchise_brand_name && data.franchise_brand_name.length > 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["franchise_brand_name"],
          message: "Enter the brand or franchisor name",
        });
      }
      if (!data.franchise_authority) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["franchise_authority"],
          message: "Please pick one",
        });
      }
    }
  });

export type LocationInput = z.infer<typeof locationSchema>;
export type PassIntakeInput = z.infer<typeof passIntakeSchema>;
