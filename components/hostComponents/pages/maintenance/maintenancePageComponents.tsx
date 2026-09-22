"use client";

import { useEffect, useState } from "react";
import PageWrapper from "../../dashboard/pageWrapper";
import {
  Activity,
  Clock,
  CheckCircle,
  CircleDashed,
  DollarSign,
  TriangleAlert,
  Wrench,
  XCircle,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLazyGetVehicleMaintenanceDashboardQuery } from "@/app/store/services/hostApi";
import LogMaintenanceServiceForm from "./logMaintenanceServiceForm";
import {
  MaintenanceOverviewCard,
  HealthOverviewCard,
} from "./maintenanceOverviewCards";
import { ServiceAlertData, ServiceAlertRow } from "./serviceAlertSection";
import { ServiceHistoryTableSection } from "./serviceHistoryTable";
import { formatDateOrFallback } from "./maintenanceutils";
import MaintenanceLoading from "./maintenanceLoading";
import MaintenanceErrorState from "./maintenanceErrorState";
import EmptyMaintenanceState from "./emptyMaintenanceState";
import { ServiceAlertItem } from "@/types/logservice.type";
import { formatCurrency } from "@/lib/pricing";
import { DUE_SOON_DAYS, DUE_SOON_KM } from "@/constants/maintenance";

/** Rows per page requested from the API. */
const PAGE_SIZE = 10;

export default function MaintenancePageComponents() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [fetchVehicleMaintainance, { data, isFetching, isError }] =
    useLazyGetVehicleMaintenanceDashboardQuery();
  const [modelOpen, setModelOpen] = useState(false);

  const logServiceParam = searchParams.get("log-service");
  const isModalOpen = Boolean(logServiceParam !== null || modelOpen);

  const handleOpenModal = (vehicleId?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("log-service", vehicleId ?? "true");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setModelOpen(true);
  };

  const handleCloseModal = () => {
    setModelOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("log-service");
    const newQuery = params.toString();
    router.replace(newQuery ? `${pathname}?${newQuery}` : pathname, {
      scroll: false,
    });
  };

  // The service history is paginated and filtered on the server, so each
  // control below reads the namespaced param the table itself writes
  // (`<tableId>_<key>` — see useTableParam in customTable.tsx). Page used to
  // read `fleet_page`, which this table never sets, so paging never advanced.
  const page = Number(searchParams.get("ServiceHistory_page") ?? 1);
  const search = searchParams.get("ServiceHistory_search") ?? "";
  const vehicleName = searchParams.get("ServiceHistory_vehicleName") ?? "";
  const serviceType = searchParams.get("ServiceHistory_serviceType") ?? "";
  const workshop = searchParams.get("ServiceHistory_workshop") ?? "";

  const loadMaintenanceData = () => {
    fetchVehicleMaintainance({
      limit: PAGE_SIZE,
      page: Number.isFinite(page) && page > 0 ? page : 1,
      search: search,
      serviceType: serviceType,
      vehicle: vehicleName,
      workshop: workshop,
    });
  };

  useEffect(() => {
    loadMaintenanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fetchVehicleMaintainance,
    page,
    search,
    serviceType,
    vehicleName,
    workshop,
  ]);

  const toAlertRow = (d: ServiceAlertItem, index: number): ServiceAlertRow => ({
    // vehicleName + serviceType alone collide when one vehicle has two alerts
    // of the same type, which duplicates React keys.
    id: `${d.vehicleName}-${d.serviceType}-${index}`,
    dueDate: formatDateOrFallback(d.dueDate),
    lastServiceDate: formatDateOrFallback(d.lastServiceDate),
    mileage: `${d.currentMileageKm.toLocaleString()} km`,
    badge: d.badge,
    serviceType: d.serviceType,
    vehicleName: d.vehicleName,
    currentMileageKm: d.currentMileageKm,
  });

  const summary = data?.data.summary;
  const health = data?.data.vehicleHealthOverview;
  const alerts = data?.data.serviceAlerts;
  const history = data?.data.serviceHistory;
  const filterOptions = data?.data.filterOptions;
  const serviceHistoryItems = history?.items ?? [];

  const isFiltered = Boolean(summary?.isFiltered);
  const hasAnyAlerts =
    (alerts?.overdue.length ?? 0) +
      (alerts?.dueSoon.length ?? 0) +
      (alerts?.upcoming.length ?? 0) >
    0;

  // This is a lazy query, so before the effect fires there is no data *and*
  // no in-flight flag — treating that as "loaded and empty" flashes the empty
  // state on every visit.
  const isInitialLoading = !data && !isError;
  // Counts come from `serviceHistory.total` (every page) rather than the
  // length of the current page, so an empty page 2 or a filter that matches
  // nothing no longer reads as "this host has never logged anything".
  const hasNoMaintenanceData =
    !isInitialLoading &&
    !isError &&
    !isFiltered &&
    (history?.total ?? 0) === 0;

  const renderBody = () => {
    if (isInitialLoading) {
      return <MaintenanceLoading />;
    }

    if (isError) {
      return <MaintenanceErrorState onRetry={loadMaintenanceData} />;
    }

    if (hasNoMaintenanceData) {
      return <EmptyMaintenanceState onLogService={() => handleOpenModal()} />;
    }

    return (
      <div className="mt-4 md:mt-8">
        <div className="flex flex-wrap items-center gap-4">
          <MaintenanceOverviewCard
            icon={<Wrench className="size-6 text-blue-700" />}
            iconBgColor="bg-indigo-50"
            title="Total Services"
            number={
              summary?.totalServices != null
                ? String(summary.totalServices)
                : "0"
            }
            label={isFiltered ? "Matching current filters" : undefined}
          />
          <MaintenanceOverviewCard
            icon={<DollarSign className="size-6 text-red-500" />}
            iconBgColor="bg-rose-100"
            title="Total Maintenance Cost"
            number={formatCurrency(summary?.totalMaintenanceCost)}
            label={isFiltered ? "Matching current filters" : undefined}
          />
          <MaintenanceOverviewCard
            icon={<Clock className="size-6 text-amber-500" />}
            iconBgColor="bg-orange-50"
            title="Vehicles Due Soon"
            number={
              summary?.vehiclesDueSoon != null
                ? String(summary.vehiclesDueSoon)
                : "0"
            }
            label={isFiltered ? "Across your whole fleet" : undefined}
          />
          <MaintenanceOverviewCard
            icon={<TriangleAlert className="size-6 text-red-500" />}
            iconBgColor="bg-red-100"
            title="Past-due Vehicles"
            number={
              summary?.overdueVehicles != null
                ? String(summary.overdueVehicles)
                : "0"
            }
            label={isFiltered ? "Across your whole fleet" : undefined}
          />
        </div>

        <div className="mt-4 md:mt-10 space-y-4">
          <div>
            <span className="text-neutral-950 text-base font-semibold font-text leading-6">
              Vehicle Health Overview
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <HealthOverviewCard
              icon={<CheckCircle className="size-6 text-emerald-500" />}
              iconBgColor="bg-green-100"
              title="Healthy"
              number={health?.healthy != null ? String(health.healthy) : "0"}
              label={`No service due within ${DUE_SOON_DAYS} days`}
            />
            <HealthOverviewCard
              icon={<Clock className="size-6 text-amber-500" />}
              iconBgColor="bg-orange-50"
              title="Due Soon"
              number={health?.dueSoon != null ? String(health.dueSoon) : "0"}
              label={`Service due within ${DUE_SOON_DAYS} days or ${DUE_SOON_KM.toLocaleString()} km`}
            />
            <HealthOverviewCard
              icon={<XCircle className="size-6 text-red-500" />}
              iconBgColor="bg-rose-100"
              title="Past-due"
              number={health?.overdue != null ? String(health.overdue) : "0"}
              label="Service past its due date or mileage"
            />
            <HealthOverviewCard
              icon={<CircleDashed className="size-6 text-gray-500" />}
              iconBgColor="bg-gray-100"
              title="Never Serviced"
              number={
                health?.neverServiced != null
                  ? String(health.neverServiced)
                  : "0"
              }
              label="No service logged yet"
            />
          </div>
        </div>

        {hasAnyAlerts && (
          <div className="my-4 md:my-6 space-y-6">
            <div>
              <span className="text-neutral-950 text-base font-semibold font-text leading-6">
                Service Alerts
              </span>
            </div>
            <ServiceAlertData
              icon={<TriangleAlert className="size-4 text-red-500" />}
              title="Past-due"
              serviceData={(alerts?.overdue ?? []).map(toAlertRow)}
              alertIconColor="text-red-500"
              alertIconBgColor="bg-red-500/10"
              alertBgColor="bg-red-500"
              alertBorderColor="border-red-500"
              isOverdue
            />
            <ServiceAlertData
              icon={<Clock className="size-4 text-amber-500" />}
              title="Due Soon"
              serviceData={(alerts?.dueSoon ?? []).map(toAlertRow)}
              alertIconColor="text-amber-500"
              alertIconBgColor="bg-amber-500/10"
              alertBgColor="bg-amber-500"
              alertBorderColor="border-amber-500"
            />
            <ServiceAlertData
              icon={<Activity className="size-4 text-blue-700" />}
              title="Upcoming"
              serviceData={(alerts?.upcoming ?? []).map(toAlertRow)}
              alertIconColor="text-blue-700"
              alertIconBgColor="bg-blue-700/10"
              alertBgColor="bg-blue-700"
              alertBorderColor="border-blue-700"
            />
          </div>
        )}

        <div className="space-y-5">
          <div>
            <span className="text-neutral-950 text-base font-semibold font-text leading-6">
              Service History
            </span>
          </div>
          <div>
            <ServiceHistoryTableSection
              tableData={serviceHistoryItems}
              filterOptions={filterOptions}
              total={history?.total ?? 0}
              totalPages={history?.totalPages ?? 1}
              rowsPerPage={history?.limit ?? PAGE_SIZE}
              isLoading={isFetching}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageWrapper
      pageTitle="Maintenance"
      pageDescription="Track service history, alerts, and vehicle health across your fleet."
      pageButton={<PageButton onClick={() => handleOpenModal()} />}
    >
      {renderBody()}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <LogMaintenanceServiceForm
            onClose={handleCloseModal}
            initialVehicleId={
              logServiceParam &&
              logServiceParam !== "true" &&
              logServiceParam !== "open"
                ? logServiceParam
                : undefined
            }
          />
        </Modal>
      )}
    </PageWrapper>
  );
}

const PageButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="px-6 py-2 bg-blue-700 rounded-xs text-center text-white text-nowrap text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300 cursor-pointer"
      onClick={onClick}
    >
      Log Service
    </button>
  );
};

const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  // This overlay is a plain div rather than a Dialog, so nothing gives it
  // escape-to-close for free.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center backdrop-blur-md bg-black/50 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
