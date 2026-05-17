import { ReactNode, Suspense } from "react";
import { BarChart3, CarFront, DollarSign, Users } from "lucide-react";
import PageIntro from "../dashboard/pageIntro";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersDonutChart } from "../dashboard/dynamicImport";
import { SalesChart } from "../dashboard/dynamicImport";
import { CardIntro } from "../dashboard/cardIntro";
import { formatNumberToUSD } from "../utils/formatNumbertoUSD";
import { AdminOverviewResponseData } from "@/types/admin.type";

type OverviewCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down" | "flat";
};

type AdminPageComponentsProps = {
  overview?: AdminOverviewResponseData;
};

const CARD_ICON_MAP: Record<string, ReactNode> = {
  totalActiveSubscribers: <Users className="size-5 text-blue-700" />,
  monthlyRecurringRevenue: <DollarSign className="size-5 text-emerald-600" />,
  totalRegisteredRenter: <Users className="size-5 text-cyan-600" />,
  activeRentalsPlatformWide: <CarFront className="size-5 text-amber-500" />,
};

export default function AdminPageComponents({
  overview,
}: AdminPageComponentsProps) {
  const graphData = {
    data: overview?.mrrGrowth.data.map((point) => ({
      sales: point.value,
      month: point.month,
    })),
    series: [{ name: "sales", color: "#1A56DB" }],
  };

  const donutData = overview?.subscriberDistribution.map((item, index) => ({
    userPackage: item.plan.charAt(0).toUpperCase() + item.plan.slice(1),
    userCount: item.count,
    color: ["#1A56DB", "#10B981", "#F59E0B"][index] ?? "#6B7280",
  }));

  return (
    <div className="p-3 md:p-8">
      <div>
        <PageIntro
          pageTitle="Platform Overview"
          pageDesc={`Here's what's happening across SwingRides today.`}
        />

        <div className="flex flex-wrap gap-4 mt-8">
          {overview?.cards.map((card) => (
            <OverviewCard
              key={card.key}
              icon={
                CARD_ICON_MAP[card.key] ?? (
                  <BarChart3 className="size-5 text-blue-700" />
                )
              }
              title={card.label}
              value={
                typeof card.value === "number"
                  ? formatNumberToUSD(card.value)
                  : card.value
              }
              trend={card.trend}
              trendDirection={card.trendDirection}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-4 my-4">
          <div className="basis-183 grow p-3 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-6">
            {/* <SalesChart graphData={graphData} /> */}
          </div>
          <div className="basis-95 grow md:grow-0 p-3 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-6">
            <div>
              <CardIntro
                title="Subscriber Distribution"
                desc="Active plans breakdown"
              />
            </div>
            <div>{/* <UsersDonutChart chartData={donutData} /> */}</div>
          </div>
        </div>

        <div className="p-3 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-6">
          <div className="flex justify-between items-center pb-6 border-b">
            <CardIntro title="Recent Activity" desc="Latest platform events" />
          </div>
          <div className="grid gap-3">
            {overview?.recentActivity.map((item, index) => (
              <div
                key={`${item.eventType}-${item.time}-${item.action}-${index}`}
                className="flex flex-col gap-1 rounded-lg border border-gray-100 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-neutral-900">
                    {item.eventType}{" "}
                    <span className="font-normal text-gray-500">on</span>{" "}
                    {item.entity}
                  </p>
                  <p className="text-sm text-gray-600">{item.details}</p>
                </div>
                <div className="text-sm text-gray-500 md:text-right">
                  <p>{item.time}</p>
                  <p className="font-medium text-blue-700">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const OverviewCard = ({
  icon,
  title,
  value,
  trend,
  trendDirection,
}: OverviewCardProps) => {
  return (
    <div className="basis-62.5 shrink-0 grow p-6 bg-white hover:bg-blue-100 hover:border-blue-200 transition-colors duration-300 rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
      <div>{icon}</div>
      <div>
        <span className="text-gray-500 text-xs font-semibold font-text uppercase">
          {title}
        </span>
      </div>
      <Suspense fallback={<Skeleton className="w-20 h-10" />}>
        <div>
          <span className="text-neutral-950 text-3xl font-medium font-text">
            {value}
          </span>
        </div>
      </Suspense>
      <Suspense fallback={<Skeleton className="w-30 h-4" />}>
        <div>
          <span
            className={`text-xs font-semibold font-text ${trendDirection === "down" ? "text-red-500" : trendDirection === "up" ? "text-emerald-600" : "text-gray-500"}`}
          >
            {trend}
          </span>
        </div>
      </Suspense>
    </div>
  );
};
