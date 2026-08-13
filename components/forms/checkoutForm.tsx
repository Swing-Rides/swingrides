"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  Clock,
  User,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  LogIn,
  MapPin,
  Building2,
  Map as MapIcon,
  Hash,
} from "lucide-react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import GuestSignUpForm from "./GuestSignUpForm";

// Reuse MainForm's field renderer + config type + shared validators instead of
// hand-rolling inputs/labels/errors again here. Any UI change to inputs now
// only needs to happen once, in MainForm.tsx.
import { FormField } from "@/components/forms/MainForm";
import { FormFieldConfig } from "@/components/forms/types";
import { validators } from "@/components/forms/form.validators";
import { US_STATES } from "@/constants/addressState";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CheckoutContact = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
};

export type CheckoutItem = {
  id: string;
  vehicleName: string;
  vehicleType: string;
  vehicleGearType: string;
  imageUrl?: string;
  duration: number;
  total: number;
};

export type CheckoutSummary = {
  vehicle: CheckoutItem;
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  total: number;
  currency?: string; // ISO 4217, defaults to 'USD'
  reference?: string; // order/booking reference shown to the user
};

export type CheckoutFormValues = CheckoutContact & {
  paymentIntentId?: string;
};

type CheckoutFormProps = {
  id: string;
  formId?: string;
  user?: CheckoutContact | null;
  imageUrl: string;
  vehicleName: string;
  vehicleType: string;
  vehicleGearType: string;
  duration: string;
  totalPrice: string;
  subTotalFee: string;
  taxPercentageRate: number;
  taxFee: string;
  /** Insurance fee shown in the order summary. Defaults to "$0.00" when not provided. */
  insuranceFee?: number;
  /**
   * The amount that will actually be charged by Stripe (e.g. the price
   * difference on a modification). Shown on the Pay button. When omitted,
   * falls back to totalPrice.
   */
  chargeAmount?: string;
  /** Full new booking total after modification — shown as informational context in the summary. */
  newBookingTotal?: number;
  /** Original booking amount before modification — shown alongside newBookingTotal. */
  originalAmount?: number;
  /** Checkout session length. Defaults to 20 minutes. */
  durationSeconds?: number;
  /** Called once, when the countdown reaches zero. */
  onExpire?: () => void;
  /** Route the user to your login flow (e.g. router.push('/login?next=/checkout')). */
  onLogin?: () => void;
  /** Stripe's client secret for this checkout session (from a PaymentIntent your server already created). */
  clientSecret: string;
  /** Where Stripe redirects for payment methods that require it. */
  returnUrl: string;
  /** Start date of booking */
  startDate?: Date;
  /** End date of booking */
  endDate?: Date;
  /** Checks vehicle availability for the given period. */
  /** Gives the parent a chance to persist contact data before Stripe redirects. */
  onBeforeConfirm?: (values: CheckoutContact) => void | Promise<void>;
  /** Fires after Stripe confirms the payment client-side. The parent owns everything after this — creating the order record, redirecting, etc. */
  onSubmit: (values: CheckoutFormValues) => void | Promise<void>;
  onCancel?: () => void;
  /** Extra error to surface (e.g. the parent's post-payment server call failed). */
  submitError?: string | null;
};

const pad = (n: number) => n.toString().padStart(2, "0");

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutForm(props: CheckoutFormProps) {
  if (!props.id) return <CheckoutFormSkeleton />;
  return <CheckoutFormInner {...props} />;
}

function CheckoutFormInner({
  // id,
  formId = "checkout-form",
  user,
  durationSeconds = 20 * 60,
  onExpire,
  onLogin,
  returnUrl,
  // startDate,
  // endDate,
  onBeforeConfirm,
  onSubmit,
  onCancel,
  submitError,
  imageUrl,
  vehicleName,
  vehicleType,
  vehicleGearType,
  duration,
  totalPrice,
  subTotalFee,
  taxPercentageRate,
  taxFee,
  insuranceFee = 0,
  chargeAmount,
  newBookingTotal,
  originalAmount,
}: CheckoutFormProps) {
  const isLoggedIn = !!user;

  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const emptyContact: CheckoutContact = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
  };

  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm<CheckoutContact>({
    mode: "onTouched",
    defaultValues: user ?? emptyContact,
  });

  // Keep the form in sync if the logged-in user's info arrives/changes after mount
  useEffect(() => {
    if (user) reset(user);
  }, [user, reset]);

  const hasContactInfo = isLoggedIn;

  const handleCancel = () => {
    reset(user ?? emptyContact);
    onCancel?.();
  };

  // ── Contact field configs — same shape MainForm consumes elsewhere, so any
  // styling/behavior change to inputs lives in MainForm.tsx, not here.
  const contactFields: FormFieldConfig[] = useMemo(
    () => [
      {
        name: "firstName",
        type: "text",
        label: "First Name",
        icon: <User className="size-4" />,
        validation: validators.name("First name"),
      },
      {
        name: "lastName",
        type: "text",
        label: "Last Name",
        icon: <User className="size-4" />,
        validation: validators.name("Last name"),
      },
      {
        name: "email",
        type: "email",
        label: "Email Address",
        icon: <Mail className="size-4" />,
        validation: validators.email(),
      },
      {
        name: "phoneNumber",
        type: "tel",
        label: "Phone Number",
        icon: <Phone className="size-4" />,
        validation: validators.phone(),
      },
      {
        name: "streetAddress",
        type: "text",
        label: "Street Address",
        placeholder: "123 Main St",
        icon: <MapPin className="size-4" />,
        validation: validators.required("Street address"),
      },
      {
        name: "city",
        type: "text",
        label: "City",
        icon: <Building2 className="size-4" />,
        validation: validators.required("City"),
      },
      {
        name: "state",
        type: "select",
        options: US_STATES,
        label: "State",
        placeholder: "e.g. CA",
        icon: <MapIcon className="size-4" />,
        validation: validators.required("State"),
      },
      {
        name: "postalCode",
        type: "text",
        label: "Postal Code",
        icon: <Hash className="w-4 h-4" />,
        validation: validators.required("Postal code"),
      },
    ],
    [],
  );

  const getField = (name: string) =>
    contactFields.find((f) => f.name === name)!;

  const onFormSubmit = async (values: CheckoutContact) => {
    if (expired) return;
    if (!stripe || !elements) return;
    setStripeError(null);
    setIsProcessing(true);

    try {
      await onBeforeConfirm?.(values);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
          payment_method_data: {
            billing_details: {
              name: `${values.firstName} ${values.lastName}`.trim(),
              email: values.email,
              phone: values.phoneNumber,
              address: {
                line1: values.streetAddress,
                city: values.city,
                state: values.state,
                postal_code: values.postalCode,
              },
            },
          },
        },
        redirect: "if_required",
      });

      if (error) {
        setStripeError(
          error.message ??
            "Your payment could not be processed. Please check your card details and try again.",
        );
        return;
      }

      await onSubmit({ ...values, paymentIntentId: paymentIntent?.id });
    } finally {
      setIsProcessing(false);
    }
  };

  const isSubmitting = isProcessing;
  const displayError = submitError ?? stripeError;

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-4 w-full max-w-250 mx-auto py-10 px-5"
      noValidate
    >
      <CheckoutCountdown
        durationSeconds={durationSeconds}
        onExpire={() => {
          setExpired(true);
          onExpire?.();
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 items-start">
        {/* ── Left: contact + payment ─────────────────────────── */}
        <div className="order-2 lg:order-1 flex flex-col gap-4 w-full">
          <div className="p-4 rounded-[10px] border border-gray-200 bg-white flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-neutral-950 text-base font-semibold font-text">
                Contact Information
              </span>
              {isLoggedIn ? (
                <span className="text-emerald-500 bg-emerald-50 text-xs font-medium font-text px-2 py-1 rounded-full">
                  Signed in as {user!.email}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onLogin}
                  className="flex items-center gap-1 text-blue-700 text-xs font-medium font-text hover:text-blue-900 transition-colors duration-150"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Already have an account? Log in
                </button>
              )}
            </div>

            {isLoggedIn ? (
              <div className="flex flex-col gap-3 w-full">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    field={getField("firstName")}
                    register={register}
                    control={control}
                    getValues={getValues}
                    errors={errors}
                  />
                  <FormField
                    field={getField("lastName")}
                    register={register}
                    control={control}
                    getValues={getValues}
                    errors={errors}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    field={getField("email")}
                    register={register}
                    control={control}
                    getValues={getValues}
                    errors={errors}
                  />
                  <FormField
                    field={getField("phoneNumber")}
                    register={register}
                    control={control}
                    getValues={getValues}
                    errors={errors}
                  />
                </div>

                <FormField
                  field={getField("streetAddress")}
                  register={register}
                  control={control}
                  getValues={getValues}
                  errors={errors}
                />

                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    field={getField("city")}
                    register={register}
                    control={control}
                    getValues={getValues}
                    errors={errors}
                  />
                  <FormField
                    field={getField("state")}
                    register={register}
                    control={control}
                    getValues={getValues}
                    errors={errors}
                  />
                  <FormField
                    field={getField("postalCode")}
                    register={register}
                    control={control}
                    getValues={getValues}
                    errors={errors}
                  />
                </div>
              </div>
            ) : (
              //TO DO
              //Create a new sign form here
              <GuestSignUpForm />
            )}
          </div>

          {/* Payment */}
          <div className="p-4 rounded-[10px] border border-gray-200 bg-white flex flex-col gap-4 w-full">
            <span className="flex items-center gap-2 text-neutral-950 text-base font-semibold font-text">
              <Lock className="w-4 h-4 text-[#6B7280]" />
              Payment Details
            </span>

            <PaymentElement
              options={{
                fields: {
                  billingDetails: {
                    name: "never",
                    email: "never",
                    phone: "never",
                  },
                },
              }}
            />

            <div className="flex items-center gap-2 text-[#6B7280]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="text-xs font-normal font-text">
                Payments are processed securely by Stripe. We never see or store
                your card details.
              </span>
            </div>

            {displayError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-md text-red-600">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium font-text">
                  {displayError}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-2 border-red-500 text-red-500 hover:text-white hover:bg-red-700 rounded-xs font-medium font-text cursor-pointer transition-colors duration-300"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !hasContactInfo ||
                !stripe ||
                !elements ||
                expired
                // !vehicleAvailable
              }
              className="flex-1 px-6 py-2 border-blue-500 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text hover:bg-blue-900 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Processing payment...
                </span>
              ) : chargeAmount !== undefined ? (
                `Pay $${Number(chargeAmount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              ) : (
                `Pay ${totalPrice}`
              )}
            </Button>
          </div>
        </div>

        {/* ── Right: order summary ────────────────────────────── */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-22 p-4 rounded-[10px] border border-gray-200 bg-white flex flex-col gap-5 w-full">
          <h2 className="text-neutral-950 text-base font-semibold font-text">
            Order Summary
          </h2>

          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center gap-3 w-full">
              <div className="relative size-12 rounded-md overflow-clip shrink-0 bg-[#F3F4F6]">
                <Image
                  src={imageUrl || "/images/swingrides-default-img.webp"}
                  alt={vehicleName}
                  width={240}
                  height={160}
                  className="aspect-48/32 w-full object-cover object-center"
                />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[#1F2937] text-sm font-semibold font-text truncate">
                  {vehicleName}
                </span>
                <span className="text-[#1F2937] text-sm font-normal font-text truncate">
                  {vehicleType} - {vehicleGearType}
                </span>
              </div>
              <span className="text-[#1F2937] text-sm font-medium font-text shrink-0">
                {duration} days
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2 w-full">
            <SummaryRow
              label={newBookingTotal ? "Additional Days Fee" : "Subtotal"}
              value={subTotalFee}
            />
            {insuranceFee !== undefined && insuranceFee > 0 && (
              <SummaryRow label="Insurance Fee" value={insuranceFee} />
            )}
            <SummaryRow
              label={
                taxPercentageRate && Number(taxPercentageRate) > 0
                  ? `Tax (${taxPercentageRate}%)`
                  : "Tax"
              }
              value={taxFee}
            />
          </div>

          <Separator />

          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-gray-800 text-base font-bold font-text leading-6">
                {newBookingTotal ? "Amount Due" : "Total Amount"}
              </span>
              <span className="text-blue-700 text-xl font-medium font-text leading-7">
                {chargeAmount
                  ? `$${Number(chargeAmount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : `$${Number(totalPrice).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
              </span>
            </div>
            {newBookingTotal && originalAmount !== undefined && (
              <div className="flex flex-col gap-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Original booking total</span>
                  <span>
                    $
                    {originalAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-gray-700">
                  <span>New booking total</span>
                  <span>
                    $
                    {newBookingTotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────────────

const CheckoutCountdown = ({
  durationSeconds,
  onExpire,
}: {
  durationSeconds: number;
  onExpire?: () => void;
}) => {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!hasExpiredRef.current) {
        hasExpiredRef.current = true;
        onExpire?.();
      }
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(Math.max(secondsLeft, 0) / 60);
  const seconds = Math.max(secondsLeft, 0) % 60;
  const isCritical = secondsLeft <= 60;
  const isWarning = secondsLeft > 60 && secondsLeft <= 300;

  return (
    <div
      className={cn(
        "sticky top-0 z-20 flex items-center justify-center gap-2 py-2 px-4 rounded-[10px] border text-sm font-medium font-text",
        isCritical
          ? "bg-red-50 border-red-200 text-red-700"
          : isWarning
            ? "bg-amber-50 border-amber-200 text-amber-700"
            : "bg-indigo-50 border-indigo-100 text-indigo-700",
      )}
    >
      <Clock className="w-4 h-4 shrink-0" />
      {secondsLeft > 0 ? (
        <span>
          Your checkout session expires in{" "}
          <strong className="tabular-nums">
            {pad(minutes)}:{pad(seconds)}
          </strong>
        </span>
      ) : (
        <span>
          Your checkout session has expired. Please refresh to start over.
        </span>
      )}
    </div>
  );
};

// ─── Order summary row ─────────────────────────────────────────────────────────

const SummaryRow = ({ label, value }: { label: string; value: string | number }) => {
  const formatDisplayValue = (val: string | number) => {
    if (val === undefined || val === null || val === "") return "$0.00";
    const strVal = String(val);
    const cleaned = strVal.replace(/[^0-9.-]/g, "");
    const num = parseFloat(cleaned);
    if (!isNaN(num)) {
      return `$${num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return strVal;
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[#6B7280] text-sm font-normal font-text">
        {label}
      </span>
      <span className="text-[#1F2937] text-sm font-medium font-text text-right">
        {formatDisplayValue(value)}
      </span>
    </div>
  );
};

// ─── Skeleton (shown while the parent is still fetching the order summary) ────

const CheckoutFormSkeleton = () => (
  <div className="flex flex-col gap-4 w-full">
    <Skeleton className="h-9 w-full rounded-[10px]" />
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
      <div className="order-2 lg:order-1 flex flex-col gap-4">
        <div className="p-4 rounded-[10px] border border-gray-200 flex flex-col gap-5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="p-4 rounded-[10px] border border-gray-200 flex flex-col gap-5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
      <div className="order-1 lg:order-2 p-4 rounded-[10px] border border-gray-200 flex flex-col gap-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  </div>
);
