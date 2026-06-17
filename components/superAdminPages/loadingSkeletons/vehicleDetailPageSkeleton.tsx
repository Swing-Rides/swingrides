import { Skeleton } from "@/components/ui/skeleton"

export const VehicleDetailPageSkeleton = () => {
        return (
                <div className="p-3 md:p-8">

                        {/* Breadcrumb */}
                        <div className="flex gap-2 items-center mb-3 md:mb-8">
                                <Skeleton className="h-3.5 w-24 rounded bg-gray-300" />
                                <Skeleton className="size-4 rounded bg-gray-300" />
                                <Skeleton className="h-3.5 w-32 rounded bg-gray-300" />
                                <Skeleton className="size-4 rounded bg-gray-300" />
                                <Skeleton className="h-3.5 w-28 rounded bg-gray-300" />
                        </div>

                        {/* Page intro */}
                        <div className="flex flex-col gap-2 mb-6">
                                <div className="flex items-center gap-2">
                                        <Skeleton className="h-7 w-48 rounded bg-gray-300" />
                                        <Skeleton className="h-5 w-16 rounded-full bg-gray-300" />
                                </div>
                                <Skeleton className="h-3.5 w-40 rounded bg-gray-300" />
                        </div>

                        {/* Gallery */}
                        <div className="p-3 md:p-6 my-4 bg-white rounded-lg border border-gray-200">
                                <Skeleton className="w-full aspect-108/40 rounded-lg bg-gray-300" />
                                <div className="flex gap-5 mt-5">
                                        <Skeleton className="w-full aspect-96/76 rounded-lg bg-gray-300" />
                                        <Skeleton className="w-full aspect-96/76 rounded-lg bg-gray-300" />
                                        <Skeleton className="w-full aspect-96/76 rounded-lg bg-gray-300" />
                                        <Skeleton className="w-full aspect-96/76 rounded-lg bg-gray-300" />
                                        <Skeleton className="w-full aspect-96/76 rounded-lg bg-gray-300" />
                                </div>
                        </div>

                        {/* Base detail cards */}
                        <div className="flex gap-4 items-center flex-wrap">
                                {["Daily Rate", "Weekly Rate", "Monthly Rate", "Mileage"].map((_, i) => (
                                        <div key={i} className="basis-50 grow shrink flex-1 p-3 md:p-5 bg-white rounded-lg border border-gray-200 flex flex-col gap-2">
                                                <Skeleton className="h-3 w-20 rounded bg-gray-300" />
                                                <Skeleton className="h-7 w-24 rounded bg-gray-300" />
                                        </div>
                                ))}
                        </div>

                        <div className="grid lg:grid-cols-3 gap-4">

                                {/* Left col — Vehicle Info + Pricing */}
                                <div className="lg:col-span-2">

                                        {/* Vehicle Information */}
                                        <div className="p-3 md:p-6 my-4 bg-white rounded-lg border border-gray-200">
                                                <Skeleton className="h-5 w-44 rounded bg-gray-300 mb-5" />
                                                <div className="grid md:grid-cols-2 gap-4">
                                                        {Array.from({ length: 11 }).map((_, i) => (
                                                                <div key={i} className="flex flex-col gap-1.5">
                                                                        <Skeleton className="h-3 w-20 rounded bg-gray-300" />
                                                                        <Skeleton className="h-4 w-32 rounded bg-gray-300" />
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>

                                        {/* Pricing */}
                                        <div className="p-3 md:p-6 my-4 bg-white rounded-lg border border-gray-200">
                                                <Skeleton className="h-5 w-20 rounded bg-gray-300 mb-5" />
                                                <div className="grid gap-4">
                                                        {Array.from({ length: 3 }).map((_, i) => (
                                                                <div key={i} className="flex justify-between items-center">
                                                                        <Skeleton className="h-4 w-20 rounded bg-gray-300" />
                                                                        <Skeleton className="h-5 w-24 rounded bg-gray-300" />
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>
                                </div>

                                {/* Right col — Performance + Maintenance + Host */}
                                <div className="lg:col-span-1">

                                        {/* Performance */}
                                        <div className="p-3 md:p-6 my-4 bg-white rounded-lg border border-gray-200">
                                                <Skeleton className="h-5 w-28 rounded bg-gray-300 mb-5" />
                                                <div className="grid gap-4">
                                                        {Array.from({ length: 4 }).map((_, i) => (
                                                                <div key={i} className="flex flex-col gap-1.5">
                                                                        <Skeleton className="h-3 w-24 rounded bg-gray-300" />
                                                                        <Skeleton className="h-7 w-28 rounded bg-gray-300" />
                                                                </div>
                                                        ))}
                                                        {/* Profit margin bar */}
                                                        <div className="flex flex-col gap-2">
                                                                <Skeleton className="h-3 w-24 rounded bg-gray-300" />
                                                                <Skeleton className="h-2 w-[60%] rounded-full bg-gray-300" />
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Maintenance */}
                                        <div className="p-3 md:p-6 my-4 bg-white rounded-lg border border-gray-200">
                                                <Skeleton className="h-5 w-28 rounded bg-gray-300 mb-5" />
                                                <div className="grid gap-4">
                                                        {Array.from({ length: 2 }).map((_, i) => (
                                                                <div key={i} className="flex flex-col gap-1.5">
                                                                        <Skeleton className="h-3 w-24 rounded bg-gray-300" />
                                                                        <div className="flex items-center gap-2">
                                                                                <Skeleton className="size-4 rounded bg-gray-300" />
                                                                                <Skeleton className="h-4 w-28 rounded bg-gray-300" />
                                                                        </div>
                                                                </div>
                                                        ))}
                                                        {/* Service status pill */}
                                                        <div className="flex flex-col gap-1.5">
                                                                <Skeleton className="h-3 w-24 rounded bg-gray-300" />
                                                                <Skeleton className="h-6 w-20 rounded-full bg-gray-300" />
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Host Organisation */}
                                        <div className="p-3 md:p-6 my-4 bg-white rounded-lg border border-gray-200">
                                                <Skeleton className="h-5 w-40 rounded bg-gray-300 mb-5" />
                                                <div className="grid gap-4">
                                                        <div className="flex flex-col gap-1.5">
                                                                <Skeleton className="h-3 w-36 rounded bg-gray-300" />
                                                                <Skeleton className="h-5 w-40 rounded bg-gray-300" />
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                                <Skeleton className="h-3 w-32 rounded bg-gray-300" />
                                                                <Skeleton className="h-6 w-20 rounded-full bg-gray-300" />
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                                <Skeleton className="h-3 w-20 rounded bg-gray-300" />
                                                                <Skeleton className="h-4 w-36 rounded bg-gray-300" />
                                                        </div>
                                                        <Skeleton className="h-4 w-40 rounded bg-gray-300" />
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        )
}