import { Skeleton } from "@/components/ui/skeleton";

const bar = "bg-gray-300";

export default function CheckoutSkeleton() {
        return (
                <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* ── Left: vehicle summary + form ─────────────────────────── */}
                        <div className="lg:col-span-3 flex flex-col gap-6">
                                {/* Vehicle card */}
                                <div className="flex gap-4 p-4 rounded-[10px] border border-gray-200">
                                        <Skeleton className={`${bar} h-24 w-32 rounded-md shrink-0`} />
                                        <div className="flex flex-col gap-2 flex-1 justify-center">
                                                <Skeleton className={`${bar} h-4 w-2/3`} />
                                                <Skeleton className={`${bar} h-3 w-1/3`} />
                                                <Skeleton className={`${bar} h-3 w-1/2`} />
                                        </div>
                                </div>

                                {/* Contact / address fields */}
                                <div className="flex flex-col gap-4 p-4 md:p-6 rounded-[10px] border border-gray-200">
                                        <Skeleton className={`${bar} h-4 w-40`} />
                                        <div className="grid grid-cols-2 gap-3">
                                                <Skeleton className={`${bar} h-10 w-full rounded-xs`} />
                                                <Skeleton className={`${bar} h-10 w-full rounded-xs`} />
                                        </div>
                                        <Skeleton className={`${bar} h-10 w-full rounded-xs`} />
                                        <div className="grid grid-cols-6 gap-3">
                                                <Skeleton className={`${bar} h-10 col-span-3 rounded-xs`} />
                                                <Skeleton className={`${bar} h-10 col-span-1 rounded-xs`} />
                                                <Skeleton className={`${bar} h-10 col-span-2 rounded-xs`} />
                                        </div>
                                </div>

                                {/* Payment element placeholder */}
                                <div className="flex flex-col gap-3 p-4 md:p-6 rounded-[10px] border border-gray-200">
                                        <Skeleton className={`${bar} h-4 w-32`} />
                                        <Skeleton className={`${bar} h-11 w-full rounded-xs`} />
                                        <Skeleton className={`${bar} h-11 w-full rounded-xs`} />
                                        <Skeleton className={`${bar} h-11 w-2/3 rounded-xs`} />
                                </div>

                                <Skeleton className={`${bar} h-12 w-full rounded-xs`} />
                        </div>

                        {/* ── Right: price summary ─────────────────────────────────── */}
                        <div className="lg:col-span-2">
                                <div className="flex flex-col gap-4 p-4 md:p-6 rounded-[10px] border border-gray-200">
                                        <Skeleton className={`${bar} h-4 w-24`} />
                                        {Array.from({ length: 4 }).map((_, i) => (
                                                <div key={i} className="flex justify-between gap-4">
                                                        <Skeleton className={`${bar} h-3 w-1/3`} />
                                                        <Skeleton className={`${bar} h-3 w-16`} />
                                                </div>
                                        ))}
                                        <div className="flex justify-between gap-4 pt-3 border-t border-gray-200">
                                                <Skeleton className={`${bar} h-5 w-24`} />
                                                <Skeleton className={`${bar} h-5 w-20`} />
                                        </div>
                                </div>
                        </div>
                </div>
        );
}