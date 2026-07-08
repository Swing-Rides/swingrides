"use client";

import { useGetBookingByIdQuery } from "@/app/store/services/renterApi";
import RentalDetailPage from "@/components/pages/rentalDetailPage";
import { useParams } from "next/navigation";

export default function SingleTripPage() {
  const params = useParams();
  const rentId = params.rentId as string;
  const { data, isLoading, isError } = useGetBookingByIdQuery({ id: rentId });

  if (isLoading) {
    return <div>Loading rental details...</div>;
  }

  if (isError) {
    return <div>This page can not be found</div>;
  }

  if (!data?.data) {
    return <div>This page can not be found</div>;
  }

  const rental = data.data;
  const rentalDetails = {
    ...rental,
    pickUpDate: rental.pickupDate,
  };

  return (
    <div>
      <RentalDetailPage
        rentId={rentalDetails.rentId}
        status={rentalDetails.status}
        pickUpDate={rentalDetails.pickUpDate}
        returnDate={rentalDetails.returnDate}
        pickUpLocation={rentalDetails.pickupLocation}
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
        verificationDriverLicenseImageSrc={""}
        verificationSelfieImageSrc={`/images/swingrides-default-img.webp`}
        vehicleConditionImages={[]}
      />
    </div>
  );
}
