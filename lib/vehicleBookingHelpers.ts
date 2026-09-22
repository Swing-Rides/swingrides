import { VehicleSchedule } from "@/types/public-vehicles.type";

export const BUFFER_TIME = 2;

const getReturnDateWithBuffer = (
  returnDate: Date,
  bufferHours = BUFFER_TIME,
) => {
  const buffered = new Date(returnDate);
  buffered.setUTCHours(buffered.getUTCHours() + bufferHours);
  return buffered;
};

export const isPickupDateTimeAvailable = (
  vehicleSchedule: VehicleSchedule[],
  pickupDateTime: Date,
  bufferHours = BUFFER_TIME,
): boolean => {
  return !vehicleSchedule.some((schedule) => {
    const schedPickupDate = new Date(schedule.pickupDate);
    const schedReturnDateWithBuffer = getReturnDateWithBuffer(
      new Date(schedule.returnDate),
      bufferHours,
    );

    return (
      pickupDateTime >= schedPickupDate &&
      pickupDateTime < schedReturnDateWithBuffer
    );
  });
};

export const isReturnDateTimeAvailable = (
  vehicleSchedule: VehicleSchedule[],
  returnDateTime: Date,
  bufferHours = BUFFER_TIME,
): boolean => {
  return !vehicleSchedule.some((schedule) => {
    const schedPickupDate = new Date(schedule.pickupDate);
    const schedReturnDateWithBuffer = getReturnDateWithBuffer(
      new Date(schedule.returnDate),
      bufferHours,
    );

    return (
      returnDateTime >= schedPickupDate &&
      returnDateTime < schedReturnDateWithBuffer
    );
  });
};

export const doesRentalPeriodOverlapSchedule = (
  vehicleSchedule: VehicleSchedule[],
  pickupDateTime: Date,
  returnDateTime: Date,
  bufferHours = BUFFER_TIME,
): boolean => {
  return vehicleSchedule.some((schedule) => {
    const schedPickupDate = new Date(schedule.pickupDate);
    const schedReturnDateWithBuffer = getReturnDateWithBuffer(
      new Date(schedule.returnDate),
      bufferHours,
    );

    return (
      pickupDateTime < schedReturnDateWithBuffer &&
      returnDateTime > schedPickupDate
    );
  });
};

export const isScheduleDateDisabled = (
  vehicleSchedule: VehicleSchedule[],
  date: Date,
  bufferHours = BUFFER_TIME,
): boolean => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(dayStart);
  dayEnd.setHours(23, 59, 59, 999);

  return vehicleSchedule.some((schedule) => {
    const schedPickupDate = new Date(schedule.pickupDate);
    const schedReturnDateWithBuffer = getReturnDateWithBuffer(
      new Date(schedule.returnDate),
      bufferHours,
    );

    return dayStart < schedReturnDateWithBuffer && dayEnd >= schedPickupDate;
  });
};

type SnoozeWindow = {
  status?: string;
  snoozeStart?: string | Date | null;
  snoozeEnd?: string | Date | null;
};

const toDateOrNull = (value?: string | Date | null): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Mirrors the backend's assertVehicleNotSnoozed: a snoozed vehicle is blocked
 * until dates outside its window are chosen, and a scheduled (future) snooze
 * blocks only the periods that overlap it.
 */
export const isBlockedBySnooze = (
  vehicle: SnoozeWindow | undefined,
  pickupDateTime?: Date | null,
  returnDateTime?: Date | null,
): boolean => {
  if (!vehicle) return false;

  const snoozeStart = toDateOrNull(vehicle.snoozeStart);
  const snoozeEnd = toDateOrNull(vehicle.snoozeEnd);
  const isSnoozed = vehicle.status === "snoozed";

  if (!isSnoozed && !snoozeStart && !snoozeEnd) return false;
  if (!isSnoozed && snoozeEnd && snoozeEnd <= new Date()) return false;

  if (!pickupDateTime || !returnDateTime) return isSnoozed;

  const windowStart = snoozeStart?.getTime() ?? Number.NEGATIVE_INFINITY;
  const windowEnd = snoozeEnd?.getTime() ?? Number.POSITIVE_INFINITY;

  return (
    pickupDateTime.getTime() < windowEnd &&
    returnDateTime.getTime() > windowStart
  );
};
