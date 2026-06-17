import { Skeleton } from "@/components/ui/skeleton"

export const AdminPageSkeleton = () => {
        return (
                <div className="p-3 md:p-8">
                        <div className="flex flex-col gap-2 mb-8">
                                <Skeleton className="h-7 w-52 rounded-md bg-gray-300" />
                                <Skeleton className="h-4 w-80 rounded-md bg-gray-300" />
                        </div>

                        <div className="flex flex-wrap gap-4 mt-8">
                                {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="basis-62.5 shrink-0 grow p-6 bg-white rounded-md border border-gray-200 flex flex-col gap-3">
                                                <Skeleton className="size-5 rounded-md bg-gray-300" />
                                                <Skeleton className="h-3 w-24 rounded-md bg-gray-300" />
                                                <Skeleton className="h-8 w-32 rounded-md bg-gray-300" />
                                                <Skeleton className="h-3 w-20 rounded-md bg-gray-300" />
                                        </div>
                                ))}
                        </div>

                        <div className="flex flex-wrap gap-4 my-4">

                                <div className="basis-183 grow p-3 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-6">
                                        <div className="flex justify-between items-center">
                                                <div className="flex flex-col gap-1.5">
                                                        <Skeleton className="h-5 w-32 rounded-md bg-gray-300" />
                                                        <Skeleton className="h-3.5 w-48 rounded-md bg-gray-300" />
                                                </div>
                                                <div className="flex gap-2">
                                                        {Array.from({ length: 3 }).map((_, i) => (
                                                                <Skeleton key={i} className="h-7 w-16 rounded-lg bg-gray-300" />
                                                        ))}
                                                </div>
                                        </div>
                                        <Skeleton className="w-full h-87.5 rounded-lg" />
                                </div>

                                <div className="basis-95 grow md:grow-0 p-3 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-6">
                                        <div className="flex flex-col gap-1.5">
                                                <Skeleton className="h-5 w-40 rounded-md bg-gray-300" />
                                                <Skeleton className="h-3.5 w-28 rounded-md bg-gray-300" />
                                        </div>
                                        <div className="flex flex-col items-center gap-4">
                                                <Skeleton className="size-44 rounded-full bg-gray-300" />
                                                <div className="flex flex-col gap-2 w-full">
                                                        {Array.from({ length: 3 }).map((_, i) => (
                                                                <div key={i} className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                                <Skeleton className="size-2.5 rounded-full bg-gray-300" />
                                                                                <Skeleton className="h-3 w-16 rounded-md bg-gray-300" />
                                                                        </div>
                                                                        <Skeleton className="h-3 w-8 rounded-md bg-gray-300" />
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>
                                </div>
                        </div>

                        <div className="p-3 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-6">
                                <div className="flex flex-col gap-1.5">
                                        <Skeleton className="h-5 w-36 rounded-md bg-gray-300" />
                                        <Skeleton className="h-3.5 w-44 rounded-md bg-gray-300" />
                                </div>
                                <div className="flex flex-col gap-3">
                                        {/* Table header */}
                                        <div className="flex gap-4 px-2 pb-2 border-b border-gray-200">
                                                {[40, 28, 24, 20, 16].map((w, i) => (
                                                        <Skeleton key={i} className={`h-3 w-${w} rounded-md bg-gray-300`} />
                                                ))}
                                        </div>
                                        {/* Table rows */}
                                        {Array.from({ length: 5 }).map((_, i) => (
                                                <div key={i} className="flex items-center gap-4 px-2 py-1">
                                                        <div className="flex items-center gap-2 flex-1">
                                                                <Skeleton className="size-8 rounded-full shrink-0 bg-gray-300" />
                                                                <div className="flex flex-col gap-1">
                                                                        <Skeleton className="h-3 w-24 rounded-md bg-gray-300" />
                                                                        <Skeleton className="h-2.5 w-32 rounded-md bg-gray-300" />
                                                                </div>
                                                        </div>
                                                        <Skeleton className="h-3 w-20 rounded-md bg-gray-300" />
                                                        <Skeleton className="h-5 w-16 rounded-full bg-gray-300" />
                                                        <Skeleton className="h-3 w-16 rounded-md bg-gray-300" />
                                                </div>
                                        ))}
                                </div>
                        </div>
                </div>
        )
}