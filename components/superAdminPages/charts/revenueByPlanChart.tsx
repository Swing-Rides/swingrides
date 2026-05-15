"use client"

import { useChart } from "@chakra-ui/charts"
import {
        Bar,
        BarChart,
        CartesianGrid,
        ResponsiveContainer,
        Tooltip,
        XAxis,
        YAxis,
} from "recharts"
import { revenueByPlanTestData, PLAN_PRICES } from "@/constants/superAdminSidebar"
import { formatNumberToUSD } from "../utils/formatNumbertoUSD"



function AxisTick({
        x, 
        y, 
        payload, 
        anchor = "middle",
}: {
        x?: number; 
        y?: number; 
        payload?: { value: string }; 
        anchor?: "middle" | "inherit" | "start" | "end" | undefined
}) {
        return (
                <text
                        x={x}
                        y={y}
                        dy={4}
                        textAnchor={anchor}
                        fill="#6B7280"       
                        fontSize={12}          
                        fontWeight={400}
                        fontFamily="inherit"
                >
                        {payload?.value}
                </text>
        )
}

function YAxisTick({
        x, y, payload,
}: {
        x?: number; y?: number; payload?: { value: number }
}) {
        return (
                <text
                        x={x}
                        y={y}
                        dy={4}
                        textAnchor="end"
                        fill="#6B7280"
                        fontSize={12}
                        fontWeight={400}
                        fontFamily="inherit"
                >
                        {formatNumberToUSD(payload?.value ?? 0)}
                </text>
        )
}

const LEGEND_LABELS: Record<string, string> = {
        starter: `Starter · $${PLAN_PRICES.starter}/mo`,
        professional: `Professional · $${PLAN_PRICES.professional}/mo`,
        enterprise: `Enterprise · $${PLAN_PRICES.enterprise}/mo`,
}

const LEGEND_COLORS: Record<string, string> = {
        starter: "#9CA3AF",
        professional: "#1A56DB",
        enterprise: "#10B981",
}

function CustomLegend() {
        return (
                <div className="flex items-center gap-5 justify-end pt-2 pr-1">
                        {Object.entries(LEGEND_LABELS).map(([key, label]) => (
                                <div key={key} className="flex items-center gap-1.5">
                                        <span
                                                className="inline-block size-2.5 rounded-sm shrink-0"
                                                style={{ backgroundColor: LEGEND_COLORS[key] }}
                                        />
                                        <span 
                                                className=" text-xs font-normal"
                                                style={{ color: LEGEND_COLORS[key] }}
                                        >
                                                {label}
                                        </span>
                                </div>
                        ))}
                </div>
        )
}

type TooltipEntry = {
        name: string
        value: number
        color: string
}

type CustomTooltipProps = {
        active?: boolean
        label?: string
        payload?: TooltipEntry[]
}


function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
        if (!active || !payload?.length) return null

        const total = payload.reduce((sum, entry) => sum + (entry.value ?? 0), 0)

        return (
                <div className="rounded-lg border border-neutral-200 bg-white shadow-md px-3 py-2.5 min-w-40">
                        <p className="text-gray-500 text-xs font-normal mb-2">{label}</p>
                        <div className="flex flex-col gap-1.5">
                                {[...(payload as TooltipEntry[])].reverse().map((entry) => (
                                        <div key={entry.name} className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-1.5">
                                                        <span
                                                                className="inline-block size-2 rounded-sm shrink-0"
                                                                style={{ backgroundColor: entry.color }}
                                                        />
                                                        <span className="text-gray-500 text-xs font-normal capitalize">
                                                                {entry.name}
                                                        </span>
                                                </div>
                                                <span className="text-neutral-900 text-xs font-semibold">
                                                        {formatNumberToUSD(entry.value)}
                                                </span>
                                        </div>
                                ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-neutral-100 flex justify-between">
                                <span className="text-gray-500 text-xs font-normal">Total</span>
                                <span className="text-neutral-900 text-xs font-semibold">{formatNumberToUSD(total)}</span>
                        </div>
                </div>
        )
}


export default function RevenueByPlanChart() {
        const chart = useChart({
                data: revenueByPlanTestData.data,
                series: revenueByPlanTestData.series,
        })

        return (
                <div className="flex flex-col gap-2 w-full">

                        <ResponsiveContainer width="100%" height={260}>
                                <BarChart
                                        data={chart.data}
                                        barCategoryGap={8}
                                        barSize={30}
                                        margin={{ top: 4, right: 4, left: 8, bottom: 0 }}
                                >
                                        <CartesianGrid
                                                vertical={false}
                                                stroke="#E5E7EB"
                                                strokeDasharray="4 4"
                                        />

                                        <XAxis
                                                axisLine={false}
                                                tickLine={false}
                                                dataKey={chart.key("month")}
                                                tick={<AxisTick />}
                                                tickMargin={8}
                                        />

                                        <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={<YAxisTick />}
                                                tickCount={5}
                                                width={52}
                                        />

                                        <Tooltip
                                                cursor={{ fill: "#F3F4F6", radius: 4 }}
                                                animationDuration={300}
                                                content={<CustomTooltip />}
                                        />

                                        {chart.series.map((item, idx) => {
                                                const isTop = idx === chart.series.length - 1
                                                const isBottom = idx === 0
                                                return (
                                                        <Bar
                                                                key={item.name}
                                                                dataKey={chart.key(item.name)}
                                                                fill={chart.color(item.color)}
                                                                stackId={item.stackId}
                                                                barSize={30}
                                                                // Round only the top of the topmost segment
                                                                radius={isTop ? [4, 4, 0, 0] : isBottom ? [0, 0, 0, 0] : [0, 0, 0, 0]}
                                                                isAnimationActive={true}
                                                                animationDuration={500}
                                                        />
                                                )
                                        })}
                                </BarChart>
                        </ResponsiveContainer>

                        <CustomLegend />
                </div>
        )
}