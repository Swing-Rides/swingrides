'use client'

import FleetForm, { FleetFormValues } from '@/components/hostComponents/forms/fleetForm'
import { HOST_DASHBOARD_PATH } from '@/constants/constant'
import { useRouter } from 'next/navigation'

const FLEET_MOCK_DATA: FleetFormValues = {
        vehicleName: "Model 3 Performance",
        make: "Tesla",
        model: "Model 3",
        year: 2025,
        color: "Deep Blue Metallic",
        vehicleType: "Sedan",

        insuranceCarrier: "Geico",
        insurancePolicyNumber: "GEC-99887766",
        insuranceExpiration: "2027-06-18",

        licensePlate: "T-DRIVE-2025",
        vin: "5YJ3E1EA5NF123456",

        priceDaily: 120,
        priceWeekly: 750,
        priceMonthly: 2800,

        status: "active",
        instantlyAvailable: true,

        transmission: "Automatic",
        seats: 5,
        mileage: 12500,

        pickupAddress: "123 Tech Park Ave",
        city: "San Francisco",

        // vehicleImages and vehicleRegistration are undefined in this sample
        description: "High-performance electric sedan with Full Self-Driving capability and premium audio system.",
        pickupInstructions: "Vehicle is located in the parking garage at spot 42. Please use the mobile app to unlock."
};


type EditFleetComponentsProps = {
        fleetId: string;
}

export default function EditFleetComponents({ fleetId }: EditFleetComponentsProps) {

        const vehicleDefaults = FLEET_MOCK_DATA

        const router = useRouter()

        const handleSubmit = async (values: FleetFormValues) => {
                // TODO: replace with real API call
                console.log('updating fleet:', values)
                router.push(`${HOST_DASHBOARD_PATH}fleet`)
        }

        return (
                <div className='p-3 md:p-8 flex flex-col gap-6'>
                        <div className='flex items-center justify-between gap-4'>
                                <div className='flex flex-col gap-1'>
                                        <h2 className='text-neutral-950 text-2xl font-semibold font-text'>
                                                Edit Vehicle: {fleetId}
                                        </h2>
                                        <span className='text-gray-500 text-sm font-normal font-text'>
                                                Update vehicle information and settings
                                        </span>
                                </div>
                                <div className='flex gap-3 shrink-0'>
                                        <button
                                                type='button'
                                                onClick={() => router.back()}
                                                className='py-2.5 px-6 border border-[#E5E7EB] text-[#6B7280] rounded-xs font-medium font-text hover:bg-[#F3F4F6] transition-colors duration-200 cursor-pointer'
                                        >
                                                Cancel
                                        </button>
                                        <button
                                                type='submit'
                                                form='fleet-form'
                                                className='py-2.5 px-6 bg-blue-700 hover:bg-blue-900 text-white rounded-xs font-medium font-text transition-colors duration-200 cursor-pointer'
                                        >
                                                Save Changes
                                        </button>
                                </div>
                        </div>

                        <FleetForm
                                formId='fleet-form'
                                defaultValues={vehicleDefaults}
                                onSubmit={handleSubmit}
                        />
                </div>
        )
}