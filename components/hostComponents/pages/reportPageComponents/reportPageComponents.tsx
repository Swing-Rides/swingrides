"use client";

import { useMemo, useState, Dispatch, SetStateAction, ReactNode } from "react";
import PageWrapper from "../../dashboard/pageWrapper";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Download,
  FileText,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  BookingsDonutChart,
  ExpensesCategoryChart,
  RevenueBookingChart,
} from "../../dashboard/dynamicImport";

import {
  DateRange,
  useGetAnalyticsDashboardQuery,
} from "@/app/store/services/analyticsApi";
import {
  ColumnDef,
  DataTable,
  exportToCSV,
  TableToolbar,
  useTableRows,
} from "../../dashboard/customTable";

const DATE_RANGE_BY_DURATION: Record<string, DateRange> = {
  "3m": "3Months",
  "6m": "6Months",
  "1y": "1Year",
};

const formatNaira = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const toTitleCase = (value: string) =>
  value.length === 0 ? value : `${value[0].toUpperCase()}${value.slice(1)}`;

const STATUS_COLORS: Record<string, string> = {
  active: "#1A56DB",
  pending: "#F59E0B",
  completed: "#10B981",
  cancelled: "#EF4444",
};

export default function ReportPageComponents() {
  const [filterDuration, setFilterDuration] = useState("6m");
  const dateRange = DATE_RANGE_BY_DURATION[filterDuration] ?? "6Months";

  const { data: dashboard } = useGetAnalyticsDashboardQuery({
    dateRange,
    aggregationLevel: "monthly",
  });

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

  const vehiclePerformanceData = useMemo(() => {
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
            className={`py-2 px-4 rounded-xs transition-colors duration-300 cursor-pointer ${
              isActive
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

type OverviewCardProps = {
  iconBg: string;
  icon: ReactNode;
  trendPositive: boolean;
  trendPercentage: string;
  label: string;
  number: string;
};

const OverviewCard = ({
  iconBg,
  icon,
  trendPositive,
  trendPercentage,
  label,
  number,
}: OverviewCardProps) => {
  return (
    <div className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2 space-y-2">
      <div className="flex justify-between items-center gap-2 w-full">
        <div
          className={`size-12 p-3 rounded-[10px] flex justify-center items-center ${iconBg}`}
        >
          {icon}
        </div>
        <div
          className={`flex gap-1 items-center justify-start py-1 px-2 rounded-sm ${trendPositive ? "text-emerald-500 bg-green-100" : "text-red-500 bg-rose-100"}`}
        >
          {trendPositive ? (
            <ArrowUpRight className="size-1 text-current" />
          ) : (
            <ArrowDownRight className="size-1 text-current" />
          )}
          <span className="text-xs text-current font-semibold font-text leading-4">
            {trendPercentage}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-start items-start">
        <h4 className="text-gray-500 text-xs font-semibold font-text uppercase">
          {label}
        </h4>
        <span className="text-neutral-950 text-lg md:text-3xl font-medium font-text">
          {number}
        </span>
      </div>
    </div>
  );
};

interface VehiclePeformanceRow {
  id: string;
  vehicleName: string;
  trips: number;
  revenue: string;
  averageRentalDays: number;
  lastRentalDate: string;
  totalMilageDriven: string;
}

const vehiclePeformanceColumns: ColumnDef<VehiclePeformanceRow>[] = [
  {
    key: "vehicleName",
    header: "Vehicle Name",
    cell: (row) => (
      <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
        {row.vehicleName}
      </span>
    ),
  },
  {
    key: "trips",
    header: "trips",
    cell: (row) => (
      <span className="text-neutral-950 text-sm font-normal font-text leading-5">
        {row.trips}
      </span>
    ),
  },
  {
    key: "revenue",
    header: "revenue",
    cell: (row) => (
      <span className="text-emerald-500 text-sm font-medium font-text leading-5">
        {row.revenue}
      </span>
    ),
  },
  {
    key: "averageRentalDays",
    header: "Avg Rental Days",
    cell: (row) => (
      <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
        {row.averageRentalDays}
      </span>
    ),
  },
  {
    key: "lastRentalDate",
    header: "Last Rental Date",
    cell: (row) => (
      <span className="text-neutral-950 text-sm font-normal font-text leading-5">
        {row.lastRentalDate}
      </span>
    ),
  },
  {
    key: "totalMilageDriven",
    header: "Total Mileage Driven",
    cell: (row) => (
      <span className="text-neutral-950 text-sm font-normal font-text leading-5">
        {row.totalMilageDriven}
      </span>
    ),
  },
];

const VehiclePeformanceTable = ({
  tableData,
}: {
  tableData: VehiclePeformanceRow[];
}) => {
  const data = tableData;

  const { rows, pagination } = useTableRows({
    tableId: "vehiclePeformance",
    data,
    rowsPerPage: 10,
    searchFields: ["vehicleName", "id"],
    sortField: "lastRentalDate",
  });

  return (
    <div className="bg-white p-3 md:p-6 rounded-[10px]">
      <h3 className="font-semibold text-base font-text mb-3">
        Vehicle Peformance
      </h3>
      <DataTable
        tableId="vehiclePeformance"
        columns={vehiclePeformanceColumns}
        rows={rows}
        pagination={pagination}
        emptyMessage="No patment history found."
        toolbar={
          <TableToolbar
            search={{ placeholder: "Search by vechile name or ID..." }}
            dateSort
            actions={
              <button
                onClick={() =>
                  exportToCSV(rows, {
                    filename: "VehiclePeformanceReport",
                    columns: [
                      "id",
                      "vehicleName",
                      "trips",
                      "revenue",
                      "averageRentalDays",
                      "lastRentalDate",
                      "totalMilageDriven",
                    ],
                  })
                }
                className="flex items-center gap-2 px-3 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 group duration-300 transition-colors cursor-pointer"
              >
                <span className="text-blue-700 text-sm font-medium font-text group-hover:text-blue-200 transition-colors">
                  Export CSV
                </span>
                <Download className="size-4 text-blue-700 group-hover:text-blue-200 transition-colors" />
              </button>
            }
          />
        }
      />
    </div>
  );
};
