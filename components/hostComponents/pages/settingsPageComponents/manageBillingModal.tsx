import { Badge } from "@/components/ui/badge";
import { PopupWrapper } from "./settingsTabs";
import { HostPlanType } from "@/app/store/services/settingsApi";

type ManageBillingModalProps = {
        onClose: () => void;
        onSelect: (plan: HostPlanType) => void;
        currentPlan?: HostPlanType
};

const plans = [
        {
                id: "solo" as const,
                name: "Solo",
                price: "$99",
                description: "Perfect for individual hosts managing a few vehicles.",
        },
        {
                id: "flex" as const,
                name: "Flex",
                price: "$249",
                description: "For growing businesses with multiple active rentals.",
        },
        {
                id: "fleet" as const,
                name: "Fleet",
                price: "$499",
                description: "Built for large operations and commercial fleets.",
        },
];


export default function ManageBillingModal({
        onClose,
        onSelect,
        currentPlan
}: ManageBillingModalProps) {
        return (
                <PopupWrapper
                        onClose={onClose}
                        popupTitle="Change Subscription Plan"
                        popupDescription="Choose the new plan that best fits your business."
                >
                        <div className="space-y-4">
                                {plans.map((plan) => (
                                        <button
                                                key={plan.id}
                                                onClick={() => onSelect(plan.id)}
                                                disabled={currentPlan === plan.id}
                                                className="w-full border border-[#E5E7EB] rounded-[10px] p-5 text-left hover:border-blue-700 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
                                        >
                                                <div className="flex items-start justify-between gap-4">
                                                        <div className="space-y-2">
                                                                <div className="flex gap-2 items-center justify-start">
                                                                        <h4 className="font-semibold text-lg text-neutral-950 font-text">
                                                                                {plan.name}
                                                                        </h4>
                                                                        {currentPlan === plan.id && <Badge className="bg-green-100 text-green-600">
                                                                                Current Plan
                                                                        </Badge>}
                                                                </div>

                                                                <p className="text-sm text-[#6B7280]">
                                                                        {plan.description}
                                                                </p>
                                                        </div>

                                                        <div className="text-right shrink-0">
                                                                <div className="text-2xl font-bold text-blue-700">
                                                                        {plan.price}
                                                                </div>
                                                                <span className="text-xs text-gray-500">
                                                                        per month
                                                                </span>
                                                        </div>
                                                </div>
                                        </button>
                                ))}
                        </div>
                </PopupWrapper>
        )
}
