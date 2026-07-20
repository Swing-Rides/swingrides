"use client";

import CarPageComponent from "@/components/pages/broswerCarsPage/carPageComponent";
import { useGetPublicVehicleByIdQuery } from "@/app/store/services/publicApi";
import { use } from "react";
import VehicleNotFound from "@/components/pages/broswerCarsPage/vehicleNotFound";
import CarPageLoading from "@/components/pages/broswerCarsPage/carPageLoading";

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
    return <CarPageLoading />;
  }

  if (isError || !data) {
    return <VehicleNotFound />;
  }

  return (
    <CarPageComponent
      carName={data?.data.carName}
      vehicleId={data?.data.id as string}
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
        totalReviews: data.data.host.totalReviews,
        starRatingBreakdown: [],
        reviews: [],
      }}
      status={data?.data.status === "available" ? "available" : "unlisted"}
      specifications={{
        make: data.data.make,
        model: data.data.vehicleModel,
        year: data.data.year,
        bodyType: data.data.vehicleType,
        engine: data.data.engine,
        horsepower: Number(data.data.horsepower) || 0,
        transmission: data?.data.specifications?.transmission,
        driveType: data.data.driverType,
        fuelType: data?.data.specifications?.fuelType,
        fuelEfficiency: data.data.fuelEfficiency,
        seats: data?.data.specifications?.seats,
        doors: Number(data.data.doors) || 0,
        color: data.data.color,
        mileage: String(data.data.mileage),
        // features: data.data.features || [],
      }}
      overview={data.data.description}
      host={{
        hostName: `${data.data.host.firstName} ${data.data.host.lastName}`,
        memberSince: new Date(data.data.host.createdAt).toLocaleString(),
        tripsCompleted: 0,
        rating: data.data.host.rating as number,
        contactNumber: data.data.host.phoneNumber,
      }}
      price={{
        daily: data?.data.price?.daily,
        weekly: data?.data.price?.weekly,
        monthly: data?.data.price?.monthly,
      }}
      defaultPickupLocationStreet={data.data.streetAdress}
      defaultPickupLocationCity={data.data.city}
      defaultPickupLocationState={data.data.state}
      defaultPickupLocationZipCode={data.data.zipCode}
      insuranceExpiration={data.data.insuranceExpiration}
      insuranceProvider={data.data.insuranceProvider}
      insuranceFee={data.data.insuranceFee}
      policyNumber={data.data.policyNumber}
    />
  );
}
