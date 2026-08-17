"use client";

import { Shield } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type StepTwoData = {
  confirmed: boolean;
};

type StepTwoProps = {
  data: StepTwoData;
  onChange: (data: Partial<StepTwoData>) => void;
  insuranceData?: {
    policyNumber?: string;
    dailyRate?: number;
    planName?: string;
  };
};

export default function StepTwo({ data, onChange, insuranceData }: StepTwoProps) {
  const fullPolicyNumber = insuranceData?.policyNumber || "";
  const lastFourDigits = fullPolicyNumber.slice(-4);
  const maskedPolicyNumber = `••••-••••-${lastFourDigits}`;
  const dailyRate = insuranceData?.dailyRate || "";
  const planName = insuranceData?.planName || "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-[#1F2937] text-lg font-bold font-text">
          Insurance Details (Optional)
        </h3>
      </div>

      {/* Insurance Details Card */}
      <div className="border border-[#E5E7EB] rounded-xl p-5 bg-white flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Shield className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-[#1F2937] font-text">
                {planName}
              </span>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full font-text">
            Active
          </span>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t border-[#E5E7EB]">
          {/* Policy Number - Only last 4 digits visible */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280] font-text">Policy Number</span>
            <span className="font-mono font-bold text-[#1F2937]">
              {maskedPolicyNumber}
            </span>
          </div>

          {/* Daily Rate */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280] font-text">Daily Rate</span>
            <span className="font-bold text-[#1F2937] font-text">
              {'USD '}{dailyRate}/day
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="flex items-center gap-3 pt-2">
        <Checkbox
          id="step2-confirmed"
          checked={data.confirmed}
          onCheckedChange={(checked) => onChange({ confirmed: !!checked })}
          className="border-[#E5E7EB] data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
        />
        <Label
          htmlFor="step2-confirmed"
          className="text-sm font-medium text-[#1F2937] font-text cursor-pointer select-none"
        >
          I confirm the renter&apos;s identity matches the provided document
        </Label>
      </div>
    </div>
  );
}