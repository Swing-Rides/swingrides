"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Rentals } from "../pages/profilePages/types";
import { X } from "lucide-react";
import GuestCheckInForm, {
  GuestCheckInFormValues,
} from "../forms/guestCheckInForm";
import {
  normalizeRentalDetail,
  useStartVehicleCheckInMutation,
} from "@/app/store/services/renterApi";

type StartVehicleCheckInProps = {
  rentals?: Rentals[];
  onComplete: (updatedRental: Rentals) => void;
};

export default function StartVehicleCheckIn({
  rentals,
  onComplete,
}: StartVehicleCheckInProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [startVehicleCheckIn] = useStartVehicleCheckInMutation();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const checkInId = searchParams.get("checkIn");
  const rental = rentals?.find(
    (r) => r.id === checkInId && r.status === "Upcoming",
  );

  const handleClose = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("checkIn");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
    setSubmitError(null);
  }, [searchParams, router, pathname]);

  const handleConfirm = useCallback(
    async (values: GuestCheckInFormValues) => {
      if (!checkInId || !rental) return;
      if (!values.confirmed) return;

      const mileage = Number(String(values.mileage || "").replace(/[^\d.]/g, ""));
      if (!Number.isFinite(mileage) || mileage < 0) return;

      try {
        setIsSubmitting(true);
        setSubmitError(null);

        if (
          !values.vehicleConditionPhotoUrls?.length ||
          !values.driverLicensePhotoUrl ||
          !values.selfiePhotoUrl
        ) {
          return;
        }

        const response = await startVehicleCheckIn({
          id: checkInId,
          mileage,
          fuelLevel: values.fuelLevel,
          vehicleConditionPhotoUrls: values.vehicleConditionPhotoUrls,
          driverLicensePhotoUrl: values.driverLicensePhotoUrl,
          selfiePhotoUrl: values.selfiePhotoUrl,
          notes: values.notes,
        }).unwrap();

        onComplete(normalizeRentalDetail(response.data) as Rentals);
        handleClose();
      } catch (error) {
        console.error("Failed to start vehicle check-in:", error);
        setSubmitError("Unable to start check-in. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [checkInId, handleClose, onComplete, rental, startVehicleCheckIn],
  );

  if (!checkInId || !rental) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-[10px] shadow-xl w-full max-w-lg mx-4 p-6 flex flex-col gap-5 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 left-0 border-b pb-3 md:pb-5 bg-white flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[#1F2937] text-lg font-bold font-text leading-6">
              Start Check-In
            </h2>
            <span className="text-gray-500 text-xs font-normal font-text">
              {rental.car.carName} · {rental.car.plateNumber}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-neutral-950 transition-colors duration-300 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-0.5 overflow-y-auto">
          <p className="text-gray-500 text-xs font-normal font-text leading-5">
            Upload vehicle condition photos and confirm mileage and fuel level.
            This protects both you and the host.
          </p>

          {/* Form */}
          {submitError ? (
            <div className="p-3 rounded-md bg-red-50 text-red-700 text-xs font-medium font-text">
              {submitError}
            </div>
          ) : null}
          <GuestCheckInForm
            onClose={handleClose}
            onSubmit={handleConfirm}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
