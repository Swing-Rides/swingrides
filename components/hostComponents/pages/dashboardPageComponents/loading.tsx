import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
        return (
                <div className="space-y-4">
                        {/* Overview cards */}
                        <div className="flex flex-wrap gap-4 mt-8">
                                {Array.from({ length: 4 }).map((_, i) => (
                                        <div
                                                key={i}
                                                className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-3"
                                        >
                                                <Skeleton className="size-12 rounded-[10px] bg-gray-300" />
                                                <Skeleton className="h-3 w-24 bg-gray-300" />
                                                <Skeleton className="h-8 w-16 bg-gray-300" />
                                                <Skeleton className="h-3 w-32 bg-gray-300" />
                                        </div>
                                ))}
                        </div>

                        {/* Revenue chart + donut chart */}
                        <div className="grid md:grid-cols-3 gap-4">
                                <div className="md:col-span-2 p-4 md:p-6 bg-white rounded-md border border-gray-200 space-y-4">
                                        <div className="flex items-center justify-between">
                                                <Skeleton className="h-5 w-32 bg-gray-300" />
                                                <Skeleton className="h-8 w-40 bg-gray-300" />
                                        </div>
                                        <Skeleton className="h-64 w-full bg-gray-300" />
                                </div>
                                <div className="col-span-1 p-4 md:p-6 bg-white rounded-md border border-gray-200 space-y-4">
                                        <Skeleton className="h-5 w-28 bg-gray-300" />
                                        <Skeleton className="h-48 w-48 rounded-full mx-auto bg-gray-300" />
                                        <div className="space-y-2">
                                                {Array.from({ length: 4 }).map((_, i) => (
                                                        <Skeleton key={i} className="h-3 w-full bg-gray-300" />
                                                ))}
                                        </div>
                                </div>
                        </div>

                        {/* Recent bookings + fleet status */}
                        <div className="grid md:grid-cols-3 gap-4 items-start">
                                <div className="md:col-span-2 p-4 md:p-6 space-y-4 bg-white rounded-md border border-gray-200 overflow-hidden">
                                        <Skeleton className="h-5 w-40 bg-gray-300" />
                                        {Array.from({ length: 5 }).map((_, i) => (
                                                <div key={i} className="flex items-center gap-4">
                                                        <Skeleton className="h-10 w-10 rounded-full bg-gray-300" />
                                                        <Skeleton className="h-3 flex-1 bg-gray-300" />
                                                        <Skeleton className="h-3 w-16 bg-gray-300" />
                                                        <Skeleton className="h-3 w-16 bg-gray-300" />
                                                </div>
                                        ))}
                                </div>
                                <div className="md:col-span-1 p-4 md:p-6 bg-white rounded-md border border-gray-200">
                                        <div className="flex flex-col gap-4">
                                                <Skeleton className="h-5 w-28 bg-gray-300" />
                                                <div className="flex flex-col gap-3">
                                                        {Array.from({ length: 4 }).map((_, i) => (
                                                                <div key={i} className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                                <Skeleton className="size-8 rounded-[10px] bg-gray-300" />
                                                                                <Skeleton className="h-3 w-20 bg-gray-300" />
                                                                        </div>
                                                                        <Skeleton className="h-3 w-8 bg-gray-300" />
                                                                </div>
                                                        ))}
                                                </div>
                                                <Skeleton className="h-px w-full bg-gray-300" />
                                                <div className="flex items-center justify-between">
                                                        <Skeleton className="h-3 w-20 bg-gray-300" />
                                                        <Skeleton className="h-3 w-16 bg-gray-300" />
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        );
}