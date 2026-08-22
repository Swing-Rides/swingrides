"use client";

import { User, Phone, Mail, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type StepOneData = {
  confirmed: boolean;
};

type StepOneProps = {
  data: StepOneData;
  onChange: (data: Partial<StepOneData>) => void;
  bookingData?: {
    renterName?: string;
    renterPhone?: string;
    renterEmail?: string;
    driverLicensePhotoUrl?: string;
    selfiePhotoUrl?: string;
  };
};

export default function StepOne({ data, onChange, bookingData }: StepOneProps) {
  const renterName = bookingData?.renterName || "Unknown Renter";
  const renterPhone = bookingData?.renterPhone || "Not provided";
  const renterEmail = bookingData?.renterEmail || "Not provided";
  const driverLicensePhotoUrl = bookingData?.driverLicensePhotoUrl;
  const selfiePhotoUrl = bookingData?.selfiePhotoUrl;
  const hasDocuments = Boolean(driverLicensePhotoUrl);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-[#1F2937] text-lg font-bold font-text">
          Verify Renter Identity
        </h3>
        <p className="text-xs text-[#6B7280] font-text">
          Review the ID document and selfie the renter uploaded during their
          own check-in, then confirm they match.
        </p>
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

      {/* Renter-Submitted Documents */}
      {hasDocuments ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DocumentPreview label="ID Document" src={driverLicensePhotoUrl!} />
          {selfiePhotoUrl && (
            <DocumentPreview label="Renter Selfie" src={selfiePhotoUrl} />
          )}
        </div>
      ) : (
        <div className="border border-dashed border-[#E5E7EB] rounded-lg p-6 flex flex-col items-center gap-2 text-center">
          <ShieldAlert className="size-6 text-amber-500" />
          <p className="text-sm font-medium text-[#1F2937] font-text">
            Renter hasn&apos;t uploaded their ID yet
          </p>
          <p className="text-xs text-[#6B7280] font-text max-w-sm">
            Ask the renter to complete their own check-in step and upload
            their driver&apos;s license and selfie before identity can be
            verified here.
          </p>
        </div>
      )}

      {/* Confirmation Checkbox */}
      <div className="flex items-center gap-3 pt-2">
        <Checkbox
          id="step1-confirmed"
          checked={data.confirmed}
          disabled={!hasDocuments}
          onCheckedChange={(checked) => onChange({ confirmed: !!checked })}
          className="border-[#E5E7EB] data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
        />
        <Label
          htmlFor="step1-confirmed"
          className={`text-sm font-medium font-text select-none ${
            hasDocuments
              ? "text-[#1F2937] cursor-pointer"
              : "text-[#9CA3AF] cursor-not-allowed"
          }`}
        >
          I confirm the renter&apos;s identity matches the uploaded document
        </Label>
      </div>
    </div>
  );
}

const DocumentPreview = ({ label, src }: { label: string; src: string }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[11px] text-[#9CA3AF] font-medium font-text uppercase">
      {label}
    </span>
    <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-[#E5E7EB] bg-gray-50">
      <Image src={src} alt={label} fill unoptimized className="object-cover" />
    </div>
  </div>
);
