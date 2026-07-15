import { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export type OverviewCardProps = {
        iconBg: string;
        icon: ReactNode;
        trendPositive: boolean;
        trendPercentage: string;
        label: string;
        number: string;
};

export const OverviewCard = ({
        iconBg,
        icon,
        trendPositive,
        trendPercentage,
        label,
        number,
}: OverviewCardProps) => {
        return (
                <div className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2 space-y-2">
                        <div className="flex justify-between items-center gap-2 w-full">
                                <div
                                        className={`size-12 p-3 rounded-[10px] flex justify-center items-center ${iconBg}`}
                                >
                                        {icon}
                                </div>
                                <div
                                        className={`flex gap-1 items-center justify-start py-1 px-2 rounded-sm ${trendPositive ? "text-emerald-500 bg-green-100" : "text-red-500 bg-rose-100"}`}
                                >
                                        {trendPositive ? (
                                                <ArrowUpRight className="size-1 text-current" />
                                        ) : (
                                                <ArrowDownRight className="size-1 text-current" />
                                        )}
                                        <span className="text-xs text-current font-semibold font-text leading-4">
                                                {trendPercentage}
                                        </span>
                                </div>
                        </div>
                        <div className="flex flex-col gap-2 justify-start items-start">
                                <h4 className="text-gray-500 text-xs font-semibold font-text uppercase">
                                        {label}
                                </h4>
                                <span className="text-neutral-950 text-lg md:text-3xl font-medium font-text">
                                        {number}
                                </span>
                        </div>
                </div>
        );
};