import RateTripPageComponent from "@/components/pages/rateTripPage";

export default async function TripRatePage({
        params,
}: {
        params: Promise<{ rentId: string }>;
}) {
        const { rentId } = await params;

        return (
                <main>
                        <RateTripPageComponent
                                rentalId={rentId}
                                imageUrl={'/images/swingrides-default-img.webp'}
                                carName={'BMW 3 Series'}
                                pickUpDate={'Feb 20'}
                                returnDate={'Feb 24, 2026'}
                                tripDurationDays={'4 days'}
                        />
                </main>
        );
}
