import { Skeleton } from "@/components/ui/skeleton";

export default function BookingsLoading() {
        return (
                <div className="mt-4 md:mt-8 space-y-5">
                        {/* Overview cards */}
                        <div className="flex flex-wrap items-center gap-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                                key={i}
                                                className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-3"
                                        >
                                                <Skeleton className="h-3 w-24 bg-gray-300" />
                                                <Skeleton className="h-9 w-16 bg-gray-300" />
                                                <Skeleton className="h-3 w-20 bg-gray-300" />
                                        </div>
                                ))}
                        </div>

                        {/* Tabs */}
                        <div className="space-y-4 md:space-y-6">
                                <div className="flex gap-8 md:gap-20 border-b-2 border-gray-200 pb-3">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                                <Skeleton key={i} className="h-4 w-28 bg-gray-300" />
                                        ))}
                                </div>

                                {/* Table */}
                                <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                                        <div className="hidden md:flex items-center gap-4 px-4 md:px-6 py-3 border-b border-gray-200">
                                                {Array.from({ length: 6 }).map((_, i) => (
                                                        <Skeleton key={i} className="h-3 flex-1 bg-gray-300" />
                                                ))}
                                        </div>
                                        <div className="divide-y divide-gray-200">
                                                {Array.from({ length: 6 }).map((_, i) => (
                                                        <div key={i} className="flex items-center gap-4 px-4 md:px-6 py-4">
                                                                <Skeleton className="h-10 w-10 rounded-full bg-gray-300 shrink-0" />
                                                                <Skeleton className="h-3 flex-1 bg-gray-300" />
                                                                <Skeleton className="h-3 flex-1 bg-gray-300 hidden md:block" />
                                                                <Skeleton className="h-3 flex-1 bg-gray-300 hidden md:block" />
                                                                <Skeleton className="h-6 w-20 rounded-full bg-gray-300" />
                                                                <Skeleton className="h-8 w-8 rounded-md bg-gray-300 shrink-0" />
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        </div>
                </div>
        );
}