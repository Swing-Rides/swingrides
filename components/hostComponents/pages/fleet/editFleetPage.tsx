"use client";

import {
  useGetVehicleQuery,
  useUpdateVehicleMutation,
} from "@/app/store/services/hostApi";
import FleetForm, {
  FleetFormValues,
} from "@/components/hostComponents/forms/fleetForm";
import { Spinner } from "@/components/ui/spinner";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import { useRouter } from "next/navigation";

type EditFleetComponentsProps = {
  fleetId: string;
};

const normalizeTransmission = (value?: string): string => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const normalizeVehicleType = (value?: string): string => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const normalizeStatus = (value?: string): string => {
  if (!value) return "";
  const lower = value.toLowerCase();
  if (lower === "active") return "Available";
  if (lower === "unavailable") return "Maintenance";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export default function EditFleetComponents({
  fleetId,
}: EditFleetComponentsProps) {
  const router = useRouter();

  const { data: vehicleResponse, isFetching } = useGetVehicleQuery(fleetId);
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();

  const vehicle = vehicleResponse?.data;

  const vehicleDefaults: Partial<FleetFormValues> = vehicle
    ? {
        city: vehicle.city,
        color: vehicle.colour,
        description: vehicle.description,
        instantlyAvailable: vehicle.instantlyAvailable,
        insuranceCarrier: vehicle.insuranceCarrier ?? "",
        insuranceExpiration: vehicle.insuranceExpiration ?? "",
        insurancePolicyNumber: vehicle.insurancePolicyNumber ?? "",
        licensePlate: vehicle.licensePlate,
        make: vehicle.make,
        mileage: vehicle.mileage,
        model: vehicle.vehicleModel,
        pickupInstructions: vehicle.pickupInstructions ?? "",
        priceDaily: vehicle.dailyPrice,
        priceMonthly: vehicle.monthlyPrice,
        priceWeekly: vehicle.weeklyPrice,
        seats: vehicle.seats,
        status: normalizeStatus(vehicle.status),
        transmission: normalizeTransmission(vehicle.transmission),
        vehicleName: vehicle.name,
        vehicleType: normalizeVehicleType(vehicle.vehicleType),
        vin: vehicle.vin,
        year: vehicle.year,
        vehicleImageUrls: vehicle.images ?? [],
        pickupAddressStreet: vehicle.pickupLocation,
        pickupAddressState: vehicle.pickupAddressState,
        dailyInsuranceFee: vehicle.dailyInsuranceFee,
        zipCode: vehicle.zipCode,
        fuelType: vehicle.fuelType,
        doors: vehicle.doors,
        fuelEfficiency: vehicle.fuelEfficiency,
        engine: vehicle.engine,
        driveType: vehicle.driveType,
        horsePower: vehicle.horsePower,
      }
    : {};

  const handleSubmit = async (values: FleetFormValues) => {
    const payload = {
      city: values.city,
      colour: values.color,
      dailyPrice: Number(values.priceDaily),
      description: values.description,
      instantlyAvailable: values.instantlyAvailable,
      licensePlate: values.licensePlate,
      make: values.make,
      mileage: Number(values.mileage),
      monthlyPrice: Number(values.priceMonthly),
      name: values.vehicleName,
      pickupInstructions: values.pickupInstructions,
      seats: Number(values.seats),
      insuranceCarrier: values.insuranceCarrier,
      insurancePolicyNumber: values.insurancePolicyNumber,
      insuranceExpiration: values.insuranceExpiration || undefined,
      status:
        values.status.toLowerCase() === "available"
          ? "active"
            : values.status.toLowerCase() === "maintenance"
          ? "unavailable"
            : values.status.toLowerCase(),
      transmission: values.transmission.toLowerCase(),
      vehicleModel: values.model,
      vehicleType: values.vehicleType.toLowerCase(),
      vin: values.vin,
      weeklyPrice: Number(values.priceWeekly),
      year: Number(values.year),
      pickupLocation: values.pickupAddressStreet,
      pickupAddressState: values.pickupAddressState,
      zipCode: values.zipCode,
      dailyInsuranceFee: values.dailyInsuranceFee,
      fuelType: values.fuelType.toLowerCase(),
      doors: Number(values.doors),
      fuelEfficiency: values.fuelEfficiency,
      engine: values.engine,
      driveType: values.driveType.toLowerCase(),
      horsePower: Number(values.horsePower),
    };

    await updateVehicle({ vehicleId: fleetId, data: payload }).unwrap();
    router.push(`${HOST_DASHBOARD_PATH}fleet`);
  };

  return (
    <div className="p-3 md:p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-neutral-950 text-2xl font-semibold font-text">
            Edit Vehicle: {vehicle?.name}
          </h2>
          <span className="text-gray-500 text-sm font-normal font-text">
            {isFetching
              ? "Loading current vehicle details..."
              : "Update vehicle information and settings"}
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
            disabled={isFetching || isUpdating}
            className="py-2.5 px-6 border border-blue-700 bg-blue-700 hover:bg-blue-950 hover:border-blue-950 text-white text-xs rounded-xs font-medium font-text transition-colors duration-300 cursor-pointer"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <FleetForm
        key={`${fleetId}-${vehicle?.updatedAt ?? "query"}`}
        formId="fleet-form"
        defaultValues={vehicleDefaults}
        onSubmit={handleSubmit}
      />

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
          {isUpdating ? (<span className="flex items-center gap-2 justify-start">
            <Spinner /> Saving...</span>) : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
