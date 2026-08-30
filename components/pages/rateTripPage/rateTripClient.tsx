"use client";

import React from "react";
import { useGetBookingByIdQuery } from "@/app/store/services/renterApi";
import RateTripPageComponent from "@/components/pages/rateTripPage";
import { DEFAULT_IMAGE_SRC } from "@/constants/constant";

export default function RateTripClient({ rentId }: { rentId: string }) {
  const { data, isLoading, isError } = useGetBookingByIdQuery({ id: rentId });

  if (isLoading) {
    return <div className="p-8 text-center">Loading trip details...</div>;
  }

  if (isError || !data?.data) {
    return <div className="p-8 text-center text-red-600">This page cannot be found</div>;
  }

  const rental = data.data;

  return (
    <RateTripPageComponent
      bookingId={rental.id}
      rentalId={rental.rentId}
      imageUrl={rental.car?.imageUrl || DEFAULT_IMAGE_SRC}
      carName={rental.car?.carName || "Vehicle"}
      pickUpDate={rental.pickupDate}
      returnDate={rental.returnDate}
      tripDurationDays={rental.tripDurationDays || "Trip duration unavailable"}
    />
  );
}
