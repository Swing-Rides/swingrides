"use client"

import { Chart, useChart } from "@chakra-ui/charts"
import { Pie, PieChart, Sector, Tooltip } from "recharts"

// ─── Types ────────────────────────────────────────────────────────────────────

export type BookingDonutDataItem = {
        bookingStatus: string;
        bookingCount: number;
        color: string;
}

type BookingsDonutChartProps = {
        chartData: BookingDonutDataItem[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingsDonutChart({ chartData }: BookingsDonutChartProps) {
        const chart = useChart({ data: chartData })

        const total = chartData.reduce((sum, item) => sum + item.bookingCount, 0)

        return (
                <div className="p-4 md:p-6 bg-white rounded-md border border-gray-200 h-full flex flex-col">
                        <div className="mb-4">
                                <span className="text-neutral-950 text-base font-bold font-text leading-6">
                                        Booking Status
                                </span>
                        </div>

                        {/* Donut with centred total */}
                        <div className="relative flex items-center justify-center">
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
                                                        dataKey={chart.key("bookingCount")}
                                                        nameKey="bookingStatus"
                                                        shape={(props) => (
                                                                <Sector {...props} fill={chart.color(props.payload!.color)} />
                                                        )}
                                                />
                                        </PieChart>
                                </Chart.Root>

                                {/* Centred total label */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-2xl font-bold text-neutral-950 font-text leading-none">
                                                {total}
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium font-text mt-0.5">
                                                Total
                                        </span>
                                </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-4 md:mt-6 flex flex-col gap-2.5">
                                {chartData.map((item) => {
                                        const pct = total > 0 ? Math.round((item.bookingCount / total) * 100) : 0
                                        return (
                                                <div
                                                        key={item.bookingStatus}
                                                        className="flex items-center justify-between gap-4"
                                                >
                                                        <div className="flex gap-2 items-center min-w-0">
                                                                <div
                                                                        className="size-2.5 aspect-square rounded-full shrink-0"
                                                                        style={{ backgroundColor: item.color }}
                                                                />
                                                                <span className="text-gray-600 text-sm font-medium font-text leading-5 truncate">
                                                                        {item.bookingStatus}
                                                                </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                                <span className="text-neutral-950 text-sm font-semibold font-text leading-5 tabular-nums">
                                                                        {item.bookingCount}
                                                                </span>
                                                                <span className="text-gray-400 text-xs font-medium font-text tabular-nums w-8 text-right">
                                                                        {pct}%
                                                                </span>
                                                        </div>
                                                </div>
                                        )
                                })}
                        </div>
                </div>
        )
}