export type RentalRate = {
  daily: number;
  weekly: number;
  monthly: number;
};

export type Rentals = {
  id: string;
  rentId: string;
  status: TripStatus;
  hostRatingForGuest?: string | number;
  pickUpDate: string;
  returnDate: string;
  pickupLocation: string;
  price: string;
  tripDurationDays?: string;
  pickupStreet?: string;
  pickupCity?: string;
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
  };
  host: {
    hostId: string;
    hostName: string;
    hostSlug: string;
    contactNumber: string;
  };
};

export type SingleRent = {
  success: boolean;
  data: Omit<Rentals, "pickUpDate"> & {
    referenceCode: string;
    renterName: string;
    renterEmail: string;
    renterPhone: string;
    vehicleId: string;
    vehicleName: string;
    vehicleDetails: string;
    pickupDate: string;
    location: string;
    totalAmount: number;
    subtotal: number;
    tax: number;
    taxRate: number;
    bookingType: "daily" | "weekly" | "monthly";
    createdAt: string;
    transmission?: string;
    seats?: number;
    averageRating?: number;
    reviews?: [];
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
