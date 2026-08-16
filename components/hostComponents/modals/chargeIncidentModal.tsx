"use client";

import { useMemo } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import HostModalWrapper from "./hostModalsWrapper";
import { getInitials } from "@/components/pages/profilePages/utils";
import { BookingsStatus } from "../pages/bookingsPageComponents/singleBookingPageComponents/types";
import { statusStyles } from "../pages/bookingsPageComponents/singleBookingPageComponents/pageHeader";
import ChargeIncidentForm, {
  ChargeIncidentFormValues,
} from "../forms/chargeIncidentForm";
import { CheckboxInput, LoadingSpinner } from "@/components/forms/MainForm";
import { PlusCircle, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

type ChargeIncidentModalProps = {
  id: string;
  referenceCode: string;
  renterName: string;
  vehicleName: string;
  renterEmail: string;
  status: BookingsStatus;
  onClose?: () => void;
  onSubmit?: (values: ChargeIncidentFormValues) => void | Promise<void>;
};

export default function ChargeIncidentModal({
    id,
    referenceCode,
    renterName,
    vehicleName,
    renterEmail,
    status,
    onClose,
    onSubmit,
}: ChargeIncidentModalProps) {
    
    const {
        register,
        handleSubmit,
        control,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<ChargeIncidentFormValues>({
        mode: "onTouched",
        defaultValues: {
            incidents: [
                {
                    incidentType: "Additional Distance",
                    amount: "",
                    description: "",
                },
            ],
            confirmed: false,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "incidents",
    });

    const watchedIncidents = useWatch({ control, name: "incidents" });

    const totalCharges = useMemo(() => {
        const list = watchedIncidents || [];
        return list.reduce((sum, item) => {
        const val =
            typeof item?.amount === "number"
            ? item.amount
            : parseFloat(String(item?.amount || 0));
        return sum + (isNaN(val) ? 0 : val);
        }, 0);
    }, [watchedIncidents]);

    const formattedTotal = useMemo(() => {
        return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
        }).format(totalCharges);
    }, [totalCharges]);

    if (!id || id === "undefined") {
        return null
    }

    const handleCloseModal = () => {
        if (onClose) {
            onClose();
        } else {
            toast.error("Failed to close modal! Please try again.");
        }
    };

    const handleAddIncident = () => {
        append({
            incidentType: "Additional Distance",
            amount: "",
            description: "",
        });
    };

    const handleFormSubmit = async (values: ChargeIncidentFormValues) => {
    if (onSubmit) {
        const toastId = toast.loading("Submitting charges...");
        try {
            await onSubmit(values);
            toast.success("Charges submitted successfully!", { id: toastId });
            handleCloseModal();
        } catch (error) {
            console.error(error);
            const message =
                error instanceof Error ? error.message : "Please try again.";
            toast.error("Failed to submit charges!", {
                id: toastId,
                description: message,
            });
        }
    } else {
        toast.error("Failed to submit charges! Please try again.");
    }
};

  const modalDescription = `${referenceCode} · ${renterName} · ${vehicleName}`;

  return (
    <HostModalWrapper
      title="Charge for incidentals"
      description={modalDescription}
      handleClose={handleCloseModal}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5"
        noValidate
      >
        <BookingInfo
          renterName={renterName}
          renterEmail={renterEmail}
          referenceCode={referenceCode}
          status={status}
        />
        <Warning />

        {/* Section Header with Add Additional Incident button */}
        <div className="flex justify-between items-center gap-3">
          <div>
            <span className="text-neutral-950 text-base font-semibold font-text">
              Incident charges
            </span>
          </div>
          <div>
            <button
              type="button"
              onClick={handleAddIncident}
              aria-label="Add Additional Incident"
              className="flex items-center justify-start gap-2 text-blue-700 text-sm md:text-base font-semibold font-text hover:text-blue-950 duration-300 transition-colors cursor-pointer"
            >
              <PlusCircle className="size-5" />
              <span>Add Additional Incident</span>
            </button>
          </div>
        </div>

        {/* Dynamic Incident Form List */}
        <ChargeIncidentForm
          register={register}
          control={control}
          getValues={getValues}
          errors={errors}
          fields={fields}
          onRemoveIncident={remove}
        />

        {/* Bottom Actions & Total Charges */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          {/* Total charges calculation */}
          <div className="flex items-center justify-between">
            <span className="text-neutral-950 text-base font-semibold font-text">
              Total charges
            </span>
            <span className="text-neutral-950 text-xl font-bold font-text">
              {formattedTotal}
            </span>
          </div>

          {/* Blue notification alert box */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-lg text-blue-700 text-xs md:text-sm font-normal font-text leading-5">
            The renter will be notified via SMS and email with a full breakdown
            of these charges
          </div>

          {/* Confirmation Checkbox */}
          <CheckboxInput
            field={{
              name: "confirmed",
              type: "checkbox",
              label:
                "I confirm these charges are accurate and supported by evidence",
              validation: {
                required: "You must confirm the charges before proceeding",
              },
            }}
            control={control}
            error={errors.confirmed?.message}
          />

          {/* Modal Footer Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full text-sm font-medium font-text py-2.5 px-4 rounded-xs border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="size-4" />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-text text-white text-sm font-medium px-4 py-2.5 bg-blue-700 rounded-xs cursor-pointer hover:bg-blue-900 duration-300 transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Raise Charges</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </HostModalWrapper>
  );
}

type BookingInfoProps = {
  renterName: string;
  renterEmail: string;
  referenceCode: string;
  status: BookingsStatus;
};

const BookingInfo = ({
  renterName,
  renterEmail,
  referenceCode,
  status,
}: BookingInfoProps) => {
  const userInitials = getInitials(renterName);
  const statusStyle = statusStyles[status] || "text-amber-500 bg-amber-100";

  return (
    <div className="flex gap-5 justify-between items-center">
      <div className="flex gap-2 justify-start items-center">
        <div className="flex items-center justify-center size-12 bg-indigo-50 rounded-full aspect-square text-blue-700 text-base font-semibold font-text overflow-hidden">
          {userInitials}
        </div>
        <div className="grid gap-1">
          <p className="text-neutral-950 text-base font-semibold font-text">
            {renterName}
          </p>
          <span className="text-gray-500 text-sm font-normal font-text">
            {renterEmail}
          </span>
        </div>
      </div>
      <div className="flex justify-end items-center gap-2.5">
        <span className="justify-start text-gray-500 text-base font-normal font-text">
          {referenceCode}
        </span>
        <span
          className={`py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4 capitalize ${statusStyle}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

const Warning = () => {
  return (
    <div className="p-3 bg-orange-50 rounded-[10px] flex flex-col justify-start items-start">
      <div className="flex justify-start items-center gap-2.5">
        <span className="justify-start text-amber-500 text-xs font-medium font-text leading-4">
          Charges must be raised within 24 hours of checkout
        </span>
      </div>
    </div>
  );
};