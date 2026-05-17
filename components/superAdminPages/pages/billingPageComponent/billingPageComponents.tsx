"use client";

import { ReactNode, Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useGetAdminBillingQuery } from "@/app/store/services/adminApi";
import PageWrapper from "../../dashboard/pageWrapper";
import { SalesChart, RevenueByPlanChart } from "../../dashboard/dynamicImport";
import { CardIntro } from "../../dashboard/cardIntro";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumberToUSD } from "../../utils/formatNumbertoUSD";
import { calcPercentageDiff } from "../../utils/chart";
import {
  exportAllPaymentsToCSV,
  exportAllChangeHistoryToCSV,
} from "../../utils/exportToCSV";
import { SubscriptionBillingStatusPill } from "../../dashboard/statusPill";
import type { SubscriberBillingStatus } from "@/types/subscribers.type";
import type { AdminBillingResponseData } from "@/types/admin.type";
import {
  CalendarArrowDown,
  CalendarArrowUp,
  ChevronLeft,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  Download,
  RotateCw,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


type OverviewCardProps = {
  icon: ReactNode;
  title: string;
  presentDayNumber: number;
  last30Days: number;
  formatValue?: (n: number) => string;
  invertColors?: boolean;
};

type PaymentRow = AdminBillingResponseData["payments"]["rows"][number];
type PlanChangeRow = AdminBillingResponseData["planChanges"]["rows"][number];

type SortDir = "asc" | "desc" | null;

const ROWS_PER_PAGE = 8;

export default function BillingPageComponents() {
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");
  const activeTab = tabParam === "plan_changes" ? "plan_changes" : "payments";
  const search = searchParams.get("search") ?? "";

  const parsedPage = Number(searchParams.get("page") ?? 1);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const parsedLimit = Number(searchParams.get("limit") ?? ROWS_PER_PAGE);
  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0
      ? parsedLimit
      : ROWS_PER_PAGE;

  const {
    data: response,
    isLoading,
    isError,
  } = useGetAdminBillingQuery({
    tab: activeTab,
    search: search || undefined,
    page,
    limit,
  });

  if (isLoading) {
    return (
      <PageWrapper
        pageTitle="Billing"
        pageDescription="Platform-wide subscription revenue and payment activity"
      >
        <div className="p-6 text-sm text-gray-500">Loading billing data...</div>
      </PageWrapper>
    );
  }

  if (isError || !response?.data) {
    return (
      <PageWrapper
        pageTitle="Billing"
        pageDescription="Platform-wide subscription revenue and payment activity"
      >
        <div className="p-6 text-sm text-red-600">
          Unable to load billing data right now.
        </div>
      </PageWrapper>
    );
  }

  const data = response.data;
  const { summaryCards, charts, payments, planChanges } = data;

  // Map summary cards by key for easy access
  const cardMap = Object.fromEntries(summaryCards.map((c) => [c.key, c]));

  const mrrTrendData = {
    data: charts.mrrTrend.data.map((d) => ({ sales: d.value, month: d.month })),
    series: [{ name: "sales", color: "#1A56DB" }],
  };

  return (
    <PageWrapper
      pageTitle="Billing"
      pageDescription="Platform-wide subscription revenue and payment activity"
    >
      <div className="flex flex-col gap-4">
        {/* Summary cards */}
        <div className="flex flex-wrap gap-4 mt-8">
          <OverviewCard
            icon={cardMap.mrr?.icon}
            title={cardMap.mrr?.label ?? "Monthly Recurring Revenue"}
            presentDayNumber={cardMap.mrr?.value ?? 0}
            last30Days={0}
            formatValue={formatNumberToUSD}
          />
          <OverviewCard
            icon={cardMap.arr?.icon}
            title={cardMap.arr?.label ?? "Annual Recurring Revenue"}
            presentDayNumber={cardMap.arr?.value ?? 0}
            last30Days={0}
            formatValue={formatNumberToUSD}
          />
          <OverviewCard
            icon={cardMap.failed_payments?.icon}
            title={cardMap.failed_payments?.label ?? "Failed Payments"}
            presentDayNumber={cardMap.failed_payments?.value ?? 0}
            last30Days={0}
            invertColors
          />
          <OverviewCard
            icon={cardMap.churn_mtd?.icon}
            title={cardMap.churn_mtd?.label ?? "Churn Rate MTD"}
            presentDayNumber={cardMap.churn_mtd?.value ?? 0}
            last30Days={0}
            formatValue={(n) => `${n.toFixed(2)}%`}
            invertColors
          />
        </div>

        {/* Charts */}
        <div className="flex flex-wrap gap-4">
          <div className="basis-183 grow p-3 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-6">
            <SalesChart graphData={mrrTrendData} />
          </div>
          <div className="basis-95 grow md:grow-0 p-3 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-6">
            <CardIntro
              title="Revenue by Plan"
              desc="Monthly revenue breakdown by subscription tier"
            />
            {/* <RevenueByPlanChart chartData={} /> */}
          </div>
        </div>

        {/* Tables */}
        <Suspense>
          <BillingTableSection
            payments={payments.rows}
            planChanges={planChanges.rows}
            paymentsPagination={payments.pagination}
            planChangesPagination={planChanges.pagination}
          />
        </Suspense>
      </div>
    </PageWrapper>
  );
}

// ─── Table section (needs Suspense boundary for useSearchParams) ──────────────

function BillingTableSection({
  payments,
  planChanges,
  paymentsPagination,
  planChangesPagination,
}: {
  payments: PaymentRow[];
  planChanges: PlanChangeRow[];
  paymentsPagination: AdminBillingResponseData["payments"]["pagination"];
  planChangesPagination: AdminBillingResponseData["planChanges"]["pagination"];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") ?? "payments";

  const handleTabChange = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      // Reset pagination when switching tabs
      params.delete("payment_page");
      params.delete("changes_page");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="px-4 pt-4">
          <TabsList variant="line">
            <TabsTrigger value="payments">All Payments</TabsTrigger>
            <TabsTrigger value="plan_changes">
              Upgrade / Downgrade History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="payments">
          <Suspense>
            <AllPaymentTable rows={payments} pagination={paymentsPagination} />
          </Suspense>
        </TabsContent>

        <TabsContent value="plan_changes">
          <Suspense>
            <PlanChangesTable
              rows={planChanges}
              pagination={planChangesPagination}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── All Payments table ───────────────────────────────────────────────────────

function AllPaymentTable({
  rows,
  pagination,
}: {
  rows: PaymentRow[];
  pagination: AdminBillingResponseData["payments"]["pagination"];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const parsedPage = Number(searchParams.get("page") ?? pagination.page ?? 1);
  const page =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? parsedPage
      : (pagination.page ?? 1);
  const parsedLimit = Number(
    searchParams.get("limit") ?? pagination.limit ?? ROWS_PER_PAGE,
  );
  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0
      ? parsedLimit
      : (pagination.limit ?? ROWS_PER_PAGE);

  // Sorting
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const toggleSort = () =>
    setSortDir((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc",
    );

  const setPage = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(p));
      params.set("limit", String(limit));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, limit],
  );

  const setSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      params.set("limit", String(limit));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, limit],
  );

  const sortedRows = useMemo(() => {
    let result = rows;
    if (sortDir) {
      result = [...result].sort((a, b) => {
        const da = new Date(a.billingDate).getTime();
        const db = new Date(b.billingDate).getTime();
        return sortDir === "asc" ? da - db : db - da;
      });
    }

    return result;
  }, [rows, sortDir]);

  const totalPages = Math.max(1, pagination.totalPages || 1);

  const paginationLabel =
    pagination.total === 0
      ? "0 results"
      : `${(page - 1) * limit + 1}–${Math.min(page * limit, pagination.total)} of ${pagination.total}`;

  return (
    <div className="p-4 md:p-6 flex flex-col gap-4.5">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex items-center flex-1 min-w-48 max-w-xl">
          <Search className="absolute left-3 size-4 text-gray-400 pointer-events-none shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organization, email or ID..."
            className={[
              "w-full pl-9 pr-4 py-2 rounded-lg",
              "bg-gray-50 border border-gray-300",
              "text-xs text-[#0B0B0B]/50 placeholder:text-gray-400 font-text",
              "outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              "transition-all duration-200",
            ].join(" ")}
          />
        </div>

        <button
          onClick={() => exportAllPaymentsToCSV(sortedRows)}
          className="flex flex-nowrap text-nowrap gap-2 items-center px-3 py-2 rounded-[10px] border border-blue-700 cursor-pointer hover:bg-blue-900 duration-300 transition-colors group"
        >
          <span className="text-blue-700 text-sm font-medium font-text leading-5 group-hover:text-blue-200 duration-300 transition-colors">
            Export CSV
          </span>
          <Download className="size-4 text-blue-700 group-hover:text-blue-200 duration-300 transition-colors" />
        </button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-56 text-gray-500 text-xs font-semibold font-text uppercase leading-4">
              Organisation
            </TableHead>
            <TableHead className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
              Plan
            </TableHead>
            <TableHead className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
              Amount
            </TableHead>
            <TableHead className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
              <button
                onClick={toggleSort}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                Billing Date
                <CalendarArrowDown
                  className={`size-3 transition-colors ${sortDir === "asc" ? "text-blue-600" : "text-gray-400"}`}
                />
                <CalendarArrowUp
                  className={`size-3 transition-colors ${sortDir === "desc" ? "text-blue-600" : "text-gray-400"}`}
                />
              </button>
            </TableHead>
            <TableHead className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
              Payment Method
            </TableHead>
            <TableHead className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
              Status
            </TableHead>
            <TableHead className="w-20 text-gray-500 text-xs font-semibold font-text uppercase leading-4">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-16 text-gray-400 text-sm"
              >
                No payments match your filters.
              </TableCell>
            </TableRow>
          ) : (
            sortedRows.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-neutral-950 text-sm font-medium font-text leading-5">
                      {item.organization}
                    </span>
                    <span className="text-gray-500 text-xs font-normal font-text leading-5">
                      {item.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex text-blue-700 text-xs font-semibold font-text uppercase leading-4 px-2.5 py-1 bg-indigo-50 rounded-full">
                    {item.plan}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-neutral-950 text-sm font-medium font-text leading-5">
                    {item.amountFormatted}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-500 text-sm font-normal font-text leading-5">
                    {new Date(item.billingDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-500 text-sm font-normal font-text leading-5">
                    {item.paymentMethod}
                  </span>
                </TableCell>
                <TableCell>
                  <SubscriptionBillingStatusPill
                    status={
                      item.status.toLowerCase() as SubscriberBillingStatus
                    }
                  />
                </TableCell>
                <TableCell>
                  <PaymentActions actions={item.actions} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PaginationBar
        page={page}
        totalPages={totalPages}
        limit={limit}
        label={paginationLabel}
        onPageChange={setPage}
      />
    </div>
  );
}

// ─── Plan Changes table ───────────────────────────────────────────────────────

function PlanChangesTable({
  rows,
  pagination,
}: {
  rows: PlanChangeRow[];
  pagination: AdminBillingResponseData["planChanges"]["pagination"];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const parsedPage = Number(searchParams.get("page") ?? pagination.page ?? 1);
  const page =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? parsedPage
      : (pagination.page ?? 1);
  const parsedLimit = Number(
    searchParams.get("limit") ?? pagination.limit ?? ROWS_PER_PAGE,
  );
  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0
      ? parsedLimit
      : (pagination.limit ?? ROWS_PER_PAGE);

  const setPage = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(p));
      params.set("limit", String(limit));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, limit],
  );

  const setSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      params.set("limit", String(limit));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, limit],
  );

  const totalPages = Math.max(1, pagination.totalPages || 1);

  const paginationLabel =
    pagination.total === 0
      ? "0 results"
      : `${(page - 1) * limit + 1}–${Math.min(page * limit, pagination.total)} of ${pagination.total}`;

  return (
    <div className="p-4 md:p-6 flex flex-col gap-4.5">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex items-center flex-1 min-w-48 max-w-xl">
          <Search className="absolute left-3 size-4 text-gray-400 pointer-events-none shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organization..."
            className={[
              "w-full pl-9 pr-4 py-2 rounded-lg",
              "bg-gray-50 border border-gray-300",
              "text-xs text-[#0B0B0B]/50 placeholder:text-gray-400 font-text",
              "outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              "transition-all duration-200",
            ].join(" ")}
          />
        </div>
        <button
          onClick={() => exportAllChangeHistoryToCSV(rows)}
          className="flex flex-nowrap text-nowrap gap-2 items-center px-3 py-2 rounded-[10px] border border-blue-700 cursor-pointer hover:bg-blue-900 duration-300 transition-colors group"
        >
          <span className="text-blue-700 text-sm font-medium font-text leading-5 group-hover:text-blue-200 duration-300 transition-colors">
            Export CSV
          </span>
          <Download className="size-4 text-blue-700 group-hover:text-blue-200 duration-300 transition-colors" />
        </button>
      </div>

      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-56 text-gray-500 text-xs font-semibold font-text uppercase leading-4">
              Organisation
            </TableHead>
            <TableHead className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
              Changed From
            </TableHead>
            <TableHead className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
              Changed To
            </TableHead>
            <TableHead className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
              Change Type
            </TableHead>
            <TableHead className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
              Date
            </TableHead>
            <TableHead className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
              Actioned By
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-16 text-gray-400 text-sm"
              >
                No plan changes found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span className="text-neutral-950 text-sm font-medium font-text leading-5">
                    {item.name}
                  </span>
                </TableCell>
                <TableCell>
                  <PlanBadge plan={item.changedFrom} />
                </TableCell>
                <TableCell>
                  <PlanBadge plan={item.changedTo} />
                </TableCell>
                <TableCell>
                  <ChangeTypeCell
                    changeType={item.changeType as "upgrade" | "downgrade"}
                  />
                </TableCell>
                <TableCell>
                  <span className="text-gray-500 text-sm font-normal font-text leading-5">
                    {item.date}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-500 text-sm font-normal font-text leading-5">
                    {item.actionedBy}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PaginationBar
        page={page}
        totalPages={totalPages}
        limit={limit}
        label={paginationLabel}
        onPageChange={setPage}
      />
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function PaginationBar({
  page,
  totalPages,
  limit,
  label,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  limit: number;
  label: string;
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-sm font-normal font-text">
          Rows per page:
        </span>
        <span className="px-2.5 py-1 rounded-lg border border-gray-200 text-sm text-neutral-800">
          {limit}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{label}</span>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="size-4 text-gray-600" />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="size-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

function PaymentActions({ actions }: { actions: PaymentRow["actions"] }) {
  return (
    <div className="flex items-center gap-3">
      {actions.canDownloadInvoice && (
        <button
          title="Download Invoice"
          className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
        >
          <Download className="size-4" />
        </button>
      )}
      {actions.canRetry && (
        <button
          title="Retry Payment"
          className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
        >
          <RotateCw className="size-4" />
        </button>
      )}
      {!actions.canDownloadInvoice && !actions.canRetry && (
        <span className="text-gray-300 text-xs">—</span>
      )}
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span className="inline-flex text-blue-700 text-xs font-semibold font-text uppercase leading-4 px-2.5 py-1 bg-indigo-50 rounded-full">
      {plan}
    </span>
  );
}

function ChangeTypeCell({
  changeType,
}: {
  changeType: "upgrade" | "downgrade";
}) {
  const isUpgrade = changeType.toLowerCase() === "upgrade";
  return (
    <span
      className={`flex items-center gap-1.5 text-sm font-medium font-text leading-5 capitalize ${isUpgrade ? "text-emerald-500" : "text-red-500"}`}
    >
      {isUpgrade ? (
        <CircleArrowUp className="size-3.5 shrink-0" />
      ) : (
        <CircleArrowDown className="size-3.5 shrink-0" />
      )}
      {changeType}
    </span>
  );
}

// ─── Overview card ────────────────────────────────────────────────────────────

const OverviewCard = ({
  icon,
  title,
  presentDayNumber,
  last30Days,
  formatValue,
  invertColors = false,
}: OverviewCardProps) => {
  const { percentage, colorClass } = calcPercentageDiff(
    presentDayNumber,
    last30Days,
    { invertColors },
  );
  const displayValue = formatValue
    ? formatValue(presentDayNumber)
    : presentDayNumber.toLocaleString();

  return (
    <div className="basis-62.5 shrink-0 grow p-6 bg-white hover:bg-blue-100 hover:border-blue-200 transition-colors duration-300 rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
      {icon && <div>{icon}</div>}
      <span className="text-gray-500 text-xs font-semibold font-text uppercase">
        {title}
      </span>
      <Suspense fallback={<Skeleton className="w-20 h-10" />}>
        <span className="text-neutral-950 text-3xl font-medium font-text">
          {displayValue}
        </span>
      </Suspense>
      <Suspense fallback={<Skeleton className="w-30 h-4" />}>
        <span className={`text-xs font-semibold font-text ${colorClass}`}>
          {percentage} vs last month
        </span>
      </Suspense>
    </div>
  );
};
