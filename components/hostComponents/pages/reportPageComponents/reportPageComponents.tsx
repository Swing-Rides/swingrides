"use client";

import { useMemo, useState, Dispatch, SetStateAction } from "react";
import PageWrapper from "../../dashboard/pageWrapper";
import { DollarSign, FileText, Star, TrendingUp } from "lucide-react";
import {
  BookingsDonutChart,
  ExpensesCategoryChart,
  RevenueBookingChart,
} from "../../dashboard/dynamicImport";

import { useGetAnalyticsDashboardQuery } from "@/app/store/services/analyticsApi";
import { OverviewCard } from "./reportOverviewCard";
import {
  VehiclePeformanceTable,
  VehiclePeformanceRow,
} from "./vehiclePerformanceTable";
import {
  DATE_RANGE_BY_DURATION,
  STATUS_COLORS,
  formatNaira,
  toTitleCase,
} from "./reportHelpers";
import ReportLoading from "./reportLoading";
import ReportErrorState from "./reportErrorState";
import EmptyReportState from "./emptyReportState";

export default function ReportPageComponents() {
  // useGetAnalyticsDashboardQuery only exposes `data` (and the standard
  // RTK Query `error` field) — no isLoading/isError/refetch. Loading and
  // error are derived below from data/error directly, and retries are done
  // by remounting the query-consuming subtree: bumping this key forces
  // ReportPageContent (and its useGetAnalyticsDashboardQuery call) to
  // re-run from scratch.
  const [retryKey, setRetryKey] = useState(0);
  const [filterDuration, setFilterDuration] = useState("6m");

  return (
    <ReportPageContent
      key={retryKey}
      filterDuration={filterDuration}
      setFilterDuration={setFilterDuration}
      onRetry={() => setRetryKey((k) => k + 1)}
    />
  );
}

type ReportPageContentProps = {
  filterDuration: string;
  setFilterDuration: Dispatch<SetStateAction<string>>;
  onRetry: () => void;
};

function ReportPageContent({
  filterDuration,
  setFilterDuration,
  onRetry,
}: ReportPageContentProps) {
  const dateRange = DATE_RANGE_BY_DURATION[filterDuration] ?? "6Months";

  const { data: dashboard, error } = useGetAnalyticsDashboardQuery({
    dateRange,
    aggregationLevel: "monthly",
  });

  const isLoading = dashboard === undefined && !error;
  const isError = !!error;

  const overviewCards = useMemo(() => {
    if (!dashboard?.success) {
      return [
        {
          icon: <DollarSign className="size-4 md:size-6 text-green-500" />,
          iconBg: "bg-green-100",
          trendPositive: true,
          trendPercentage: "+12.5%",
          label: "Total Revenue",
          number: "$0",
        },
        {
          icon: <TrendingUp className="size-4 md:size-6 text-blue-700" />,
          iconBg: "bg-blue-100",
          trendPositive: true,
          trendPercentage: "+8.3%",
          label: "Net Profit",
          number: "$0",
        },
        {
          icon: <FileText className="size-4 md:size-6 text-cyan-600" />,
          iconBg: "bg-cyan-100",
          trendPositive: true,
          trendPercentage: "+15.2%",
          label: "Total Bookings",
          number: "0",
        },
        {
          icon: (
            <Star className="size-4 md:size-6 stroke-amber-500 fill-transparent" />
          ),
          iconBg: "bg-amber-100",
          trendPositive: true,
          trendPercentage: "+0.2",
          label: "Average Star Rating",
          number: "0",
        },
      ];
    }

    const { kpis } = dashboard.data;

    return [
      {
        icon: <DollarSign className="size-4 md:size-6 text-green-500" />,
        iconBg: "bg-green-100",
        trendPositive: kpis.totalRevenue.trendDirection === "up",
        trendPercentage: kpis.totalRevenue.trend,
        label: kpis.totalRevenue.label,
        number: kpis.totalRevenue.value,
      },
      {
        icon: <TrendingUp className="size-4 md:size-6 text-blue-700" />,
        iconBg: "bg-blue-100",
        trendPositive: kpis.netProfit.trendDirection === "up",
        trendPercentage: kpis.netProfit.trend,
        label: kpis.netProfit.label,
        number: kpis.netProfit.value,
      },
      {
        icon: <FileText className="size-4 md:size-6 text-cyan-600" />,
        iconBg: "bg-cyan-100",
        trendPositive: kpis.totalBookings.trendDirection === "up",
        trendPercentage: kpis.totalBookings.trend,
        label: kpis.totalBookings.label,
        number: kpis.totalBookings.value,
      },
      {
        icon: (
          <Star className="size-4 md:size-6 stroke-amber-500 fill-transparent" />
        ),
        iconBg: "bg-amber-100",
        trendPositive: kpis.averageRating.trendDirection === "up",
        trendPercentage: kpis.averageRating.trend,
        label: kpis.averageRating.label,
        number: kpis.averageRating.value,
      },
    ];
  }, [dashboard]);

  const revenueBookingData = useMemo(() => {
    const trends = dashboard?.data.revenueTrends;
    if (!trends?.length) {
      return [];
    }

    return trends.map((item) => ({
      type: item.month.toLowerCase(),
      revenue: item.revenue,
      bookings: item.bookings,
    }));
  }, [dashboard]);

  const bookingDonutData = useMemo(() => {
    const statusBreakdown = dashboard?.data.bookingStatus;
    if (!statusBreakdown?.length) {
      return [];
    }

    return statusBreakdown.map((item) => ({
      bookingStatus: toTitleCase(item.status),
      bookingCount: item.count,
      color: item.color || STATUS_COLORS[item.status] || "#1A56DB",
    }));
  }, [dashboard]);

  const expenseCategoryData = useMemo(() => {
    const categories = dashboard?.data.expenseBreakdown;
    if (!categories?.length) {
      return [];
    }

    return categories.map((item) => ({
      name: item.category,
      value: item.amount,
    }));
  }, [dashboard]);

  const vehiclePerformanceData: VehiclePeformanceRow[] = useMemo(() => {
    const vehicles = dashboard?.data.vehiclePerformance;
    if (!vehicles?.length) {
      return [];
    }

    return vehicles.map((vehicle, index) => ({
      id: vehicle.vehicleId || `VP-${String(index + 1).padStart(3, "0")}`,
      vehicleName: vehicle.vehicleName,
      trips: vehicle.trips,
      revenue: formatNaira(vehicle.revenue),
      averageRentalDays: vehicle.averageRentalDays,
      lastRentalDate: vehicle.lastRentalDate,
      totalMilageDriven: vehicle.totalMileageDriven,
    }));
  }, [dashboard]);

  const isInitialLoading = isLoading;
  const hasNoData: boolean =
    !isInitialLoading &&
    !isError &&
    revenueBookingData.length === 0 &&
    bookingDonutData.length === 0 &&
    expenseCategoryData.length === 0 &&
    vehiclePerformanceData.length === 0;

  const renderBody = () => {
    if (isInitialLoading) {
      return <ReportLoading />;
    }

    if (isError) {
      return <ReportErrorState onRetry={onRetry} />;
    }

    if (hasNoData) {
      return <EmptyReportState />;
    }

    return (
      <div className="mt-4 md:mt-8 space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          {overviewCards.map((card) => (
            <OverviewCard
              key={card.label}
              icon={card.icon}
              iconBg={card.iconBg}
              trendPositive={card.trendPositive}
              trendPercentage={card.trendPercentage}
              label={card.label}
              number={card.number}
            />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 overflow-clip">
            <RevenueBookingChart data={revenueBookingData} />
          </div>
          <div className="col-span-1 overflow-clip">
            <BookingsDonutChart chartData={bookingDonutData} />
          </div>
        </div>
        <ExpensesCategoryChart data={expenseCategoryData} />
        <VehiclePeformanceTable tableData={vehiclePerformanceData} />
      </div>
    );
  };

  return (
    <PageWrapper
      pageTitle="Reports & Analytics"
      pageDescription="Track financial performance, bookings, and vehicle insights"
      pageButton={
        <PageButtons
          filterDuration={filterDuration}
          setFilterDuration={setFilterDuration}
        />
      }
    >
      {renderBody()}
    </PageWrapper>
  );
}

type PageButtonsProps = {
  filterDuration: string;
  setFilterDuration: Dispatch<SetStateAction<string>>;
};

const PageButtons = ({
  filterDuration,
  setFilterDuration,
}: PageButtonsProps) => {
  return (
    <div>
      <PageTabButtons
        filterDuration={filterDuration}
        setFilterDuration={setFilterDuration}
      />
    </div>
  );
};

const PageTabButtons = ({
  filterDuration,
  setFilterDuration,
}: PageButtonsProps) => {
  const durations = [
    {
      label: "3 months",
      value: "3m",
    },
    {
      label: "6 months",
      value: "6m",
    },
    {
      label: "1 Year",
      value: "1y",
    },
  ];

  return (
    <div className="bg-white p-1 rounded-xs flex gap-2">
      {durations.map((item) => {
        const isActive = filterDuration === item.value;

        return (
          <button
            key={item.value}
            onClick={() => setFilterDuration(item.value)}
            className={`py-2 px-4 rounded-xs transition-colors duration-300 cursor-pointer ${isActive
                ? "bg-blue-700 text-white hover:bg-blue-900"
                : "bg-transparent text-gray-700 hover:bg-gray-200"
              }`}
            aria-pressed={isActive}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};