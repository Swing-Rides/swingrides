"use client";

import CarPageComponent from "@/components/pages/broswerCarsPage/carPageComponent";
import {
  useGetPublicBrowseVehiclesQuery,
  useGetPublicVehicleByIdQuery,
} from "@/app/store/services/publicApi";
import { use } from "react";

export default function CarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data, isLoading, isError } = useGetPublicVehicleByIdQuery({
    id: slug,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>This page can not be found</div>;
  }

  return (
    <CarPageComponent
      carName={data?.data.carName}
      featuredImage={{
        alt: data?.data.featuredImage?.alt,
        src: data?.data.featuredImage?.src,
      }}
      gallery={
        data?.data.images?.map((d, index) => {
          return {
            id: `${data?.data.id}-${index}`,
            alt: data?.data.carName,
            src: d,
          };
        }) || []
      }
      reviewsAndRatings={{
        averageRating: data?.data.reviewsAndRatings?.averageRating || 0,
        totalRatings: data?.data.reviewsAndRatings?.totalRatings || 0,
        totalReviews: 0,
        starRatingBreakdown: [],
        reviews: [],
      }}
      status={data?.data.status === "available" ? "available" : "unlisted"}
      specifications={{
        make: data.data.make,
        model: data.data.vehicleModel,
        year: data.data.year,
        bodyType: data.data.vehicleType,
        engine: "",
        horsepower: 0,
        transmission: data?.data.specifications?.transmission,
        driveType: "",
        fuelType: data?.data.specifications?.fuelType,
        fuelEfficiency: "",
        seats: data?.data.specifications?.seats,
        doors: 0,
        color: data.data.color,
        mileage: String(data.data.mileage),
      }}
      overview={""}
      host={{
        hostName: "",
        memberSince: "",
        tripsCompleted: 0,
        rating: 0,
        contactNumber: "",
      }}
      price={{
        daily: data?.data.price?.daily,
        weekly: data?.data.price?.weekly,
        monthly: data?.data.price?.monthly,
      }}
      pickupLocation={data?.data.location}
    />
  );
}
