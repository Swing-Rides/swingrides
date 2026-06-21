"use client";

import { useState } from "react";
import {
  useForm,
  Controller,
  useWatch,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { X } from "lucide-react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useListVehcleQuery,
  useLogServiceModalMutation,
} from "@/app/store/services/hostApi";
import { LogServiceModalRequest } from "@/types/logservice.type";
import { IListVehiclesDatum } from "@/types/vehicle.type";

// ─── Types ────────────────────────────────────────────────────────────────────

type NextServiceTab = "mileage" | "date";

type LogMaintenanceFormValues = {
  vehicleName: string;
  serviceType: string;
  serviceDate: string;
  mileageAtService: string;
  cost: string;
  provider: string;
  nextServiceTab: NextServiceTab;
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

  const {
    register,
    handleSubmit,
    control,
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
      nextServiceTab: "mileage",
      nextServiceMileage: "",
      nextServiceDate: "",
      notes: "",
    },
  });

  const mileageAtService = useWatch({ control, name: "mileageAtService" });
  const serviceDate = useWatch({ control, name: "serviceDate" });
  const [addLogsToBackend, { isLoading }] = useLogServiceModalMutation();
  const {
    data,
    isLoading: vehicleLoading,
    isError,
  } = useListVehcleQuery({
    page: 1,
    limit: 40,
  });

  const onSubmit = async (values: LogMaintenanceFormValues) => {
    const payload: LogServiceModalRequest = {
      cost: Number(values.cost.replace(/,/g, "")) || 0,
      mileageAtServiceKm:
        Number(values.mileageAtService.replace(/,/g, "")) || 0,
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
      nextDueMileageKm: values.nextServiceMileage
        ? Number(values.nextServiceMileage.replace(/,/g, ""))
        : undefined,
    };

    const response = await addLogsToBackend(payload).unwrap();
    if (response.success === true) {
      onClose();
    } else {
      console.error("Failed to log service:", response.message);
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
        {/* 1. Vehicle Name */}
        <FormRow
          label="Vehicle Name"
          htmlFor="vehicleName"
          required
          error={errors.vehicleName?.message}
        >
          <Controller
            name="vehicleName"
            control={control}
            rules={{ required: "Vehicle name is required" }}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={vehicleLoading}
              >
                <SelectTrigger className={inputCn(!!errors.vehicleName)}>
                  <SelectValue
                    placeholder={
                      vehicleLoading
                        ? "Loading vehicles..."
                        : "Select a vehicle"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {data?.data?.map((vehicle: IListVehiclesDatum) => (
                    <SelectItem
                      key={vehicle._id || vehicle._id}
                      value={vehicle.name}
                    >
                      {vehicle.name} ({vehicle.make})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormRow>

        {/* 2. Service Type */}
        <FormRow
          label="Service Type"
          htmlFor="serviceType"
          required
          error={errors.serviceType?.message}
        >
          <Input
            id="serviceType"
            type="text"
            placeholder="e.g. Oil Change, Brake Inspection"
            className={inputCn(!!errors.serviceType)}
            {...register("serviceType", {
              required: "Service type is required",
            })}
          />
        </FormRow>

        {/* 3. Service Date + Mileage at Service */}
        <div className="flex flex-col md:flex-row gap-4">
          <FormRow
            label="Service Date"
            htmlFor="serviceDate"
            required
            error={errors.serviceDate?.message}
            className="w-full"
          >
            <DatePickerField<LogMaintenanceFormValues>
              name="serviceDate"
              control={control}
              placeholder="Pick a date"
              error={errors.serviceDate?.message}
              rules={{ required: "Service date is required" }}
            />
          </FormRow>

          <FormRow
            label="Mileage at Service (km)"
            htmlFor="mileageAtService"
            required
            error={errors.mileageAtService?.message}
            className="w-full"
          >
            <Input
              id="mileageAtService"
              type="text"
              placeholder="e.g. 42,000"
              className={inputCn(!!errors.mileageAtService)}
              {...register("mileageAtService", {
                required: "Mileage is required",
                pattern: {
                  value: /^[\d,]+$/,
                  message: "Enter a valid mileage",
                },
              })}
            />
          </FormRow>
        </div>

        {/* 4. Cost + Provider */}
        <div className="flex flex-col md:flex-row gap-4">
          <FormRow
            label="Cost ($)"
            htmlFor="cost"
            required
            error={errors.cost?.message}
            className="w-full"
          >
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[#6B7280] text-sm font-medium pointer-events-none select-none">
                $
              </span>
              <Input
                id="cost"
                type="text"
                placeholder="e.g. 1,200"
                className={cn(inputCn(!!errors.cost), "pl-7")}
                {...register("cost", {
                  required: "Cost is required",
                  pattern: {
                    value: /^[\d,.]+$/,
                    message: "Enter a valid amount",
                  },
                })}
              />
            </div>
          </FormRow>

          <FormRow
            label="Provider / Workshop"
            htmlFor="provider"
            error={errors.provider?.message}
            className="w-full"
          >
            <Input
              id="provider"
              type="text"
              placeholder="e.g. AutoCare Plus"
              className={inputCn(!!errors.provider)}
              {...register("provider")}
            />
          </FormRow>
        </div>

        {/* 5. Next Service Due */}
        <div className="flex flex-col gap-3">
          <span className="text-[#1F2937] text-sm font-semibold font-text">
            Next Service Due <span className="text-[#EF4444]">*</span>
          </span>

          {/* Tab buttons */}
          <div className="flex gap-2">
            {(["mileage", "date"] as NextServiceTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-xs text-sm font-medium font-text transition-colors duration-300 cursor-pointer",
                  activeTab === tab
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 text-[#6B7280] hover:bg-blue-900 hover:text-white",
                )}
              >
                {tab === "mileage" ? "By Mileage" : "By Date"}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "mileage" ? (
            <FormRow
              label="Next Service Mileage (km)"
              htmlFor="nextServiceMileage"
              required
              error={errors.nextServiceMileage?.message}
            >
              <Input
                id="nextServiceMileage"
                type="text"
                placeholder="e.g. 47,000"
                className={inputCn(!!errors.nextServiceMileage)}
                {...register("nextServiceMileage", {
                  required:
                    activeTab === "mileage"
                      ? "Next service mileage is required"
                      : false,
                  validate: (value) => {
                    if (activeTab !== "mileage") return true;
                    const next = parseInt(value.replace(/,/g, ""), 10);
                    const current = parseInt(
                      (mileageAtService ?? "").replace(/,/g, ""),
                      10,
                    );
                    if (isNaN(next)) return "Enter a valid mileage";
                    if (!isNaN(current) && next <= current) {
                      return `Must be greater than current mileage (${mileageAtService} km)`;
                    }
                    return true;
                  },
                })}
              />
            </FormRow>
          ) : (
            <FormRow
              label="Next Service Date"
              htmlFor="nextServiceDate"
              required
              error={errors.nextServiceDate?.message}
            >
              <DatePickerField<LogMaintenanceFormValues>
                name="nextServiceDate"
                control={control}
                placeholder="Pick a date"
                error={errors.nextServiceDate?.message}
                rules={{
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
                }}
                minDate={serviceDate ? new Date(serviceDate) : undefined}
              />
            </FormRow>
          )}
        </div>

        {/* 6. Notes */}
        <FormRow label="Notes" htmlFor="notes" optional>
          <Textarea
            id="notes"
            placeholder="Optional notes about service"
            rows={3}
            className="resize-none border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] rounded-xs placeholder:text-[#9CA3AF]"
            {...register("notes")}
          />
        </FormRow>

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

// ─── Date picker ──────────────────────────────────────────────────────────────

type DatePickerFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  error?: string;
  rules?: Omit<RegisterOptions<T>, "deps" | "validate"> & {
    validate?: (value: string, formValues: T) => boolean | string | undefined;
  };
  minDate?: Date;
};

const DatePickerField = <T extends FieldValues>({
  name,
  control,
  placeholder,
  error,
  rules,
  minDate,
}: DatePickerFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    defaultValue={"" as never}
    rules={rules}
    render={({ field }) => {
      const parsed = field.value ? new Date(field.value) : undefined;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal border-[#E5E7EB] rounded-xs focus-visible:ring-[#1A56DB] font-text text-sm",
                !parsed && "text-[#9CA3AF]",
                error && "border-[#EF4444] focus-visible:ring-[#EF4444]",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-[#9CA3AF] shrink-0" />
              {parsed
                ? format(parsed, "MMM d, yyyy")
                : (placeholder ?? "Pick a date")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-9999" align="start">
            <Calendar
              mode="single"
              selected={parsed}
              onSelect={(date) => field.onChange(date?.toISOString() ?? "")}
              disabled={(date) => {
                if (minDate) {
                  const minDay = new Date(
                    new Date(minDate).setHours(0, 0, 0, 0),
                  );
                  return date < minDay;
                }
                return false;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    }}
  />
);

// ─── Form row ─────────────────────────────────────────────────────────────────

type FormRowProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

const FormRow = ({
  label,
  htmlFor,
  required,
  optional,
  error,
  className,
  children,
}: FormRowProps) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <Label
      htmlFor={htmlFor}
      className="text-[#1F2937] text-sm font-semibold font-text"
    >
      {label}
      {required && <span className="text-[#EF4444] ml-1">*</span>}
      {optional && (
        <span className="text-[#9CA3AF] font-normal ml-1">(Optional)</span>
      )}
    </Label>
    {children}
    {error && (
      <span className="text-[#EF4444] text-xs font-normal font-text flex items-center gap-1">
        <ErrorIcon />
        {error}
      </span>
    )}
  </div>
);

// ─── Input class helper ───────────────────────────────────────────────────────

const inputCn = (hasError: boolean) =>
  cn(
    "border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] w-full rounded-xs",
    hasError && "border-[#EF4444] focus-visible:ring-[#EF4444]",
  );

// ─── Icons ────────────────────────────────────────────────────────────────────

const ErrorIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 1L11 10H1L6 1Z"
      stroke="#EF4444"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6 5V7" stroke="#EF4444" strokeWidth="1" strokeLinecap="round" />
    <circle cx="6" cy="8.5" r="0.5" fill="#EF4444" />
  </svg>
);

const LoadingSpinner = () => (
  <svg
    className="animate-spin w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);
