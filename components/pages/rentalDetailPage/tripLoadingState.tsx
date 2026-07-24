import { Skeleton } from "@/components/ui/skeleton";

export default function RentalDetailSkeleton() {
        return (
                <>
                        {/* Breadcrumb */}
                        <div className="bg-white py-2.5 px-2.5 md:px-8">
                                <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-20 bg-gray-300" />
                                        <Skeleton className="h-4 w-4 bg-gray-300" />
                                        <Skeleton className="h-4 w-24 bg-gray-300" />
                                </div>
                        </div>

                        <section className="py-5 px-2.5 md:py-10 md:px-20">
                                {/* Page title */}
                                <div className="flex flex-col gap-2 mb-12.5">
                                        <div className="flex items-center gap-4">
                                                <Skeleton className="h-7 w-40 bg-gray-300" />
                                                <Skeleton className="h-6 w-20 rounded-full bg-gray-300" />
                                        </div>
                                        <Skeleton className="h-4 w-56 bg-gray-300" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                        {/* Left content */}
                                        <div className="col-span-1 md:col-span-7 w-full">
                                                <div className="flex flex-col gap-5">
                                                        <TripSummarySkeleton />
                                                        <VehicleCardSkeleton />
                                                        <DocumentVerificationSkeleton />
                                                        <VehicleConditionSkeleton />
                                                </div>
                                        </div>

                                        {/* Right content */}
                                        <div className="col-span-1 md:col-span-5 w-full space-y-3 md:space-y-6">
                                                <ManageBookingSkeleton />
                                                <ReportDamageSkeleton />
                                        </div>
                                </div>
                        </section>
                </>
        );
}

function TripSummarySkeleton() {
        return (
                <div className="flex flex-col gap-4.25 p-4 md:p-6 rounded-[10px] border border-gray-200">
                        <Skeleton className="h-5 w-32 bg-gray-300" />

                        <div className="grid grid-cols-2 gap-3 pb-6.25 border-b border-b-[#E5E7EB]">
                                {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="flex flex-col gap-2 p-4 bg-[#F8F9FB]">
                                                <Skeleton className="h-3 w-20 bg-gray-300" />
                                                <Skeleton className="h-5 w-28 bg-gray-300" />
                                        </div>
                                ))}
                        </div>

                        <div className="flex flex-col gap-3 pb-6.25 border-b border-b-[#E5E7EB]">
                                {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="flex justify-between gap-4">
                                                <Skeleton className="h-4 w-32 bg-gray-300" />
                                                <Skeleton className="h-4 w-20 bg-gray-300" />
                                        </div>
                                ))}
                        </div>

                        <div className="flex justify-between gap-4">
                                <Skeleton className="h-5 w-20 bg-gray-300" />
                                <Skeleton className="h-5 w-16 bg-gray-300" />
                        </div>

                        <div className="flex gap-2 items-center flex-wrap">
                                {Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} className="h-5 w-16 rounded-full bg-gray-300" />
                                ))}
                        </div>
                </div>
        );
}

function VehicleCardSkeleton() {
        return (
                <div className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200">
                        <div className="flex flex-col gap-4">
                                <Skeleton className="h-5 w-28 bg-gray-300" />
                                <div className="flex gap-4 items-start">
                                        <Skeleton className="aspect-160/109 max-w-40 w-full rounded-[10px] bg-gray-300" />
                                        <div className="flex flex-col gap-2 w-full">
                                                <Skeleton className="h-5 w-32 bg-gray-300" />
                                                <Skeleton className="h-4 w-40 bg-gray-300" />
                                                <Skeleton className="h-5 w-20 rounded-full bg-gray-300" />
                                                <div className="flex gap-2 items-center">
                                                        <Skeleton className="h-4 w-10 bg-gray-300" />
                                                        <Skeleton className="h-4 w-16 bg-gray-300" />
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        );
}

function DocumentVerificationSkeleton() {
        return (
                <div className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200">
                        <Skeleton className="h-5 w-44 bg-gray-300" />
                        <div className="divide-y divide-[#E5E7EB]">
                                {Array.from({ length: 2 }).map((_, i) => (
                                        <div key={i} className="flex justify-between items-center py-4.25">
                                                <div className="flex items-center gap-2.5">
                                                        <Skeleton className="size-5 rounded-full bg-gray-300" />
                                                        <div className="flex flex-col gap-1.5">
                                                                <Skeleton className="h-4 w-28 bg-gray-300" />
                                                                <Skeleton className="h-3 w-32 bg-gray-300" />
                                                        </div>
                                                </div>
                                                <Skeleton className="h-4 w-20 bg-gray-300" />
                                        </div>
                                ))}
                        </div>
                </div>
        );
}

function VehicleConditionSkeleton() {
        return (
                <div className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200">
                        <div className="flex flex-col gap-3 pb-3 border-b border-[#E5E7EB]">
                                <Skeleton className="h-5 w-48 bg-gray-300" />
                                <Skeleton className="h-3 w-56 bg-gray-300" />
                        </div>

                        <div className="flex flex-wrap gap-3 mt-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton
                                                key={i}
                                                className="aspect-164/96 min-w-25 basis-41 grow shrink rounded-[10px] bg-gray-300"
                                        />
                                ))}
                        </div>

                        <div className="divide-y">
                                {Array.from({ length: 2 }).map((_, i) => (
                                        <div key={i} className="flex items-center justify-between gap-4 py-3">
                                                <Skeleton className="h-3 w-24 bg-gray-300" />
                                                <Skeleton className="h-4 w-16 bg-gray-300" />
                                        </div>
                                ))}
                        </div>
                </div>
        );
}

function ManageBookingSkeleton() {
        return (
                <div className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200">
                        <div className="flex flex-col gap-3 pb-3 mb-3 border-b border-gray-300">
                                <Skeleton className="h-5 w-36 bg-gray-300" />
                                <Skeleton className="h-3 w-full bg-gray-300" />
                                <Skeleton className="h-3 w-3/4 bg-gray-300" />
                        </div>
                        <div className="flex flex-col gap-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                        <Skeleton key={i} className="h-10 w-full rounded-xs bg-gray-300" />
                                ))}
                        </div>
                </div>
        );
}

function ReportDamageSkeleton() {
        return (
                <div className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200">
                        <div className="flex flex-col gap-3 pb-3 border-b border-gray-300">
                                <Skeleton className="h-5 w-44 bg-gray-300" />
                                <Skeleton className="h-3 w-full bg-gray-300" />
                        </div>
                        <Skeleton className="h-10 w-full mt-3 rounded-xs bg-gray-300" />
                </div>
        );
}