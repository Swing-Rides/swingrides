"use client";

import { useGetBookingByIdQuery } from "@/app/store/services/renterApi";
import CancelTripPage from "@/components/pages/cancelTripPageComponents";
import CancelTripLoading from "@/components/pages/cancelTripPageComponents/cancelTripLoading";
import CancelTripErrorState from "@/components/pages/cancelTripPageComponents/tripErrorState";
import { useParams } from "next/navigation";

export default function CancelTrip() {

        const params = useParams();
        const rentId = params.rentId as string;
        const { data, isLoading, isError } = useGetBookingByIdQuery({ id: rentId });

        if (isLoading) {
                return <CancelTripLoading />
        }

        if (isError || !data?.data) {
                return (
                        <CancelTripErrorState
                                title="Trip not found"
                                description="We couldn't find a booking matching this link. It may have been removed or the link may be incorrect." 
                        />
                );
        }
        
        const rental = data.data;
        const upcomingTrip = rental.status === "Upcoming"
        
        if (!upcomingTrip) {
                return (
                        <CancelTripErrorState
                                title="This trip can't be cancelled"
                                description="Only upcoming trips are eligible for cancellation. If you believe this is an error, please contact support."
                                tripId={rental.id}
                        />
                );
        }
        
        return (
                <main>
                        <CancelTripPage 
                                tripId={rental.id}
                                upcomingTrip={upcomingTrip}
                        />
                </main>
        )
}