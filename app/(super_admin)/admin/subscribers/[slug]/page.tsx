import SubscriberDetailPage from "@/components/superAdminPages/pages/subscriberDetailPage";
import { fetchAdminSubscriberById } from '@/app/services/subscribers'


export default async function SubscriberPage({
        params,
}: {
        params: Promise<{ slug: string }>
}) {
        const { slug } = await params

        const response = await fetchAdminSubscriberById(slug)
        const data = response.data

        // console.log(data)

        const { subscriber, stats, trend, fleet, billingHistory, activityLog, actions } = data

        const revenue = trend.data.map((d) => ({
                month: d.month,
                totalRevenue: d.revenue,
        }))

        const fleetRows = fleet.map((f) => ({
                id: f.id,
                fleetId: f.fleetId,
                vehicleName: f.vehicleName,
                status: f.status,
                dailyRate: f.dailyRate,
                lastBooking: f.lastBooking,
        }))

        const billingRows = billingHistory.map((b) => ({
                id: b.id,
                package: b.invoiceNumber,
                status: b.status,
                totalCost: String(b.amount),
                date: b.createdAt,
        }))

        return (
                <div>
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
                                booking={[]} // no bookings in this API response
                                billingHistory={billingRows}
                                canSuspend={actions.canSuspend}
                                canUpgradePlan={actions.canUpgradePlan}
                                activityLog={activityLog}
                                ownerName={subscriber.ownerName}
                                ownerEmail={subscriber.ownerEmail}
                                plan={subscriber.plan}
                                joinedDate={subscriber.joinedDate}
                        />
                </div>
        )
}
