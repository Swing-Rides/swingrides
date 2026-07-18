import { Skeleton } from "@/components/ui/skeleton";

export default function CarPageLoading() {
        return (
                <>
                        {/* Notification bar */}
                        <div className="bg-[#EBF0FB] py-2.5 px-2.5 md:px-8">
                                <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                                        <Skeleton className="h-4 w-40 bg-gray-300" />
                                        <Skeleton className="h-8 w-40 bg-gray-300" />
                                </div>
                        </div>

                        <section className="py-5 px-2.5 md:py-10 md:px-20">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                        {/* Left content */}
                                        <div className="col-span-1 md:col-span-7 w-full">
                                                <div className="flex flex-col gap-5">
                                                        {/* Gallery */}
                                                        <Skeleton className="aspect-video w-full rounded-[10px] bg-gray-300" />

                                                        {/* Car detail card */}
                                                        <div className="flex flex-col gap-5 p-4 md:p-6 rounded-[10px] border border-gray-200 bg-white">
                                                                <div className="flex flex-col gap-2">
                                                                        <div className="flex gap-2 justify-between items-center">
                                                                                <Skeleton className="h-8 w-56 bg-gray-300" />
                                                                                <Skeleton className="h-5 w-20 rounded-full bg-gray-300" />
                                                                        </div>
                                                                        <div className="flex gap-2 items-center">
                                                                                <Skeleton className="h-4 w-24 bg-gray-300" />
                                                                                <Skeleton className="h-4 w-20 bg-gray-300" />
                                                                        </div>
                                                                </div>

                                                                <div className="flex flex-wrap gap-3">
                                                                        {Array.from({ length: 4 }).map((_, i) => (
                                                                                <Skeleton key={i} className="h-10 w-28 rounded-[10px] bg-gray-300" />
                                                                        ))}
                                                                </div>

                                                                <div className="space-y-5">
                                                                        <div className="flex gap-8 border-b border-black pb-3.5">
                                                                                <Skeleton className="h-4 w-16 bg-gray-300" />
                                                                                <Skeleton className="h-4 w-24 bg-gray-300" />
                                                                                <Skeleton className="h-4 w-16 bg-gray-300" />
                                                                        </div>
                                                                        <div className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200 space-y-4">
                                                                                <Skeleton className="h-4 w-full bg-gray-300" />
                                                                                <Skeleton className="h-4 w-full bg-gray-300" />
                                                                                <Skeleton className="h-4 w-3/4 bg-gray-300" />
                                                                                <div className="grid grid-cols-2 gap-3 pt-2">
                                                                                        {Array.from({ length: 6 }).map((_, i) => (
                                                                                                <Skeleton key={i} className="h-4 w-32 bg-gray-300" />
                                                                                        ))}
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        {/* Host card */}
                                                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 p-4 md:p-6 bg-white rounded-[10px] border border-gray-200">
                                                                <div className="flex gap-4 items-center justify-start">
                                                                        <Skeleton className="size-12 rounded-full bg-gray-300 shrink-0" />
                                                                        <div className="flex flex-col gap-2">
                                                                                <Skeleton className="h-4 w-32 bg-gray-300" />
                                                                                <Skeleton className="h-3 w-48 bg-gray-300" />
                                                                                <Skeleton className="h-3 w-28 bg-gray-300" />
                                                                        </div>
                                                                </div>
                                                                <Skeleton className="h-9 w-32 bg-gray-300" />
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Right content: payment section */}
                                        <div className="col-span-1 md:col-span-5 w-full">
                                                <div className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200 space-y-5">
                                                        <Skeleton className="h-8 w-32 bg-gray-300" />
                                                        <Skeleton className="h-10 w-full bg-gray-300" />
                                                        <div className="grid grid-cols-2 gap-3">
                                                                <Skeleton className="h-10 w-full bg-gray-300" />
                                                                <Skeleton className="h-10 w-full bg-gray-300" />
                                                        </div>
                                                        <Skeleton className="h-10 w-full bg-gray-300" />
                                                        <Skeleton className="h-px w-full bg-gray-300" />
                                                        <div className="space-y-2">
                                                                <Skeleton className="h-4 w-full bg-gray-300" />
                                                                <Skeleton className="h-4 w-full bg-gray-300" />
                                                                <Skeleton className="h-5 w-full bg-gray-300" />
                                                        </div>
                                                        <Skeleton className="h-11 w-full bg-gray-300" />
                                                </div>
                                        </div>
                                </div>
                        </section>
                </>
        );
}