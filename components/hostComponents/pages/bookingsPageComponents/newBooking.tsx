"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays } from "date-fns";
import PageWrapper from "../../dashboard/pageWrapper";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import NewBookingForm, {
  NewBookingFormValues,
} from "../../forms/newBookingForm";
import {
  useGetHostProfileQuery,
  useListVehcleQuery,
} from "@/app/store/services/hostApi";
import { useListBookingsQuery } from "@/app/store/services/bookingApi";

const FORM_ID = "new-booking-form";
const getPendingHostCheckoutStorageKey = (vehicleId: string) =>
  `swingrides:host-booking-checkout:${vehicleId}`;

const dateRangesOverlap = (
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
) => startA <= endB && endA >= startB;

const getNextReferenceCode = (references: string[]) => {
  const currentYear = new Date().getFullYear();
  const maxSequence = references.reduce((max, reference) => {
    const match = reference.match(/^SR-\d{4}-(\d{4})$/);
    if (!match) return max;
    const value = Number(match[1]);
    if (Number.isNaN(value)) return max;
    return Math.max(max, value);
  }, 0);

  return `SR-${currentYear}-${String(maxSequence + 1).padStart(4, "0")}`;
};

const calculateBookingAmounts = (
  vehicle: {
    dailyPrice: number;
    weeklyPrice: number;
    monthlyPrice: number;
    insuranceDailyRate: number;
  },
  pickupDate: string,
  returnDate: string,
  hostProvidesInsurance: boolean,
) => {
  const totalDays = Math.max(
    differenceInCalendarDays(new Date(returnDate), new Date(pickupDate)),
    0,
  );

  let baseTotal = 0;
  if (totalDays >= 30) {
    const months = Math.floor(totalDays / 30);
    const remainingDays = totalDays % 30;
    baseTotal =
      months * vehicle.monthlyPrice + remainingDays * vehicle.dailyPrice;
  } else if (totalDays >= 7) {
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    baseTotal =
      weeks * vehicle.weeklyPrice + remainingDays * vehicle.dailyPrice;
  } else {
    baseTotal = totalDays * vehicle.dailyPrice;
  }

  // Insurance is only charged when the host is providing it, and always at
  // the flat per-day rate × the exact number of days — never converted to
  // weekly/monthly units the way the base rental rate is (21 days is 21
  // days, not 3 weeks).
  const insuranceFee = hostProvidesInsurance
    ? totalDays * vehicle.insuranceDailyRate
    : 0;

  const subtotal = baseTotal + insuranceFee;
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const totalAmount = subtotal + tax;

  return {
    totalDays,
    baseTotal,
    insuranceFee,
    subtotal,
    taxRate,
    tax,
    totalAmount,
  };
};

export default function NewBookingPageComponent() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { data } = useGetHostProfileQuery();
  const {
    data: vehiclesResponse,
    isLoading: isVehiclesLoading,
    isError: isVehiclesError,
  } = useListVehcleQuery({ limit: 100 });
  const {
    data: bookingsResponse,
    isLoading: isBookingsLoading,
    isError: isBookingsError,
  } = useListBookingsQuery();

  const availableVehicles = useMemo(() => {
    return (vehiclesResponse?.data ?? []).filter(
      (vehicle) => vehicle.status === "active" && vehicle.instantlyAvailable,
    );
  }, [vehiclesResponse]);

  const bookingRows = useMemo(
    () => bookingsResponse?.data ?? [],
    [bookingsResponse?.data],
  );
  const bookingId = useMemo(
    () =>
      getNextReferenceCode(bookingRows.map((booking) => booking.referenceCode)),
    [bookingRows],
  );

  // Stable references — required so NewBookingForm's use()-backed promises
  // don't get recreated (and re-suspended) on every render
  const fetchVehicles = useCallback(async () => {
    return availableVehicles.map((vehicle) => ({
      id: vehicle._id,
      name: vehicle.name,
      imageUrl: vehicle.images[0] || "/images/placeholder-car.png",
      dailyPrice: vehicle.dailyPrice,
      weeklyPrice: vehicle.weeklyPrice,
      monthlyPrice: vehicle.monthlyPrice,
      insuranceDailyRate: vehicle.dailyInsuranceFee ?? 0,
    }));
  }, [availableVehicles]);

  const checkAvailability = useCallback(
    async (vehicleId: string, startDate: Date, endDate: Date) => {
      const selectedVehicle = availableVehicles.find(
        (vehicle) => vehicle._id === vehicleId,
      );

      if (!selectedVehicle) return false;
      if (
        selectedVehicle.status !== "active" ||
        !selectedVehicle.instantlyAvailable
      ) {
        return false;
      }

      return !bookingRows.some((booking) => {
        if (booking.vehicleId !== vehicleId) return false;
        if (["cancelled", "completed"].includes(booking.status)) return false;

        return dateRangesOverlap(
          startDate,
          endDate,
          new Date(booking.pickupDate),
          new Date(booking.returnDate),
        );
      });
    },
    [availableVehicles, bookingRows],
  );

  // Returns both the tax amount and the rate so the UI can display "Tax (8%)"
  const fetchTax = useCallback(async (subtotal: number) => {
    const rate = data?.data.taxFee as number;
    return { amount: subtotal * rate, rate };
  }, [data?.data.taxFee]);

  const handleSubmit = useCallback(
    async (values: NewBookingFormValues) => {
      setSubmitError(null);

      const renterName = `${values.firstName} ${values.lastName}`.trim();
      const location = [
        values.streetAddress,
        values.pickupCity,
        values.pickupState,
        values.postalCode,
      ]
        .filter(Boolean)
        .join(", ");

      try {
        const isAvailable = await checkAvailability(
          values.vehicleId,
          new Date(values.pickupDate),
          new Date(values.returnDate),
        );

        if (!isAvailable) {
          setSubmitError(
            "The selected vehicle is not available for the chosen dates.",
          );
          return;
        }

        const vehicle = availableVehicles.find(
          (item) => item._id === values.vehicleId,
        );

        if (!vehicle) {
          setSubmitError("The selected vehicle could not be found.");
          return;
        }

        const pricing = calculateBookingAmounts(
          {
            dailyPrice: vehicle.dailyPrice,
            weeklyPrice: vehicle.weeklyPrice,
            monthlyPrice: vehicle.monthlyPrice,
            insuranceDailyRate: vehicle.dailyInsuranceFee ?? 0,
          },
          values.pickupDate,
          values.returnDate,
          values.hostProvidesInsurance,
        );

        if (pricing.totalDays <= 0) {
          setSubmitError("Return date must be after pickup date.");
          return;
        }

        const pendingCheckout = {
          vehicleId: values.vehicleId,
          renterName,
          renterEmail: values.email,
          renterPhone: values.phoneNumber,
          pickupDate: values.pickupDate,
          returnDate: values.returnDate,
          location,
          streetAddress: values.streetAddress,
          city: values.pickupCity,
          state: values.pickupState,
          postalCode: values.postalCode,
          pickupTime: values.pickupTime,
          returnTime: values.returnTime,
          subtotal: pricing.subtotal,
          tax: pricing.tax,
          taxRate: pricing.taxRate,
          insuranceFee: pricing.insuranceFee,
          totalAmount: pricing.totalAmount,
          totalDays: pricing.totalDays,
          vehicleName: vehicle.name,
          vehicleImageUrl: vehicle.images?.[0] || "/images/placeholder-car.png",
          vehicleDailyPrice: vehicle.dailyPrice,
          vehicleWeeklyPrice: vehicle.weeklyPrice,
          vehicleMonthlyPrice: vehicle.monthlyPrice,
          hostProvidesInsurance: values.hostProvidesInsurance,
          insuranceProvider: values.hostProvidesInsurance
            ? undefined
            : values.insuranceProvider,
          insurancePolicyNumber: values.hostProvidesInsurance
            ? undefined
            : values.insurancePolicyNumber,
          insuranceExpiryDate: values.hostProvidesInsurance
            ? undefined
            : values.insuranceExpiryDate,
        };

        window.sessionStorage.setItem(
          getPendingHostCheckoutStorageKey(values.vehicleId),
          JSON.stringify(pendingCheckout),
        );

        router.push(
          `${HOST_DASHBOARD_PATH}bookings/new-booking/checkout/${values.vehicleId}`,
        );
      } catch (error) {
        const fallbackMessage = "Unable to create booking. Please try again.";
        const errorMessage =
          typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data &&
          typeof error.data.message === "string"
            ? error.data.message
            : fallbackMessage;

        setSubmitError(errorMessage);
      }
    },
    [availableVehicles, checkAvailability, router],
  );

  const isPageLoading = isVehiclesLoading || isBookingsLoading;
  const hasPageError = isVehiclesError || isBookingsError;

  return (
    <PageWrapper
      pageTitle="New Booking"
      pageDescription={`Auto-generated ref: ${bookingId}`}
      pageButton={
        <button
          type="submit"
          form={FORM_ID}
          className="px-6 py-2 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          Continue to Checkout
        </button>
      }
    >
      <div className="mt-4 md:mt-6">
        {hasPageError ? (
          <p className="text-sm font-medium text-red-600">
            Unable to load booking setup data. Please refresh and try again.
          </p>
        ) : isPageLoading ? (
          <p className="text-sm font-medium text-gray-500">
            Loading available vehicles...
          </p>
        ) : (
          <>
            {submitError ? (
              <p className="mb-4 text-sm font-medium text-red-600">
                {submitError}
              </p>
            ) : null}
            <NewBookingForm
              formId={FORM_ID}
              bookingId={bookingId}
              fetchVehicles={fetchVehicles}
              checkAvailability={checkAvailability}
              fetchTax={fetchTax}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </div>
    </PageWrapper>
  );
}
