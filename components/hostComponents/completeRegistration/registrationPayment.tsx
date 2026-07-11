"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import {
        Elements,
        PaymentElement,
        useElements,
        useStripe,
} from "@stripe/react-stripe-js"
import { ChevronDown, ShieldCheck, CreditCard, Loader2, Check, Tag, X } from "lucide-react"

type BillingCycle = "monthly" | "yearly"

type Package = {
        id: string
        name: string
        /** Base monthly price. Yearly price is derived from this. */
        price: number
        description: string
        features: string[]
}

type AppliedCoupon = {
        code: string
        label: string
        percentOff: number
}

type BillingAddress = {
        streetAddress: string
        city: string
        state: string
        postalCode: string
}

interface RegistrationPaymentProps {
        package?: Package;
}


export const hostSubscriptionPackages: Package[] = [
        {
                id: "solo",
                name: "Solo",
                price: 79,
                description: "For hosts just getting started",
                features: ["List only 1 vehicle", "Booking management", "Basic maintenance alerts"],
        },
        {
                id: "flex",
                name: "Flex",
                price: 199,
                description: "For hosts scaling their fleet",
                features: ["List up to 5 vehicles", "Expense capture + invoicing", "Toll record history", "Financial reports + audit export"],
        },
        {
                id: "fleet",
                name: "Fleet",
                price: 349,
                description: "For established fleet operators",
                features: ["List up to 15 vehicles", "Maintenance scheduling + vendor tracking", "Odometer history per vehicle", "Priority escalation support", "MRR dashboard & revenue analytics"],
        },
]

const YEARLY_DISCOUNT = 0.17 // 17% off when billed annually

// ─── Stripe ──────────────────────────────────────────────────────────────────

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// ─── Placeholder server calls ───────────────────────────────────────────────
// Replace with real endpoints:
// 1. createPaymentIntent -> POST to your server to create/update a PaymentIntent
//    (or Subscription) for the selected package, billing cycle, and coupon.
// 2. validateCoupon -> POST to your server to check the coupon against Stripe
//    (or your own promotions table) and return the discount it grants.

async function createPaymentIntent({
        packageId,
        billingCycle,
        amount,
        couponCode,
}: {
        packageId: string
        billingCycle: BillingCycle
        amount: number
        couponCode?: string
}): Promise<{ clientSecret: string }> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = { packageId, billingCycle, amount, couponCode }
        return new Promise((resolve) => {
                setTimeout(() => resolve({ clientSecret: "pi_mock_client_secret" }), 700)
        })
}

const VALID_COUPONS: Record<string, { label: string; percentOff: number }> = {
        SAVE10: { label: "10% off", percentOff: 10 },
        WELCOME20: { label: "20% off", percentOff: 20 },
}

async function validateCoupon(
        code: string,
): Promise<{ valid: boolean; label?: string; percentOff?: number }> {
        return new Promise((resolve) => {
                setTimeout(() => {
                        const coupon = VALID_COUPONS[code.trim().toUpperCase()]
                        resolve(coupon ? { valid: true, ...coupon } : { valid: false })
                }, 600)
        })
}

// ─── Pricing helpers ────────────────────────────────────────────────────────

const formatPrice = (amount: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount)

const getSubtotal = (pkg: Package, cycle: BillingCycle) =>
        cycle === "yearly" ? Math.round(pkg.price * 12 * (1 - YEARLY_DISCOUNT) * 100) / 100 : pkg.price

const computeTotals = (pkg: Package | null, cycle: BillingCycle, coupon: AppliedCoupon | null) => {
        if (!pkg) return { subtotal: 0, discount: 0, total: 0 }
        const subtotal = getSubtotal(pkg, cycle)
        const discount = coupon ? Math.round(subtotal * (coupon.percentOff / 100) * 100) / 100 : 0
        const total = Math.max(subtotal - discount, 0)
        return { subtotal, discount, total }
}

// ─── Main Component ───────────────────────────────────────────────────────────────

export default function RegistrationPayment({
        package: initialPackage,
}: RegistrationPaymentProps) {
        const router = useRouter()

        const [isDropdownOpen, setIsDropdownOpen] = useState(false)
        const [selectedPackage, setSelectedPackage] = useState<Package | null>(() => initialPackage ?? null);
        const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")

        const [clientSecret, setClientSecret] = useState<string | null>(null);
        // Tracks which params the current clientSecret was actually prepared for, so
        // "is a fetch in progress" can be derived by comparison instead of toggled
        // with an explicit setState call inside the effect (see effect below).
        const [preparedFor, setPreparedFor] = useState<string | null>(null);

        const [address, setAddress] = useState<BillingAddress>({
                streetAddress: "",
                city: "",
                state: "",
                postalCode: "",
        })

        const [couponInput, setCouponInput] = useState("")
        const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)
        const [couponError, setCouponError] = useState<string | null>(null)
        const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

        const [error, setError] = useState<string | null>(null)
        const [isSuccess, setIsSuccess] = useState(false)

        const { subtotal, discount, total } = computeTotals(selectedPackage, billingCycle, appliedCoupon)

        // Identifies the exact params the payment intent should reflect right now.
        // Comparing this to `preparedFor` lets us derive "is a fetch in flight"
        // during render instead of storing it as separate state.
        const paymentKey = selectedPackage
                ? `${selectedPackage.id}|${billingCycle}|${appliedCoupon?.code ?? ""}`
                : null
        const isPreparingPayment = selectedPackage !== null && preparedFor !== paymentKey

        // (Re)creates the PaymentIntent whenever the package, cycle, or coupon changes.
        // setState only ever happens inside the .then() callback below — never
        // synchronously in the effect body — which is the pattern React's
        // "cascading renders" diagnostic expects for effects that fetch data.
        // `cancelled` guards against a stale response clobbering a newer request:
        // React runs the cleanup from the previous run before starting a new one,
        // so this is safe under Strict Mode's dev double-invoke and fast re-selections.
        useEffect(() => {
                if (!selectedPackage) return

                let cancelled = false
                const key = paymentKey
                const { total: amount } = computeTotals(selectedPackage, billingCycle, appliedCoupon)

                createPaymentIntent({
                        packageId: selectedPackage.id,
                        billingCycle,
                        amount,
                        couponCode: appliedCoupon?.code,
                }).then((res) => {
                        if (cancelled) return // effect was superseded or component unmounted
                        setClientSecret(res.clientSecret)
                        setPreparedFor(key)
                })

                return () => {
                        cancelled = true
                }
        }, [selectedPackage, billingCycle, appliedCoupon, paymentKey])

        const handleSelectPackage = (pkg: Package) => {
                setSelectedPackage(pkg)
                setIsDropdownOpen(false)
                setError(null)
        }

        const handleSelectBillingCycle = (cycle: BillingCycle) => {
                setBillingCycle(cycle)
        }

        const handleApplyCoupon = async () => {
                if (!couponInput.trim()) return
                setCouponError(null)
                setIsApplyingCoupon(true)
                const result = await validateCoupon(couponInput)
                setIsApplyingCoupon(false)

                if (result.valid && result.label && result.percentOff !== undefined) {
                        const coupon = { code: couponInput.trim().toUpperCase(), label: result.label, percentOff: result.percentOff }
                        setAppliedCoupon(coupon)
                        setCouponInput("")
                } else {
                        setCouponError("That coupon code isn't valid.")
                }
        }

        const handleRemoveCoupon = () => {
                setAppliedCoupon(null)
                setCouponError(null)
        }

        if (isSuccess) {
                return (
                        <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
                                <div className="flex flex-col items-center gap-4 text-center">
                                        <div className="flex items-center justify-center size-16 rounded-full bg-green-100 text-green-600">
                                                <Check className="size-8" />
                                        </div>
                                        <span className="text-xl font-semibold text-gray-900">Payment successful</span>
                                        <span className="text-sm text-gray-500">Setting up your dashboard...</span>
                                </div>
                        </div>
                )
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
                                        Choose a hosting package below and complete payment to unlock your dashboard and start listing your vehicles.
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
                                                        billingCycle === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700",
                                                ].join(" ")}
                                        >
                                                Monthly
                                        </button>
                                        <button
                                                type="button"
                                                onClick={() => handleSelectBillingCycle("yearly")}
                                                className={[
                                                        "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200",
                                                        billingCycle === "yearly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700",
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
                                        <span className="text-sm font-medium text-gray-700">Select a package</span>

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
                                                                                {selectedPackage.name} — {formatPrice(getSubtotal(selectedPackage, billingCycle))}/{billingCycle === "monthly" ? "mo" : "yr"}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">{selectedPackage.description}</span>
                                                                </span>
                                                        ) : (
                                                                <span className="text-sm text-gray-400">Choose a package...</span>
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
                                                                                        selectedPackage?.id === pkg.id ? "bg-blue-50" : "hover:bg-gray-50",
                                                                                ].join(" ")}
                                                                        >
                                                                                <span className="flex items-center justify-between">
                                                                                        <span className="text-sm font-medium text-gray-900">{pkg.name}</span>
                                                                                        <span className="text-sm font-semibold text-blue-700">
                                                                                                {formatPrice(getSubtotal(pkg, billingCycle))}/{billingCycle === "monthly" ? "mo" : "yr"}
                                                                                        </span>
                                                                                </span>
                                                                                <span className="text-xs text-gray-500">{pkg.description}</span>
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
                                                                <span key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                                                                        <Check className="size-3.5 text-blue-700 shrink-0" />
                                                                        {feature}
                                                                </span>
                                                        ))}
                                                </div>
                                        </div>
                                )}

                                {/* Billing address */}
                                <div className="flex flex-col gap-3 pt-1">
                                        <span className="text-sm font-medium text-gray-700">Billing address</span>

                                        <input
                                                type="text"
                                                placeholder="Street address"
                                                value={address.streetAddress}
                                                onChange={(e) => setAddress((prev) => ({ ...prev, streetAddress: e.target.value }))}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                        />

                                        <div className="grid grid-cols-3 gap-3">
                                                <input
                                                        type="text"
                                                        placeholder="City"
                                                        value={address.city}
                                                        onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
                                                        className="col-span-1 px-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                                />
                                                <input
                                                        type="text"
                                                        placeholder="State"
                                                        value={address.state}
                                                        onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
                                                        className="col-span-1 px-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                                />
                                                <input
                                                        type="text"
                                                        placeholder="Postal code"
                                                        value={address.postalCode}
                                                        onChange={(e) => setAddress((prev) => ({ ...prev, postalCode: e.target.value }))}
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
                                                                        setCouponInput(e.target.value)
                                                                        setCouponError(null)
                                                                }}
                                                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 uppercase"
                                                        />
                                                        <button
                                                                type="button"
                                                                onClick={handleApplyCoupon}
                                                                disabled={!couponInput.trim() || isApplyingCoupon}
                                                                className="px-4 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                                                        >
                                                                {isApplyingCoupon ? <Loader2 className="size-4 animate-spin" /> : "Apply"}
                                                        </button>
                                                </div>
                                        )}
                                        {couponError && <span className="text-xs text-red-600">{couponError}</span>}
                                </div>

                                {/* Order summary */}
                                {selectedPackage && (
                                        <div className="flex flex-col gap-2 px-4 py-3 rounded-xl bg-gray-50">
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                        Order summary
                                                </span>
                                                <div className="flex items-center justify-between text-sm text-gray-700">
                                                        <span>
                                                                {selectedPackage.name} plan ({billingCycle === "monthly" ? "billed monthly" : "billed annually"})
                                                        </span>
                                                        <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                                                </div>
                                                {appliedCoupon && (
                                                        <div className="flex items-center justify-between text-sm text-green-700">
                                                                <span>Coupon ({appliedCoupon.code})</span>
                                                                <span className="font-medium">-{formatPrice(discount)}</span>
                                                        </div>
                                                )}
                                                <div className="h-px bg-gray-200 my-1" />
                                                <div className="flex items-center justify-between text-sm">
                                                        <span className="font-semibold text-gray-900">Total due today</span>
                                                        <span className="font-semibold text-blue-700 text-base">{formatPrice(total)}</span>
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
                                        ) : isPreparingPayment || !clientSecret ? (
                                                <span className="flex items-center gap-2 text-sm text-gray-400 px-4 py-3 rounded-xl border border-gray-100">
                                                        <Loader2 className="size-4 animate-spin" />
                                                        Preparing secure payment form...
                                                </span>
                                        ) : (
                                                <Elements stripe={stripePromise} options={{ clientSecret }}>
                                                        <StripePaymentFields
                                                                selectedPackage={selectedPackage}
                                                                billingCycle={billingCycle}
                                                                address={address}
                                                                total={total}
                                                                router={router}
                                                                error={error}
                                                                setError={setError}
                                                                onSuccess={() => setIsSuccess(true)}
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
        )
}

// ─── Stripe payment fields + submit ────────────────────────────────────────

function StripePaymentFields({
        selectedPackage,
        billingCycle,
        address,
        total,
        router,
        error,
        setError,
        onSuccess,
}: {
        selectedPackage: Package
        billingCycle: BillingCycle
        address: BillingAddress
        total: number
        router: ReturnType<typeof useRouter>
        error: string | null
        setError: (msg: string | null) => void
        onSuccess: () => void
}) {
        const stripe = useStripe()
        const elements = useElements()
        const [isProcessing, setIsProcessing] = useState(false)

        const handlePay = async () => {
                if (!address.streetAddress || !address.city || !address.state || !address.postalCode) {
                        setError("Please complete your billing address.")
                        return
                }
                if (!stripe || !elements) return

                setError(null)
                setIsProcessing(true)

                const { error: confirmError } = await stripe.confirmPayment({
                        elements,
                        confirmParams: {
                                return_url: `${window.location.origin}/us/host`,
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
                })

                if (confirmError) {
                        setError(confirmError.message ?? "Something went wrong processing your payment. Please try again.")
                        setIsProcessing(false)
                        return
                }

                onSuccess()
                setTimeout(() => {
                        router.push("/us/host")
                }, 1200)
        }

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
                                        <>Pay {formatPrice(total)} for {selectedPackage.name} ({billingCycle === "monthly" ? "monthly" : "yearly"})</>
                                )}
                        </button>
                </div>
        )
}