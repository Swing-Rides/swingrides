"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import PopupWrapper from "./popupWrapper";
import { ActionPopupProps } from "./subscriberDetail.types";

const PLANS = ["Starter", "Growth", "Pro", "Enterprise"];

export default function UpgradePlanPopup({
        open,
        onClose,
        onConfirm,
        organisationName,
}: ActionPopupProps) {
        const [selectedPlan, setSelectedPlan] = useState<string>("");

        return (
                <PopupWrapper
                        open={open}
                        title="Upgrade plan"
                        onClose={onClose}
                        onConfirm={onConfirm}
                        confirmLabel="Upgrade"
                        confirmDisabled={!selectedPlan}
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
                                        . The change takes effect immediately.
                                </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                                {PLANS.map((plan) => (
                                        <button
                                                key={plan}
                                                type="button"
                                                onClick={() => setSelectedPlan(plan)}
                                                className={`px-3 py-2 rounded-xs text-sm font-medium font-text border transition-colors duration-300 cursor-pointer ${selectedPlan === plan
                                                                ? "border-blue-700 bg-blue-50 text-blue-700"
                                                                : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                                        }`}
                                        >
                                                {plan}
                                        </button>
                                ))}
                        </div>
                </PopupWrapper>
        );
}