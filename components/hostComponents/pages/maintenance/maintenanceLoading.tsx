import { Skeleton } from "@/components/ui/skeleton";

export default function MaintenanceLoading() {
        return (
                <div className="mt-4 md:mt-8">
                        {/* Overview cards */}
                        <div className="flex flex-wrap items-center gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                        <div
                                                key={i}
                                                className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-3"
                                        >
                                                <Skeleton className="size-12 rounded-[10px] bg-gray-300" />
                                                <Skeleton className="h-3 w-24 bg-gray-300" />
                                                <Skeleton className="h-9 w-16 bg-gray-300" />
                                        </div>
                                ))}
                        </div>

                        {/* Vehicle health overview */}
                        <div className="mt-4 md:mt-10 space-y-4">
                                <Skeleton className="h-5 w-56 bg-gray-300" />
                                <div className="flex flex-wrap items-center gap-4">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                                <div
                                                        key={i}
                                                        className="basis-95 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col gap-3.5"
                                                >
                                                        <div className="flex gap-3.5 items-center">
                                                                <Skeleton className="size-12 rounded-[10px] bg-gray-300" />
                                                                <div className="flex flex-col gap-2">
                                                                        <Skeleton className="h-3 w-16 bg-gray-300" />
                                                                        <Skeleton className="h-9 w-12 bg-gray-300" />
                                                                </div>
                                                        </div>
                                                        <Skeleton className="h-3 w-40 bg-gray-300" />
                                                </div>
                                        ))}
                                </div>
                        </div>

                        {/* Service alerts */}
                        <div className="my-4 md:my-6 space-y-6">
                                <Skeleton className="h-5 w-32 bg-gray-300" />
                                {Array.from({ length: 2 }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-[10px]">
                                                <Skeleton className="size-9 rounded-full bg-gray-300 shrink-0" />
                                                <div className="w-full flex flex-wrap gap-4">
                                                        <div className="space-y-1">
                                                                <Skeleton className="h-3 w-24 bg-gray-300" />
                                                                <Skeleton className="h-3 w-16 bg-gray-300" />
                                                        </div>
                                                        <Skeleton className="h-3 w-20 bg-gray-300" />
                                                        <Skeleton className="h-3 w-20 bg-gray-300" />
                                                        <Skeleton className="h-3 w-20 bg-gray-300" />
                                                        <Skeleton className="h-6 w-24 rounded-full bg-gray-300" />
                                                </div>
                                        </div>
                                ))}
                        </div>

                        {/* Service history table */}
                        <div className="space-y-5">
                                <Skeleton className="h-5 w-36 bg-gray-300" />
                                <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                                        <div className="p-4 md:p-6 flex flex-wrap items-center gap-3 border-b border-gray-200">
                                                <Skeleton className="h-9 w-64 bg-gray-300" />
                                                <Skeleton className="h-9 w-32 bg-gray-300" />
                                                <Skeleton className="h-9 w-32 bg-gray-300" />
                                        </div>
                                        <div className="hidden md:flex items-center gap-4 px-4 md:px-6 py-3 border-b border-gray-200">
                                                {Array.from({ length: 7 }).map((_, i) => (
                                                        <Skeleton key={i} className="h-3 flex-1 bg-gray-300" />
                                                ))}
                                        </div>
                                        <div className="divide-y divide-gray-200">
                                                {Array.from({ length: 6 }).map((_, i) => (
                                                        <div key={i} className="flex items-center gap-4 px-4 md:px-6 py-4">
                                                                {Array.from({ length: 7 }).map((__, j) => (
                                                                        <Skeleton key={j} className="h-3 flex-1 bg-gray-300" />
                                                                ))}
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        </div>
                </div>
        );
}