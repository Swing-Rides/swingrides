"use client";

import { Suspense, useCallback, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/superAdminPages/dashboard/avatar";
import {
  Activity,
  ChevronRight as BreadcrumbChevron,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  CircleX,
  ExternalLink,
} from "lucide-react";
import {
  AdminRenterByIdResponseBookings,
  AdminRenterByIdResponseBookingsRow,
  AdminRenterByIdResponseDocuments,
  AdminRenterByIdResponseRenter,
  AdminRenterByIdResponseStats,
  AdminRenterByIdResponseVerification,
  RenterVerificationDocumentStatus,
} from "@/types/renters.type";
import { DataList } from "../bookingDetailPage";
import {
  CarBookingStatusPill,
  RenterVerificationStatusPill,
} from "../../dashboard/statusPill";
import { formatDate, getRelativeTime } from "../../utils/formatDate";
import { TableSkeletonRows } from "../subscribersPageComponents";
import PopupWrapper from "../singleSubscriberPageComponents/popupWrapper";
import {
  useApproveRenterVerificationMutation,
  useRejectRenterVerificationMutation,
  useSuspendRenterMutation,
  useReactivateRenterMutation,
  useFlagRenterMutation,
  useUnflagRenterMutation,
} from "@/app/store/services/adminApi";
import Image from "next/image";
import { toast } from "sonner";

type RenterPageComponentsProps = {
  renterId: string;
  renter: AdminRenterByIdResponseRenter;
  stats: AdminRenterByIdResponseStats;
  verification: AdminRenterByIdResponseVerification;
  documents: AdminRenterByIdResponseDocuments[];
  bookings: AdminRenterByIdResponseBookings;
};

type ProfileSideCardProps = {
  renterId: string;
  renter: AdminRenterByIdResponseRenter;
  stats: AdminRenterByIdResponseStats;
  verification: AdminRenterByIdResponseVerification;
  suspendUser?: boolean;
};

type ProfileTabsProps = {
  renterId: string;
  renter: AdminRenterByIdResponseRenter;
  verification: AdminRenterByIdResponseVerification;
  documents: AdminRenterByIdResponseDocuments[];
  bookings: AdminRenterByIdResponseBookings;
};

type ProfileTabProps = {
  renter: AdminRenterByIdResponseRenter;
  verification: AdminRenterByIdResponseVerification;
};

type BookingTableProps = {
  rowData: AdminRenterByIdResponseBookingsRow[];
  limit: number;
};

export default function RenterPageComponents({
  renterId,
  renter,
  stats,
  verification,
  documents,
  bookings,
}: RenterPageComponentsProps) {
  return (
    <div className="p-3 md:p-8">
      {/* Header */}
      <div>
        <div className="flex gap-2 items-center mb-3 md:mb-8">
          <Link
            href="/admin/renters"
            className="text-gray-500 text-sm font-normal font-text leading-5 hover:text-gray-700 transition-colors"
          >
            Renters
          </Link>
          <BreadcrumbChevron className="size-4 text-[#6B7280]" />
          <span className="text-cyan-600 text-sm font-semibold font-text leading-5">
            Renter Details
          </span>
        </div>

        <div className="w-full flex">
          <h2 className="text-neutral-950 md:text-nowrap text-2xl font-semibold font-text">
            Renter Profile
          </h2>
        </div>
      </div>
      <div className="flex flex-col md:items-start md:flex-row mt-4 md:mt-8 gap-4">
        <ProfileSideCard
          renterId={renterId}
          renter={renter}
          stats={stats}
          verification={verification}
          suspendUser={!renter.isActive}
        />
        <ProfileTabs
          renterId={renterId}
          renter={renter}
          verification={verification}
          documents={documents}
          bookings={bookings}
        />
      </div>
    </div>
  );
}

const ProfileSideCard = ({
  renterId,
  renter,
  stats,
  verification,
  suspendUser,
}: ProfileSideCardProps) => {

  const [popup, setPopup] = useState<"approve" | "reject" | null>(null);
  const [suspendUserPopup, setSuspendUserPopup] = useState<boolean>(false);
  const [unsuspendUserPopup, setUnsuspendUserPopup] = useState<boolean>(false);
  const [flagUserPopup, setFlagUserPopup] = useState<boolean>(false);
  const [unflagUserPopup, setUnflagUserPopup] = useState<boolean>(false);

  const [approveVerification, { isLoading: approving }] =
    useApproveRenterVerificationMutation();
  const [rejectVerification, { isLoading: rejecting }] =
    useRejectRenterVerificationMutation();
  const [suspendRenter, { isLoading: suspending }] = useSuspendRenterMutation();
  const [reactivateRenter, { isLoading: reactivating }] =
    useReactivateRenterMutation();
  const [flagRenter, { isLoading: flagging }] = useFlagRenterMutation();
  const [unflagRenter, { isLoading: unflagging }] = useUnflagRenterMutation();

  const handleApprove = async () => {
    try {
      await approveVerification(renterId).unwrap();
      toast.success("Renter verification approved successfully.");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data &&
          typeof error.data.message === "string"
          ? error.data.message
          : "Reject renter verification failed.";
      toast.error(message);
    } finally {
      setPopup(null);
    }
  };

  const handleReject = async () => {
    try {
      await rejectVerification(renterId).unwrap();
      toast.success("Renter verification rejected successfully.");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data &&
          typeof error.data.message === "string"
          ? error.data.message
          : "Reject renter verification failed.";
      toast.error(message);
    } finally {
      setPopup(null);
    }
  };

  const handleSuspendUser = async () => {
    try {
      await suspendRenter(renterId).unwrap();
      toast.success("Renter suspended.");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data &&
          typeof error.data.message === "string"
          ? error.data.message
          : "Suspension failed.";
      toast.error(message);
    } finally {
      setSuspendUserPopup(false);
    }
  };

  const handleUnsuspendUser = async () => {
    try {
      await reactivateRenter(renterId).unwrap();
      toast.success("Renter unsuspended.");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data &&
          typeof error.data.message === "string"
          ? error.data.message
          : "Unsuspension failed.";
      toast.error(message);
    } finally {
      setUnsuspendUserPopup(false);
    }
  };

  const handleFlagUser = async () => {
    try {
      await flagRenter(renterId).unwrap();
      toast.success("Renter flagged.");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data &&
          typeof error.data.message === "string"
          ? error.data.message
          : "Flagging renter failed.";
      toast.error(message);
    } finally {
      setFlagUserPopup(false);
    }
  };

  const handleUnflagUser = async () => {
    try {
      await unflagRenter(renterId).unwrap();
      toast.success("Renter unflagged.");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data &&
          typeof error.data.message === "string"
          ? error.data.message
          : "Unflagging renter failed.";
      toast.error(message);
    } finally {
      setUnflagUserPopup(false);
    }
  };

  return (
    <div className="md:max-w-64 p-6 bg-white rounded-lg border border-gray-200 flex flex-col justify-start items-start gap-5">
      <div className="mx-auto space-y-3">
        <div className="mx-auto aspect-square w-20 rounded-full group overflow-clip">
          <Avatar
            name={renter.name}
            height={80}
            className="aspect-square w-full group-hover:scale-[1.2] transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-center text-neutral-950 text-xl font-bold font-text">
            {renter.name}
          </h3>
          <span className="text-center text-gray-500 text-sm font-normal font-text">
            {renter.email}
          </span>
          <span className="text-center text-gray-500 text-sm font-normal font-text">
            {renter.phone}
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-start gap-2">
          <Calendar className="size-4 text-gray-500" />
          <span className="text-gray-500 text-xs font-normal font-text leading-4">
            Member since {formatDate(renter.joinedDate)}
          </span>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200" />

      <div className="flex flex-col justify-start gap-3">
        <div className="p-3 bg-gray-50 rounded-md flex flex-col justify-start gap-1">
          <h4 className="text-gray-500 text-xs font-semibold font-text uppercase">
            Total Bookings
          </h4>
          <span className="text-neutral-950 text-2xl font-medium font-text leading-8">
            {stats.totalBookings}
          </span>
        </div>

        <div className="p-3 bg-gray-50 rounded-md flex flex-col justify-start gap-1">
          <h4 className="text-gray-500 text-xs font-semibold font-text uppercase">
            Total Spent
          </h4>
          <span className="text-neutral-950 text-2xl font-medium font-text leading-8">
            {stats.totalSpentFormatted}
          </span>
        </div>

        <div className="p-3 bg-gray-50 rounded-md flex flex-col justify-start gap-1">
          <h4 className="text-gray-500 text-xs font-semibold font-text uppercase">
            Last Active
          </h4>
          <div className="flex gap-1.5 items-center justify-start">
            <Activity className="size-6.5 text-[#10B981]" />
            <span className="text-neutral-950 text-sm font-medium font-text leading-5">
              {getRelativeTime(renter.lastLogin)}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200" />

      <div className="w-full space-y-2.5">
        {verification.status.toLowerCase() !== "verified" && (
          <button
            type="button"
            onClick={() => setPopup("approve")}
            className="w-full px-6 py-2 rounded-xs border border-blue-700 bg-blue-700 hover:bg-blue-900 duration-300 transition-colors text-white text-sm font-semibold font-text capitalize cursor-pointer"
          >
            Approve Verification
          </button>
        )}
        {verification.status.toLowerCase() !== "verified" && (
          <button
            type="button"
            onClick={() => setPopup("reject")}
            className="w-full px-6 py-2 rounded-xs border border-red-500 text-red-500 bg-transparent hover:bg-red-700 duration-300 hover:text-red-200 transition-colors text-sm font-semibold font-text capitalize cursor-pointer"
          >
            Reject Verification
          </button>
        )}
        {suspendUser ? (
          <button
            type="button"
            onClick={() => setUnsuspendUserPopup(true)}
            className="w-full px-6 py-2 rounded-xs border border-red-500 text-red-500 bg-transparent hover:bg-red-700 duration-300 hover:text-red-200 transition-colors text-sm font-semibold font-text capitalize cursor-pointer"
          >
            Unsuspend Renter
          </button>
        ) : (
            <button
              type="button"
              onClick={() => setSuspendUserPopup(true)}
              className="w-full px-6 py-2 rounded-xs border border-red-500 text-red-500 bg-transparent hover:bg-red-700 duration-300 hover:text-red-200 transition-colors text-sm font-semibold font-text capitalize cursor-pointer"
            >
              Suspend Renter
            </button>
        )}

        {renter.isFlagged ? (
          <button
            type="button"
            onClick={() => setUnflagUserPopup(true)}
            className="w-full px-6 py-2 rounded-xs border border-amber-500 text-amber-500 bg-transparent hover:bg-amber-800 duration-300 hover:text-amber-100 transition-colors text-sm font-semibold font-text capitalize cursor-pointer"
          >
            Unflag Renter
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setFlagUserPopup(true)}
            className="w-full px-6 py-2 rounded-xs border border-amber-500 text-amber-500 bg-transparent hover:bg-amber-800 duration-300 hover:text-amber-100 transition-colors text-sm font-semibold font-text capitalize cursor-pointer"
          >
            Flag Renter
          </button>
        )}
      </div>

      <PopupWrapper
        open={popup === "approve"}
        title="Approve renter verification"
        onClose={() => setPopup(null)}
        onConfirm={handleApprove}
        confirmLabel="Approve"
        confirmDisabled={approving}
      >
        <p className="text-gray-500 text-sm font-normal font-text leading-5">
          This will mark {renter.name}&apos;s identity verification as
          verified.
        </p>
      </PopupWrapper>

      <PopupWrapper
        open={popup === "reject"}
        title="Reject renter verification"
        onClose={() => setPopup(null)}
        onConfirm={handleReject}
        confirmLabel="Reject"
        confirmVariant="danger"
        confirmDisabled={rejecting}
      >
        <p className="text-gray-500 text-sm font-normal font-text leading-5">
          This will reject {renter.name}&apos;s submitted verification
          documents. They will need to resubmit.
        </p>
      </PopupWrapper>
      
      <PopupWrapper
        open={unsuspendUserPopup}
        title="Unsuspend renter account"
        onClose={() => setUnsuspendUserPopup(false)}
        onConfirm={handleUnsuspendUser}
        confirmLabel="Unsuspend Renter"
        confirmDisabled={reactivating}
      >
        <p className="text-gray-500 text-sm font-normal font-text leading-5">
          This action will unsuspend {renter.name}&apos;s account. Their account will be reopened for use again. Click unsuspend to continue.
        </p>
      </PopupWrapper>

      <PopupWrapper
        open={suspendUserPopup}
        title="Suspend renter account"
        onClose={() => setSuspendUserPopup(false)}
        onConfirm={handleSuspendUser}
        confirmLabel="Suspend Renter"
        confirmVariant="danger"
        confirmDisabled={suspending}
      >
        <p className="text-gray-500 text-sm font-normal font-text leading-5">
          This action will suspend {renter.name}&apos;s account. They will have to contact support for help. Click suspend to continue.
        </p>
      </PopupWrapper>

      <PopupWrapper
        open={flagUserPopup}
        title="Flag renter account"
        onClose={() => setFlagUserPopup(false)}
        onConfirm={handleFlagUser}
        confirmLabel="Flag Renter"
        confirmVariant="danger"
        confirmDisabled={flagging}
      >
        <p className="text-gray-500 text-sm font-normal font-text leading-5">
          This will flag {renter.name}&apos;s account for review. Their account will remain active but marked for admin attention. Click flag to continue.
        </p>
      </PopupWrapper>

      <PopupWrapper
        open={unflagUserPopup}
        title="Unflag renter account"
        onClose={() => setUnflagUserPopup(false)}
        onConfirm={handleUnflagUser}
        confirmLabel="Unflag Renter"
        confirmDisabled={unflagging}
      >
        <p className="text-gray-500 text-sm font-normal font-text leading-5">
          This will remove the flag from {renter.name}&apos;s account. Click unflag to continue.
        </p>
      </PopupWrapper>
    </div>
  );
};

const ProfileTabs = ({
  renterId,
  renter,
  verification,
  documents,
  bookings,
}: ProfileTabsProps) => {
  return (
    <div className="w-full p-px bg-white rounded-lg border border-gray-200 flex flex-col gap-6">
      <Tabs defaultValue="profile" className="md:gap-6">
        <TabsList
          variant="line"
          className="px-2.5 md:px-6 h-fit group-data-horizontal/tabs:h-fit gap-8"
        >
          <TabsTrigger
            value="profile"
            className="py-4 h-fit text-center text-gray-500 text-sm font-semibold font-text leading-5 hover:text-black data-active:text-blue-700 duration-300 transition-colors data-active:after:bg-blue-700 cursor-pointer"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="bookings"
            className="py-4 h-fit text-center text-gray-500 text-sm font-semibold font-text leading-5 hover:text-black data-active:text-blue-700 duration-300 transition-colors data-active:after:bg-blue-700 cursor-pointer"
          >
            Bookings
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="py-4 h-fit text-center text-gray-500 text-sm font-semibold font-text leading-5 hover:text-black data-active:text-blue-700 duration-300 transition-colors data-active:after:bg-blue-700 cursor-pointer"
          >
            Documents
          </TabsTrigger>
        </TabsList>

        <div className="px-4 pb-4 md:pb-8 md:px-8">
          <TabsContent value="profile">
            <ProfileTab renter={renter} verification={verification} />
          </TabsContent>
          <TabsContent value="bookings">
            <Suspense>
              <BookingTable
                rowData={bookings.rows}
                limit={bookings.pagination.limit}
              />
            </Suspense>
          </TabsContent>
          <TabsContent value="documents">
            <DocumentTab
              renterId={renterId}
              verification={verification}
              documents={documents}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

const ProfileTab = ({ renter, verification }: ProfileTabProps) => {
  return (
    <div className="space-y-3 md:space-y-6">
      <div className="flex flex-col gap-4">
        <h3 className="text-neutral-950 text-base font-semibold font-text leading-6">
          Personal Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <DataList title="First Name" label={renter.firstName} />
          <DataList title="Last Name" label={renter.lastName} />
          <DataList title="Phone" label={renter.phone} />
          <DataList title="Email" label={renter.email} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-neutral-950 text-base font-semibold font-text leading-6">
          Verification Status
        </h3>
        <div className="p-2.5 md:p-4">
          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
                Status
              </span>
              <RenterVerificationStatusPill
                status={
                  verification.status.toLowerCase() as RenterVerificationDocumentStatus
                }
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
                Date Submitted
              </span>
              <span className="text-neutral-950 text-sm font-normal font-text leading-5">
                {verification.submittedAt
                  ? formatDate(verification.submittedAt)
                  : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
                Document Type
              </span>
              <span className="text-neutral-950 text-sm font-normal font-text leading-5">
                {verification.documentType || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingTable = ({ rowData, limit }: BookingTableProps) => {
  const ROWS_PER_PAGE = limit;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── URL param helper ──────────────────────────────────────────────────
  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      // reset page on filter change, but not when navigating pages
      if (key !== "booking-table-page") params.delete("booking-table-page");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const page = Math.max(1, Number(searchParams.get("booking-table-page") ?? 1));

  // ── Pagination ────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(rowData.length / ROWS_PER_PAGE));
  const paginated = rowData.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );
  const goToPage = (p: number) => setParam("booking-table-page", String(p));

  const paginationLabel =
    rowData.length === 0
      ? "0 results"
      : `${(page - 1) * ROWS_PER_PAGE + 1}-${Math.min(page * ROWS_PER_PAGE, rowData.length)} of ${rowData.length}`;

  return (
    <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-56">Booking Ref</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Host Organisation</TableHead>
            <TableHead>Pickup Date</TableHead>
            <TableHead>Return Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-25">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Suspense fallback={<TableSkeletonRows />}>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-16 text-gray-400 text-sm"
                >
                  No renter match your filters.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="text-neutral-950 text-xs font-normal font-text leading-5">
                      {item.bookingRef}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-neutral-950 text-sm font-normal font-['DM_Sans'] leading-5">
                      {item.vehicleName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-neutral-800">
                      {item.hostOrganisation}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-neutral-800">
                      {item.pickupDate}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-neutral-800">
                      {item.returnDate}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-neutral-800">
                      {item.amount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <CarBookingStatusPill status={item.status} />
                  </TableCell>
                  <TableCell>
                    {item.hostId ? (
                      <Link
                        href={`/admin/subscribers/${item.hostId}/bookings/${item.id}`}
                      >
                        <ExternalLink className="size-4 text-[#6B7280]" />
                      </Link>
                    ) : (
                      <ExternalLink className="size-4 text-gray-300" />
                    )}
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
  );
};

type DocumentTabProps = {
  renterId: string;
  verification: AdminRenterByIdResponseVerification;
  documents: AdminRenterByIdResponseDocuments[];
};

type DocumentCardProps = {
  url: string;
  title: string;
  uploadedAt: string;
  status: RenterVerificationDocumentStatus;
};

const DocumentTab = ({ renterId, verification, documents }: DocumentTabProps) => {
  const [popup, setPopup] = useState<"approve" | "reject" | null>(null);
  const [approveVerification, { isLoading: approving }] =
    useApproveRenterVerificationMutation();
  const [rejectVerification, { isLoading: rejecting }] =
    useRejectRenterVerificationMutation();

  const canReview = verification.status.toLowerCase() !== "verified";

  const handleApprove = async () => {
    try {
      await approveVerification(renterId).unwrap();
    } catch (error) {
      console.error("Approve renter verification failed:", error);
    } finally {
      setPopup(null);
    }
  };

  const handleReject = async () => {
    try {
      await rejectVerification(renterId).unwrap();
    } catch (error) {
      console.error("Reject renter verification failed:", error);
    } finally {
      setPopup(null);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 font-text">
        No documents have been uploaded yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        {documents.map((document) => (
          <DocumentCard
            key={`${document.type}-${document.uploadedAt}`}
            url={document.url}
            title={document.type}
            uploadedAt={document.uploadedAt}
            status={document.status}
          />
        ))}
      </div>
      {canReview && (
        <div className="flex items-center justify-start gap-2">
          <button
            type="button"
            onClick={() => setPopup("approve")}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-950 transition-colors duration-300 rounded-md px-10 py-2 text-white text-xs font-semibold font-text leading-5 border border-emerald-500 cursor-pointer"
          >
            <CircleCheckBig className="size-3.5" />
            <span>Approve</span>
          </button>

          <button
            type="button"
            onClick={() => setPopup("reject")}
            className="flex items-center gap-1.5 bg-transparent hover:bg-red-500 transition-colors duration-300 rounded-md px-10 py-2 text-red-500 hover:text-red-100 text-xs font-semibold font-text leading-5 border border-red-500 cursor-pointer"
          >
            <CircleX className="size-3.5" />
            <span>Reject</span>
          </button>
        </div>
      )}

      <PopupWrapper
        open={popup === "approve"}
        title="Approve renter verification"
        onClose={() => setPopup(null)}
        onConfirm={handleApprove}
        confirmLabel="Approve"
        confirmDisabled={approving}
      >
        <p className="text-gray-500 text-sm font-normal font-text leading-5">
          This will mark these verification documents as verified.
        </p>
      </PopupWrapper>

      <PopupWrapper
        open={popup === "reject"}
        title="Reject renter verification"
        onClose={() => setPopup(null)}
        onConfirm={handleReject}
        confirmLabel="Reject"
        confirmVariant="danger"
        confirmDisabled={rejecting}
      >
        <p className="text-gray-500 text-sm font-normal font-text leading-5">
          This will reject these verification documents. The renter will need
          to resubmit.
        </p>
      </PopupWrapper>
    </div>
  );
};

const DocumentCard = ({
  url,
  title,
  uploadedAt,
  status,
}: DocumentCardProps) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col justify-start items-start gap-3">
      <div className="flex flex-col items-start gap-3">
        <div className="bg-white rounded-md border border-gray-300 overflow-clip">
          {url ? (
            <Image src={url} alt={title} width={352} height={180} />
          ) : (
            <Image
              src={"/images/document-preview.jpeg"}
              alt={title}
              width={352}
              height={180}
            />
          )}
        </div>
        <h3 className="text-neutral-950 text-sm font-semibold font-text leading-5">
          {title}
        </h3>
        <span className="text-gray-500 text-xs font-normal font-text leading-4">
          Uploaded: {formatDate(uploadedAt)}
        </span>
        <RenterVerificationStatusPill status={status} />
      </div>
    </div>
  );
};
