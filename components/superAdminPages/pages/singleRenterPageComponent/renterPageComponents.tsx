"use client";

import { Suspense, useCallback } from "react";
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
import { formatDate } from "../../utils/formatDate";
import { TableSkeletonRows } from "../subscribersPageComponents";
import Image from "next/image";

type RenterPageComponentsProps = {
  renter: AdminRenterByIdResponseRenter;
  stats: AdminRenterByIdResponseStats;
  verification: AdminRenterByIdResponseVerification;
  documents: AdminRenterByIdResponseDocuments[];
  bookings: AdminRenterByIdResponseBookings;
};

type ProfileSideCardProps = {
  renter: AdminRenterByIdResponseRenter;
  stats: AdminRenterByIdResponseStats;
  verification: AdminRenterByIdResponseVerification;
};

type ProfileTabsProps = {
  renter: AdminRenterByIdResponseRenter;
  documents: AdminRenterByIdResponseDocuments[];
  bookings: AdminRenterByIdResponseBookings;
};

type ProfileTabProps = {
  renter: AdminRenterByIdResponseRenter;
  documents: AdminRenterByIdResponseDocuments[];
};

type BookingTableProps = {
  rowData: AdminRenterByIdResponseBookingsRow[];
  limit: number;
};

export default function RenterPageComponents({
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
          renter={renter}
          stats={stats}
          verification={verification}
        />
        <ProfileTabs
          renter={renter}
          documents={documents}
          bookings={bookings}
        />
      </div>
    </div>
  );
}

const ProfileSideCard = ({
  renter,
  stats,
  verification,
}: ProfileSideCardProps) => {
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

        {/* {renter.location && <div className="flex items-center justify-start gap-2">
                                        <MapPin className="size-4 text-gray-500"/>
                                        <span className="text-gray-500 text-xs font-normal font-text leading-4">
                                                {renter.location}
                                        </span>
                                </div>} */}
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
              {renter.lastLogin}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200" />

      <div className="w-full space-y-2.5">
        {verification.status.toLowerCase() !== "verified" && (
          <button className="w-full px-6 py-2 rounded-xs border border-blue-700 bg-blue-700 hover:bg-blue-900 duration-300 transition-colors text-white text-sm font-semibold font-text capitalize cursor-pointer">
            Approve Verification
          </button>
        )}
        {verification.status.toLowerCase() !== "verified" && (
          <button className="w-full px-6 py-2 rounded-xs border border-red-500 text-red-500 bg-transparent hover:bg-red-700 duration-300 hover:text-red-200 transition-colors text-sm font-semibold font-text capitalize cursor-pointer">
            Reject Verification
          </button>
        )}

        <button className="w-full px-6 py-2 rounded-xs border border-amber-500 text-amber-500 bg-transparent hover:bg-amber-800 duration-300 hover:text-amber-100 transition-colors text-sm font-semibold font-text capitalize cursor-pointer">
          Flag Renter
        </button>
      </div>
    </div>
  );
};

const ProfileTabs = ({ renter, documents, bookings }: ProfileTabsProps) => {
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
            <ProfileTab renter={renter} documents={documents} />
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
            <DocumentTab documents={documents} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

const ProfileTab = ({ renter, documents }: ProfileTabProps) => {
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
          {documents.map((document) => (
            <div className="grid gap-3" key={document.uploadedAt}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
                  Status
                </span>
                <RenterVerificationStatusPill status={document.status} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
                  Date Submitted
                </span>
                <span className="text-neutral-950 text-sm font-normal font-text leading-5">
                  {formatDate(document.uploadedAt)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500 text-xs font-semibold font-text uppercase leading-4">
                  Document Type
                </span>
                <span className="text-neutral-950 text-sm font-normal font-text leading-5">
                  {document.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BookingTable = ({ rowData, limit }: BookingTableProps) => {
  const ROWS_PER_PAGE = limit;

  const hostId = "6a01a1cb39a46efd34fe0fe1";
  const bookingId = "6a01a1ce39a46efd34fe0fe9";

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
                <TableRow key={item.bookingRef}>
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
                    <Link
                      href={`/admin/subscribers/${hostId}/bookings/${bookingId}`}
                    >
                      <ExternalLink className="size-4 text-[#6B7280]" />
                    </Link>
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
  documents: AdminRenterByIdResponseDocuments[];
};

type DocumentCardProps = {
  url: string;
  title: string;
  uploadedAt: string;
  status: RenterVerificationDocumentStatus;
};

const DocumentTab = ({ documents }: DocumentTabProps) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <DocumentCard
          url={documents[0].url}
          title={`Driver's License (Front)`}
          uploadedAt={documents[0].uploadedAt}
          status={documents[0].status}
        />
        <DocumentCard
          url={documents[0].url}
          title={`Driver's License (Back)`}
          uploadedAt={documents[0].uploadedAt}
          status={documents[0].status}
        />
        <DocumentCard
          url={documents[0].url}
          title={`Selfie with License`}
          uploadedAt={documents[0].uploadedAt}
          status={documents[0].status}
        />
      </div>
      <div className="flex items-center justify-start gap-2">
        <button className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-950 transition-colors duration-300 rounded-md px-10 py-2 text-white text-xs font-semibold font-text leading-5 border border-emerald-500 cursor-pointer">
          <CircleCheckBig className="size-3.5" />
          <span>Approve</span>
        </button>

        <button className="flex items-center gap-1.5 bg-transparent hover:bg-red-500 transition-colors duration-300 rounded-md px-10 py-2 text-red-500 hover:text-red-100 text-xs font-semibold font-text leading-5 border border-red-500 cursor-pointer">
          <CircleX className="size-3.5" />
          <span>Approve</span>
        </button>
      </div>
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
