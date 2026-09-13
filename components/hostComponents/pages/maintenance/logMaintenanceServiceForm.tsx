"use client";

import { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { X, Gauge, CalendarIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";
import {
  FormField,
  LoadingSpinner,
} from "@/components/forms/MainForm";

import {
  useListVehcleQuery,
  useLogServiceModalMutation,
} from "@/app/store/services/hostApi";
import { LogServiceModalRequest } from "@/types/logservice.type";
import { IListVehiclesDatum } from "@/types/vehicle.type";
import VehicleSelectField from "./vehicleSelectField";

// ─── Types ────────────────────────────────────────────────────────────────────

type NextServiceTab = "mileage" | "date";

type LogMaintenanceFormValues = {
  vehicleName: string;
  serviceType: string;
  serviceDate: string;
  mileageAtService: string;
  cost: string;
  provider: string;
  nextServiceMileage: string;
  nextServiceDate: string;
  notes: string;
};

type LogMaintenanceServiceFormProps = {
  onClose: () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function LogMaintenanceServiceForm({
  onClose,
}: LogMaintenanceServiceFormProps) {
  const [activeTab, setActiveTab] = useState<NextServiceTab>("mileage");
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<LogMaintenanceFormValues>({
    mode: "onTouched",
    defaultValues: {
      vehicleName: "",
      serviceType: "",
      serviceDate: "",
      mileageAtService: "",
      cost: "",
      provider: "",
      nextServiceMileage: "",
      nextServiceDate: "",
      notes: "",
    },
  });

  const mileageAtService = useWatch({ control, name: "mileageAtService" });
  const serviceDate = useWatch({ control, name: "serviceDate" });
  const selectedVehicleName = useWatch({ control, name: "vehicleName" });

  const [addLogsToBackend, { isLoading }] = useLogServiceModalMutation();
  const {
    data,
    isLoading: vehicleLoading,
    isError: isVehicleError,
    refetch: refetchVehicles,
  } = useListVehcleQuery({
    page: 1,
    limit: 40,
  });

  const onSubmit = async (values: LogMaintenanceFormValues) => {
    setApiError(null);
    try {
      const payload: LogServiceModalRequest = {
        cost: Number(String(values.cost).replace(/,/g, "")) || 0,
        mileageAtServiceKm:
          Number(String(values.mileageAtService).replace(/,/g, "")) || 0,
        nextDueDate:
          activeTab === "date" && values.nextServiceDate
            ? values.nextServiceDate
            : undefined,
        notes: values.notes,
        serviceDate: values.serviceDate,
        serviceType: values.serviceType,
        nextServiceDueMode: activeTab === "mileage" ? "mileage" : "date",
        providerOrWorkshop: values.provider,
        vehicle: values.vehicleName,
        nextDueMileageKm:
          activeTab === "mileage" && values.nextServiceMileage
            ? Number(String(values.nextServiceMileage).replace(/,/g, ""))
            : undefined,
      };

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

      {/* ── Scrollable body ──────────────────────────────── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-6 py-5 overflow-y-auto"
        noValidate
      >
        {/* ── Submission Error Alert ──────────────────────── */}
        {apiError && (
          <div className="flex items-start justify-between gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs font-text">
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

        {/* 1. Vehicle Selection (Separate component with Framer animation) */}
        <Controller
          name="vehicleName"
          control={control}
          rules={{ required: "Please select a vehicle" }}
          render={({ field }) => (
            <VehicleSelectField
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                if (apiError) setApiError(null);

                // Event-driven auto-fill of mileage (no useEffect)
                const matchedVehicle = data?.data?.find(
                  (v: IListVehiclesDatum) => v.name === value,
                );
                if (
                  matchedVehicle &&
                  matchedVehicle.mileage !== undefined &&
                  matchedVehicle.mileage !== null
                ) {
                  const formattedMileage =
                    matchedVehicle.mileage.toLocaleString();
                  setValue("mileageAtService", formattedMileage, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
              error={errors.vehicleName?.message}
              vehicles={data?.data}
              isLoading={vehicleLoading}
              isError={isVehicleError}
              onRetry={() => refetchVehicles()}
            />
          )}
        />

        {/* 2. Service Type */}
        <FormField<LogMaintenanceFormValues>
          field={{
            name: "serviceType",
            type: "text",
            label: "Service Type",
            placeholder: "e.g. Oil Change, Brake Inspection",
            validation: { required: "Service type is required" },
          }}
          register={register}
          control={control}
          getValues={getValues}
          errors={errors}
        />

        {/* 3. Service Date + Mileage at Service */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField<LogMaintenanceFormValues>
            field={{
              name: "serviceDate",
              type: "date",
              label: "Service Date",
              placeholder: "Pick a date",
              validation: { required: "Service date is required" },
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />

          <FormField<LogMaintenanceFormValues>
            field={{
              name: "mileageAtService",
              type: "text",
              label: "Mileage at Service (km)",
              placeholder: "e.g. 42,000",
              disabled: !selectedVehicleName,
              description: selectedVehicleName
                ? "Auto-filled from vehicle odometer"
                : "Select a vehicle first",
              validation: {
                required: "Mileage is required",
                pattern: {
                  value: /^[\d,]+$/,
                  message: "Enter a valid mileage",
                },
              },
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />
        </div>

        {/* 4. Cost + Provider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField<LogMaintenanceFormValues>
            field={{
              name: "cost",
              type: "number-dollar",
              label: "Cost ($)",
              placeholder: "e.g. 1200",
              validation: {
                required: "Cost is required",
                min: { value: 0, message: "Cost cannot be negative" },
              },
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />

          <FormField<LogMaintenanceFormValues>
            field={{
              name: "provider",
              type: "text",
              label: "Provider / Workshop",
              placeholder: "e.g. AutoCare Plus",
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />
        </div>

        {/* 5. Next Service Due */}
        <div className="flex flex-col gap-2.5">
          <Label className="text-zinc-800 text-xs font-semibold font-text uppercase">
            Next Service Due <span className="text-[#EF4444] ml-1">*</span>
          </Label>

          {/* Segmented Tab Switcher */}
          <div className="inline-flex p-1 bg-gray-100 rounded-lg border border-gray-200 self-start">
            <button
              type="button"
              onClick={() => {
                setActiveTab("mileage");
                setValue("nextServiceDate", "");
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-md text-xs font-medium font-text transition-all duration-200 cursor-pointer flex items-center gap-1.5",
                activeTab === "mileage"
                  ? "bg-white text-blue-700 shadow-xs font-semibold"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              <Gauge className="size-3.5" />
              By Mileage
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("date");
                setValue("nextServiceMileage", "");
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-md text-xs font-medium font-text transition-all duration-200 cursor-pointer flex items-center gap-1.5",
                activeTab === "date"
                  ? "bg-white text-blue-700 shadow-xs font-semibold"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              <CalendarIcon className="size-3.5" />
              By Date
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "mileage" ? (
            <FormField<LogMaintenanceFormValues>
              field={{
                name: "nextServiceMileage",
                type: "text",
                label: "Next Service Mileage (km)",
                placeholder: "e.g. 47,000",
                validation: {
                  required:
                    activeTab === "mileage"
                      ? "Next service mileage is required"
                      : false,
                  validate: (value) => {
                    if (activeTab !== "mileage") return true;
                    const next = parseInt(
                      String(value ?? "").replace(/,/g, ""),
                      10,
                    );
                    const current = parseInt(
                      String(mileageAtService ?? "").replace(/,/g, ""),
                      10,
                    );
                    if (isNaN(next)) return "Enter a valid mileage";
                    if (!isNaN(current) && next <= current) {
                      return `Must be greater than current mileage (${mileageAtService || 0} km)`;
                    }
                    return true;
                  },
                },
              }}
              register={register}
              control={control}
              getValues={getValues}
              errors={errors}
            />
          ) : (
            <FormField<LogMaintenanceFormValues>
              field={{
                name: "nextServiceDate",
                type: "date",
                label: "Next Service Date",
                placeholder: "Pick a date",
                minDate: serviceDate ? new Date(serviceDate) : undefined,
                validation: {
                  required:
                    activeTab === "date"
                      ? "Next service date is required"
                      : false,
                  validate: (value: string) => {
                    if (activeTab !== "date" || !value) return true;
                    if (!serviceDate) return true;
                    return new Date(value) > new Date(serviceDate)
                      ? true
                      : "Must be after the service date";
                  },
                },
              }}
              register={register}
              control={control}
              getValues={getValues}
              errors={errors}
            />
          )}
        </div>

        {/* 6. Notes (max 500 characters) */}
        <FormField<LogMaintenanceFormValues>
          field={{
            name: "notes",
            type: "textarea",
            label: "Notes",
            placeholder: "Optional notes about service (max 500 characters)",
            height: 120,
            maxLength: 500,
            showCharCount: true,
          }}
          register={register}
          control={control}
          getValues={getValues}
          errors={errors}
        />

        {/* ── Footer actions ───────────────────────── */}
        <FieldSeparator />
        <div className="flex gap-3 justify-end pb-1">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] font-medium font-text rounded-xs cursor-pointer transition-colors duration-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-700 hover:bg-blue-900 text-white font-medium font-text rounded-xs cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner />
                Logging...
              </span>
            ) : (
              "Log Service"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
