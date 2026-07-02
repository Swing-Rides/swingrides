"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageWrapper from "../../dashboard/pageWrapper";
import Link from "next/link";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import { useListBookingsQuery } from "@/app/store/services/bookingApi";
import AllBookingsTable, { BookingRecordsRow } from "./allBookingsTable";
import UpcomingBookingsRecordsTable, {
  UpcomingBookingRecordsRow,
} from "./upcomingRecordsTable";
import LateReturnsTable, { LateReturnsTableRow } from "./lateReturnsTable";
import DamageAlertTable, { DamageAlertTableRow } from "./damageAlertTable";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function BookingsPageComponents() {
  const { data, isLoading, isError } = useListBookingsQuery();

  const bookings = data?.data ?? [];
  const allBookingsRows: BookingRecordsRow[] = data?.allBookingsRows ?? [];
  const upcomingRows: UpcomingBookingRecordsRow[] = data?.upcomingRows ?? [];
  const lateReturnRows: LateReturnsTableRow[] = data?.lateReturnRows ?? [];
  const damageRows: DamageAlertTableRow[] = data?.damageRows ?? [];

  const activeCount = bookings.filter(
    (booking) => booking.status === "checked_in" || booking.status === "in_progress",
  ).length;
  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;
  const completedCount = bookings.filter((booking) => booking.status === "completed").length;
  const revenueMtd = bookings
    .filter((booking) => {
      const date = new Date(booking.updatedAt);
      const now = new Date();
      return (
        booking.status === "completed" &&
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      );
    })
    .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

  return (
    <PageWrapper
      pageTitle="Bookings"
      pageDescription="Manage all your rentals and reservations"
      pageButton={<PageButton />}
    >
      <div className="mt-4 md:mt-8 space-y-5">
        <div className="flex flex-wrap items-center gap-4">
          <OverviewCard
            title="Total Bookings"
            number={String(bookings.length)}
            numberColor="text-neutral-950"
            label="All time"
          />
          <OverviewCard
            title="Active"
            number={String(activeCount)}
            numberColor="text-emerald-500"
            label="Currently rented"
          />
          <OverviewCard
            title="Pending"
            number={String(pendingCount)}
            numberColor="text-amber-500"
            label="Awaiting confirmation"
          />
          <OverviewCard
            title="Completed"
            number={String(completedCount)}
            numberColor="text-gray-500"
            label="This month"
          />
          <OverviewCard
            title="Revenue MTD"
            number={currency.format(revenueMtd)}
            numberColor="text-emerald-500"
            label="This month"
          />
        </div>
        {isError ? (
          <p className="text-sm font-medium text-red-600">
            Unable to load bookings. Please try again.
          </p>
        ) : null}
        <div>
          <Suspense>
            <BookingPageTab
              allBookingsRows={allBookingsRows}
              upcomingRows={upcomingRows}
              lateReturnRows={lateReturnRows}
              damageRows={damageRows}
              isLoading={isLoading}
            />
          </Suspense>
        </div>
      </div>
    </PageWrapper>
  );
}

const PageButton = () => {
  return (
    <Link
      href={`${HOST_DASHBOARD_PATH}bookings/new-booking`}
      className="px-6 py-2 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300"
    >
      New Booking
    </Link>
  );
};

type OverviewCardProps = {
  title: string;
  number: string;
  numberColor: string;
  label: string;
};

const OverviewCard = ({
  title,
  number,
  numberColor,
  label,
}: OverviewCardProps) => {
  return (
    <div className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
      <div>
        <span className="text-gray-500 text-xs font-semibold font-text uppercase">
          {title}
        </span>
      </div>
      <div className="self-stretch h-9 relative">
        <span className={`text-3xl font-medium font-text ${numberColor}`}>
          {number}
        </span>
      </div>
      <div>
        <span className="justify-start text-gray-500 text-xs font-normal font-text">
          {label}
        </span>
      </div>
    </div>
  );
};

const bookingsTabTitle = [
  { value: "allBookings", title: "All Bookings" },
  { value: "upcomingReturns", title: "Upcoming Returns" },
  { value: "lateReturns", title: "Late Returns" },
  { value: "damageAlerts", title: "Damage Alerts" },
];

type BookingPageTabProps = {
  allBookingsRows: BookingRecordsRow[];
  upcomingRows: UpcomingBookingRecordsRow[];
  lateReturnRows: LateReturnsTableRow[];
  damageRows: DamageAlertTableRow[];
  isLoading: boolean;
};

const BookingPageTab = ({
  allBookingsRows,
  upcomingRows,
  lateReturnRows,
  damageRows,
  isLoading,
}: BookingPageTabProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") ?? "allBookings";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full space-y-4 md:space-y-6"
    >
      <TabsList variant="line" className="gap-20 border-b-2">
        {bookingsTabTitle.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="flex gap-2 item-center justify-start data-[state=active]:text-blue-700 group-data-[variant=line]/tabs-list:data-active:after:bg-blue-700 cursor-pointer"
          >
            {item.title}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="allBookings">
        <AllBookingsTable tableData={isLoading ? [] : allBookingsRows} />
      </TabsContent>
      <TabsContent value="upcomingReturns">
        <UpcomingBookingsRecordsTable tableData={isLoading ? [] : upcomingRows} />
      </TabsContent>
      <TabsContent value="lateReturns">
        <LateReturnsTable tableData={isLoading ? [] : lateReturnRows} />
      </TabsContent>
      <TabsContent value="damageAlerts">
        <DamageAlertTable tableData={isLoading ? [] : damageRows} />
      </TabsContent>
    </Tabs>
  );
};
