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
}

export interface VehicleHealthOverview {
  healthy: number;
  dueSoon: number;
  overdue: number;
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
  lastServiceDate: Date;
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
  page?: number;
  limit?: number;
}

export type NextServiceDueMode = "mileage" | "date";

export interface LogServiceModalRequest {
  vehicle: string;
  serviceType: string;
  serviceDate?: string;
  mileageAtServiceKm: number;
  cost: number;
  providerOrWorkshop: string;
  nextServiceDueMode: NextServiceDueMode;
  nextDueMileageKm?: number;
  nextDueDate?: string;
  notes?: string;
}
