"use client";

import { User, Phone, Mail } from "lucide-react";
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
  };
};

export default function StepOne({ data, onChange, bookingData }: StepOneProps) {
  const renterName = bookingData?.renterName || "John Smith";
  const renterPhone = bookingData?.renterPhone || "+1 555-0001";
  const renterEmail = bookingData?.renterEmail || "john.smith@email.com";

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

      {/* Confirmation Checkbox */}
      <div className="flex items-center gap-3 pt-2">
        <Checkbox
          id="step1-confirmed"
          checked={data.confirmed}
          onCheckedChange={(checked) => onChange({ confirmed: !!checked })}
          className="border-[#E5E7EB] data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
        />
        <Label
          htmlFor="step1-confirmed"
          className="text-sm font-medium text-[#1F2937] font-text cursor-pointer select-none"
        >
          I confirm the renter&apos;s identity matches the provided document
        </Label>
      </div>
    </div>
  );
}
