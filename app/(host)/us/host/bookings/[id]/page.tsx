import SingleBookingPageComponent from '@/components/hostComponents/pages/bookingsPageComponents/singleBookingPageComponents';

export default async function BookingPage({
        params,
}: {
        params: Promise<{ id: string }>;
}) {
        const { id } = await params;

        return (
                <SingleBookingPageComponent 
                        id={id}
                />
        )
}
