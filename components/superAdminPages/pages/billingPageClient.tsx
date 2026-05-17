"use client";

import BillingPageComponents from "@/components/superAdminPages/pages/billingPageComponents";
import { useGetAdminBillingQuery } from "@/app/store/services/adminApi";

export default function BillingPageClient() {
  const { data, isLoading, isError } = useGetAdminBillingQuery(undefined);

  return (
    <BillingPageComponents
      billing={data?.data}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
