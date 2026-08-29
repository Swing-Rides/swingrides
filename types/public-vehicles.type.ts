export type PublicRentalType = "any" | "per day" | "per hour" | "per week";

export type PublicVehicleSortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "rating-asc"
  | "name-asc";

export interface PublicBrowseVehiclesQuery {
  search?: string;
  rentalType?: PublicRentalType;
  availableOnly?: boolean;
  priceMin?: number;
  priceMax?: number;
  vehicleTypes?: string[];
  seats?: string[];
  transmissions?: string[];
  locations?: string[];
  sort?: PublicVehicleSortOption;
  page?: number;
  limit?: number;
}

export interface PublicBrowseVehicleRow {
  id: string;
  slug: string;
  featuredImage: {
    src: string;
    alt: string;
  };
  carName: string;
  status: "available" | "unavailable";
  price: {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  specifications: {
    seats: number;
    fuelType: string;
    transmission: string;
  };
  reviewsAndRatings: {
    averageRating: number;
    totalRatings: number;
  };
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface PublicBrowseVehiclesResponse {
  success: boolean;
  data: {
    rows: PublicBrowseVehicleRow[];
    priceRange: {
      min: number;
      max: number;
    };
    filters: {
      vehicleTypes: { id: string; title: string }[];
      seats: { id: string; title: string }[];
      transmissions: { id: string; title: string }[];
      locations: { id: string; title: string }[];
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface VehicleDetails {
  id: string;
  slug: string;
  images: string[];
  featuredImage: {
    src: string;
    alt: string;
  };
  carName: string;
  mileage: number;
  make: string;
  vehicleModel: string;
  vehicleType: string;
  year: number;
  color: string;
  description: string;
  status: "available" | "unavailable";
  price: {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  specifications: {
    seats: number;
    fuelType: string;
    transmission: string;
  };
  reviewsAndRatings: {
    averageRating: number;
    totalRatings: number;
  };
  location: string;
  host: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    rating: number;
    createdAt: Date;
    totalReviews: number;
    isVerified: boolean;
  };

  policyNumber: string;
  insuranceProvider: string;
  insuranceExpiration: Date;
  streetAdress: string;
  city: string;
  zipCode: string;
  state: string;
  insuranceDaily: number;
  taxRate: number;
  insuranceFee?: number;

  engine: string;
  horsepower: string;
  driverType: string;
  fuelEfficiency: string;
  doors: string;
  vehicleSchedule?: VehicleSchedule[];
  bookingStartDate?: string | Date | null;
  bookingReturnDate?: string | Date | null;
  bookingStartTime?: string | null;
  bookingReturnTime?: string | null;
}

export type VehicleSchedule = {
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  status: string;
  bookingId?: string;
  maintenanceId?: string;
  source?: "booking" | "maintenance";
  serviceType?: string;
};

export interface RenterBookingDetailResponse {
  id: string;
  rentId: string;
  referenceCode: string;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  vehicleId: string;
  vehicleName: string;
  vehicleDetails: string;
  pickupDate: string;
  returnDate: string;
  location: string;
  pickupLocation: string;
  totalAmount: number;
  subtotal: number;
  tax: number;
  taxRate: number;
  bookingType: "daily" | "weekly" | "monthly";
  status: "Upcoming" | "Active" | "Completed" | "Cancelled";
  createdAt: Date;
  licensePlate?: string;
  price: string;
  totalPaid: string;
  tripCost: string;
  tripDurationDays: string;
  pickupStreet?: string;
  pickupCity?: string;
  state?: string;
  postalCode?: string;
  pickupTime?: string;
  returnTime?: string;
  rentalRate: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  car: {
    carId: string;
    imageUrl: string;
    carName: string;
    carType: string;
    manufactureYear: number;
    plateNumber: string;
    features: string[];
  };
  host: {
    hostId: string;
    hostName: string;
    hostSlug: string;
    contactNumber: string;
  };
  transmission?: string;
  seats?: number;
  averageRating?: number;
  reviews?: unknown[];
  mileage: number;
}
