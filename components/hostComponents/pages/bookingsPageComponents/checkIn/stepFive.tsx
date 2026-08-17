"use client";

import { Key, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type StepFiveData = {
  confirmed: boolean;
};

type StepFiveProps = {
  data: StepFiveData;
  onChange: (data: Partial<StepFiveData>) => void;
};

export default function StepFive({ data, onChange }: StepFiveProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-[#1F2937] text-lg font-bold font-text">
          Keys Handover
        </h3>
      </div>

      {/* Keys Handover Checkbox Card */}
      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4">
        <Checkbox
          id="step5-confirmed"
          checked={data.confirmed}
          onCheckedChange={(checked) => onChange({ confirmed: !!checked })}
          className="border-[#E5E7EB] data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700 w-5 h-5"
        />
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-blue-700 shrink-0" />
          <Label
            htmlFor="step5-confirmed"
            className="text-sm font-semibold text-[#1F2937] font-text cursor-pointer select-none"
          >
            Vehicle keys have been handed over to the renter
          </Label>
        </div>
      </div>

      {/* Ready Banner (shown when confirmed) */}
      {data.confirmed && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 flex items-start gap-4 transition-all duration-300">
          <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-emerald-900 font-bold text-base font-text">
              Ready to Complete Check-In
            </h4>
            <p className="text-emerald-700 text-xs font-text leading-relaxed">
              All required information has been collected. Click &quot;Complete Check-In&quot; to finalize the pickup process and activate the rental.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
