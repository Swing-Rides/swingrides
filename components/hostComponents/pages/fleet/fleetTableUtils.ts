import {
  IListVehiclesDatum,
  IListVehiclesResponse,
} from "@/types/vehicle.type";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FleetTableRow = IListVehiclesDatum & { id: string };

export type VehicleStatus =
  | "available"
  | "rented"
  | "unlisted"
  | "snoozed"
  | "maintenance";

export interface VehicleInfo {
  make?: string;
  model?: string;
  color?: string;
  body?: string;
  transmission?: string;
  fuelType?: string;
  seats?: string | number;
  vin?: string;
  vehicleId?: string;
}

export interface MaintenanceInfo {
  lastService?: string;
  maintenanceType?: string;
  nextDue?: string;
  remainDuration?: string;
  status?: string;
}

export interface FleetRow {
  id: string;
  licensePlate: string;
  vehicleName: string;
  vehicleType: string;
  vehicleColor: string;
  year?: string;
  status: VehicleStatus;
  dailyPrice: string;
  weeklyPrice?: string;
  monthlyPrice?: string;
  monthlyEarnings: string;
  availability: string;
  mileage?: string;
  images?: string[];
  totalTrips?: string;
  totalRevenue?: string;
  totalExpenses?: string;
  netEarnings?: string;
  vehicleInfo?: VehicleInfo;
  maintenance?: MaintenanceInfo;
  // Only meaningful when status is "snoozed" — used to prefill the
  // Edit Snooze form. Populate these from your snooze record.
  snoozeStart?: string;
  snoozeEnd?: string;
}

export type VehicleDetailSheetProps = {
  row: FleetRow;
  onRelistVehicle: () => void;
  onCreateBooking?: () => void;
  onEndSnoozeEarly?: () => void;
  onMarkMaintenance: () => void;
};

export type FleetTableProps = {
  onDeleteVehicle: (row: IListVehiclesDatum) => void | Promise<void>;
  onUnlistVehicle: (row: IListVehiclesDatum) => void;
  onRelistVehicle: (row: IListVehiclesDatum) => void;
  onSnoozeVehicle: (row: IListVehiclesDatum) => void;
  onEditSnoozeVehicle: (row: IListVehiclesDatum) => void;
  onCreateBooking?: (row: IListVehiclesDatum) => void;
  onEndSnoozeEarly?: (row: IListVehiclesDatum) => void;
  onMarkMaintenance: (row: IListVehiclesDatum) => void | Promise<void>;
  data?: IListVehiclesResponse["data"];
  pagination?: IListVehiclesResponse["pagination"];
  rowsPerPage?: number;
  isLoading?: boolean;
  isError?: boolean;
};

export type SheetHeaderProps = {
  id: string;
  vehicleName: string;
  type: string;
  color: string;
  year?: string;
  status: VehicleStatus | string;
  onUnlistVehicle: () => void;
  onRelistVehicle: () => void;
  onEditSnoozeVehicle: () => void;
  onSnoozeVehicle: () => void;
};

// ─── Utilities ────────────────────────────────────────────────────────────────

export function normalizeVehicleStatus(status: string): VehicleStatus {
  const normalized = status.trim().toLowerCase();

  if (normalized === "active") return "available";
  if (normalized === "inactive") return "available";
  if (normalized === "unavailable") return "maintenance";

  if (
    [
      "available",
      "rented",
      "unlisted",
      "snoozed",
      "maintenance",
      "inactive",
    ].includes(normalized)
  ) {
    return normalized as VehicleStatus;
  }
  return "unlisted";
}

export function deriveVehicleStatus(
  vehicle: Pick<IListVehiclesDatum, "status" | "instantlyAvailable">,
): VehicleStatus {
  if (
    vehicle.status.trim().toLowerCase() === "active" &&
    !vehicle.instantlyAvailable
  ) {
    return "rented";
  }

  return normalizeVehicleStatus(vehicle.status);
}

export function formatDaysLeft(days: number): string {
  if (days <= 0) return "Today";
  return `${days} day${days === 1 ? "" : "s"} left`;
}

export function getDaysLeftFromDate(dateValue?: string): number | null {
  if (!dateValue) return null;
  const target = new Date(dateValue);
  if (Number.isNaN(target.getTime())) return null;

  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const startOfTarget = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.ceil(
    (startOfTarget.getTime() - startOfToday.getTime()) / MS_PER_DAY,
  );
}

export function deriveAvailabilityLabel(row: FleetTableRow): string {
  const rowWithDynamicFields = row as FleetTableRow &
    Partial<{
      availability: string;
      availabilityLabel: string;
      availabilityText: string;
      daysLeft: number | string;
      remainingDays: number | string;
      bookingDaysLeft: number | string;
      endDate: string;
      bookingEndDate: string;
      snoozeEnd: string;
    }>;

  const directLabel =
    rowWithDynamicFields.availability ||
    rowWithDynamicFields.availabilityLabel ||
    rowWithDynamicFields.availabilityText;

  if (directLabel && String(directLabel).trim().length > 0) {
    return String(directLabel);
  }

  const daysLeftSource =
    rowWithDynamicFields.daysLeft ??
    rowWithDynamicFields.remainingDays ??
    rowWithDynamicFields.bookingDaysLeft;

  if (daysLeftSource !== undefined && daysLeftSource !== null) {
    const parsed = Number(daysLeftSource);
    if (!Number.isNaN(parsed)) {
      return formatDaysLeft(Math.max(0, Math.ceil(parsed)));
    }
  }

  const dateDerivedDaysLeft =
    getDaysLeftFromDate(rowWithDynamicFields.bookingEndDate) ??
    getDaysLeftFromDate(rowWithDynamicFields.endDate) ??
    getDaysLeftFromDate(rowWithDynamicFields.snoozeEnd);

  if (dateDerivedDaysLeft !== null) {
    return formatDaysLeft(Math.max(0, dateDerivedDaysLeft));
  }

  if (["maintenance", "unavailable", "unlisted"].includes(row.status)) {
    return "In service";
  }
  if (row.status === "rented") return "Rented";
  if (row.status === "snoozed") return "Snoozed";

  return row.instantlyAvailable ? "Instantly Available" : "On Request";
}

export function parsePrice(value?: string): number {
  if (!value) return 0;
  const num = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isNaN(num) ? 0 : num;
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function formatFuelType(fuelType?: string): string {
  if (!fuelType) return "";
  const normalized = fuelType.trim().toLowerCase();
  if (
    normalized === "gas/petrol" ||
    normalized === "gas / petrol" ||
    normalized === "petrol/gas" ||
    normalized === "petrol / gas" ||
    normalized === "petrol" ||
    normalized === "gas"
  ) {
    return "Gas";
  }
  return fuelType;
}

