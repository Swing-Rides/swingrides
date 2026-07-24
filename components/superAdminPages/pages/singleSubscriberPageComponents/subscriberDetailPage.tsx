"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { ChevronRight as BreadcrumbChevron, DollarSign, Calendar, Car, TrendingUp } from "lucide-react";
import { GraphDataType } from "../../charts/salesChart";
import { SalesChart } from "../../dashboard/dynamicImport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdminSubscriberByIdDataFleet,
  BookingRow,
  BillingRow,
} from "@/types/subscribers.type";
import { SubscriberDetailPageProps, SlugType } from "./subscriberDetail.types";
import PageIntro from "./pageIntro";
import OverviewCard from "./overviewCard";
import HeaderActionsMenu from "./headerActionsMenu";
import DataTable from "./dataTable";
import { formatNumberToUSD } from "../../utils/formatNumbertoUSD";

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
        <div className="w-full md:w-fit flex items-center justify-end gap-3">
          <HeaderActionsMenu
            organisationName={organisation.name}
            onSuspend={() => console.log("Suspend account confirmed")}
            onUpgrade={() => console.log("Upgrade plan confirmed")}
            onVerify={() => console.log("Verification check confirmed")}
          />
        </div>
      </div>

      {/* Overview cards */}
      <div className="flex flex-wrap gap-4 my-3 md:mt-10.5 md:mb-10">
        <OverviewCard
          icon={
            <div className="size-12 bg-indigo-50 rounded-[10px] flex justify-center items-center">
              <Car className="text-blue-700 size-6" />
            </div>
          }
          title="Total Vehicles"
          number={vehicles}
        />
        <OverviewCard
          icon={
            <div className="size-12 bg-sky-100 rounded-[10px] flex justify-center items-center">
              <Calendar className="text-cyan-600 size-6" />
            </div>
          }
          title="Active Bookings"
          number={activeBookings}
        />
        <OverviewCard
          icon={
            <div className="size-12 bg-green-100 rounded-[10px] flex justify-center items-center">
              <DollarSign className="text-emerald-500 size-6" />
            </div>
          }
          title="Monthly Revenue (MRR)"
          number={formatNumberToUSD(monthlyRevenue)}
        />
        <OverviewCard
          icon={
            <div className="size-12 bg-orange-50 rounded-[10px] flex justify-center items-center">
              <TrendingUp className="text-amber-500 size-6" />
            </div>
          }
          title="Total Revenue"
          number={formatNumberToUSD(totalEarning)}
        />
      </div>

      {/* Revenue chart */}
      <div className="p-3 md:p-6 bg-white rounded-lg border border-gray-200">
        <SalesChart graphData={revenueTrend} />
      </div>

      {/* Tabs — table + its data are grouped together per tab */}
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