"use client";

import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MAX_LOCATIONS,
  passIntakeSchema,
  posSystems,
  weekdays,
  type LocationInput,
  type PassIntakeInput,
} from "@/lib/schemas/pass-intake";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type Status = "idle" | "submitting" | "success" | "error";

const MAX_LOGO_BYTES = 2 * 1024 * 1024;
const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png"];
const DRAFT_STORAGE_KEY = "kinlet-perks-intake-draft-v4";

type DraftPayload = {
  form: Partial<PassIntakeInput>;
};

const emptyLocation: LocationInput = {
  street: "",
  city: "",
  state: "",
  zip: "",
  offer_description: "",
  offer_restrictions: "",
  valid_days: ["mon", "tue", "wed", "thu", "fri"],
  preferred_promo_code: "",
  pos_system: undefined,
  pos_system_other: "",
};

const WEEKDAY_OPTIONS: Array<{
  value: (typeof weekdays)[number];
  label: string;
}> = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
];

const CADENCE_LABELS: Record<string, string> = {
  every_visit: "Every visit",
  monthly: "Once a month",
  quarterly: "Once every three months",
  yearly: "Once a year",
};

const POS_OPTIONS: Array<{ value: (typeof posSystems)[number]; label: string }> =
  [
    { value: "square", label: "Square" },
    { value: "toast", label: "Toast" },
    { value: "clover", label: "Clover" },
    { value: "shopify", label: "Shopify" },
    { value: "lightspeed", label: "Lightspeed" },
    { value: "stripe", label: "Stripe" },
    { value: "revel", label: "Revel" },
    { value: "touchbistro", label: "TouchBistro" },
    { value: "aloha", label: "Aloha" },
    { value: "micros", label: "Oracle MICROS" },
    { value: "none", label: "No POS / cash only" },
    { value: "other", label: "Other" },
  ];

export function PassIntakeForm({
  onStatusChange,
}: {
  onStatusChange?: (status: Status) => void;
} = {}) {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
    reset,
  } = useForm<PassIntakeInput>({
    resolver: zodResolver(passIntakeSchema),
    defaultValues: {
      marketing_opt_in: false,
      is_franchise: false,
      redemption_cadence: "monthly",
      locations: [emptyLocation],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "locations",
  });

  const businessType = watch("business_type");
  const isFranchise = watch("is_franchise");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as DraftPayload;
      if (draft.form) {
        const merged: Partial<PassIntakeInput> = {
          marketing_opt_in: false,
          is_franchise: false,
          redemption_cadence: "monthly",
          locations: [emptyLocation],
          ...draft.form,
        };
        if (Array.isArray(merged.locations)) {
          merged.locations = merged.locations.map((loc) => ({
            ...emptyLocation,
            ...loc,
            valid_days:
              Array.isArray(loc?.valid_days) && loc.valid_days.length > 0
                ? loc.valid_days
                : emptyLocation.valid_days,
          }));
        }
        reset(merged);
      }
    } catch {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }, [reset]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const subscription = watch((values) => {
      try {
        const payload: DraftPayload = {
          form: values as Partial<PassIntakeInput>,
        };
        window.localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify(payload),
        );
      } catch {
        // localStorage may be unavailable (private mode, quota) — silently skip
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreview(null);
      return;
    }
    const url = URL.createObjectURL(logoFile);
    setLogoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  const acceptLogo = (file: File | undefined | null): boolean => {
    setLogoError(null);
    if (!file) {
      setLogoFile(null);
      return false;
    }
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setLogoError("Logo must be a JPG or PNG.");
      return false;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError("Logo must be 2MB or smaller.");
      return false;
    }
    setLogoFile(file);
    return true;
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const ok = acceptLogo(file);
    if (!ok) e.target.value = "";
  };

  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    const file = e.dataTransfer.files?.[0];
    acceptLogo(file);
  };

  const handleLogoDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDraggingLogo) setIsDraggingLogo(true);
  };

  const handleLogoDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingLogo(false);
  };

  const openLogoPicker = () => {
    logoInputRef.current?.click();
  };

  const clearLogo = () => {
    setLogoFile(null);
    setLogoError(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const addLocation = () => {
    if (fields.length >= MAX_LOCATIONS) return;
    const first = getValues("locations.0");
    append({
      ...emptyLocation,
      offer_description: first?.offer_description ?? "",
      offer_restrictions: first?.offer_restrictions ?? "",
      valid_days: first?.valid_days ?? emptyLocation.valid_days,
      preferred_promo_code: first?.preferred_promo_code ?? "",
      pos_system: first?.pos_system ?? undefined,
      pos_system_other: first?.pos_system_other ?? "",
    });
  };

  const onSubmit = async (values: PassIntakeInput) => {
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const fd = new FormData();
      fd.append("payload", JSON.stringify(values));
      if (logoFile) fd.append("logo", logoFile);

      const res = await fetch("/api/pass-intake", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Something went wrong");
      }
      setStatus("success");
      reset();
      setLogoFile(null);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  };

  if (status === "success") {
    return (
      <div className="form-success">
        <h3>We sent a confirmation!</h3>
        <p>
          Check your inbox — and if you don&apos;t see it within a few minutes,
          check your spam or junk folder and mark it as &quot;Not spam&quot; so
          future updates land in your inbox.
        </p>
        <p>We&apos;ll be in touch within a few business days.</p>
      </div>
    );
  }

  return (
    <form className="pass-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-row">
        <div className="form-field">
          <Label htmlFor="submitter_name">Your name</Label>
          <Input id="submitter_name" {...register("submitter_name")} />
          {errors.submitter_name && (
            <span className="form-error">{errors.submitter_name.message}</span>
          )}
        </div>
        <div className="form-field">
          <Label htmlFor="submitter_email">Email</Label>
          <Input
            id="submitter_email"
            type="email"
            {...register("submitter_email")}
          />
          {errors.submitter_email && (
            <span className="form-error">
              {errors.submitter_email.message}
            </span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <Label htmlFor="business_website">Website or Instagram</Label>
          <Input
            id="business_website"
            placeholder="Optional"
            {...register("business_website")}
          />
        </div>
        <div className="form-field">
          <Label htmlFor="business_phone">Phone number</Label>
          <Input
            id="business_phone"
            placeholder="Optional"
            {...register("business_phone")}
          />
        </div>
      </div>

      <div className="form-field">
        <Label htmlFor="submitter_role">Your role at the business</Label>
        <Input id="submitter_role" {...register("submitter_role")} />
        {errors.submitter_role && (
          <span className="form-error">{errors.submitter_role.message}</span>
        )}
      </div>

      <div className="form-field">
        <Label htmlFor="business_name">Business name</Label>
        <Input id="business_name" {...register("business_name")} />
        {errors.business_name && (
          <span className="form-error">{errors.business_name.message}</span>
        )}
      </div>

      <div className="form-field">
        <Label>Business type</Label>
        <Select
          onValueChange={(v) =>
            setValue("business_type", v as PassIntakeInput["business_type"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pick one" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="cafe">Café</SelectItem>
            <SelectItem value="play_space">Play space</SelectItem>
            <SelectItem value="activity">Activity</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.business_type && (
          <span className="form-error">{errors.business_type.message}</span>
        )}
        {businessType === "other" && (
          <Input
            placeholder="Describe your business"
            className="mt-2"
            {...register("business_type_other")}
          />
        )}
        {errors.business_type_other && (
          <span className="form-error">
            {errors.business_type_other.message}
          </span>
        )}
      </div>

      <label className="form-toggle-card">
        <Checkbox
          checked={isFranchise}
          onCheckedChange={(checked) =>
            setValue("is_franchise", checked === true, { shouldValidate: true })
          }
        />
        <span className="form-toggle-card-body">
          <span className="form-toggle-card-title">
            Is your business part of a franchise or larger brand?
          </span>
          <span className="form-toggle-card-hint">
            Helpful if we should also reach out to corporate.
          </span>
        </span>
      </label>

      {isFranchise && (
        <div className="form-conditional-block">
          <div className="form-field">
            <Label htmlFor="franchise_brand_name">Brand or franchisor</Label>
            <Input
              id="franchise_brand_name"
              placeholder="e.g. The Goddard School"
              {...register("franchise_brand_name")}
            />
            {errors.franchise_brand_name && (
              <span className="form-error">
                {errors.franchise_brand_name.message}
              </span>
            )}
          </div>
          <div className="form-field">
            <Label>Can you partner with us independently?</Label>
            <RadioGroup
              onValueChange={(v) =>
                setValue(
                  "franchise_authority",
                  v as PassIntakeInput["franchise_authority"],
                  { shouldValidate: true },
                )
              }
              className="form-radio-group"
            >
              <label className="form-radio-row">
                <RadioGroupItem value="independent" id="fa_independent" />
                <span>Yes — I can partner independently</span>
              </label>
              <label className="form-radio-row">
                <RadioGroupItem
                  value="approval_needed"
                  id="fa_approval_needed"
                />
                <span>No — franchisor approval needed</span>
              </label>
              <label className="form-radio-row">
                <RadioGroupItem value="unsure" id="fa_unsure" />
                <span>Not sure</span>
              </label>
            </RadioGroup>
            {errors.franchise_authority && (
              <span className="form-error">
                {errors.franchise_authority.message}
              </span>
            )}
          </div>
        </div>
      )}

      {fields.map((field, index) => (
        <LocationCard
          key={field.id}
          index={index}
          isOnly={index === 0}
          showHeading={fields.length > 1}
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          onRemove={() => remove(index)}
        />
      ))}

      <button
        type="button"
        className="location-add-btn"
        onClick={addLocation}
        disabled={fields.length >= MAX_LOCATIONS}
      >
        + Add another location
      </button>

      <div className="form-field">
        <Label htmlFor="logo">Logo (optional)</Label>
        <input
          id="logo"
          ref={logoInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          onChange={handleLogoChange}
        />
        {!logoFile && (
          <div
            className={`form-file-dropzone${isDraggingLogo ? " is-dragging" : ""}`}
            role="button"
            tabIndex={0}
            onClick={openLogoPicker}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLogoPicker();
              }
            }}
            onDrop={handleLogoDrop}
            onDragOver={handleLogoDragOver}
            onDragEnter={handleLogoDragOver}
            onDragLeave={handleLogoDragLeave}
          >
            <span className="form-file-dropzone-title">
              {isDraggingLogo
                ? "Drop your logo here"
                : "Drag a logo here, or click to browse"}
            </span>
            <span className="form-file-dropzone-hint">JPG or PNG, max 2MB</span>
          </div>
        )}
        {logoFile && logoPreview && (
          <div className="form-file-preview">
            <img src={logoPreview} alt="Logo preview" />
            <span>{logoFile.name}</span>
            <button
              type="button"
              className="form-file-remove"
              onClick={clearLogo}
            >
              Remove
            </button>
          </div>
        )}
        {logoError && <span className="form-error">{logoError}</span>}
      </div>

      <details className="form-details">
        <summary>Anything else you want us to know?</summary>
        <div className="form-details-body">
          <div className="form-field">
            <Textarea
              id="additional_notes"
              rows={2}
              placeholder="Optional notes"
              {...register("additional_notes")}
            />
          </div>
        </div>
      </details>

      <label className="form-checkbox-row">
        <Checkbox
          onCheckedChange={(checked) =>
            setValue("marketing_opt_in", checked === true)
          }
        />
        <span>
          I&apos;d like to receive updates about Kinlet Pass and launch news.
        </span>
      </label>

      <div className="form-submit-row">
        <button
          type="submit"
          className="form-submit-btn"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Submit"}
        </button>
        <span className="form-privacy-note">
          By submitting, you agree to our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </span>
      </div>

      {status === "error" && (
        <div className="form-error form-error-banner">
          {errorMessage ?? "Something went wrong. Please try again."}
        </div>
      )}
    </form>
  );
}

type LocationCardProps = {
  index: number;
  isOnly: boolean;
  showHeading: boolean;
  register: ReturnType<typeof useForm<PassIntakeInput>>["register"];
  setValue: ReturnType<typeof useForm<PassIntakeInput>>["setValue"];
  watch: ReturnType<typeof useForm<PassIntakeInput>>["watch"];
  errors: ReturnType<typeof useForm<PassIntakeInput>>["formState"]["errors"];
  onRemove: () => void;
};

function LocationCard({
  index,
  isOnly,
  showHeading,
  register,
  setValue,
  watch,
  errors,
  onRemove,
}: LocationCardProps) {
  const posSystem = watch(`locations.${index}.pos_system`);
  const cadence = watch("redemption_cadence");
  const validDays = watch(`locations.${index}.valid_days`) ?? [];
  const locErrors = errors.locations?.[index];

  return (
    <div className="location-card">
      {showHeading && (
        <div className="location-card-header">
          <span className="location-card-title">Location {index + 1}</span>
          {!isOnly && (
            <button
              type="button"
              className="location-card-remove"
              onClick={onRemove}
            >
              Remove
            </button>
          )}
        </div>
      )}

      <div className="form-field">
        <Label htmlFor={`loc-street-${index}`}>Street address</Label>
        <Input
          id={`loc-street-${index}`}
          {...register(`locations.${index}.street`)}
        />
        {locErrors?.street && (
          <span className="form-error">{locErrors.street.message}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-field">
          <Label htmlFor={`loc-city-${index}`}>City</Label>
          <Input
            id={`loc-city-${index}`}
            {...register(`locations.${index}.city`)}
          />
          {locErrors?.city && (
            <span className="form-error">{locErrors.city.message}</span>
          )}
        </div>
        <div className="form-row" style={{ gap: "1rem" }}>
          <div className="form-field">
            <Label htmlFor={`loc-state-${index}`}>State</Label>
            <Input
              id={`loc-state-${index}`}
              {...register(`locations.${index}.state`)}
            />
            {locErrors?.state && (
              <span className="form-error">{locErrors.state.message}</span>
            )}
          </div>
          <div className="form-field">
            <Label htmlFor={`loc-zip-${index}`}>ZIP</Label>
            <Input
              id={`loc-zip-${index}`}
              {...register(`locations.${index}.zip`)}
            />
            {locErrors?.zip && (
              <span className="form-error">{locErrors.zip.message}</span>
            )}
          </div>
        </div>
      </div>

      <div className="form-field">
        <Label htmlFor={`loc-offer-${index}`}>
          What offer are you providing Pass holders?
        </Label>
        <Textarea
          id={`loc-offer-${index}`}
          rows={3}
          placeholder="e.g. 10% off, free kids' drink with entrée, etc."
          {...register(`locations.${index}.offer_description`)}
        />
        {locErrors?.offer_description && (
          <span className="form-error">
            {locErrors.offer_description.message}
          </span>
        )}
      </div>

      <div className="form-field">
        <Label>Which days is the offer valid?</Label>
        <div className="weekday-chip-row">
          {WEEKDAY_OPTIONS.map((opt) => {
            const checked = validDays.includes(opt.value);
            return (
              <button
                type="button"
                key={opt.value}
                className={`weekday-chip${checked ? " is-selected" : ""}`}
                aria-pressed={checked}
                onClick={() => {
                  const next = checked
                    ? validDays.filter((d) => d !== opt.value)
                    : [...validDays, opt.value];
                  setValue(`locations.${index}.valid_days`, next, {
                    shouldValidate: true,
                  });
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-field">
        <Label>How often can a customer redeem this offer?</Label>
        <Select
          value={cadence}
          onValueChange={(v) =>
            setValue(
              "redemption_cadence",
              v as PassIntakeInput["redemption_cadence"],
              { shouldValidate: true },
            )
          }
          disabled={index > 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pick one">
              {cadence ? CADENCE_LABELS[cadence] : null}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="every_visit">Every visit</SelectItem>
            <SelectItem value="monthly">Once a month</SelectItem>
            <SelectItem value="quarterly">Once every three months</SelectItem>
            <SelectItem value="yearly">Once a year</SelectItem>
          </SelectContent>
        </Select>
        <span className="form-hint">
          {index === 0
            ? "Most partners pick “Once a month” — drives repeat visits without giving away the store."
            : "Cadence is shared across all locations. Edit it on Location 1."}
        </span>
      </div>

      <div className="form-field">
        <Label htmlFor={`loc-promo-${index}`}>
          Preferred promo code (optional)
        </Label>
        <Input
          id={`loc-promo-${index}`}
          placeholder="Leave blank and we'll generate one"
          {...register(`locations.${index}.preferred_promo_code`)}
        />
        <span className="form-hint">
          Customers will show this code at checkout. We&apos;ll generate one if
          you don&apos;t have a preference.
        </span>
      </div>

      <div className="form-row">
        <div className="form-field">
          <Label>POS or system you use</Label>
          <Select
            value={posSystem ?? ""}
            onValueChange={(v) =>
              setValue(
                `locations.${index}.pos_system`,
                v as LocationInput["pos_system"],
                { shouldValidate: true },
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pick one">
                {posSystem
                  ? (POS_OPTIONS.find((o) => o.value === posSystem)?.label ??
                    null)
                  : null}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {POS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {posSystem === "other" && (
            <Input
              placeholder="Name your POS system"
              className="mt-2"
              {...register(`locations.${index}.pos_system_other`)}
            />
          )}
          {locErrors?.pos_system_other && (
            <span className="form-error">
              {locErrors.pos_system_other.message}
            </span>
          )}
        </div>
        <div className="form-field">
          <Label htmlFor={`loc-restrictions-${index}`}>
            Restrictions on the offer
          </Label>
          <Input
            id={`loc-restrictions-${index}`}
            {...register(`locations.${index}.offer_restrictions`)}
          />
        </div>
      </div>
    </div>
  );
}
