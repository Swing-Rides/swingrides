export type RentalRate = {
  daily: number;
  weekly: number;
  monthly: number;
};

export type Rentals = {
  id: string;
  vehicleId?: string;
  rentId: string;
  status: TripStatus;
  hostRatingForGuest?: string | number;
  pickUpDate: string;
  returnDate: string;
  pickupTime?: string;
  returnTime?: string;
  pickupLocation: string;
  price: string;
  tripDurationDays?: string;
  pickupStreet?: string;
  pickupCity?: string;
  state?: string;
  postalCode?: string;
  rentalRate?: RentalRate;
  tripCost: string;
  totalPaid: string;
  car: {
    carId: string;
    imageUrl: string;
    carName: string;
    carType: string;
    manufactureYear: number;
    plateNumber: string;
    features: string[];
    mileage?: number;
  };
  host: {
    hostId: string;
    hostName: string;
    hostSlug: string;
    contactNumber: string;
  };
  checkIn?: {
    driverLicensePhotoUrl?: string;
    selfiePhotoUrl?: string;
    vehicleConditionPhotoUrls: string[];
    mileage?: number;
    fuelLevel?: string;
    notes?: string;
    checkedInAt?: string;
  };
};

export type SingleRent = {
  success: boolean;
  data: Omit<Rentals, "pickUpDate"> & {
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
  reviews?: any[];
    mileage: number
  };
};

export type User = {
  id?: string;
  userAvaterUrl?: string;
  userName?: string;
  fullName?: string;
  userLevel?: string;
  email?: string;
  phoneNumber?: string;
  memberSince?: string;
  totalSpentByUser: string;
  rentals?: Rentals[];
};

export type AccountDetailProps = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  memberSince?: string;
};

export type MainContentProps = {
  rentals?: Rentals[];
};

export type TripCardProps = {
  rentals: Rentals;
};

export type TripStatus = "Upcoming" | "Active" | "Completed" | "Cancelled";

export type ButtonConfig = {
  label: string;
  href: string;
};

export type TripCardButtonProps = {
  label: string;
  href: string;
  status: TripStatus;
};
