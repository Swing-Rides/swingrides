import { 
        CarDataType, 
        ReviewsAndRatingsType, 
        CarSpecificationsType, 
        ReviewType, 
        RatingsBreakdownType 
} from "@/constants/carsTestData";
import { CarsFilterParams } from "./util";

export type CarPageComponentProp = {
        content: CarDataType
}

export type ImagesSectionProps = {
        gallery: { 
                id: string; 
                src: string; 
                alt: string 
        }[];
        featuredImage: { src: string; alt: string }
}

export type CarDetailCardProps = {
        carName: string;
        status: string;
        reviewsAndRatings: ReviewsAndRatingsType;
        specifications: CarSpecificationsType;
        overview: string;
}

export type OverviewTabProps = {
        overview: string;
        features?: string[];
}

export type SpecificationsTabProps = {
        specifications: CarSpecificationsType
}

export type SpecificationsContentProps = {
        title: string;
        content: string | number;
}

export type ReviewCardProps = {
        review: ReviewType
}

export type ReviewTabProps = {
        reviewsAndRatings: ReviewsAndRatingsType;
}

export type StarProgressProps = RatingsBreakdownType & {
        totalRatings: number;
}

export type SideBarProps = {
        filterParams: CarsFilterParams
        priceRange: { 
                min: number; 
                max: number 
        }
        effectivePriceMin: number
        effectivePriceMax: number
        vehicleTypeOptions: { 
                id: string; 
                title: string 
        }[]
        seatOptions: { 
                id: string; 
                title: string 
        }[]
        transmissionOptions: { 
                id: string; 
                title: string 
        }[]
        onSearch: (value: string) => void
        onRentalType: (value: string) => void
        onAvailableOnly: (checked: boolean) => void
        onPriceRange: (value: [number, number]) => void
        onCheckboxFilter: (key: 'vehicleTypes' | 'seats' | 'transmissions', value: string) => void
        onResetAll: () => void
}