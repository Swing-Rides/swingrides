"use client";

import { Gauge, Fuel, StickyNote, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type StepThreeData = {
  confirmed: boolean;
};

type StepThreeProps = {
  data: StepThreeData;
  onChange: (data: Partial<StepThreeData>) => void;
  bookingData?: {
    vehiclePhotoUrls?: string[];
    mileage?: number;
    fuelLevel?: number;
    notes?: string;
  };
};

export default function StepThree({
  data,
  onChange,
  bookingData,
}: StepThreeProps) {
  const vehiclePhotoUrls = bookingData?.vehiclePhotoUrls || [];
  const mileage = bookingData?.mileage;
  const fuelLevel = bookingData?.fuelLevel;
  const notes = bookingData?.notes;
  const hasInspection = vehiclePhotoUrls.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-[#1F2937] text-lg font-bold font-text">
          Pre-Trip Vehicle Inspection
        </h3>
        <p className="text-xs text-[#6B7280] font-text">
          Review the vehicle condition photos, mileage, and fuel level the
          renter submitted during their own check-in, then confirm they&apos;re
          accurate.
        </p>
      </div>

      {hasInspection ? (
        <>
          <div className="flex flex-col gap-2">
            <span className="text-[11px] text-[#9CA3AF] font-medium font-text uppercase">
              Vehicle Photos
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {vehiclePhotoUrls.map((url, index) => (
                <div
                  key={url + index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-[#E5E7EB] bg-gray-50"
                >
                  <Image
                    src={url}
                    alt={`Vehicle condition photo ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-[#6B7280]">
                <Gauge className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#9CA3AF] font-medium font-text uppercase">
                  Current Mileage
                </span>
                <span className="text-sm font-semibold text-[#1F2937] font-text">
                  {typeof mileage === "number"
                    ? `${mileage.toLocaleString()} km`
                    : "Not provided"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-[#6B7280]">
                <Fuel className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#9CA3AF] font-medium font-text uppercase">
                  Fuel Level
                </span>
                <span className="text-sm font-semibold text-[#1F2937] font-text">
                  {typeof fuelLevel === "number"
                    ? `${fuelLevel}%`
                    : "Not provided"}
                </span>
              </div>
            </div>
          </div>

          {notes && (
            <div className="flex items-start gap-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-[#6B7280]">
                <StickyNote className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#9CA3AF] font-medium font-text uppercase">
                  Inspection Notes
                </span>
                <span className="text-sm text-[#1F2937] font-text">
                  {notes}
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="border border-dashed border-[#E5E7EB] rounded-lg p-6 flex flex-col items-center gap-2 text-center">
          <ShieldAlert className="size-6 text-amber-500" />
          <p className="text-sm font-medium text-[#1F2937] font-text">
            Renter hasn&apos;t submitted a vehicle inspection yet
          </p>
          <p className="text-xs text-[#6B7280] font-text max-w-sm">
            Ask the renter to complete their own check-in step and upload
            vehicle condition photos, mileage, and fuel level before this can
            be confirmed here.
          </p>
        </div>
      )}

      {/* Confirmation Checkbox */}
      <div className="flex items-center gap-3 pt-2">
        <Checkbox
          id="step3-confirmed"
          checked={data.confirmed}
          disabled={!hasInspection}
          onCheckedChange={(checked) => onChange({ confirmed: !!checked })}
          className="border-[#E5E7EB] data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
        />
        <Label
          htmlFor="step3-confirmed"
          className={`text-sm font-medium font-text select-none ${
            hasInspection
              ? "text-[#1F2937] cursor-pointer"
              : "text-[#9CA3AF] cursor-not-allowed"
          }`}
        >
          I confirm the vehicle condition, mileage, and fuel level shown above
          are accurate
        </Label>
      </div>
    </div>
  );
}
