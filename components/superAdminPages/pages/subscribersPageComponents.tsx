"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import PageWrapper from "../dashboard/pageWrapper";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Search,
  Trash,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/components/pages/profilePages/utils";
import { formatNumberToUSD } from "../utils/formatNumbertoUSD";
import { exportToCSV } from "../utils/exportToCSV";
import { plansItems, statusItems, STATUS_STYLE } from "../utils/helpers";
import {
  AdminSubscriberRow,
  AdminSubscribersPagination,
  SubscriberPlan,
  SubscriberStatus,
} from "@/types/subscribers.type";
import { formatDate } from "../utils/formatDate";
import { useGetAdminSubscribersQuery } from "@/app/store/services/adminApi";

type SelectUIProps = {
  title: string;
  items: { value: string; label: string }[];
  paramKey: string;
};

type OverviewCardProps = {
  label: string;
  textColor: string;
  number: number;
};

type DeleteDialogUIProps = {
  pendingDeleteId: string | null;
  setPendingDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
  pendingRow: AdminSubscriberRow | undefined;
  confirmDelete: () => void;
};

const ROWS_PER_PAGE = 10;

export default function SubscribersPageComponents() {
  const searchParams = useSearchParams();

  const statusFilter = (searchParams.get("status") ?? "") as
    | SubscriberStatus
    | "";
  const planFilter = (searchParams.get("plan") ?? "") as SubscriberPlan | "";
  const searchFilter = searchParams.get("search") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));

  const statusForApi =
    statusFilter === "past due" ? "past_due" : statusFilter || undefined;

  const { data, isLoading, isError } = useGetAdminSubscribersQuery({
    page,
    limit: ROWS_PER_PAGE,
    search: searchFilter || undefined,
    status: statusForApi as
      | "all"
      | "active"
      | "past_due"
      | "cancelled"
      | undefined,
    plan: (planFilter || undefined) as
      | "all"
      | "starter"
      | "professional"
      | "enterprise"
      | undefined,
  });

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-gray-500">Loading subscribers...</div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="p-6 text-sm text-red-600">
        Failed to load subscribers.
      </div>
    );
  }

  const { summary, rows, pagination } = data.data;

  return (
    <PageWrapper
      pageTitle="Subscribers"
      pageDescription="Manage all host organisations on the platform"
    >
      <div>
        {/* Overview cards — always visible, no loading needed */}
        <div className="flex flex-wrap gap-4 mt-8">
          <OverviewCard
            label="Total subscribers"
            number={summary.totalSubscribers}
            textColor="#1A56DB"
          />
          <OverviewCard
            label="Active"
            number={summary.activeSubscribers}
            textColor="#0891B2"
          />
          <OverviewCard
            label="Churned this month"
            number={summary.churnedThisMonth}
            textColor="#EF4444"
          />
        </div>

        <Suspense>
          <SubscribersTableSection dataRows={rows} pagination={pagination} />
        </Suspense>
      </div>
    </PageWrapper>
  );
}

// ─── Table section ────────────────────────────────────────────────────────────

function SubscribersTableSection({
  dataRows,
  pagination,
}: {
  dataRows: AdminSubscriberRow[];
  pagination: AdminSubscribersPagination;
}) {
  const [rows, setRows] = useState<AdminSubscriberRow[]>(dataRows);

  useEffect(() => {
    setRows(dataRows);
  }, [dataRows]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── Fake loading — swap for real isLoading from your data fetch ───────
  // const [isLoading, setIsLoading] = useState(true)

  // useEffect(() => {
  //         const timer = setTimeout(() => setIsLoading(false), FAKE_LOAD_MS)
  //         return () => clearTimeout(timer)   // cleanup on unmount
  // }, [])

  // ── URL param helper ──────────────────────────────────────────────────
  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      // reset page on filter change, but not when navigating pages
      if (key !== "page") params.delete("page");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const search = searchParams.get("search") ?? "";

  // ── Delete dialog state ───────────────────────────────────────────────
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const pendingRow = rows.find((r) => r.id === pendingDeleteId);

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    setRows((prev) => prev.filter((r) => r.id !== pendingDeleteId));
    setPendingDeleteId(null);
  };

  // ── Filters from URL ──────────────────────────────────────────────────
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  // ── Pagination ────────────────────────────────────────────────────────
  const totalPages = Math.max(1, pagination.totalPages);
  const goToPage = (p: number) => setParam("page", String(p));

  const paginationLabel =
    pagination.total === 0
      ? "0 results"
      : `${(page - 1) * ROWS_PER_PAGE + 1}-${Math.min(page * ROWS_PER_PAGE, pagination.total)} of ${pagination.total}`;

  return (
    <>
      {/* Toolbar */}
      <div className="p-4 my-4 md:mt-6 md:mb-8 bg-white rounded-[10px] border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex items-center w-full max-w-5xl">
            <Search className="absolute left-3 size-4 text-gray-400 pointer-events-none shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setParam("search", e.target.value)}
              placeholder="Search by name, email or ID..."
              className={[
                "w-full pl-9 pr-4 py-2 rounded-lg",
                "bg-gray-50 border border-gray-300",
                "text-xs text-[#0B0B0B]/50 placeholder:text-gray-400 font-text",
                "outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                "transition-all duration-200",
              ].join(" ")}
            />
          </div>

          <SelectUI title="All Status" items={statusItems} paramKey="status" />
          <SelectUI title="All Plans" items={plansItems} paramKey="plan" />

          <button
            onClick={() => exportToCSV(rows)}
            className="flex flex-nowrap text-nowrap gap-3.5 items-center px-3 py-2 rounded-[10px] border border-blue-700 cursor-pointer hover:bg-blue-900 duration-300 transition-colors group"
          >
            <span className="text-blue-700 text-sm font-medium font-text leading-5 group-hover:text-blue-200 duration-300 transition-colors">
              Export CSV
            </span>
            <Download className="size-4 text-blue-700 group-hover:text-blue-200 duration-300 transition-colors" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-56">Organisation</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Vehicles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Earnings</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="w-25">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Suspense fallback={<TableSkeletonRows />}>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-16 text-gray-400 text-sm"
                  >
                    No subscribers match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <TableUIOrganisation
                        organization={item.organization}
                        ownerEmail={item.ownerEmail}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="capitalize text-sm text-neutral-800">
                        {item.plan}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-800">
                        {item.vehicles}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-800">
                        {formatNumberToUSD(item.monthlyRevenue)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-800">
                        {formatDate(item.joinedDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <TableUIActionTab
                        slug={item.id}
                        onDelete={() => setPendingDeleteId(item.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </Suspense>
          </TableBody>
        </Table>

        {/* Pagination — outside <Table> so flex layout is respected */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm font-normal font-text">
              Rows per page:
            </span>
            <span className="px-2.5 py-1 rounded-lg border border-gray-200 text-sm text-neutral-800">
              {ROWS_PER_PAGE}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{paginationLabel}</span>
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="size-4 text-gray-600" />
            </button>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="size-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <DeleteDialogUI
        pendingDeleteId={pendingDeleteId}
        setPendingDeleteId={setPendingDeleteId}
        pendingRow={pendingRow}
        confirmDelete={confirmDelete}
      />
    </>
  );
}

// ─── Table skeleton ───────────────────────────────────────────────────────────

export function TableSkeletonRows() {
  return (
    <>
      {Array.from({ length: ROWS_PER_PAGE }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="flex gap-3 items-center">
              <Skeleton className="size-10 rounded shrink-0" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-10" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-28" />
          </TableCell>
          <TableCell>
            <div className="flex gap-5">
              <Skeleton className="size-4" />
              <Skeleton className="size-4" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

export const StatusBadge = ({ status }: { status: SubscriberStatus }) => {
  const normalizedStatus = status.toLowerCase() as SubscriberStatus;
  const { label, textColor, bgColor } = STATUS_STYLE[normalizedStatus];
  return (
    <span
      className="rounded-full px-2.5 py-1 text-xs font-medium font-text border"
      style={{
        color: textColor,
        backgroundColor: bgColor,
        borderColor: bgColor === "#FFFFFF" ? "#E5E7EB" : bgColor,
      }}
    >
      {label}
    </span>
  );
};

// ─── Overview card ────────────────────────────────────────────────────────────

export const OverviewCard = ({
  label,
  textColor,
  number,
}: OverviewCardProps) => (
  <div className="p-6 bg-white rounded-md border border-gray-200 flex flex-col gap-2 flex-1 basis-47.5 grow shrink-0">
    <span className="text-gray-500 text-xs font-semibold font-text uppercase">
      {label}
    </span>
    <span
      className="text-3xl font-medium font-text"
      style={{ color: textColor }}
    >
      {number}
    </span>
  </div>
);

// ─── Select UI ────────────────────────────────────────────────────────────────

export const SelectUI = ({ title, items, paramKey }: SelectUIProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const current = searchParams.get(paramKey) ?? "";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete(paramKey);
    else params.set(paramKey, value);
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select value={current || "all"} onValueChange={handleChange}>
      <SelectTrigger className="w-full max-w-32">
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{title}</SelectLabel>
          <SelectItem value="all">{title}</SelectItem>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

// ─── Organisation cell ────────────────────────────────────────────────────────

const TableUIOrganisation = ({
  organization,
  ownerEmail,
}: {
  organization: string;
  ownerEmail: string;
}) => {
  const initials = getInitials(organization);
  return (
    <div className="flex gap-3 items-center">
      <div
        className="size-10 aspect-square rounded flex justify-center items-center shrink-0"
        style={{ backgroundColor: "#EBF0FB" }}
      >
        <span
          className="text-center text-base font-semibold font-text uppercase"
          style={{ color: "#1A56DB" }}
        >
          {initials}
        </span>
      </div>
      <div className="flex flex-col gap-px">
        <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
          {organization}
        </span>
        <span className="text-gray-500 text-xs font-normal font-text leading-4">
          {ownerEmail}
        </span>
      </div>
    </div>
  );
};

// ─── Action cell ──────────────────────────────────────────────────────────────

export const TableUIActionTab = ({
  slug,
  onDelete,
}: {
  slug: string;
  onDelete: () => void;
}) => (
  <div className="flex gap-5 items-center">
    <Link
      href={`/admin/subscribers/${slug}`}
      className="text-[#6B7280] hover:text-blue-600 transition-colors"
    >
      <Eye className="size-4" />
    </Link>
    <button
      onClick={onDelete}
      className="text-[#6B7280] hover:text-red-500 transition-colors cursor-pointer"
    >
      <Trash className="size-4" />
    </button>
  </div>
);

// ─── Delete dialog ────────────────────────────────────────────────────────────

export const DeleteDialogUI = ({
  pendingDeleteId,
  setPendingDeleteId,
  pendingRow,
  confirmDelete,
}: DeleteDialogUIProps) => (
  <AlertDialog
    open={!!pendingDeleteId}
    onOpenChange={(open) => {
      if (!open) setPendingDeleteId(null);
    }}
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-neutral-950 text-lg font-semibold font-text leading-7">
          Delete subscriber?
        </AlertDialogTitle>
        <AlertDialogDescription>
          <span className="text-gray-500 text-sm font-normal font-text leading-5">
            You are about to permanently remove{" "}
            <span className="font-semibold text-neutral-900">
              {pendingRow?.organization}
            </span>{" "}
            from the platform. This action cannot be undone.
          </span>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={confirmDelete}
          className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
        >
          Yes, delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
