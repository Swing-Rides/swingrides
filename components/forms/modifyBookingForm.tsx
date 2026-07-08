import { useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { format, differenceInCalendarDays, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle, CalendarIcon, MapPin } from "lucide-react";
import { ModifyFormProps, ModifyFormValues } from "../modifyTripModal/types";
import { RentalRate } from "../pages/profilePages/types";
import { useUpdateBookingMutation } from "@/app/store/services/renterApi";

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

export default function ModifyBookingForm({
  rental,
  onClose,
}: ModifyFormProps) {
  const [updateBooking, { isLoading }] = useUpdateBookingMutation();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ModifyFormValues>({
    mode: "onTouched",
    defaultValues: {
      pickupDate: rental.pickUpDate
        ? new Date(rental.pickUpDate).toISOString()
        : "",
      returnDate: rental.returnDate
        ? new Date(rental.returnDate).toISOString()
        : "",
      pickupStreet: rental.pickupStreet ?? "",
      pickupCity: rental.pickupCity ?? "",
    },
  });

  useEffect(() => {
    reset({
      pickupDate: rental.pickUpDate
        ? new Date(rental.pickUpDate).toISOString()
        : "",

      returnDate: rental.returnDate
        ? new Date(rental.returnDate).toISOString()
        : "",

      pickupStreet: rental.pickupStreet ?? "",

      pickupCity: rental.pickupCity ?? "",
    });
  }, [rental, reset]);

  const pickupDate = useWatch({ control, name: "pickupDate" });
  const returnDate = useWatch({ control, name: "returnDate" });

  const days =
    pickupDate && returnDate
      ? Math.max(
          differenceInCalendarDays(new Date(returnDate), new Date(pickupDate)),
          0,
        )
      : 0;

  const computed = days > 0 ? computeTotal(days, rental.rentalRate) : null;

  const onSubmit = async (values: ModifyFormValues) => {
    try {
      const pickupLocation = `${values.pickupStreet}, ${values.pickupCity}`;
      await updateBooking({
        id: rental.id,
        pickupDate: values.pickupDate,
        returnDate: values.returnDate,
        pickupLocation,
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      {/* Section label */}
      <span className="text-gray-500 text-xs font-semibold font-text uppercase leading-5">
        New Booking Details
      </span>

      {/* Row 1: Pickup Date + Return Date */}
      <div className="grid grid-cols-2 gap-3">
        <FormRow
          label="Pickup Date"
          htmlFor="pickupDate"
          error={errors.pickupDate?.message}
        >
          <DatePickerField
            name="pickupDate"
            control={control}
            placeholder="Pick a date"
            error={errors.pickupDate?.message}
            minDate={today}
            rules={{ required: "Pickup date is required" }}
          />
        </FormRow>

        <FormRow
          label="Return Date"
          htmlFor="returnDate"
          error={errors.returnDate?.message}
        >
          <DatePickerField
            name="returnDate"
            control={control}
            placeholder="Pick a date"
            error={errors.returnDate?.message}
            minDate={
              pickupDate ? addDays(new Date(pickupDate), 1) : addDays(today, 1)
            }
            rules={{
              required: "Return date is required",
              validate: (value: string) => {
                if (!pickupDate || !value) return true;
                return (
                  new Date(value) > new Date(pickupDate) ||
                  "Must be after pickup date"
                );
              },
            }}
          />
        </FormRow>
      </div>

      {/* Row 2: Pickup Location */}
      <FormRow
        label="Street"
        htmlFor="pickupStreet"
        error={errors.pickupStreet?.message}
      >
        <div className="relative flex items-center">
          <span className="absolute left-3 text-[#9CA3AF] pointer-events-none">
            <MapPin className="w-4 h-4" />
          </span>
          <Input
            id="pickupStreet"
            type="text"
            placeholder="e.g. 123 Main Street"
            className={cn(inputCn(!!errors.pickupStreet), "pl-9")}
            {...register("pickupStreet", { required: "Street is required" })}
          />
        </div>
      </FormRow>

      <FormRow
        label="City"
        htmlFor="pickupCity"
        error={errors.pickupCity?.message}
      >
        <Input
          id="pickupCity"
          type="text"
          placeholder="e.g. Austin"
          className={inputCn(!!errors.pickupCity)}
          {...register("pickupCity", { required: "City is required" })}
        />
      </FormRow>

      {/* New duration + total summary */}
      <div className="p-4 bg-indigo-50 rounded-[10px] flex flex-col justify-start items-start gap-1">
        <div className="flex gap-3 justify-between items-center w-full">
          <span className="flex text-blue-700 text-sm font-normal font-text leading-5">
            {computed
              ? `New Duration: ${pluralize(days, "day")} (${computed.breakdown})`
              : "New Duration: — days"}
          </span>
          <span className="flex text-blue-700 text-base font-medium font-text leading-6 text-nowrap">
            {computed
              ? `New Total: ${formatCurrency(computed.total)}`
              : "New Total: $—"}
          </span>
        </div>
        <span className="flex-1 justify-start text-gray-500 text-xs font-normal font-text leading-4">
          Final amount will be confirmed after modification.
        </span>
      </div>

      {/* Warning */}
      <div className="p-4 bg-amber-100 rounded-[10px] flex justify-start items-start gap-2">
        <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
        <span className="block text-amber-800 text-xs font-normal font-text leading-5">
          Modifications within 24 hours of pickup may incur a fee.
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 text-sm font-medium font-text leading-5 border border-gray-500 text-gray-500 rounded-xs py-2 px-4 bg-transparent hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex-1 text-sm font-medium font-text leading-5 border border-blue-700 text-white rounded-xs py-2 px-4 bg-blue-700 hover:bg-blue-900 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting || isLoading ? "Saving..." : "Confirm Changes"}
        </button>
      </div>
    </form>
  );
}

// ─── Date picker ──────────────────────────────────────────────────────────────

type DatePickerFieldProps = {
  name: keyof ModifyFormValues;
  control: ReturnType<typeof useForm<ModifyFormValues>>["control"];
  placeholder?: string;
  error?: string;
  minDate?: Date;
  rules?: object;
};

const DatePickerField = ({
  name,
  control,
  placeholder,
  error,
  minDate,
  rules,
}: DatePickerFieldProps) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field }) => {
      const parsed = field.value ? new Date(field.value as string) : undefined;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal rounded-xs font-text text-sm h-9 px-3",
                !parsed && "text-[#9CA3AF]",
                error
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "border-[#E5E7EB] focus-visible:ring-blue-700",
              )}
            >
              <CalendarIcon className="mr-1.5 h-3.5 w-3.5 text-[#9CA3AF] shrink-0" />
              {parsed
                ? format(parsed, "MMM d, yyyy")
                : (placeholder ?? "Pick a date")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={parsed}
              onSelect={(date) => field.onChange(date?.toISOString() ?? "")}
              disabled={(date) => {
                if (minDate)
                  return (
                    date < new Date(new Date(minDate).setHours(0, 0, 0, 0))
                  );
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

// ─── Shared bits ──────────────────────────────────────────────────────────────

type FormRowProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
};

const FormRow = ({ label, htmlFor, error, children }: FormRowProps) => (
  <div className="flex flex-col gap-1.5">
    <Label
      htmlFor={htmlFor}
      className="text-gray-500 text-xs font-semibold font-text uppercase"
    >
      {label}
    </Label>
    {children}
    {error && (
      <span className="text-red-500 text-xs font-normal font-text">
        {error}
      </span>
    )}
  </div>
);

const inputCn = (hasError: boolean) =>
  cn(
    "rounded-xs border-[#E5E7EB] focus-visible:ring-blue-700 font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] w-full",
    hasError && "border-red-500 focus-visible:ring-red-500",
  );
