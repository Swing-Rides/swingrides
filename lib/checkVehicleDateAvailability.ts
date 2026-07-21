// ─── Date range overlap ─────────────────────────────────────────────────────

export const dateRangesOverlap = (
        startA: Date,
        endA: Date,
        startB: Date,
        endB: Date,
) => startA <= endB && endA >= startB;

// ─── Vehicle availability ───────────────────────────────────────────────────

export type AvailabilityVehicle = {
        _id: string;
        status: string;
        instantlyAvailable: boolean;
};

export type AvailabilityBooking = {
        vehicleId: string;
        status: string;
        pickupDate: string;
        returnDate: string;
};

/**
 * True if `vehicle` is active/instantly-bookable and has no overlapping,
 * still-active booking for the requested date range.
 */
export const isVehicleAvailable = (
        vehicle: AvailabilityVehicle | undefined,
        bookings: AvailabilityBooking[],
        startDate: Date,
        endDate: Date,
) => {
        if (!vehicle) return false;
        if (vehicle.status !== "active" || !vehicle.instantlyAvailable) {
                return false;
        }

        return !bookings.some((booking) => {
                if (booking.vehicleId !== vehicle._id) return false;
                if (["cancelled", "completed"].includes(booking.status)) return false;

                return dateRangesOverlap(
                        startDate,
                        endDate,
                        new Date(booking.pickupDate),
                        new Date(booking.returnDate),
                );
        });
};

/** Convenience wrapper that looks the vehicle up by id first. */
export const checkVehicleAvailability = (
        vehicleId: string,
        vehicles: AvailabilityVehicle[],
        bookings: AvailabilityBooking[],
        startDate: Date,
        endDate: Date,
) => {
        const vehicle = vehicles.find((item) => item._id === vehicleId);
        return isVehicleAvailable(vehicle, bookings, startDate, endDate);
};