"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { Shield, AlertTriangle } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import {
  type PriceConfig,
  computePricing,
  computeInsuranceFee,
  computeTotal,
  formatCurrency,
  pluralize,
} from "@/lib/pricing";
import {
  TextInput,
  DateInput,
  DateTimeInput,
  CheckboxInput,
  LoadingSpinner,
} from "./MainForm";
import { validators } from "@/components/forms/form.validators";
import { FormRow, FieldError, DEFAULT_TAX_RATE } from "../helpers/browseCarPaymentSection.helpers";

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
  /** Host's own insurance details — used in place of user-entered values
   * whenever the user opts to use the host's coverage. */
  hostInsuranceProvider?: string;
  hostInsurancePolicyNumber?: string;
  hostInsuranceExpiry?: string | Date;
};

const THIRTY_DAYS_FROM_NOW = addDays(new Date(), 30);

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
    hostInsuranceProvider,
    hostInsurancePolicyNumber,
    hostInsuranceExpiry,
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
          differenceInCalendarDays(new Date(returnDate), new Date(pickupDate)),
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

      // When the user is using the host's coverage, the host's insurance
      // details are the source of truth — send those instead of whatever
      // (if anything) is sitting in the form fields.
      const insuranceValues = effectiveHostCoverage
        ? {
          insuranceProvider: hostInsuranceProvider ?? "",
          policyNumber: hostInsurancePolicyNumber ?? "",
          insuranceExpiry: hostInsuranceExpiry
            ? typeof hostInsuranceExpiry === "string"
              ? hostInsuranceExpiry
              : hostInsuranceExpiry.toISOString()
            : "",
        }
        : {
          insuranceProvider: values.insuranceProvider,
          policyNumber: values.policyNumber,
          insuranceExpiry: values.insuranceExpiry,
        };

      // Sync effectiveHostCoverage back into the payload before sending
      await onSubmit({
        ...values,
        ...insuranceValues,
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
                <DateTimeInput
                  field={{
                    name: "pickupDate",
                    type: "datetime",
                    placeholder: "Pick a date & time",
                    minDate: today,
                    validation: { required: "Pick-up date is required" },
                  }}
                  control={control}
                  error={errors.pickupDate?.message}
                />
              </FormRow>

              <FormRow
                label="Return Date & Time"
                htmlFor="returnDate"
                error={errors.returnDate?.message}
              >
                <DateTimeInput
                  field={{
                    name: "returnDate",
                    type: "datetime",
                    placeholder: "Pick a date & time",
                    minDate: pickupDate ? addDays(new Date(pickupDate), 1) : today,
                    validation: {
                      required: "Return date is required",
                      validate: (value: string) => {
                        if (!pickupDate || !value) return true;
                        return (
                          new Date(value) > new Date(pickupDate) ||
                          "Must be after pick-up date"
                        );
                      },
                    },
                  }}
                  control={control}
                  error={errors.returnDate?.message}
                />
              </FormRow>
            </div>

            {/* Row 2: Address */}
            <FormRow
              label="Street Address"
              htmlFor="street"
              error={errors.street?.message}
            >
              <TextInput
                field={{
                  name: "street",
                  type: "text",
                  placeholder: "123 Main St",
                  validation: validators.required("Street address"),
                }}
                register={register}
                error={errors.street?.message}
              />
            </FormRow>

            <div className="grid lg:grid-cols-6 gap-3">
              <div className="col-span-1 lg:col-span-2">
                <FormRow
                  label="City"
                  htmlFor="city"
                  error={errors.city?.message}
                >
                  <TextInput
                    field={{
                      name: "city",
                      type: "text",
                      placeholder: "Address city",
                      validation: validators.required("city"),
                    }}
                    register={register}
                    error={errors.city?.message}
                  />
                </FormRow>
              </div>

              <div className="col-span-1 lg:col-span-2">
                <FormRow
                  label="State"
                  htmlFor="state"
                  error={errors.state?.message}
                >
                  <TextInput
                    field={{
                      name: "state",
                      type: "text",
                      placeholder: "Address state",
                      validation: validators.required("state"),
                    }}
                    register={register}
                    error={errors.state?.message}
                  />
                </FormRow>
              </div>

              <div className="col-span-1 lg:col-span-2">
                <FormRow
                  label="Zip Code"
                  htmlFor="zipCode"
                  error={errors.zipCode?.message}
                >
                  <TextInput
                    field={{
                      name: "zipCode",
                      type: "text",
                      placeholder: "Address zipCode",
                      validation: validators.required("zipCode"),
                    }}
                    register={register}
                    error={errors.zipCode?.message}
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
          <div className="flex flex-col gap-1.5">
            <CheckboxInput
              field={{
                name: "agreedToTerms",
                type: "checkbox",
                defaultValue: true,
                label: (
                  <>
                    I agree to the{" "}
                    <Link
                      href="/legal/terms-and-conditions-of-use"
                      className="text-blue-700 hover:text-blue-950 duration-300 transition-colors underline"
                      target="_blank"
                      title="terms and conditions link"
                    >
                      terms and conditions
                    </Link>
                  </>
                ),
                validation: {
                  validate: (value: boolean) =>
                    value === true ||
                    "You must agree to the terms and conditions",
                },
              }}
              control={control}
              error={errors.agreedToTerms?.message as string}
            />
            {errors.agreedToTerms && (
              <FieldError message={errors.agreedToTerms.message as string} />
            )}
          </div>

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
              <TextInput
                field={{
                  name: "insuranceProvider",
                  type: "text",
                  placeholder: "e.g. Progressive, Geico, State Farm",
                  validation: { onChange: handleInsuranceChange },
                }}
                register={register}
                error={errors.insuranceProvider?.message}
              />
            </FormRow>

            {/* Policy Number */}
            <FormRow
              label="Policy Number"
              htmlFor="policyNumber"
              error={errors.policyNumber?.message}
            >
              <TextInput
                field={{
                  name: "policyNumber",
                  type: "text",
                  placeholder: "e.g. PLY-123456789",
                  validation: {
                    onChange: handleInsuranceChange,
                    validate: (value: string) => {
                      // If provider is filled, policy number becomes required
                      if (insuranceProvider && !value) {
                        return "Policy number is required when provider is entered";
                      }
                      return true;
                    },
                  },
                }}
                register={register}
                error={errors.policyNumber?.message}
              />
            </FormRow>

            {/* Expiry Date — date only, time isn't relevant here */}
            <FormRow
              label="Expiry Date"
              htmlFor="insuranceExpiry"
              error={errors.insuranceExpiry?.message}
            >
              <DateInput
                field={{
                  name: "insuranceExpiry",
                  type: "date",
                  placeholder: "Pick expiry date",
                  // Only dates more than 30 days from now are valid
                  minDate: THIRTY_DAYS_FROM_NOW,
                  validation: {
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
                  },
                }}
                control={control}
                error={errors.insuranceExpiry?.message}
              />
            </FormRow>

            {/* Host providing coverage checkbox — checked state is derived
                (effectiveHostCoverage), not the raw field value, and it
                self-disables once insurance details are entered, so it
                uses CheckboxInput's checked/onCheckedChange overrides */}
            <CheckboxInput
              field={{
                name: "hostProvidingCoverage",
                type: "checkbox",
                disabled: hasInsuranceInput,
                label: (
                  <>
                    Host is providing coverage
                    {insuranceFeePerDay > 0 && (
                      <span className="text-[#9CA3AF] font-normal">
                        {" "}
                        ({formatCurrency(insuranceFeePerDay)}/day)
                      </span>
                    )}
                  </>
                ),
              }}
              control={control}
              checked={effectiveHostCoverage}
              onCheckedChange={(checked) => {
                if (hasInsuranceInput) return;
                setValue("hostProvidingCoverage", checked, {
                  shouldValidate: false,
                });
              }}
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
              <LoadingSpinner />
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