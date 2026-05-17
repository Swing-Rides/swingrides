"use client";

import AdminPageComponents from "@/components/superAdminPages/pages/adminPageComponents";
import { useGetAdminOverviewQuery } from "@/app/store/services/adminApi";

export default function AdminDashboardClient() {
  const { data, isLoading, isError } = useGetAdminOverviewQuery();

  if (isLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading overview...</div>;
  }

  if (isError || !data?.data) {
    return (
      <div className="p-6 text-sm text-red-600">
        Failed to load admin overview.
      </div>
    );
  }

  return <AdminPageComponents overview={data.data} />;
}
