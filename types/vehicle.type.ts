export type ReviewType = {
  id: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
};

export type RatingsBreakdownType = {
  starNumber: number;
  starRated: number;
};

export type ReviewsAndRatingsType = {
  averageRating: number;
  totalReviews: number;
  totalRatings?: number;
  starRatingBreakdown: RatingsBreakdownType[];
  reviews: ReviewType[];
};

export type CarSpecificationsType = {
  make: string;
  model: string;
  year: number;
  bodyType: string;
  engine: string;
  horsepower: number;
  transmission: string;
  driveType: string;
  fuelType: string;
  fuelEfficiency: string;
  seats: number;
  doors: number;
  color: string;
  mileage: string;
  features?: string[];
};

export type HostInfoType = {
  id?: string;
  hostName: string;
  memberSince: string;
  tripsCompleted: number;
  rating: number;
  contactNumber: string;
};

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
  dailyInsuranceFee?: number;
  status?: string;
  instantlyAvailable: boolean;
  transmission: string;
  seats: number;
  mileage: number;
  fuelType?: string;
  doors?: number;
  fuelEfficiency?: string;
  engine?: string;
  driveType?: string;
  horsePower?: number;
  pickupLocation: string;
  city: string;
  pickupAddressState?: string;
  zipCode?: string;
  images: string[];
  vehicleRegistrationUrl?: string;
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
  dailyInsuranceFee?: number;
  fuelType?: string;
  doors?: number;
  fuelEfficiency?: string;
  engine?: string;
  driveType?: string;
  horsePower?: number;
  pickupAddressState?: string;
  zipCode?: string;
  vehicleRegistrationUrl?: string;
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
