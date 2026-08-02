"use client";

import { useGetBookingByIdQuery } from "@/app/store/services/renterApi";
import RentalDetailPage from "@/components/pages/rentalDetailPage";
import RentalDetailSkeleton from "@/components/pages/rentalDetailPage/tripLoadingState";
import TripNotFoundState from "@/components/pages/rentalDetailPage/tripNotFoundState";
import { useParams } from "next/navigation";
import { format, parse, isValid } from "date-fns";

export default function SingleTripPage() {
  const params = useParams();
  const rentId = params.rentId as string;
  const { data, isLoading, isError } = useGetBookingByIdQuery({ id: rentId });

  if (isLoading) {
    return <RentalDetailSkeleton />;
  }

  if (!data?.data) {
    return (
      <TripNotFoundState
        title="Rental not found"
        message="This rental doesn't exist or may have been removed."
      />
    );
  }

  if (isError) {
    return (
      <TripNotFoundState
        title="Something went wrong"
        message="We couldn't load this rental right now. Please try again later."
      />
    );
  }

  const rental = data.data;
  const rentalDetails = {
    ...rental,
    pickUpDate: rental.pickupDate,
  };
  const checkIn = rentalDetails.checkIn;

  const formatTime = (value?: string) => {
    if (!value) return "";

    const parsed = parse(value, "HH:mm:ss.SSSX", new Date());
    if (isValid(parsed)) {
      return format(parsed, "h:mm a");
    }

    const timeOnly = parse(value, "HH:mm:ss", new Date());
    if (isValid(timeOnly)) {
      return format(timeOnly, "h:mm a");
    }

    const date = new Date(value);
    return isValid(date) ? format(date, "h:mm a") : value;
  };

  const formattedPickupTime = formatTime(rentalDetails?.pickupTime);
  const formattedReturnTime = formatTime(rentalDetails?.returnTime);

  return (
    <div>
      <RentalDetailPage
        rentId={rentalDetails.rentId}
        status={rentalDetails.status}
        pickUpDate={rentalDetails.pickUpDate}
        returnDate={rentalDetails.returnDate}
        pickupTime={formattedPickupTime}
        returnTime={formattedReturnTime}
        pickUpLocation={rentalDetails.pickupLocation}
        tripDurationDays={rentalDetails.tripDurationDays}
        price={rentalDetails.price}
        totalPaid={rentalDetails.totalPaid}
        tripCost={rentalDetails.tripCost}
        features={rentalDetails.car.features}
        featuredImage={{
          src: rentalDetails.car.imageUrl,
          alt: rentalDetails.car.carName,
        }}
        carName={rentalDetails.car.carName}
        carType={rentalDetails.car.carType}
        transmission={rentalDetails.transmission}
        seats={rentalDetails.seats}
        year={rentalDetails.car.manufactureYear}
        plateNumber={rentalDetails.car.plateNumber}
        averageRating={rentalDetails.averageRating}
        reviews={rentalDetails.reviews}
        rentals={rentalDetails}
        verificationDriverLicenseImageSrc={checkIn?.driverLicensePhotoUrl}
        verificationSelfieImageSrc={checkIn?.selfiePhotoUrl}
        vehicleConditionImages={checkIn?.vehicleConditionPhotoUrls ?? []}
        currentMileage={rentalDetails.car.mileage || checkIn?.mileage}
        fuelLevelAtPickup={checkIn?.fuelLevel}
        tripId={rentalDetails.id}
      />
    </div>
  );
}
