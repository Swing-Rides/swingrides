import { redirect } from 'next/navigation'
import GuestProfilePage from "@/components/pages/profilePages/guestProfilePage";
import { testGuestUserProfile } from '@/constants/profile';
// import { carsTestData } from '@/constants/carsTestData';

export default function ProfilePage() {

        const user = testGuestUserProfile.id || null

        if (!user) {
                redirect('/sign-in')
        }

        // const userRentedCars = carsTestData.filter((item) =>
        //         testGuestUserProfile.rentals?.some((rental) => rental.car.carId === item.id)
        // )

        // console.log(userRentedCars)
        // console.log(userRentedCars.length)

        return (
                <main>
                        <GuestProfilePage 
                                {...testGuestUserProfile}
                        />
                </main>
        )
}
