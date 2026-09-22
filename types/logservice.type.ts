export interface LogServiceRequest {
  vehicleName: string;
  serviceType: string;
  date: string;
  mileageKm: number;
  cost: number;
  workshop: string;
  nextDueDate: string;
  nextDueMileageKm: number;
  receiptUrl?: string;
}

export interface MaintenanceSummary {
  totalServices: number;
  totalMaintenanceCost: number;
  vehiclesDueSoon: number;
  overdueVehicles: number;
  /**
   * True when a filter narrowed the service history. The two vehicle counts
   * above stay fleet-wide, so the cards need to say so when the totals beside
   * them only describe the filtered rows.
   */
  isFiltered: boolean;
}

export interface VehicleHealthOverview {
  healthy: number;
  dueSoon: number;
  overdue: number;
  /** Vehicles with no maintenance log yet — otherwise invisible on this page. */
  neverServiced: number;
}

/** Distinct values across the whole history, for the table's filter dropdowns. */
export interface MaintenanceFilterOptions {
  serviceTypes: string[];
  vehicleNames: string[];
  workshops: string[];
}

export interface PaginatedServiceHistory {
  items: ServiceHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServiceHistoryItem {
  id: string;
  vehicleName: string;
  serviceType: string;
  date: Date;
  mileageKm: number;
  cost: number;
  workshop: string;
  notes?: string;
  receiptUrl?: string;
  nextDueDate: Date;
  nextDueMileageKm?: number;
}

export interface ServiceAlertItem {
  vehicleName: string;
  serviceType: string;
  lastServiceDate: Date | null;
  currentMileageKm: number;
  dueDate: Date;
  badge: string;
}

export interface MaintainanceData {
  summary: MaintenanceSummary;
  vehicleHealthOverview: VehicleHealthOverview;
  serviceAlerts: {
    overdue: ServiceAlertItem[];
    dueSoon: ServiceAlertItem[];
    upcoming: ServiceAlertItem[];
  };
  serviceHistory: PaginatedServiceHistory;
  filterOptions: MaintenanceFilterOptions;
}

export interface MaintenanceDashboardResponse {
  success: boolean;
  data: MaintainanceData;
  message?: string;
}

export interface MaintenanceDashboardQuery {
  search?: string;
  vehicle?: string;
  serviceType?: string;
  workshop?: string;
  page?: number;
  limit?: number;
}

export type NextServiceDueMode = "mileage" | "date" | "both";

export interface LogServiceModalRequest {
  vehicle: string;
  serviceType: string;
  serviceDate?: string;
  mileageAtServiceKm: number;
  cost: number;
  providerOrWorkshop: string;
  nextServiceDueMode?: NextServiceDueMode;
  nextDueMileageKm?: number;
  nextDueDate?: string;
  notes?: string;
}

/** Partial edit of an existing log — only changed fields are sent. */
export interface UpdateServiceRequest {
  vehicle?: string;
  serviceType?: string;
  serviceDate?: string;
  mileageAtServiceKm?: number;
  cost?: number;
  providerOrWorkshop?: string;
  nextDueMileageKm?: number;
  nextDueDate?: string;
  notes?: string;
}

export interface MaintenanceMutationResponse {
  success: boolean;
  message: string;
  data?: ServiceHistoryItem;
}
