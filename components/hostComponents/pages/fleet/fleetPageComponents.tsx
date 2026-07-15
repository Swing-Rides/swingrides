"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { HOST_DASHBOARD_PATH } from "@/constants/constant";

import PageWrapper from "../../dashboard/pageWrapper";
import FleetTable from "./fleetTable";
import PopupWrapper from "./popupWrapper";
import FleetLoading from "./pageLoading";
import FleetErrorState from "./pageErrorState";
import EmptyFleetState from "./pageEmptyState";
import RequestRelistVehicleForm from "../../forms/requestRelistVehicleForm";
import type { RequestRelistFormValues } from "../../forms/requestRelistVehicleForm";
import UnlistVehicleForm from "../../forms/unlistVehicleForm";
import type { UnlistVehicleFormValues } from "../../forms/unlistVehicleForm";
import SnoozeForm from "../../forms/snoozeForm";
import type { SnoozeFormValues } from "../../forms/snoozeForm";
import {
  useCreateBookingMutation,
  useDeleteVehicleMutation,
  useEndSnoozeEarlyMutation,
  useLazyListVehcleQuery,
  useRelistVehicleMutation,
  useSnoozeVehicleMutation,
  useUnlistVehicleMutation,
} from "@/app/store/services/hostApi";
import { IListVehiclesDatum } from "@/types/vehicle.type";

type PopupType = "relist" | "unlist" | "createSnooze" | "editSnooze" | null;
const SEARCH_DEBOUNCE_MS = 400;

export default function FleetPageComponents() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const [fetchVehicles, { isLoading, isFetching, isError, data }] =
    useLazyListVehcleQuery();
  const [createBooking, { isLoading: isCreatingBooking }] =
    useCreateBookingMutation();
  const [unlistVehicle, { isLoading: isUnlisting }] =
    useUnlistVehicleMutation();
  const [relistVehicle, { isLoading: isRelisting }] =
    useRelistVehicleMutation();
  const [snoozeVehicle, { isLoading: isSavingSnooze }] =
    useSnoozeVehicleMutation();
  const [endSnoozeEarly, { isLoading: isEndingSnoozeEarly }] =
    useEndSnoozeEarlyMutation();
  const [deleteVehicle, { isLoading: isDeleting }] = useDeleteVehicleMutation();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [createBookingError, setCreateBookingError] = useState<string | null>(
    null,
  );
  const [vehicleActionError, setVehicleActionError] = useState<string | null>(
    null,
  );

  const page = Number(searchParams.get("fleet_page") ?? 1);
  const search = searchParams.get("fleet_search") ?? "";
  const status = searchParams.get("fleet_status") ?? "";
  const vehicleType = searchParams.get("fleet_type") ?? "";
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [activePopup, setActivePopup] = useState<PopupType>(null);
  const [selectedVehicle, setSelectedVehicle] =
    useState<IListVehiclesDatum | null>(null);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearch(search);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const loadVehicles = () => {
    fetchVehicles({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      limit: 10,
      search: debouncedSearch,
      status,
      vehicleType,
    });
  };

  useEffect(() => {
    loadVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchVehicles, page, debouncedSearch, status, vehicleType]);

  const closePopup = () => {
    setActivePopup(null);
    setSelectedVehicle(null);
  };

  const handleUnlistVehicle = (vehicle: IListVehiclesDatum) => {
    setSelectedVehicle(vehicle);
    setActivePopup("unlist");
  };

  const handleRelistVehicle = (vehicle: IListVehiclesDatum) => {
    setSelectedVehicle(vehicle);
    setActivePopup("relist");
  };

  const handleSnoozeVehicle = (vehicle: IListVehiclesDatum) => {
    setSelectedVehicle(vehicle);
    setActivePopup("createSnooze");
  };

  const handleEditSnoozeVehicle = (vehicle: IListVehiclesDatum) => {
    setSelectedVehicle(vehicle);
    setActivePopup("editSnooze");
  };

  const handleDeleteVehicle = async (vehicle: IListVehiclesDatum) => {
    setDeleteError(null);

    try {
      await deleteVehicle(vehicle._id).unwrap();
    } catch (error) {
      setDeleteError(getMutationErrorMessage(error));
    }
  };

  const handleCreateBooking = async (vehicle: IListVehiclesDatum) => {
    setCreateBookingError(null);

    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() + 1);

    const returnDate = new Date(pickupDate);
    returnDate.setDate(returnDate.getDate() + 1);

    try {
      await createBooking({
        vehicleId: vehicle._id,
        renterName: "Walk-in Guest",
        renterEmail: "guest@example.com",
        renterPhone: "+15555550123",
        pickupDate: pickupDate.toISOString(),
        returnDate: returnDate.toISOString(),
        location: vehicle.pickupLocation || vehicle.city,
        addOns: [],
      }).unwrap();

      router.refresh();
    } catch (error) {
      setCreateBookingError(getMutationErrorMessage(error));
    }
  };

  const handleEndSnoozeEarly = async (vehicle: IListVehiclesDatum) => {
    setVehicleActionError(null);

    try {
      await endSnoozeEarly({ vehicleId: vehicle._id }).unwrap();
      loadVehicles();
      closePopup();
    } catch (error) {
      setVehicleActionError(getMutationErrorMessage(error));
    }
  };

  const submitRelistRequest = async (values: RequestRelistFormValues) => {
    if (!selectedVehicle?._id) return;

    setVehicleActionError(null);

    try {
      await relistVehicle({
        vehicleId: selectedVehicle._id,
        reason: values.reason,
        supportingDocuments: [],
      }).unwrap();

      closePopup();
      loadVehicles();
    } catch (error) {
      setVehicleActionError(getMutationErrorMessage(error));
    }
  };

  const submitUnlistVehicle = async (values: UnlistVehicleFormValues) => {
    if (!selectedVehicle?._id) return;

    setVehicleActionError(null);

    try {
      await unlistVehicle({
        vehicleId: selectedVehicle._id,
        reason: values.reason,
      }).unwrap();

      closePopup();
      loadVehicles();
    } catch (error) {
      setVehicleActionError(getMutationErrorMessage(error));
    }
  };

  const submitCreateSnooze = async (values: SnoozeFormValues) => {
    if (!selectedVehicle?._id) return;

    setVehicleActionError(null);

    try {
      await snoozeVehicle({
        vehicleId: selectedVehicle._id,
        snoozeStart: values.startDate.toISOString(),
        snoozeEnd: values.endDate.toISOString(),
      }).unwrap();

      closePopup();
      loadVehicles();
    } catch (error) {
      setVehicleActionError(getMutationErrorMessage(error));
    }
  };

  const submitEditSnooze = async (values: SnoozeFormValues) => {
    if (!selectedVehicle?._id) return;

    setVehicleActionError(null);

    try {
      await snoozeVehicle({
        vehicleId: selectedVehicle._id,
        snoozeStart: values.startDate.toISOString(),
        snoozeEnd: values.endDate.toISOString(),
      }).unwrap();

      closePopup();
      loadVehicles();
    } catch (error) {
      setVehicleActionError(getMutationErrorMessage(error));
    }
  };

  // Only show the full-page skeleton on the very first load (no data yet).
  // Subsequent refetches (search/filter/pagination) are handled by
  // FleetTable's own isFetching-driven loading state so the table doesn't
  // unmount on every keystroke.
  const isInitialLoading = isLoading && !data;
  const hasNoVehicles =
    !isInitialLoading && !isError && (data?.summary.totalVehicles ?? 0) === 0;

  const renderContent = () => {
    if (isInitialLoading) {
      return <FleetLoading />;
    }

    if (isError) {
      return (
        <FleetErrorState onRetry={loadVehicles} isRetrying={isFetching} />
      );
    }

    if (hasNoVehicles) {
      return <EmptyFleetState />;
    }

    return (
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
          isLoading={
            isFetching ||
            isDeleting ||
            isCreatingBooking ||
            isUnlisting ||
            isRelisting ||
            isSavingSnooze ||
            isEndingSnoozeEarly
          }
          isError={isError}
          onDeleteVehicle={handleDeleteVehicle}
          onUnlistVehicle={handleUnlistVehicle}
          onRelistVehicle={handleRelistVehicle}
          onSnoozeVehicle={handleSnoozeVehicle}
          onEditSnoozeVehicle={handleEditSnoozeVehicle}
          onCreateBooking={handleCreateBooking}
          onEndSnoozeEarly={handleEndSnoozeEarly}
        />
        {deleteError ? (
          <p className="mt-3 text-sm font-medium text-red-600">
            {deleteError}
          </p>
        ) : null}
        {createBookingError ? (
          <p className="mt-3 text-sm font-medium text-red-600">
            {createBookingError}
          </p>
        ) : null}
        {vehicleActionError ? (
          <p className="mt-3 text-sm font-medium text-red-600">
            {vehicleActionError}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <PageWrapper
        pageTitle="Fleet"
        pageDescription="Manage all your vehicles in one place"
        pageButton={<PageButton />}
      >
        {renderContent()}
      </PageWrapper>

      <PopupWrapper
        isOpen={activePopup === "relist"}
        title="Request to Relist Vehicle"
        description="Your request will be reviewed before this vehicle goes live again"
        onClose={closePopup}
        form={
          <RequestRelistVehicleForm
            onCancel={closePopup}
            onSubmit={submitRelistRequest}
          />
        }
      />

      <PopupWrapper
        isOpen={activePopup === "unlist"}
        title="Unlist Vehicle"
        description="Give a reason for unlisting this vehicle"
        onClose={closePopup}
        form={
          <UnlistVehicleForm
            // NOTE: check this against UnlistVehicleForm's actual prop type —
            // it previously received a hardcoded string, this now passes
            // the selected vehicle's real snooze end date when available.
            snoozeEnd={selectedVehicle?.snoozeEnd ?? ""}
            onCancel={closePopup}
            onSubmit={submitUnlistVehicle}
          />
        }
      />

      <PopupWrapper
        isOpen={activePopup === "createSnooze"}
        title="Create Snooze"
        onClose={closePopup}
        form={
          <SnoozeForm onCancel={closePopup} onSubmit={submitCreateSnooze} />
        }
      />

      <PopupWrapper
        isOpen={activePopup === "editSnooze"}
        title="Edit Snooze"
        onClose={closePopup}
        form={
          <SnoozeForm
            defaultValues={{
              duration: "custom",
              startDate: selectedVehicle?.snoozeStart
                ? new Date(selectedVehicle.snoozeStart)
                : undefined,
              endDate: selectedVehicle?.snoozeEnd
                ? new Date(selectedVehicle.snoozeEnd)
                : undefined,
            }}
            onCancel={closePopup}
            onSubmit={submitEditSnooze}
          />
        }
      />
    </>
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

function getMutationErrorMessage(error: unknown) {
  const fallback = "Unable to delete vehicle. Please try again.";

  if (!error || typeof error !== "object") return fallback;

  const data = "data" in error ? (error as { data?: unknown }).data : undefined;

  if (typeof data === "string") return data;

  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
}