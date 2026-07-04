"use client";

import { Fragment, ReactNode, useEffect, useState } from "react";
import PageWrapper from "../../dashboard/pageWrapper";
import {
  Activity,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Settings2,
  TriangleAlert,
  Wrench,
  XCircle,
} from "lucide-react";
import {
  ColumnDef,
  DataTable,
  exportToCSV,
  TableToolbar,
  useTableRows,
} from "../../dashboard/customTable";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import LogMaintenanceServiceForm from "./logMaintenanceServiceForm";
import { useLazyGetVehicleMaintenanceDashboardQuery } from "@/app/store/services/hostApi";
import { useSearchParams } from "next/navigation";
import { ServiceHistoryItem } from "@/types/logservice.type";

export default function MaintenancePageComponents() {
  const searchParams = useSearchParams();
  const [fetchVehicleMaintainance, { data, isLoading, isError }] =
    useLazyGetVehicleMaintenanceDashboardQuery();
  const [modelOpen, setModelOpen] = useState(false);

  const page = Number(searchParams.get("fleet_page") ?? 1);
  const search = searchParams.get("ServiceHistory_search") ?? "";
  const vehicleName = searchParams.get("ServiceHistory_vehicleName") ?? "";
  const serviceType = searchParams.get("ServiceHistory_serviceType") ?? "";

  useEffect(() => {
    fetchVehicleMaintainance({
      limit: 10,
      page: page,
      search: search,
      serviceType: serviceType,
      vehicle: vehicleName,
    });
  }, [
    searchParams,
    fetchVehicleMaintainance,
    page,
    search,
    serviceType,
    vehicleName,
  ]);

  return (
    <PageWrapper
      pageTitle="Maintenance"
      pageDescription="Track service history, alerts, and vehicle health across your fleet."
      pageButton={<PageButton onClick={() => setModelOpen(true)} />}
    >
      <div className="mt-4 md:mt-8">
        <div className="flex flex-wrap items-center gap-4">
          <MaintenanceOverviewCard
            icon={<Wrench className="size-6 text-blue-700" />}
            iconBgColor="bg-indigo-50"
            title="Total Services"
            number={
              data?.data.summary.totalServices != null
                ? String(data.data.summary.totalServices)
                : "0"
            }
          />
          <MaintenanceOverviewCard
            icon={<DollarSign className="size-6 text-red-500" />}
            iconBgColor="bg-rose-100"
            title="Total Maintenance Cost"
            number={
              data?.data.summary.totalMaintenanceCost != null
                ? `$${data.data.summary.totalMaintenanceCost}`
                : "$0"
            }
          />
          <MaintenanceOverviewCard
            icon={<Clock className="size-6 text-amber-500" />}
            iconBgColor="bg-orange-50"
            title="Vehicles Due Soon"
            number={
              data?.data.summary.vehiclesDueSoon != null
                ? String(data.data.summary.vehiclesDueSoon)
                : "0"
            }
          />
          <MaintenanceOverviewCard
            icon={<TriangleAlert className="size-6 text-red-500" />}
            iconBgColor="bg-red-100"
            title="Past-due Vehicles"
            number={
              data?.data.summary.overdueVehicles != null
                ? String(data.data.summary.overdueVehicles)
                : "0"
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
              number={
                data?.data.vehicleHealthOverview.healthy != null
                  ? String(data.data.vehicleHealthOverview.healthy)
                  : "0"
              }
              label="No service due within 30 days"
            />
            <HealthOverviewCard
              icon={<Clock className="size-6 text-amber-500" />}
              iconBgColor="bg-orange-50"
              title="Due Soon"
              number={
                data?.data.vehicleHealthOverview.dueSoon != null
                  ? String(data.data.vehicleHealthOverview.dueSoon)
                  : "0"
              }
              label="Service due within 30 days"
            />
            <HealthOverviewCard
              icon={<XCircle className="size-6 text-red-500" />}
              iconBgColor="bg-rose-100"
              title="Past-due"
              number={
                data?.data.vehicleHealthOverview.overdue != null
                  ? String(data.data.vehicleHealthOverview.overdue)
                  : "0"
              }
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
            icon={<TriangleAlert className={`size-4 text-red-500`} />}
            title="past-due"
            serviceData={
              data?.data.serviceAlerts.overdue.map((d) => {
                return {
                  id: `${d.vehicleName}-${d.serviceType}`,
                  dueDate: new Date(d.dueDate).toLocaleDateString(),
                  lastServiceDate: d.lastServiceDate
                    ? new Date(d.lastServiceDate).toLocaleDateString()
                    : "N/A",
                  mileage: d.currentMileageKm.toLocaleString(),
                  pastDue:
                    Math.ceil(
                      Math.abs(new Date(d.dueDate).getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24),
                    ) + " days",
                  serviceType: d.serviceType,
                  vehicleName: d.vehicleName,
                };
              }) || []
            }
            alertIconColor="text-red-500"
            alertIconBgColor="bg-red-500/10"
            alertBgColor="bg-red-500"
            alertBorderColor="border-red-500"
          />
          <ServiceAlertData
            icon={<Clock className={`size-4 text-amber-500`} />}
            title="Due Soon"
            serviceData={
              data?.data.serviceAlerts.dueSoon.map((d) => {
                return {
                  id: `${d.vehicleName}-${d.serviceType}`,
                  dueDate: new Date(d.dueDate).toLocaleDateString(),
                  lastServiceDate: d.lastServiceDate
                    ? new Date(d.lastServiceDate).toLocaleDateString()
                    : "N/A",
                  mileage: d.currentMileageKm.toLocaleString(),
                  pastDue:
                    Math.ceil(
                      Math.abs(new Date(d.dueDate).getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24),
                    ) + " days",
                  serviceType: d.serviceType,
                  vehicleName: d.vehicleName,
                  badge: d.badge,
                  currentMileageKm: d.currentMileageKm,
                };
              }) || []
            }
            alertIconColor="text-amber-500"
            alertIconBgColor="bg-amber-500/10"
            alertBgColor="bg-amber-500"
            alertBorderColor="border-amber-500"
          />
          <ServiceAlertData
            icon={<Activity className={`size-4 text-blue-700`} />}
            title="upcoming"
            serviceData={
              data?.data.serviceAlerts.upcoming.map((d) => {
                return {
                  id: `${d.vehicleName}-${d.serviceType}`,
                  dueDate: new Date(d.dueDate).toLocaleDateString(),
                  lastServiceDate: d.lastServiceDate
                    ? new Date(d.lastServiceDate).toLocaleDateString()
                    : "N/A",
                  mileage: d.currentMileageKm.toLocaleString(),
                  pastDue:
                    Math.ceil(
                      Math.abs(new Date(d.dueDate).getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24),
                    ) + " days",
                  serviceType: d.serviceType,
                  vehicleName: d.vehicleName,
                };
              }) || []
            }
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
              tableData={data?.data.serviceHistory.items}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
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
      className="px-6 py-2 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300 cursor-pointer"
      onClick={onClick}
    >
      Log Service
    </button>
  );
};

type MaintenanceOverviewCardProps = {
  icon: ReactNode;
  iconBgColor?: string;
  title: string;
  number: string;
};

const MaintenanceOverviewCard = ({
  icon,
  iconBgColor,
  title,
  number,
}: MaintenanceOverviewCardProps) => {
  return (
    <div className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
      <div
        className={`size-12 rounded-[10px] flex justify-center items-center overflow-clip ${iconBgColor ? iconBgColor : "bg-indigo-50"}`}
      >
        {icon}
      </div>
      <div>
        <span className="text-gray-500 text-xs font-semibold font-text uppercase">
          {title}
        </span>
      </div>
      <div>
        <span className="text-neutral-950 text-3xl font-medium font-text">
          {number}
        </span>
      </div>
    </div>
  );
};

const HealthOverviewCard = ({
  icon,
  iconBgColor,
  title,
  number,
  label,
}: MaintenanceOverviewCardProps & { label: string }) => {
  return (
    <div className="basis-95 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-3.5">
      <div className="flex gap-3.5 items-center">
        <div
          className={`size-12 rounded-[10px] flex justify-center items-center overflow-clip ${iconBgColor ? iconBgColor : "bg-indigo-50"}`}
        >
          {icon}
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-gray-500 text-xs font-semibold font-text uppercase">
              {title}
            </span>
          </div>
          <div>
            <span className="text-neutral-950 text-3xl font-medium font-text">
              {number}
            </span>
          </div>
        </div>
      </div>
      <div>
        <span className="text-gray-500 text-xs font-medium font-text">
          {label}
        </span>
      </div>
    </div>
  );
};

type ServiceAlertDataProps = {
  icon: ReactNode;
  title: string;
  serviceData: any[];
  alertIconColor: string;
  alertIconBgColor: string;
  alertBgColor: string;
  alertBorderColor: string;
};

const ServiceAlertData = ({
  icon,
  title,
  serviceData,
  alertIconColor,
  alertIconBgColor,
  alertBgColor,
  alertBorderColor,
}: ServiceAlertDataProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <span
          className={`${alertIconColor} text-xs font-bold font-text uppercase leading-4`}
        >
          {title} ({serviceData.length})
        </span>
      </div>
      <div className="space-y-3">
        {serviceData.map((item) => (
          <Fragment key={item.id}>
            <ServiceDataList
              icon={
                <span
                  className={`flex items-center justify-center size-9 aspect-square rounded-full ${alertIconBgColor}`}
                >
                  <Settings2 className={`size-4 ${alertIconColor}`} />
                </span>
              }
              vehicleName={item.vehicleName}
              serviceType={item.serviceType}
              lastServiceDate={item.lastServiceDate}
              mileage={item.mileage}
              dueDate={item.dueDate}
              dueBgColor={alertBgColor}
              className={alertBorderColor}
              pastDue={item.pastDue}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

type ServiceDataListProps = {
  className?: string;
  icon: ReactNode;
  vehicleName: string;
  serviceType: string;
  lastServiceDate: string | Date;
  mileage: string;
  dueDate: string | Date;
  dueBgColor: string;
  pastDue: string;
};

const ServiceDataList = ({
  className,
  icon,
  vehicleName,
  serviceType,
  lastServiceDate,
  mileage,
  dueDate,
  dueBgColor,
  pastDue,
}: ServiceDataListProps) => {
  return (
    <div
      className={`flex items-center gap-4 p-4 border rounded-[10px] ${className}`}
    >
      {icon}
      <div className="w-full flex flex-wrap md:justify-between justify-start gap-4 md:items-center item-start">
        <div className="flex flex-col gap-0.5">
          <span className="text-neutral-950 text-sm font-bold font-text leading-5">
            {vehicleName}
          </span>
          <span className="text-gray-500 text-xs font-normal font-['DM_Sans'] leading-4">
            {serviceType}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-500 text-xs font-normal font-text leading-4">
            Last Service
          </span>
          <span className="text-neutral-950 text-xs font-medium font-text leading-4">
            {String(lastServiceDate)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-500 text-xs font-normal font-text leading-4">
            Current Mileage
          </span>
          <span className="text-neutral-950 text-xs font-medium font-text leading-4">
            {mileage}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-500 text-xs font-normal font-text leading-4">
            Was Due
          </span>
          <span className="text-neutral-950 text-xs font-medium font-text leading-4">
            {String(dueDate)}
          </span>
        </div>
        <div>
          <span
            className={`py-1 px-3 text-white text-xs font-medium font-text leading-4 rounded-full ${dueBgColor}`}
          >
            {pastDue} PAST-DUE
          </span>
        </div>
      </div>
    </div>
  );
};

interface ServiceHistoryRow {
  id: string;
  vehicleName: string;
  serviceType: string;
  date: string;
  mileage: string;
  cost: string;
  workshop: string;
  nextDue: string;
}

const serviceHistoryColumns: ColumnDef<ServiceHistoryItem>[] = [
  {
    key: "vehicleName",
    header: "Vehicle",
    className: "w-56",
    cell: (row) => (
      <span className="text-sm font-bold text-neutral-800">
        {row.vehicleName}
      </span>
    ),
  },
  {
    key: "serviceType",
    header: "Service Type",
    cell: (row) => (
      <span className="text-sm text-neutral-800">{row.serviceType}</span>
    ),
  },
  {
    key: "date",
    header: "Date",
    cell: (row) => (
      <span className="text-sm text-neutral-800">
        {new Date(row.date).toLocaleDateString()}
      </span>
    ),
  },
  {
    key: "mileagekm",
    header: "Mileage",
    cell: (row) => (
      <span className="text-sm text-neutral-800">{row.mileageKm}</span>
    ),
  },
  {
    key: "cost",
    header: "Cost",
    cell: (row) => <span className="text-sm text-neutral-800">{row.cost}</span>,
  },
  {
    key: "workshop",
    header: "Workshop",
    cell: (row) => (
      <span className="text-sm text-neutral-800">{row.workshop}</span>
    ),
  },
  {
    key: "nextDueDate",
    header: "Next Due",
    cell: (row) => (
      <span className="text-sm text-neutral-800">
        {new Date(row.nextDueDate).toLocaleDateString()}
      </span>
    ),
  },
];

function getFilterOptions(rows: ServiceHistoryItem[]) {
  const types = [...new Set(rows.map((r) => r.serviceType))];
  const vehicleNames = [...new Set(rows.map((r) => r.vehicleName))];
  const workshops = [...new Set(rows.map((r) => r.workshop))];

  return { types, vehicleNames, workshops };
}

export function ServiceHistoryTableSection({
  tableData,
  isLoading,
}: {
  tableData?: ServiceHistoryItem[];
  isLoading?: boolean;
}) {
  const data = tableData ?? [];

  const { types, vehicleNames, workshops } = getFilterOptions(data);

  const { rows, pagination } = useTableRows({
    tableId: "ServiceHistory",
    data,
    searchFields: ["serviceType", "vehicleName", "id"],
    filters: [
      { paramKey: "serviceType", field: "serviceType" },
      { paramKey: "vehicleName", field: "vehicleName" },
      { paramKey: "workshop", field: "workshop" },
    ],
    sortField: "date",
    rowsPerPage: 10,
  });

  return (
    <DataTable
      tableId="ServiceHistory"
      columns={serviceHistoryColumns}
      rows={rows}
      pagination={pagination}
      loading={isLoading}
      toolbar={
        <TableToolbar
          search={{ placeholder: "Search by vehicle or service type..." }}
          filters={[
            ...(types.length > 0 ? [{
              title: "All Types",
              paramKey: "serviceType",
              items: types.map((t) => ({ label: t, value: t })),
            }] : []),
            ...(vehicleNames.length > 0 ? [{
              title: "All Vehicles",
              paramKey: "vehicleName",
              items: vehicleNames.map((v) => ({ label: v, value: v })),
            }] : []),
            ...(workshops.length > 0 ? [{
              title: "All Workshops",
              paramKey: "workshop",
              items: workshops.map((w) => ({ label: w, value: w })),
            }] : []),
          ]}
          dateSort
          actions={
            <button
              onClick={() =>
                exportToCSV(rows, {
                  filename: "ServiceHistory",
                  columns: [
                    "id",
                    "vehicleName",
                    "serviceType",
                    "date",
                    "mileage",
                    "cost",
                    "workshop",
                    "nextDue",
                  ],
                })
              }
              className="flex items-center gap-2 px-3 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 group duration-300 transition-colors cursor-pointer"
            >
              <span className="text-blue-700 text-sm font-medium font-text group-hover:text-blue-200 transition-colors">
                Export CSV
              </span>
              <Download className="size-4 text-blue-700 group-hover:text-blue-200 transition-colors" />
            </button>
          }
        />
      }
      linkAction={{
        label: "View",
        href: (row) => `${HOST_DASHBOARD_PATH}maintenance/${row.id}`,
        linkIcon: <Download className="size-3" />,
      }}
    />
  );
}

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
