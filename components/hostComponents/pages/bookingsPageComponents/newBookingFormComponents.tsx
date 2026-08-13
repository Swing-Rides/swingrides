"use client";

import { useMemo, use } from "react";
import { format } from "date-fns";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  computePricing as computeSharedPricing,
  computeInsuranceFee,
} from "@/lib/pricing";

// ─── Types ────────────────────────────────────────────────────────────────────

export type VehicleOption = {
  id: string;
  name: string;
  imageUrl: string;
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  insuranceDailyRate: number;
  streetAddress?: string;
  pickupCity?: string;
  pickupState?: string;
  postalCode?: string;
};

export type TaxResult = {
  amount: number;
  rate: number;
};

export type PricingLineItem = {
  label: string;
  total: number;
};

export type PricingBreakdown = {
  durationLabel: string;
  displayPriceTier: "day" | "week" | "month";
  baseLineItems: PricingLineItem[];
  baseTotal: number;
  insuranceFee: number;
  subtotal: number;
};

// ─── Pricing helpers ───────────────────────────────────────────────────────────

export const pluralize = (count: number, noun: string) =>
  `${count} ${noun}${count !== 1 ? "s" : ""}`;

/**
 * Wraps the shared mixed-unit billing helper (month → week → day cascade)
 * and reshapes it into the label/line-item format this form's summary
 * panel renders.
 */
export const computePricing = (
  vehicle: VehicleOption,
  days: number,
  hostProvidesInsurance: boolean,
): PricingBreakdown => {
  const {
    lineItems,
    total: baseTotal,
    displayPriceTier,
  } = computeSharedPricing(
    {
      daily: vehicle.dailyPrice,
      weekly: vehicle.weeklyPrice,
      monthly: vehicle.monthlyPrice,
    },
    days,
  );

  const baseLineItems: PricingLineItem[] = lineItems.map((item) => ({
    label: item.label.replace(/^(.*?) @ (.*)$/, "$1 (@ $2)"),
    total: item.total,
  }));

  const durationParts: string[] = [];
  let remaining = days;
  const months = Math.floor(remaining / 30);
  if (months > 0) {
    durationParts.push(pluralize(months, "month"));
    remaining -= months * 30;
  }
  const weeks = Math.floor(remaining / 7);
  if (weeks > 0) {
    durationParts.push(pluralize(weeks, "week"));
    remaining -= weeks * 7;
  }
  if (remaining > 0) {
    durationParts.push(pluralize(remaining, "day"));
  }

  const insuranceFee = computeInsuranceFee(
    days,
    vehicle.insuranceDailyRate,
    hostProvidesInsurance,
  );

  return {
    durationLabel: durationParts.join(", "),
    displayPriceTier,
    baseLineItems,
    baseTotal,
    insuranceFee,
    subtotal: baseTotal + insuranceFee,
  };
};

export const formatCurrency = (amount: number) =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const formatPercent = (rate: number) =>
  `${(rate * 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}%`;

// ─── Availability notice (reactive, own Suspense boundary) ───────────────────

export type AvailabilityNoticeProps = {
  vehicleName: string;
  startDate: Date;
  endDate: Date;
  isAvailable: boolean;
};

export const AvailabilityNotice = ({
  vehicleName,
  startDate,
  endDate,
  isAvailable,
}: AvailabilityNoticeProps) => {
  const rangeLabel = `${format(startDate, "MMM d")} – ${format(endDate, "MMM d, yyyy")}`;

  return isAvailable ? (
    <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-md text-emerald-700">
      <CheckCircle2 className="w-4 h-4 shrink-0" />
      <span className="text-sm font-medium font-text">
        {vehicleName} is available for {rangeLabel}
      </span>
    </div>
  ) : (
    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-md text-red-600">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <span className="text-sm font-medium font-text">
        {vehicleName} is not available for {rangeLabel}
      </span>
    </div>
  );
};

export const AvailabilityPlaceholder = () => (
  <div className="flex items-center gap-2 p-3 bg-[#F9FAFB] rounded-md text-[#9CA3AF]">
    <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
    <span className="text-sm font-medium font-text">
      Checking availability...
    </span>
  </div>
);

// ─── Tax + total (reactive, own Suspense boundary) ────────────────────────────

export type TaxAndTotalProps = {
  subtotal: number;
  fetchTax: (subtotal: number) => Promise<TaxResult>;
};

export const TaxAndTotal = ({ subtotal, fetchTax }: TaxAndTotalProps) => {
  const taxPromise = useMemo(() => fetchTax(subtotal), [subtotal, fetchTax]);
  const tax = use(taxPromise);
  const total = subtotal + tax.amount;

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
        <SummaryRow
          label={`Tax (${formatPercent(tax.rate)})`}
          value={formatCurrency(tax.amount)}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between w-full">
        <span className="text-gray-800 text-base font-bold font-text leading-6">
          Total Amount
        </span>
        <span className="text-blue-700 text-xl font-medium font-text leading-7">
          {formatCurrency(total)}
        </span>
      </div>
    </>
  );
};

export const TaxPlaceholder = ({ subtotal }: { subtotal: number }) => (
  <div className="flex flex-col gap-2 w-full">
    <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
    <div className="flex items-center justify-between">
      <span className="text-[#6B7280] text-sm font-normal font-text">Tax</span>
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

// ─── Shared bits ───────────────────────────────────────────────────────────────

export const FormSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-3 w-full">
    <span className="text-neutral-950 text-base font-semibold font-text">
      {title}
    </span>
    <div className="flex flex-col gap-3 w-full">{children}</div>
  </div>
);

export const SummaryRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[#6B7280] text-sm font-normal font-text">
      {label}
    </span>
    <span className="text-[#1F2937] text-sm font-medium font-text text-right">
      {value}
    </span>
  </div>
);

export const EmptySummaryNotice = ({ message }: { message: string }) => (
  <span className="text-[#9CA3AF] text-sm font-normal font-text">
    {message}
  </span>
);

// ─── Skeleton (top-level Suspense fallback) ───────────────────────────────────

export const NewBookingFormSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: 2 }, (_, i) => (
        <div
          key={i}
          className="p-4 rounded-[10px] border border-gray-200 flex flex-col gap-5"
        >
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
    <div className="flex justify-end gap-3">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-36" />
    </div>
  </div>
);
