
export default function RegistrationPaymentSkeleton() {
        return (
                <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">

                        {/* Header */}
                        <div className="px-6 pt-8 pb-6 border-b border-gray-100">
                                <div className="size-12 rounded-full bg-gray-300 mb-4" />
                                <div className="h-6 w-2/3 rounded-md bg-gray-300" />
                                <div className="flex flex-col gap-1.5 mt-3">
                                        <div className="h-3.5 w-full rounded-md bg-gray-300" />
                                        <div className="h-3.5 w-4/5 rounded-md bg-gray-300" />
                                </div>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-6 flex flex-col gap-5">

                                {/* Billing cycle toggle */}
                                <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 w-fit">
                                        <div className="h-8 w-20 rounded-lg bg-gray-300" />
                                        <div className="h-8 w-24 rounded-lg bg-gray-200" />
                                </div>

                                {/* Package dropdown */}
                                <div className="flex flex-col gap-1.5">
                                        <div className="h-3.5 w-28 rounded-md bg-gray-300" />
                                        <div className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-gray-200">
                                                <div className="flex flex-col gap-1.5 w-2/3">
                                                        <div className="h-4 w-full rounded-md bg-gray-300" />
                                                        <div className="h-3 w-3/4 rounded-md bg-gray-200" />
                                                </div>
                                                <div className="size-4 rounded-sm bg-gray-300 shrink-0" />
                                        </div>
                                </div>

                                {/* Selected package features */}
                                <div className="flex flex-col gap-2 px-4 py-3 rounded-xl bg-gray-50">
                                        <div className="h-3 w-24 rounded-md bg-gray-300" />
                                        <div className="flex flex-col gap-2 mt-1">
                                                <div className="flex items-center gap-2">
                                                        <div className="size-3.5 rounded-full bg-gray-300 shrink-0" />
                                                        <div className="h-3.5 w-4/5 rounded-md bg-gray-300" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                        <div className="size-3.5 rounded-full bg-gray-300 shrink-0" />
                                                        <div className="h-3.5 w-3/5 rounded-md bg-gray-300" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                        <div className="size-3.5 rounded-full bg-gray-300 shrink-0" />
                                                        <div className="h-3.5 w-2/3 rounded-md bg-gray-300" />
                                                </div>
                                        </div>
                                </div>

                                {/* Billing address */}
                                <div className="flex flex-col gap-3 pt-1">
                                        <div className="h-3.5 w-28 rounded-md bg-gray-300" />
                                        <div className="w-full h-11 rounded-xl bg-gray-300" />
                                        <div className="grid grid-cols-3 gap-3">
                                                <div className="h-11 rounded-xl bg-gray-300" />
                                                <div className="h-11 rounded-xl bg-gray-300" />
                                                <div className="h-11 rounded-xl bg-gray-300" />
                                        </div>
                                </div>

                                {/* Coupon code */}
                                <div className="flex flex-col gap-2">
                                        <div className="h-3.5 w-24 rounded-md bg-gray-300" />
                                        <div className="flex gap-2">
                                                <div className="flex-1 h-11 rounded-xl bg-gray-300" />
                                                <div className="h-11 w-20 rounded-xl bg-gray-300 shrink-0" />
                                        </div>
                                </div>

                                {/* Order summary */}
                                <div className="flex flex-col gap-2 px-4 py-3 rounded-xl bg-gray-50">
                                        <div className="h-3 w-28 rounded-md bg-gray-300" />
                                        <div className="flex items-center justify-between mt-1">
                                                <div className="h-3.5 w-2/5 rounded-md bg-gray-300" />
                                                <div className="h-3.5 w-12 rounded-md bg-gray-300" />
                                        </div>
                                        <div className="h-px bg-gray-200 my-1" />
                                        <div className="flex items-center justify-between">
                                                <div className="h-4 w-24 rounded-md bg-gray-300" />
                                                <div className="h-4 w-16 rounded-md bg-gray-300" />
                                        </div>
                                </div>

                                {/* Payment — card details */}
                                <div className="flex flex-col gap-3 pt-1">
                                        <div className="h-3.5 w-24 rounded-md bg-gray-300" />
                                        <div className="w-full h-11 rounded-xl bg-gray-300" />
                                        <div className="h-3 w-2/3 rounded-md bg-gray-200" />
                                </div>
                        </div>
                </div>
        )
}