"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import PageWrapper from "../../dashboard/pageWrapper";
import { OverviewCard } from "../subscribersPageComponents";
import { RentersListTable } from "./renterListTables";
import {
  useGetAdminRentersQuery,
  useGetAdminVerificationPendingRentersQuery,
} from "@/app/store/services/adminApi";
import { AdminRenterDataStatus } from "@/types/renters.type";

export default function RentersPageComponents() {
  const searchParams = useSearchParams();

  const statusParam = searchParams.get("status");

  const renterFilters = useMemo(() => {
    let status: AdminRenterDataStatus | undefined;
    if (
      statusParam === "verified" ||
      statusParam === "pending" ||
      statusParam === "rejected"
    ) {
      status = statusParam;
    }

    return {
      status,
    };
  }, [statusParam]);

  const {
    data: renterResponse,
    isLoading: isRentersLoading,
    isError: isRentersError,
  } = useGetAdminRentersQuery(renterFilters);
  const {
    data: pendingVerificationResponse,
    isLoading: isQueueLoading,
    isError: isQueueError,
  } = useGetAdminVerificationPendingRentersQuery(undefined);

  if (isRentersLoading || isQueueLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading renters...</div>;
  }

  if (
    isRentersError ||
    isQueueError ||
    !renterResponse?.data ||
    !pendingVerificationResponse?.data
  ) {
    return (
      <div className="p-6 text-sm text-red-600">
        Failed to load renters data.
      </div>
    );
  }

  const data = renterResponse.data;
  const pendingVerificationData = pendingVerificationResponse.data;

  // console.log("Renter Data ==", data)
  // console.log("pendingVerificationData +++==", pendingVerificationData)

  return (
    <PageWrapper
      pageTitle="Renters"
      pageDescription="Manage all registered renters and verify driver documents"
    >
      <div>
        <div className="flex flex-wrap gap-4 mt-8">
          <OverviewCard
            label="Total Registered renters"
            number={data.summary.totalRegisteredRenters}
            textColor="#1A56DB"
          />
          <OverviewCard
            label="verified renters"
            number={data.summary.verifiedRenters}
            textColor="#0891B2"
          />
          <OverviewCard
            label="pending Verifications"
            number={data.summary.pendingVerifications}
            textColor="#EF4444"
          />
        </div>
      </div>

      <RentersListTable
        data={data}
        pendingVerificationData={pendingVerificationData}
      />
    </PageWrapper>
  );
}
