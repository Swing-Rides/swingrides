"use client";

import SubscriberDetailPage from "@/components/superAdminPages/pages/subscriberDetailPage";
import { useGetAdminSubscriberByIdQuery } from "@/app/store/services/adminApi";

type SubscriberDetailPageClientProps = {
  slug: string;
};

export default function SubscriberDetailPageClient({
  slug,
}: SubscriberDetailPageClientProps) {
  const { data, isLoading, isError } = useGetAdminSubscriberByIdQuery(slug);

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-gray-500">Loading subscriber details...</div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="p-6 text-sm text-red-600">
        Failed to load subscriber details.
      </div>
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
