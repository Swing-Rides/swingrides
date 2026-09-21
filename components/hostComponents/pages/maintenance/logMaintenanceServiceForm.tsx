"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { X, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { FieldSeparator } from "@/components/ui/field";
import { LoadingSpinner } from "@/components/forms/MainForm";

import {
  useListVehcleQuery,
  useLogServiceModalMutation,
} from "@/app/store/services/hostApi";
import { LogServiceModalRequest } from "@/types/logservice.type";
import { IListVehiclesDatum } from "@/types/vehicle.type";
import LogMaintenanceForm, {
  LogMaintenanceFormValues,
} from "@/components/hostComponents/forms/logMaintenanceServiceForm";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LogMaintenanceServiceModalProps = {
  onClose: () => void;
  initialVehicleId?: string | null;
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

export const buildLogServicePayload = (
  values: LogMaintenanceFormValues,
): LogServiceModalRequest => ({
  cost: Number(String(values.cost).replace(/,/g, "")) || 0,
  mileageAtServiceKm:
    Number(String(values.mileageAtService).replace(/,/g, "")) || 0,
  nextDueDate: values.nextServiceDate
    ? new Date(values.nextServiceDate).toISOString()
    : undefined,
  nextDueMileageKm: values.nextServiceMileage
    ? Number(String(values.nextServiceMileage).replace(/,/g, ""))
    : undefined,
  nextServiceDueMode: "date",
  notes: values.notes,
  serviceDate: values.serviceDate
    ? new Date(values.serviceDate).toISOString()
    : undefined,
  serviceType: values.serviceType,
  providerOrWorkshop: values.provider,
  vehicle: values.vehicleName || values.vehicleId || "",
});

// ─── Modal Component ──────────────────────────────────────────────────────────

export default function LogMaintenanceServiceForm({
  onClose,
  initialVehicleId,
}: LogMaintenanceServiceModalProps) {
  const searchParams = useSearchParams();
  const rawParamVehicleId = searchParams.get("log-service");
  const targetVehicleId =
    initialVehicleId ??
    (rawParamVehicleId &&
      rawParamVehicleId !== "true" &&
      rawParamVehicleId !== "open"
      ? rawParamVehicleId
      : undefined);
  const hasTargetVehicleId = Boolean(targetVehicleId);

  const [apiError, setApiError] = useState<string | null>(null);

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

  // Derive pre-selected vehicle synchronously on render — avoids useEffect
  const matchedVehicle = hasTargetVehicleId
    ? vehicles?.find(
        (v: IListVehiclesDatum) =>
          v._id === targetVehicleId || v.name === targetVehicleId,
      )
    : undefined;

  const [addLogsToBackend, { isLoading }] = useLogServiceModalMutation();

  const onSubmit = async (values: LogMaintenanceFormValues) => {
    setApiError(null);
    try {
      const payload = buildLogServicePayload(values);
      const response = await addLogsToBackend(payload).unwrap();
      if (response.success) {
        toast.success("Maintenance service logged successfully");
        onClose();
      } else {
        const message = response.message || "Failed to log service";
        setApiError(message);
        toast.error(message);
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (err as { message?: string })?.message ||
        "An unexpected error occurred while logging service. Please try again.";
      setApiError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-[10px] flex flex-col overflow-hidden max-h-[90vh]">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-5">
        <span className="text-[#1F2937] text-lg font-bold font-text leading-6">
          Log Maintenance Service
        </span>
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
              <span className="font-semibold">Unable to log service</span>
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

      {/* ── Form or Loading State ────────────────────────── */}
      {hasTargetVehicleId && vehicleLoading ? (
        <div className="flex flex-col items-center justify-center p-12 gap-3 text-gray-500 text-sm font-text">
          <LoadingSpinner />
          <span>Loading vehicle details...</span>
        </div>
      ) : (
        <LogMaintenanceForm
          key={targetVehicleId ?? "default"}
          vehicles={vehicles}
          isVehiclesLoading={vehicleLoading}
          isVehiclesError={isVehicleError}
          onRetryVehicles={() => refetchVehicles()}
          defaultVehicleId={matchedVehicle?._id ?? targetVehicleId ?? ""}
          defaultVehicleName={matchedVehicle?.name ?? ""}
          defaultMileageAtService={
            matchedVehicle?.mileage != null
              ? matchedVehicle.mileage.toLocaleString()
              : ""
          }
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          onValueChange={() => {
            if (apiError) setApiError(null);
          }}
        />
      )}
    </div>
  );
}
