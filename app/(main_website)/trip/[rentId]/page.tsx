import RentalDetailPage from "@/components/pages/rentalDetailPage";
import { testGuestUserProfile } from "@/constants/profile";

export default async function SingleTripPage({
  params,
}: {
  params: Promise<{ rentId: string }>;
}) {
  const { rentId } = await params;

  const content = testGuestUserProfile.rentals?.find(
    (item) => item.rentId.trim().toLowerCase() === rentId.trim().toLowerCase(),
  );

  // const carContent = carsTestData.find(
  //         car => car.id === content?.car.carId
  // )

  if (!content) {
    return <div>This page can not be found</div>;
  }

  return (
    <div>
      <RentalDetailPage
        rentId={content.rentId}
        status={content.status}
        pickUpDate={content.pickUpDate}
        returnDate={content.returnDate}
        pickUpLocation={content.pickupLocation}
        price={content.price}
        totalPaid={content.totalPaid}
        tripCost={content.tripCost}
        features={content.car.features}
        featuredImage={{ src: content.car.imageUrl, alt: content.car.carName }}
        carName={content.car.carName}
        carType={content.car.carType}
        transmission={undefined}
        seats={undefined}
        year={content.car.manufactureYear}
        plateNumber={content.car.plateNumber}
        averageRating={undefined}
        reviews={undefined}
        rentals={content}
      />
    </div>
  );
}
