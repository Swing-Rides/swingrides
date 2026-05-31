"use client";

import React, {
  ReactNode,
  useCallback,
  Suspense,
  useState,
  useMemo,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  ChevronRight as BreadcrumbChevron,
  Trash,
  Download,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumberToUSD } from "../utils/formatNumbertoUSD";
import {
  FLEET_STATUS_STYLE,
  BOOKING_STATUS_STYLE,
  BILLING_STATUS_STYLE,
  STATUS_STYLE,
} from "../utils/helpers";
import { GraphDataType } from "../charts/salesChart";
import { SalesChart } from "../dashboard/dynamicImport";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdminSubscriberByIdDataFleet,
  FleetStatus,
  BookingStatus,
  BillingStatus,
  BookingRow,
  BillingRow,
  SubscriberStatus,
} from "@/types/subscribers.type";

// ─── Constants ────────────────────────────────────────────────────────────────

// const FAKE_LOAD_MS = 3000;
const ROWS_PER_PAGE = 10;

// ─── Types ────────────────────────────────────────────────────────────────────

type SlugType = { slug: string };

type PageIntroProps = {
  pageTitle: string;
  pageDesc: string;
  dataType: "subscribers" | "booking" | "fleet" | "billing";
  status: SubscriberStatus | BookingStatus | FleetStatus | BillingStatus;
};

type OverviewCardProps = {
  icon: ReactNode;
  title: string;
  number: number | string;
};

type SubscriberDetailPageProps = {
  organisation: { name: string };
  status: SubscriberStatus;
  vehicles: number;
  activeBookings: number;
  monthlyRevenue: number;
  totalEarning: number;
  revenue: { month: string; totalRevenue: number }[];
  fleet: AdminSubscriberByIdDataFleet[];
  booking: BookingRow[];
  billingHistory: BillingRow[];
  canSuspend: boolean;
  canUpgradePlan: boolean;
  ownerName: string;
  ownerEmail: string;
  plan: string;
  joinedDate: string;
  activityLog: {
    time: string;
    eventType: string;
    details: string;
    action: string;
  }[];
};

// Discriminated union keeps DataTable fully type-safe per data type
type DataTableVariant =
  | {
      dataType: "Vehicle";
      rows: AdminSubscriberByIdDataFleet[];
      setRows: React.Dispatch<
        React.SetStateAction<AdminSubscriberByIdDataFleet[]>
      >;
    }
  | {
      dataType: "Booking";
      rows: BookingRow[];
      setRows: React.Dispatch<React.SetStateAction<BookingRow[]>>;
    }
  | {
      dataType: "Billing History";
      rows: BillingRow[];
      setRows: React.Dispatch<React.SetStateAction<BillingRow[]>>;
    };

type DeleteDialogUIProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string | undefined;
  dataType: "Vehicle" | "Booking" | "Billing History";
  onConfirm: () => void;
};

// ─── Column config per data type ──────────────────────────────────────────────

const COLUMN_CONFIG = {
  Vehicle: {
    nameTitle: "Vehicle Name",
    idTitle: "Fleet ID",
    statusTitle: "Status",
    costTitle: "Daily Rate",
    dateTitle: "Last Booking",
    emptyMsg: "This subscriber has no vehicles listed.",
  },
  Booking: {
    nameTitle: "Package Name",
    idTitle: "Booking ID",
    statusTitle: "Status",
    costTitle: "Total Cost",
    dateTitle: "Booking Date",
    emptyMsg: "This subscriber has no bookings yet.",
  },
  "Billing History": {
    nameTitle: "Description",
    idTitle: "Billing ID",
    statusTitle: "Status",
    costTitle: "Cost",
    dateTitle: "Payment Date",
    emptyMsg: "No billing history found.",
  },
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SubscriberDetailPage({
  organisation,
  status,
  vehicles,
  activeBookings,
  monthlyRevenue,
  totalEarning,
  revenue,
  fleet,
  booking,
  billingHistory,
  slug,
}: SubscriberDetailPageProps & SlugType) {
  const revenueTrend: GraphDataType = {
    data: revenue.map((item) => ({
      sales: item.totalRevenue,
      month: item.month,
    })),
    series: [{ name: "sales", color: "#1A56DB" }],
  };

  // Each tab owns its own rows state so deletes are isolated
  const [fleetRows, setFleetRows] = useState<AdminSubscriberByIdDataFleet[]>(
    fleet ?? [],
  );
  const [bookingRows, setBookingRows] = useState<BookingRow[]>(booking ?? []);
  const [billingRows, setBillingRows] = useState<BillingRow[]>(
    billingHistory ?? [],
  );

  return (
    <div className="p-3 md:p-8">
      {/* Breadcrumb */}
      <div className="flex gap-2 items-center mb-3 md:mb-8">
        <Link
          href="/admin/subscribers"
          className="text-gray-500 text-sm font-normal font-text leading-5 hover:text-gray-700 transition-colors"
        >
          Subscribers List
        </Link>
        <BreadcrumbChevron className="size-4 text-[#6B7280]" />
        <span className="text-cyan-600 text-sm font-semibold font-text leading-5">
          Subscriber Details
        </span>
      </div>

      {/* Header */}
      <div className="w-full flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <PageIntro
          pageTitle={organisation.name}
          pageDesc="Manage organization, fleet, billing, and activity"
          status={status}
          dataType="subscribers"
        />
        <div className="w-full md:w-fit flex flex-col md:flex-row flex-wrap gap-3 md:items-center md:justify-end">
          <button className="text-red-500 text-nowrap text-sm font-semibold font-text leading-5 py-3 px-8 rounded-xs border border-red-500 hover:text-red-100 hover:bg-red-900 flex flex-col justify-center items-center gap-2.5 cursor-pointer transition-colors duration-300">
            Suspend Account
          </button>
          <button className="text-white text-nowrap text-sm font-semibold font-text capitalize py-3 px-8 rounded-xs border bg-blue-700 border-blue-700 hover:bg-blue-950 hover:border-blue-950 flex flex-col justify-center items-center gap-2.5 cursor-pointer transition-colors duration-300">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Overview cards */}
      <div className="flex flex-wrap gap-4 my-3 md:mt-10.5 md:mb-10">
        <OverviewCard
          icon={<TotalVehiclesIcon />}
          title="Total Vehicles"
          number={vehicles}
        />
        <OverviewCard
          icon={<ActiveBookingIcon />}
          title="Active Bookings"
          number={activeBookings}
        />
        <OverviewCard
          icon={<MonthlyRevenueIcon />}
          title="Monthly Revenue (MRR)"
          number={formatNumberToUSD(monthlyRevenue)}
        />
        <OverviewCard
          icon={<TotalRevenueIcon />}
          title="Total Revenue"
          number={formatNumberToUSD(totalEarning)}
        />
      </div>

      {/* Revenue chart */}
      <div className="p-3 md:p-6 bg-white rounded-lg border border-gray-200">
        <SalesChart graphData={revenueTrend} />
      </div>

      {/* Tabs */}
      <div className="p-3 md:p-6 my-4 bg-white rounded-lg border border-gray-200">
        <Tabs defaultValue="fleet">
          <TabsList variant="line">
            <TabsTrigger value="fleet">Fleet</TabsTrigger>
            <TabsTrigger value="booking">Bookings</TabsTrigger>
            <TabsTrigger value="billingHistory">Billing History</TabsTrigger>
          </TabsList>

          <TabsContent value="fleet">
            <Suspense>
              <DataTable
                dataType="Vehicle"
                rows={fleetRows}
                setRows={setFleetRows}
                slug={slug}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="booking">
            <Suspense>
              <DataTable
                dataType="Booking"
                rows={bookingRows}
                setRows={setBookingRows}
                slug={slug}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="billingHistory">
            <Suspense>
              <DataTable
                dataType="Billing History"
                rows={billingRows}
                setRows={setBillingRows}
                slug={slug}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Reusable DataTable ───────────────────────────────────────────────────────

// Each data type produces a normalised display row so the table JSX stays generic
type DisplayRow = {
  id: string;
  name: string;
  status: FleetStatus | BookingStatus | BillingStatus;
  cost: number;
  date: string;
};

function normalise(variant: DataTableVariant): DisplayRow[] {
  // Defensive guard — rows can arrive as undefined if the parent
  // hasn't passed the prop or the data hasn't loaded yet
  if (!variant.rows) return [];

  if (variant.dataType === "Vehicle") {
    return variant.rows.map((r) => ({
      id: r.id,
      name: r.vehicleName,
      status: r.status,
      cost: r.dailyRate,
      date: r.lastBooking,
    }));
  }
  if (variant.dataType === "Booking") {
    return variant.rows.map((r) => ({
      id: r.id,
      name: r.vehicleName,
      status: r.status,
      cost: Number(r.totalCost), // arrives as string in data
      date: r.bookingDate,
    }));
  }
  // Billing History
  return variant.rows.map((r) => ({
    id: r.id,
    name: r.package,
    status: r.status,
    cost: Number(r.totalCost), // arrives as string in data
    date: r.date,
  }));
}

function DataTable(props: DataTableVariant & SlugType) {
  const { dataType, slug } = props;
  const config = COLUMN_CONFIG[dataType];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── URL param helper ──────────────────────────────────────────────────
  // Each tab uses its own page param key to avoid collisions
  const pageKey = `${dataType.replace(" ", "_").toLowerCase()}_page`;

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // ── Delete dialog ─────────────────────────────────────────────────────
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const confirmDelete = useCallback(() => {
    if (!pendingDeleteId) return;
    // Type-safe delete for each variant
    if (props.dataType === "Vehicle") {
      props.setRows((prev) => prev.filter((r) => r.id !== pendingDeleteId));
    } else if (props.dataType === "Booking") {
      props.setRows((prev) => prev.filter((r) => r.id !== pendingDeleteId));
    } else {
      props.setRows((prev) => prev.filter((r) => r.id !== pendingDeleteId));
    }
    setPendingDeleteId(null);
  }, [pendingDeleteId, props]);

  // ── Normalise + paginate ──────────────────────────────────────────────
  const displayRows = useMemo(() => normalise(props), [props]);

  const page = Math.max(1, Number(searchParams.get(pageKey) ?? 1));
  const totalPages = Math.max(1, Math.ceil(displayRows.length / ROWS_PER_PAGE));
  const paginated = useMemo(
    () => displayRows.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [displayRows, page],
  );

  const pendingRow = displayRows.find((r) => r.id === pendingDeleteId);
  const goToPage = (p: number) => setParam(pageKey, String(p));
  const paginationLabel =
    displayRows.length === 0
      ? "0 results"
      : `${(page - 1) * ROWS_PER_PAGE + 1}–${Math.min(page * ROWS_PER_PAGE, displayRows.length)} of ${displayRows.length}`;

  return (
    <>
      <div className="rounded-lg border border-gray-200 overflow-hidden mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-50 md:w-80">{config.nameTitle}</TableHead>
              <TableHead>{config.idTitle}</TableHead>
              <TableHead>{config.statusTitle}</TableHead>
              <TableHead>{config.costTitle}</TableHead>
              <TableHead>{config.dateTitle}</TableHead>
              <TableHead className="w-25">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <Suspense fallback={<TableSkeletonRows />}>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-16 text-gray-400 text-sm"
                  >
                    {config.emptyMsg}
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="py-4">
                      <span className="text-neutral-950 text-sm font-medium font-text leading-5">
                        {item.name}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-gray-500 text-xs font-normal font-text leading-5">
                        {item.id}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <StatusBadge dataType={dataType} status={item.status} />
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-neutral-950 text-sm font-medium font-text leading-5">
                        {formatNumberToUSD(item.cost)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-gray-500 text-sm font-normal font-text leading-5">
                        {item.date}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <TableUIActionTab
                        slug={slug}
                        itemId={item.id}
                        dataType={dataType}
                        onDelete={() => setPendingDeleteId(item.id)}
                        onDownload={() => console.log("Downloading billing history")}
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

      <DeleteDialogUI
        open={!!pendingDeleteId}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null);
        }}
        name={pendingRow?.name}
        dataType={dataType}
        onConfirm={confirmDelete}
      />
    </>
  );
}

// ─── Status badge (routes to the right style map by dataType) ─────────────────

function StatusBadge({
  dataType,
  status,
}: {
  dataType: DataTableVariant["dataType"];
  status: FleetStatus | BookingStatus | BillingStatus;
}) {
  const styleMap =
    dataType === "Vehicle"
      ? FLEET_STATUS_STYLE
      : dataType === "Booking"
        ? BOOKING_STATUS_STYLE
        : BILLING_STATUS_STYLE;

  const normalizedStatus = status.toLowerCase();

  const { label, textColor, bgColor } = (
    styleMap as Record<
      string,
      { label: string; textColor: string; bgColor: string }
    >
  )[normalizedStatus];

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
}

// ─── Table skeleton ───────────────────────────────────────────────────────────

function TableSkeletonRows() {
  return (
    <>
      {Array.from({ length: ROWS_PER_PAGE }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
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

// ─── Action cell ──────────────────────────────────────────────────────────────

function TableUIActionTab({
  slug,
  itemId,
  dataType,
  onDelete,
  onDownload
}: {
  slug: string;
  itemId: string;
  dataType: DataTableVariant["dataType"];
  onDelete: () => void;
  onDownload: () => void;
}) {
  // Route per tab type so the eye icon goes to the right detail page
  const href =
    dataType === "Vehicle"
      ? `/admin/subscribers/${slug}/fleet/${itemId}`
      : dataType === "Booking"
        ? `/admin/subscribers/${slug}/bookings/${itemId}`
        : `/admin/subscribers/${slug}/billing/${itemId}`;

  return (
    <div className="flex gap-5 items-center">
      {dataType!== "Billing History" ? <><Link
        href={href}
        className="text-[#6B7280] hover:text-blue-600 transition-colors"
      >
        <Eye className="size-4" />
      </Link>
      <button
        onClick={onDelete}
        className="text-[#6B7280] hover:text-red-500 transition-colors cursor-pointer"
      >
        <Trash className="size-4" />
        </button></> : <button className="text-[#6B7280] hover:text-red-500 transition-colors cursor-pointer">
          <Download 
            className="size-4" 
            onClick={onDownload}
          />
      </button> }
      
    </div>
  );
}

// ─── Page intro ───────────────────────────────────────────────────────────────

export const PageIntro = ({
  pageTitle,
  pageDesc,
  dataType = "subscribers",
  status,
}: PageIntroProps) => {
  const styleMap =
    dataType === "fleet"
      ? FLEET_STATUS_STYLE
      : dataType === "booking"
        ? BOOKING_STATUS_STYLE
        : STATUS_STYLE;

  const normalizedStatus = status.toLowerCase() as
    | SubscriberStatus
    | BookingStatus
    | FleetStatus
    | BillingStatus;

  const { label, textColor, bgColor } = (
    styleMap as Record<
      string,
      { label: string; textColor: string; bgColor: string }
    >
  )[normalizedStatus] ??
    (
      styleMap as Record<
        string,
        { label: string; textColor: string; bgColor: string }
      >
    )[normalizedStatus] ?? {
      label: status,
      textColor: "#6B7280",
      bgColor: "#F3F4F6",
    };

  return (
    <div className="flex flex-col gap-1.25">
      <div className="flex items-center flex-wrap-reverse gap-2">
        <h2 className="text-neutral-950 md:text-nowrap text-2xl font-semibold font-text">
          {pageTitle}
        </h2>
        <span
          className="py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4"
          style={{ color: textColor, backgroundColor: bgColor }}
        >
          {label}
        </span>
      </div>
      <span className="text-gray-500 text-sm font-normal font-text">
        {pageDesc}
      </span>
    </div>
  );
};

// ─── Overview card ────────────────────────────────────────────────────────────

const OverviewCard = ({ icon, title, number }: OverviewCardProps) => (
  <div className="basis-62.5 shrink-0 grow p-6 bg-white hover:bg-blue-100 hover:border-blue-200 transition-colors duration-300 rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
    <div>{icon}</div>
    <span className="text-gray-500 text-xs font-semibold font-text uppercase">
      {title}
    </span>
    <Suspense fallback={<Skeleton className="w-20 h-10" />}>
      <span className="text-neutral-950 text-3xl font-medium font-text">
        {number}
      </span>
    </Suspense>
  </div>
);

// ─── Delete dialog ────────────────────────────────────────────────────────────

const DeleteDialogUI = ({
  open,
  onOpenChange,
  name,
  dataType,
  onConfirm,
}: DeleteDialogUIProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-neutral-950 text-lg font-semibold font-text leading-7">
          Delete {dataType}?
        </AlertDialogTitle>
        <AlertDialogDescription>
          <span className="text-gray-500 text-sm font-normal font-text leading-5">
            You are about to permanently remove{" "}
            <span className="font-semibold text-neutral-900">{name}</span> from
            the platform. This action cannot be undone.
          </span>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
        >
          Yes, delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

// ─── Icons ────────────────────────────────────────────────────────────────────

const TotalVehiclesIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 9.99999C0 4.47714 4.47715 0 10 0H37.9997C43.5226 0 47.9997 4.47715 47.9997 10V37.9997C47.9997 43.5226 43.5226 47.9997 37.9997 47.9997H9.99999C4.47714 47.9997 0 43.5226 0 37.9997V9.99999Z"
      fill="#EBF0FB"
    />
    <path
      d="M30.9911 28.9981H32.9906C33.5904 28.9981 33.9903 28.5982 33.9903 27.9984V24.9992C33.9903 24.0995 33.2905 23.2997 32.4907 23.0998C30.6912 22.5999 27.992 22.0001 27.992 22.0001C27.992 22.0001 26.6924 20.6005 25.7927 19.7008C25.2928 19.3009 24.693 19.001 23.9932 19.001H16.9952C16.3954 19.001 15.8955 19.4009 15.5956 19.9007L14.196 22.7999C14.0637 23.186 13.9961 23.5913 13.9961 23.9995V27.9984C13.9961 28.5982 14.396 28.9981 14.9958 28.9981H16.9952"
      stroke="#1A56DB"
      strokeWidth="1.99942"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.9936 30.9979C20.0978 30.9979 20.993 30.1027 20.993 28.9984C20.993 27.8942 20.0978 26.999 18.9936 26.999C17.8893 26.999 16.9941 27.8942 16.9941 28.9984C16.9941 30.1027 17.8893 30.9979 18.9936 30.9979Z"
      stroke="#1A56DB"
      strokeWidth="1.99942"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.9941 28.998H26.9924"
      stroke="#1A56DB"
      strokeWidth="1.99942"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M28.9916 30.9979C30.0959 30.9979 30.991 30.1027 30.991 28.9984C30.991 27.8942 30.0959 26.999 28.9916 26.999C27.8874 26.999 26.9922 27.8942 26.9922 28.9984C26.9922 30.1027 27.8874 30.9979 28.9916 30.9979Z"
      stroke="#1A56DB"
      strokeWidth="1.99942"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ActiveBookingIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 9.99999C0 4.47714 4.47715 0 10 0H37.9997C43.5226 0 47.9997 4.47715 47.9997 10V37.9997C47.9997 43.5226 43.5226 47.9997 37.9997 47.9997H9.99999C4.47714 47.9997 0 43.5226 0 37.9997V9.99999Z"
      fill="#E3FAFF"
    />
    <path
      d="M19.998 14.002V18.0008"
      stroke="#0891B2"
      strokeWidth="1.99942"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27.9961 14.002V18.0008"
      stroke="#0891B2"
      strokeWidth="1.99942"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30.9953 16.002H16.9994C15.8952 16.002 15 16.8971 15 18.0014V31.9973C15 33.1015 15.8952 33.9967 16.9994 33.9967H30.9953C32.0996 33.9967 32.9948 33.1015 32.9948 31.9973V18.0014C32.9948 16.8971 32.0996 16.002 30.9953 16.002Z"
      stroke="#0891B2"
      strokeWidth="1.99942"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 22H32.9948"
      stroke="#0891B2"
      strokeWidth="1.99942"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MonthlyRevenueIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 9.99999C0 4.47714 4.47715 0 10 0H37.9997C43.5226 0 47.9997 4.47715 47.9997 10V37.9997C47.9997 43.5226 43.5226 47.9997 37.9997 47.9997H9.99999C4.47714 47.9997 0 43.5226 0 37.9997V9.99999Z"
      fill="#DAFFF3"
    />
    <path
      d="M23.9961 14.002V33.9961"
      stroke="#10B981"
      strokeWidth="1.99942"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M28.9948 17.002H21.497C20.569 17.002 19.6791 17.3706 19.0229 18.0268C18.3667 18.683 17.998 19.5729 17.998 20.5009C17.998 21.4289 18.3667 22.3189 19.0229 22.9751C19.6791 23.6313 20.569 23.9999 21.497 23.9999H26.4956C27.4236 23.9999 28.3135 24.3686 28.9697 25.0247C29.6259 25.6809 29.9946 26.5709 29.9946 27.4989C29.9946 28.4269 29.6259 29.3169 28.9697 29.9731C28.3135 30.6292 27.4236 30.9979 26.4956 30.9979H17.998"
      stroke="#10B981"
      strokeWidth="1.99942"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TotalRevenueIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 9.99999C0 4.47714 4.47715 0 10 0H37.9997C43.5226 0 47.9997 4.47715 47.9997 10V37.9997C47.9997 43.5226 43.5226 47.9997 37.9997 47.9997H9.99999C4.47714 47.9997 0 43.5226 0 37.9997V9.99999Z"
      fill="#FFF6E7"
    />
    <path
      d="M33.9942 19.001L25.4967 27.4985L20.4981 22.5L14 28.9981"
      stroke="#F59E0B"
      strokeWidth="1.99942"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27.9961 19.001H33.9943V24.9992"
      stroke="#F59E0B"
      strokeWidth="1.99942"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
