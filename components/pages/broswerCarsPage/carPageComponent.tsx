"use client";

import { memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Calendar, Car, Settings, Star, Users } from "lucide-react";
import GallerySlider from "@/components/slider/gallerySlider";
import { shareContent } from "./util";
import { toast } from "sonner";

const getPendingCheckoutStorageKey = (vehicleId: string) =>
  `swingrides:pending-checkout:${vehicleId}`;

export default function CarPageComponent({
  carName,
  gallery,
  reviewsAndRatings,
  status,
  specifications,
  overview,
  host,
  price,
  defaultPickupLocationStreet,
  defaultPickupLocationCity,
  defaultPickupLocationState,
  defaultPickupLocationZipCode,
  vehicleId,
  insuranceFee,
}: CarPageComponentProp) {
  return (
    <>
      <NotificationBar carName={carName} />
      <section className="py-5 px-2.5 md:py-10 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <LeftContent
            carName={carName}
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
          <RightContent
            price={price}
            defaultPickupLocationStreet={defaultPickupLocationStreet}
            defaultPickupLocationCity={defaultPickupLocationCity}
            defaultPickupLocationState={defaultPickupLocationState}
            defaultPickupLocationZipCode={defaultPickupLocationZipCode}
            vehicleId={vehicleId}
            insuranceFeePerDay={insuranceFee}
          />
        </div>
      </section>
    </>
  );
}

const NotificationBar = memo(({ carName }: { carName: string }) => {

  const handleShare = () => {
    shareContent({
      title: carName,
      text: `Check out this ${carName}`,
    });
  };

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
          <span className="text-blue-700 text-sm font-semibold font-text leading-5">
            {carName}
          </span>
        </div>
        <div className="flex justify-start items-center">
          <button
            onClick={handleShare} 
            className="w-full md:w-fit font-text px-4 py-1.5 text-xs cursor-pointer border border-blue-700 text-blue-700 bg-transparent hover:bg-blue-700 hover:text-white transition-colors duration-300 rounded-xs text-nowrap"
          >
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
          <GallerySlider gallery={gallery} />
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
  ({
    price,
    defaultPickupLocationStreet,
    defaultPickupLocationCity,
    defaultPickupLocationState, 
    defaultPickupLocationZipCode,
    vehicleId,
    insuranceFeePerDay,
  }: {
    price: CarPageComponentProp["price"];
    defaultPickupLocationStreet: string;
    defaultPickupLocationCity: string;
    defaultPickupLocationState: string;
    defaultPickupLocationZipCode: string;
    vehicleId: string;
    insuranceFeePerDay?: number;
  }) => {
    const router = useRouter();

    const handleSubmit = async (values: PaymentFormValues) => {
      if (!vehicleId) {
        toast.error("Vehicle ID is required");
        return;
      }

      const pickupTime = new Date(values.pickupDate)
        .toISOString()
        .split("T")[1];
      const returnTime = new Date(values.returnDate)
        .toISOString()
        .split("T")[1];

      try {
        const pendingCheckout = {
          vehicleId,
          pickupDate: values.pickupDate,
          returnDate: values.returnDate,
          street: values.street,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          insuranceProvider: values.insuranceProvider,
          policyNumber: values.policyNumber,
          insuranceExpiry: values.insuranceExpiry,
          insuranceFeePerDay: values.insuranceFee,
          hostProvidingCoverage: values.hostProvidingCoverage,
          subtotal: values.subtotal ?? 0,
          tax: values.tax ?? 0,
          taxRate: values.taxRate ?? 0.08,
          totalAmount: values.totalAmount ?? 0,
          totalDays: values.totalDays ?? 0,
          pickupTime,
          returnTime,
        };

        window.sessionStorage.setItem(
          getPendingCheckoutStorageKey(vehicleId),
          JSON.stringify(pendingCheckout),
        );
        toast.success('Processing checkout')
        router.push(`/checkout/${vehicleId}`);
      } catch (error) {
        toast.error("Failed to start checkout");
        console.error("Failed to start checkout:", error);
      }
    };

    return (
      <div className="col-span-1 md:col-span-5 w-full">
        <PaymentSection
          price={price}
          street={defaultPickupLocationStreet}
          city={defaultPickupLocationCity}
          state={defaultPickupLocationState}
          zipCode={defaultPickupLocationZipCode}
          vehicleId={vehicleId}
          onSubmit={handleSubmit}
          insuranceFeePerDay={insuranceFeePerDay}
        />
      </div>
    );
  },
);
RightContent.displayName = "RightContent";

const CarDetailCard = memo(
  ({
    carName,
    status,
    reviewsAndRatings,
    specifications,
    overview,
  }: CarDetailCardProps) => {
    return (
      <div className="flex flex-col gap-5 p-4 md:p-6 rounded-[10px] border border-gray-200 bg-white">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 justify-between items-center">
            <h3 className="text-neutral-950 text-2xl font-bold font-text leading-8">
              {carName}
            </h3>
            <div className="px-3 py-0.5 bg-green-100 text-green-500 capitalize text-xs font-medium font-text leading-5 rounded-full">
              <span>{status}</span>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <div className="flex gap-2 items-center">
              <Star className="size-4 aspect-square fill-yellow-400 text-yellow-400" />
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
          <Badge className="flex gap-2 py-3 px-4 bg-gray-100 rounded-[10px] capitalize">
            <Car className="size-4 aspect-square text-gray-500" />
            <span className="flex text-gray-500">{specifications.bodyType}</span>
          </Badge>
          <Badge className="flex gap-2 py-3 px-4 bg-gray-100 rounded-[10px]">
            <Settings className="size-4 aspect-square text-gray-500" />
            <span className="flex text-gray-500">
              {specifications.transmission}
            </span>
          </Badge>
          <Badge className="flex gap-2 py-3 px-4 bg-gray-100 rounded-[10px]">
            <Users className="size-4 aspect-square text-gray-500" />
            <span className="flex text-gray-500">{specifications.seats} seats</span>
          </Badge>
          <Badge className="flex gap-2 py-3 px-4 bg-gray-100 rounded-[10px]">
            <Calendar className="size-4 text-gray-500" />
            <span className="flex text-gray-500">{specifications.year}</span>
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-5">
          <TabsList className="justify-start border-b pb-0 border-black rounded-none gap-8 w-full bg-white">
            <TabsTrigger
              value="overview"
              className="max-w-fit p-0  pb-3.5 -mb-0.5 text-gray-500 text-sm font-medium font-text leading-5 border-b-2 border-b-transparent shadow-none shadow-transparent data-active:rounded-none data-active:text-blue-700 data-active:border-b-blue-700 data-active:shadow-none cursor-pointer"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="specifications"
              className="max-w-fit p-0  pb-3.5 -mb-0.5 text-gray-500 text-sm font-medium font-text leading-5 border-b border-b-transparent shadow-none shadow-transparent data-active:rounded-none data-active:text-blue-700 data-active:border-b-blue-700 data-active:shadow-none cursor-pointer"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="max-w-fit p-0  pb-3.5 -mb-0.5 text-gray-500 text-sm font-medium font-text leading-5 border-b border-b-transparent shadow-none shadow-transparent data-active:rounded-none data-active:text-blue-700 data-active:border-b-blue-700 data-active:shadow-none cursor-pointer"
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
          <div className="size-12 aspect-square rounded-full grid place-content-center bg-blue-700">
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
        <Link 
          href={`tel:${contactNumber}`} 
          title={`Contact ${hostName}`}
          className="p-2 px-5 text-xs rounded-xs border border-blue-700 text-blue-700 hover:bg-blue-950 hover:text-white hover:border-blue-950 transition-colors duration-300 text-nowrap font-medium font-text leading-5 cursor-pointer"
        >
          Contact Host
        </Link>
      </div>
    );
  },
);
HostCard.displayName = "HostCard";

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