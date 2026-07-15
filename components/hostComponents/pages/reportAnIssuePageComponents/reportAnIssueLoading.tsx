import { Skeleton } from "@/components/ui/skeleton";

export default function ReportAnIssueLoading() {
        return (
                <div className="mt-4 md:mt-8">
                        {/* Tabs */}
                        <div className="flex gap-8 border-b-2 border-gray-200 pb-3 mb-5 md:mb-8">
                                <Skeleton className="h-4 w-32 bg-gray-300" />
                                <Skeleton className="h-4 w-24 bg-gray-300" />
                        </div>

                        {/* Issue details card */}
                        <div className="p-3 md:p-8 bg-white rounded-[10px] border border-gray-200 max-w-225 space-y-5">
                                <Skeleton className="h-5 w-32 bg-gray-300" />
                                <Skeleton className="h-px w-full bg-gray-300" />

                                <div className="space-y-4">
                                        <div className="space-y-2">
                                                <Skeleton className="h-3 w-24 bg-gray-300" />
                                                <Skeleton className="h-10 w-full bg-gray-300" />
                                        </div>
                                        <div className="space-y-2">
                                                <Skeleton className="h-3 w-32 bg-gray-300" />
                                                <Skeleton className="h-10 w-full bg-gray-300" />
                                        </div>
                                        <div className="space-y-2">
                                                <Skeleton className="h-3 w-28 bg-gray-300" />
                                                <Skeleton className="h-28 w-full bg-gray-300" />
                                        </div>
                                        <Skeleton className="h-10 w-32 bg-gray-300" />
                                </div>
                        </div>
                </div>
        );
}