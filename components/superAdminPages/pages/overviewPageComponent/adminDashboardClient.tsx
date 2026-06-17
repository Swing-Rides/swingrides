"use client";

// import AdminPageComponents from "@/components/superAdminPages/pages/adminPageComponents";
import { useGetAdminOverviewQuery } from "@/app/store/services/adminApi";
import { AdminPageSkeleton } from "../../loadingSkeletons/adminPageSkeleton";
import AdminPageComponents from "./adminPageComponents";

export default function AdminDashboardClient() {
  const { data, isLoading, isError } = useGetAdminOverviewQuery();

  if (isLoading) {
    return <AdminPageSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <div className="p-6 text-sm text-red-600">
        Failed to load admin overview.
      </div>
    );
  }

  return <AdminPageComponents isLoading={isLoading} overview={data.data} />;
}
