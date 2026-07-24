"use client";

import SubscriberDetailPage from "@/components/superAdminPages/pages/singleSubscriberPageComponents/subscriberDetailPage";
import { useGetAdminSubscriberByIdQuery } from "@/app/store/services/adminApi";
import { SubscriberDetailPageSkeleton } from "../../loadingSkeletons/subscriberDetailPageSkeleton";
import ErrorStateUI from "../../dashboard/errorState";

type SubscriberDetailPageClientProps = {
  slug: string;
};

export default function SubscriberDetailPageClient({
  slug,
}: SubscriberDetailPageClientProps) {
  const { data, isLoading, isError } = useGetAdminSubscriberByIdQuery(slug);

  if (isLoading) {
    return (
      <SubscriberDetailPageSkeleton />
    );
  }

  if (isError || !data?.data) {
    return (
      <ErrorStateUI
        title="We couldn't load this subscriber"
        description="Something went wrong while fetching this subscriber. Please check your connection and try again."
      />
    );
  }

  const { subscriber, stats, trend, fleet, billingHistory, activityLog, actions } =
    data.data;

  const revenue = trend.data.map((d) => ({
    month: d.month,
    totalRevenue: d.revenue,
  }));

  const fleetRows = fleet.map((f) => ({
    id: f.id,
    fleetId: f.fleetId,
    vehicleName: f.vehicleName,
    status: f.status,
    dailyRate: f.dailyRate,
    lastBooking: f.lastBooking,
  }));

  const billingRows = billingHistory.map((b) => ({
    id: b.id,
    package: b.invoiceNumber,
    status: b.status,
    totalCost: String(b.amount),
    date: b.createdAt,
  }));

  return (
    <SubscriberDetailPage
      slug={slug}
      organisation={{ name: subscriber.organization }}
      status={subscriber.status}
      vehicles={stats.totalVehicles}
      activeBookings={stats.activeBookings}
      monthlyRevenue={stats.monthlyRevenueMrr}
      totalEarning={stats.totalRevenue}
      revenue={revenue}
      fleet={fleetRows}
      booking={[]}
      billingHistory={billingRows}
      canSuspend={actions.canSuspend}
      canUpgradePlan={actions.canUpgradePlan}
      activityLog={activityLog}
      ownerName={subscriber.ownerName}
      ownerEmail={subscriber.ownerEmail}
      plan={subscriber.plan}
      joinedDate={subscriber.joinedDate}
    />
  );
}
