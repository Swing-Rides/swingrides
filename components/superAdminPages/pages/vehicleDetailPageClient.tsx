"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import VehicleDetailPage from "@/components/superAdminPages/pages/vehicleDetailPage";
import { useGetAdminSubscriberFleetDetailQuery } from "@/app/store/services/adminApi";
import {
  MaintenanceStatusType,
  SubscriberPlan,
} from "@/constants/superAdminSidebar";

const FALLBACK_GALLERY = [
  {
    src: "/images/test-car-1.webp",
    alt: "Vehicle image",
  },
];

const formatDisplayDate = (value?: string | null) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function VehicleDetailPageClient() {
  const params = useParams<{
    slug?: string | string[];
    id?: string | string[];
  }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  console.log("VehicleDetailPageClient params:", { slug, id });

  if (!slug || !id) {
    return (
      <div className="p-6 text-sm text-red-600">
        Missing route parameters for fleet details.
      </div>
    );
  }

  const { data, isLoading, isError } = useGetAdminSubscriberFleetDetailQuery({
    subscriberId: slug,
    fleetId: id,
  });

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-gray-500">Loading fleet details...</div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="text-center w-full h-full grid place-content-center gap-4 p-6">
        <div className="space-y-2">
          <h3 className="font-text text-base">
            This is Fleet ID: <span className="font-bold">{id}</span> is not
            avaliable on the platform.
          </h3>
          <span className="font-text text-3xl font-bold">
            Page cannot be found
          </span>
          <div className="mt-2.5">
            <Link
              href="/admin"
              className="text-blue-700 underline hover:text-blue-900 duration-300 transition-color"
            >
              Go back to overview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { subscriber, fleet, metrics } = data.data;

  const gallery =
    fleet.images?.length > 0
      ? fleet.images.map((img, index) => ({
          src: img,
          alt: `${fleet.name} image ${index + 1}`,
        }))
      : FALLBACK_GALLERY;

  return (
    <VehicleDetailPage
      carName={fleet.name}
      parentSlug={slug}
      status={fleet.status}
      bodyType={fleet.type}
      color={fleet.color}
      year={fleet.year}
      gallery={gallery}
      make={fleet.make}
      model={fleet.model}
      transmission={fleet.transmission}
      fuelType="N/A"
      seats={fleet.seats}
      plateNumber={fleet.licensePlate}
      vin={fleet.vin}
      vehicleId={fleet.fleetId}
      dailyRate={fleet.pricing.daily}
      weeklyRate={fleet.pricing.weekly}
      monthlyRate={fleet.pricing.monthly}
      mileage={fleet.mileage}
      totalTrips={metrics.totalTrips}
      totalRevenue={metrics.totalRevenue}
      totalExpenses={0}
      lastService={formatDisplayDate(metrics.lastInvoiceAt)}
      nextService={formatDisplayDate(fleet.updatedAt)}
      maintenanceStatus={"up to date" as MaintenanceStatusType}
      organisationName={subscriber.organization}
      subscriptionPlan={subscriber.plan as SubscriberPlan}
      hostEmail={subscriber.ownerEmail}
    />
  );
}
