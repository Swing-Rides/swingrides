"use client"

import { Chart, useChart } from "@chakra-ui/charts"
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from "recharts"

export type ExpensesByCategoryDataRow = {
        name: string
        value: number
}

interface ExpensesByCategoryChartProps {
        data: ExpensesByCategoryDataRow[]
}

export default function ExpensesByCategoryChart({ data }: ExpensesByCategoryChartProps) {
        const values = data.map((d) => d.value)
        const maxVal = Math.max(...values)

        // sorted descending so largest bar is at top
        const sorted = [...data].sort((a, b) => b.value - a.value)

        const chart = useChart({
                data: sorted,
                series: [{ name: "value", color: "blue.solid" }],
        })

        return (
                <div className="p-4 md:p-6 bg-white rounded-md border border-gray-200 h-full flex flex-col gap-4 md:gap-6 overflow-clip">
                        <div>
                                <span className="text-neutral-950 text-base font-bold font-text leading-6">
                                        Expenses by Category
                                </span>
                        </div>
                        <div className="w-full h-72 overflow-hidden">
                                <Chart.Root chart={chart}>
                                        <BarChart
                                                data={chart.data}
                                                layout="vertical"
                                                responsive
                                                height={300}
                                                margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
                                                barCategoryGap="15%"
                                        >
                                                <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        stroke={chart.color("border")}
                                                        horizontal={false}
                                                        vertical={true}
                                                />

                                                <YAxis
                                                        type="category"
                                                        dataKey="name"
                                                        tickLine={false}
                                                        axisLine={false}
                                                        stroke={chart.color("border")}
                                                        tick={{ fill: "#6b7280", fontSize: 12 }}
                                                        width={90}
                                                />

                                                <XAxis
                                                        type="number"
                                                        tickLine={false}
                                                        axisLine={false}
                                                        stroke={chart.color("border")}
                                                        domain={[0, maxVal]}
                                                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                                        tick={{ fill: "#6b7280", fontSize: 12 }}
                                                />

                                                <Tooltip
                                                        cursor={{ fill: "#f3f4f6" }}
                                                        animationDuration={400}
                                                        content={<Chart.Tooltip />}
                                                        labelStyle={{ textTransform: "capitalize", color: "#111827" }}
                                                        formatter={(v) =>
                                                                [`$${Number(v).toLocaleString()}`, "Amount"]
                                                        }
                                                />

                                                <Bar
                                                        dataKey="value"
                                                        radius={[0, 4, 4, 0]}
                                                        isAnimationActive
                                                        animationDuration={800}
                                                        animationEasing="ease-out"
                                                        barSize={40}
                                                >
                                                        {sorted.map((entry, index) => (
                                                                <Cell
                                                                        key={`cell-${index}`}
                                                                        fill={chart.color("blue.solid")}
                                                                />
                                                        ))}
                                                </Bar>
                                        </BarChart>
                                </Chart.Root>
                        </div>
                </div>
        )
}