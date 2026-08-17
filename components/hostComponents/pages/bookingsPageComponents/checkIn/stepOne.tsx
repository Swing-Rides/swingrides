"use client";

import { User, Phone, Mail } from "lucide-react";
import MainForm from "@/components/forms/MainForm";
import { FormFieldConfig } from "@/components/forms/types";

export type StepOneData = {
  confirmed: boolean;
  idType: string;
  idDocument: File[];
  driverName: string;
};

type StepOneProps = {
  data: StepOneData;
  onSubmitStep: (data: StepOneData) => void;
  bookingData?: {
    renterName?: string;
    renterPhone?: string;
    renterEmail?: string;
  };
};

const idTypeOptions = [
  { label: "Driver's License", value: "drivers_license" },
  { label: "Passport", value: "passport" },
  { label: "National ID", value: "national_id" },
  { label: "State ID", value: "state_id" },
];

export default function StepOne({ data, onSubmitStep, bookingData }: StepOneProps) {
  const renterName = bookingData?.renterName || "John Smith";
  const renterPhone = bookingData?.renterPhone || "+1 555-0001";
  const renterEmail = bookingData?.renterEmail || "john.smith@email.com";

  const fields: FormFieldConfig[] = [
    {
      name: "driverName",
      type: "text",
      label: "Driver Name",
      placeholder: "Enter driver's full name",
      defaultValue: data.driverName || renterName,
      validation: {
        required: "Driver name is required",
        minLength: { value: 2, message: "Driver name must be at least 2 characters" },
        maxLength: { value: 100, message: "Driver name must be under 100 characters" },
      },
    },
    {
      name: "idType",
      type: "select",
      label: "ID Type",
      placeholder: "Select ID type",
      defaultValue: data.idType,
      options: idTypeOptions,
      validation: {
        required: "ID type is required",
      },
    },
    {
      name: "idDocument",
      type: "image",
      label: "ID Document",
      description: "Upload a clear photo of the renter's ID document",
      accept: "image/*",
      multiple: false,
      maxFiles: 1,
      showPreview: true,
      validation: {
        validate: (files: FileList | File[]) => {
          const len = files ? (files instanceof FileList ? files.length : files.length) : 0;
          return len > 0 || "Please upload the renter's ID document";
        },
      },
    },
    {
      name: "confirmed",
      type: "checkbox",
      label: "I confirm the renter's identity matches the provided document",
      defaultValue: data.confirmed,
      validation: {
        validate: (value: boolean) =>
          value === true || "You must confirm the renter's identity",
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-[#1F2937] text-lg font-bold font-text">
          Verify Renter Identity
        </h3>
      </div>

      {/* Renter Details Box */}
      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-[#6B7280]">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#9CA3AF] font-medium font-text uppercase">
                Full Name
              </span>
              <span className="text-sm font-semibold text-[#1F2937] font-text">
                {renterName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-[#6B7280]">
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#9CA3AF] font-medium font-text uppercase">
                Phone Number
              </span>
              <span className="text-sm font-semibold text-[#1F2937] font-text">
                {renterPhone}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-[#6B7280]">
            <Mail className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#9CA3AF] font-medium font-text uppercase">
              Email Address
            </span>
            <span className="text-sm font-semibold text-[#1F2937] font-text">
              {renterEmail}
            </span>
          </div>
        </div>
      </div>

      <MainForm
        fields={fields}
        onSubmit={(values) => {
          const rawFiles = values.idDocument as FileList | File[];
          const fileArray = rawFiles ? Array.from(rawFiles as Iterable<File>) : [];
          onSubmitStep({
            confirmed: !!values.confirmed,
            idType: String(values.idType ?? ""),
            idDocument: fileArray,
            driverName: String(values.driverName ?? ""),
          });
        }}
        submitLabel="Confirm Identity Verification"
        className="gap-5"
      />
    </div>
  );
}
