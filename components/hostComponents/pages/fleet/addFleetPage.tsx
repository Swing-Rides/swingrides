"use client";

import { useAddVehicleMutation } from "@/app/store/services/hostApi";
import FleetForm, {
  FleetFormValues,
} from "@/components/hostComponents/forms/fleetForm";
import { Spinner } from "@/components/ui/spinner";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import { CreateVehicle } from "@/types/vehicle.type";
import { useRouter } from "next/navigation";

export default function AddFleetPage() {
  const router = useRouter();
  const [addVehicle, { isLoading }] = useAddVehicleMutation();

  const handleSubmit = async (values: FleetFormValues) => {
    const payload: CreateVehicle = {
      city: values.city,
      colour: values.color,
      dailyPrice: Number(values.priceDaily),
      description: values.description,
      images: values.vehicleImageUrls ?? [],
      instantlyAvailable: values.instantlyAvailable,
      licensePlate: values.licensePlate,
      insuranceCarrier: values.insuranceCarrier,
      insuranceExpiration: values.insuranceExpiration,
      insurancePolicyNumber: values.insurancePolicyNumber,
      dailyInsuranceFee: Number(values.dailyInsuranceFee),
      make: values.make,
      fuelType: values.fuelType.toLowerCase(),
      doors: Number(values.doors),
      fuelEfficiency: values.fuelEfficiency,
      engine: values.engine,
      driveType: values.driveType.toLowerCase(),
      horsePower: Number(values.horsePower),
      mileage: Number(values.mileage),
      monthlyPrice: Number(values.priceMonthly),
      pickupLocation: values.pickupAddressStreet,
      pickupAddressState: values.pickupAddressState,
      zipCode: values.zipCode,
      seats: Number(values.seats),
      name: values.vehicleName,
      transmission: values.transmission.toLowerCase(),
      vehicleModel: values.model,
      vehicleType: values.vehicleType.toLowerCase(),
      vin: values.vin,
      weeklyPrice: Number(values.priceWeekly),
      year: Number(values.year),
    };
    const response = await addVehicle(payload).unwrap();
    if (response.success) {
      router.push(`${HOST_DASHBOARD_PATH}fleet`);
      // console.log("payload for backend adding fleet:", response);
    } else {
      console.error("Failed to add vehicle:", response.message);
    }
  };

  return (
    <div className="p-3 md:p-8 flex flex-col gap-6">
      <div className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-neutral-950 text-2xl font-semibold font-text">
            Add New Vehicle
          </h2>
          <span className="text-gray-500 text-sm font-normal font-text">
            Fill in the details to add a vehicle to your fleet
          </span>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => router.back()}
            className="py-2.5 px-6 border border-gray-700 text-neutral-700 text-xs rounded-xs font-medium font-text hover:border-red-500 hover:text-red-500 transition-colors duration-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="fleet-form"
            className="py-2.5 px-6 border border-blue-700 bg-blue-700 hover:bg-blue-950 hover:border-blue-950 text-white text-xs rounded-xs font-medium font-text transition-colors duration-300 cursor-pointer"
          >
            {isLoading ? (<span className="flex items-center gap-2 justify-start">
              <Spinner/> Adding...</span>) : "Add Vehicle"}
          </button>
        </div>
      </div>

      <FleetForm formId="fleet-form" onSubmit={handleSubmit} />

      {/* BOTTOM BUTTONS */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-2.5 px-6 border border-gray-700 text-neutral-700 text-xs rounded-xs font-medium font-text hover:border-red-500 hover:text-red-500 transition-colors duration-300 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="fleet-form"
          className="flex-1 py-2.5 px-6 border border-blue-700 bg-blue-700 hover:bg-blue-950 hover:border-blue-950 text-white text-xs rounded-xs font-medium font-text transition-colors duration-300 cursor-pointer"
        >
          {isLoading ? (<span className="flex items-center gap-2 justify-start">
            <Spinner /> Adding...</span>) : "Add Vehicle"}
        </button>
      </div>
    </div>
  );
}
