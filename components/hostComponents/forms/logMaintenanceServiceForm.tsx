"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { FieldSeparator } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormField, LoadingSpinner } from "@/components/forms/MainForm";
import VehicleSelectField from "@/components/hostComponents/pages/maintenance/vehicleSelectField";
import { IListVehiclesDatum } from "@/types/vehicle.type";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LogMaintenanceFormValues = {
  vehicleId?: string;
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

export type LogMaintenanceFormProps = {
  vehicles?: IListVehiclesDatum[];
  isVehiclesLoading?: boolean;
  isVehiclesError?: boolean;
  onRetryVehicles?: () => void;
  defaultVehicleId?: string;
  defaultVehicleName?: string;
  defaultMileageAtService?: string;
  initialValues?: Partial<LogMaintenanceFormValues>;
  disableVehicleSelect?: boolean;
  submitButtonText?: string;
  loadingButtonText?: string;
  onSubmit: (values: LogMaintenanceFormValues) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  onValueChange?: () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function LogMaintenanceForm({
  vehicles,
  isVehiclesLoading = false,
  isVehiclesError = false,
  onRetryVehicles,
  defaultVehicleId = "",
  defaultVehicleName = "",
  defaultMileageAtService = "",
  initialValues,
  disableVehicleSelect = false,
  submitButtonText = "Log Service",
  loadingButtonText = "Logging...",
  onSubmit,
  onCancel,
  isLoading = false,
  onValueChange,
}: LogMaintenanceFormProps) {
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
      vehicleId:
        initialValues?.vehicleId ?? (defaultVehicleId || defaultVehicleName),
      vehicleName: initialValues?.vehicleName ?? defaultVehicleName,
      serviceType: initialValues?.serviceType ?? "",
      serviceDate: initialValues?.serviceDate ?? "",
      mileageAtService:
        initialValues?.mileageAtService ?? defaultMileageAtService,
      cost: initialValues?.cost ?? "",
      provider: initialValues?.provider ?? "",
      nextServiceMileage: initialValues?.nextServiceMileage ?? "",
      nextServiceDate: initialValues?.nextServiceDate ?? "",
      notes: initialValues?.notes ?? "",
    },
  });

  const mileageAtService = useWatch({ control, name: "mileageAtService" });
  const serviceDate = useWatch({ control, name: "serviceDate" });
  const selectedVehicleName = useWatch({ control, name: "vehicleName" });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 px-6 py-5 overflow-y-auto"
      noValidate
    >
      {/* 1. Vehicle Selection (Separate component with Framer animation) */}
      <Controller
        name="vehicleName"
        control={control}
        rules={{ required: "Please select a vehicle" }}
        render={({ field }) => (
          <VehicleSelectField
            value={getValues("vehicleId") || field.value}
            disabled={disableVehicleSelect}
            onChange={(selectedId, matchedVehicle) => {
              if (disableVehicleSelect) return;
              setValue("vehicleId", selectedId, { shouldDirty: true });
              const name = matchedVehicle?.name ?? selectedId;
              field.onChange(name);
              onValueChange?.();

              // Event-driven auto-fill of mileage (no useEffect)
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
            vehicles={vehicles}
            isLoading={isVehiclesLoading}
            isError={isVehiclesError}
            onRetry={onRetryVehicles}
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

      {/* 3. Service Date & Time + Mileage at Service */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField<LogMaintenanceFormValues>
          field={{
            name: "serviceDate",
            type: "datetime",
            label: "Service Date & Time",
            placeholder: "Pick date & time",
            validation: { required: "Service date & time is required" },
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

      {/* 5. Next Service Due (Both Date & Time and Mileage) */}
      <div className="flex flex-col gap-2">
        <Label className="text-zinc-800 text-xs font-semibold font-text uppercase">
          Next Service Due <span className="text-[#EF4444] ml-1">*</span>
        </Label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField<LogMaintenanceFormValues>
            field={{
              name: "nextServiceDate",
              type: "datetime",
              label: "Next Service Date & Time",
              placeholder: "Pick date & time",
              minDate: serviceDate ? new Date(serviceDate) : undefined,
              validation: {
                required: "Next service date & time is required",
                validate: (value: string) => {
                  if (!value) return "Next service date & time is required";
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

          <FormField<LogMaintenanceFormValues>
            field={{
              name: "nextServiceMileage",
              type: "text",
              label: "Next Service Mileage (km)",
              placeholder: "e.g. 47,000",
              validation: {
                required: "Next service mileage is required",
                pattern: {
                  value: /^[\d,]+$/,
                  message: "Enter a valid mileage",
                },
                validate: (value) => {
                  if (!value) return "Next service mileage is required";
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
        </div>
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
          onClick={onCancel}
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
              {loadingButtonText}
            </span>
          ) : (
            submitButtonText
          )}
        </Button>
      </div>
    </form>
  );
}

