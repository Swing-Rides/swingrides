"use client";

import { memo, useMemo, useState } from "react";
import Link from "next/link";
import { format, addDays, differenceInCalendarDays } from "date-fns";
import { Shield, CalendarIcon, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  type PriceConfig,
  computePricing,
  computeInsuranceFee,
  computeTotal,
  formatCurrency,
  pluralize,
} from "@/lib/pricing";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentFormValues = {
  pickupDate: string;
  returnDate: string;
  // Address — split out for structured validation / downstream use
  street: string;
  city: string;
  state: string;
  zipCode: string;
  // Insurance — all optional but cross-validated
  insuranceProvider: string;
  policyNumber: string;
  insuranceExpiry: string;
  hostProvidingCoverage: boolean;
  // Terms
  agreedToTerms: boolean;
  subtotal?: number;
  insuranceFee?: number;
  tax?: number;
  taxRate?: number;
  totalAmount?: number;
  totalDays?: number;
};

type PaymentSectionProps = {
  price: PriceConfig;
  /** Flat per-day insurance fee, only charged when the host provides coverage. */
  insuranceFeePerDay: number;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  vehicleId?: string;
  onSubmit: (values: PaymentFormValues) => void | Promise<void>;
};

const THIRTY_DAYS_FROM_NOW = addDays(new Date(), 30);
const DEFAULT_TAX_RATE = 0.08;

// ─── Component ────────────────────────────────────────────────────────────────

export const PaymentSection = memo(
  ({
    price,
    insuranceFeePerDay,
    street,
    city,
    state,
    zipCode,
    onSubmit,
  }: PaymentSectionProps) => {
    const today = useMemo(() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    }, []);

    const {
      register,
      handleSubmit,
      control,
      setValue,
      formState: { errors, isSubmitting },
    } = useForm<PaymentFormValues>({
      mode: "onTouched",
      defaultValues: {
        pickupDate: "",
        returnDate: "",
        street: street ?? "",
        city: city ?? "",
        state: state ?? "",
        zipCode: zipCode ?? "",
        insuranceProvider: "",
        policyNumber: "",
        insuranceExpiry: "",
        hostProvidingCoverage: true,
        agreedToTerms: true,
      },
    });

    // Live reactive values for UI derivation — no useEffect
    const pickupDate = useWatch({ control, name: "pickupDate" });
    const returnDate = useWatch({ control, name: "returnDate" });
    const insuranceProvider = useWatch({ control, name: "insuranceProvider" });
    const policyNumber = useWatch({ control, name: "policyNumber" });
    const insuranceExpiry = useWatch({ control, name: "insuranceExpiry" });
    const hostProvidingCoverage = useWatch({
      control,
      name: "hostProvidingCoverage",
    });

    // Whether the user has started filling insurance fields
    const hasInsuranceInput = !!(
      insuranceProvider ||
      policyNumber ||
      insuranceExpiry
    );
    // If they've entered insurance, unmark host coverage automatically
    const effectiveHostCoverage = hasInsuranceInput
      ? false
      : hostProvidingCoverage;

    // Keep the checkbox in sync when insurance is filled in
    const handleInsuranceChange = () => {
      if (hasInsuranceInput && hostProvidingCoverage) {
        setValue("hostProvidingCoverage", false, { shouldValidate: false });
      }
    };

    // ─ Derived pricing ──────────────────────────────────────────────
    const days =
      pickupDate && returnDate
        ? Math.max(
          differenceInCalendarDays(
            new Date(returnDate),
            new Date(pickupDate),
          ),
          0,
        )
        : 0;

    const pricing = days > 0 ? computePricing(price, days) : null;

    // Insurance is always billed per-day, regardless of rental tier, and
    // only when the host is providing coverage.
    const insuranceFee = computeInsuranceFee(
      days,
      insuranceFeePerDay,
      effectiveHostCoverage,
    );

    const totalBreakdown = pricing
      ? computeTotal(pricing.total, insuranceFee, DEFAULT_TAX_RATE)
      : null;

    const enteredPickUpDate = pickupDate
      ? format(new Date(pickupDate), "MMM d, h:mm a")
      : null;
    const enteredReturnDate = returnDate
      ? format(new Date(returnDate), "MMM d, h:mm a")
      : null;

    const onFormSubmit = async (values: PaymentFormValues) => {
      const breakdown = pricing
        ? computeTotal(pricing.total, insuranceFee, DEFAULT_TAX_RATE)
        : computeTotal(0, 0, DEFAULT_TAX_RATE);

      // Sync effectiveHostCoverage back into the payload before sending
      await onSubmit({
        ...values,
        hostProvidingCoverage: effectiveHostCoverage,
        subtotal: breakdown.subtotal,
        insuranceFee: breakdown.insuranceFee,
        tax: breakdown.tax,
        taxRate: DEFAULT_TAX_RATE,
        totalAmount: breakdown.totalAmount,
        totalDays: days,
      });
    };

    return (
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-6"
        noValidate
      >
        {/* ── Main booking card ───────────────────────────── */}
        <div className="flex flex-col gap-5 p-4 md:p-6 rounded-[10px] border border-gray-200 bg-white">
          {/* Price display */}
          <div className="flex flex-col gap-2">
            <div>
              <span className="text-blue-700 text-3xl font-medium font-text leading-12">
                {formatCurrency(pricing?.displayPrice ?? price.daily)}
              </span>
              <span className="text-gray-500 text-base font-normal font-text leading-6">
                /{pricing?.displayPriceTier ?? "day"}
              </span>
            </div>
            {pricing && (
              <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
                Total: {formatCurrency(pricing.total)} for{" "}
                {pluralize(days, "day")}
              </span>
            )}
          </div>

          {/* ── Form fields ─────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Row 1: Pickup + Return dates */}
            <div className="grid lg:grid-cols-2 gap-3">
              <FormRow
                label="Pick-up Date & Time"
                htmlFor="pickupDate"
                error={errors.pickupDate?.message}
              >
                <DateTimePickerField
                  name="pickupDate"
                  control={control}
                  placeholder="Pick a date & time"
                  error={errors.pickupDate?.message}
                  rules={{ required: "Pick-up date is required" }}
                  minDate={today}
                />
              </FormRow>

              <FormRow
                label="Return Date & Time"
                htmlFor="returnDate"
                error={errors.returnDate?.message}
              >
                <DateTimePickerField
                  name="returnDate"
                  control={control}
                  placeholder="Pick a date & time"
                  error={errors.returnDate?.message}
                  minDate={
                    pickupDate ? addDays(new Date(pickupDate), 1) : today
                  }
                  rules={{
                    required: "Return date is required",
                    validate: (value: string) => {
                      if (!pickupDate || !value) return true;
                      return (
                        new Date(value) > new Date(pickupDate) ||
                        "Must be after pick-up date"
                      );
                    },
                  }}
                />
              </FormRow>
            </div>

            {/* Row 2: Address */}
            <FormRow
              label="Street Address"
              htmlFor="street"
              error={errors.street?.message}
            >
              <Input
                id="street"
                type="text"
                placeholder="123 Main St"
                className={inputCn(!!errors.street)}
                {...register("street", {
                  required: "Street address is required",
                })}
              />
            </FormRow>

            <div className="grid lg:grid-cols-6 gap-3">
              <div className="col-span-1 lg:col-span-2">
                <FormRow
                  label="City"
                  htmlFor="city"
                  error={errors.city?.message}
                >
                  <Input
                    id="city"
                    type="text"
                    placeholder="City"
                    className={inputCn(!!errors.city)}
                    {...register("city", { required: "City is required" })}
                  />
                </FormRow>
              </div>

              <div className="col-span-1 lg:col-span-2">
                <FormRow
                  label="State"
                  htmlFor="state"
                  error={errors.state?.message}
                >
                  <Input
                    id="state"
                    type="text"
                    placeholder="California"
                    className={cn(inputCn(!!errors.state))}
                    {...register("state", {
                      required: "Pick up state is required",
                    })}
                  />
                </FormRow>
              </div>

              <div className="col-span-1 lg:col-span-2">
                <FormRow
                  label="Zip Code"
                  htmlFor="zipCode"
                  error={errors.zipCode?.message}
                >
                  <Input
                    id="zipCode"
                    type="text"
                    inputMode="numeric"
                    placeholder="94103"
                    maxLength={10}
                    className={inputCn(!!errors.zipCode)}
                    {...register("zipCode", {
                      required: "Zip code is required",
                      pattern: {
                        value: /^\d{5}(-\d{4})?$/,
                        message: "Invalid zip code",
                      },
                    })}
                  />
                </FormRow>
              </div>
            </div>
          </div>

          {/* Date range summary pill */}
          {enteredPickUpDate && enteredReturnDate && days > 0 && (
            <div className="bg-[#EBF0FB] rounded-[10px] p-2.5 md:p-3">
              <span className="text-blue-700 text-sm font-medium font-text leading-5">
                {pluralize(days, "day")}
              </span>{" "}
              <span className="text-blue-700 text-sm font-medium font-text leading-5">
                · {enteredPickUpDate} - {enteredReturnDate}
              </span>
            </div>
          )}

          {/* Price breakdown — one row per billing unit */}
          {pricing && (
            <div className="flex flex-col gap-2 pb-6.25 border-b border-b-[#E5E7EB]">
              {pricing.lineItems.map((item, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <span className="text-[#6B7280] text-sm font-normal font-text leading-5">
                    {item.label}
                  </span>
                  <span className="text-[#1F2937] text-sm font-medium font-text">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              ))}

              {/* Insurance fee — always per-day, only shown when charged */}
              {insuranceFee > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="text-[#6B7280] text-sm font-normal font-text leading-5">
                    Insurance · {pluralize(days, "day")} @{" "}
                    {formatCurrency(insuranceFeePerDay)}/day
                  </span>
                  <span className="text-[#1F2937] text-sm font-medium font-text">
                    {formatCurrency(insuranceFee)}
                  </span>
                </div>
              )}

              {totalBreakdown && (
                <div className="flex justify-between gap-4">
                  <span className="text-[#6B7280] text-sm font-normal font-text leading-5">
                    Tax ({(DEFAULT_TAX_RATE * 100).toFixed(0)}%)
                  </span>
                  <span className="text-[#1F2937] text-sm font-medium font-text">
                    {formatCurrency(totalBreakdown.tax)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Total estimate */}
          <div className="flex justify-between items-center">
            <span className="text-[#0B0B0B] text-base font-bold font-text leading-6">
              Total Estimate
            </span>
            <span className="text-blue-700 text-xl font-medium font-text leading-7">
              {totalBreakdown ? formatCurrency(totalBreakdown.totalAmount) : "—"}
            </span>
          </div>

          {/* Terms checkbox */}
          <Controller
            name="agreedToTerms"
            control={control}
            rules={{
              validate: (value) =>
                value === true || "You must agree to the terms and conditions",
            }}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="agreedToTerms"
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    className={cn(
                      "data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700",
                      errors.agreedToTerms
                        ? "border-red-500"
                        : "border-[#E5E7EB]",
                    )}
                  />
                  <label
                    htmlFor="agreedToTerms"
                    className="text-gray-800 text-xs font-medium font-text leading-5 cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link
                      href="/legal/terms-and-conditions-of-use"
                      className="text-blue-700 hover:text-blue-950 duration-300 transition-colors underline"
                      target="_blank"
                      title="terms and conditions link"
                    >
                      terms and conditions
                    </Link>
                  </label>
                </div>
                {errors.agreedToTerms && (
                  <FieldError
                    message={errors.agreedToTerms.message as string}
                  />
                )}
              </div>
            )}
          />

          {/* Security notice */}
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-gray-500" />
            <span className="text-[#6B7280] text-xs font-normal font-text leading-4">
              Your booking is secure. Documents verified before confirmation.
            </span>
          </div>
        </div>

        {/* ── Insurance card ──────────────────────────────── */}
        <div className="flex flex-col gap-5 p-4 md:p-6 rounded-[10px] border border-gray-200 bg-white">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-neutral-950 text-base font-semibold font-text leading-6">
              Insurance Details
            </h4>
            <span className="block py-0.5 px-3 rounded-full bg-amber-100 text-amber-500 text-xs font-semibold">
              OPTIONAL
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {/* Insurance Provider */}
            <FormRow
              label="Insurance Provider"
              htmlFor="insuranceProvider"
              error={errors.insuranceProvider?.message}
            >
              <Input
                id="insuranceProvider"
                type="text"
                placeholder="e.g. Progressive, Geico, State Farm"
                className={inputCn(!!errors.insuranceProvider)}
                {...register("insuranceProvider", {
                  onChange: handleInsuranceChange,
                })}
              />
            </FormRow>

            {/* Policy Number */}
            <FormRow
              label="Policy Number"
              htmlFor="policyNumber"
              error={errors.policyNumber?.message}
            >
              <Input
                id="policyNumber"
                type="text"
                placeholder="e.g. PLY-123456789"
                className={inputCn(!!errors.policyNumber)}
                {...register("policyNumber", {
                  onChange: handleInsuranceChange,
                  validate: (value) => {
                    // If provider is filled, policy number becomes required
                    if (insuranceProvider && !value) {
                      return "Policy number is required when provider is entered";
                    }
                    return true;
                  },
                })}
              />
            </FormRow>

            {/* Expiry Date — date only, time isn't relevant here */}
            <FormRow
              label="Expiry Date"
              htmlFor="insuranceExpiry"
              error={errors.insuranceExpiry?.message}
            >
              <DateTimePickerField
                name="insuranceExpiry"
                control={control}
                placeholder="Pick expiry date"
                error={errors.insuranceExpiry?.message}
                showTime={false}
                // Only dates more than 30 days from now are valid
                minDate={THIRTY_DAYS_FROM_NOW}
                rules={{
                  validate: (value: string) => {
                    // Required if either provider or policy number is filled
                    if ((insuranceProvider || policyNumber) && !value) {
                      return "Expiry date is required with insurance details";
                    }
                    if (!value) return true;
                    const expiry = new Date(value);
                    if (expiry <= THIRTY_DAYS_FROM_NOW) {
                      return "Expiry date must be more than 30 days from today";
                    }
                    return true;
                  },
                }}
              />
            </FormRow>

            {/* Host providing coverage checkbox */}
            <Controller
              name="hostProvidingCoverage"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hostProvidingCoverage"
                    checked={effectiveHostCoverage}
                    disabled={hasInsuranceInput}
                    onCheckedChange={(checked) => {
                      // Block re-checking when insurance fields are filled
                      if (hasInsuranceInput) return;
                      field.onChange(!!checked);
                    }}
                    className={cn(
                      "data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700",
                      hasInsuranceInput
                        ? "opacity-50 cursor-not-allowed"
                        : "border-[#E5E7EB]",
                    )}
                  />
                  <label
                    htmlFor="hostProvidingCoverage"
                    className={cn(
                      "text-sm font-medium font-text cursor-pointer select-none",
                      hasInsuranceInput
                        ? "text-[#9CA3AF] cursor-not-allowed"
                        : "text-[#1F2937]",
                    )}
                  >
                    Host is providing coverage
                    {insuranceFeePerDay > 0 && (
                      <span className="text-[#9CA3AF] font-normal">
                        {" "}
                        ({formatCurrency(insuranceFeePerDay)}/day)
                      </span>
                    )}
                  </label>
                </div>
              )}
            />

            {hasInsuranceInput && (
              <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-md text-amber-600">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-xs font-medium font-text leading-4">
                  Your own insurance will be used. Host coverage has been
                  deselected.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Submit ──────────────────────────────────────── */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-text text-white px-10 py-3 bg-blue-700 rounded-xs cursor-pointer hover:bg-blue-900 duration-300 transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Processing...
            </>
          ) : (
            "Proceed to Payment"
          )}
        </button>
      </form>
    );
  },
);
PaymentSection.displayName = "PaymentSection";

// ─── Date + time picker field ──────────────────────────────────────────────────

type DateTimePickerFieldProps = {
  name: keyof PaymentFormValues;
  control: ReturnType<typeof useForm<PaymentFormValues>>["control"];
  placeholder?: string;
  error?: string;
  minDate?: Date;
  rules?: object;
  /** Show the hour/minute/AM-PM row below the calendar. Defaults to true. */
  showTime?: boolean;
};

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1); // 1‑12
const MINUTE_OPTIONS = ["00", "15", "30", "45"];

/** Combine a calendar date with a 12h clock time, returns a new Date. */
const applyTime = (
  date: Date,
  hour12: number,
  minute: number,
  period: "AM" | "PM",
) => {
  const hour24 =
    period === "PM" ? (hour12 % 12) + 12 : hour12 % 12;
  const merged = new Date(date);
  merged.setHours(hour24, minute, 0, 0);
  return merged;
};

/**
 * Two-step popover: pick a date, then hit "Next" to move to the time step
 * (skipped when showTime is false). "Done" closes the popover once a full
 * value is set. This avoids cramming the calendar + 3 selects into one view
 * and gives a clearer sense of progress.
 */
const DateTimePickerField = ({
  name,
  control,
  placeholder,
  error,
  minDate,
  rules,
  showTime = true,
}: DateTimePickerFieldProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"date" | "time">("date");

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        const parsed = field.value
          ? new Date(field.value as string)
          : undefined;

        // Current time components, derived from the stored value (default noon)
        const hour24 = parsed ? parsed.getHours() : 12;
        const currentHour12 = ((hour24 + 11) % 12) + 1;
        const currentMinute = parsed ? parsed.getMinutes() : 0;
        const currentPeriod: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";

        const handleDateSelect = (date: Date | undefined) => {
          if (!date) {
            field.onChange("");
            return;
          }
          // Preserve whatever time was already set (or default to noon)
          const merged = showTime
            ? applyTime(date, currentHour12, currentMinute, currentPeriod)
            : date;
          field.onChange(merged.toISOString());
        };

        const handleTimeChange = (
          newHour12: number,
          newMinute: number,
          newPeriod: "AM" | "PM",
        ) => {
          if (!parsed) return;
          const merged = applyTime(parsed, newHour12, newMinute, newPeriod);
          field.onChange(merged.toISOString());
        };

        const handleOpenChange = (next: boolean) => {
          setOpen(next);
          if (next) setStep("date"); // always start from the date step
        };

        const handleNext = () => {
          if (!parsed) return;
          setStep("time");
        };

        const handleDone = () => setOpen(false);

        return (
          <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-xs font-text text-sm",
                  !parsed && "text-[#9CA3AF]",
                  error
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-[#E5E7EB] focus-visible:ring-blue-700",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[#9CA3AF] shrink-0" />
                {parsed
                  ? format(
                    parsed,
                    showTime ? "MMM d, yyyy · h:mm a" : "MMM d, yyyy",
                  )
                  : (placeholder ?? "Pick a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {(!showTime || step === "date") && (
                <Calendar
                  mode="single"
                  selected={parsed}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    if (minDate) {
                      return (
                        date < new Date(new Date(minDate).setHours(0, 0, 0, 0))
                      );
                    }
                    return false;
                  }}
                />
              )}

              {showTime && step === "time" && (
                <div className="flex items-center gap-2 p-3">
                  <Clock className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                  <select
                    aria-label="Hour"
                    disabled={!parsed}
                    value={currentHour12}
                    onChange={(e) =>
                      handleTimeChange(
                        Number(e.target.value),
                        currentMinute,
                        currentPeriod,
                      )
                    }
                    className="rounded-xs border border-[#E5E7EB] font-text text-sm text-[#1F2937] px-1.5 py-1 disabled:opacity-50"
                  >
                    {HOURS_12.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-[#9CA3AF]">:</span>
                  <select
                    aria-label="Minute"
                    disabled={!parsed}
                    value={currentMinute.toString().padStart(2, "0")}
                    onChange={(e) =>
                      handleTimeChange(
                        currentHour12,
                        Number(e.target.value),
                        currentPeriod,
                      )
                    }
                    className="rounded-xs border border-[#E5E7EB] font-text text-sm text-[#1F2937] px-1.5 py-1 disabled:opacity-50"
                  >
                    {MINUTE_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="AM or PM"
                    disabled={!parsed}
                    value={currentPeriod}
                    onChange={(e) =>
                      handleTimeChange(
                        currentHour12,
                        currentMinute,
                        e.target.value as "AM" | "PM",
                      )
                    }
                    className="rounded-xs border border-[#E5E7EB] font-text text-sm text-[#1F2937] px-1.5 py-1 disabled:opacity-50"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              )}

              {/* Footer nav — Next moves to the time step, Done closes the popover */}
              <div className="flex items-center justify-between gap-2 p-2 border-t border-[#E5E7EB]">
                {showTime && step === "time" ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setStep("date")}
                  >
                    Back
                  </Button>
                ) : (
                  <span />
                )}

                {showTime && step === "date" ? (
                  <Button
                    type="button"
                    size="sm"
                    disabled={!parsed}
                    className="text-xs bg-blue-700 hover:bg-blue-900"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    disabled={!parsed}
                    className="text-xs bg-blue-700 hover:bg-blue-900"
                    onClick={handleDone}
                  >
                    Done
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
};

// ─── Shared bits ──────────────────────────────────────────────────────────────

type FormRowProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
};

const FormRow = ({ label, htmlFor, error, children }: FormRowProps) => (
  <div className="flex flex-col gap-1.5">
    <Label
      htmlFor={htmlFor}
      className="text-[#1F2937] text-xs font-semibold font-text uppercase"
    >
      {label}
    </Label>
    {children}
    {error && <FieldError message={error} />}
  </div>
);

const FieldError = ({ message }: { message: string }) => (
  <span className="text-red-500 text-xs font-normal font-text flex items-center gap-1">
    <AlertTriangle className="w-3 h-3 shrink-0" />
    {message}
  </span>
);

const inputCn = (hasError: boolean) =>
  cn(
    "rounded-xs border-[#E5E7EB] focus-visible:ring-blue-700 font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] w-full",
    hasError && "border-red-500 focus-visible:ring-red-500",
  );