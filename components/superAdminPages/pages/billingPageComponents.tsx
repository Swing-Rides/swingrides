import { ReactNode, Suspense } from "react";
import {
  AlertCircle,
  CalendarRange,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";
import PageWrapper from "../dashboard/pageWrapper";
import { SalesChart, RevenueByPlanChart } from "../dashboard/dynamicImport";
import { CardIntro } from "../dashboard/cardIntro";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminBillingResponseData } from "@/types/admin.type";

type OverviewCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down" | "flat";
};

type BillingPageComponentsProps = {
  billing?: AdminBillingResponseData;
  isLoading?: boolean;
  isError?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
};

const CARD_ICON_MAP: Record<string, ReactNode> = {
  mrr: <CircleDollarSign className="size-5 text-emerald-600" />,
  arr: <TrendingUp className="size-5 text-blue-700" />,
  failed_payments: <AlertCircle className="size-5 text-red-500" />,
  churn_mtd: <CalendarRange className="size-5 text-amber-500" />,
};

export default function BillingPageComponents({
  billing,
  isLoading = false,
  isError = false,
  loadingMessage = "Loading billing...",
  errorMessage = "Failed to load billing dashboard.",
}: BillingPageComponentsProps) {
  if (isLoading) {
    return <div className="p-6 text-sm text-gray-500">{loadingMessage}</div>;
  }

  if (isError || !billing) {
    return <div className="p-6 text-sm text-red-600">{errorMessage}</div>;
  }

  const graphData = {
    data: billing.charts.mrrTrend.data.map((point) => ({
      month: point.month,
      sales: point.value,
    })),
    series: [{ name: "sales", color: "#1A56DB" }],
  };

  return (
    <PageWrapper
      pageTitle="Billing"
      pageDescription="Platform-wide subscription revenue and payment activity"
    >
      <div>
        <div className="flex flex-wrap gap-4 mt-8">
          {billing.summaryCards.map((card) => (
            <OverviewCard
              key={card.key}
              icon={
                CARD_ICON_MAP[card.key] ?? (
                  <CircleDollarSign className="size-5 text-blue-700" />
                )
              }
              title={card.label}
              value={card.formattedValue}
              trend={card.trend}
              trendDirection={card.trendDirection}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-4 my-4">
          <div className="basis-183 grow p-3 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-6">
            <SalesChart graphData={graphData} />
          </div>
          <div className="basis-95 grow md:grow-0 p-3 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-6">
            <div className="flex flex-col gap-3 md:gap-6">
              <CardIntro
                title="Revenue by Plan"
                desc="Monthly revenue breakdown by subscription tier"
              />
              <RevenueByPlanChart chartData={billing.charts.revenueByPlan} />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
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
