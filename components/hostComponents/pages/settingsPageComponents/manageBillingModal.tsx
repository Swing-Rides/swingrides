"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Badge } from "@/components/ui/badge";
import { PopupWrapper } from "./settingsTabs";
import {
  HostBillingCycle,
  HostPlanType,
  UpgradePlanResponse,
  useCompleteHostPlanPaymentMutation,
} from "@/app/store/services/settingsApi";
import { CheckCircle2, Loader2 } from "lucide-react";

// ─── Stripe singleton ────────────────────────────────────────────────────────

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

// ─── Types ───────────────────────────────────────────────────────────────────

type ManageBillingModalProps = {
  onClose: () => void;
  onSelect: (
    plan: HostPlanType,
    billingCycle: HostBillingCycle,
  ) => Promise<UpgradePlanResponse | null>;
  currentPlan?: HostPlanType;
  onUpgradeComplete: () => void;
};

type ModalStep = "select" | "payment" | "success";

const plans = [
  {
    id: "solo" as const,
    name: "Solo",
    price: { monthly: "$99", yearly: "$987" },
    monthlyPrice: 99,
    description: "Perfect for individual hosts managing a few vehicles.",
  },
  {
    id: "flex" as const,
    name: "Flex",
    price: { monthly: "$249", yearly: "$2,483" },
    monthlyPrice: 249,
    description: "For growing businesses with multiple active rentals.",
  },
  {
    id: "fleet" as const,
    name: "Fleet",
    price: { monthly: "$499", yearly: "$4,970" },
    monthlyPrice: 499,
    description: "Built for large operations and commercial fleets.",
  },
];

// ─── Step 1: Plan selector ───────────────────────────────────────────────────

type PlanSelectStepProps = {
  currentPlan?: HostPlanType;
  billingCycle: HostBillingCycle;
  onBillingCycleChange: (cycle: HostBillingCycle) => void;
  onSelectPlan: (plan: HostPlanType) => void;
  isLoading: boolean;
  selectedPlan?: HostPlanType;
};

const PlanSelectStep = ({
  currentPlan,
  billingCycle,
  onBillingCycleChange,
  onSelectPlan,
  isLoading,
  selectedPlan,
}: PlanSelectStepProps) => (
  <div className="space-y-4">
    {/* Billing cycle toggle */}
    <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-lg p-1">
      {(["monthly", "yearly"] as HostBillingCycle[]).map((cycle) => (
        <button
          key={cycle}
          onClick={() => onBillingCycleChange(cycle)}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors capitalize cursor-pointer ${
            billingCycle === cycle
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {cycle}
          {cycle === "yearly" && (
            <span className="ml-1 text-xs text-green-600 font-semibold">
              −17%
            </span>
          )}
        </button>
      ))}
    </div>

    {/* Plan cards */}
    {plans.map((plan) => {
      const isCurrent = currentPlan === plan.id;
      const isSelected = selectedPlan === plan.id;

      return (
        <button
          key={plan.id}
          onClick={() => !isCurrent && onSelectPlan(plan.id)}
          disabled={isCurrent || isLoading}
          className={`w-full border rounded-[10px] p-5 text-left transition-all duration-300 ${
            isCurrent
              ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-70"
              : isSelected
                ? "border-blue-700 bg-blue-50 cursor-pointer"
                : "border-[#E5E7EB] hover:border-blue-700 hover:bg-blue-50 cursor-pointer"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <h4 className="font-semibold text-lg text-neutral-950 font-text">
                  {plan.name}
                </h4>
                {isCurrent && (
                  <Badge className="bg-green-100 text-green-600">
                    Current Plan
                  </Badge>
                )}
              </div>
              <p className="text-sm text-[#6B7280]">{plan.description}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-blue-700">
                {plan.price[billingCycle]}
              </div>
              <span className="text-xs text-gray-500">
                {billingCycle === "yearly" ? "per year" : "per month"}
              </span>
            </div>
          </div>
          {isSelected && isLoading && (
            <div className="flex items-center gap-2 mt-3 text-blue-600 text-sm">
              <Loader2 className="size-4 animate-spin" />
              <span>Preparing payment…</span>
            </div>
          )}
        </button>
      );
    })}
  </div>
);

// ─── Step 2: Stripe payment form ─────────────────────────────────────────────

type PaymentStepProps = {
  upgradeData: UpgradePlanResponse;
  onBack: () => void;
  onSuccess: () => void;
};

const PaymentForm = ({ upgradeData, onBack, onSuccess }: PaymentStepProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [completePayment] = useCompleteHostPlanPaymentMutation();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planLabel =
    plans.find((p) => p.id === upgradeData.plan)?.name ?? upgradeData.plan;
  const cycleLabel = upgradeData.billingCycle === "yearly" ? "year" : "month";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsConfirming(true);
    setError(null);

    // Confirm the payment with Stripe Elements
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setIsConfirming(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        await completePayment({
          paymentIntentId: upgradeData.paymentIntentId,
          plan: upgradeData.plan,
          billingCycle: upgradeData.billingCycle,
        }).unwrap();
        onSuccess();
      } catch {
        setError(
          "Payment confirmed but activation failed. Please contact support.",
        );
      }
    } else {
      setError("Payment was not completed. Please try again.");
    }

    setIsConfirming(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Summary */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-1">
        <p className="text-sm font-semibold text-blue-800">
          Upgrading to {planLabel} Plan
        </p>
        <p className="text-sm text-blue-700">
          ${upgradeData.totalAmount.toLocaleString()} / {cycleLabel}
          {upgradeData.discount > 0 && (
            <span className="ml-2 text-green-600 text-xs">
              (${upgradeData.discount.toLocaleString()} discount applied)
            </span>
          )}
        </p>
      </div>

      {/* Stripe Elements */}
      <PaymentElement />

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isConfirming}
          className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xs text-sm hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || !elements || isConfirming}
          className="flex-1 py-3 bg-blue-700 text-white rounded-xs text-sm hover:bg-blue-900 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isConfirming && <Loader2 className="size-4 animate-spin" />}
          {isConfirming ? "Processing…" : "Confirm Payment"}
        </button>
      </div>
    </form>
  );
};

// ─── Step 3: Success ─────────────────────────────────────────────────────────

const SuccessStep = ({
  plan,
  onClose,
}: {
  plan: HostPlanType;
  onClose: () => void;
}) => {
  const planLabel = plans.find((p) => p.id === plan)?.name ?? plan;

  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <div className="bg-green-100 rounded-full p-4">
        <CheckCircle2 className="size-10 text-green-600" />
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-lg text-neutral-900 font-text">
          Plan Upgraded!
        </h4>
        <p className="text-sm text-gray-500">
          You&apos;re now on the{" "}
          <span className="font-medium text-blue-700">{planLabel} Plan</span>.
          Your new subscription is active.
        </p>
      </div>
      <button
        onClick={onClose}
        className="mt-2 px-8 py-3 bg-blue-700 text-white rounded-xs text-sm hover:bg-blue-900 transition-colors cursor-pointer"
      >
        Done
      </button>
    </div>
  );
};

// ─── Root modal ──────────────────────────────────────────────────────────────

export default function ManageBillingModal({
  onClose,
  onSelect,
  currentPlan,
  onUpgradeComplete,
}: ManageBillingModalProps) {
  const [step, setStep] = useState<ModalStep>("select");
  const [billingCycle, setBillingCycle] = useState<HostBillingCycle>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<HostPlanType | undefined>();
  const [upgradeData, setUpgradeData] = useState<UpgradePlanResponse | null>(
    null,
  );
  const [isLoadingIntent, setIsLoadingIntent] = useState(false);

  const handleSelectPlan = async (plan: HostPlanType) => {
    setSelectedPlan(plan);
    setIsLoadingIntent(true);

    try {
      const data = await onSelect(plan, billingCycle);
      if (data) {
        setUpgradeData(data);
        setStep("payment");
      }
    } finally {
      setIsLoadingIntent(false);
    }
  };

  const handleSuccess = () => {
    setStep("success");
    onUpgradeComplete();
  };

  const stepTitles: Record<ModalStep, { title: string; description?: string }> =
    {
      select: {
        title: "Change Subscription Plan",
        description: "Choose the new plan that best fits your business.",
      },
      payment: {
        title: "Complete Payment",
        description: "Enter your card details to activate the new plan.",
      },
      success: { title: "Subscription Updated" },
    };

  return (
    <PopupWrapper
      onClose={onClose}
      popupTitle={stepTitles[step].title}
      popupDescription={stepTitles[step].description}
    >
      {step === "select" && (
        <PlanSelectStep
          currentPlan={currentPlan}
          billingCycle={billingCycle}
          onBillingCycleChange={setBillingCycle}
          onSelectPlan={handleSelectPlan}
          isLoading={isLoadingIntent}
          selectedPlan={selectedPlan}
        />
      )}

      {step === "payment" && upgradeData && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: upgradeData.clientSecret,
            appearance: { theme: "stripe" },
          }}
        >
          <PaymentForm
            upgradeData={upgradeData}
            onBack={() => setStep("select")}
            onSuccess={handleSuccess}
          />
        </Elements>
      )}

      {step === "success" && upgradeData && (
        <SuccessStep plan={upgradeData.plan} onClose={onClose} />
      )}
    </PopupWrapper>
  );
}
