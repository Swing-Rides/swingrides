"use client"

import { Chart, useChart } from "@chakra-ui/charts"
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts"

export type RevenueAndBookingChartDataRow = { type: string; revenue: number; bookings: number }

interface RevenueAndBookingChartProps {
        data: RevenueAndBookingChartDataRow[]
}

export default function RevenueAndBookingChart({ data }: RevenueAndBookingChartProps) {

        const revenueValues = data.map((d) => d.revenue)
        const bookingValues = data.map((d) => d.bookings)

        const revMax = Math.max(...revenueValues)
        const bookMax = Math.max(...bookingValues)

        const chart = useChart({
                data,
                series: [
                        { name: "revenue", color: "blue.solid" },
                        { name: "bookings", color: "cyan.solid" },
                ],
        })

        return (
                <div className="p-4 md:p-6 bg-white rounded-md border border-gray-200 h-full flex flex-col gap-4 md:gap-6">
                        <div>
                                <span className="text-neutral-950 text-base font-bold font-text leading-6">
                                        Revenue & Booking Overview
                                </span>
                        </div>
                        <div className="w-full h-80 mt-4">
                                <Chart.Root maxH="sm" chart={chart}>
                                        <BarChart data={chart.data} height={335} responsive>
                                                <XAxis
                                                        tickLine={false}
                                                        dataKey={chart.key("type")}
                                                        stroke={chart.color("border")}
                                                />

                                                <YAxis
                                                        yAxisId="revenue"
                                                        orientation="left"
                                                        tickLine={false}
                                                        stroke={chart.color("border")}
                                                        domain={[0, revMax]}
                                                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                                        label={{
                                                                value: "Revenue",
                                                                angle: -90,
                                                                position: "insideLeft",
                                                                offset: 10,
                                                                style: { textAnchor: "middle", fill: "#6b7280", fontSize: 12 },
                                                        }}
                                                />

                                                <YAxis
                                                        yAxisId="bookings"
                                                        orientation="right"
                                                        tickLine={false}
                                                        stroke={chart.color("border")}
                                                        domain={[0, bookMax]}
                                                        label={{
                                                                value: "Bookings",
                                                                angle: 90,
                                                                position: "insideRight",
                                                                offset: 10,
                                                                style: { textAnchor: "middle", fill: "#6b7280", fontSize: 12 },
                                                        }}
                                                />

                                                <Tooltip
                                                        cursor={{ fill: "#f3f4f6" }}
                                                        animationDuration={500}
                                                        content={<Chart.Tooltip />}
                                                        labelStyle={{
                                                                textTransform: "capitalize",
                                                                color: "#111827",
                                                        }}
                                                />

                                                <Legend
                                                        layout="vertical"
                                                        align="right"
                                                        verticalAlign="top"
                                                        wrapperStyle={{ 
                                                                paddingLeft: 30, 
                                                                textTransform: 'capitalize' 
                                                        }}
                                                        content={<Chart.Legend orientation="vertical" />}
                                                />

                                                <Bar
                                                        yAxisId="revenue"
                                                        isAnimationActive
                                                        dataKey={chart.key("revenue")}
                                                        fill={chart.color("blue.solid")}
                                                        barSize={20}
                                                />

                                                <Bar
                                                        yAxisId="bookings"
                                                        isAnimationActive
                                                        dataKey={chart.key("bookings")}
                                                        fill={chart.color("cyan.solid")}
                                                        barSize={20}
                                                />
                                        </BarChart>
                                </Chart.Root>
                        </div>
                </div>
        )
}
