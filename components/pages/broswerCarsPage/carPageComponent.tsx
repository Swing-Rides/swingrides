"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { HostInfoType } from "@/types/vehicle.type";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReviewTab from "./reviewTab";
import { getInitials } from "../profilePages/utils";
import {
  CarPageComponentProp,
  ImagesSectionProps,
  CarDetailCardProps,
  OverviewTabProps,
  SpecificationsTabProps,
  SpecificationsContentProps,
} from "./types";
import {
  PaymentFormValues,
  PaymentSection,
} from "@/components/forms/browseCarPaymentSection";
import { Calendar, Star } from "lucide-react";

export default function CarPageComponent({
  carName,
  featuredImage,
  gallery,
  reviewsAndRatings,
  status,
  specifications,
  overview,
  host,
  price,
  pickupLocation,
}: CarPageComponentProp) {
  return (
    <>
      <NotificationBar carName={carName} />
      <section className="py-5 px-2.5 md:py-10 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <LeftContent
            carName={carName}
            featuredImage={featuredImage}
            gallery={gallery}
            reviewsAndRatings={reviewsAndRatings}
            status={status}
            specifications={specifications}
            overview={overview}
            hostName={host.hostName}
            memberSince={host.memberSince}
            tripsCompleted={host.tripsCompleted}
            contactNumber={host.contactNumber}
            rating={host.rating}
          />
          <RightContent price={price} defaultPickupLocation={pickupLocation} />
        </div>
      </section>
    </>
  );
}

const NotificationBar = memo(({ carName }: { carName: string }) => {
  return (
    <div className="bg-[#EBF0FB] py-2.5 px-2.5 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div className="flex flex-wrap items-center gap-2 md:text-nowrap">
          <Link
            href="/browse-cars"
            className="text-sm font-normal font-text leading-5 text-[#6B7280]"
          >
            Browse Cars
          </Link>
          <GreaterThanIcon />
          <span className="text-[#1A56DB] text-sm font-semibold font-text leading-5">
            {carName}
          </span>
        </div>
        <div className="flex justify-start items-center">
          <button className="w-full md:w-fit font-text px-4 py-1.5 cursor-pointer border border-[#1A56DB] text-[#1A56DB] bg-transparent hover:bg-[#1A56DB] hover:text-white transition-colors duration-300 rounded-xs text-nowrap">
            Share this vehicle
          </button>
        </div>
      </div>
    </div>
  );
});
NotificationBar.displayName = "NotificationBar";

const LeftContent = memo(
  ({
    carName,
    gallery,
    featuredImage,
    reviewsAndRatings,
    status,
    specifications,
    overview,
    hostName,
    memberSince,
    tripsCompleted,
    contactNumber,
    rating,
  }: ImagesSectionProps & CarDetailCardProps & HostInfoType) => {
    return (
      <div className="col-span-1 md:col-span-7 w-full">
        <div className="flex flex-col gap-5">
          <ImageCard gallery={gallery} featuredImage={featuredImage} />
          <CarDetailCard
            carName={carName}
            status={status}
            reviewsAndRatings={reviewsAndRatings}
            specifications={specifications}
            overview={overview}
          />
          <HostCard
            hostName={hostName}
            memberSince={memberSince}
            tripsCompleted={tripsCompleted}
            contactNumber={contactNumber}
            rating={rating}
          />
        </div>
      </div>
    );
  },
);
LeftContent.displayName = "LeftContent";

const RightContent = memo(
  ({ price, defaultPickupLocation }: PaymentSectionProps) => {
    return (
      <div className="col-span-1 md:col-span-5 w-full">
        <PaymentSection
          price={price}
          defaultPickupLocation={defaultPickupLocation}
          onSubmit={async (values: PaymentFormValues) => {
            console.log("booking car...", values);
          }}
        />
      </div>
    );
  },
);
RightContent.displayName = "RightContent";

const ImageCard = memo(({ gallery, featuredImage }: ImagesSectionProps) => {
  // Main image fallback logic
  const mainImageSrc =
    featuredImage?.src || gallery[0]?.src || "/images/toyota-camry-2024.webp";
  const mainImageAlt = featuredImage?.alt || "Vehicle image";
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[10px] overflow-hidden">
        <Image
          src={mainImageSrc}
          alt={mainImageAlt}
          title={mainImageAlt}
          width={1720}
          height={920}
          className="size-full aspect-13/9 object-cover max-w-250"
        />
      </div>
      <div className="flex flex-wrap justify-between gap-4 items-center">
        {gallery.map((img) => (
          <div
            key={img.id}
            className="aspect-video object-cover object-center rounded-[10px] overflow-clip"
          >
            <Image
              src={img.src}
              alt={img.alt}
              title={img.alt}
              width={172}
              height={92}
              className="size-full aspect-video object-cover max-w-50 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
});
ImageCard.displayName = "ImageCard";

const CarDetailCard = memo(
  ({
    carName,
    status,
    reviewsAndRatings,
    specifications,
    overview,
  }: CarDetailCardProps) => {
    return (
      <div className="flex flex-col gap-5 p-4 md:p-6 rounded-[10px] border border-gray-200">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 justify-between items-center">
            <h3 className="text-[#0B0B0B] text-2xl font-bold font-text leading-8">
              {carName}
            </h3>
            <div className="px-3 py-1 bg-[#DCFCE7] text-green-700 capitalize text-sm font-medium font-text leading-5 rounded-full">
              <span>{status}</span>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <div className="flex gap-2 items-center">
              <Star className="size-4 text-gray-500" />
              <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
                {reviewsAndRatings.averageRating}
              </span>
            </div>
            <span>{"·"}</span>
            <div>
              <span className="justify-start text-gray-500 text-sm font-normal font-['DM_Sans'] leading-5">
                {reviewsAndRatings.reviews.length} reviews
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Badge className="py-4 px-2 bg-[#F3F4F6] rounded-[10px]">
            <CarIcon />
            <span className="text-[#1F2937]">{specifications.bodyType}</span>
          </Badge>
          <Badge className="py-4 px-2 bg-[#F3F4F6] rounded-[10px]">
            <GearIcon />
            <span className="text-[#1F2937]">
              {specifications.transmission}
            </span>
          </Badge>
          <Badge className="py-4 px-2 bg-[#F3F4F6] rounded-[10px]">
            <PassengerIcon />
            <span className="text-[#1F2937]">{specifications.seats} seats</span>
          </Badge>
          <Badge className="py-4 px-2 bg-[#F3F4F6] rounded-[10px]">
            <Calendar className="size-4 text-gray-500" />
            <span className="text-[#1F2937]">{specifications.year}</span>
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-5">
          <TabsList className="justify-start border-b pb-0 border-black rounded-none gap-8 w-full bg-white">
            <TabsTrigger
              value="overview"
              className="max-w-fit p-0  pb-3.5 -mb-0.5 text-gray-500 text-sm font-medium font-text leading-5 border-b-2 border-b-transparent shadow-none shadow-transparent data-active:rounded-none data-active:text-[#1A56DB] data-active:border-b-[#1A56DB] data-active:shadow-none cursor-pointer"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="specifications"
              className="max-w-fit p-0  pb-3.5 -mb-0.5 text-gray-500 text-sm font-medium font-text leading-5 border-b border-b-transparent shadow-none shadow-transparent data-active:rounded-none data-active:text-[#1A56DB] data-active:border-b-[#1A56DB] data-active:shadow-none cursor-pointer"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="max-w-fit p-0  pb-3.5 -mb-0.5 text-gray-500 text-sm font-medium font-text leading-5 border-b border-b-transparent shadow-none shadow-transparent data-active:rounded-none data-active:text-[#1A56DB] data-active:border-b-[#1A56DB] data-active:shadow-none cursor-pointer"
            >
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <OverviewTab
              overview={overview}
              features={specifications?.features}
            />
          </TabsContent>
          <TabsContent value="specifications">
            <SpecificationsTab specifications={specifications} />
          </TabsContent>
          <TabsContent value="reviews">
            <ReviewTab reviewsAndRatings={reviewsAndRatings} />
          </TabsContent>
        </Tabs>
      </div>
    );
  },
);
CarDetailCard.displayName = "CarDetailCard";

const OverviewTab = memo(({ overview, features }: OverviewTabProps) => {
  return (
    <div className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200 space-y-6">
      <p className="text-[#333333] text-base font-normal font-text leading-7">
        {overview}
      </p>
      {features && features.length > 0 && (
        <div className="flex flex-col gap-4">
          <h4 className="text-[#0B0B0B] text-base font-semibold font-text leading-6">
            Features
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {features.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <FeaturesCheckIcon />
                <span className="text-[#0B0B0B] text-sm font-normal font-text leading-5">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
OverviewTab.displayName = "OverviewTab";

const SpecificationsTab = memo(({ specifications }: SpecificationsTabProps) => {
  const rows: { title: string; content: string | number }[] = [
    { title: "Make", content: specifications.make },
    { title: "Model", content: specifications.model },
    { title: "Year", content: specifications.year },
    { title: "Body Type", content: specifications.bodyType },
    { title: "Engine", content: specifications.engine },
    { title: "Horsepower", content: specifications.horsepower },
    { title: "Transmission", content: specifications.transmission },
    { title: "Drive Type", content: specifications.driveType },
    { title: "Fuel Type", content: specifications.fuelType },
    { title: "Fuel Efficiency", content: specifications.fuelEfficiency },
    { title: "Seats", content: specifications.seats },
    { title: "Doors", content: specifications.doors },
    { title: "Color", content: specifications.color },
    { title: "Mileage", content: specifications.mileage },
  ];

  return (
    <div className="divide-[#6B7280] divide-y">
      {rows.map(({ title, content }) => (
        <SpecificationsContent key={title} title={title} content={content} />
      ))}
    </div>
  );
});
SpecificationsTab.displayName = "SpecificationsTab";

const SpecificationsContent = memo(
  ({ title, content }: SpecificationsContentProps) => {
    return (
      <div className="flex items-center justify-between gap-3 py-3">
        <h4 className="text-[#6B7280] text-sm font-normal font-text leading-5">
          {title}
        </h4>
        <p className="text-[#0B0B0B] text-sm font-semibold font-text leading-5">
          {content}
        </p>
      </div>
    );
  },
);
SpecificationsContent.displayName = "SpecificationsContent";

const HostCard = memo(
  ({
    hostName,
    memberSince,
    tripsCompleted,
    contactNumber,
    rating,
  }: HostInfoType) => {
    const initials = getInitials(hostName);

    return (
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 p-4 md:p-6 bg-white rounded-[10px] border border-gray-200">
        <div className="flex gap-4 items-center justify-start">
          <div className="size-12 aspect-square rounded-full grid place-content-center bg-[#1A56DB]">
            <span className="text-white">{initials}</span>
          </div>
          <div className="flex flex-col gap-px">
            <h4 className="text-[#0B0B0B] text-sm font-semibold font-text leading-5">
              {hostName}
            </h4>
            <span className="text-[#6B7280] text-xs font-normal font-text leading-4">
              Member since {memberSince} · {tripsCompleted} trips completed
            </span>
            <div className="flex items-center gap-1">
              <Star className="size-4 text-gray-500" />
              <span className="text-[#0B0B0B] text-xs font-medium font-text leading-4">
                {rating} Host Rating
              </span>
            </div>
          </div>
        </div>
        <Link href={`tel:${contactNumber}`} title={`Contact ${hostName}`}>
          <button className="p-2 px-4 rounded-lg border border-[#1A56DB] text-[#1A56DB] text-sm text-nowrap font-medium font-text leading-5 cursor-pointer">
            Contact Host
          </button>
        </Link>
      </div>
    );
  },
);
HostCard.displayName = "HostCard";

type PaymentSectionProps = {
  price: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  defaultPickupLocation: string;
};

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

const CarIcon = memo(() => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_123_793)">
      <path
        d="M12.6625 11.3294H13.9953C14.3952 11.3294 14.6618 11.0629 14.6618 10.663V8.66367C14.6618 8.06388 14.1953 7.53073 13.6621 7.39744C12.4625 7.06422 10.6632 6.66436 10.6632 6.66436C10.6632 6.66436 9.79678 5.73134 9.19699 5.13155C8.86377 4.86497 8.4639 4.66504 7.9974 4.66504H3.33232C2.93246 4.66504 2.59924 4.93161 2.39931 5.26483L1.4663 7.19751C1.37805 7.4549 1.33301 7.72513 1.33301 7.99723V10.663C1.33301 11.0629 1.59958 11.3294 1.99945 11.3294H3.33232"
        stroke="#6B7280"
        strokeWidth="1.33288"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.66491 12.6623C5.40104 12.6623 5.99779 12.0656 5.99779 11.3295C5.99779 10.5933 5.40104 9.99658 4.66491 9.99658C3.92878 9.99658 3.33203 10.5933 3.33203 11.3295C3.33203 12.0656 3.92878 12.6623 4.66491 12.6623Z"
        stroke="#6B7280"
        strokeWidth="1.33288"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.99805 11.3293H9.99668"
        stroke="#6B7280"
        strokeWidth="1.33288"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.329 12.6623C12.0651 12.6623 12.6618 12.0656 12.6618 11.3295C12.6618 10.5933 12.0651 9.99658 11.329 9.99658C10.5928 9.99658 9.99609 10.5933 9.99609 11.3295C9.99609 12.0656 10.5928 12.6623 11.329 12.6623Z"
        stroke="#6B7280"
        strokeWidth="1.33288"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_123_793">
        <rect width="15.9945" height="15.9945" fill="white" />
      </clipPath>
    </defs>
  </svg>
));
CarIcon.displayName = "CarIcon";

const GearIcon = memo(() => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_123_801)">
      <path
        d="M8.14359 1.33276H7.85035C7.49685 1.33276 7.15783 1.47319 6.90787 1.72315C6.6579 1.97312 6.51748 2.31214 6.51748 2.66564V2.7856C6.51724 3.01934 6.45553 3.2489 6.33856 3.45126C6.22159 3.65363 6.05346 3.82167 5.85104 3.93854L5.56447 4.10515C5.36185 4.22213 5.132 4.28372 4.89803 4.28372C4.66406 4.28372 4.43421 4.22213 4.23159 4.10515L4.13162 4.05183C3.82577 3.8754 3.46241 3.82754 3.1213 3.91875C2.7802 4.00996 2.48922 4.2328 2.31225 4.53833L2.16563 4.79158C1.9892 5.09743 1.94134 5.46079 2.03255 5.8019C2.12376 6.14301 2.34659 6.43398 2.65213 6.61096L2.7521 6.6776C2.95354 6.7939 3.12105 6.9609 3.23796 7.16199C3.35488 7.36308 3.41713 7.59127 3.41854 7.82388V8.16376C3.41947 8.39863 3.35832 8.62957 3.24129 8.8332C3.12426 9.03684 2.9555 9.20593 2.7521 9.32336L2.65213 9.38334C2.34659 9.56032 2.12376 9.85129 2.03255 10.1924C1.94134 10.5335 1.9892 10.8969 2.16563 11.2027L2.31225 11.456C2.48922 11.7615 2.7802 11.9843 3.1213 12.0756C3.46241 12.1668 3.82577 12.1189 4.13162 11.9425L4.23159 11.8892C4.43421 11.7722 4.66406 11.7106 4.89803 11.7106C5.132 11.7106 5.36185 11.7722 5.56447 11.8892L5.85104 12.0558C6.05346 12.1726 6.22159 12.3407 6.33856 12.543C6.45553 12.7454 6.51724 12.975 6.51748 13.2087V13.3287C6.51748 13.6822 6.6579 14.0212 6.90787 14.2711C7.15783 14.5211 7.49685 14.6615 7.85035 14.6615H8.14359C8.49709 14.6615 8.83611 14.5211 9.08607 14.2711C9.33604 14.0212 9.47646 13.6822 9.47646 13.3287V13.2087C9.4767 12.975 9.5384 12.7454 9.65538 12.543C9.77235 12.3407 9.94048 12.1726 10.1429 12.0558L10.4295 11.8892C10.6321 11.7722 10.8619 11.7106 11.0959 11.7106C11.3299 11.7106 11.5597 11.7722 11.7623 11.8892L11.8623 11.9425C12.1682 12.1189 12.5315 12.1668 12.8726 12.0756C13.2137 11.9843 13.5047 11.7615 13.6817 11.456L13.8283 11.1961C14.0047 10.8902 14.0526 10.5268 13.9614 10.1857C13.8702 9.84463 13.6473 9.55365 13.3418 9.37668L13.2418 9.32336C13.0384 9.20593 12.8697 9.03684 12.7526 8.8332C12.6356 8.62957 12.5745 8.39863 12.5754 8.16376V7.83054C12.5745 7.59568 12.6356 7.36473 12.7526 7.1611C12.8697 6.95746 13.0384 6.78837 13.2418 6.67094L13.3418 6.61096C13.6473 6.43398 13.8702 6.14301 13.9614 5.8019C14.0526 5.46079 14.0047 5.09743 13.8283 4.79158L13.6817 4.53833C13.5047 4.2328 13.2137 4.00996 12.8726 3.91875C12.5315 3.82754 12.1682 3.8754 11.8623 4.05183L11.7623 4.10515C11.5597 4.22213 11.3299 4.28372 11.0959 4.28372C10.8619 4.28372 10.6321 4.22213 10.4295 4.10515L10.1429 3.93854C9.94048 3.82167 9.77235 3.65363 9.65538 3.45126C9.5384 3.2489 9.4767 3.01934 9.47646 2.7856V2.66564C9.47646 2.31214 9.33604 1.97312 9.08607 1.72315C8.83611 1.47319 8.49709 1.33276 8.14359 1.33276Z"
        stroke="#6B7280"
        strokeWidth="1.33288"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99736 9.99668C9.10156 9.99668 9.99668 9.10156 9.99668 7.99736C9.99668 6.89317 9.10156 5.99805 7.99736 5.99805C6.89317 5.99805 5.99805 6.89317 5.99805 7.99736C5.99805 9.10156 6.89317 9.99668 7.99736 9.99668Z"
        stroke="#6B7280"
        strokeWidth="1.33288"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_123_801">
        <rect width="15.9945" height="15.9945" fill="white" />
      </clipPath>
    </defs>
  </svg>
));
GearIcon.displayName = "GearIcon";

const PassengerIcon = memo(() => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_123_807)">
      <path
        d="M10.6632 13.9952V12.6623C10.6632 11.9553 10.3823 11.2773 9.88237 10.7774C9.38244 10.2774 8.7044 9.99658 7.9974 9.99658H3.99876C3.29176 9.99658 2.61372 10.2774 2.11379 10.7774C1.61386 11.2773 1.33301 11.9553 1.33301 12.6623V13.9952"
        stroke="#6B7280"
        strokeWidth="1.33288"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.99779 7.33078C7.47004 7.33078 8.66354 6.13728 8.66354 4.66502C8.66354 3.19277 7.47004 1.99927 5.99779 1.99927C4.52553 1.99927 3.33203 3.19277 3.33203 4.66502C3.33203 6.13728 4.52553 7.33078 5.99779 7.33078Z"
        stroke="#6B7280"
        strokeWidth="1.33288"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6614 13.9952V12.6624C14.661 12.0717 14.4644 11.4979 14.1025 11.0311C13.7407 10.5643 13.234 10.2309 12.6621 10.0833"
        stroke="#6B7280"
        strokeWidth="1.33288"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6631 2.08594C11.2365 2.23275 11.7447 2.56624 12.1077 3.03382C12.4706 3.5014 12.6676 4.07648 12.6676 4.66839C12.6676 5.2603 12.4706 5.83538 12.1077 6.30295C11.7447 6.77053 11.2365 7.10402 10.6631 7.25084"
        stroke="#6B7280"
        strokeWidth="1.33288"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_123_807">
        <rect width="15.9945" height="15.9945" fill="white" />
      </clipPath>
    </defs>
  </svg>
));
PassengerIcon.displayName = "PassengerIcon";

const FeaturesCheckIcon = memo(() => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Fixed: fill-opacity → fillOpacity (JSX requires camelCase) */}
    <path
      d="M0 9.9931C0 4.47407 4.47407 0 9.9931 0C15.5121 0 19.9862 4.47407 19.9862 9.9931C19.9862 15.5121 15.5121 19.9862 9.9931 19.9862C4.47407 19.9862 0 15.5121 0 9.9931Z"
      fill="#1A56DB"
      fillOpacity="0.1"
    />
    <path
      d="M13.9819 6.99585L8.48695 12.4908L5.98926 9.99309"
      stroke="#1A56DB"
      strokeWidth="0.999079"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));
FeaturesCheckIcon.displayName = "FeaturesCheckIcon";
