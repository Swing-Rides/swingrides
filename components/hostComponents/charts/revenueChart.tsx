"use client";

import { useState, useMemo } from "react";
import {
        AreaChart,
        Area,
        XAxis,
        YAxis,
        Tooltip,
        ResponsiveContainer,
        CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FilterType = "7D" | "30D" | "90D";

export type GraphDataPoint = {
        sales: number;
        /** ISO date string e.g. "2025-05-01" or short label "May 1" */
        label: string;
};

export type GraphDataType = {
        "7D": GraphDataPoint[];
        "30D": GraphDataPoint[];
        "90D": GraphDataPoint[];
        series: {
                name: string;
                color: string;
        }[];
};

// ─── Default / sample data ────────────────────────────────────────────────────

function buildDays(count: number, seed = 12_000): GraphDataPoint[] {
        const now = new Date();
        return Array.from({ length: count }, (_, i) => {
                const d = new Date(now);
                d.setDate(d.getDate() - (count - 1 - i));
                const label =
                        count <= 7
                                ? d.toLocaleDateString("en-US", { weekday: "short" })        // Mon, Tue…
                                : count <= 30
                                        ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) // May 1
                                        : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                const sales = Math.max(
                        0,
                        seed +
                        Math.round(Math.sin(i * 0.7) * seed * 0.4) +
                        Math.round(Math.random() * seed * 0.3),
                );
                return { label, sales };
        });
}

export const defaultGraphData: GraphDataType = {
        "7D": buildDays(7, 14_000),
        "30D": buildDays(30, 22_000),
        "90D": buildDays(90, 18_000),
        series: [{ name: "Revenue", color: "#1A56DB" }],
};

// ─── Props exposed to parent (for data fetching) ──────────────────────────────

export type RevenueChartProps = {
        /** Structured data keyed by filter window. Supply from your server/API fetch. */
        graphData?: GraphDataType;
        /** Called whenever the user changes the time filter so the parent can re-fetch. */
        onFilterChange?: (filter: FilterType) => void;
        /** Whether new data is loading (shows a subtle pulse on the chart). */
        isLoading?: boolean;
};

// ─── Filter options ───────────────────────────────────────────────────────────

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
        { label: "7 days", value: "7D" },
        { label: "30 days", value: "30D" },
        { label: "90 days", value: "90D" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getYTicks(maxVal: number): number[] {
        const safeMax = maxVal === 0 ? 100 : maxVal;
        const step = safeMax / 4;
        return [0, 1, 2, 3, 4].map((i) => Math.round(step * i));
}

function formatSales(value: number): string {
        if (value === 0) return "$0";
        if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
        if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
        return `$${value}`;
}

/** Percentage change from first → last point */
function getTrend(data: GraphDataPoint[]): number | null {
        if (data.length < 2) return null;
        const first = data[0].sales;
        const last = data[data.length - 1].sales;
        if (first === 0) return null;
        return ((last - first) / first) * 100;
}

// ─── X-axis tick thinning ─────────────────────────────────────────────────────

function getTickInterval(dataLength: number): number {
        if (dataLength <= 7) return 0;          // show every tick
        if (dataLength <= 30) return 4;          // ~every 5th
        return 9;                                // ~every 10th
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
        active,
        payload,
        label,
}: {
        active?: boolean;
        payload?: { value: number }[];
        label?: string;
}) {
        if (!active || !payload?.length) return null;
        return (
                <div className="rounded-xl border border-gray-100 bg-white px-3.5 py-2.5 shadow-lg shadow-gray-200/60">
                        <p className="text-[11px] font-medium text-gray-400 mb-1 tracking-wide uppercase">
                                {label}
                        </p>
                        <p className="text-sm font-bold text-gray-900 tabular-nums">
                                {formatSales(payload[0].value)}
                        </p>
                </div>
        );
}

// ─── Trend badge ──────────────────────────────────────────────────────────────

function TrendBadge({ trend }: { trend: number | null }) {
        if (trend === null) return null;
        const up = trend >= 0;
        return (
                <div
                        className={[
                                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums",
                                up
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-red-50 text-red-500",
                        ].join(" ")}
                >
                        {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {up ? "+" : ""}
                        {trend.toFixed(1)}%
                </div>
        );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RevenueChart({
        graphData = defaultGraphData,
        onFilterChange,
        isLoading = false,
}: RevenueChartProps) {
        const [activeFilter, setActiveFilter] = useState<FilterType>("30D");

        const handleFilterChange = (f: FilterType) => {
                setActiveFilter(f);
                onFilterChange?.(f);
        };

        const filteredData = useMemo(
                () => graphData[activeFilter] ?? [],
                [activeFilter, graphData],
        );

        const maxVal = useMemo(
                () => Math.max(...filteredData.map((d) => d.sales), 0),
                [filteredData],
        );

        const yTicks = useMemo(() => getYTicks(maxVal), [maxVal]);
        const trend = useMemo(() => getTrend(filteredData), [filteredData]);
        const tickInterval = getTickInterval(filteredData.length);

        // Summary stats
        const totalRevenue = useMemo(
                () => filteredData.reduce((sum, d) => sum + d.sales, 0),
                [filteredData],
        );
        const avgDaily = filteredData.length
                ? Math.round(totalRevenue / filteredData.length)
                : 0;

        return (
                <div
                        className={[
                                "flex flex-col gap-4 md:gap-6 w-full transition-opacity duration-300",
                                isLoading ? "opacity-50 pointer-events-none" : "opacity-100",
                        ].join(" ")}
                >
                        {/* ── Header ── */}
                        <div className="flex flex-wrap gap-3 justify-between items-start">
                                <div className="flex flex-col gap-1.5">
                                        <div className="flex flex-col gap-3">
                                                <span className="text-neutral-950 text-base font-semibold font-text">
                                                        Revenue Overview
                                                </span>
                                                <div className="flex gap-3 items-end">
                                                        <span className="text-gray-800 text-2xl font-medium font-text leading-8">
                                                                {formatSales(totalRevenue)}
                                                        </span>
                                                        <TrendBadge trend={trend} />
                                                </div>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">
                                                Avg {formatSales(avgDaily)} / day
                                        </span>
                                </div>

                                {/* Filter pill group */}
                                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                                        {FILTER_OPTIONS.map(({ label, value }) => (
                                                <button
                                                        key={value}
                                                        onClick={() => handleFilterChange(value)}
                                                        className={[
                                                                "px-3.5 py-1.5 rounded-lg text-xs font-semibold font-text leading-5 transition-all duration-200 cursor-pointer whitespace-nowrap",
                                                                activeFilter === value
                                                                        ? "bg-white shadow-sm text-blue-700 shadow-gray-200"
                                                                        : "text-gray-500 hover:text-gray-700",
                                                        ].join(" ")}
                                                >
                                                        {label}
                                                </button>
                                        ))}
                                </div>
                        </div>

                        {/* ── Chart ── */}
                        <ResponsiveContainer
                                width="100%"
                                height={300}
                                className="text-gray-500 text-xs font-normal font-text"
                        >
                                <AreaChart
                                        data={filteredData}
                                        margin={{ top: 10, right: 6, left: 0, bottom: 0 }}
                                >
                                        <defs>
                                                <linearGradient id="mrr-gradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#1A56DB" stopOpacity={0.18} />
                                                        <stop offset="100%" stopColor="#1A56DB" stopOpacity={0} />
                                                </linearGradient>
                                        </defs>

                                        <CartesianGrid
                                                vertical={false}
                                                stroke="#F3F4F6"
                                                strokeDasharray="0"
                                        />

                                        <XAxis
                                                dataKey="label"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 500 }}
                                                dy={8}
                                                interval={tickInterval}
                                        />

                                        <YAxis
                                                ticks={yTicks}
                                                tickFormatter={formatSales}
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 500 }}
                                                width={54}
                                                domain={[0, maxVal === 0 ? 100 : Math.ceil(maxVal * 1.15)]}
                                        />

                                        <Tooltip
                                                content={<CustomTooltip />}
                                                cursor={{ stroke: "#D1D5DB", strokeWidth: 1, strokeDasharray: "4 3" }}
                                        />

                                        <Area
                                                type="monotone"
                                                dataKey="sales"
                                                stroke="#1A56DB"
                                                strokeWidth={2}
                                                fill="url(#mrr-gradient)"
                                                dot={false}
                                                activeDot={{ r: 5, fill: "#1A56DB", strokeWidth: 2.5, stroke: "#fff" }}
                                                isAnimationActive={true}
                                                animationDuration={500}
                                                animationEasing="ease-out"
                                        />
                                </AreaChart>
                        </ResponsiveContainer>
                </div>
        );
}