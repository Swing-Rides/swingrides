"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { DEFAULT_IMAGE_SRC } from "@/constants/constant";

type BookingSummaryProps = {
  vehicleName?: string;
  vehiclePlateNumber?: string;
  vehicleImageSrc?: string;
  renterName?: string;
  renterPhone?: string;
  pickupDateTime?: string;
  returnDateTime?: string;
  totalAmount?: string | number;
  currentStep: number;
  maxStepReached?: number;
  completedSteps?: Record<number, boolean>;
  step5Confirmed?: boolean;
  onSelectStep?: (step: number) => void;
};

const CHECKLIST_ITEMS = [
  { label: "Identity Verified", step: 1 },
  { label: "Insurance Confirmed", step: 2 },
  { label: "Vehicle Inspected", step: 3 },
  { label: "Agreement Signed", step: 4 },
  { label: "Payment Confirmed", step: 5, preConfirmed: true },
  { label: "Keys Handed Over", step: 5, requiresKeyCheck: true },
];

export default function BookingSummary({
  vehicleName = "",
  vehiclePlateNumber = "",
  vehicleImageSrc,
  renterName = "",
  renterPhone = "",
  pickupDateTime = "",
  returnDateTime = "",
  totalAmount = "",
  currentStep,
  maxStepReached = 1,
  completedSteps = {},
  step5Confirmed = false,
  onSelectStep,
}: BookingSummaryProps) {
  const displayImage = vehicleImageSrc || DEFAULT_IMAGE_SRC;

  return (
    <div className="border border-[#E5E7EB] rounded-xl p-5 bg-white flex flex-col gap-5 sticky top-6">
      <h3 className="text-base font-bold text-[#1F2937] font-text">
        Booking Summary
      </h3>

      {/* Vehicle info */}
      <div className="flex flex-col gap-2 pb-4 border-b border-[#E5E7EB]">
        <span className="text-[11px] text-[#9CA3AF] font-bold font-text uppercase tracking-wider">
          Vehicle
        </span>
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-[#E5E7EB]">
            <Image
              src={displayImage}
              alt={vehicleName || "Vehicle image"}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#1F2937] font-text">
              {vehicleName}
            </span>
            <span className="text-xs text-gray-500 font-text">
              {vehiclePlateNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Renter info */}
      <div className="flex flex-col gap-1.5 pb-4 border-b border-[#E5E7EB]">
        <span className="text-[11px] text-[#9CA3AF] font-bold font-text uppercase tracking-wider">
          Renter
        </span>
        <span className="text-sm font-bold text-[#1F2937] font-text">
          {renterName}
        </span>
        <span className="text-xs text-[#6B7280] font-text">
          {renterPhone}
        </span>
      </div>

      {/* Dates */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] text-[#9CA3AF] font-bold font-text uppercase tracking-wider">
            Pickup
          </span>
          <span className="text-xs font-bold text-[#1F2937] font-text">
            {pickupDateTime}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-[#9CA3AF] font-bold font-text uppercase tracking-wider">
            Return
          </span>
          <span className="text-xs font-bold text-[#1F2937] font-text">
            {returnDateTime}
          </span>
        </div>
      </div>

      {/* Total Amount & Interactive Checklist */}
      <div className="flex flex-col gap-4 pt-4 border-t border-[#E5E7EB]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#1F2937] font-text">
            Total Amount
          </span>
          <span className="text-xl font-bold text-blue-600 font-text">
            {typeof totalAmount === "number" ? `$${totalAmount.toFixed(2)}` : totalAmount}
          </span>
        </div>

        <div className="flex flex-col gap-2.5 pt-2 border-t border-[#E5E7EB]">
          {CHECKLIST_ITEMS.map((item) => {
            let isItemCompleted = false;

            if (item.requiresKeyCheck) {
              isItemCompleted = step5Confirmed;
            } else if (item.preConfirmed) {
              isItemCompleted = maxStepReached > 4 || step5Confirmed;
            } else {
              isItemCompleted = !!completedSteps[item.step];
            }

            const isItemActive = !isItemCompleted && item.step === currentStep;
            const isClickable = isItemCompleted || item.step <= maxStepReached;

            if (isItemCompleted) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onSelectStep?.(item.step)}
                  className="flex items-center gap-2 text-left cursor-pointer group transition-colors"
                  title={`Navigate to ${item.label}`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-text text-[#1F2937] font-medium group-hover:text-blue-700 transition-colors">
                    {item.label}
                  </span>
                </button>
              );
            }

            if (isItemActive) {
              return (
                <div key={item.label} className="flex items-center gap-2 cursor-default">
                  <CheckCircle2 className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="text-xs font-text text-gray-500 font-medium">
                    {item.label}
                  </span>
                </div>
              );
            }

            if (isClickable) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onSelectStep?.(item.step)}
                  className="flex items-center gap-2 text-left cursor-pointer group transition-colors"
                  title={`Navigate to ${item.label}`}
                >
                  <CheckCircle2 className="w-4 h-4 text-gray-500/70 shrink-0" />
                  <span className="text-xs font-text text-gray-500/70 font-normal group-hover:text-blue-700 transition-colors">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <div key={item.label} className="flex items-center gap-2 cursor-not-allowed">
                <CheckCircle2 className="w-4 h-4 text-gray-500/70 shrink-0" />
                <span className="text-xs font-text text-gray-500/70 font-normal">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
