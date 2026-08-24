"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Sparkles, AlertCircle } from "lucide-react";
import { VehicleUploadLimitCheck } from "@/constants/hostPlans";

interface PlanLimitBannerProps {
  limitCheck: VehicleUploadLimitCheck;
}

export default function PlanLimitBanner({ limitCheck }: PlanLimitBannerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleUpgrade = () => {
    const nextPlanId = limitCheck.nextUpgradePlan?.id ?? "fleet";
    const params = new URLSearchParams(searchParams.toString());
    params.set("package", nextPlanId);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  if (!limitCheck.isLimitReached) {
    return (
      <div className="p-4 rounded-md border border-blue-200 bg-blue-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Sparkles className="size-4 text-blue-700" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 font-text">
              {limitCheck.planName} Plan &bull; {limitCheck.currentCount} of{" "}
              {limitCheck.maxVehicles} vehicle
              {limitCheck.maxVehicles > 1 ? "s" : ""} added
            </p>
            <p className="text-xs text-slate-600 font-text">
              You have {limitCheck.remainingSlots} remaining vehicle slot
              {limitCheck.remainingSlots > 1 ? "s" : ""} on your plan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-5 rounded-md border border-amber-300 bg-amber-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
          <AlertCircle className="size-5 text-amber-700" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-slate-900 text-sm font-text">
            Vehicle limit reached ({limitCheck.currentCount} /{" "}
            {limitCheck.maxVehicles} on {limitCheck.planName} Plan)
          </h4>
          <p className="text-xs text-slate-600 font-text max-w-xl leading-relaxed">
            {limitCheck.message ||
              "You have reached the maximum number of vehicles allowed on your current plan. Upgrade your plan to add more vehicles."}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleUpgrade}
        className="shrink-0 px-4 py-2 bg-blue-700 hover:bg-blue-950 text-white rounded-xs text-xs font-semibold font-text transition-colors duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
      >
        <Sparkles className="size-3.5" />
        {limitCheck.nextUpgradePlan
          ? `Upgrade to ${limitCheck.nextUpgradePlan.name} (${limitCheck.nextUpgradePlan.vehicleLimit.display})`
          : "Upgrade Plan"}
      </button>
    </div>
  );
}
