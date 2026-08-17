"use client";

import MainForm from "@/components/forms/MainForm";
import { FormFieldConfig } from "@/components/forms/types";

export type StepThreeData = {
  vehiclePhotos: File[];
  mileage: string;
  fuelLevel: string;
  notes?: string;
};

type StepThreeProps = {
  data: StepThreeData;
  onSubmitStep: (data: StepThreeData) => void;
  onValuesChange?: (data: Partial<StepThreeData>) => void;
};

const fuelOptions = [
  { label: "Empty", value: "empty" },
  { label: "1/4", value: "quarter" },
  { label: "1/2", value: "half" },
  { label: "3/4", value: "three_quarter" },
  { label: "Full", value: "full" },
];

export default function StepThree({ data, onSubmitStep }: StepThreeProps) {
  const fields: FormFieldConfig[] = [
    {
      name: "vehiclePhotos",
      type: "image",
      label: "Vehicle Photos (All Angles)",
      description: "Upload up to 8 clear photos of the vehicle condition",
      accept: "image/*",
      multiple: true,
      maxFiles: 8,
      showPreview: true,
      validation: {
        validate: (files: FileList | File[]) => {
          const len = files ? (files instanceof FileList ? files.length : files.length) : 0;
          if (len === 0) return "Please upload at least one vehicle photo";
          if (len > 8) return "Maximum 8 images allowed";
          return true;
        },
      },
    },
    {
      name: "mileage",
      type: "number",
      label: "Current Mileage (km)",
      placeholder: "Enter current mileage",
      defaultValue: data.mileage || "",
      validation: {
        required: "Current mileage is required",
        min: { value: 0, message: "Mileage cannot be negative" },
      },
    },
    {
      name: "fuelLevel",
      type: "select",
      label: "Fuel Level",
      placeholder: "Select fuel level",
      defaultValue: data.fuelLevel,
      options: fuelOptions,
      validation: {
        required: "Fuel level is required",
      },
    },
    {
      name: "notes",
      type: "textarea",
      label: "Inspection Notes (Optional)",
      placeholder: "Note any existing damages, scratches, or vehicle condition details...",
      defaultValue: data.notes || "",
      height: 120,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-[#1F2937] text-lg font-bold font-text">
          Pre-Trip Vehicle Inspection
        </h3>
      </div>

      <MainForm
        fields={fields}
        rowPairs={[["mileage", "fuelLevel"]]}
        onSubmit={(values) => {
          const rawFiles = values.vehiclePhotos as FileList | File[];
          const fileArray = rawFiles
            ? Array.from(rawFiles as Iterable<File>)
            : [];
          onSubmitStep({
            vehiclePhotos: fileArray,
            mileage: String(values.mileage ?? ""),
            fuelLevel: String(values.fuelLevel ?? "full"),
            notes: (values.notes as string) || "",
          });
        }}
        submitLabel="Confirm Inspection Details"
        className="gap-5"
      />
    </div>
  );
}
