import RentalDetailPage from '@/components/pages/rentalDetailPage';
import { carsTestData } from '@/constants/carsTestData';
import { testGuestUserProfile } from '@/constants/profile';

export default async function SingleTripPage({
        params,
}: {
        params: Promise<{ rentId: string }>
}) {

        const { rentId } = await params
       
        const content = testGuestUserProfile.rentals?.find(
                item => item.rentId.trim().toLowerCase() === rentId.trim().toLowerCase()
        );

        const carContent = carsTestData.find(
                car => car.id === content?.car.carId
        )

        // console.log(carContent)
        // console.log(content?.car.carId)

        if (!content) {
                return (
                        <div>
                                This page can not be found
                        </div>
                )
        }

        return (
                <div>
                        {/* This is the page {rentId} */}
                        <RentalDetailPage
                                rentId={content.rentId}
                                status={content.status}
                                pickUpDate={content.pickUpDate}
                                returnDate={content.returnDate}
                                pickUpLocation={content.pickupLocation}
                                price={content.price}
                                totalPrice={"$9999999"}
                                features={content.car.features}
                                featuredImage={carContent?.featuredImage}
                                carName={carContent?.carName}
                                carType={carContent?.specifications.bodyType}
                                transmission={carContent?.specifications.transmission}
                                seats={carContent?.specifications.seats}
                                year={carContent?.specifications.year}
                                plateNumber={carContent?.plateNumber}
                                averageRating={carContent?.reviewsAndRatings.averageRating}
                                reviews={carContent?.reviewsAndRatings.reviews}
                                rentals={content}
                        />
                </div>
        )
}