"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { statusBadgeClass } from "../profilePages/utils";
import { Badge } from "@/components/ui/badge";
import { ReviewType } from "@/types/vehicle.type";
import { TripStatus } from "../profilePages/types";
import { CircleCheck, CircleX, Clock } from "lucide-react";
import RightContent from "./rightContent";
import { ManageBookingCardProps } from "./types";
import { getTripDuration } from "../profilePages/utils";
import { useGetProfileQuery } from "@/app/store/services/renterApi";

type TripSummaryCardProps = {
  pickUpDate: string;
  returnDate: string;
  pickUpLocation: string;
  totalPaid: string;
  tripCost: string;
  price: string;
  features: string[];
};

type VechicleCardProps = {
  featuredImage?: {
    src: string;
    alt: string;
  };
  carName?: string;
  carType?: string;
  transmission?: string;
  seats?: number;
  year?: number;
  plateNumber?: string;
  averageRating?: number;
  reviews?: ReviewType[];
};

type DocumentVerificationCardProps = {
  verificationDriverLicenseImageSrc?: string;
  verificationSelfieImageSrc?: string;
  rentId: string;
};

type VehicleConditionPhotosCardProps = {
  vehicleConditionImages?: string[];
  rentId: string;
  currentMileage?: number;
  fuelLevelAtPickup?: string;
};

export default function RentalDetailPage({
  rentId,
  status,
  pickUpDate,
  returnDate,
  pickUpLocation,
  price,
  totalPaid,
  tripCost,
  features,
  featuredImage,
  carName,
  carType,
  transmission,
  seats,
  year,
  plateNumber,
  averageRating,
  reviews,
  rentals,
  verificationDriverLicenseImageSrc,
  verificationSelfieImageSrc,
  vehicleConditionImages,
  currentMileage,
  fuelLevelAtPickup,
}: PageTitleSectionProps &
  TripSummaryCardProps &
  VechicleCardProps &
  ManageBookingCardProps &
  DocumentVerificationCardProps &
  VehicleConditionPhotosCardProps) {
  const { data: renterProfile } = useGetProfileQuery();
  const profileRental = renterProfile?.renter?.rentals?.find(
    (item) => item.id === rentals?.id || item.rentId === rentId,
  );
  const resolvedVerificationDriverLicenseImageSrc =
    verificationDriverLicenseImageSrc ||
    profileRental?.checkIn?.driverLicensePhotoUrl;
  const resolvedVerificationSelfieImageSrc =
    verificationSelfieImageSrc || profileRental?.checkIn?.selfiePhotoUrl;
  const resolvedVehicleConditionImages =
    vehicleConditionImages?.length
      ? vehicleConditionImages
      : profileRental?.checkIn?.vehicleConditionPhotoUrls ?? [];
  const resolvedCurrentMileage =
    currentMileage ?? profileRental?.checkIn?.mileage;
  const resolvedFuelLevelAtPickup =
    fuelLevelAtPickup || profileRental?.checkIn?.fuelLevel;

  return (
    <>
      <Breadcrumb rentId={rentId} />
      <section className="py-5 px-2.5 md:py-10 md:px-20">
        <div>
          <PageTitleSection rentId={rentId} status={status} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <LeftContent
            pickUpDate={pickUpDate}
            returnDate={returnDate}
            pickUpLocation={pickUpLocation}
            price={price}
            totalPaid={totalPaid}
            tripCost={tripCost}
            features={features}
            featuredImage={featuredImage}
            carName={carName}
            carType={carType}
            transmission={transmission}
            seats={seats}
            year={year}
            plateNumber={plateNumber}
            averageRating={averageRating}
            reviews={reviews}
            verificationDriverLicenseImageSrc={
              resolvedVerificationDriverLicenseImageSrc
            }
            verificationSelfieImageSrc={resolvedVerificationSelfieImageSrc}
            rentId={rentId}
            vehicleConditionImages={resolvedVehicleConditionImages}
            currentMileage={resolvedCurrentMileage}
            fuelLevelAtPickup={resolvedFuelLevelAtPickup}
          />
          <RightContent rentals={rentals} />
        </div>
      </section>
    </>
  );
}

const Breadcrumb = memo(({ rentId }: { rentId: string }) => {
  return (
    <div className="bg-white py-2.5 px-2.5 md:px-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex flex-wrap items-center gap-2 md:text-nowrap">
          <Link
            href="/trip"
            className="text-sm font-normal font-text leading-5 text-[#6B7280] hover:text-black transition-colors duration-300"
          >
            My Rentals
          </Link>
          <GreaterThanIcon />
          <span className="text-[#0891B2] text-sm font-semibold font-text leading-5">
            {rentId}
          </span>
        </div>
      </div>
    </div>
  );
});
Breadcrumb.displayName = "Breadcrumb";

type PageTitleSectionProps = {
  status: TripStatus;
  rentId: string;
};

const PageTitleSection = memo(({ status, rentId }: PageTitleSectionProps) => {
  return (
    <div className="flex flex-col gap-2 mb-12.5">
      <div className="flex items-center gap-4">
        <h2 className="text-[#0B0B0B] text-2xl font-bold font-text leading-8">
          Rental Details
        </h2>
        <Badge className={statusBadgeClass[status]}>{status}</Badge>
      </div>

      <div>
        <span className="text-[#0891B2] text-sm font-medium font-text leading-5">
          Booking Reference: {rentId}
        </span>
      </div>
    </div>
  );
});
PageTitleSection.displayName = "PageTitleSection";

const LeftContent = memo(
  ({
    pickUpDate,
    returnDate,
    pickUpLocation,
    price,
    totalPaid,
    tripCost,
    features,
    featuredImage,
    carName,
    carType,
    transmission,
    seats,
    year,
    plateNumber,
    averageRating,
    reviews,
    verificationDriverLicenseImageSrc,
    verificationSelfieImageSrc,
    rentId,
    vehicleConditionImages,
    currentMileage,
    fuelLevelAtPickup,
  }: TripSummaryCardProps &
    VechicleCardProps &
    DocumentVerificationCardProps &
    VehicleConditionPhotosCardProps) => {
    return (
      <div className="col-span-1 md:col-span-7 w-full">
        <div className="flex flex-col gap-5">
          <TripSummaryCard
            pickUpDate={pickUpDate}
            returnDate={returnDate}
            pickUpLocation={pickUpLocation}
            price={price}
            totalPaid={totalPaid}
            tripCost={tripCost}
            features={features}
          />
          <VechicleCard
            featuredImage={featuredImage}
            carName={carName}
            carType={carType}
            transmission={transmission}
            seats={seats}
            year={year}
            plateNumber={plateNumber}
            averageRating={averageRating}
            reviews={reviews}
          />
          <DocumentVerificationCard
            verificationDriverLicenseImageSrc={
              verificationDriverLicenseImageSrc
            }
            verificationSelfieImageSrc={verificationSelfieImageSrc}
            rentId={rentId}
          />
          <VehicleConditionPhotosCard
            vehicleConditionImages={vehicleConditionImages}
            rentId={rentId}
            currentMileage={currentMileage}
            fuelLevelAtPickup={fuelLevelAtPickup}
          />
        </div>
      </div>
    );
  },
);
LeftContent.displayName = "LeftContent";

const TripSummaryCard = memo(
  ({
    pickUpDate,
    returnDate,
    pickUpLocation,
    price,
    features,
    totalPaid,
    tripCost,
  }: TripSummaryCardProps) => {
    const tripDuration = getTripDuration(pickUpDate, returnDate);
    const displayPrice = price;

    const tripDetails: {
      id: number;
      title: string;
      content: string | number;
    }[] = [
      {
        id: 1,
        title: "Pickup Date",
        content: pickUpDate,
      },
      {
        id: 2,
        title: "Return Date",
        content: returnDate,
      },
      {
        id: 3,
        title: "Pickup Location",
        content: pickUpLocation,
      },
      {
        id: 4,
        title: "Duration",
        content: tripDuration,
      },
    ];

    return (
      <div className="flex flex-col gap-4.25 p-4 md:p-6 rounded-[10px] border border-gray-200">
        <div className="">
          <h3 className="text-[#0B0B0B] text-base font-semibold font-text leading-6">
            Trip Summary
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-6.25 border-b border-b-[#E5E7EB]">
          {tripDetails.map((item) => (
            <div key={item.id} className="flex flex-col gap-2 p-4 bg-[#F8F9FB]">
              <h4 className="text-[#6B7280] text-xs font-normal font-text uppercase leading-4">
                {item.title}
              </h4>
              <span className="text-[#0B0B0B] text-base font-semibold font-text leading-6">
                {item.content}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 pb-6.25 border-b border-b-[#E5E7EB]">
          <div className="flex justify-between gap-4">
            <div>
              <span className="text-[#6B7280] text-sm font-normal font-text leading-5">
                {displayPrice} x {tripDuration} days
              </span>
            </div>
            <div>
              <span>{tripCost}</span>
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <div>
              <span className="text-[#6B7280] text-sm font-normal font-text leading-5">
                Insurance
              </span>
            </div>
            <div>
              <span className="text-[#F59E0B] text-sm font-normal font-text text-right leading-5">
                Charged separately
              </span>
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <div>
              <span className="text-[#6B7280] text-sm font-normal font-text leading-5">
                Fuel & Extras
              </span>
            </div>
            <div>
              <span className="text-[#F59E0B] text-sm font-normal font-text text-right leading-5">
                Charged separately
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <h4 className="text-neutral-950 text-base font-bold font-text leading-6">
            Total Paid
          </h4>

          <span className="text-[#1A56DB] text-base font-medium font-text leading-6">
            {totalPaid}
          </span>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          {features.map((item, index) => (
            <Badge
              key={index}
              className="bg-[#F8F9FB] text-[#0B0B0B] py-px px-3 text-xs font-medium leading-4"
            >
              {item}
            </Badge>
          ))}
        </div>
      </div>
    );
  },
);
TripSummaryCard.displayName = "TripSummaryCard";

const VechicleCard = memo(
  ({
    featuredImage,
    carName,
    carType,
    transmission,
    seats,
    year,
    plateNumber,
    averageRating,
    reviews,
  }: VechicleCardProps) => {
    return (
      <div className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200">
        <div className="flex flex-col gap-4">
          <h3 className="text-[#0B0B0B] text-base font-semibold font-text leading-6">
            Your Vehicle
          </h3>
          <div className="flex gap-4 items-start group">
            <div className="aspect-160/109 rounded-[10px] overflow-clip">
              <Image
                src={featuredImage?.src || ""}
                alt={featuredImage?.alt || "image not found"}
                title={featuredImage?.alt || "image not found"}
                width={800}
                height={545}
                className="aspect-160/109 object-center object-cover max-w-40 w-full group-hover:scale-105 duration-300"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-[#0B0B0B] text-base font-bold font-text leading-6">
                {carName}
              </h4>
              <div className="flex gap-1.5 items-center text-[#333333] text-sm font-normal font-text leading-5">
                <span className="">{carType}</span>
                <span>·</span>
                <span>{transmission}</span>
                <span>·</span>
                <span>{seats}</span>
                <span>·</span>
                <span>{year}</span>
              </div>
              <div>
                <Badge className="bg-[#0891B21A] text-[#0891B2] py-1 px-2">
                  {plateNumber}
                </Badge>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex gap-2 items-center">
                  <StarIcon />
                  <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
                    {averageRating}
                  </span>
                </div>
                <span>·</span>
                <div>
                  <span className="justify-start text-gray-500 text-sm font-normal font-['DM_Sans'] leading-5">
                    {reviews?.length} reviews
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
VechicleCard.displayName = "VechicleCard";

const DocumentVerificationCard = memo(
  ({
    verificationDriverLicenseImageSrc,
    verificationSelfieImageSrc,
    rentId,
  }: DocumentVerificationCardProps) => {
    const content: {
      key: number;
      title: string;
      link?: string;
    }[] = [
      {
        key: 1,
        title: `Driver's License`,
        link: verificationDriverLicenseImageSrc,
      },
      {
        key: 2,
        title: `Selfie with License`,
        link: verificationSelfieImageSrc,
      },
    ];

    return (
      <div className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200">
        <h3 className="text-[#0B0B0B] text-base font-semibold font-text leading-6">
          Document Verification
        </h3>
        <div className="divide-y divide-[#E5E7EB]">
          {content.map((item) => (
            <div
              key={item.key}
              className="flex justify-between items-center py-4.25"
            >
              <div className="flex items-center gap-2.5">
                {item.link ? (
                  <CircleCheck className="text-[#10B981]" />
                ) : (
                  <CircleX className="text-red-700" />
                )}
                <div>
                  <h4 className="text-neutral-950 text-sm font-semibold font-text leading-5">
                    {item.title}
                  </h4>
                  <div>
                    {item.link ? (
                      <span className="text-emerald-500 text-sm font-normal font-text leading-5">
                        Uploaded & Verified
                      </span>
                    ) : (
                      <span className="text-red-700 text-sm font-normal font-text leading-5">
                        Please upload documents
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                {item.link ? (
                  <Link
                    href={item.link}
                    className="text-[#1A56DB] text-sm font-medium font-text leading-5"
                    target="_blank"
                  >
                    View Document
                  </Link>
                ) : (
                  <Link
                    href={`?checkIn=${rentId}`}
                    className="text-red-700 text-sm font-medium font-text leading-5"
                  >
                    Start Check-In
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
DocumentVerificationCard.displayName = "DocumentVerificationCard";

const VehicleConditionPhotosCard = memo(
  ({
    vehicleConditionImages,
    rentId,
    currentMileage,
    fuelLevelAtPickup,
  }: VehicleConditionPhotosCardProps) => {
    const contents: { id: number; title: string; content: string }[] = [
      {
        id: 1,
        title: "Current Mileage",
        content:
          currentMileage !== undefined
            ? `${currentMileage.toLocaleString("en-US")}km`
            : "-",
      },
      {
        id: 2,
        title: "Fuel Level at Pickup",
        content: fuelLevelAtPickup || "-",
      },
    ];

    return (
      <div className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200">
        <div className="flex flex-col gap-3 pb-3 border-b border-[#E5E7EB]">
          <h3 className="text-[#0B0B0B] text-base font-semibold font-text leading-6">
            Vehicle Condition Photos
          </h3>
          <span className="text-gray-500 text-xs font-normal font-text leading-5">
            Photos taken at pickup to confirm vehicle condition.
          </span>
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {vehicleConditionImages?.length !== 0 ? (
            vehicleConditionImages?.map((image, index) => (
              <div
                key={index}
                className="overflow-hidden w-full border border-gray-200 rounded-[10px] aspect-164/96 min-w-25 basis-41 grow shrink group"
              >
                <Image
                  src={image}
                  alt="Vehicle Condition Photos"
                  width={164}
                  height={96}
                  className="aspect-164/96 object-cover w-full group-hover:scale-110 transition-transform duration-500 ease-in-out"
                />
              </div>
            ))
          ) : (
            <div className="bg-gray-200 p-2.5 rounded-[10px] flex flex-col items-center gap-3 flex-1">
              <div className="flex gap-2 items-center justify-center text-wrap">
                <Clock className="size-4 text-gray-500" />
                <p className="text-gray-500 text-sm font-normal font-text leading-5">
                  Please, complete your check in process
                </p>
              </div>
              <Link
                href={`?checkIn=${rentId}`}
                className="text-red-700 text-sm font-medium font-text leading-5"
              >
                Start Check-In
              </Link>
            </div>
          )}
        </div>
        <div className="divide-y">
          {contents.map((item) => (
            <div
              className="flex items-center justify-between gap-4 py-3"
              key={item.id}
            >
              <div>
                <span className="text-gray-500 text-xs font-normal font-text leading-5">
                  {item.title}
                </span>
              </div>
              <div>
                <span className="text-gray-800 text-sm font-semibold font-text leading-5">
                  {item.content}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
VehicleConditionPhotosCard.displayName = "VehicleConditionPhotosCard";

const GreaterThanIcon = memo(() => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.99805 11.9959L9.99668 7.99729L5.99805 3.99866"
      stroke="#6B7280"
      strokeWidth="1.33288"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));
GreaterThanIcon.displayName = "GreaterThanIcon";

const StarIcon = memo(() => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_123_884)">
      <path
        d="M5.75706 1.14633C5.77895 1.10211 5.81277 1.06488 5.85469 1.03885C5.89662 1.01282 5.94499 0.999023 5.99434 0.999023C6.04369 0.999023 6.09206 1.01282 6.13398 1.03885C6.17591 1.06488 6.20973 1.10211 6.23162 1.14633L7.38556 3.48368C7.46157 3.63752 7.57379 3.77062 7.71257 3.87155C7.85134 3.97248 8.01254 4.03822 8.18232 4.06314L10.7629 4.4408C10.8118 4.44788 10.8578 4.46851 10.8956 4.50034C10.9333 4.53217 10.9615 4.57395 10.9768 4.62093C10.992 4.66792 10.9939 4.71824 10.982 4.76621C10.9702 4.81418 10.9452 4.85789 10.9098 4.89238L9.04353 6.7097C8.92045 6.82964 8.82836 6.9777 8.77519 7.14112C8.72202 7.30454 8.70936 7.47844 8.73831 7.64784L9.1789 10.2155C9.18753 10.2643 9.18225 10.3147 9.16366 10.3607C9.14508 10.4067 9.11393 10.4466 9.07377 10.4757C9.03362 10.5049 8.98607 10.5222 8.93656 10.5256C8.88705 10.5291 8.83756 10.5185 8.79376 10.4952L6.48688 9.28233C6.33488 9.20252 6.16577 9.16082 5.99409 9.16082C5.82241 9.16082 5.65329 9.20252 5.50129 9.28233L3.19492 10.4952C3.15113 10.5184 3.10171 10.5288 3.05228 10.5253C3.00285 10.5218 2.9554 10.5045 2.91533 10.4753C2.87525 10.4462 2.84416 10.4064 2.82559 10.3604C2.80702 10.3145 2.80171 10.2643 2.81028 10.2155L3.25037 7.64834C3.27944 7.47886 3.26685 7.30485 3.21367 7.14133C3.1605 6.9778 3.06834 6.82967 2.94515 6.7097L1.07887 4.89288C1.0432 4.85843 1.01792 4.81465 1.00592 4.76653C0.993916 4.71842 0.995667 4.6679 1.01097 4.62073C1.02628 4.57356 1.05453 4.53163 1.0925 4.49973C1.13047 4.46783 1.17663 4.44724 1.22574 4.4403L3.80586 4.06314C3.97583 4.03842 4.13725 3.97276 4.27622 3.87181C4.41518 3.77087 4.52754 3.63767 4.60362 3.48368L5.75706 1.14633Z"
        fill="#FDC700"
        stroke="#FDC700"
        strokeWidth="0.999079"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_123_884">
        <rect width="11.9889" height="11.9889" fill="white" />
      </clipPath>
    </defs>
  </svg>
));
StarIcon.displayName = "StarIcon";

const CheckIcon = memo(() => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_123_884)">
      <path
        d="M5.75706 1.14633C5.77895 1.10211 5.81277 1.06488 5.85469 1.03885C5.89662 1.01282 5.94499 0.999023 5.99434 0.999023C6.04369 0.999023 6.09206 1.01282 6.13398 1.03885C6.17591 1.06488 6.20973 1.10211 6.23162 1.14633L7.38556 3.48368C7.46157 3.63752 7.57379 3.77062 7.71257 3.87155C7.85134 3.97248 8.01254 4.03822 8.18232 4.06314L10.7629 4.4408C10.8118 4.44788 10.8578 4.46851 10.8956 4.50034C10.9333 4.53217 10.9615 4.57395 10.9768 4.62093C10.992 4.66792 10.9939 4.71824 10.982 4.76621C10.9702 4.81418 10.9452 4.85789 10.9098 4.89238L9.04353 6.7097C8.92045 6.82964 8.82836 6.9777 8.77519 7.14112C8.72202 7.30454 8.70936 7.47844 8.73831 7.64784L9.1789 10.2155C9.18753 10.2643 9.18225 10.3147 9.16366 10.3607C9.14508 10.4067 9.11393 10.4466 9.07377 10.4757C9.03362 10.5049 8.98607 10.5222 8.93656 10.5256C8.88705 10.5291 8.83756 10.5185 8.79376 10.4952L6.48688 9.28233C6.33488 9.20252 6.16577 9.16082 5.99409 9.16082C5.82241 9.16082 5.65329 9.20252 5.50129 9.28233L3.19492 10.4952C3.15113 10.5184 3.10171 10.5288 3.05228 10.5253C3.00285 10.5218 2.9554 10.5045 2.91533 10.4753C2.87525 10.4462 2.84416 10.4064 2.82559 10.3604C2.80702 10.3145 2.80171 10.2643 2.81028 10.2155L3.25037 7.64834C3.27944 7.47886 3.26685 7.30485 3.21367 7.14133C3.1605 6.9778 3.06834 6.82967 2.94515 6.7097L1.07887 4.89288C1.0432 4.85843 1.01792 4.81465 1.00592 4.76653C0.993916 4.71842 0.995667 4.6679 1.01097 4.62073C1.02628 4.57356 1.05453 4.53163 1.0925 4.49973C1.13047 4.46783 1.17663 4.44724 1.22574 4.4403L3.80586 4.06314C3.97583 4.03842 4.13725 3.97276 4.27622 3.87181C4.41518 3.77087 4.52754 3.63767 4.60362 3.48368L5.75706 1.14633Z"
        fill="#FDC700"
        stroke="#FDC700"
        strokeWidth="0.999079"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_123_884">
        <rect width="11.9889" height="11.9889" fill="white" />
      </clipPath>
    </defs>
  </svg>
));
CheckIcon.displayName = "CheckIcon";
