export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  termsAgreement: boolean;
}

export type RenterUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: Date;
};

export interface CreateUserResponse {
  success: true;
  renter: RenterUser;
  message: string;
}

export type LoginRenterData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
};

export interface LoginUserResponse {
  success: true;
  renter: LoginRenterData;
  message: string;
}

export interface GetRenterProfileResponse {
  success: true;
  renter: RenterProfileResponse;
}

export interface RenterProfileResponse {
  id: string;
  userAvaterUrl: string;
  userName: string;
  fullName: string;
  userLevel: string;
  email: string;
  memberSince: string;
  phoneNumber: string;
  totalSpentByUser: string;
  rentals: Array<{
    rentId: string;
    status: "Upcoming" | "Active" | "Completed" | "Cancelled";
    hostRatingForGuest: number | string;
    pickUpDate: string;
    returnDate: string;
    pickupLocation: string;
    price: string;
    tripDurationDays: string;
    tripCost: string;
    totalPaid: string;
    pickupStreet?: string;
    pickupCity?: string;
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
  }>;
}
