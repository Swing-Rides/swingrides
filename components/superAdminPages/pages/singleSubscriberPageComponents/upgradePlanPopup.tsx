"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import PopupWrapper from "./popupWrapper";
import { SubscriberPlanKey, UpgradePlanPopupProps } from "./subscriberDetail.types";

const PLANS: { key: SubscriberPlanKey; label: string }[] = [
        { key: "flex", label: "Flex" },
        { key: "solo", label: "Solo" },
        { key: "fleet", label: "Fleet" },
];

export default function UpgradePlanPopup({
        open,
        onClose,
        onConfirm,
        organisationName,
        currentPlan,
        confirmDisabled,
}: UpgradePlanPopupProps) {
        const [selectedPlan, setSelectedPlan] = useState<SubscriberPlanKey | "">("");

        return (
                <PopupWrapper
                        open={open}
                        title="Change plan"
                        onClose={onClose}
                        onConfirm={() => selectedPlan && onConfirm(selectedPlan)}
                        confirmLabel="Change plan"
                        confirmDisabled={!selectedPlan || confirmDisabled}
                >
                        <div className="flex gap-3 mb-4">
                                <div className="size-10 shrink-0 rounded-full bg-indigo-50 flex items-center justify-center">
                                        <TrendingUp className="size-5 text-blue-700" />
                                </div>
                                <p className="text-gray-500 text-sm font-normal font-text leading-5">
                                        Choose a new plan for{" "}
                                        <span className="font-semibold text-neutral-900">
                                                {organisationName}
                                        </span>
                                        . The new price takes effect at their next billing cycle
                                        &mdash; requires an active subscription.
                                </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                                {PLANS.map(({ key, label }) => (
                                        <button
                                                key={key}
                                                type="button"
                                                disabled={key === currentPlan}
                                                onClick={() => setSelectedPlan(key)}
                                                className={`px-3 py-2 rounded-xs text-sm font-medium font-text border transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${selectedPlan === key
                                                                ? "border-blue-700 bg-blue-50 text-blue-700"
                                                                : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                                        }`}
                                        >
                                                {label}
                                                {key === currentPlan ? " (current)" : ""}
                                        </button>
                                ))}
                        </div>
                </PopupWrapper>
        );
}
