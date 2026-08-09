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
