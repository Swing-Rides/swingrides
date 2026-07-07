import {
  HostInfoType,
  ReviewsAndRatingsType,
  CarSpecificationsType,
  ReviewType,
  RatingsBreakdownType,
} from "@/types/vehicle.type";
import { CarsFilterParams } from "./util";
import { FleetStatus } from "@/types/subscribers.type";

export type CarPageComponentProp = {
  carName: string;
  featuredImage: {
    src: string;
    alt: string;
  };
  gallery: {
    id: string;
    src: string;
    alt: string;
  }[];
  reviewsAndRatings: ReviewsAndRatingsType;
  status: FleetStatus;
  specifications: CarSpecificationsType;
  overview: string;
  host: HostInfoType;
  price: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  pickupLocation: string;
  vehicleId: string;
  policyNumber: string;
  insuranceProvider: string;
  insuranceExpiration: Date;
};

export type ImagesSectionProps = {
  gallery: {
    id: string;
    src: string;
    alt: string;
  }[];
  featuredImage: { src: string; alt: string };
};

export type CarDetailCardProps = {
  carName: string;
  status: string;
  reviewsAndRatings: ReviewsAndRatingsType;
  specifications: CarSpecificationsType;
  overview: string;
};

export type OverviewTabProps = {
  overview: string;
  features?: string[];
};

export type SpecificationsTabProps = {
  specifications: CarSpecificationsType;
};

export type SpecificationsContentProps = {
  title: string;
  content: string | number;
};

export type ReviewCardProps = {
  review: ReviewType;
};

export type ReviewTabProps = {
  reviewsAndRatings: ReviewsAndRatingsType;
};

export type StarProgressProps = RatingsBreakdownType & {
  totalRatings: number;
};

export type SideBarProps = {
  filterParams: CarsFilterParams;
  priceRange: {
    min: number;
    max: number;
  };
  effectivePriceMin: number;
  effectivePriceMax: number;
  vehicleTypeOptions: {
    id: string;
    title: string;
  }[];
  seatOptions: {
    id: string;
    title: string;
  }[];
  transmissionOptions: {
    id: string;
    title: string;
  }[];
  onSearch: (value: string) => void;
  onRentalType: (value: string) => void;
  onAvailableOnly: (checked: boolean) => void;
  onPriceRange: (value: [number, number]) => void;
  onCheckboxFilter: (
    key: "vehicleTypes" | "seats" | "transmissions",
    value: string,
  ) => void;
  onResetAll: () => void;
};
