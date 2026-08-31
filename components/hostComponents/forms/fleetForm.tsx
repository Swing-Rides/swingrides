"use client";

import { useState, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import {
  Info,
  Fingerprint,
  Banknote,
  SlidersVertical,
  MapPin,
  Camera,
  Upload,
  X,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  TextInput,
  SelectInput,
  DateInput,
  TextareaInput,
  DollarInput,
} from "@/components/forms/MainForm";
import { validateVin } from "@/lib/vinChecker";
import { US_STATES } from "@/constants/addressState";
import Link from "next/link";
import { INSURANCE_LINK } from "@/constants/constant";
import { useGetHostProfileQuery } from "@/app/store/services/hostApi";

// ─── Constants ────────────────────────────────────────────────────────────────

const VEHICLE_TYPES = [
  "Sedan",
  "SUV",
  "Truck",
  "Coupe",
  "Convertible",
  "Van",
  "Hatchback",
  "Minivan",
  "Pickup Truck",
  "Sports Car",
  "Luxury",
  "Electric",
];

const TRANSMISSION_OPTIONS = ["Automatic", "Manual", "CVT"];
const FUEL_TYPE_OPTIONS = ["Diesel", "Electric", "Gas/Petrol"];

const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE_MB = 5;

// ─── Types ────────────────────────────────────────────────────────────────────

export type FleetFormValues = {
  vehicleName: string;
  make: string;
  model: string;
  year: number | "";
  color: string;
  vehicleType: string;

  insuranceCarrier: string;
  insurancePolicyNumber: string;
  insuranceExpiration: string;
  dailyInsuranceFee: number | "";

  licensePlate: string;
  vin: string;

  priceDaily: number | "";
  priceWeekly: number | "";
  priceMonthly: number | "";

  status: string;
  instantlyAvailable: boolean;

  transmission: string;
  seats: number | "";
  mileage: number | "";
  fuelType: string;
  doors: number | "";

  pickupAddressStreet: string;
  city: string;
  pickupAddressState: string;
  zipCode: string;

  vehicleImages?: FileList;
  vehicleImageUrls?: string[];
  description: string;
  pickupInstructions: string;
};

type FleetFormProps = {
  formId: string;
  defaultValues?: Partial<FleetFormValues>;
  onSubmit: (values: FleetFormValues) => void | Promise<void>;
};

const FALLBACK_DEFAULTS: FleetFormValues = {
  vehicleName: "",
  make: "",
  model: "",
  year: "",
  color: "",
  vehicleType: "",
  insuranceCarrier: "",
  insurancePolicyNumber: "",
  insuranceExpiration: "",
  dailyInsuranceFee: "",
  licensePlate: "",
  vin: "",
  priceDaily: "",
  priceWeekly: "",
  priceMonthly: "",
  status: "",
  instantlyAvailable: true,
  transmission: "",
  seats: "",
  mileage: "",
  fuelType: "",
  doors: "",
  pickupAddressStreet: "",
  city: "",
  pickupAddressState: "",
  zipCode: "",
  description: "",
  pickupInstructions: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function FleetForm({
  formId,
  defaultValues,
  onSubmit,
}: FleetFormProps) {
  const { data: hostProfileResponse } = useGetHostProfileQuery();
  const hostInsurance = hostProfileResponse?.data?.insurance;
  const isInsuranceConnected = Boolean(hostInsurance?.connected);

  const [useCustomInsurance, setUseCustomInsurance] = useState(false);

  const hostInsuranceCarrier =
    hostInsurance?.insuranceCarrier ||
    hostInsurance?.carrier ||
    hostInsurance?.provider ||
    hostInsurance?.provvider ||
    "ABI Insurance";
  const hostInsurancePolicyNumber =
    hostInsurance?.insurancePolicyNumber || hostInsurance?.policyNumber || "";
  const hostInsuranceExpiration =
    hostInsurance?.insuranceExpiration ||
    hostInsurance?.expirationDate ||
    hostInsurance?.expiryDate ||
    "";
  const hostDailyInsuranceFee =
    hostInsurance?.dailyInsuranceFee ?? hostInsurance?.fee ?? "";

  const initialValues = useMemo(() => {
    const connectedDefaults =
      isInsuranceConnected && !useCustomInsurance
        ? {
          insuranceCarrier: hostInsuranceCarrier,
          insurancePolicyNumber: hostInsurancePolicyNumber,
          insuranceExpiration: hostInsuranceExpiration,
          ...(hostDailyInsuranceFee !== ""
            ? { dailyInsuranceFee: hostDailyInsuranceFee }
            : {}),
        }
        : {};

    return {
      ...FALLBACK_DEFAULTS,
      ...connectedDefaults,
      ...defaultValues,
    };
  }, [
    isInsuranceConnected,
    useCustomInsurance,
    hostInsuranceCarrier,
    hostInsurancePolicyNumber,
    hostInsuranceExpiration,
    hostDailyInsuranceFee,
    defaultValues,
  ]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FleetFormValues>({
    mode: "onTouched",
    defaultValues: initialValues,
    values: initialValues,
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const handleUseDifferentInsurance = () => {
    setUseCustomInsurance(true);
    setValue("insuranceCarrier", "", { shouldDirty: true });
    setValue("insurancePolicyNumber", "", { shouldDirty: true });
    setValue("insuranceExpiration", "", { shouldDirty: true });
    setValue("dailyInsuranceFee", "", { shouldDirty: true });
  };

  const handleUseConnectedInsurance = () => {
    setUseCustomInsurance(false);
    setValue("insuranceCarrier", hostInsuranceCarrier, { shouldDirty: true });
    setValue("insurancePolicyNumber", hostInsurancePolicyNumber, {
      shouldDirty: true,
    });
    setValue("insuranceExpiration", hostInsuranceExpiration, {
      shouldDirty: true,
    });
    if (hostDailyInsuranceFee !== "") {
      setValue("dailyInsuranceFee", hostDailyInsuranceFee, {
        shouldDirty: true,
      });
    }
  };

  const [imageUrls, setImageUrls] = useState<string[]>(
    defaultValues?.vehicleImageUrls ?? [],
  );

  const onFormSubmit = async (values: FleetFormValues) => {
    await onSubmit({
      ...values,
      vehicleImageUrls: imageUrls,
    });
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-6 w-full"
      noValidate
    >
      {/* ── Top section: left + right columns ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left column ──────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Cell 1: Vehicle Information */}
          <Cell icon={<Info />} title="Vehicle Information">
            <FormRow
              label="Vehicle Name"
              htmlFor="vehicleName"
              error={errors.vehicleName?.message}
            >
              <TextInput
                field={{
                  name: "vehicleName",
                  type: "text",
                  placeholder: "e.g. Luxury Tesla Model S",
                  validation: { required: "Vehicle name is required" },
                }}
                register={register}
                error={errors.vehicleName?.message}
              />
            </FormRow>

            <div className="grid grid-cols-2 gap-3">
              <FormRow
                label="Manufacturer"
                htmlFor="make"
                error={errors.make?.message}
              >
                <TextInput
                  field={{
                    name: "make",
                    type: "text",
                    placeholder: "Tesla",
                    validation: { required: "Make is required" },
                  }}
                  register={register}
                  error={errors.make?.message}
                />
              </FormRow>
              <FormRow
                label="Model"
                htmlFor="model"
                error={errors.model?.message}
              >
                <TextInput
                  field={{
                    name: "model",
                    type: "text",
                    placeholder: "Model S",
                    validation: { required: "Model is required" },
                  }}
                  register={register}
                  error={errors.model?.message}
                />
              </FormRow>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <FormRow
                label="Year"
                htmlFor="year"
                error={errors.year?.message}
              >
                <TextInput
                  field={{
                    name: "year",
                    type: "number",
                    placeholder: "2025",
                    validation: {
                      required: "Year is required",
                      valueAsNumber: true,
                      min: { value: 1980, message: "Enter a valid year" },
                      max: {
                        value: new Date().getFullYear() + 1,
                        message: "Enter a valid year",
                      },
                    },
                  }}
                  register={register}
                  error={errors.year?.message}
                />
              </FormRow>
              <FormRow
                label="Color"
                htmlFor="color"
                error={errors.color?.message}
              >
                <TextInput
                  field={{
                    name: "color",
                    type: "text",
                    placeholder: "White",
                    validation: { required: "Color is required" },
                  }}
                  register={register}
                  error={errors.color?.message}
                />
              </FormRow>
              <FormRow
                label="Vehicle Type"
                htmlFor="vehicleType"
                error={errors.vehicleType?.message}
              >
                <SelectInput
                  field={{
                    name: "vehicleType",
                    type: "select",
                    placeholder: "Select",
                    options: VEHICLE_TYPES.map((type) => ({
                      value: type,
                      label: type,
                    })),
                    validation: { required: "Select a vehicle type" },
                  }}
                  control={control}
                  error={errors.vehicleType?.message}
                />
              </FormRow>
            </div>
          </Cell>

          {/* Cell 2: Insurance Details */}
          <Cell icon={<Info />} title="Insurance Details">
            {isInsuranceConnected && !useCustomInsurance ? (
              /* ABI Period X Policy Connected Banner (Green) */
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F0FDF4] border border-green-200">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-8 text-green-600 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-semibold text-sm sm:text-base leading-tight">
                      ABI Period X policy connected
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm mt-0.5">
                      Add this vehicle to your existing policy before listing it.
                    </span>
                  </div>
                </div>

                <Link
                  href={INSURANCE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Add This Vehicle to ABI Policy"
                  className="w-full sm:w-auto text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 shrink-0 whitespace-nowrap"
                >
                  Add This Vehicle to ABI Policy
                </Link>
              </div>
            ) : (
              /* ABI Insurance Partner Banner (Blue) */
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F4F8FF] border border-blue-100">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-8 text-blue-600 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-semibold text-sm sm:text-base leading-tight">
                      Need coverage for this vehicle?
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm mt-0.5">
                      Get Period X + Period Z coverage directly from ABI.
                    </span>
                  </div>
                </div>

                <Link
                  href={INSURANCE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Get an ABI Quote"
                  className="w-full sm:w-auto text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 shrink-0 whitespace-nowrap"
                >
                  Get an ABI Quote
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <FormRow
                label="Carrier / Company"
                htmlFor="insuranceCarrier"
                error={errors.insuranceCarrier?.message}
              >
                <TextInput
                  field={{
                    name: "insuranceCarrier",
                    type: "text",
                    placeholder: "e.g. Progressive",
                  }}
                  register={register}
                  error={errors.insuranceCarrier?.message}
                />
              </FormRow>
              <FormRow
                label="Policy Number"
                htmlFor="insurancePolicyNumber"
                error={errors.insurancePolicyNumber?.message}
              >
                <TextInput
                  field={{
                    name: "insurancePolicyNumber",
                    type: "text",
                    placeholder: "e.g. PLY-209384",
                    className: "uppercase",
                    validation: {
                      setValueAs: (v: string) =>
                        typeof v === "string" ? v.toUpperCase() : v,
                    },
                  }}
                  register={register}
                  error={errors.insurancePolicyNumber?.message}
                />
              </FormRow>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <FormRow
                label="Expiration Date"
                htmlFor="insuranceExpiration"
                error={errors.insuranceExpiration?.message}
              >
                <DateInput
                  field={{
                    name: "insuranceExpiration",
                    type: "date",
                    placeholder: "Pick expiration date",
                  }}
                  control={control}
                  error={errors.insuranceExpiration?.message}
                />
              </FormRow>
              <FormRow
                label="Daily Insurance Fee"
                htmlFor="dailyInsuranceFee"
                error={errors.dailyInsuranceFee?.message}
              >
                <DollarInput
                  field={{
                    name: "dailyInsuranceFee",
                    type: "number-dollar",
                    placeholder: "0.00",
                    step: 0.01,
                    min: 0,
                    validation: {
                      required: "Daily insurance fee rate is required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Cannot be negative" },
                    },
                  }}
                  register={register}
                  error={errors.dailyInsuranceFee?.message}
                />
              </FormRow>
            </div>

            {isInsuranceConnected && !useCustomInsurance ? (
              <div>
                <button
                  type="button"
                  onClick={handleUseDifferentInsurance}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                >
                  Use Different Insurance
                </button>
              </div>
            ) : isInsuranceConnected && useCustomInsurance ? (
              <div>
                <button
                  type="button"
                  onClick={handleUseConnectedInsurance}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                >
                  Use Connected ABI Insurance
                </button>
              </div>
            ) : null}
          </Cell>

          {/* Cell 3: Identification */}
          <Cell icon={<Fingerprint />} title="Identification">
            <div className="grid grid-cols-2 gap-3">
              <FormRow
                label="License Plate"
                htmlFor="licensePlate"
                error={errors.licensePlate?.message}
              >
                <TextInput
                  field={{
                    name: "licensePlate",
                    type: "text",
                    placeholder: "e.g. ABC-1234",
                    className: "uppercase",
                    validation: {
                      required: "License plate is required",
                      setValueAs: (v: string) =>
                        typeof v === "string" ? v.toUpperCase() : v,
                    },
                  }}
                  register={register}
                  error={errors.licensePlate?.message}
                />
              </FormRow>
              <FormRow label="VIN" htmlFor="vin" error={errors.vin?.message}>
                <TextInput
                  field={{
                    name: "vin",
                    type: "text",
                    placeholder: "e.g. 1FA6P8TD5M5100001",
                    className: "uppercase",
                    validation: {
                      required: "VIN is required",
                      setValueAs: (v: string) =>
                        typeof v === "string" ? v.toUpperCase() : v,
                      validate: (val: string) => {
                        if (!val) return "VIN is required";
                        const result = validateVin(val);
                        if (!result.valid) {
                          return result.errors[0] || "Invalid VIN number. Please double-check and try again.";
                        }
                        return true;
                      },
                    },
                  }}
                  register={register}
                  error={errors.vin?.message}
                />
              </FormRow>
            </div>
          </Cell>

          {/* Cell 4: Pricing */}
          <Cell icon={<Banknote />} title="Pricing (USD)">
            <div className="grid grid-cols-3 gap-3">
              <FormRow
                label="Daily"
                htmlFor="priceDaily"
                error={errors.priceDaily?.message}
              >
                <DollarInput
                  field={{
                    name: "priceDaily",
                    type: "number-dollar",
                    placeholder: "0.00",
                    step: 0.01,
                    min: 0,
                    validation: {
                      required: "Daily rate is required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Cannot be negative" },
                    },
                  }}
                  register={register}
                  error={errors.priceDaily?.message}
                />
              </FormRow>
              <FormRow
                label="Weekly"
                htmlFor="priceWeekly"
                error={errors.priceWeekly?.message}
              >
                <DollarInput
                  field={{
                    name: "priceWeekly",
                    type: "number-dollar",
                    placeholder: "0.00",
                    step: 0.01,
                    min: 0,
                    validation: {
                      required: "Weekly rate is required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Cannot be negative" },
                    },
                  }}
                  register={register}
                  error={errors.priceWeekly?.message}
                />
              </FormRow>
              <FormRow
                label="Monthly"
                htmlFor="priceMonthly"
                error={errors.priceMonthly?.message}
              >
                <DollarInput
                  field={{
                    name: "priceMonthly",
                    type: "number-dollar",
                    placeholder: "0.00",
                    step: 0.01,
                    min: 0,
                    validation: {
                      required: "Monthly rate is required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Cannot be negative" },
                    },
                  }}
                  register={register}
                  error={errors.priceMonthly?.message}
                />
              </FormRow>
            </div>
          </Cell>
        </div>

        {/* ── Right column ─────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Cell 2: Vehicle Specs */}
          <Cell icon={<SlidersVertical />} title="Vehicle Specs">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <FormRow
                label="Transmission"
                htmlFor="transmission"
                error={errors.transmission?.message}
              >
                <SelectInput
                  field={{
                    name: "transmission",
                    type: "select",
                    placeholder: "Select",
                    options: TRANSMISSION_OPTIONS.map((opt) => ({
                      value: opt,
                      label: opt,
                    })),
                    validation: { required: "Select transmission" },
                  }}
                  control={control}
                  error={errors.transmission?.message}
                />
              </FormRow>
              <FormRow
                label="Seats"
                htmlFor="seats"
                error={errors.seats?.message}
              >
                <TextInput
                  field={{
                    name: "seats",
                    type: "number",
                    placeholder: "5",
                    validation: {
                      required: "Seats is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Must be at least 1" },
                    },
                  }}
                  register={register}
                  error={errors.seats?.message}
                />
              </FormRow>
              <FormRow
                label="Mileage (mi)"
                htmlFor="mileage"
                error={errors.mileage?.message}
              >
                <TextInput
                  field={{
                    name: "mileage",
                    type: "number",
                    placeholder: "e.g. 12000",
                    validation: {
                      required: "Mileage is required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Cannot be negative" },
                    },
                  }}
                  register={register}
                  error={errors.mileage?.message}
                />
              </FormRow>
              <FormRow
                label="Fuel Type"
                htmlFor="fuelType"
                error={errors.fuelType?.message}
              >
                <SelectInput
                  field={{
                    name: "fuelType",
                    type: "select",
                    placeholder: "Select",
                    options: FUEL_TYPE_OPTIONS.map((opt) => ({
                      value: opt,
                      label: opt,
                    })),
                    validation: { required: "Select fuel type" },
                  }}
                  control={control}
                  error={errors.fuelType?.message}
                />
              </FormRow>
              <FormRow
                label="Doors"
                htmlFor="doors"
                error={errors.doors?.message}
              >
                <TextInput
                  field={{
                    name: "doors",
                    type: "number",
                    placeholder: "4",
                    validation: {
                      required: "Number of doors is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Must be at least 1" },
                    },
                  }}
                  register={register}
                  error={errors.doors?.message}
                />
              </FormRow>
            </div>
          </Cell>

          {/* Cell 3: Location */}
          <Cell icon={<MapPin />} title="Pickup Location Address">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <FormRow
                label="Street"
                htmlFor="pickupAddressStreet"
                error={errors.pickupAddressStreet?.message}
              >
                <TextInput
                  field={{
                    name: "pickupAddressStreet",
                    type: "text",
                    placeholder: "e.g. 123 Main Street",
                    validation: { required: "Pickup address is required" },
                  }}
                  register={register}
                  error={errors.pickupAddressStreet?.message}
                />
              </FormRow>
              <FormRow
                label="City"
                htmlFor="city"
                error={errors.city?.message}
              >
                <TextInput
                  field={{
                    name: "city",
                    type: "text",
                    placeholder: "e.g. Bronx",
                    validation: { required: "City is required" },
                  }}
                  register={register}
                  error={errors.city?.message}
                />
              </FormRow>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <FormRow
                label="State"
                htmlFor="pickupAddressState"
                error={errors.pickupAddressState?.message}
              >
                <SelectInput
                  field={{
                    name: "pickupAddressState",
                    type: "select",
                    placeholder: "Select state",
                    options: US_STATES,
                    validation: { required: "Pickup state is required" },
                  }}
                  control={control}
                  error={errors.pickupAddressState?.message}
                />
              </FormRow>
              <FormRow
                label="Zip Code"
                htmlFor="zipCode"
                error={errors.zipCode?.message}
              >
                <TextInput
                  field={{
                    name: "zipCode",
                    type: "text",
                    placeholder: "e.g. 10451",
                    validation: { required: "Zip code is required" },
                  }}
                  register={register}
                  error={errors.zipCode?.message}
                />
              </FormRow>
            </div>
          </Cell>
        </div>
      </div>

      {/* ── Bottom section: Media & Information (full width) ── */}
      <Cell icon={<Camera />} title="Media & Information">
        <ImagesUpload
          register={register}
          error={errors.vehicleImages?.message as string}
          onUpload={setImageUrls}
          initialUrls={defaultValues?.vehicleImageUrls ?? []}
        />

        <FormRow
          label="Vehicle Description"
          htmlFor="description"
          error={errors.description?.message}
        >
          <TextareaInput
            field={{
              name: "description",
              type: "textarea",
              placeholder:
                "Describe the vehicle's features, unique selling points, and any specific terms...",
              height: 120,
              validation: { required: "Description is required" },
            }}
            register={register}
            error={errors.description?.message}
          />
        </FormRow>

        <FormRow
          label="Pickup Instructions"
          htmlFor="pickupInstructions"
          error={errors.pickupInstructions?.message}
        >
          <TextareaInput
            field={{
              name: "pickupInstructions",
              type: "textarea",
              placeholder:
                "Add any instructions for renters about pickup location, key collection, parking, or vehicle access...",
              height: 120,
            }}
            register={register}
            error={errors.pickupInstructions?.message}
          />
        </FormRow>
      </Cell>
    </form>
  );
}

// ─── Cell wrapper ─────────────────────────────────────────────────────────────

const Cell = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-xs p-3 md:p-10 flex flex-col gap-5">
    <div className="flex items-center gap-2">
      <span className="text-blue-700 size-5 [&>svg]:size-5">{icon}</span>
      <span className="text-neutral-950 text-base font-semibold font-text">
        {title}
      </span>
    </div>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

// ─── Form row ─────────────────────────────────────────────────────────────────

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
      className="text-gray-500 text-xs font-medium uppercase"
    >
      {label}
    </Label>
    {children}
    {error && (
      <span className="text-[#EF4444] text-xs font-normal font-text flex items-center gap-1">
        <AlertTriangle className="w-3 h-3 shrink-0" />
        {error}
      </span>
    )}
  </div>
);

// ─── Vehicle images upload (multi, up to 8) ───────────────────────────────────

const ImagesUpload = ({
  register,
  error,
  onUpload,
  initialUrls = [],
}: {
  register: ReturnType<typeof useForm<FleetFormValues>>["register"];
  error?: string;
  onUpload: (urls: string[]) => void;
  initialUrls?: string[];
}) => {
  const [previews, setPreviews] = useState<
    { name: string; url: string; size?: number; error?: string; file?: File }[]
  >(
    initialUrls.map((url) => ({
      name: url.split("/").pop() || "Image",
      url,
    })),
  );
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(initialUrls);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref, ...rest } = register("vehicleImages", {
    validate: {
      maxFiles: (files: FileList | undefined) => {
        if (!files?.length) return true;
        return (
          files.length <= MAX_IMAGES || `Maximum ${MAX_IMAGES} images allowed`
        );
      },
      maxSize: (files: FileList | undefined) => {
        if (!files?.length) return true;
        const oversized = Array.from(files).filter(
          (f) => f.size / (1024 * 1024) > MAX_IMAGE_SIZE_MB,
        );
        return (
          oversized.length === 0 ||
          `Each image must be under ${MAX_IMAGE_SIZE_MB}MB`
        );
      },
      fileType: (files: FileList | undefined) => {
        if (!files?.length) return true;
        const invalid = Array.from(files).filter(
          (f) => !["image/png", "image/jpeg", "image/webp"].includes(f.type),
        );
        return (
          invalid.length === 0 || "Only PNG, JPG and WEBP files are allowed"
        );
      },
    },
  });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    rest.onChange(e);
    const newFiles = Array.from(e.target.files ?? []).slice(
      0,
      MAX_IMAGES - uploadedUrls.length,
    );
    if (!newFiles.length) return;

    const newPreviewItems = newFiles.map((f) => {
      let err: string | undefined;
      if (f.size / (1024 * 1024) > MAX_IMAGE_SIZE_MB) {
        err = `Exceeds ${MAX_IMAGE_SIZE_MB}MB limit`;
      } else if (!["image/png", "image/jpeg", "image/webp"].includes(f.type)) {
        err = "Only PNG, JPG or WEBP";
      }
      return {
        name: f.name,
        size: f.size,
        url: URL.createObjectURL(f),
        error: err,
        file: f,
      };
    });

    setPreviews((prev) => [...prev, ...newPreviewItems].slice(0, MAX_IMAGES));

    const filesToUpload = newPreviewItems
      .filter((item) => !item.error)
      .map((item) => item.file!);

    if (!filesToUpload.length) return;

    setUploading(true);
    try {
      const newUrls = await Promise.all(
        filesToUpload.map(async (file) => {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json();
          return data.secure_url as string;
        }),
      );
      const merged = [...uploadedUrls, ...newUrls].slice(0, MAX_IMAGES);
      setUploadedUrls(merged);
      onUpload(merged);
    } finally {
      setUploading(false);
    }
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    const updated = uploadedUrls.filter((_, i) => i !== index);
    setUploadedUrls(updated);
    onUpload(updated);
  };

  return (
    <FormRow label="Vehicle Images" htmlFor="vehicleImages" error={error}>
      <label
        htmlFor="vehicleImages"
        className={cn(
          "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xs p-5 cursor-pointer transition-colors duration-200 group",
          error
            ? "border-[#EF4444] bg-[#FFF5F5]"
            : "border-[#E5E7EB] hover:border-blue-700",
        )}
      >
        <Upload
          className={cn("w-6 h-6", error ? "text-[#EF4444]" : "text-[#9CA3AF]")}
        />
        <span
          className={cn(
            "text-sm font-medium font-text",
            error ? "text-[#EF4444]" : "text-blue-700 group-hover:underline",
          )}
        >
          {uploading ? "Uploading..." : "Click to upload or drag and drop"}
        </span>
        <span className="text-[#9CA3AF] text-xs font-text">
          PNG, JPG, WEBP up to {MAX_IMAGE_SIZE_MB}MB, up to {MAX_IMAGES} images
        </span>
        <input
          id="vehicleImages"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          multiple
          className="hidden"
          {...rest}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
          onChange={handleChange}
        />
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
          {previews.map((preview, index) => {
            const hasErr = !!preview.error;
            return (
              <div
                key={`${preview.name}-${index}`}
                className={cn(
                  "relative rounded-lg border overflow-hidden bg-white flex flex-col justify-between transition-all duration-200",
                  hasErr
                    ? "border-red-500 ring-2 ring-red-500 bg-[#FFF5F5]"
                    : "border-gray-300"
                )}
              >
                <div className="relative w-full aspect-square bg-gray-100">
                  <Image
                    src={preview.url}
                    alt={preview.name}
                    fill
                    className="object-cover object-center"
                  />
                </div>

                <div className="p-2 flex flex-col gap-0.5">
                  <p
                    className={cn(
                      "text-xs font-text truncate",
                      hasErr ? "text-red-500 font-semibold" : "text-[#1F2937]"
                    )}
                    title={preview.name}
                  >
                    {preview.name}
                  </p>

                  {preview.size !== undefined && (
                    <p className="text-[11px] text-[#9CA3AF]">
                      {(preview.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}

                  {hasErr && (
                    <p className="text-[11px] text-red-500 font-medium font-text mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span className="truncate" title={preview.error}>
                        {preview.error}
                      </span>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removePreview(index)}
                  aria-label={`Remove ${preview.name}`}
                  className={cn(
                    "absolute top-2 right-2 w-6 h-6 rounded-full shadow flex items-center justify-center transition-colors cursor-pointer z-10",
                    hasErr
                      ? "bg-red-500 text-white hover:bg-red-700"
                      : "bg-black/60 text-white hover:bg-red-500"
                  )}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </FormRow>
  );
};
