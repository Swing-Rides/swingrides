import React from "react";
import Image from "next/image";
import { PriBtn } from "../buttons";
import Link from "next/link";
import { DEFAULT_IMAGE_SRC } from "@/constants/constant";
import { isValidImageSrc } from "@/lib/imageHelpers";
import { Fuel, Settings, Users } from "lucide-react";

export type Content = {
  id: string;
  imageUrl: string;
  carName: string;
  price: {
    daily: number;
  };
  reviewsAndRatings: {
    averageRating: number;
    totalRating: number;
  };
  specifications: {
    seats: number;
    fuelType: string;
    transmission: string;
  };
};

export type CarCardProps = {
  slug?: string;
  id: string;
  featuredImage: {
    src: string;
    alt: string;
  };
  carName: string;
  specifications: {
    seats: number;
    fuelType: string;
    transmission: string;
  };
  dailyPrice: number;
  averageRating: number;
  totalRatings?: number;
  isConnectedHost?: boolean;
};

const formatFuelType = (fuelType?: string) => {
  if (!fuelType) return "";
  const normalized = fuelType.trim().toLowerCase();
  if (
    normalized === "gas/petrol" ||
    normalized === "gas / petrol" ||
    normalized === "petrol" ||
    normalized === "gas"
  ) {
    return "Gas";
  }
  return fuelType;
};

export default function CarCard({
  // slug,
  featuredImage,
  carName,
  specifications,
  dailyPrice,
  averageRating,
  totalRatings,
  isConnectedHost,
  id,
}: CarCardProps) {
  const carUrl = id;

  return (
    <div className="bg-white overflow-hidden rounded-xs group">
      <Link href={`/browse-cars/${carUrl}`} className="relative flex aspect-3/2 overflow-hidden">
        {isConnectedHost && (
          <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full bg-blue-700 text-white text-xs font-semibold font-text leading-4">
            Your Host
          </span>
        )}
        <Image
          src={isValidImageSrc(featuredImage?.src) ? featuredImage.src : DEFAULT_IMAGE_SRC}
          alt={featuredImage.alt}
          title={featuredImage.alt}
          width={600}
          height={400}
          className="w-full aspect-3/2 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="flex flex-col gap-3 p-2.5 md:p-4 border border-[#E5E7EB]">
        <div className="flex items-center gap-1">
          <StarIcon />
          <span className="text-sm text-[#1F2937] font-semibold">
            {averageRating}
          </span>
          <span className="text-sm text-[#6B7280] font-normal">{`(${totalRatings})`}</span>
        </div>
        <Link href={`/browse-cars/${carUrl}`} className="hover:underline">
          <h4 className="text-base text-[#1F2937] font-bold font-text">
            {carName}
          </h4>
        </Link>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-1">
            <Users className="size-4 text-gray-400" />
            <span className="text-xs text-[#333333] font-normal">
              {specifications.seats}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Fuel className="size-4 text-gray-400" />
            <span className="text-xs text-[#333333] font-normal">
              {formatFuelType(specifications.fuelType)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Settings className="size-4 text-gray-400" />
            <span className="text-xs text-[#333333] font-normal">
              {specifications.transmission}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2">
          <div>
            <p className="text-2xl text-blue-700 font-medium">
              {"$"}
              {dailyPrice}
            </p>
            <span className="text-xs text-[#6B7280] font-normal">per day</span>
          </div>
          <div>
            <PriBtn
              btn={{
                label: "Book Now",
                link: `/browse-cars/${carUrl}`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const StarIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_116_2052)">
        <path
          d="M7.68106 1.52954C7.71027 1.47053 7.75538 1.42086 7.81132 1.38614C7.86725 1.35141 7.93178 1.33301 7.99762 1.33301C8.06346 1.33301 8.12798 1.35141 8.18392 1.38614C8.23985 1.42086 8.28497 1.47053 8.31418 1.52954L9.85365 4.6478C9.95507 4.85304 10.1048 5.03061 10.2899 5.16526C10.4751 5.29991 10.6901 5.38763 10.9166 5.42087L14.3594 5.9247C14.4247 5.93415 14.486 5.96167 14.5364 6.00414C14.5868 6.04661 14.6243 6.10234 14.6447 6.16502C14.6651 6.22771 14.6675 6.29484 14.6517 6.35884C14.6359 6.42284 14.6026 6.48114 14.5554 6.52716L12.0656 8.95167C11.9014 9.11168 11.7785 9.3092 11.7076 9.52722C11.6366 9.74524 11.6198 9.97724 11.6584 10.2032L12.2462 13.6287C12.2577 13.6939 12.2506 13.7611 12.2258 13.8225C12.201 13.8838 12.1595 13.937 12.1059 13.9759C12.0523 14.0149 11.9889 14.0379 11.9229 14.0425C11.8568 14.0471 11.7908 14.0331 11.7323 14.0019L8.65473 12.3838C8.45194 12.2773 8.22633 12.2217 7.99728 12.2217C7.76824 12.2217 7.54263 12.2773 7.33984 12.3838L4.2629 14.0019C4.20447 14.0329 4.13854 14.0468 4.07259 14.0421C4.00665 14.0374 3.94335 14.0143 3.88989 13.9754C3.83642 13.9365 3.79494 13.8834 3.77017 13.8221C3.74539 13.7609 3.73831 13.6938 3.74974 13.6287L4.33687 10.2039C4.37565 9.9778 4.35885 9.74566 4.28791 9.5275C4.21697 9.30934 4.09403 9.11171 3.92968 8.95167L1.43986 6.52783C1.39227 6.48186 1.35855 6.42346 1.34254 6.35927C1.32652 6.29507 1.32886 6.22767 1.34928 6.16474C1.3697 6.10182 1.40738 6.04589 1.45804 6.00333C1.50869 5.96077 1.57029 5.9333 1.63579 5.92403L5.07795 5.42087C5.30471 5.38788 5.52006 5.30029 5.70546 5.16562C5.89086 5.03095 6.04076 4.85325 6.14225 4.6478L7.68106 1.52954Z"
          fill="#FDC700"
          stroke="#FDC700"
          strokeWidth="1.33288"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_116_2052">
          <rect width="15.9945" height="15.9945" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};