"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { FieldSeparator } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormField, LoadingSpinner } from "@/components/forms/MainForm";
import VehicleSelectField from "@/components/hostComponents/pages/maintenance/vehicleSelectField";
import { IListVehiclesDatum } from "@/types/vehicle.type";
import {
  DEFAULT_SERVICE_INTERVAL_KM,
  DEFAULT_SERVICE_INTERVAL_MONTHS,
  DUE_SOON_DAYS,
  DUE_SOON_KM,
  SERVICE_TYPE_PRESETS,
} from "@/constants/maintenance";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toNumber = (value?: string): number => {
  const parsed = parseInt(String(value ?? "").replace(/,/g, ""), 10);
  return Number.isNaN(parsed) ? NaN : parsed;
};

/**
 * Plain-language summary of the gap between the service just logged and the
 * next one due, so the host can sanity-check two numbers they typed without
 * doing the arithmetic themselves.
 */
const describeInterval = (
  serviceDate: string,
  nextServiceDate: string,
  mileageAtService: string,
  nextServiceMileage: string,
): string | null => {
  const parts: string[] = [];

  const from = new Date(serviceDate);
  const to = new Date(nextServiceDate);
  if (
    serviceDate &&
    nextServiceDate &&
    !isNaN(from.getTime()) &&
    !isNaN(to.getTime()) &&
    to > from
  ) {
    const days = Math.round(
      (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (days < 45) {
      parts.push(`in ${days} day${days === 1 ? "" : "s"}`);
    } else {
      const months = Math.round(days / 30);
      parts.push(`in about ${months} month${months === 1 ? "" : "s"}`);
    }
  }

  const current = toNumber(mileageAtService);
  const next = toNumber(nextServiceMileage);
  if (!isNaN(current) && !isNaN(next) && next > current) {
    parts.push(`every ${(next - current).toLocaleString()} km`);
  }

  return parts.length > 0 ? `Next service ${parts.join(" · ")}` : null;
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
  const nextServiceDate = useWatch({ control, name: "nextServiceDate" });
  const nextServiceMileage = useWatch({ control, name: "nextServiceMileage" });
  const selectedServiceType = useWatch({ control, name: "serviceType" });

  const intervalSummary = describeInterval(
    serviceDate,
    nextServiceDate,
    mileageAtService,
    nextServiceMileage,
  );

  const canQuickFill =
    Boolean(serviceDate) && !isNaN(toNumber(mileageAtService));

  /**
   * Fills both next-due fields from the service just entered, using the
   * typical interval. Faster than picking a date a year out by hand, and still
   * editable afterwards.
   */
  const applyQuickFill = () => {
    const from = new Date(serviceDate);
    if (!isNaN(from.getTime())) {
      const next = new Date(from);
      next.setMonth(next.getMonth() + DEFAULT_SERVICE_INTERVAL_MONTHS);
      setValue("nextServiceDate", next.toISOString(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    const current = toNumber(mileageAtService);
    if (!isNaN(current)) {
      setValue(
        "nextServiceMileage",
        (current + DEFAULT_SERVICE_INTERVAL_KM).toLocaleString(),
        { shouldValidate: true, shouldDirty: true },
      );
    }

    onValueChange?.();
  };

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

      {/* 2. Service Type — presets for the common cases, free text for the rest.
          The API stores this as free text and filters on exact equality, so
          consistent wording keeps the service-type filter usable. */}
      <div className="flex flex-col gap-2">
        <FormField<LogMaintenanceFormValues>
          field={{
            name: "serviceType",
            type: "text",
            label: "Service Type",
            placeholder: "e.g. Oil Change, Brake Inspection",
            validation: {
              required: "Service type is required",
              minLength: {
                value: 2,
                message: "Service type must be at least 2 characters",
              },
              maxLength: {
                value: 120,
                message: "Service type cannot exceed 120 characters",
              },
            },
          }}
          register={register}
          control={control}
          getValues={getValues}
          errors={errors}
        />
        <div className="flex flex-wrap gap-1.5">
          {SERVICE_TYPE_PRESETS.map((preset) => {
            const isActive = selectedServiceType === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setValue("serviceType", preset, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  onValueChange?.();
                }}
                className={`px-2.5 py-1 rounded-full border text-xs font-medium font-text cursor-pointer transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-700 border-blue-700 text-white"
                    : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-blue-700 hover:text-blue-700"
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>

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
            // Left editable: the odometer reading at the garage is often
            // ahead of whatever is stored on the vehicle record, and locking
            // the field until a vehicle was picked just hid that.
            description:
              "Pre-filled from the vehicle odometer — edit if the garage recorded something different",
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
            step: 0.01,
            description: "Also recorded as a maintenance expense",
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

        {/* The API requires 2–120 characters here and answers with an error if
            it is missing, so validate it rather than letting the submit fail. */}
        <FormField<LogMaintenanceFormValues>
          field={{
            name: "provider",
            type: "text",
            label: "Provider / Workshop",
            placeholder: "e.g. AutoCare Plus",
            validation: {
              required: "Provider / workshop is required",
              minLength: {
                value: 2,
                message: "Provider must be at least 2 characters",
              },
              maxLength: {
                value: 120,
                message: "Provider cannot exceed 120 characters",
              },
            },
          }}
          register={register}
          control={control}
          getValues={getValues}
          errors={errors}
        />
      </div>

      {/* 5. Next Service Due — both a date and a mileage, whichever comes
          first is what flips the vehicle into Due Soon. */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label className="text-zinc-800 text-xs font-semibold font-text uppercase">
            Next Service Due <span className="text-[#EF4444] ml-1">*</span>
          </Label>
          <button
            type="button"
            onClick={applyQuickFill}
            disabled={!canQuickFill}
            className="text-xs font-medium font-text text-blue-700 hover:text-blue-900 cursor-pointer transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {`Use +${DEFAULT_SERVICE_INTERVAL_MONTHS} months / +${DEFAULT_SERVICE_INTERVAL_KM.toLocaleString()} km`}
          </button>
        </div>

        <p className="text-xs text-gray-500 font-text -mt-1">
          {`This vehicle shows as Due Soon within ${DUE_SOON_DAYS} days or ${DUE_SOON_KM.toLocaleString()} km of whichever comes first.`}
        </p>

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
                  const next = toNumber(String(value));
                  const current = toNumber(mileageAtService);
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

        {intervalSummary && (
          <p className="text-xs font-medium font-text text-blue-700">
            {intervalSummary}
          </p>
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
