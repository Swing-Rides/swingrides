"use client";

import {
  DataTable,
  TableToolbar,
  ColumnDef,
  exportToCSV,
} from "../../dashboard/customTable";
import {
  ArrowRight,
  Download,
  EllipsisVertical,
  ImageOff,
  SquarePen,
} from "lucide-react";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import {
  FleetTableRow,
  FleetTableProps,
  VehicleDetailSheetProps,
  SheetHeaderProps,
  deriveVehicleStatus,
  deriveAvailabilityLabel,
  parsePrice,
  formatPrice,
  formatFuelType,
  normalizeVehicleStatus,
} from "./fleetTableUtils";

export type {
  FleetTableRow,
  VehicleStatus,
  VehicleInfo,
  MaintenanceInfo,
  FleetRow,
  VehicleDetailSheetProps,
  FleetTableProps,
  SheetHeaderProps,
} from "./fleetTableUtils";

const fleetColumns: ColumnDef<FleetTableRow>[] = [
  {
    key: "vehicle",
    header: "Vehicle",
    cell: (row) => (
      <div className="flex items-center gap-3">
        {row.images?.[0] ? (
          <Image
            src={row.images[0]}
            alt={row.name}
            width={60}
            height={60}
            className="size-12 aspect-square shrink-0 rounded-md object-cover border border-gray-200"
          />
        ) : (
          <div className="size-12 aspect-square shrink-0 rounded-md border border-gray-200 bg-slate-50 flex items-center justify-center text-gray-400">
            <ImageOff className="size-4" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-neutral-950 text-sm font-semibold leading-5">
            {row.name}
          </span>
          <span className="text-gray-500 font-normal">
            {row.vehicleType} • {row.colour}
          </span>
        </div>
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
      <span className="text-gray-500 font-normal capitalize">
        {row.vehicleType}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={deriveVehicleStatus(row)} />,
  },
  {
    key: "dailyPrice",
    header: "Daily Price",
    cell: (row) => (
      <span className="text-neutral-950 font-medium">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(row.dailyPrice)}
        /day
      </span>
    ),
  },
  {
    key: "monthlyEarnings",
    header: "Monthly Earnings",
    cell: (row) => (
      <span className="text-emerald-500 font-medium">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(row.monthlyPrice)}
      </span>
    ),
  },
  {
    key: "availability",
    header: "Availability",
    cell: (row) => (
      <span className="text-gray-500 font-normal">
        {deriveAvailabilityLabel(row)}
      </span>
    ),
  },
];

function VehicleDetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-neutral-900">
        {value || "—"}
      </span>
    </div>
  );
}

function PriceTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="grow p-3 bg-slate-50 rounded-[10px] flex flex-col justify-center items-center gap-1">
      <span className="text-blue-700 text-xl font-medium font-text leading-7">
        {value}
      </span>
      <span className="text-gray-500 text-xs font-normal font-text uppercase leading-4">
        {label}
      </span>
    </div>
  );
}

function VehicleGallery({ images }: { images?: string[] }) {
  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 h-40 rounded-[10px] bg-slate-50 border border-gray-200 text-gray-400">
        <ImageOff className="size-5" />
        <span className="text-sm">No photos uploaded</span>
      </div>
    );
  }
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src + i}
          src={src}
          alt={`Vehicle photo ${i + 1}`}
          className="h-40 w-56 shrink-0 rounded-[10px] object-cover border border-gray-200"
        />
      ))}
    </div>
  );
}

function VehicleDetailSheet({
  row,
  onRelistVehicle,
  // onCreateBooking,
  onEndSnoozeEarly,
  onMarkMaintenance,
}: VehicleDetailSheetProps) {
  const dailyRate = parsePrice(row.dailyPrice);
  const weeklyRate = row.weeklyPrice ?? formatPrice(dailyRate * 7 * 0.9);
  const monthlyRate = row.monthlyPrice ?? formatPrice(dailyRate * 30 * 0.75);
  const info = row.vehicleInfo;
  const maintenance = row.maintenance;

  return (
    <div className="flex flex-col gap-4">
      <VehicleGallery images={row.images} />

      <div className="flex flex-wrap gap-2 justify-start">
        <div className="grow p-3 bg-white rounded-[10px] border border-gray-200 inline-flex flex-col justify-center items-center gap-0.5">
          <StatusBadge status={row.status} />
          <span className="text-gray-500 text-xs font-normal font-text uppercase">
            Instant Booking
          </span>
        </div>
        <div className="grow p-3 bg-white rounded-[10px] border border-gray-200 inline-flex flex-col justify-center items-center gap-0.5">
          <span className="text-blue-700 text-base font-medium font-text leading-6">
            {row.dailyPrice}/day
          </span>
          <span className="text-gray-500 text-xs font-normal font-text uppercase">
            Daily Rate
          </span>
        </div>
        <div className="grow p-3 bg-white rounded-[10px] border border-gray-200 inline-flex flex-col justify-center items-center gap-0.5">
          <span className="text-gray-900 text-base font-medium font-text leading-6">
            {row.mileage || "—"}
          </span>
          <span className="text-gray-500 text-xs font-normal font-text uppercase">
            Mileage
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4 bg-white rounded-[10px] border border-gray-200">
        <h4 className="text-neutral-950 text-sm font-semibold font-text leading-5">
          Vehicle Information
        </h4>
        <Separator />
        <div>
          <VehicleDetailRow label="Make" value={info?.make} />
          <VehicleDetailRow label="Model" value={info?.model} />
          <VehicleDetailRow label="Year" value={row.year} />
          <VehicleDetailRow
            label="Color"
            value={info?.color ?? row.vehicleColor}
          />
          <VehicleDetailRow
            label="Body Type"
            value={info?.body ?? row.vehicleType}
          />
          <VehicleDetailRow label="Transmission" value={info?.transmission} />
          <VehicleDetailRow
            label="Fuel Type"
            value={formatFuelType(info?.fuelType)}
          />
          <VehicleDetailRow label="Seats" value={info?.seats} />
          <VehicleDetailRow label="License Plate" value={row.licensePlate} />
          <VehicleDetailRow label="VIN" value={info?.vin} />
          <VehicleDetailRow
            label="Fleet ID"
            value={info?.vehicleId ?? row.id}
          />
        </div>
      </div>

      <div className="space-y-4 p-4 bg-white rounded-[10px] border border-gray-200">
        <h4 className="text-neutral-950 text-sm font-semibold font-text leading-5">
          Pricing
        </h4>
        <Separator />
        <div className="flex justify-center items-stretch gap-2">
          <PriceTile label="Per day" value={row.dailyPrice} />
          <PriceTile label="Per Week" value={weeklyRate} />
          <PriceTile label="Per Month" value={monthlyRate} />
        </div>
      </div>

      <div className="bg-white rounded-[10px] border border-gray-200">
        <div className="border-b p-4">
          <h4 className="text-neutral-950 text-sm font-semibold font-text leading-5">
            Performance
          </h4>
        </div>
        <div className="p-4 space-y-3">
          <VehicleDetailRow label="Total Trips" value={row.totalTrips} />
          <VehicleDetailRow label="Total Revenue" value={row.totalRevenue} />
          <VehicleDetailRow label="Total Expenses" value={row.totalExpenses} />
          <VehicleDetailRow label="Net Earnings" value={row.netEarnings} />
        </div>
      </div>

      <div className="bg-white rounded-[10px] border border-gray-200">
        <div className="border-b p-4">
          <h4 className="text-neutral-950 text-sm font-semibold font-text leading-5">
            Maintenance
          </h4>
        </div>
        {maintenance ? (
          <div className="p-4 space-y-3">
            <div className="flex gap-4 items-start justify-between w-full">
              <span className="text-gray-500 text-xs font-normal font-text leading-5">
                Last Service
              </span>
              <div className="flex flex-col items-end">
                <span className="text-right text-neutral-950 text-sm font-semibold font-text leading-5">
                  {maintenance.lastService || "—"}
                </span>
                <span className="text-right text-gray-500 text-xs font-normal font-text leading-4">
                  {maintenance.maintenanceType}
                </span>
              </div>
            </div>
            <div className="flex gap-4 items-start justify-between w-full">
              <span className="text-gray-500 text-xs font-normal font-text leading-5">
                Next Service Due
              </span>
              <div className="flex flex-col items-end">
                <span className="text-right text-neutral-950 text-sm font-semibold font-text leading-5">
                  {maintenance.nextDue || "—"}
                </span>
                <span className="text-right text-gray-500 text-xs font-normal font-text leading-4">
                  {maintenance.remainDuration}
                </span>
              </div>
            </div>
            <div className="flex gap-4 items-start justify-between w-full">
              <span className="text-gray-500 text-xs font-normal font-text leading-5">
                Service Status
              </span>
              <Badge className="text-amber-500 bg-amber-100">
                {maintenance.status || "—"}
              </Badge>
            </div>
            <Link
              href={`${HOST_DASHBOARD_PATH}maintenance`}
              className="text-blue-700 flex justify-end items-center gap-1 hover:text-blue-900"
            >
              <span>View Full Maintenance Log</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="p-4">
            <p className="text-sm text-gray-500">
              No maintenance history on file.
            </p>
            <Link
              href={`${HOST_DASHBOARD_PATH}maintenance`}
              className="text-blue-700 flex items-center gap-1 hover:text-blue-900 mt-2"
            >
              <span>View Maintenance Log</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </div>

      <SheetFooter className="p-0 sticky bottom-0 bg-white border-t">
        {["available", "rented"].includes(row.status) && (
          <div className="flex flex-col gap-2 pt-3">
            <button
              onClick={onMarkMaintenance}
              className="py-3 px-5 text-gray-500 border text-sm font-semibold font-text leading-5 bg-transparent hover:text-white hover:bg-blue-900 transition-colors duration-300 cursor-pointer"
            >
              Put in Maintenance
            </button>
            {/* <button
              onClick={onCreateBooking}
              className="py-3 px-5 text-white border text-sm font-semibold font-text leading-5 bg-blue-700 hover:bg-blue-900 duration-300 transition-colors cursor-pointer"
            >
              Create Booking
            </button> */}
          </div>
        )}
        {row.status === "unlisted" && (
          <div className="flex flex-col gap-2 pt-3">
            <button
              onClick={onRelistVehicle}
              className="py-3 px-5 text-gray-500 border text-sm font-semibold font-text leading-5 bg-transparent hover:text-white hover:bg-blue-900 transition-colors duration-300 cursor-pointer"
            >
              Relist Vehicle
            </button>
            {/* <button
              onClick={onCreateBooking}
              className="py-3 px-5 text-white border text-sm font-semibold font-text leading-5 bg-blue-700 hover:bg-blue-900 duration-300 transition-colors cursor-pointer"
            >
              Create Booking
            </button> */}
          </div>
        )}
        {["snoozed", "maintenance"].includes(row.status) && (
          <div className="flex flex-col gap-2 pt-3">
            <button
              onClick={onEndSnoozeEarly}
              className="py-3 px-5 text-white border text-sm font-semibold font-text leading-5 bg-blue-700 hover:bg-blue-900 duration-300 transition-colors cursor-pointer"
            >
              {row.status === "maintenance"
                ? "Return to Service"
                : "End Snooze Early"}
            </button>
          </div>
        )}
      </SheetFooter>
    </div>
  );
}

export default function FleetTable({
  data,
  onDeleteVehicle,
  onUnlistVehicle,
  onRelistVehicle,
  onSnoozeVehicle,
  onEditSnoozeVehicle,
  onCreateBooking,
  onEndSnoozeEarly,
  onMarkMaintenance,
  pagination,
  rowsPerPage = 10,
  isLoading = false,
  isError = false,
}: FleetTableProps) {
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
          ? "Unable to load fleet vehicles. Please try again."
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
                { label: "Available", value: "inactive" },
                { label: "Rented", value: "active" },
                { label: "Unlisted", value: "unlisted" },
                { label: "Snoozed", value: "snoozed" },
                { label: "Maintenance", value: "maintenance" },
              ],
            },
            {
              title: "All Types",
              paramKey: "type",
              items: [
                { label: "Sedan", value: "Sedan" },
                { label: "SUV", value: "SUV" },
                { label: "Truck", value: "Truck" },
                { label: "Coupe", value: "Coupe" },
              ],
            },
          ]}
          actions={
            <button
              onClick={() =>
                exportToCSV(rows, {
                  filename: "fleet",
                  columns: [
                    "id",
                    "licensePlate",
                    "vehicleName",
                    "vehicleType",
                    "vehicleColor",
                    "year",
                    "status",
                    "dailyPrice",
                    "monthlyEarnings",
                    "availability",
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
      // Eye → opens a shadcn Sheet sliding in from the right with full vehicle details
      viewAction={{
        type: "sheet",
        title: (row) => (
          <SheetHeader
            id={row.id}
            vehicleName={row.name}
            type={row.vehicleType}
            color={row.colour}
            year={String(row.year)}
            status={deriveVehicleStatus(row)}
            onUnlistVehicle={() => onUnlistVehicle(row)}
            onRelistVehicle={() => onRelistVehicle(row)}
            onEditSnoozeVehicle={() => onEditSnoozeVehicle(row)}
            onSnoozeVehicle={() => onSnoozeVehicle(row)}
          />
        ),
        content: (row) => (
          <VehicleDetailSheet
            row={{
              availability: deriveAvailabilityLabel(row),
              dailyPrice: String(row.dailyPrice),
              id: row._id,
              images: row.images,
              licensePlate: row.licensePlate,
              mileage: String(row.mileage),
              monthlyEarnings: String(row.monthlyPrice),
              status: deriveVehicleStatus(row),
              vehicleColor: row.colour,
              vehicleInfo: {
                body: row.vehicleType,
                color: row.colour,
                make: row.make,
                model: row.vehicleModel,
                transmission: row.transmission,
                fuelType: formatFuelType(row.fuelType),
                seats: String(row.seats),
                vin: row.vin,
                vehicleId: row._id,
              },
              vehicleName: row.name,
              vehicleType: row.vehicleType,
              year: String(row.year),
              monthlyPrice: String(row.monthlyPrice),
              weeklyPrice: String(row.weeklyPrice),
              totalTrips: String(row.totalTrips ?? 0),
              netEarnings: String(row.netEarnings ?? 0),
              totalRevenue: String(row.totalRevenue ?? 0),
              totalExpenses: String(row.totalExpenses ?? 0),
              maintenance: row.maintenance,
            }}
            onRelistVehicle={() => onRelistVehicle(row)}
            onCreateBooking={() => onCreateBooking?.(row)}
            onEndSnoozeEarly={() => onEndSnoozeEarly?.(row)}
            onMarkMaintenance={() => onMarkMaintenance(row)}
          />
        ),
      }}
      // Pencil → navigates straight to the edit page, no dialog
      editAction={{
        type: "link",
        href: (row) => `${HOST_DASHBOARD_PATH}fleet/edit-vehicle/${row._id}`,
      }}
      // Trash → delete dialog; parent owns the actual deletion (API call + state update)
      deleteAction={{
        dataType: "Fleet",
        onConfirm: onDeleteVehicle,
        dialogContent: (row) => (
          <div className="flex flex-col space-y-3">
            <span>
              You are about to permanently delete{" "}
              <span className="font-semibold text-neutral-800">{row.name}</span>
              .
            </span>
            <span className="text-gray-400 text-xs">
              This will remove all associated vehicles, billing history, and
              user access. This action cannot be undone.
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
    active: "bg-sky-100 text-blue-700",
    snoozed: "bg-amber-50 text-amber-700",
    maintenance: "bg-orange-50 text-amber-500",
    unavailable: "bg-orange-50 text-amber-500",
    unlisted: "bg-gray-200 text-gray-500",
    inactive: "bg-emerald-100 text-emerald-700",
  };

  const displayLabels: Record<string, string> = {
    inactive: "Available",
    active: "Rented",
    unavailable: "Maintenance",
  };

  const label = displayLabels[status] ?? status;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] ?? styles.inactive}`}
    >
      {label}
    </span>
  );
}

const SheetHeader = ({
  vehicleName,
  type,
  color,
  year,
  id,
  status,
  onUnlistVehicle,
  onRelistVehicle,
  onEditSnoozeVehicle,
  onSnoozeVehicle,
}: SheetHeaderProps) => {
  const normalizedStatus = normalizeVehicleStatus(status);

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex-col gap-1">
        <h3 className="text-neutral-950 text-base font-bold font-text">
          {vehicleName}
        </h3>
        <div className="flex items-center justify-start gap-1">
          <span className="text-center text-gray-500 text-xs font-normal font-text">
            {type}
          </span>
          <span className="text-center text-gray-500 text-xs font-normal font-text">
            {color}
          </span>
          {year && (
            <span className="text-center text-gray-500 text-xs font-normal font-text">
              {year}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 mr-7">
        <Link href={`${HOST_DASHBOARD_PATH}fleet/edit-vehicle/${id}`}>
          <button className="flex items-center justify-start gap-2 p-3 rounded-xs cursor-pointer text-blue-700 border border-blue-700 bg-transparent hover:bg-blue-900 hover:text-white transition-colors duration-300">
            <SquarePen className="size-4" />
            <span>Edit</span>
          </button>
        </Link>

        <Popover>
          <PopoverTrigger asChild>
            <button className="px-3 py-1 rounded-xs cursor-pointer border text-blue-700 border-blue-700 bg-transparent hover:bg-blue-900 hover:text-white transition-colors duration-300">
              <EllipsisVertical className="size-8" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="p-0 space-y-0 gap-0 max-w-40 bg-white border rounded-[10px] overflow-clip divide-y"
          >
            {["available", "snoozed", "rented"].includes(normalizedStatus) && (
              <SheetClose asChild>
                <button
                  className="p-3.5 text-left text-red-500 text-sm font-semibold font-text leading-4 cursor-pointer bg-transparent hover:bg-gray-200 duration-300 transition-colors"
                  onClick={onUnlistVehicle}
                >
                  Unlist Vehicle
                </button>
              </SheetClose>
            )}
            {["unlisted", "maintenance"].includes(normalizedStatus) && (
              <SheetClose asChild>
                <button
                  className="p-3.5 text-left text-emerald-500 text-sm font-semibold font-text leading-4 cursor-pointer bg-transparent hover:bg-gray-200 duration-300 transition-colors"
                  onClick={onRelistVehicle}
                >
                  Relist Vehicle
                </button>
              </SheetClose>
            )}
            {normalizedStatus === "snoozed" && (
              <SheetClose asChild>
                <button
                  className="p-3.5 text-left text-blue-700 text-sm font-semibold font-text leading-4 cursor-pointer bg-transparent hover:bg-gray-200 duration-300 transition-colors"
                  onClick={onEditSnoozeVehicle}
                >
                  Edit Snooze
                </button>
              </SheetClose>
            )}
            {["available", "unlisted", "maintenance", "rented"].includes(
              normalizedStatus,
            ) && (
                <SheetClose asChild>
                  <button
                    className="p-3.5 text-left text-blue-700 text-sm font-semibold font-text leading-4 cursor-pointer bg-transparent hover:bg-gray-200 duration-300 transition-colors"
                    onClick={onSnoozeVehicle}
                  >
                    Snooze Vehicle
                  </button>
                </SheetClose>
              )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
