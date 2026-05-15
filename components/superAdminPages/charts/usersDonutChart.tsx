"use client"

import { Chart, useChart } from "@chakra-ui/charts"
import { Pie, PieChart, Sector, Tooltip } from "recharts"
import { calculatePercentages } from "../utils/chart"


type UsersDonutChartProps = {
        chartData: {
                userPackage: string;
                userCount: number;
                color: string;
        }[]
}

export default function UsersDonutChart({ chartData }: UsersDonutChartProps) {

        const chart = useChart({ data: chartData })

        const dataWithPercentages = calculatePercentages(chartData, "userCount")

        return (
                <div>
                        <Chart.Root boxSize="200px" chart={chart} mx="auto">
                                <PieChart responsive>
                                        <Tooltip
                                                cursor={false}
                                                animationDuration={300}
                                                content={<Chart.Tooltip hideLabel />}
                                        />
                                        <Pie
                                                innerRadius={60}
                                                outerRadius={100}
                                                isAnimationActive={true}
                                                data={chart.data}
                                                paddingAngle={2}
                                                dataKey={chart.key("userCount")}
                                                nameKey="userPackage"
                                                shape={(props) => (
                                                        <Sector {...props} fill={chart.color(props.payload!.color)} />
                                                )}
                                        />
                                </PieChart>
                        </Chart.Root>
                        <div className="mt-4 md:mt-7">
                                {dataWithPercentages.map((item) => (
                                        <div
                                                key={item.userPackage}
                                                className="flex gap-4 items-center justify-between"
                                        >
                                                <div className="flex gap-2 items-center justify-between">
                                                        <div
                                                                className="size-3 aspect-square rounded-full shrink-0"
                                                                style={{ backgroundColor: item.color }}
                                                        />
                                                        <div>
                                                                <span className="text-neutral-950 text-sm font-medium font-text leading-5">
                                                                        {item.userPackage}
                                                                </span>
                                                        </div>
                                                </div>

                                                <div className="flex gap-3 items-center justify-between">
                                                        <div>
                                                                <span className="text-neutral-950 text-base font-medium font-text leading-5">
                                                                        {item.userCount}
                                                                </span>
                                                        </div>
                                                        <div>
                                                                <span className="text-gray-500 text-sm font-normal font-text leading-5">
                                                                        {item.percentage}
                                                                </span>
                                                        </div>
                                                </div>
                                        </div>
                                ))}
                        </div>
                </div>
        )
}