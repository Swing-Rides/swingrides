"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Info,
  Fingerprint,
  Banknote,
  SlidersVertical,
  MapPin,
  Camera,
  ShieldCheck,
} from "lucide-react";
import MainForm from "@/components/forms/MainForm";
import { FormSectionConfig } from "@/components/forms/types";
import { validateVin } from "@/lib/vinChecker";
import { US_STATES } from "@/constants/addressState";
import { INSURANCE_LINK } from "@/constants/constant";
import { useGetHostProfileQuery } from "@/app/store/services/hostApi";

// ─── Constants ────────────────────────────────────────────────────────────────

const VEHICLE_TYPES = [
  "Sedan",
  "SUV",
  "Truck",
  "Van",
  "Minivan",
  "Motorcycle",
  "Convertible",
  "Coupe",
  "Hatchback",
  "Pickup Truck",
  "Sports Car",
  "Luxury",
  "Electric",
  "Other",
];

const TRANSMISSION_OPTIONS = ["Automatic", "Manual", "CVT", "Semi-Automatic"];
const FUEL_TYPE_OPTIONS = [
  "Gas",
  "Diesel",
  "Electric",
  "Hybrid",
  "Other",
];

const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE_MB = 10;

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

export type FleetFormProps = {
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
  const [imageUrls, setImageUrls] = useState<string[]>(
    () => defaultValues?.vehicleImageUrls ?? [],
  );

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

  const activeValues = useMemo(() => {
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
        : useCustomInsurance
          ? {
            insuranceCarrier: "",
            insurancePolicyNumber: "",
            insuranceExpiration: "",
            dailyInsuranceFee: "",
          }
          : {};

    return {
      ...FALLBACK_DEFAULTS,
      ...defaultValues,
      ...connectedDefaults,
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

  const handleUseDifferentInsurance = () => {
    setUseCustomInsurance(true);
  };

  const handleUseConnectedInsurance = () => {
    setUseCustomInsurance(false);
  };

  const handleFormSubmit = async (rawValues: Record<string, unknown>) => {
    const rawFiles = rawValues.vehicleImages;
    const filesToUpload: File[] = [];

    if (typeof FileList !== "undefined" && rawFiles instanceof FileList) {
      filesToUpload.push(...Array.from(rawFiles));
    } else if (Array.isArray(rawFiles)) {
      filesToUpload.push(
        ...rawFiles.filter((f): f is File => typeof File !== "undefined" && f instanceof File),
      );
    } else if (typeof File !== "undefined" && rawFiles instanceof File) {
      filesToUpload.push(rawFiles);
    }

    let newUrls: string[] = [];
    if (filesToUpload.length > 0) {
      newUrls = await Promise.all(
        filesToUpload.map(async (file) => {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          if (!res.ok) {
            throw new Error("Failed to upload image");
          }
          const data = await res.json();
          return data.secure_url as string;
        }),
      );
    }

    const mergedUrls = [...imageUrls, ...newUrls].slice(0, MAX_IMAGES);

    await onSubmit({
      ...(rawValues as unknown as FleetFormValues),
      vehicleImageUrls: mergedUrls,
    });
  };

  const currentYear = new Date().getFullYear();

  const sections: FormSectionConfig[] = [
    // ── 1. Vehicle Information ──────────────────────────────
    {
      id: "vehicle-info",
      title: "Vehicle Information",
      icon: <Info className="size-5" />,
      column: "left",
      rowGroups: [
        ["make", "model"],
        ["year", "color", "vehicleType"],
      ],
      fields: [
        {
          name: "vehicleName",
          type: "text",
          label: "Vehicle Name",
          placeholder: "e.g. Luxury Tesla Model S",
          maxLength: 100,
          validation: {
            required: "Vehicle name is required",
            maxLength: {
              value: 100,
              message: "Vehicle name cannot exceed 100 characters",
            },
          },
        },
        {
          name: "make",
          type: "text",
          label: "Manufacturer",
          placeholder: "Tesla",
          maxLength: 50,
          validation: {
            required: "Vehicle make is required",
            maxLength: {
              value: 50,
              message: "Vehicle make cannot exceed 50 characters",
            },
          },
        },
        {
          name: "model",
          type: "text",
          label: "Model",
          placeholder: "Model S",
          maxLength: 50,
          validation: {
            required: "Vehicle model is required",
            maxLength: {
              value: 50,
              message: "Vehicle model cannot exceed 50 characters",
            },
          },
        },
        {
          name: "year",
          type: "number",
          label: "Year",
          placeholder: "2025",
          min: 1900,
          max: currentYear + 1,
          validation: {
            required: "Vehicle year is required",
            valueAsNumber: true,
            min: { value: 1900, message: "Vehicle year must be after 1900" },
            max: {
              value: currentYear + 1,
              message: "Vehicle year cannot be in the distant future",
            },
          },
        },
        {
          name: "color",
          type: "text",
          label: "Color",
          placeholder: "White",
          maxLength: 30,
          validation: {
            required: "Vehicle colour is required",
            maxLength: {
              value: 30,
              message: "Vehicle colour cannot exceed 30 characters",
            },
          },
        },
        {
          name: "vehicleType",
          type: "select",
          label: "Vehicle Type",
          placeholder: "Select",
          options: VEHICLE_TYPES.map((type) => ({
            value: type,
            label: type,
          })),
          validation: { required: "Vehicle type is required" },
        },
      ],
    },

    // ── 2. Insurance Details ────────────────────────────────
    {
      id: "insurance-details",
      title: "Insurance Details",
      icon: <Info className="size-5" />,
      column: "left",
      headerSlot:
        isInsuranceConnected && !useCustomInsurance ? (
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
        ),
      rowGroups: [
        ["insuranceCarrier", "insurancePolicyNumber"],
        ["insuranceExpiration", "dailyInsuranceFee"],
      ],
      fields: [
        {
          name: "insuranceCarrier",
          type: "text",
          label: "Carrier / Company",
          placeholder: "e.g. Progressive",
          maxLength: 100,
          validation: {
            maxLength: {
              value: 100,
              message: "Insurance carrier cannot exceed 100 characters",
            },
          },
        },
        {
          name: "insurancePolicyNumber",
          type: "text",
          label: "Policy Number",
          placeholder: "e.g. PLY-209384",
          maxLength: 80,
          className: "uppercase",
          validation: {
            maxLength: {
              value: 80,
              message: "Insurance policy number cannot exceed 80 characters",
            },
            setValueAs: (v: string) =>
              typeof v === "string" ? v.toUpperCase().trim() : v,
          },
        },
        {
          name: "insuranceExpiration",
          type: "date",
          label: "Expiration Date",
          placeholder: "Pick expiration date",
        },
        {
          name: "dailyInsuranceFee",
          type: "number-dollar",
          label: "Daily Insurance Fee",
          placeholder: "0.00",
          step: 0.01,
          min: 0,
          validation: {
            valueAsNumber: true,
            min: { value: 0, message: "Daily insurance fee cannot be negative" },
          },
        },
      ],
      footerSlot:
        isInsuranceConnected && !useCustomInsurance ? (
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
        ) : null,
    },

    // ── 3. Identification ───────────────────────────────────
    {
      id: "identification",
      title: "Identification",
      icon: <Fingerprint className="size-5" />,
      column: "left",
      rowGroups: [["licensePlate", "vin"]],
      fields: [
        {
          name: "licensePlate",
          type: "text",
          label: "License Plate",
          placeholder: "e.g. ABC-1234",
          maxLength: 20,
          className: "uppercase",
          validation: {
            required: "License plate is required",
            maxLength: {
              value: 20,
              message: "License plate cannot exceed 20 characters",
            },
            setValueAs: (v: string) =>
              typeof v === "string" ? v.toUpperCase().trim() : v,
          },
        },
        {
          name: "vin",
          type: "text",
          label: "VIN",
          placeholder: "e.g. 1FA6P8TD5M5100001",
          maxLength: 17,
          className: "uppercase",
          validation: {
            required: "VIN is required",
            setValueAs: (v: string) =>
              typeof v === "string" ? v.toUpperCase().trim() : v,
            validate: (val: string) => {
              if (!val) return "VIN is required";
              const result = validateVin(val);
              if (!result.valid) {
                return (
                  result.errors[0] ||
                  "Invalid VIN number. Please double-check and try again."
                );
              }
              return true;
            },
          },
        },
      ],
    },

    // ── 4. Pricing (USD) ────────────────────────────────────
    {
      id: "pricing",
      title: "Pricing (USD)",
      icon: <Banknote className="size-5" />,
      column: "left",
      rowGroups: [["priceDaily", "priceWeekly", "priceMonthly"]],
      fields: [
        {
          name: "priceDaily",
          type: "number-dollar",
          label: "Daily",
          placeholder: "0.00",
          step: 0.01,
          min: 0,
          validation: {
            required: "Daily price is required",
            valueAsNumber: true,
            min: { value: 0, message: "Daily price cannot be negative" },
          },
        },
        {
          name: "priceWeekly",
          type: "number-dollar",
          label: "Weekly",
          placeholder: "0.00",
          step: 0.01,
          min: 0,
          validation: {
            required: "Weekly price is required",
            valueAsNumber: true,
            min: { value: 0, message: "Weekly price cannot be negative" },
          },
        },
        {
          name: "priceMonthly",
          type: "number-dollar",
          label: "Monthly",
          placeholder: "0.00",
          step: 0.01,
          min: 0,
          validation: {
            required: "Monthly price is required",
            valueAsNumber: true,
            min: { value: 0, message: "Monthly price cannot be negative" },
          },
        },
      ],
    },

    // ── 5. Vehicle Specs ────────────────────────────────────
    {
      id: "vehicle-specs",
      title: "Vehicle Specs",
      icon: <SlidersVertical className="size-5" />,
      column: "right",
      rowGroups: [
        ["transmission", "seats"],
        ["mileage", "fuelType"],
      ],
      fields: [
        {
          name: "transmission",
          type: "select",
          label: "Transmission",
          placeholder: "Select",
          options: TRANSMISSION_OPTIONS.map((opt) => ({
            value: opt,
            label: opt,
          })),
          validation: { required: "Transmission type is required" },
        },
        {
          name: "seats",
          type: "number",
          label: "Seats",
          placeholder: "5",
          min: 1,
          max: 20,
          validation: {
            required: "Number of seats is required",
            valueAsNumber: true,
            min: { value: 1, message: "Vehicle must have at least 1 seat" },
            max: {
              value: 20,
              message: "Vehicle cannot have more than 20 seats",
            },
          },
        },
        {
          name: "mileage",
          type: "number",
          label: "Mileage (mi)",
          placeholder: "e.g. 12000",
          min: 0,
          validation: {
            required: "Mileage is required",
            valueAsNumber: true,
            min: { value: 0, message: "Mileage cannot be negative" },
          },
        },
        {
          name: "fuelType",
          type: "select",
          label: "Fuel Type",
          placeholder: "Select",
          options: FUEL_TYPE_OPTIONS.map((opt) => ({
            value: opt,
            label: opt,
          })),
          validation: { required: "Select fuel type" },
        },
        {
          name: "doors",
          type: "number",
          label: "Doors",
          placeholder: "4",
          min: 1,
          max: 10,
          className: "w-full md:w-1/2",
          validation: {
            valueAsNumber: true,
            min: { value: 1, message: "Vehicle must have at least 1 door" },
            max: {
              value: 10,
              message: "Vehicle cannot have more than 10 doors",
            },
          },
        },
      ],
    },

    // ── 6. Pickup Location Address ──────────────────────────
    {
      id: "pickup-location",
      title: "Pickup Location Address",
      icon: <MapPin className="size-5" />,
      column: "right",
      rowGroups: [
        ["pickupAddressStreet", "city"],
        ["pickupAddressState", "zipCode"],
      ],
      fields: [
        {
          name: "pickupAddressStreet",
          type: "text",
          label: "Street",
          placeholder: "e.g. 123 Main Street",
          maxLength: 200,
          validation: {
            required: "Pickup location is required",
            maxLength: {
              value: 200,
              message: "Pickup location cannot exceed 200 characters",
            },
          },
        },
        {
          name: "city",
          type: "text",
          label: "City",
          placeholder: "e.g. Bronx",
          maxLength: 50,
          validation: {
            required: "City is required",
            maxLength: {
              value: 50,
              message: "City cannot exceed 50 characters",
            },
          },
        },
        {
          name: "pickupAddressState",
          type: "select",
          label: "State",
          placeholder: "Select state",
          options: US_STATES,
          validation: {
            required: "State is required",
            maxLength: {
              value: 100,
              message: "State cannot exceed 100 characters",
            },
          },
        },
        {
          name: "zipCode",
          type: "text",
          label: "Zip Code",
          placeholder: "e.g. 10451",
          maxLength: 20,
          validation: {
            required: "Zip code is required",
            maxLength: {
              value: 20,
              message: "Zip code cannot exceed 20 characters",
            },
          },
        },
      ],
    },

    // ── 7. Media & Information ──────────────────────────────
    {
      id: "media-info",
      title: "Media & Information",
      icon: <Camera className="size-5" />,
      column: "full",
      fields: [
        {
          name: "vehicleImages",
          type: "image",
          label: "Vehicle Images",
          description: `PNG, JPG, WEBP up to ${MAX_IMAGE_SIZE_MB}MB, up to ${MAX_IMAGES} images`,
          accept: "image/png, image/jpeg, image/webp",
          multiple: true,
          maxFiles: MAX_IMAGES,
          maxSizeMB: MAX_IMAGE_SIZE_MB,
          showPreview: true,
          initialUrls: imageUrls,
          onExistingUrlsChange: setImageUrls,
          validation: {
            validate: {
              maxFiles: (files: FileList | undefined) => {
                const count = (files?.length ?? 0) + imageUrls.length;
                return (
                  count <= MAX_IMAGES || `Maximum ${MAX_IMAGES} images allowed`
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
                  (f) =>
                    !["image/png", "image/jpeg", "image/webp"].includes(f.type),
                );
                return (
                  invalid.length === 0 ||
                  "Only PNG, JPG and WEBP files are allowed"
                );
              },
            },
          },
        },
        {
          name: "description",
          type: "textarea",
          label: "Vehicle Description",
          placeholder:
            "Describe the vehicle's features, unique selling points, and any specific terms...",
          height: 120,
          maxLength: 1000,
          showCharCount: true,
          validation: {
            required: "Description is required",
            maxLength: {
              value: 1000,
              message: "Description cannot exceed 1000 characters",
            },
          },
        },
        {
          name: "pickupInstructions",
          type: "textarea",
          label: "Pickup Instructions",
          placeholder:
            "Add any instructions for renters about pickup location, key collection, parking, or vehicle access...",
          height: 120,
          maxLength: 1000,
          showCharCount: true,
          validation: {
            maxLength: {
              value: 1000,
              message: "Pickup instructions cannot exceed 1000 characters",
            },
          },
        },
      ],
    },
  ];

  return (
    <MainForm
      id={formId}
      sections={sections}
      values={activeValues}
      hideSubmitButton={true}
      onSubmit={handleFormSubmit}
      className="w-full gap-6"
    />
  );
}
