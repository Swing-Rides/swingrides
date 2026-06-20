import EditFleetPage from '@/components/hostComponents/pages/fleet/editFleetPage'
import { FleetFormValues } from '@/components/hostComponents/forms/fleetForm';


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

export default function EditVehiclePage() {
        return (
                <EditFleetPage 
                        vehicleDefaults={FLEET_MOCK_DATA}
                />
        )
}
