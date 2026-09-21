"use client";

import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { FieldSeparator } from "@/components/ui/field";
import { useListVehcleQuery } from "@/app/store/services/hostApi";
import { ServiceHistoryItem } from "@/types/logservice.type";
import { IListVehiclesDatum } from "@/types/vehicle.type";
import LogMaintenanceForm, {
  LogMaintenanceFormValues,
} from "@/components/hostComponents/forms/logMaintenanceServiceForm";

export type EditMaintenanceServiceModalProps = {
  service: ServiceHistoryItem;
  onClose: () => void;
  onSuccess?: () => void;
  onSave?: (values: LogMaintenanceFormValues) => Promise<void> | void;
};

const toIsoDateString = (d?: Date | string | null): string => {
  if (!d) return "";
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? "" : parsed.toISOString();
};

export default function EditMaintenanceServiceModal({
  service,
  onClose,
  onSuccess,
  onSave,
}: EditMaintenanceServiceModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data,
    isLoading: vehicleLoading,
    isError: isVehicleError,
    refetch: refetchVehicles,
  } = useListVehcleQuery({
    page: 1,
    limit: 100,
  });

  const vehicles = data?.data;

  const matchedVehicle = vehicles?.find(
    (v: IListVehiclesDatum) =>
      v.name === service.vehicleName || v._id === service.vehicleName,
  );

  const initialValues: Partial<LogMaintenanceFormValues> = {
    vehicleId: matchedVehicle?._id ?? service.vehicleName,
    vehicleName: service.vehicleName,
    serviceType: service.serviceType || "",
    serviceDate: toIsoDateString(service.date),
    mileageAtService:
      service.mileageKm != null ? service.mileageKm.toLocaleString() : "",
    cost: service.cost != null ? String(service.cost) : "",
    provider: service.workshop || "",
    nextServiceMileage:
      service.nextDueMileageKm != null
        ? service.nextDueMileageKm.toLocaleString()
        : "",
    nextServiceDate: toIsoDateString(service.nextDueDate),
    notes: service.notes || "",
  };

  const handleSubmit = async (values: LogMaintenanceFormValues) => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      if (onSave) {
        await onSave(values);
      }
      toast.success("Maintenance service updated successfully");
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (err as { message?: string })?.message ||
        "An unexpected error occurred while updating service. Please try again.";
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center backdrop-blur-md bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-[10px] flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex flex-col">
            <span className="text-[#1F2937] text-lg font-bold font-text leading-6">
              Edit Maintenance Service
            </span>
            <span className="text-xs text-gray-500 font-text mt-0.5">
              {service.vehicleName} · {service.serviceType}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[#6B7280] hover:text-[#1F2937] transition-colors duration-150 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <FieldSeparator />

        {/* ── Submission Error Alert ──────────────────────── */}
        {apiError && (
          <div className="mx-6 mt-4 flex items-start justify-between gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs font-text">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold">Unable to update service</span>
                <span>{apiError}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setApiError(null)}
              className="text-red-500 hover:text-red-700 cursor-pointer p-0.5"
              aria-label="Dismiss error"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ── Reusable LogMaintenanceForm with vehicle selection locked ── */}
        <LogMaintenanceForm
          key={service.id}
          vehicles={vehicles}
          isVehiclesLoading={vehicleLoading}
          isVehiclesError={isVehicleError}
          onRetryVehicles={() => refetchVehicles()}
          defaultVehicleId={matchedVehicle?._id ?? service.vehicleName}
          defaultVehicleName={service.vehicleName}
          initialValues={initialValues}
          disableVehicleSelect={true}
          submitButtonText="Save Changes"
          loadingButtonText="Saving..."
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isSubmitting}
          onValueChange={() => {
            if (apiError) setApiError(null);
          }}
        />
      </div>
    </div>
  );
}

