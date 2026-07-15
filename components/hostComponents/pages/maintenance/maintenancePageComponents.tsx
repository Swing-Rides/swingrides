"use client";

import { useEffect, useState } from "react";
import PageWrapper from "../../dashboard/pageWrapper";
import {
  Activity,
  Clock,
  CheckCircle,
  DollarSign,
  TriangleAlert,
  Wrench,
  XCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLazyGetVehicleMaintenanceDashboardQuery } from "@/app/store/services/hostApi";
import LogMaintenanceServiceForm from "./logMaintenanceServiceForm";
import {
  MaintenanceOverviewCard,
  HealthOverviewCard,
} from "./maintenanceOverviewCards";
import { ServiceAlertData, ServiceAlertRow } from "./serviceAlertSection";
import { ServiceHistoryTableSection } from "./serviceHistoryTable";
import { formatDaysDelta, formatDateOrFallback } from "./maintenanceutils";
import MaintenanceLoading from "./maintenanceLoading";
import MaintenanceErrorState from "./maintenanceErrorState";
import EmptyMaintenanceState from "./emptyMaintenanceState";
import { ServiceAlertItem } from "@/types/logservice.type";

export default function MaintenancePageComponents() {
  const searchParams = useSearchParams();
  const [fetchVehicleMaintainance, { data, isLoading, isError }] =
    useLazyGetVehicleMaintenanceDashboardQuery();
  const [modelOpen, setModelOpen] = useState(false);

  // Computed once on mount (client-only) instead of calling Date.now()
  // inline during render. Reading Date.now() directly in JSX means the
  // server-rendered pass and the client hydration pass can each compute a
  // different value, which React/Next.js flags as a hydration mismatch.
  // Seeding this from useState's lazy initializer keeps it stable for the
  // lifetime of the mount.
  const [now] = useState(() => new Date());

  const page = Number(searchParams.get("fleet_page") ?? 1);
  const search = searchParams.get("ServiceHistory_search") ?? "";
  const vehicleName = searchParams.get("ServiceHistory_vehicleName") ?? "";
  const serviceType = searchParams.get("ServiceHistory_serviceType") ?? "";

  const loadMaintenanceData = () => {
    fetchVehicleMaintainance({
      limit: 10,
      page: page,
      search: search,
      serviceType: serviceType,
      vehicle: vehicleName,
    });
  };

  useEffect(() => {
    loadMaintenanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, fetchVehicleMaintainance, page, search, serviceType, vehicleName]);

  const toAlertRow = (d: ServiceAlertItem): ServiceAlertRow => ({
    id: `${d.vehicleName}-${d.serviceType}`,
    dueDate: formatDateOrFallback(d.dueDate),
    lastServiceDate: formatDateOrFallback(d.lastServiceDate),
    mileage: d.currentMileageKm.toLocaleString(),
    pastDue: formatDaysDelta(d.dueDate, now),
    serviceType: d.serviceType,
    vehicleName: d.vehicleName,
    badge: d.badge,
    currentMileageKm: d.currentMileageKm,
  });

  const summary = data?.data.summary;
  const health = data?.data.vehicleHealthOverview;
  const alerts = data?.data.serviceAlerts;
  const serviceHistoryItems = data?.data.serviceHistory.items ?? [];

  const isInitialLoading = isLoading && !data;
  const hasNoMaintenanceData =
    !isInitialLoading &&
    !isError &&
    (summary?.totalServices ?? 0) === 0 &&
    serviceHistoryItems.length === 0;

  const renderBody = () => {
    if (isInitialLoading) {
      return <MaintenanceLoading />;
    }

    if (isError) {
      return <MaintenanceErrorState onRetry={loadMaintenanceData} />;
    }

    if (hasNoMaintenanceData) {
      return <EmptyMaintenanceState onLogService={() => setModelOpen(true)} />;
    }

    return (
      <div className="mt-4 md:mt-8">
        <div className="flex flex-wrap items-center gap-4">
          <MaintenanceOverviewCard
            icon={<Wrench className="size-6 text-blue-700" />}
            iconBgColor="bg-indigo-50"
            title="Total Services"
            number={
              summary?.totalServices != null ? String(summary.totalServices) : "0"
            }
          />
          <MaintenanceOverviewCard
            icon={<DollarSign className="size-6 text-red-500" />}
            iconBgColor="bg-rose-100"
            title="Total Maintenance Cost"
            number={
              summary?.totalMaintenanceCost != null
                ? `$${summary.totalMaintenanceCost}`
                : "$0"
            }
          />
          <MaintenanceOverviewCard
            icon={<Clock className="size-6 text-amber-500" />}
            iconBgColor="bg-orange-50"
            title="Vehicles Due Soon"
            number={
              summary?.vehiclesDueSoon != null ? String(summary.vehiclesDueSoon) : "0"
            }
          />
          <MaintenanceOverviewCard
            icon={<TriangleAlert className="size-6 text-red-500" />}
            iconBgColor="bg-red-100"
            title="Past-due Vehicles"
            number={
              summary?.overdueVehicles != null ? String(summary.overdueVehicles) : "0"
            }
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
              label="No service due within 30 days"
            />
            <HealthOverviewCard
              icon={<Clock className="size-6 text-amber-500" />}
              iconBgColor="bg-orange-50"
              title="Due Soon"
              number={health?.dueSoon != null ? String(health.dueSoon) : "0"}
              label="Service due within 30 days"
            />
            <HealthOverviewCard
              icon={<XCircle className="size-6 text-red-500" />}
              iconBgColor="bg-rose-100"
              title="Past-due"
              number={health?.overdue != null ? String(health.overdue) : "0"}
              label="Service past due date"
            />
          </div>
        </div>

        <div className="my-4 md:my-6 space-y-6">
          <div>
            <span className="text-neutral-950 text-base font-semibold font-text leading-6">
              Service Alerts
            </span>
          </div>
          <ServiceAlertData
            icon={<TriangleAlert className="size-4 text-red-500" />}
            title="past-due"
            serviceData={(alerts?.overdue ?? []).map(toAlertRow)}
            alertIconColor="text-red-500"
            alertIconBgColor="bg-red-500/10"
            alertBgColor="bg-red-500"
            alertBorderColor="border-red-500"
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
            title="upcoming"
            serviceData={(alerts?.upcoming ?? []).map(toAlertRow)}
            alertIconColor="text-blue-700"
            alertIconBgColor="bg-blue-700/10"
            alertBgColor="bg-blue-700"
            alertBorderColor="border-blue-700"
          />
        </div>

        <div className="space-y-5">
          <div>
            <span className="text-neutral-950 text-base font-semibold font-text leading-6">
              Service History
            </span>
          </div>
          <div>
            <ServiceHistoryTableSection
              tableData={serviceHistoryItems}
              isLoading={isLoading}
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
      pageButton={<PageButton onClick={() => setModelOpen(true)} />}
    >
      {renderBody()}
      {modelOpen && (
        <Modal onClose={() => setModelOpen(false)}>
          <LogMaintenanceServiceForm onClose={() => setModelOpen(false)} />
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
}) => (
  <div
    className="fixed inset-0 z-999 flex items-center justify-center backdrop-blur-md bg-black/50 px-4"
    onClick={onClose}
  >
    <div
      className="w-full flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);