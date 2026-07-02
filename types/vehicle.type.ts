export type CreateVehicle = {
  name: string;
  make: string;
  vehicleModel: string;
  year: number;
  colour: string;
  vehicleType: string;
  licensePlate: string;
  vin: string;
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  instantlyAvailable: boolean;
  transmission: string;
  seats: number;
  mileage: number;
  pickupLocation: string;
  city: string;
  images: string[];
  description: string;
  insuranceCarrier?: string;
  insurancePolicyNumber?: string;
  insuranceExpiration?: string;
  pickupInstructions?: string;
};

export type CreateVehicleResponse = {
  success: boolean;
  message: string;
  data: CreateVehicle;
};

export interface IListVehiclesResponse {
  success: boolean;
  data: IListVehiclesDatum[];
  summary: IListVehiclesSummary;
  pagination: Pagination;
}

export interface IListVehiclesDatum {
  _id: string;
  licensePlate: string;
  city: string;
  colour: string;
  createdAt: Date;
  dailyPrice: number;
  description: string;
  images: string[];
  instantlyAvailable: boolean;
  make: string;
  mileage: number;
  monthlyPrice: number;
  name: string;
  pickupLocation: string;
  seats: number;
  status: string;
  transmission: string;
  updatedAt: Date;
  vehicleModel: string;
  vehicleType: string;
  vin: string;
  weeklyPrice: number;
  year: number;
  snoozeStart?: string;
  snoozeEnd?: string;
  insuranceCarrier?: string;
  insurancePolicyNumber?: string;
  insuranceExpiration?: string;
  pickupInstructions?: string;
  totalTrips?: number;
  totalRevenue?: number;
  totalExpenses?: number;
  netEarnings?: number;
}

export interface Pagination {
  currentPage: string;
  totalPages: number;
  totalItems: number;
  itemsPerPage: string;
}

export interface IListVehiclesSummary {
  totalVehicles: number;
  available: number;
  currentlyRented: number;
  inService: number;
  fleetValue: number;
  fleetValueFormatted: string;
}

export type IVehicleDataFilters = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  vehicleType?: string;
};
