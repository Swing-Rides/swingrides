import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePageLoading() {
        return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-4 md:px-8 py-10 md:py-12.5">
                        <div className="col-span-1 flex flex-col gap-4 md:gap-6">
                                {/* User card */}
                                <div className="p-2.5 md:p-6 flex flex-col gap-5 bg-white rounded-[10px] shadow-[0px_1px_3px_1px_rgba(0,0,0,0.30)] overflow-clip">
                                        <div className="flex flex-col gap-2.25 items-center">
                                                <Skeleton className="size-20 rounded-full bg-gray-300" />
                                                <Skeleton className="h-5 w-32 bg-gray-300" />
                                                <Skeleton className="h-4 w-40 bg-gray-300" />
                                                <Skeleton className="h-4 w-28 bg-gray-300" />
                                                <Skeleton className="h-3 w-16 bg-gray-300" />
                                        </div>
                                        <Skeleton className="h-px w-full bg-gray-300" />
                                        <div className="grid grid-cols-3 gap-4">
                                                {Array.from({ length: 3 }).map((_, i) => (
                                                        <div key={i} className="flex flex-col items-center gap-2">
                                                                <Skeleton className="h-6 w-8 bg-gray-300" />
                                                                <Skeleton className="h-3 w-16 bg-gray-300" />
                                                        </div>
                                                ))}
                                        </div>
                                        <Skeleton className="h-px w-full bg-gray-300" />
                                </div>

                                {/* Account detail card */}
                                <div className="p-2.5 md:p-6 flex flex-col gap-4 bg-white rounded-[10px] shadow-[0px_1px_3px_1px_rgba(0,0,0,0.30)] overflow-clip">
                                        <Skeleton className="h-5 w-32 bg-gray-300" />
                                        <Skeleton className="h-px w-full bg-gray-300" />
                                        <div className="flex flex-col gap-3">
                                                {Array.from({ length: 4 }).map((_, i) => (
                                                        <div key={i}>
                                                                <div className="flex justify-between items-center">
                                                                        <Skeleton className="h-3 w-20 bg-gray-300" />
                                                                        <Skeleton className="h-3 w-28 bg-gray-300" />
                                                                </div>
                                                                {i < 3 ? <Skeleton className="h-px w-full bg-gray-300 mt-3" /> : null}
                                                        </div>
                                                ))}
                                        </div>
                                </div>

                                {/* Warning card */}
                                <div className="bg-amber-100 p-2.5 md:p-3 rounded-md flex gap-2 items-start">
                                        <Skeleton className="size-4 rounded-full bg-gray-300 shrink-0" />
                                        <Skeleton className="h-8 w-full bg-gray-300" />
                                </div>
                        </div>

                        {/* Main content: rentals */}
                        <div className="col-span-1 md:col-span-2 flex flex-col gap-4 md:gap-6">
                                <div className="flex flex-col gap-2">
                                        <Skeleton className="h-7 w-40 bg-gray-300" />
                                        <Skeleton className="h-4 w-56 bg-gray-300" />
                                </div>

                                <div className="flex gap-3">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                                <Skeleton key={i} className="h-8 w-20 rounded-full bg-gray-300" />
                                        ))}
                                </div>

                                <div className="flex flex-col gap-4">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                                <div
                                                        key={i}
                                                        className="p-2.5 md:p-6 flex flex-col md:flex-row gap-6 bg-white rounded-[10px] shadow-[0px_1px_3px_1px_rgba(0,0,0,0.30)] overflow-clip"
                                                >
                                                        <Skeleton className="aspect-3/2 min-w-30 max-w-60 w-full rounded-[10px] bg-gray-300" />
                                                        <div className="grid gap-3 w-full">
                                                                <div className="flex justify-between items-center">
                                                                        <Skeleton className="h-5 w-40 bg-gray-300" />
                                                                        <Skeleton className="h-5 w-16 rounded-full bg-gray-300" />
                                                                </div>
                                                                <Skeleton className="h-3 w-56 bg-gray-300" />
                                                                <div className="flex flex-wrap gap-3">
                                                                        {Array.from({ length: 4 }).map((__, j) => (
                                                                                <Skeleton key={j} className="h-6 w-24 rounded-full bg-gray-300" />
                                                                        ))}
                                                                </div>
                                                                <Skeleton className="h-3 w-24 bg-gray-300" />
                                                                <div className="flex gap-2">
                                                                        <Skeleton className="h-9 w-24 bg-gray-300" />
                                                                        <Skeleton className="h-9 w-24 bg-gray-300" />
                                                                </div>
                                                        </div>
                                                </div>
                                        ))}
                                </div>
                        </div>
                </div>
        );
}