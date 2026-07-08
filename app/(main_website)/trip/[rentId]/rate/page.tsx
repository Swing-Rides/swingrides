"use client";

import { useGetBookingByIdQuery } from "@/app/store/services/renterApi";
import RateTripPageComponent from "@/components/pages/rateTripPage";
import { DEFAULT_IMAGE_SRC } from "@/constants/constant";
import { useParams } from "next/navigation";

export default function TripRatePage() {
  const params = useParams();
  const rentId = params.rentId as string;
  const { data, isLoading, isError } = useGetBookingByIdQuery({ id: rentId });

  if (isLoading) {
    return <main>Loading trip details...</main>;
  }

  if (isError || !data?.data) {
    return <main>This page can not be found</main>;
  }

  const rental = data.data;

  return (
    <main>
      <RateTripPageComponent
        bookingId={rental.id}
        rentalId={rental.rentId}
        imageUrl={rental.car.imageUrl || DEFAULT_IMAGE_SRC}
        carName={rental.car.carName}
        pickUpDate={rental.pickupDate}
        returnDate={rental.returnDate}
        tripDurationDays={rental.tripDurationDays || "Trip duration unavailable"}
      />
    </main>
  );
}
