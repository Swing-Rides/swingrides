"use client";

import { useMemo, useState } from "react";
import { differenceInCalendarDays, addDays } from "date-fns";
import { AlertCircle } from "lucide-react";

import MainForm from "@/components/forms/MainForm";
import { FormFieldConfig } from "@/components/forms/types";
import { validators } from "@/components/forms/form.validators";
import { US_STATES } from "@/constants/addressState";

import { ModifyFormProps } from "../modifyTripModal/types";
import { RentalRate } from "../pages/profilePages/types";
import { useUpdateBookingMutation } from "@/app/store/services/renterApi";
import { toast } from "sonner";

const formatCurrency = (amount: number) =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" });

const pluralize = (n: number, word: string) =>
  `${n} ${word}${n !== 1 ? "s" : ""}`;

/**
 * Mixed-unit billing — same logic used across the project:
 * full months → full weeks → remaining days
 * e.g. 45 days = 1 month + 2 weeks + 1 day
 */
const computeTotal = (
  days: number,
  rate: RentalRate | undefined,
): { breakdown: string; total: number } => {
  if (!rate) {
    return { breakdown: "", total: 0 };
  }

  const months = Math.floor(days / 30);
  const rem1 = days % 30;
  const weeks = Math.floor(rem1 / 7);
  const remDays = rem1 % 7;

  let total = 0;
  const parts: string[] = [];

  if (months > 0) {
    total += months * rate.monthly;
    parts.push(pluralize(months, "mo"));
  }
  if (weeks > 0) {
    total += weeks * rate.weekly;
    parts.push(pluralize(weeks, "wk"));
  }
  if (remDays > 0) {
    total += remDays * rate.daily;
    parts.push(pluralize(remDays, "day"));
  }

  return { breakdown: parts.join(" + "), total };
};

type ModifyBookingFormValues = {
  pickupDate: string;
  returnDate: string;
  pickupStreet: string;
  pickupCity: string;
  pickupState: string;
  pickupZipcode: string;
};

export default function ModifyBookingForm({
  rental,
  onClose,
}: ModifyFormProps) {
  const [updateBooking, { isLoading }] = useUpdateBookingMutation();

  // Shown after a submission attempt — MainForm owns its own useForm
  // instance internally, so we can't watch fields live as the user types.
  // We compute + display the summary once the user has submitted.
  const [summary, setSummary] = useState<{
    days: number;
    breakdown: string;
    total: number;
  } | null>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const fields: FormFieldConfig[] = [
    {
      name: "pickupDate",
      type: "datetime",
      label: "Pickup Date",
      placeholder: "Pick date & time",
      minDate: today,
      defaultValue: rental.pickUpDate
        ? new Date(rental.pickUpDate).toISOString()
        : undefined,
      validation: validators.required("Pickup date"),
    },
    {
      name: "returnDate",
      type: "datetime",
      label: "Return Date",
      placeholder: "Pick date & time",
      minDate: addDays(today, 1),
      defaultValue: rental.returnDate
        ? new Date(rental.returnDate).toISOString()
        : undefined,
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

  const handleSubmit = async (values: Record<string, unknown>) => {
    const formValues = values as ModifyBookingFormValues;

    const days = Math.max(
      differenceInCalendarDays(
        new Date(formValues.returnDate),
        new Date(formValues.pickupDate),
      ),
      0,
    );
    const computed = computeTotal(days, rental.rentalRate);
    setSummary({ days, breakdown: computed.breakdown, total: computed.total });

    try {
      const pickupLocation = `${formValues.pickupStreet}, ${formValues.pickupCity}, ${formValues.pickupState} ${formValues.pickupZipcode}`;
      await updateBooking({
        id: rental.id,
        pickupDate: formValues.pickupDate,
        returnDate: formValues.returnDate,
        pickupLocation,
      }).unwrap();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update booking";
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
        footerSlot={
          <>
            {summary && (
              <div className="p-4 bg-indigo-50 rounded-[10px] flex flex-col justify-start items-start gap-1">
                <div className="flex gap-3 justify-between items-center w-full">
                  <span className="flex text-blue-700 text-sm font-normal font-text leading-5">
                    {`New Duration: ${pluralize(summary.days, "day")}${summary.breakdown ? ` (${summary.breakdown})` : ""
                      }`}
                  </span>
                  <span className="flex text-blue-700 text-base font-medium font-text leading-6 text-nowrap">
                    {`New Total: ${formatCurrency(summary.total)}`}
                  </span>
                </div>
                <span className="flex-1 justify-start text-gray-500 text-xs font-normal font-text leading-4">
                  Final amount will be confirmed after modification.
                </span>
              </div>
            )}

            <div className="p-4 bg-amber-100 rounded-[10px] flex justify-start items-start gap-2">
              <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="block text-amber-800 text-xs font-normal font-text leading-5">
                Modifications within 24 hours of pickup may incur a fee.
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-sm font-medium font-text leading-5 border border-gray-500 text-gray-500 rounded-xs py-2 px-4 bg-transparent hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
            >
              Cancel
            </button>
          </>
        }
      />
    </div>
  );
}