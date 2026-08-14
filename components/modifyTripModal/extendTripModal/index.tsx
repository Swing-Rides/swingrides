"use client";

import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { toast } from "sonner";
import { format, parse } from "date-fns";

import ExtendTripForm, {
  type ExtendTripFormValues,
} from "@/components/forms/extendTripForm";
import { Rentals } from "@/components/pages/profilePages/types";
import { useGetBookingByIdQuery } from "@/app/store/services/renterApi";
import { useAppDispatch } from "@/app/store/store";
import { setPendingCheckoutData } from "@/app/store/reducers/public.reducer";
import {
  PendingCheckoutDraft,
  writeDraftToStorage,
} from "@/lib/checkout-helpers";
import {
  computeInsuranceFee,
  computePricing,
  computeTotal,
  daysDifference,
  PriceConfig,
} from "@/lib/pricing";

// ─── Types ───────────────────────────────────────────────────────────────────
type ExtendTripModalProps = {
  rental: Rentals;
  isOpen: boolean;
  onClose: () => void;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const combineDateAndTime = (dateLabel?: string, timeLabel?: string): string => {
  if (!dateLabel) return "";

  const parsedDate = parse(dateLabel, "MMM d, yyyy", new Date());
  if (Number.isNaN(parsedDate.getTime())) {
    const d = new Date(dateLabel);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
    return "";
  }

  const timeMatch = timeLabel?.match(
    /^(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z?$/,
  );
  const [, hh = "0", mm = "0", ss = "0", ms = "0"] = timeMatch ?? [];

  return new Date(
    Date.UTC(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
      Number(hh),
      Number(mm),
      Number(ss),
      Number(ms.padEnd(3, "0")),
    ),
  ).toISOString();
};

const splitDateAndTime = (iso: string): { date: string; time: string } => {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "", time: "" };
  return {
    date: format(d, "MMM d, yyyy"),
    time: d.toISOString().split("T")[1] ?? "",
  };
};

const toISODate = (value: string | Date) => {
  const date = new Date(value);
  return `${format(date, "yyyy-MM-dd")}T00:00:00.000Z`;
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function ExtendTripModal({
  rental,
  isOpen,
  onClose,
}: ExtendTripModalProps) {
  const dispatch = useAppDispatch();
  const { data } = useGetBookingByIdQuery(
    { id: rental.id },
    { skip: !rental.id },
  );

  const vehicleId = data?.data.vehicleId ?? rental.vehicleId;
  const taxRate = data?.data.taxRate ?? 0;
  const insuranceFeePerDay = Number(data?.data?.dailyInsuranceFee ?? 0);
  const hostProvidingCoverage = Boolean(data?.data?.hostProvidingCoverage);

  const parsedTotal = parseFloat(
    rental.totalPaid?.replace(/[^0-9.]/g, "") ?? "0",
  );
  const currentTotal = Number.isFinite(parsedTotal) ? parsedTotal : 0;

  const originalReturnISO = combineDateAndTime(
    rental?.returnDate,
    rental?.returnTime,
  );

  // Only allow this modal for Active trips
  if (!isOpen || rental.status !== "Active") return null;

  const handleSubmit = async (values: ExtendTripFormValues) => {
    try {
      const extraDays = daysDifference(values.newReturnDate, rental.returnDate);

      if (extraDays === 0) {
        toast.error("New return date must be after the current return date");
        return;
      }

      const extraDaysPricing = computePricing(
        rental.rentalRate as PriceConfig,
        extraDays,
      );
      const taxRate = data?.data.taxRate ?? 0;
      const insuranceFee = computeInsuranceFee(
        extraDays,
        Number(data?.data?.dailyInsuranceFee ?? 0),
        Boolean(data?.data?.hostProvidingCoverage),
      );
      const extraDaysTotalAmount = computeTotal(
        extraDaysPricing.total,
        Number(data?.data?.dailyInsuranceFee ?? 0),
        taxRate,
      );

      // Keep the original pickup date/time unchanged
      const { date: pickupDate, time: pickupTime } = splitDateAndTime(
        rental.pickUpDate,
      );
      const { date: returnDate, time: returnTime } = splitDateAndTime(
        values.newReturnDate,
      );

      const pendingCheckout: PendingCheckoutDraft = {
        vehicleId: vehicleId as string,
        pickupDate: toISODate(pickupDate),
        returnDate: toISODate(returnDate),
        pickupTime,
        returnTime,
        streetAddress: rental.pickupStreet ?? "",
        city: rental.pickupCity ?? "",
        state: rental.state ?? "",
        postalCode: rental.postalCode ?? "",
        pickupLocation: rental.pickupLocation,
        subtotal: extraDaysTotalAmount.subtotal,
        totalAmount: extraDaysTotalAmount.totalAmount,
        totalDays: extraDays,
        tax: extraDaysTotalAmount.tax,
        insuranceProvider: data?.data.insuranceProvider || undefined,
        policyNumber: String(data?.data?.policyNumber ?? ""),
        insuranceExpiry: String(data?.data.insuranceExpiry ?? ""),
        insuranceFeePerDay: Number(data?.data?.dailyInsuranceFee ?? 0),
        hostProvidingCoverage: data?.data.hostProvidingCoverage,
        taxRate,
      };

      writeDraftToStorage(vehicleId as string, pendingCheckout);
      toast.success("Redirecting to checkout for the additional days");
      dispatch(
        setPendingCheckoutData({
          pendingCheckoutData: pendingCheckout,
          bookingId: rental.id,
        }),
      );
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process extension";
      toast.error(errorMessage);
      console.error("Failed to process extension:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[10px] shadow-xl w-full max-w-lg mx-4 p-6 flex flex-col gap-5 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-5">
          <div className="flex justify-start items-center gap-3">
            <h2 className="text-neutral-950 text-lg font-bold font-text leading-6">
              Extend Duration
            </h2>
            <span className="text-cyan-600 text-sm font-normal font-text leading-5">
              {rental.rentId}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-neutral-950 transition-colors duration-300 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        <Separator />

        <span className="text-gray-500 text-xs font-normal font-text leading-5">
          You can extend the return date for this active trip. Additional days
          are charged at your current daily rate. Pickup date and location
          can&apos;t be changed once a trip has started.
        </span>

        <div className="overflow-y-auto">
          <ExtendTripForm
            currentReturnDate={originalReturnISO || rental.returnDate}
            rentalRate={rental.rentalRate as PriceConfig}
            currentTotal={currentTotal}
            vehicleId={vehicleId ?? rental.car.carId}
            insuranceFeePerDay={insuranceFeePerDay}
            hostProvidingCoverage={hostProvidingCoverage}
            taxRate={taxRate}
            onSubmit={handleSubmit}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
