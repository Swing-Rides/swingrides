"use client";

import {
  Calendar,
  Car,
  Clock,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Wrench,
} from "lucide-react";
import PageWrapper from "../../dashboard/pageWrapper";
import { ReactNode } from "react";
import RevenueChart, { FilterType } from "../../charts/revenueChart";
import {
  sampleBookingDonutData,
  sampleRevenueGraphData,
} from "@/constants/saleschartdata";
import { BookingsDonutChart } from "../../dashboard/dynamicImport";
import { Separator } from "@/components/ui/separator";
import RecentBookingsTable from "./recentBookingsTable";

export default function DashboardPageComponent() {
  const handleFilterChange = (filter: FilterType) => {
    // swap sampleMrrData for a real fetch/SWR call keyed by filter
    console.log("Fetch data for window:", filter);
  };

  return (
    <PageWrapper
      pageTitle="Good Morning, Metro Rentals! 👋"
      pageDescription="Here's what's happening with your fleet today."
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 mt-8">
          <DashboardOverviewCard
            icon={<Car className="size-6 text-blue-700" />}
            iconBgColor="bg-indigo-50"
            title="Total Vehicles"
            number={59}
            trend={true}
            trendText="+12% from last month"
          />
          <DashboardOverviewCard
            icon={<Calendar className="size-6 text-blue-700" />}
            iconBgColor="bg-indigo-50"
            title="Active Rentals"
            number={42}
            trend={false}
            trendText="71% utilization rate"
          />
          <DashboardOverviewCard
            icon={<DollarSign className="size-6 text-emerald-500" />}
            iconBgColor="bg-emerald-100"
            title="Monthly Revenue"
            number={"$24,500"}
            trend={true}
            trendText="+24% from last month"
          />
          <DashboardOverviewCard
            icon={<Clock className="size-6 text-amber-500" />}
            iconBgColor="bg-amber-100"
            title="Pending Bookings"
            number={18}
            trend={false}
            trendText="Requires approval"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 p-4 md:p-6 bg-white rounded-md border border-gray-200">
            <RevenueChart
              graphData={sampleRevenueGraphData}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="col-span-1">
            <BookingsDonutChart chartData={sampleBookingDonutData} />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2 p-4 md:p-6 space-y-4 bg-white rounded-md border border-gray-200 overflow-hidden">
            <RecentBookingsTable />
          </div>
          <div className="md:col-span-1 p-4 md:p-6 bg-white rounded-md border border-gray-200 items">
            <div className="flex flex-col gap-4">
              <h3 className="text-neutral-950 text-base font-semibold font-text">
                Fleet Status
              </h3>
              <div className="flex flex-col gap-3">
                <FleetDataList
                  icon={<Car className="size-4 text-emerald-500" />}
                  iconBg={"bg-green-100"}
                  label={"Available"}
                  number={12}
                />
                <FleetDataList
                  icon={<Calendar className="size-4 text-blue-700" />}
                  iconBg={"bg-indigo-50"}
                  label={"Available"}
                  number={42}
                />
                <FleetDataList
                  icon={<Wrench className="size-4 text-amber-500" />}
                  iconBg={"bg-amber-100"}
                  label={"Available"}
                  number={3}
                />
                <FleetDataList
                  icon={<Clock className="size-4 text-gray-500" />}
                  iconBg={"bg-gray-100"}
                  label={"Inactive"}
                  number={2}
                />
              </div>
              <Separator />
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-800 text-xs font-normal font-text">
                    Total Fleet
                  </span>
                  <span className="text-neutral-950 text-xs font-medium font-text">
                    {"59"} vehicles
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

type DashboardOverviewCardProps = {
  icon: ReactNode;
  iconBgColor?: string;
  title: string;
  number: string | number;
  trend: boolean;
  trendText: string;
};

const DashboardOverviewCard = ({
  icon,
  iconBgColor,
  title,
  number,
  trend,
  trendText,
}: DashboardOverviewCardProps) => {
  return (
    <div className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
      <div
        className={`size-12 rounded-[10px] flex justify-center items-center overflow-clip ${iconBgColor ? iconBgColor : "bg-indigo-50"}`}
      >
        {icon}
      </div>
      <div>
        <span className="text-gray-500 text-xs font-semibold font-text uppercase">
          {title}
        </span>
      </div>
      <div>
        <span className="text-neutral-950 text-3xl font-medium font-text">
          {number}
        </span>
      </div>
      <div>
        <div className="flex items-center gap-0.5">
          {trend ? (
            <TrendingUp className="text-emerald-500 size-4" />
          ) : (
            <TrendingDown className="text-red-500 size-4" />
          )}
          <span
            className={`text-xs font-semibold font-text ${trend ? "text-emerald-500" : "text-red-500"}`}
          >
            {trendText}
          </span>
        </div>
      </div>
    </div>
  );
};

type FleetDataListProps = {
  icon: ReactNode;
  iconBg: string;
  label: string;
  number: number;
};

const FleetDataList = ({
  icon,
  iconBg = "bg-green-100",
  label,
  number,
}: FleetDataListProps) => {
  return (
    <div className="flex itmes-center justify-between">
      <div className="flex items-center justify-start gap-2">
        <div
          className={`size-8 ${iconBg} rounded-[10px] flex justify-center items-center`}
        >
          {icon}
        </div>
        <span className="block text-zinc-800 text-sm font-normal font-text">
          {label}
        </span>
      </div>
      <div>
        <span className="text-right text-neutral-950 text-base font-medium font-text">
          {number}
        </span>
      </div>
    </div>
  );
};
