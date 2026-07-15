import { Skeleton } from "@/components/ui/skeleton";

export default function ReportLoading() {
        return (
                <div className="mt-4 md:mt-8 space-y-6">
                        {/* Overview cards */}
                        <div className="flex flex-wrap items-center gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                        <div
                                                key={i}
                                                className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col gap-3"
                                        >
                                                <div className="flex justify-between items-center w-full">
                                                        <Skeleton className="size-12 rounded-[10px] bg-gray-300" />
                                                        <Skeleton className="h-5 w-14 rounded-sm bg-gray-300" />
                                                </div>
                                                <Skeleton className="h-3 w-24 bg-gray-300" />
                                                <Skeleton className="h-8 w-16 bg-gray-300" />
                                        </div>
                                ))}
                        </div>

                        {/* Revenue/bookings chart + donut chart */}
                        <div className="grid md:grid-cols-3 gap-4">
                                <div className="md:col-span-2 p-4 md:p-6 bg-white rounded-md border border-gray-200 space-y-4">
                                        <Skeleton className="h-5 w-40 bg-gray-300" />
                                        <Skeleton className="h-64 w-full bg-gray-300" />
                                </div>
                                <div className="col-span-1 p-4 md:p-6 bg-white rounded-md border border-gray-200 space-y-4">
                                        <Skeleton className="h-5 w-28 bg-gray-300" />
                                        <Skeleton className="h-48 w-48 rounded-full mx-auto bg-gray-300" />
                                </div>
                        </div>

                        {/* Expenses category chart */}
                        <div className="p-4 md:p-6 bg-white rounded-md border border-gray-200 space-y-4">
                                <Skeleton className="h-5 w-44 bg-gray-300" />
                                <Skeleton className="h-56 w-full bg-gray-300" />
                        </div>

                        {/* Vehicle performance table */}
                        <div className="p-3 md:p-6 bg-white rounded-[10px] space-y-4">
                                <Skeleton className="h-5 w-40 bg-gray-300" />
                                <div className="flex flex-wrap items-center gap-3">
                                        <Skeleton className="h-9 w-64 bg-gray-300" />
                                        <Skeleton className="h-9 w-32 bg-gray-300" />
                                </div>
                                <div className="hidden md:flex items-center gap-4 py-3 border-b border-gray-200">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                                <Skeleton key={i} className="h-3 flex-1 bg-gray-300" />
                                        ))}
                                </div>
                                <div className="divide-y divide-gray-200">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                                <div key={i} className="flex items-center gap-4 py-4">
                                                        {Array.from({ length: 6 }).map((__, j) => (
                                                                <Skeleton key={j} className="h-3 flex-1 bg-gray-300" />
                                                        ))}
                                                </div>
                                        ))}
                                </div>
                        </div>
                </div>
        );
}