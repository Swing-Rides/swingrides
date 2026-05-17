"use client";

import RenterPageComponents from "@/components/superAdminPages/pages/singleRenterPageComponent/renterPageComponents";
import { useGetAdminRenterByIdQuery } from "@/app/store/services/adminApi";

type RenterPageClientProps = {
  renterId: string;
};

export default function RenterPageClient({ renterId }: RenterPageClientProps) {
  const { data, isLoading, isError } = useGetAdminRenterByIdQuery(renterId);

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-gray-500">Loading renter profile...</div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="p-6 text-sm text-red-600">
        Failed to load renter details.
      </div>
    );
  }

  const { renter, stats, verification, bookings, documents } = data.data;

  return (
    <RenterPageComponents
      renter={renter}
      stats={stats}
      verification={verification}
      documents={documents}
      bookings={bookings}
    />
  );
}
