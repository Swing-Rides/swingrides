"use client";

import { useMemo, useState, use, Suspense } from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { addDays, format, differenceInCalendarDays } from "date-fns";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CalendarIcon,
  Hash,
  Loader2,
  ShieldCheck,
  Building2,
  FileText,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  TextInput,
  DateTimeInput,
  SelectInput,
  CheckboxInput,
  DateInput,
} from "@/components/forms/MainForm";
import { FormRow } from "@/components/helpers/browseCarPaymentSection.helpers";
import { validators } from "@/components/forms/form.validators";
import { US_STATES } from "@/constants/addressState";
import { useGetPublicVehicleByIdQuery } from "@/app/store/services/publicApi";
import { VehicleSchedule } from "@/types/public-vehicles.type";
import {
  BUFFER_TIME,
  doesRentalPeriodOverlapSchedule as checkRentalPeriodOverlapSchedule,
  isPickupDateTimeAvailable as checkPickupDateTimeAvailable,
  isReturnDateTimeAvailable as checkReturnDateTimeAvailable,
  isScheduleDateDisabled as checkScheduleDateDisabled,
} from "@/lib/vehicleBookingHelpers";

import {
  VehicleOption,
  TaxResult,
  computePricing,
  formatCurrency,
  pluralize,
  AvailabilityNotice,
  AvailabilityPlaceholder,
  TaxAndTotal,
  TaxPlaceholder,
  FormSection,
  SummaryRow,
  EmptySummaryNotice,
  NewBookingFormSkeleton,
} from "../pages/bookingsPageComponents/newBookingFormComponents";

// ─── Form Types ───────────────────────────────────────────────────────────────

export type NewBookingFormValues = {
  vehicleId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  pickupDate: string;
  returnDate: string;
  streetAddress: string;
  pickupCity: string;
  pickupState: string;
  postalCode: string;
  hostProvidesInsurance: boolean;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceExpiryDate: string;
};

export type NewBookingFormProps = {
  formId?: string;
  bookingId?: string;
  fetchVehicles: () => Promise<VehicleOption[]>;
  checkAvailability: (
    vehicleId: string,
    startDate: Date,
    endDate: Date,
  ) => Promise<boolean>;
  fetchTax: (subtotal: number) => Promise<TaxResult>;
  onCancel?: () => void;
  onSubmit: (values: NewBookingFormValues) => void | Promise<void>;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewBookingForm(props: NewBookingFormProps) {
  return (
    <Suspense fallback={<NewBookingFormSkeleton />}>
      <NewBookingFormInner {...props} />
    </Suspense>
  );
}

function NewBookingFormInner({
  formId = "new-booking-form",
  bookingId: bookingIdProp,
  fetchVehicles,
  checkAvailability,
  fetchTax,
  onCancel,
  onSubmit,
}: NewBookingFormProps) {
  // Stable promise — fetched once per mount since fetchVehicles
  // is expected to be a stable reference (useCallback) from the parent
  const vehiclesPromise = useMemo(() => fetchVehicles(), [fetchVehicles]);

  const vehicles = use(vehiclesPromise);

  // Use the bookingId passed from the parent (page already displays it in
  // pageDescription) — only self-generate as a fallback for standalone usage
  const [generatedBookingId] = useState(
    () => `BK-${Date.now().toString(36).toUpperCase()}`,
  );
  const bookingId = bookingIdProp ?? generatedBookingId;

  const defaultValues: NewBookingFormValues = {
    vehicleId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    pickupDate: "",
    returnDate: "",
    streetAddress: "",
    pickupCity: "",
    pickupState: "",
    postalCode: "",
    hostProvidesInsurance: false,
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insuranceExpiryDate: "",
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    clearErrors,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<NewBookingFormValues>({
    mode: "onTouched",
    defaultValues,
  });

  const vehicleId = useWatch({ control, name: "vehicleId" });
  const email = useWatch({ control, name: "email" });
  const pickupDate = useWatch({ control, name: "pickupDate" });
  const returnDate = useWatch({ control, name: "returnDate" });
  const hostProvidesInsurance = useWatch({
    control,
    name: "hostProvidesInsurance",
  });

  const { data: publicVehicleData } = useGetPublicVehicleByIdQuery(
    { id: vehicleId as string },
    { skip: !vehicleId },
  );

  const vehicleSchedule = useMemo<VehicleSchedule[]>(
    () => publicVehicleData?.data?.vehicleSchedule ?? [],
    [publicVehicleData?.data?.vehicleSchedule],
  );

  const isPickupDateTimeAvailable = useMemo(() => {
    return (pickupDateTime: Date) =>
      checkPickupDateTimeAvailable(vehicleSchedule, pickupDateTime, BUFFER_TIME);
  }, [vehicleSchedule]);

  const isReturnDateTimeAvailable = useMemo(() => {
    return (returnDateTime: Date) =>
      checkReturnDateTimeAvailable(vehicleSchedule, returnDateTime, BUFFER_TIME);
  }, [vehicleSchedule]);

  const doesRentalPeriodOverlapSchedule = useMemo(() => {
    return (pickupDateTime: Date, returnDateTime: Date) =>
      checkRentalPeriodOverlapSchedule(
        vehicleSchedule,
        pickupDateTime,
        returnDateTime,
        BUFFER_TIME,
      );
  }, [vehicleSchedule]);

  const isScheduleDateDisabled = useMemo(() => {
    return (date: Date) =>
      checkScheduleDateDisabled(vehicleSchedule, date, BUFFER_TIME);
  }, [vehicleSchedule]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const isSelectedPeriodAvailable = useMemo(() => {
    if (!pickupDate || !returnDate) return false;
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    if (returnD.getTime() <= pickup.getTime()) return false;

    return (
      isPickupDateTimeAvailable(pickup) &&
      isReturnDateTimeAvailable(returnD) &&
      !doesRentalPeriodOverlapSchedule(pickup, returnD)
    );
  }, [
    pickupDate,
    returnDate,
    isPickupDateTimeAvailable,
    isReturnDateTimeAvailable,
    doesRentalPeriodOverlapSchedule,
  ]);

  const selectedVehicle = vehicles.find((v) => v.id === vehicleId);



  const days =
    pickupDate && returnDate
      ? Math.max(
        differenceInCalendarDays(new Date(returnDate), new Date(pickupDate)),
        0,
      )
      : 0;

  const pricing =
    selectedVehicle && days > 0
      ? computePricing(selectedVehicle, days, !!hostProvidesInsurance)
      : null;

  const onFormSubmit = async (values: NewBookingFormValues) => {
    await onSubmit(values);
  };

  // Cancel resets the form back to its empty defaults — it does not navigate away
  const handleCancel = () => {
    reset(defaultValues);
    onCancel?.();
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-6 w-full"
      noValidate
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ── Left panel: booking inputs ──────────────── */}
        <div className="p-4 rounded-[10px] border border-gray-200 bg-white flex flex-col items-start gap-2.5">
          <div className="flex flex-col gap-5 w-full">
            {/* Section 1: Vehicle Selection */}
            <FormSection title="Vehicle Selection">
              <FormRow
                label="Select a Vehicle"
                htmlFor="vehicleId"
                error={errors.vehicleId?.message}
              >
                <SelectInput
                  field={{
                    name: "vehicleId",
                    type: "select",
                    placeholder: "Select a vehicle",
                    options: vehicles.map((v) => ({
                      value: v.id,
                      label: v.name,
                    })),
                    validation: { required: "Please select a vehicle" },
                  }}
                  control={control}
                  error={errors.vehicleId?.message}
                  onValueChange={(selectedId) => {
                    const selected = vehicles.find((v) => v.id === selectedId);
                    if (selected) {
                      if (selected.streetAddress !== undefined) {
                        setValue("streetAddress", selected.streetAddress, {
                          shouldValidate: true,
                        });
                      }
                      if (selected.pickupCity !== undefined) {
                        setValue("pickupCity", selected.pickupCity, {
                          shouldValidate: true,
                        });
                      }
                      if (selected.pickupState !== undefined) {
                        setValue("pickupState", selected.pickupState, {
                          shouldValidate: true,
                        });
                      }
                      if (selected.postalCode !== undefined) {
                        setValue("postalCode", selected.postalCode, {
                          shouldValidate: true,
                        });
                      }
                    }
                  }}
                />
              </FormRow>
            </FormSection>

            <Separator />

            {/* Section 2: Renter Details */}
            <FormSection title="Renter Details">
              <div className="grid grid-cols-2 gap-3">
                <FormRow
                  label="First Name"
                  htmlFor="firstName"
                  error={errors.firstName?.message}
                >
                  <TextInput
                    field={{
                      name: "firstName",
                      type: "text",
                      placeholder: "John",
                      icon: <User className="w-4 h-4" />,
                      validation: validators.name("First name"),
                    }}
                    register={register}
                    error={errors.firstName?.message}
                  />
                </FormRow>
                <FormRow
                  label="Last Name"
                  htmlFor="lastName"
                  error={errors.lastName?.message}
                >
                  <TextInput
                    field={{
                      name: "lastName",
                      type: "text",
                      placeholder: "Smith",
                      icon: <User className="w-4 h-4" />,
                      validation: validators.name("Last name"),
                    }}
                    register={register}
                    error={errors.lastName?.message}
                  />
                </FormRow>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormRow
                  label="Email Address"
                  htmlFor="email"
                  error={errors.email?.message}
                >
                  <TextInput
                    field={{
                      name: "email",
                      type: "email",
                      placeholder: "john@email.com",
                      icon: <Mail className="w-4 h-4" />,
                      validation: validators.email(),
                    }}
                    register={register}
                    error={errors.email?.message}
                  />
                </FormRow>
                <FormRow
                  label="Phone Number"
                  htmlFor="phoneNumber"
                  error={errors.phoneNumber?.message}
                >
                  <TextInput
                    field={{
                      name: "phoneNumber",
                      type: "tel",
                      placeholder: "+1 555-123-4567",
                      icon: <Phone className="w-4 h-4" />,
                      validation: validators.phone(),
                    }}
                    register={register}
                    error={errors.phoneNumber?.message}
                  />
                </FormRow>
              </div>
            </FormSection>

            <Separator />

            {/* Section 3: Booking Dates */}
            <FormSection title="Booking Dates">
              <div className="grid grid-cols-2 gap-3">
                <FormRow
                  label="Pick-up Date & Time"
                  htmlFor="pickupDate"
                  error={errors.pickupDate?.message}
                >
                  <DateTimeInput
                    field={{
                      name: "pickupDate",
                      type: "datetime",
                      placeholder: "Pick a date & time",
                      minDate: today,
                      isDateDisabled: isScheduleDateDisabled,
                      validation: {
                        required: "Pick-up date is required",
                        validate: (value: string) => {
                          if (!value) return true;

                          const selected = new Date(value);

                          // Check if selected pickup datetime conflicts with any scheduled booking
                          if (!isPickupDateTimeAvailable(selected)) {
                            return `This vehicle is unavailable at this time. Please select another date or time.`;
                          }

                          return true;
                        },
                      },
                    }}
                    control={control}
                    error={errors.pickupDate?.message}
                  />
                </FormRow>
                <FormRow
                  label="Return Date & Time"
                  htmlFor="returnDate"
                  error={errors.returnDate?.message}
                >
                  <DateTimeInput
                    field={{
                      name: "returnDate",
                      type: "datetime",
                      placeholder: "Pick a date & time",
                      minDate: pickupDate
                        ? addDays(new Date(pickupDate), 1)
                        : today,
                      isDateDisabled: isScheduleDateDisabled,
                      validation: {
                        required: "Return date is required",
                        validate: (value: string) => {
                          if (!pickupDate || !value) return true;

                          const selected = new Date(value);
                          const pickup = new Date(pickupDate);

                          // Must be after pick-up date
                          if (selected.getTime() <= pickup.getTime()) {
                            return "Must be after pick-up date";
                          }

                          // Check if the entire rental period overlaps with any scheduled booking
                          if (doesRentalPeriodOverlapSchedule(pickup, selected)) {
                            return `This vehicle is already booked during part of your requested dates. Please select different dates.`;
                          }

                          // Check if selected return datetime conflicts with any scheduled booking
                          if (!isReturnDateTimeAvailable(selected)) {
                            return `This vehicle is unavailable at this return time. Please select another date or time.`;
                          }

                          return true;
                        },
                      },
                    }}
                    control={control}
                    error={errors.returnDate?.message}
                  />
                </FormRow>
              </div>

              {/* Live availability notice */}
              {selectedVehicle && pickupDate && returnDate && days > 0 && (
                <AvailabilityNotice
                  vehicleName={selectedVehicle.name}
                  startDate={new Date(pickupDate)}
                  endDate={new Date(returnDate)}
                  isAvailable={isSelectedPeriodAvailable}
                />
              )}
            </FormSection>

            <Separator />

            {/* Section 4: Pickup Location */}
            <FormSection title="Pickup Location">
              <FormRow
                label="Street Address"
                htmlFor="streetAddress"
                error={errors.streetAddress?.message}
              >
                <TextInput
                  field={{
                    name: "streetAddress",
                    type: "text",
                    placeholder: "e.g. 123 Main Street",
                    icon: <MapPin className="w-4 h-4" />,
                    validation: validators.required("Street address"),
                  }}
                  register={register}
                  error={errors.streetAddress?.message}
                />
              </FormRow>

              <div className="grid grid-cols-3 gap-3">
                <FormRow
                  label="City"
                  htmlFor="pickupCity"
                  error={errors.pickupCity?.message}
                >
                  <TextInput
                    field={{
                      name: "pickupCity",
                      type: "text",
                      placeholder: "e.g. Austin",
                      validation: validators.required("City"),
                    }}
                    register={register}
                    error={errors.pickupCity?.message}
                  />
                </FormRow>
                <FormRow
                  label="State"
                  htmlFor="pickupState"
                  error={errors.pickupState?.message}
                >
                  <SelectInput
                    field={{
                      name: "pickupState",
                      type: "select",
                      placeholder: "Select state",
                      options: US_STATES,
                      validation: validators.required("State"),
                    }}
                    control={control}
                    error={errors.pickupState?.message}
                  />
                </FormRow>
                <FormRow
                  label="Postal Code"
                  htmlFor="postalCode"
                  error={errors.postalCode?.message}
                >
                  <TextInput
                    field={{
                      name: "postalCode",
                      type: "text",
                      placeholder: "e.g. 73301",
                      validation: validators.required("Postal code"),
                    }}
                    register={register}
                    error={errors.postalCode?.message}
                  />
                </FormRow>
              </div>
            </FormSection>

            <Separator />

            {/* Section 5: Insurance */}
            <FormSection title="Insurance">
              <CheckboxInput
                field={{
                  name: "hostProvidesInsurance",
                  type: "checkbox",
                  className:
                    "p-3 rounded-[10px] border border-gray-200 cursor-pointer gap-2.5",
                  label: (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[#1F2937] text-sm font-medium font-text flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-700" />
                        The host provides the insurance
                      </span>
                      <span className="text-[#6B7280] text-xs font-normal font-text">
                        {selectedVehicle
                          ? `Adds a flat insurance fee of ${formatCurrency(selectedVehicle.insuranceDailyRate)}/day for the exact rental duration.`
                          : "If left unchecked, the renter's own insurance details are required below."}
                      </span>
                    </div>
                  ),
                }}
                control={control}
                onCheckedChange={async (checked) => {
                  setValue("hostProvidesInsurance", checked);
                  if (checked) {
                    clearErrors([
                      "insuranceProvider",
                      "insurancePolicyNumber",
                      "insuranceExpiryDate",
                    ]);
                  } else {
                    await trigger([
                      "insuranceProvider",
                      "insurancePolicyNumber",
                      "insuranceExpiryDate",
                    ]);
                  }
                }}
              />

              {!hostProvidesInsurance && (
                <>
                  <FormRow
                    label="Insurance Provider"
                    htmlFor="insuranceProvider"
                    error={errors.insuranceProvider?.message}
                  >
                    <TextInput
                      field={{
                        name: "insuranceProvider",
                        type: "text",
                        placeholder: "e.g. State Farm",
                        icon: <Building2 className="w-4 h-4" />,
                        validation: {
                          required: !hostProvidesInsurance
                            ? "Insurance provider is required"
                            : false,
                        },
                      }}
                      register={register}
                      error={errors.insuranceProvider?.message}
                    />
                  </FormRow>

                  <div className="grid grid-cols-2 gap-3">
                    <FormRow
                      label="Policy Number"
                      htmlFor="insurancePolicyNumber"
                      error={errors.insurancePolicyNumber?.message}
                    >
                      <TextInput
                        field={{
                          name: "insurancePolicyNumber",
                          type: "text",
                          placeholder: "e.g. POL-123456",
                          className: "uppercase",
                          icon: <FileText className="w-4 h-4" />,
                          validation: {
                            required: !hostProvidesInsurance
                              ? "Policy number is required"
                              : false,
                            setValueAs: (v: string) =>
                              typeof v === "string" ? v.toUpperCase() : v,
                          },
                        }}
                        register={register}
                        error={errors.insurancePolicyNumber?.message}
                      />
                    </FormRow>
                    <FormRow
                      label="Expiry Date"
                      htmlFor="insuranceExpiryDate"
                      error={errors.insuranceExpiryDate?.message}
                    >
                      <DateInput
                        field={{
                          name: "insuranceExpiryDate",
                          type: "date",
                          placeholder: "Pick a date",
                          validation: {
                            required: !hostProvidesInsurance
                              ? "Expiry date is required"
                              : false,
                            validate: (value: string) => {
                              if (hostProvidesInsurance) return true;
                              if (!value) return true;
                              const minValidDate = new Date();
                              minValidDate.setHours(0, 0, 0, 0);
                              minValidDate.setDate(
                                minValidDate.getDate() + 30,
                              );
                              return (
                                new Date(value) > minValidDate ||
                                "Expiry date must be more than 30 days from today"
                              );
                            },
                          },
                        }}
                        control={control}
                        error={errors.insuranceExpiryDate?.message}
                      />
                    </FormRow>
                  </div>
                </>
              )}
            </FormSection>
          </div>
        </div>

        {/* ── Right panel: booking summary ────────────── */}
        <div className="p-4 rounded-[10px] border border-gray-200 bg-white flex flex-col items-start gap-2.5">
          <div className="flex flex-col gap-5 w-full">
            <h2 className="text-neutral-950 text-base font-semibold font-text">
              Booking Summary
            </h2>

            {!selectedVehicle ? (
              <EmptySummaryNotice message="Select a vehicle to see pricing details." />
            ) : (
              <>
                {/* Section 1: Vehicle */}
                <div className="flex items-center gap-3 w-full">
                  <div className="relative size-14 rounded-md overflow-clip shrink-0 bg-[#F3F4F6]">
                    <Image
                      src={selectedVehicle.imageUrl}
                      alt={selectedVehicle.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#1F2937] text-sm font-semibold font-text">
                      {selectedVehicle.name}
                    </span>
                    <span className="text-[#6B7280] text-xs font-normal font-text">
                      {pricing?.displayPriceTier === "week"
                        ? `${formatCurrency(selectedVehicle.weeklyPrice)}/week`
                        : pricing?.displayPriceTier === "month"
                          ? `${formatCurrency(selectedVehicle.monthlyPrice)}/month`
                          : `${formatCurrency(selectedVehicle.dailyPrice)}/day`}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Section 2: Itemized breakdown */}
                {pricing ? (
                  <div className="flex flex-col gap-2 w-full">
                    <SummaryRow
                      label={`Dates (${pricing.durationLabel})`}
                      value={`${format(new Date(pickupDate), "MMM d")} – ${format(new Date(returnDate), "MMM d, yyyy")}`}
                    />
                    {pricing.baseLineItems.map((item, index) => (
                      <SummaryRow
                        key={`base-${index}`}
                        label={
                          index === 0 ? `Base rate: ${item.label}` : item.label
                        }
                        value={formatCurrency(item.total)}
                      />
                    ))}
                    {pricing.insuranceFee > 0 && (
                      <SummaryRow
                        label={`Host insurance (${pluralize(days, "day")} @ ${formatCurrency(selectedVehicle.insuranceDailyRate)}/day)`}
                        value={formatCurrency(pricing.insuranceFee)}
                      />
                    )}
                  </div>
                ) : (
                  <EmptySummaryNotice message="Select pickup and return dates to calculate pricing." />
                )}

                {pricing && (
                  <>
                    <Separator />

                    {/* Section 3: Subtotal + Tax, Section 4: Total */}
                    <Suspense
                      fallback={<TaxPlaceholder subtotal={pricing.subtotal} />}
                    >
                      <TaxAndTotal
                        subtotal={pricing.subtotal}
                        fetchTax={fetchTax}
                      />
                    </Suspense>
                  </>
                )}

                <Separator />

                {/* Section 5: Booking reference */}
                <div className="p-3 bg-indigo-50 rounded-[10px] flex flex-col justify-center items-center gap-1 w-full">
                  <span className="text-indigo-700 text-xs font-medium font-text text-center">
                    Auto-generated Reference
                  </span>
                  <span className="text-indigo-900 text-sm font-bold font-text flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" />
                    {bookingId}
                  </span>
                </div>

                {/* Section 6: Notification notices */}
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#6B7280] shrink-0" />
                    <span className="text-[#6B7280] text-xs font-normal font-text">
                      Confirmation email will be sent to{" "}
                      {email || "the renter\u2019s email"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#6B7280] shrink-0" />
                    <span className="text-[#6B7280] text-xs font-normal font-text">
                      Host notification will be sent to your account.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#6B7280] shrink-0" />
                    <span className="text-[#6B7280] text-xs font-normal font-text">
                      You will continue to checkout before the booking is created.
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Cancel + Create Booking (bottom) ── */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="px-6 py-2 border-red-500 text-red-500 hover:text-white hover:bg-red-700 rounded-xs font-medium font-text cursor-pointer transition-colors duration-300"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 border-blue-500 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Preparing...
            </span>
          ) : (
            "Continue to Checkout"
          )}
        </Button>
      </div>
    </form>
  );
}