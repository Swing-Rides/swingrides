"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type StepFourData = {
  confirmed: boolean;
};

type StepFourProps = {
  data: StepFourData;
  onChange: (data: Partial<StepFourData>) => void;
};

export default function StepFour({ data, onChange }: StepFourProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-[#1F2937] text-lg font-bold font-text">
          Agreement Closure
        </h3>
      </div>

      {/* Confirmation Checkbox */}
      <div className="flex items-start gap-3 pt-2">
        <Checkbox
          id="step4-confirmed"
          checked={data.confirmed}
          onCheckedChange={(checked) => onChange({ confirmed: !!checked })}
          className="mt-0.5 border-[#E5E7EB] data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
        />
        <Label
          htmlFor="step4-confirmed"
          className="text-sm font-medium text-[#1F2937] font-text cursor-pointer select-none leading-relaxed"
        >
          I confirm the renter has reviewed and agreed to the rental terms and conditions.
        </Label>
      </div>
    </div>
  );
}
