"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, LoadingSpinner } from "@/components/forms/MainForm";

// ─── All IANA timezones ───────────────────────────────────────────────────────
const TIMEZONES = Intl.supportedValuesOf("timeZone");

// ─── Types ────────────────────────────────────────────────────────────────────
type PlanKey = "flex" | "solo" | "fleet";

type PlanLimits = {
  name?: string;
  maxVehicles: number | "";
  monthlyPrice: number | "";
};

export type SystemSettingsFormValues = {
  defaultTaxRate: number | "";
  platformCurrency: string;
  globalTimezone: string;
  minBookingDuration: number | "";
  maxBookingDuration: number | "";
  cancellationPolicyWindow: number | "";
  plans: Record<PlanKey, PlanLimits>;
};

type SystemSettingsFormProps = {
  defaultValues?: Partial<SystemSettingsFormValues>;
  onSubmit: (values: SystemSettingsFormValues) => void | Promise<void>;
};

const PLANS: { key: PlanKey; defaultName: string }[] = [
  { key: "flex", defaultName: "Flex" },
  { key: "solo", defaultName: "Solo" },
  { key: "fleet", defaultName: "Fleet" },
];

const FALLBACK_DEFAULTS: SystemSettingsFormValues = {
  defaultTaxRate: "",
  platformCurrency: "USD $",
  globalTimezone: "America/New_York",
  minBookingDuration: "",
  maxBookingDuration: "",
  cancellationPolicyWindow: "",
  plans: {
    flex: { name: "Flex", maxVehicles: "", monthlyPrice: "" },
    solo: { name: "Solo", maxVehicles: "", monthlyPrice: "" },
    fleet: { name: "Fleet", maxVehicles: "", monthlyPrice: "" },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function SystemSettingsForm({
  defaultValues,
  onSubmit,
}: SystemSettingsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SystemSettingsFormValues>({
    mode: "onTouched",
    defaultValues: {
      ...FALLBACK_DEFAULTS,
      ...defaultValues,
      plans: {
        flex: {
          name: defaultValues?.plans?.flex?.name ?? FALLBACK_DEFAULTS.plans.flex.name,
          maxVehicles: defaultValues?.plans?.flex?.maxVehicles ?? FALLBACK_DEFAULTS.plans.flex.maxVehicles,
          monthlyPrice: defaultValues?.plans?.flex?.monthlyPrice ?? FALLBACK_DEFAULTS.plans.flex.monthlyPrice,
        },
        solo: {
          name: defaultValues?.plans?.solo?.name ?? FALLBACK_DEFAULTS.plans.solo.name,
          maxVehicles: defaultValues?.plans?.solo?.maxVehicles ?? FALLBACK_DEFAULTS.plans.solo.maxVehicles,
          monthlyPrice: defaultValues?.plans?.solo?.monthlyPrice ?? FALLBACK_DEFAULTS.plans.solo.monthlyPrice,
        },
        fleet: {
          name: defaultValues?.plans?.fleet?.name ?? FALLBACK_DEFAULTS.plans.fleet.name,
          maxVehicles: defaultValues?.plans?.fleet?.maxVehicles ?? FALLBACK_DEFAULTS.plans.fleet.maxVehicles,
          monthlyPrice: defaultValues?.plans?.fleet?.monthlyPrice ?? FALLBACK_DEFAULTS.plans.fleet.monthlyPrice,
        },
      },
    },
    values: defaultValues
      ? {
          defaultTaxRate: defaultValues.defaultTaxRate ?? FALLBACK_DEFAULTS.defaultTaxRate,
          platformCurrency: defaultValues.platformCurrency ?? FALLBACK_DEFAULTS.platformCurrency,
          globalTimezone: defaultValues.globalTimezone ?? FALLBACK_DEFAULTS.globalTimezone,
          minBookingDuration: defaultValues.minBookingDuration ?? FALLBACK_DEFAULTS.minBookingDuration,
          maxBookingDuration: defaultValues.maxBookingDuration ?? FALLBACK_DEFAULTS.maxBookingDuration,
          cancellationPolicyWindow: defaultValues.cancellationPolicyWindow ?? FALLBACK_DEFAULTS.cancellationPolicyWindow,
          plans: {
            flex: {
              name: defaultValues.plans?.flex?.name ?? FALLBACK_DEFAULTS.plans.flex.name,
              maxVehicles: defaultValues.plans?.flex?.maxVehicles ?? FALLBACK_DEFAULTS.plans.flex.maxVehicles,
              monthlyPrice: defaultValues.plans?.flex?.monthlyPrice ?? FALLBACK_DEFAULTS.plans.flex.monthlyPrice,
            },
            solo: {
              name: defaultValues.plans?.solo?.name ?? FALLBACK_DEFAULTS.plans.solo.name,
              maxVehicles: defaultValues.plans?.solo?.maxVehicles ?? FALLBACK_DEFAULTS.plans.solo.maxVehicles,
              monthlyPrice: defaultValues.plans?.solo?.monthlyPrice ?? FALLBACK_DEFAULTS.plans.solo.monthlyPrice,
            },
            fleet: {
              name: defaultValues.plans?.fleet?.name ?? FALLBACK_DEFAULTS.plans.fleet.name,
              maxVehicles: defaultValues.plans?.fleet?.maxVehicles ?? FALLBACK_DEFAULTS.plans.fleet.maxVehicles,
              monthlyPrice: defaultValues.plans?.fleet?.monthlyPrice ?? FALLBACK_DEFAULTS.plans.fleet.monthlyPrice,
            },
          },
        }
      : undefined,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full"
      noValidate
    >
      {/* ── Section 1: General settings ──────────────────── */}
      <div className="p-4 md:p-6 bg-white rounded-[10px] border border-[#E5E7EB] flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Default Tax Rate */}
          <FormField<SystemSettingsFormValues>
            field={{
              name: "defaultTaxRate",
              type: "number",
              label: "Default Tax Rate (%)",
              placeholder: "e.g. 7.5",
              min: 0,
              max: 100,
              step: 0.1,
              validation: {
                min: { value: 0, message: "Tax rate cannot be negative" },
                max: { value: 100, message: "Tax rate cannot exceed 100%" },
                valueAsNumber: true,
              },
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />

          {/* 2. Platform Currency — disabled */}
          <FormField<SystemSettingsFormValues>
            field={{
              name: "platformCurrency",
              type: "text",
              label: "Platform Currency",
              placeholder: "USD $",
              disabled: true,
              description: "Feature presently disabled",
              className: "cursor-not-allowed opacity-60",
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />

          {/* 3. Global Timezone */}
          <FormField<SystemSettingsFormValues>
            field={{
              name: "globalTimezone",
              type: "select",
              label: "Global Timezone",
              placeholder: "Select a timezone",
              options: TIMEZONES.map((tz) => ({ label: tz, value: tz })),
              validation: { required: "Timezone is required" },
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />

          {/* 4. Minimum Booking Duration */}
          <FormField<SystemSettingsFormValues>
            field={{
              name: "minBookingDuration",
              type: "number",
              label: "Minimum Booking Duration (Days)",
              placeholder: "e.g. 1",
              min: 1,
              description: "Minimum booking length in days",
              validation: {
                min: { value: 1, message: "Minimum is 1 day" },
                valueAsNumber: true,
              },
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />

          {/* 5. Maximum Booking Duration */}
          <FormField<SystemSettingsFormValues>
            field={{
              name: "maxBookingDuration",
              type: "number",
              label: "Maximum Booking Duration (Days)",
              placeholder: "e.g. 30",
              min: 1,
              description: "Maximum booking length in days",
              validation: {
                min: { value: 1, message: "Minimum is 1 day" },
                valueAsNumber: true,
              },
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />

          {/* 6. Cancellation Policy Window */}
          <FormField<SystemSettingsFormValues>
            field={{
              name: "cancellationPolicyWindow",
              type: "number",
              label: "Cancellation Policy Window (Hours)",
              placeholder: "e.g. 24",
              min: 1,
              description: "Hours before pickup allowed for cancellation",
              validation: {
                min: { value: 1, message: "Minimum is 1 hour" },
                valueAsNumber: true,
              },
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />
        </div>
      </div>

      {/* ── Section 2: Subscription plan limits ──────────── */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-[#1F2937] text-base font-semibold font-text leading-6">
            Subscription Plan Limits
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map(({ key, defaultName }) => (
            <div
              key={key}
              className="flex flex-col gap-4 p-4 bg-white border border-[#E5E7EB] rounded-[10px]"
            >
              {/* Plan Name */}
              <FormField<SystemSettingsFormValues>
                field={{
                  name: `plans.${key}.name`,
                  type: "text",
                  label: "Plan Name",
                  placeholder: `e.g. ${defaultName}`,
                  validation: {
                    required: "Plan name is required",
                  },
                }}
                register={register}
                control={control}
                getValues={getValues}
                errors={errors}
              />

              {/* Max Vehicles */}
              <FormField<SystemSettingsFormValues>
                field={{
                  name: `plans.${key}.maxVehicles`,
                  type: "number",
                  label: "Max Vehicles",
                  placeholder: "e.g. 10",
                  min: 1,
                  validation: {
                    min: { value: 1, message: "Must be at least 1" },
                    valueAsNumber: true,
                  },
                }}
                register={register}
                control={control}
                getValues={getValues}
                errors={errors}
              />

              {/* Monthly Price */}
              <FormField<SystemSettingsFormValues>
                field={{
                  name: `plans.${key}.monthlyPrice`,
                  type: "number-dollar",
                  label: "Monthly Price",
                  placeholder: "0.00",
                  min: 0,
                  step: 0.01,
                  validation: {
                    min: { value: 0, message: "Price cannot be negative" },
                    valueAsNumber: true,
                  },
                }}
                register={register}
                control={control}
                getValues={getValues}
                errors={errors}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Save button ───────────────────────────────────── */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="px-14.5 py-3.75 rounded-xs bg-blue-700 hover:bg-blue-900 text-white font-semibold font-text cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
