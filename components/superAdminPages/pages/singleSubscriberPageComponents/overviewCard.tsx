import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { OverviewCardProps } from "./subscriberDetail.types";

export default function OverviewCard({
        icon,
        title,
        number,
}: OverviewCardProps) {
        return (
                <div className="basis-62.5 shrink-0 grow p-6 bg-white hover:bg-blue-100 hover:border-blue-200 transition-colors duration-300 rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
                        <div>{icon}</div>
                        <span className="text-gray-500 text-xs font-semibold font-text uppercase">
                                {title}
                        </span>
                        <Suspense fallback={<Skeleton className="w-20 h-10" />}>
                                <span className="text-neutral-950 text-3xl font-medium font-text">
                                        {number}
                                </span>
                        </Suspense>
                </div>
        );
}