import BookingDetailPage from '@/components/superAdminPages/pages/bookingDetailPage'
import { subscribersTestData } from '@/constants/superAdminSidebar';

export default async function BookingPage({
                params,
        }: {
                params: Promise<{ id: string }>
        }) {

        const { id } = await params

        const subscriber = subscribersTestData.find((item) =>
                item.booking.some(
                        (booking) => booking.id.toLowerCase() === id.toLowerCase()
                )
        );

        const booking = subscriber?.booking.find(
                (item) => item.id.toLowerCase() === id.toLowerCase()
        );

        const parentSlug = subscriber?.slug

        if (!booking) {
                return <div>This page cannot be found</div>;
        }

        return (
                <>
                        <BookingDetailPage 
                                {...booking} 
                                parentSlug={parentSlug}
                                organisationName={"Metro Fleet Solutions"}
                                subscriptionPlan={"professional"}
                                hostEmail={"contact@metrofleet.com"}
                                bookingPaymentStatus={"paid"}
                                paymentDateTime={"Mar 14, 2026 at 3:45 PM"}
                        />
                </>
        )
}
