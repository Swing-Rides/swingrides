"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ShieldCheck, CreditCard, Loader2, Check } from "lucide-react"

type Package = {
        id: string
        name: string
        price: number
        billingCycle: string
        description: string
        features: string[]
}

const packages: Package[] = [
        {
                id: "solo",
                name: "Solo",
                price: 79,
                billingCycle: "month",
                description: "For hosts just getting started",
                features: ["List only 1 vehicle", "Booking management", "Basic maintenance alerts"],
        },
        {
                id: "flex",
                name: "Flex",
                price: 199,
                billingCycle: "month",
                description: "For hosts scaling their fleet",
                features: ["List up to 5 vehicles", "Expense capture + invoicing", "Toll record history", "Financial reports + audit export"],
        },
        {
                id: "fleet",
                name: "Fleet",
                price: 349,
                billingCycle: "month",
                description: "For established fleet operators",
                features: ["List up to 15 vehicles", "Maintenance scheduling + vendor tracking", "Odometer history per vehicle", "Priority escalation support", "MRR dashboard & revenue analytics"],
        },
]

// ─── Stripe placeholder ─────────────────────────────────────────────────────
// Replace with a real flow:
// 1. POST to your server to create a PaymentIntent for `amount` + `packageId`
// 2. Use stripe.confirmCardPayment(clientSecret, { payment_method: { card: elements.getElement(CardElement) } })
// 3. Return success/failure based on the PaymentIntent status
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function processStripePayment({ packageId, amount, }: {
        packageId: string
        amount: number
}): Promise<{ success: boolean; error?: string }> {
        return new Promise((resolve) => {
                setTimeout(() => {
                        resolve({ success: true })
                }, 1800)
        })
}

const formatPrice = (amount: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount)

// ─── Component ───────────────────────────────────────────────────────────────

export default function CompleteRegistration() {
        const router = useRouter()

        const [isDropdownOpen, setIsDropdownOpen] = useState(false)
        const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)

        const [cardNumber, setCardNumber] = useState("")
        const [expiry, setExpiry] = useState("")
        const [cvc, setCvc] = useState("")

        const [isProcessing, setIsProcessing] = useState(false)
        const [error, setError] = useState<string | null>(null)
        const [isSuccess, setIsSuccess] = useState(false)

        const handlePay = async () => {
                if (!selectedPackage) {
                        setError("Please select a package to continue.")
                        return
                }
                setError(null)
                setIsProcessing(true)

                const result = await processStripePayment({
                        packageId: selectedPackage.id,
                        amount: selectedPackage.price,
                })

                if (result.success) {
                        setIsSuccess(true)
                        setTimeout(() => {
                                router.push("/us/host")
                        }, 1200)
                } else {
                        setError(result.error || "Something went wrong processing your payment. Please try again.")
                        setIsProcessing(false)
                }
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
                <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 py-10">
                        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

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
                                                                                        {selectedPackage.name} — {formatPrice(selectedPackage.price)}/{selectedPackage.billingCycle}
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
                                                                        {packages.map((pkg) => (
                                                                                <button
                                                                                        key={pkg.id}
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                                setSelectedPackage(pkg)
                                                                                                setIsDropdownOpen(false)
                                                                                                setError(null)
                                                                                        }}
                                                                                        className={[
                                                                                                "w-full flex flex-col gap-1 px-4 py-3 text-left transition-colors duration-150 border-b border-gray-50 last:border-b-0",
                                                                                                selectedPackage?.id === pkg.id ? "bg-blue-50" : "hover:bg-gray-50",
                                                                                        ].join(" ")}
                                                                                >
                                                                                        <span className="flex items-center justify-between">
                                                                                                <span className="text-sm font-medium text-gray-900">{pkg.name}</span>
                                                                                                <span className="text-sm font-semibold text-blue-700">
                                                                                                        {formatPrice(pkg.price)}/{pkg.billingCycle}
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

                                        {/* Payment fields — placeholder for Stripe Elements */}
                                        <div className="flex flex-col gap-3 pt-1">
                                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                        <CreditCard className="size-4 text-gray-400" />
                                                        Card details
                                                </span>

                                                <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        placeholder="Card number"
                                                        value={cardNumber}
                                                        onChange={(e) => setCardNumber(e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                                />

                                                <div className="flex gap-3">
                                                        <input
                                                                type="text"
                                                                placeholder="MM / YY"
                                                                value={expiry}
                                                                onChange={(e) => setExpiry(e.target.value)}
                                                                className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                                        />
                                                        <input
                                                                type="text"
                                                                inputMode="numeric"
                                                                placeholder="CVC"
                                                                value={cvc}
                                                                onChange={(e) => setCvc(e.target.value)}
                                                                className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                                        />
                                                </div>

                                                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                                                        <ShieldCheck className="size-3.5" />
                                                        Payments are securely processed by Stripe
                                                </span>
                                        </div>

                                        {error && (
                                                <span className="block text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                                        {error}
                                                </span>
                                        )}

                                        <button
                                                type="button"
                                                onClick={handlePay}
                                                disabled={isProcessing || !selectedPackage}
                                                className={[
                                                        "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors duration-200",
                                                        !selectedPackage || isProcessing
                                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                                : "bg-blue-700 text-white hover:bg-blue-800",
                                                ].join(" ")}
                                        >
                                                {isProcessing ? (
                                                        <>
                                                                <Loader2 className="size-4 animate-spin" />
                                                                Processing payment...
                                                        </>
                                                ) : selectedPackage ? (
                                                        <>Pay {formatPrice(selectedPackage.price)}</>
                                                ) : (
                                                        <>Select a package to continue</>
                                                )}
                                        </button>
                                </div>
                        </div>
                </div>
        )
}