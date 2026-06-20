"use client";

import { useState } from "react";
import {
  DataTable,
  TableToolbar,
  ColumnDef,
  exportToCSV,
} from "../../dashboard/customTable";
import { Download } from "lucide-react";
import {
  IListVehiclesDatum,
  IListVehiclesResponse,
} from "@/types/vehicle.type";
import {
  useDeleteVehicleMutation,
  useUpdateVehicleMutation,
} from "@/app/store/services/hostApi";

type FleetTableRow = IListVehiclesDatum & { id: string };
type VehicleUpdateDraft = {
  name: string;
  vehicleType: string;
  dailyPrice: string;
  monthlyPrice: string;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

const toTitleCase = (value: string) =>
  value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const getStatusLabel = (row: FleetTableRow) => {
  if (row.status === "active" && row.instantlyAvailable) return "available";
  if (row.status === "unavailable") return "in service";
  return row.status;
};

const getAvailabilityLabel = (row: FleetTableRow) => {
  if (row.status === "unavailable") return "In service";
  if (row.status === "snoozed") return "Snoozed";
  if (row.status === "unlisted") return "Unlisted";
  return row.instantlyAvailable ? "Instantly available" : "Scheduled";
};

const vehicleTypeOptions = [
  { label: "Sedan", value: "sedan" },
  { label: "SUV", value: "suv" },
  { label: "Truck", value: "truck" },
  { label: "Van", value: "van" },
  { label: "Motorcycle", value: "motorcycle" },
  { label: "Convertible", value: "convertible" },
  { label: "Coupe", value: "coupe" },
  { label: "Hatchback", value: "hatchback" },
  { label: "Other", value: "other" },
];

const fleetColumns: ColumnDef<FleetTableRow>[] = [
  {
    key: "vehicle",
    header: "Vehicle",
    cell: (row) => (
      <div className="flex flex-col">
        <span className="text-neutral-950 text-sm font-semibold leading-5">
          {row.name}
        </span>
        <span className="text-gray-500 font-normal">
          {row.year} {row.make} {row.vehicleModel}
        </span>
      </div>
    ),
  },
  {
    key: "licensePlate",
    header: "License Plate",
    cell: (row) => (
      <span className="text-cyan-600 font-medium">{row.licensePlate}</span>
    ),
  },
  {
    key: "Type",
    header: "Type",
    cell: (row) => (
      <span className="text-gray-500 font-normal">
        {toTitleCase(row.vehicleType)}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={getStatusLabel(row)} />,
  },
  {
    key: "dailyPrice",
    header: "Daily Price",
    cell: (row) => (
      <span className="text-neutral-950 font-medium">
        {formatCurrency(row.dailyPrice)}/day
      </span>
    ),
  },
  {
    key: "monthlyPrice",
    header: "Monthly Price",
    cell: (row) => (
      <span className="text-emerald-500 font-medium">
        {formatCurrency(row.monthlyPrice)}/month
      </span>
    ),
  },
  {
    key: "availability",
    header: "Availability",
    cell: (row) => (
      <span className="text-gray-500 font-normal">
        {getAvailabilityLabel(row)}
      </span>
    ),
  },
];

export default function FleetTable({
  data,
  pagination,
  rowsPerPage = 10,
  isLoading = false,
  isError = false,
}: {
  data?: IListVehiclesResponse["data"];
  pagination?: IListVehiclesResponse["pagination"];
  rowsPerPage?: number;
  isLoading?: boolean;
  isError?: boolean;
}) {
  const [deleteVehicle] = useDeleteVehicleMutation();
  const [updateVehicle] = useUpdateVehicleMutation();
  const [editDrafts, setEditDrafts] = useState<Record<string, VehicleUpdateDraft>>({});
  const rows: FleetTableRow[] = (data ?? []).map((vehicle) => ({
    ...vehicle,
    id: vehicle._id,
  }));

  return (
    <DataTable
      tableId="fleet"
      columns={fleetColumns}
      rows={rows}
      pagination={{
        rowsPerPage: rowsPerPage,
        total: pagination?.totalItems || 0,
        totalPages: pagination?.totalPages || 0,
      }}
      loading={isLoading}
      emptyMessage={
        isError
          ? "Unable to load fleet vehicles."
          : "No vehicles match your filters."
      }
      toolbar={
        <TableToolbar
          search={{ placeholder: "Search vehicle name or plate number..." }}
          filters={[
            {
              title: "All Status",
              paramKey: "status",
              items: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Unlisted", value: "unlisted" },
                { label: "Snoozed", value: "snoozed" },
                { label: "In Service", value: "unavailable" },
              ],
            },
            {
              title: "All Types",
              paramKey: "vehicleType",
              items: vehicleTypeOptions,
            },
          ]}
          actions={
            <button
              onClick={() =>
                exportToCSV(rows, {
                  filename: "fleet",
                  columns: [
                    "name",
                    "make",
                    "vehicleModel",
                    "year",
                    "vehicleType",
                    "licensePlate",
                    "dailyPrice",
                    "monthlyPrice",
                    "status",
                    "city",
                  ],
                })
              }
              className="flex items-center gap-2 px-5 py-2 rounded-xs bg-transparent border border-blue-700 hover:bg-blue-700 group duration-300 transition-colors cursor-pointer"
            >
              <span className="text-blue-700 text-sm font-medium font-text group-hover:text-white transition-colors">
                Export CSV
              </span>
              <Download className="size-4 text-blue-700 group-hover:text-white transition-colors" />
            </button>
          }
        />
      }
      editAction={{
        confirmLabel: "Save changes",
        onConfirm: async (row) => {
          const draft = editDrafts[row.id];

          await updateVehicle({
            vehicleId: row.id,
            data: {
              name: draft?.name ?? row.name,
              vehicleType: draft?.vehicleType ?? row.vehicleType,
              dailyPrice: Number(draft?.dailyPrice ?? row.dailyPrice),
              monthlyPrice: Number(draft?.monthlyPrice ?? row.monthlyPrice),
            },
          });

          setEditDrafts((current) => {
            const next = { ...current };
            delete next[row.id];
            return next;
          });
        },
        dialogContent: (row: FleetTableRow) => (
          <EditVehicleForm
            row={row}
            draft={editDrafts[row.id]}
            onChange={(draft) =>
              setEditDrafts((current) => ({ ...current, [row.id]: draft }))
            }
          />
        ),
      }}
      deleteAction={{
        dataType: "Vehicle",
        onConfirm: async (row) => {
          await deleteVehicle(row.id);
        },
        dialogContent: (row) => (
          <div className="flex flex-col space-y-3">
            <span>
              You are about to permanently delete{" "}
              <span className="font-semibold text-neutral-800">{row.name}</span>
              .
            </span>
            <span className="text-gray-400 text-xs">
              This will remove the vehicle from your fleet. This action cannot
              be undone.
            </span>
          </div>
        ),
      }}
    />
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    available: "bg-green-100 text-emerald-500",
    active: "bg-green-100 text-emerald-500",
    "in service": "bg-orange-50 text-amber-500",
    unavailable: "bg-orange-50 text-amber-500",
    unlisted: "bg-gray-200 text-gray-500",
    snoozed: "bg-amber-50 text-amber-700",
    inactive: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] ?? styles.inactive}`}
    >
      {status}
    </span>
  );
}

function EditVehicleForm({
  row,
  draft,
  onChange,
}: {
  row: FleetTableRow;
  draft?: VehicleUpdateDraft;
  onChange: (draft: VehicleUpdateDraft) => void;
}) {
  const values = draft ?? {
    name: row.name,
    vehicleType: row.vehicleType,
    dailyPrice: String(row.dailyPrice),
    monthlyPrice: String(row.monthlyPrice),
  };

  const updateField = (field: keyof VehicleUpdateDraft, value: string) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm">
        Update the details for{" "}
        <span className="font-semibold text-neutral-800">{row.name}</span>.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Vehicle name
          </label>
          <input
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Vehicle type
          </label>
          <select
            value={values.vehicleType}
            onChange={(event) => updateField("vehicleType", event.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {vehicleTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Daily price
          </label>
          <input
            type="number"
            min="0"
            value={values.dailyPrice}
            onChange={(event) => updateField("dailyPrice", event.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Monthly price
          </label>
          <input
            type="number"
            min="0"
            value={values.monthlyPrice}
            onChange={(event) =>
              updateField("monthlyPrice", event.target.value)
            }
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </div>
  );
}
