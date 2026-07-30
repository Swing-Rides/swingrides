"use client";

import { useMemo, useState } from "react";
import { differenceInCalendarDays, addDays, format, parse } from "date-fns";

import MainForm from "@/components/forms/MainForm";
import { FormFieldConfig } from "@/components/forms/types";
import { validators } from "@/components/forms/form.validators";
import { US_STATES } from "@/constants/addressState";

import { ExtraDaysSummary, ModifyBookingFormValues, ModifyFormProps } from "../modifyTripModal/types";
import { useUpdateBookingMutation } from "@/app/store/services/renterApi";
import { toast } from "sonner";
import { computeInsuranceFee, computePricing, computeTotal, formatCurrency, PriceConfig } from "@/lib/pricing";
import { PendingCheckoutDraft, writeDraftToStorage } from "@/lib/checkout-helpers";
import { useRouter } from "next/navigation";
import ModifyRentalFormFooter from "../modifyTripModal/formFooter";
import ModifyTripRefundDialog from "../modifyTripModal/refundDialog";

/** Combine a server-format date + time pair into one ISO datetime for the form. */
const combineDateAndTime = (dateLabel?: string, timeLabel?: string): string => {
  if (!dateLabel) return "";

  const parsedDate = parse(dateLabel, "MMM d, yyyy", new Date());
  if (Number.isNaN(parsedDate.getTime())) return "";

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

/** Split a form ISO datetime back into the server's date + time pair. */
const splitDateAndTime = (iso: string): { date: string; time: string } => {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "", time: "" };
  return {
    date: format(d, "MMM d, yyyy"),
    time: d.toISOString().split("T")[1] ?? "",
  };
};

export default function ModifyBookingForm({
  rental,
  onClose,
}: ModifyFormProps) {
  const [updateBooking, { isLoading }] = useUpdateBookingMutation();
  const router = useRouter();

  // Shown after checking the summary, or after a submission that grows the duration.
  const [summary, setSummary] = useState<ExtraDaysSummary | null>(null);

  // Refund-contact popup, shown when the new duration is shorter than the old one.
  const [showRefundDialog, setShowRefundDialog] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // The booking's current pickup/return as one combined ISO each — used both
  // to prefill the form and as the "unchanged?" baseline for Check Summary.
  const originalPickupISO = useMemo(
    () => combineDateAndTime(rental.pickUpDate, rental.pickupTime),
    [rental.pickUpDate, rental.pickupTime],
  );
  const originalReturnISO = useMemo(
    () => combineDateAndTime(rental.returnDate, rental.returnTime),
    [rental.returnDate, rental.returnTime],
  );

  const fields: FormFieldConfig[] = [
    {
      name: "pickupDate",
      type: "datetime",
      label: "Pickup Date",
      placeholder: "Pick date & time",
      minDate: today,
      defaultValue: originalPickupISO || undefined,
      validation: validators.required("Pickup date"),
    },
    {
      name: "returnDate",
      type: "datetime",
      label: "Return Date",
      placeholder: "Pick date & time",
      minDate: addDays(today, 1),
      defaultValue: originalReturnISO || undefined,
      validation: {
        required: "Return date is required",
        validate: (value, formValues) => {
          const { pickupDate } = formValues as ModifyBookingFormValues;
          if (!pickupDate || !value) return true;
          return (
            new Date(value as string) > new Date(pickupDate) ||
            "Must be after pickup date"
          );
        },
      },
    },
    {
      name: "pickupStreet",
      type: "text",
      label: "Street",
      placeholder: "e.g. 123 Main Street",
      defaultValue: rental.pickupStreet ?? "",
      validation: validators.required("Street"),
    },
    {
      name: "pickupCity",
      type: "text",
      label: "City",
      placeholder: "e.g. Austin",
      defaultValue: rental.pickupCity ?? "",
      validation: validators.required("City"),
    },
    {
      name: "pickupState",
      type: "select",
      label: "State",
      placeholder: "Select a state",
      options: US_STATES,
      defaultValue: rental.state ?? "",
      validation: validators.required("State"),
    },
    {
      name: "pickupZipcode",
      type: "text",
      label: "Zip Code",
      placeholder: "e.g. 78701",
      defaultValue: rental.postalCode ?? "",
      validation: {
        required: "Zip code is required",
        pattern: {
          value: /^\d{5}(-\d{4})?$/,
          message: "Enter a valid US zip code (e.g. 78701)",
        },
      },
    },
  ];

  const applyBookingUpdate = async (formValues: ModifyBookingFormValues) => {
    const { date: pickupDate, time: pickupTime } = splitDateAndTime(
      formValues.pickupDate,
    );
    const { date: returnDate, time: returnTime } = splitDateAndTime(
      formValues.returnDate,
    );
    const pickupLocation = `${formValues.pickupStreet}, ${formValues.pickupCity}, ${formValues.pickupState} ${formValues.pickupZipcode}`;

    await updateBooking({
      id: rental.id,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      pickupLocation,
    }).unwrap();
  };

  /** Duration change (in days) between the current booking and the given values. */
  const extraDaysFor = (pickupISO: string, returnISO: string): number => {
    const oldDays = Math.max(
      differenceInCalendarDays(
        new Date(originalReturnISO),
        new Date(originalPickupISO),
      ),
      0,
    );
    const newDays = Math.max(
      differenceInCalendarDays(new Date(returnISO), new Date(pickupISO)),
      0,
    );
    return newDays - oldDays;
  };

  const buildExtraDaysSummary = (extraDays: number): ExtraDaysSummary => {
    const extraDaysPricing = computePricing(
      rental.rentalRate as PriceConfig,
      extraDays,
    );
    const insuranceFee = computeInsuranceFee(
      extraDays,
      rental.insuranceFee,
      rental.hostProvidingCoverage,
    );
    const extraDaysTotalAmount = computeTotal(
      extraDaysPricing.total,
      rental.insuranceFee,
      rental.taxRate,
    );
    return {
      days: extraDays,
      breakdown: extraDaysPricing.lineItems,
      total: extraDaysPricing.total,
      insuranceTotalFee: formatCurrency(insuranceFee),
      taxRate: extraDaysTotalAmount.tax,
      taxAmount: formatCurrency(extraDaysTotalAmount.taxableAmount),
      totalAmount: formatCurrency(extraDaysTotalAmount.totalAmount),
    };
  };

  // Preview-only: reads the live (unsubmitted) form values and shows what the
  // additional charge would be, without touching the booking or navigating.
  const handleCheckSummary = (values: Partial<ModifyBookingFormValues>) => {
    const { pickupDate: pickupISO, returnDate: returnISO } = values;

    if (!pickupISO || !returnISO) {
      toast.error("Pick both a pickup and return date & time first");
      return;
    }

    if (pickupISO === originalPickupISO && returnISO === originalReturnISO) {
      setSummary(null);
      toast.info(
        "Nothing has changed — pickup and return are still the same as your current booking.",
      );
      return;
    }

    const extraDays = extraDaysFor(pickupISO, returnISO);

    if (extraDays <= 0) {
      setSummary(null);
      toast.info(
        extraDays === 0
          ? "Same duration — no additional charge."
          : "Shorter duration — no additional charge. A refund conversation with your host may apply once confirmed.",
      );
      return;
    }

    setSummary(buildExtraDaysSummary(extraDays));
  };


  const handleSubmit = async (values: Record<string, unknown>) => {
    const formValues = values as ModifyBookingFormValues;

    if (
      formValues.pickupDate === originalPickupISO &&
      formValues.returnDate === originalReturnISO
    ) {
      toast.info("Nothing has changed — pickup and return are unchanged.");
      return;
    }

    const extraDays = extraDaysFor(formValues.pickupDate, formValues.returnDate);

    try {
      if (extraDays === 0) {
        // Case 1: same duration — only the times (or an equal date shift) changed.
        await applyBookingUpdate(formValues);
        toast.success("Booking updated successfully");
        onClose();
        return;
      }

      if (extraDays < 0) {
        // Case 2: duration shrank — apply the change, then prompt the user
        // to work out a refund with the host.
        await applyBookingUpdate(formValues);
        setShowRefundDialog(true);
        return;
      }

      // Case 3: duration grew — don't apply the change yet. Send the user
      // to checkout to pay for only the additional days, not the full new duration.
      const extraDaysSummary = buildExtraDaysSummary(extraDays);
      const extraDaysPricing = computePricing(
        rental.rentalRate as PriceConfig,
        extraDays,
      );
      const taxRate = rental.taxRate ?? 0.08;
      const extraDaysTotalAmount = computeTotal(
        extraDaysPricing.total,
        rental.insuranceFee,
        taxRate,
      );

      setSummary(extraDaysSummary);

      const { date: pickupDate, time: pickupTime } = splitDateAndTime(
        formValues.pickupDate,
      );
      const { date: returnDate, time: returnTime } = splitDateAndTime(
        formValues.returnDate,
      );

      const pendingCheckout: PendingCheckoutDraft = {
        // DATA SOURCE
        vehicleId: rental.vehicleId as string,

        // NEW DATA
        pickupDate,
        returnDate,
        pickupTime,
        returnTime,
        streetAddress: formValues.pickupStreet,
        city: formValues.pickupCity || rental.pickupCity || "",
        state: formValues.pickupState,
        postalCode: formValues.pickupZipcode,
        pickupLocation: `${formValues.pickupStreet}, ${formValues.pickupCity}, ${formValues.pickupState}, ${formValues.pickupZipcode}`,
        subtotal: extraDaysTotalAmount.subtotal,
        totalAmount: extraDaysTotalAmount.totalAmount,
        totalDays: extraDays,
        tax: extraDaysTotalAmount.tax,

        // UNCHANGED DATA
        insuranceProvider: rental.insuranceProvider || undefined,
        policyNumber: rental.policyNumber,
        insuranceExpiry: rental.insuranceExpiry,
        insuranceFeePerDay: rental.insuranceFee,
        hostProvidingCoverage: rental.hostProvidingCoverage,
        taxRate,
      };

      writeDraftToStorage(rental.vehicleId as string, pendingCheckout);
      toast.success("Redirecting to checkout for the additional days");
      router.push(`/checkout/${rental.id}`);
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update booking";
      toast.error(errorMessage);
      console.error("Failed to update booking:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <span className="text-gray-500 text-xs font-semibold font-text uppercase leading-5">
        New Booking Details
      </span>

      <MainForm
        fields={fields}
        rowPairs={[
          ["pickupDate", "returnDate"],
          ["pickupStreet", "pickupCity"],
          ["pickupState", "pickupZipcode"],
        ]}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Confirm Changes"
        footerSlot={(values) => (
          <ModifyRentalFormFooter
            summary={summary}
            hostProvidingCoverage={rental.hostProvidingCoverage}
            insuranceDailyFee={rental.insuranceDailyFee}
            onClose={onClose}
            handleCheckSummary={() =>
              handleCheckSummary(values as Partial<ModifyBookingFormValues>)
            }
          />
        )}
      />

      <ModifyTripRefundDialog 
        showRefundDialog={showRefundDialog}
        setShowRefundDialog={setShowRefundDialog}
        onClose={onClose}
      />
    </div>
  );
}