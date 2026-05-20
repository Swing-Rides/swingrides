import { ReactNode } from "react"

type ReviewOverviewCardProps = {
        icon: ReactNode;
        label: string;
        number: number;
        iconBG: string;
}

export default function ReviewOverviewCard({ icon, label, number, iconBG }: ReviewOverviewCardProps ) {
        return (
                <div className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
                        <div className={`size-12 rounded-[10px] inline-flex justify-center items-center p-3 overflow-hidden aspect-square ${iconBG}`}>
                                {icon}
                        </div>
                        <div>
                                <span className="text-gray-500 text-xs font-semibold font-text uppercase">
                                        {label}
                                </span>
                        </div>
                        <div>
                                <span className="text-neutral-950 text-3xl font-medium font-text">
                                        {number}
                                </span>
                        </div>
                </div>
        )
}
