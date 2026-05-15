"use client"

import { useState, useMemo } from "react"
import {
        AreaChart,
        Area,
        XAxis,
        YAxis,
        Tooltip,
        ResponsiveContainer,
        CartesianGrid,
} from "recharts"
import { CardIntro } from "../dashboard/cardIntro"


type FilterType = "3M" | "6M" | "1Y"

export type GraphDataType = {
        data: {
                sales: number;
                month: string;
        }[];
        series: {
                name: string;
                color: string;
        }[];
}

const defaultGraphData = {
        data: [
                { sales: 0, month: "Jan" },
                { sales: 0, month: "Feb" },
                { sales: 0, month: "Mar" },
                { sales: 0, month: "Apr" },
                { sales: 0, month: "May" },
                { sales: 0, month: "Jun" },
                { sales: 0, month: "Jul" },
                { sales: 0, month: "Aug" },
                { sales: 0, month: "Sept" },
                { sales: 0, month: "Oct" },
                { sales: 0, month: "Nov" },
                { sales: 0, month: "Dec" },
        ],
        series: [{ name: "sales", color: "#1A56DB" }],
}

// Current month: May 2026 → index 4 in the dataset (Jan=0 … Dec=11)
const CURRENT_MONTH_INDEX = 4

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
        { label: "3 Month", value: "3M" },
        { label: "6 Month", value: "6M" },
        { label: "1 Year", value: "1Y" },
]

const MONTH_COUNT: Record<FilterType, number> = {
        "3M": 3,
        "6M": 6,
        "1Y": 12,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns the last `count` months ending at CURRENT_MONTH_INDEX,
 * wrapping around the dataset when needed.
 */
function getFilteredData(filter: FilterType, graphData: GraphDataType) {
        const { data } = graphData
        const n = data.length
        const count = MONTH_COUNT[filter]

        return Array.from({ length: count }, (_, i) => {
                const offset = count - 1 - i
                const idx = ((CURRENT_MONTH_INDEX - offset) % n + n) % n
                return data[idx]
        })
}

/**
 * Produces exactly 5 evenly-spaced Y-axis ticks: [0, 25%, 50%, 75%, 100%] of max.
 */
function getYTicks(maxVal: number): number[] {
        const step = maxVal / 4
        return [0, 1, 2, 3, 4].map((i) => Math.round(step * i))
}

/** Compact currency formatter: 593874 → $594K, 1200000 → $1.2M */
function formatSales(value: number): string {
        if (value === 0) return "$0"
        if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
        if (value >= 1_000) return `$${Math.round(value / 1_000)}K`
        return `$${value}`
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({
        active,
        payload,
        label,
}: {
        active?: boolean
        payload?: { value: number }[]
        label?: string
}) {
        if (!active || !payload?.length) return null
        return (
                <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-md">
                        <p className="text-xs text-neutral-500 mb-0.5">{label}</p>
                        <p className="text-sm font-semibold text-neutral-900">
                                {formatSales(payload[0].value)}
                        </p>
                </div>
        )
}


export default function SalesChart({ graphData = defaultGraphData }: { graphData?: GraphDataType }) {
        const [activeFilter, setActiveFilter] = useState<FilterType>("1Y")

        const filteredData = useMemo(() => getFilteredData(activeFilter, graphData), [activeFilter, graphData])

        const maxVal = useMemo(
                () => Math.max(...filteredData.map((d) => d.sales)),
                [filteredData],
        )

        const yTicks = useMemo(() => getYTicks(maxVal), [maxVal])

        return (
                <div className="flex flex-col gap-6 w-full">
                        {/* Filter buttons */}
                        <div className="flex flex-wrap gap-4 justify-between items-center">
                                <CardIntro
                                        title='MRR Growth'
                                        desc='Monthly recurring revenue trend'
                                />
                                <div className="flex bg-gray-100 rounded-lg justify-start items-center gap-2">
                                        {FILTER_OPTIONS.map(({ label, value }) => (
                                                <button
                                                        key={value}
                                                        onClick={() => setActiveFilter(value)}
                                                        className={[
                                                                "px-4 py-1.5 rounded-lg text-xs font-medium font-text leading-5 transition-all duration-300 cursor-pointer",
                                                                activeFilter === value
                                                                        ? "bg-white rounded-md shadow-[0px_1px_10px_-3px_rgba(0,0,0,1.10)] text-blue-700"
                                                                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                                                        ].join(" ")}
                                                >
                                                        {label}
                                                </button>
                                        ))}
                                </div>
                        </div>

                        {/* Chart */}
                        <ResponsiveContainer
                                width="100%"
                                height={350}
                                className={'text-gray-500 text-xs font-normal font-text'}
                        >
                                <AreaChart
                                        data={filteredData}
                                        margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
                                >
                                        {/* Gradient definition */}
                                        <defs>
                                                <linearGradient id="mrr-gradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#1A56DB" stopOpacity={0.25} />
                                                        <stop offset="100%" stopColor="#1A56DB" stopOpacity={0} />
                                                </linearGradient>
                                        </defs>

                                        {/* Subtle horizontal gridlines only */}
                                        <CartesianGrid
                                                vertical={false}
                                                stroke="#E5E7EB"
                                                strokeDasharray="4 4"
                                        />

                                        <XAxis
                                                dataKey="month"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                                                dy={6}
                                        />

                                        <YAxis
                                                ticks={yTicks}
                                                tickFormatter={formatSales}
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                                                width={52}
                                                domain={[0, maxVal]}
                                        />

                                        <Tooltip
                                                content={<CustomTooltip />}
                                                cursor={{ stroke: "#1A56DB", strokeWidth: 1, strokeDasharray: "4 4" }}
                                        />

                                        <Area
                                                type="monotone"
                                                dataKey="sales"
                                                stroke="#1A56DB"
                                                strokeWidth={2}
                                                fill="url(#mrr-gradient)"
                                                dot={false}
                                                activeDot={{ r: 4, fill: "#1A56DB", strokeWidth: 2, stroke: "#fff" }}
                                                isAnimationActive={true}
                                                animationDuration={400}
                                        />
                                </AreaChart>
                        </ResponsiveContainer>
                </div>
        )
}