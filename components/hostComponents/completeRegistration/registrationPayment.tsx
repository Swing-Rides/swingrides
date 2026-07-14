"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Loader2,
  Check,
  Tag,
  X,
} from "lucide-react";
import Link from "next/link";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import {
  CreateHostPlanPaymentIntentResponse,
  HostBillingCycle,
  HostPlanType,
  useCompleteHostPlanPaymentMutation,
  useCreateHostPlanPaymentIntentMutation,
  useCreateHostStripeConnectOnboardingLinkMutation,
} from "@/app/store/services/settingsApi";

type BillingCycle = HostBillingCycle;

type Package = {
  id: HostPlanType;
  name: string;
  /** Base monthly price. Yearly price is derived from this. */
  price: number;
  description: string;
  features: string[];
};

type AppliedCoupon = {
  code: string;
  label: string;
  percentOff: number;
};

type BillingAddress = {
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
};

interface RegistrationPaymentProps {
  package?: Package;
}

export const hostSubscriptionPackages: Package[] = [
  {
    id: "solo",
    name: "Solo",
    price: 99,
    description: "For hosts just getting started",
    features: [
      "List only 1 vehicle",
      "Booking management",
      "Basic maintenance alerts",
    ],
  },
  {
    id: "flex",
    name: "Flex",
    price: 249,
    description: "For hosts scaling their fleet",
    features: [
      "List up to 5 vehicles",
      "Expense capture + invoicing",
      "Toll record history",
      "Financial reports + audit export",
    ],
  },
  {
    id: "fleet",
    name: "Fleet",
    price: 499,
    description: "For established fleet operators",
    features: [
      "List up to 15 vehicles",
      "Maintenance scheduling + vendor tracking",
      "Odometer history per vehicle",
      "Priority escalation support",
      "MRR dashboard & revenue analytics",
    ],
  },
];

const YEARLY_DISCOUNT = 0.17; // 17% off when billed annually

// ─── Stripe ──────────────────────────────────────────────────────────────────

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const VALID_COUPONS: Record<string, { label: string; percentOff: number }> = {
  SAVE10: { label: "10% off", percentOff: 10 },
  WELCOME20: { label: "20% off", percentOff: 20 },
};

const inFlightHostPlanPaymentIntentRequests = new Map<
  string,
  Promise<{ data: CreateHostPlanPaymentIntentResponse }>
>();

async function validateCoupon(
  code: string,
): Promise<{ valid: boolean; label?: string; percentOff?: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const coupon = VALID_COUPONS[code.trim().toUpperCase()];
      resolve(coupon ? { valid: true, ...coupon } : { valid: false });
    }, 600);
  });
}

// ─── Pricing helpers ────────────────────────────────────────────────────────

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);

const getSubtotal = (pkg: Package, cycle: BillingCycle) =>
  cycle === "yearly"
    ? Math.round(pkg.price * 12 * (1 - YEARLY_DISCOUNT) * 100) / 100
    : pkg.price;

const computeTotals = (
  pkg: Package | null,
  cycle: BillingCycle,
  coupon: AppliedCoupon | null,
) => {
  if (!pkg) return { subtotal: 0, discount: 0, total: 0 };
  const subtotal = getSubtotal(pkg, cycle);
  const discount = coupon
    ? Math.round(subtotal * (coupon.percentOff / 100) * 100) / 100
    : 0;
  const total = Math.max(subtotal - discount, 0);
  return { subtotal, discount, total };
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

// ─── Main Component ───────────────────────────────────────────────────────────────

export default function RegistrationPayment({
  package: initialPackage,
}: RegistrationPaymentProps) {
  const searchParams = useSearchParams();
  const packageParam = searchParams.get("package");
  const redirectStatus = searchParams.get("redirect_status");
  const redirectedPaymentIntentId = searchParams.get("payment_intent");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(
    () => {
      const resolvedPackageId = initialPackage?.id ?? packageParam;
      if (!resolvedPackageId) return initialPackage ?? null;

      return (
        hostSubscriptionPackages.find((pkg) => pkg.id === resolvedPackageId) ??
        initialPackage ??
        null
      );
    },
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(() => {
    const cycle = searchParams.get("billingCycle");
    return cycle === "yearly" ? "yearly" : "monthly";
  });

  const [preparedPayment, setPreparedPayment] = useState<{
    key: string;
    clientSecret: string;
  } | null>(null);
  const [paymentIntentAttempt, setPaymentIntentAttempt] = useState(0);
  // Tracks which params the current clientSecret was actually prepared for, so
  // "is a fetch in progress" can be derived by comparison instead of toggled
  // with an explicit setState call inside the effect (see effect below).
  const [preparedFor, setPreparedFor] = useState<string | null>(null);

  const [address, setAddress] = useState<BillingAddress>({
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null,
  );
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);
  const [isStripeOnboardingComplete, setIsStripeOnboardingComplete] =
    useState(false);
  const [finalizedPaymentIntentId, setFinalizedPaymentIntentId] = useState<
    string | null
  >(null);
  const [createHostPlanPaymentIntent] = useCreateHostPlanPaymentIntentMutation();
  const [completeHostPlanPayment] = useCompleteHostPlanPaymentMutation();
  const [createHostStripeConnectOnboardingLink, { isLoading: isCreatingOnboardingLink }] =
    useCreateHostStripeConnectOnboardingLinkMutation();

  const { subtotal, discount, total } = computeTotals(
    selectedPackage,
    billingCycle,
    appliedCoupon,
  );

  // Identifies the exact params the payment intent should reflect right now.
  // Comparing this to `preparedFor` lets us derive "is a fetch in flight"
  // during render instead of storing it as separate state.
  const paymentRequestKey = selectedPackage
    ? `${selectedPackage.id}|${billingCycle}|${appliedCoupon?.code ?? ""}|${paymentIntentAttempt}`
    : null;
  const clientSecret =
    paymentRequestKey && preparedPayment?.key === paymentRequestKey
      ? preparedPayment.clientSecret
      : null;
  const isPreparingPayment =
    selectedPackage !== null && preparedFor !== paymentRequestKey;

  useEffect(() => {
    // #region debug-point A:component-mount
    fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"host-plan-intent-dup",runId:"pre-fix",hypothesisId:"A",location:"registrationPayment.tsx:mount",msg:"[DEBUG] RegistrationPayment mounted",data:{packageParam,billingCycle,selectedPackageId:selectedPackage?.id ?? null,paymentRequestKey},ts:Date.now()})}).catch(()=>{});
    // #endregion
    return () => {
      // #region debug-point A:component-unmount
      fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"host-plan-intent-dup",runId:"pre-fix",hypothesisId:"A",location:"registrationPayment.tsx:unmount",msg:"[DEBUG] RegistrationPayment unmounted",data:{packageParam,billingCycle,selectedPackageId:selectedPackage?.id ?? null,paymentRequestKey},ts:Date.now()})}).catch(()=>{});
      // #endregion
    };
  }, [billingCycle, packageParam, paymentRequestKey, selectedPackage?.id]);

  // (Re)creates the PaymentIntent whenever the package, cycle, or coupon changes.
  // setState only ever happens inside the .then() callback below — never
  // synchronously in the effect body — which is the pattern React's
  // "cascading renders" diagnostic expects for effects that fetch data.
  // `cancelled` guards against a stale response clobbering a newer request:
  // React runs the cleanup from the previous run before starting a new one,
  // so this is safe under Strict Mode's dev double-invoke and fast re-selections.
  useEffect(() => {
    if (!selectedPackage || !paymentRequestKey) return;

    let cancelled = false;
    const key = paymentRequestKey;
    const existingRequest = inFlightHostPlanPaymentIntentRequests.get(key);

    // #region debug-point B:create-intent-start
    fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"host-plan-intent-dup",runId:"pre-fix",hypothesisId:"B",location:"registrationPayment.tsx:create-intent:start",msg:"[DEBUG] createHostPlanPaymentIntent requested",data:{key,plan:selectedPackage.id,billingCycle,couponCode:appliedCoupon?.code ?? null,reusedInFlightRequest:Boolean(existingRequest)},ts:Date.now()})}).catch(()=>{});
    // #endregion

    const requestPromise: Promise<{ data: CreateHostPlanPaymentIntentResponse }> =
      existingRequest ??
      createHostPlanPaymentIntent({
        plan: selectedPackage.id,
        billingCycle,
        couponCode: appliedCoupon?.code,
      }).unwrap();

    if (!existingRequest) {
      inFlightHostPlanPaymentIntentRequests.set(key, requestPromise);
    }

    void requestPromise
      .then((res) => {
        if (cancelled) return;
        // #region debug-point B:create-intent-success
        fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"host-plan-intent-dup",runId:"pre-fix",hypothesisId:"B",location:"registrationPayment.tsx:create-intent:success",msg:"[DEBUG] createHostPlanPaymentIntent resolved",data:{key,paymentIntentId:res.data.id,subscriptionId:res.data.subscriptionId,clientSecretPresent:Boolean(res.data.clientSecret)},ts:Date.now()})}).catch(()=>{});
        // #endregion
        setPreparedPayment({
          key,
          clientSecret: res.data.clientSecret,
        });
        setPreparedFor(key);
        setError(null);
      })
      .catch((createIntentError) => {
        if (cancelled) return;
        // #region debug-point B:create-intent-error
        fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"host-plan-intent-dup",runId:"pre-fix",hypothesisId:"B",location:"registrationPayment.tsx:create-intent:error",msg:"[DEBUG] createHostPlanPaymentIntent failed",data:{key,errorMessage:getErrorMessage(createIntentError,"unknown error")},ts:Date.now()})}).catch(()=>{});
        // #endregion
        setPreparedPayment(null);
        setPreparedFor(key);
        setError(
          getErrorMessage(
            createIntentError,
            "Unable to prepare your host plan payment.",
          ),
        );
      })
      .finally(() => {
        if (inFlightHostPlanPaymentIntentRequests.get(key) === requestPromise) {
          inFlightHostPlanPaymentIntentRequests.delete(key);
        }
      });

    return () => {
      // #region debug-point B:create-intent-cleanup
      fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"host-plan-intent-dup",runId:"pre-fix",hypothesisId:"B",location:"registrationPayment.tsx:create-intent:cleanup",msg:"[DEBUG] createHostPlanPaymentIntent effect cleaned up",data:{key},ts:Date.now()})}).catch(()=>{});
      // #endregion
      cancelled = true;
    };
  }, [
    appliedCoupon,
    billingCycle,
    createHostPlanPaymentIntent,
    paymentRequestKey,
    selectedPackage,
  ]);

  useEffect(() => {
    if (
      redirectStatus !== "succeeded" ||
      !redirectedPaymentIntentId ||
      !selectedPackage ||
      finalizedPaymentIntentId === redirectedPaymentIntentId
    ) {
      return;
    }

    let cancelled = false;

    void completeHostPlanPayment({
      paymentIntentId: redirectedPaymentIntentId,
      plan: selectedPackage.id,
      billingCycle,
    })
      .unwrap()
      .then((response) => {
        if (cancelled) return;
        setFinalizedPaymentIntentId(redirectedPaymentIntentId);
        setOnboardingUrl(response.data.onboardingUrl ?? null);
        setIsStripeOnboardingComplete(
          response.data.stripeConnect?.onboardingComplete ?? false,
        );
        setIsSuccess(true);
      })
      .catch((paymentError) => {
        if (cancelled) return;
        setError(
          getErrorMessage(
            paymentError,
            "Payment succeeded, but we could not activate your host plan.",
          ),
        );
      });

    return () => {
      cancelled = true;
    };
  }, [
    billingCycle,
    completeHostPlanPayment,
    finalizedPaymentIntentId,
    redirectedPaymentIntentId,
    redirectStatus,
    selectedPackage,
  ]);

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsDropdownOpen(false);
    setError(null);
  };

  const handleSelectBillingCycle = (cycle: BillingCycle) => {
    setBillingCycle(cycle);
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponError(null);
    setIsApplyingCoupon(true);
    const result = await validateCoupon(couponInput);
    setIsApplyingCoupon(false);

    if (result.valid && result.label && result.percentOff !== undefined) {
      const coupon = {
        code: couponInput.trim().toUpperCase(),
        label: result.label,
        percentOff: result.percentOff,
      };
      setAppliedCoupon(coupon);
      setCouponInput("");
    } else {
      setCouponError("That coupon code isn't valid.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const handleRetryPreparePayment = () => {
    setPreparedFor(null);
    setPaymentIntentAttempt((previous) => previous + 1);
  };

  const handleCompleteStripeOnboarding = async () => {
    if (onboardingUrl) {
      window.location.href = onboardingUrl;
      return;
    }

    try {
      const response = await createHostStripeConnectOnboardingLink().unwrap();
      if (response.data.url) {
        window.location.href = response.data.url;
        return;
      }
      setIsStripeOnboardingComplete(
        response.data.stripeConnect.onboardingComplete,
      );
    } catch (onboardingError) {
      setError(
        getErrorMessage(
          onboardingError,
          "We couldn't start Stripe onboarding right now.",
        ),
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-green-100 text-green-600">
            <Check className="size-8" />
          </div>
          <span className="text-xl font-semibold text-gray-900">
            Payment successful
          </span>
          <span className="text-sm text-gray-500">
            {isStripeOnboardingComplete
              ? "Upload your business license to complete your host verification."
              : "Complete Stripe onboarding so you can receive booking payments."}
          </span>
          {isStripeOnboardingComplete ? (
            <Link
              className="py-2.5 px-6 rounded-xs border border-blue-700 text-white bg-blue-700 hover:bg-blue-950 transition-colors duration-300"
              href={`${HOST_DASHBOARD_PATH}host-complete-registration/`}
            >
              Verify Now
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleCompleteStripeOnboarding}
              disabled={isCreatingOnboardingLink}
              className="py-2.5 px-6 rounded-xs border border-blue-700 text-white bg-blue-700 hover:bg-blue-950 transition-colors duration-300 disabled:opacity-60"
            >
              {isCreatingOnboardingLink
                ? "Preparing Stripe onboarding..."
                : "Complete Stripe onboarding"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 border-b border-gray-100">
        <div className="flex items-center justify-center size-12 rounded-full bg-blue-50 text-blue-700 mb-4">
          <ShieldCheck className="size-6" />
        </div>
        <span className="block text-xl font-semibold text-gray-900 leading-tight">
          Complete your registration
        </span>
        <span className="block text-sm text-gray-500 mt-2 leading-relaxed">
          Choose a hosting package below and complete payment to unlock your
          dashboard and start listing your vehicles.
        </span>
      </div>

      {/* Body */}
      <div className="px-6 py-6 flex flex-col gap-5">
        {/* Billing cycle toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 w-fit">
          <button
            type="button"
            onClick={() => handleSelectBillingCycle("monthly")}
            className={[
              "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200",
              billingCycle === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            ].join(" ")}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => handleSelectBillingCycle("yearly")}
            className={[
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200",
              billingCycle === "yearly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            ].join(" ")}
          >
            Yearly
            <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
              Save 17%
            </span>
          </button>
        </div>

        {/* Package dropdown */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-700">
            Select a package
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={[
                "w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border text-left transition-colors duration-200",
                selectedPackage
                  ? "border-blue-200 bg-blue-50/40"
                  : "border-gray-200 hover:border-gray-300",
              ].join(" ")}
            >
              {selectedPackage ? (
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {selectedPackage.name} —{" "}
                    {formatPrice(getSubtotal(selectedPackage, billingCycle))}/
                    {billingCycle === "monthly" ? "mo" : "yr"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {selectedPackage.description}
                  </span>
                </span>
              ) : (
                <span className="text-sm text-gray-400">
                  Choose a package...
                </span>
              )}
              <ChevronDown
                className={[
                  "size-4 text-gray-400 shrink-0 transition-transform duration-200",
                  isDropdownOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                {hostSubscriptionPackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => handleSelectPackage(pkg)}
                    className={[
                      "w-full flex flex-col gap-1 px-4 py-3 text-left transition-colors duration-150 border-b border-gray-50 last:border-b-0",
                      selectedPackage?.id === pkg.id
                        ? "bg-blue-50"
                        : "hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <span className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {pkg.name}
                      </span>
                      <span className="text-sm font-semibold text-blue-700">
                        {formatPrice(getSubtotal(pkg, billingCycle))}/
                        {billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </span>
                    <span className="text-xs text-gray-500">
                      {pkg.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected package features */}
        {selectedPackage && (
          <div className="flex flex-col gap-2 px-4 py-3 rounded-xl bg-gray-50">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              What&apos;s included
            </span>
            <div className="flex flex-col gap-1.5">
              {selectedPackage.features.map((feature) => (
                <span
                  key={feature}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <Check className="size-3.5 text-blue-700 shrink-0" />
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Billing address */}
        <div className="flex flex-col gap-3 pt-1">
          <span className="text-sm font-medium text-gray-700">
            Billing address
          </span>

          <input
            type="text"
            placeholder="Street address"
            value={address.streetAddress}
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, streetAddress: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
          />

          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, city: e.target.value }))
              }
              className="col-span-1 px-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            />
            <input
              type="text"
              placeholder="State"
              value={address.state}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, state: e.target.value }))
              }
              className="col-span-1 px-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            />
            <input
              type="text"
              placeholder="Postal code"
              value={address.postalCode}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, postalCode: e.target.value }))
              }
              className="col-span-1 px-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            />
          </div>
        </div>

        {/* Coupon code */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Tag className="size-4 text-gray-400" />
            Coupon code
          </span>

          {appliedCoupon ? (
            <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-green-200 bg-green-50">
              <span className="flex items-center gap-2 text-sm font-medium text-green-700">
                <Check className="size-3.5 shrink-0" />
                {appliedCoupon.code} applied — {appliedCoupon.label}
              </span>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-green-700 hover:text-green-900 transition-colors duration-150"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                  setCouponError(null);
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 uppercase"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={!couponInput.trim() || isApplyingCoupon}
                className="px-4 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isApplyingCoupon ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
            </div>
          )}
          {couponError && (
            <span className="text-xs text-red-600">{couponError}</span>
          )}
        </div>

        {/* Order summary */}
        {selectedPackage && (
          <div className="flex flex-col gap-2 px-4 py-3 rounded-xl bg-gray-50">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Order summary
            </span>
            <div className="flex items-center justify-between text-sm text-gray-700">
              <span>
                {selectedPackage.name} plan (
                {billingCycle === "monthly"
                  ? "billed monthly"
                  : "billed annually"}
                )
              </span>
              <span className="font-medium text-gray-900">
                {formatPrice(subtotal)}
              </span>
            </div>
            {appliedCoupon && (
              <div className="flex items-center justify-between text-sm text-green-700">
                <span>Coupon ({appliedCoupon.code})</span>
                <span className="font-medium">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="h-px bg-gray-200 my-1" />
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-900">
                Total due today
              </span>
              <span className="font-semibold text-blue-700 text-base">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        )}

        {/* Payment — Stripe handles card details */}
        <div className="flex flex-col gap-3 pt-1">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <CreditCard className="size-4 text-gray-400" />
            Card details
          </span>

          {!selectedPackage ? (
            <span className="text-sm text-gray-400 px-4 py-3 rounded-xl border border-dashed border-gray-200">
              Select a package to enter payment details
            </span>
          ) : isPreparingPayment ? (
            <span className="flex items-center gap-2 text-sm text-gray-400 px-4 py-3 rounded-xl border border-gray-100">
              <Loader2 className="size-4 animate-spin" />
              Preparing secure payment form...
            </span>
          ) : !clientSecret ? (
            <div className="flex flex-col gap-3 px-4 py-3 rounded-xl border border-red-100 bg-red-50">
              <span className="text-sm text-red-700">
                {error ?? "We couldn't prepare your payment form."}
              </span>
              <button
                type="button"
                onClick={handleRetryPreparePayment}
                className="w-fit px-3 py-2 rounded-lg text-sm font-medium bg-white text-red-700 border border-red-200 hover:bg-red-100 transition-colors duration-200"
              >
                Try again
              </button>
            </div>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripePaymentFields
                selectedPackage={selectedPackage}
                billingCycle={billingCycle}
                address={address}
                total={total}
                error={error}
                setError={setError}
                onSuccess={(paymentIntentId) => {
                  setFinalizedPaymentIntentId(paymentIntentId);
                  setIsSuccess(true);
                }}
              />
            </Elements>
          )}

          <span className="text-xs text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" />
            Payments are securely processed by Stripe
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Stripe payment fields + submit ────────────────────────────────────────

function StripePaymentFields({
  selectedPackage,
  billingCycle,
  address,
  total,
  error,
  setError,
  onSuccess,
}: {
  selectedPackage: Package;
  billingCycle: BillingCycle;
  address: BillingAddress;
  total: number;
  error: string | null;
  setError: (msg: string | null) => void;
  onSuccess: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [completeHostPlanPayment] = useCompleteHostPlanPaymentMutation();

  const handlePay = async () => {
    if (
      !address.streetAddress ||
      !address.city ||
      !address.state ||
      !address.postalCode
    ) {
      setError("Please complete your billing address.");
      return;
    }
    if (!stripe || !elements) return;

    setError(null);
    setIsProcessing(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set("package", selectedPackage.id);
    params.set("billingCycle", billingCycle);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${window.location.pathname}?${params.toString()}`,
        payment_method_data: {
          billing_details: {
            address: {
              line1: address.streetAddress,
              city: address.city,
              state: address.state,
              postal_code: address.postalCode,
            },
          },
        },
      },
      redirect: "if_required",
    });

    const confirmError = result.error;
    if (confirmError) {
      setError(
        confirmError.message ??
          "Something went wrong processing your payment. Please try again.",
      );
      setIsProcessing(false);
      return;
    }

    const paymentIntentId = result.paymentIntent?.id;
    if (!paymentIntentId) {
      setError("Payment was processed, but no payment reference was returned.");
      setIsProcessing(false);
      return;
    }

    try {
      await completeHostPlanPayment({
        paymentIntentId,
        plan: selectedPackage.id,
        billingCycle,
      }).unwrap();
      onSuccess(paymentIntentId);
    } catch (paymentError) {
      setError(
        getErrorMessage(
          paymentError,
          "Payment succeeded, but we could not activate your host plan.",
        ),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <PaymentElement />

      {error && (
        <span className="block text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </span>
      )}

      <button
        type="button"
        onClick={handlePay}
        disabled={isProcessing || !stripe || !elements}
        className={[
          "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors duration-200",
          isProcessing || !stripe || !elements
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-700 text-white hover:bg-blue-800",
        ].join(" ")}
      >
        {isProcessing ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Processing payment...
          </>
        ) : (
          <>
            Pay {formatPrice(total)} for {selectedPackage.name} (
            {billingCycle === "monthly" ? "monthly" : "yearly"})
          </>
        )}
      </button>
    </div>
  );
}
