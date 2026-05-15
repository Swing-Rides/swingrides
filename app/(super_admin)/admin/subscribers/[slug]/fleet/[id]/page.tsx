import VehicleDetailPage from '@/components/superAdminPages/pages/vehicleDetailPage'
import { carsTestData } from '@/constants/carsTestData';
import { subscribersTestData } from '@/constants/superAdminSidebar';
import Link from 'next/link';

export default async function FleetPage({
                params,
        }: {
                params: Promise<{ id: string }>
        }) {

        const { id } = await params

        const subscriber = subscribersTestData.find((item) =>
                item.fleet.some(
                        (fleet) => fleet.id.toLowerCase() === id.toLowerCase()
                )
        );

        const fleet = subscriber?.fleet.find(
                (item) => item.id.toLowerCase() === id.toLowerCase()
        );

        const parentSlug = subscriber?.slug

        if (!fleet) {
                return (
                        <div className='text-center w-full h-full grid place-content-center gap-4'>
                                <div className='space-y-2'>
                                        <h3 className='font-text text-base'>
                                                This is Fleet ID: <span className='font-bold'> {id} </span> is not avaliable on the platform.                                        
                                        </h3>
                                        <span className='font-text text-3xl font-bold'>
                                                Page cannot be found 
                                        </span>
                                        <div className='mt-2.5'>
                                                <Link 
                                                        href={'/admin'}
                                                        className='text-blue-700 underline hover:text-blue-900 duration-300 transition-color'
                                                >
                                                        Go back to overview
                                                </Link>
                                        </div>
                                </div>
                        </div>
                );
        }
        return (
                <div>
                        <VehicleDetailPage 
                                carName={carsTestData[2].carName}
                                parentSlug={parentSlug}
                                status={carsTestData[2].status}
                                bodyType={carsTestData[2].specifications.bodyType}
                                color={carsTestData[2].specifications.color}
                                year={carsTestData[2].specifications.year}
                                gallery={carsTestData[2].gallery}
                                make={carsTestData[2].specifications.make} 
                                model={carsTestData[2].specifications.model} 
                                transmission={carsTestData[2].specifications.transmission} 
                                fuelType={carsTestData[2].specifications.fuelType}
                                seats={carsTestData[2].specifications.seats}
                                plateNumber={carsTestData[2].plateNumber}
                                vin={"sample-vin-1234567"}
                                vehicleId={carsTestData[2].id}
                                dailyRate={carsTestData[2].price.daily}
                                weeklyRate={carsTestData[2].price.weekly}
                                monthlyRate={carsTestData[2].price.monthly}
                                mileage={carsTestData[2].specifications.mileage}
                                totalTrips={carsTestData[2].host.tripsCompleted}
                                totalRevenue={8945}
                                totalExpenses={1372.50}
                                lastService={"Feb 15, 2026"}
                                nextService={"Dec 15, 2026"}
                                maintenanceStatus={"up to date"}
                                organisationName={"Metro Fleet Solutions"}
                                subscriptionPlan={"professional"}
                                hostEmail={"contact@metrofleet.com"}
                        />
                </div>
        )
}
