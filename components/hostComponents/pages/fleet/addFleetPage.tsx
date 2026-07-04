"use client";

import { useAddVehicleMutation } from "@/app/store/services/hostApi";
import FleetForm, {
  FleetFormValues,
} from "@/components/hostComponents/forms/fleetForm";
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
      make: values.make,
      mileage: Number(values.mileage),
      monthlyPrice: Number(values.priceMonthly),
      pickupLocation: values.pickupAddress,
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
      console.log("payload for backend adding fleet:", response);
    } else {
      console.error("Failed to add vehicle:", response.message);
    }
  };

  return (
    <div className="p-3 md:p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
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
            className="py-2.5 px-6 border border-[#E5E7EB] text-[#6B7280] rounded-xs font-medium font-text hover:bg-[#F3F4F6] transition-colors duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="fleet-form"
            className="py-2.5 px-6 bg-blue-700 hover:bg-blue-900 text-white rounded-xs font-medium font-text transition-colors duration-200 cursor-pointer"
          >
            {isLoading ? "Adding..." : "Add Vehicle"}
          </button>
        </div>
      </div>

      <FleetForm formId="fleet-form" onSubmit={handleSubmit} />
    </div>
  );
}
