"use client";

import React from "react";
import CarPageComponent from "./carPageComponent";
import { useGetPublicVehicleByIdQuery } from "@/app/store/services/publicApi";
import VehicleNotFound from "./vehicleNotFound";
import CarPageLoading from "./carPageLoading";
import { FleetStatus } from "@/types/subscribers.type";
import { JsonLd, getVehicleProductSchema } from "@/components/seo/jsonLd";

export default function CarPageClient({ slug }: { slug: string }) {
  const { data, isLoading, isError } = useGetPublicVehicleByIdQuery({
    id: slug,
  });

  if (isLoading) {
    return <CarPageLoading />;
  }

  if (isError || !data?.data) {
    return <VehicleNotFound />;
  }

  const vehicle = data.data;

  return (
    <>
      <JsonLd
        schema={getVehicleProductSchema({
          id: vehicle.id,
          carName: vehicle.carName,
          description: vehicle.description,
          images: vehicle.images || [],
          price: vehicle.price,
          city: vehicle.city,
          state: vehicle.state,
          make: vehicle.make,
          vehicleModel: vehicle.vehicleModel,
          year: vehicle.year,
          rating: vehicle.host?.rating,
          totalReviews: vehicle.host?.totalReviews,
        })}
      />
      <CarPageComponent
        carName={vehicle.carName}
        vehicleId={vehicle.id as string}
        gallery={
          vehicle.images?.map((d, index) => ({
            id: `${vehicle.id}-${index}`,
            alt: vehicle.carName,
            src: d,
          })) || []
        }
        reviewsAndRatings={{
          averageRating: vehicle.reviewsAndRatings?.averageRating || 0,
          totalRatings: vehicle.reviewsAndRatings?.totalRatings || 0,
          totalReviews: vehicle.host?.totalReviews || 0,
          starRatingBreakdown: [],
          reviews: [],
        }}
        status={
          vehicle.status === "available"
            ? "available"
            : (vehicle.status as FleetStatus)
        }
        specifications={{
          make: vehicle.make,
          model: vehicle.vehicleModel,
          year: vehicle.year,
          bodyType: vehicle.vehicleType,
          engine: vehicle.engine,
          horsepower: Number(vehicle.horsepower) || 0,
          transmission: vehicle.specifications?.transmission,
          driveType: vehicle.driverType,
          fuelType: vehicle.specifications?.fuelType,
          fuelEfficiency: vehicle.fuelEfficiency,
          seats: vehicle.specifications?.seats,
          doors: Number(vehicle.doors) || 0,
          color: vehicle.color,
          mileage: String(vehicle.mileage),
        }}
        overview={vehicle.description}
        host={{
          hostName: `${vehicle.host?.firstName || ""} ${vehicle.host?.lastName || ""}`.trim() || "Host",
          memberSince: vehicle.host?.createdAt
            ? new Date(vehicle.host.createdAt).toLocaleString()
            : "",
          tripsCompleted: 0,
          rating: (vehicle.host?.rating as number) || 0,
          contactNumber: vehicle.host?.phoneNumber || "",
          userVerified: !!vehicle.host?.isVerified,
        }}
        price={{
          daily: vehicle.price?.daily,
          weekly: vehicle.price?.weekly,
          monthly: vehicle.price?.monthly,
        }}
        defaultPickupLocationStreet={vehicle.location}
        defaultPickupLocationCity={vehicle.city}
        defaultPickupLocationState={vehicle.state}
        defaultPickupLocationZipCode={vehicle.zipCode}
        insuranceExpiration={vehicle.insuranceExpiration}
        insuranceProvider={vehicle.insuranceProvider}
        insuranceFee={vehicle.insuranceDaily}
        policyNumber={vehicle.policyNumber}
        taxRate={vehicle.taxRate}
      />
    </>
  );
}
