"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumberToUSD } from "../utils/formatNumbertoUSD";
import { AdminBillingResponseData } from "@/types/admin.type";

const LEGEND_COLORS: Record<string, string> = {
  starter: "#9CA3AF",
  professional: "#1A56DB",
  enterprise: "#10B981",
};

function CustomLegend({
  chartData,
}: {
  chartData: AdminBillingResponseData["charts"]["revenueByPlan"];
}) {
  return (
    <div className="flex items-center gap-5 justify-end pt-2 pr-1">
      {chartData.breakdown.map((item) => (
        <div key={item.plan} className="flex items-center gap-1.5">
          <span
            className="inline-block size-2.5 rounded-sm shrink-0"
            style={{ backgroundColor: LEGEND_COLORS[item.plan] }}
          />
          <span
            className=" text-xs font-normal"
            style={{ color: LEGEND_COLORS[item.plan] }}
          >
            {item.plan.charAt(0).toUpperCase() + item.plan.slice(1)} ·{" "}
            {item.percentage}%
          </span>
        </div>
      ))}
    </div>
  );
}

type TooltipEntry = {
  name: string;
  value: number;
  color: string;
};

type CustomTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: TooltipEntry[];
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum, entry) => sum + (entry.value ?? 0), 0);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white shadow-md px-3 py-2.5 min-w-40">
      <p className="text-gray-500 text-xs font-normal mb-2">{label}</p>
      <div className="flex flex-col gap-1.5">
        {[...(payload as TooltipEntry[])].reverse().map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-4"
          >
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
        <span className="text-neutral-900 text-xs font-semibold">
          {formatNumberToUSD(total)}
        </span>
      </div>
    </div>
  );
}

export default function RevenueByPlanChart({
  chartData,
}: {
  chartData: AdminBillingResponseData["charts"]["revenueByPlan"];
}) {
  const chart = {
    data: [
      {
        month: chartData.month,
        ...chartData.breakdown.reduce<Record<string, number>>((acc, item) => {
          acc[item.plan] = item.value;
          return acc;
        }, {}),
      },
    ],
    series: chartData.breakdown.map((item) => ({
      name: item.plan,
      color: LEGEND_COLORS[item.plan],
    })),
  };

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
            dataKey="month"
            tick={{ fontSize: 12, fill: "#6B7280" }}
            tickMargin={8}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            tickCount={5}
            width={52}
            tickFormatter={(value) => formatNumberToUSD(Number(value))}
          />

          <Tooltip
            cursor={{ fill: "#F3F4F6", radius: 4 }}
            animationDuration={300}
            content={<CustomTooltip />}
          />

          {chart.series.map((item, idx) => {
            const isTop = idx === chart.series.length - 1;
            return (
              <Bar
                key={item.name}
                dataKey={item.name}
                fill={item.color}
                stackId="revenue"
                barSize={30}
                radius={isTop ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                isAnimationActive={true}
                animationDuration={500}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>

      <CustomLegend chartData={chartData} />
    </div>
  );
}
