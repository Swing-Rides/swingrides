"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PageWrapper from "../../dashboard/pageWrapper";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import FleetTable from "./fleetTable";
import { useLazyListVehcleQuery } from "@/app/store/services/hostApi";

export default function FleetPageComponents() {
  const searchParams = useSearchParams();
  const [fetchVehicles, { isLoading, isFetching, isError, data }] =
    useLazyListVehcleQuery();

  const page = Number(searchParams.get("fleet_page") ?? 1);
  const search = searchParams.get("fleet_search") ?? "";
  const status = searchParams.get("fleet_status") ?? "";
  const vehicleType = searchParams.get("fleet_vehicleType") ?? "";

  useEffect(() => {
    fetchVehicles({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      limit: 10,
      search,
      status,
      vehicleType,
    });
  }, [fetchVehicles, page, search, status, vehicleType]);

  return (
    <PageWrapper
      pageTitle="Fleet"
      pageDescription="Manage all your vehicles in one place"
      pageButton={<PageButton />}
    >
      <div className="mt-4 md:mt-8">
        <div className="flex flex-wrap items-center gap-4">
          <OverviewCard
            title="Total Vehicles"
            number={data?.summary.totalVehicles.toString() || "0"}
            numberColor="text-blue-700"
          />
          <OverviewCard
            title="Available"
            number={data?.summary.available.toString() || "0"}
            numberColor="text-cyan-600"
          />
          <OverviewCard
            title="Currently Rented"
            number={data?.summary.currentlyRented.toString() || "0"}
            numberColor="text-blue-500"
          />
          <OverviewCard
            title="In Service"
            number={data?.summary.inService.toString() || "0"}
            numberColor="text-amber-500"
          />
          <OverviewCard
            title="Fleet Value"
            number={data?.summary.fleetValueFormatted || "$0"}
            numberColor="text-emerald-500"
          />
        </div>
        <FleetTable
          data={data?.data}
          pagination={data?.pagination}
          rowsPerPage={10}
          isLoading={isLoading || isFetching}
          isError={isError}
        />
      </div>
    </PageWrapper>
  );
}

const PageButton = () => {
  return (
    <Link
      href={`${HOST_DASHBOARD_PATH}fleet/add-vehicle`}
      className="px-6 py-2 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300"
    >
      Add Vehicle
    </Link>
  );
};

type OverviewCardProps = {
  title: string;
  number: string;
  numberColor: string;
};

const OverviewCard = ({ title, number, numberColor }: OverviewCardProps) => {
  return (
    <div className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
      <div>
        <span className="text-gray-500 text-xs font-semibold font-text uppercase">
          {title}
        </span>
      </div>
      <div className="self-stretch h-9 relative">
        <span className={`text-3xl font-medium font-text ${numberColor}`}>
          {number}
        </span>
      </div>
    </div>
  );
};
