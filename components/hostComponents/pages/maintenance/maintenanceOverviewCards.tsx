import { ReactNode } from "react";

export type MaintenanceOverviewCardProps = {
        icon: ReactNode;
        iconBgColor?: string;
        title: string;
        number: string;
};

export const MaintenanceOverviewCard = ({
        icon,
        iconBgColor,
        title,
        number,
}: MaintenanceOverviewCardProps) => {
        return (
                <div className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
                        <div
                                className={`size-12 rounded-[10px] flex justify-center items-center overflow-clip ${iconBgColor ? iconBgColor : "bg-indigo-50"}`}
                        >
                                {icon}
                        </div>
                        <div>
                                <span className="text-gray-500 text-xs font-semibold font-text uppercase">
                                        {title}
                                </span>
                        </div>
                        <div>
                                <span className="text-neutral-950 text-3xl font-medium font-text">
                                        {number}
                                </span>
                        </div>
                </div>
        );
};

export type HealthOverviewCardProps = MaintenanceOverviewCardProps & {
        label: string;
};

export const HealthOverviewCard = ({
        icon,
        iconBgColor,
        title,
        number,
        label,
}: HealthOverviewCardProps) => {
        return (
                <div className="basis-95 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-3.5">
                        <div className="flex gap-3.5 items-center">
                                <div
                                        className={`size-12 rounded-[10px] flex justify-center items-center overflow-clip ${iconBgColor ? iconBgColor : "bg-indigo-50"}`}
                                >
                                        {icon}
                                </div>
                                <div className="flex flex-col gap-2">
                                        <div>
                                                <span className="text-gray-500 text-xs font-semibold font-text uppercase">
                                                        {title}
                                                </span>
                                        </div>
                                        <div>
                                                <span className="text-neutral-950 text-3xl font-medium font-text">
                                                        {number}
                                                </span>
                                        </div>
                                </div>
                        </div>
                        <div>
                                <span className="text-gray-500 text-xs font-medium font-text">
                                        {label}
                                </span>
                        </div>
                </div>
        );
};