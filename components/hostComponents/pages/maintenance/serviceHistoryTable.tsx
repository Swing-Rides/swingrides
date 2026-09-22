"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
        ColumnDef,
        DataTable,
        exportToCSV,
        TableToolbar,
} from "../../dashboard/customTable";
import {
        MaintenanceFilterOptions,
        ServiceHistoryItem,
} from "@/types/logservice.type";
import {
        useDeleteMaintenanceServiceMutation,
        useLazyGetVehicleMaintenanceDashboardQuery,
} from "@/app/store/services/hostApi";
import { formatCurrency } from "@/lib/pricing";
import EditMaintenanceServiceModal from "./editMaintenanceServiceModal";

/** Upper bound for the export fetch — the API caps `limit` at 100. */
const EXPORT_PAGE_SIZE = 100;

export function formatReadableDate(date: string | Date | null | undefined): string {
        if (!date) return "—";
        const d = new Date(date);
        if (isNaN(d.getTime())) return "—";
        return d.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
        });
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
                header: "Date / Next Due",
                cell: (row) => (
                        <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium text-neutral-800">
                                        {formatReadableDate(row.date)}
                                </span>
                                {row.nextDueDate ? (
                                        <span className="text-xs text-neutral-500">
                                                Next due: {formatReadableDate(row.nextDueDate)}
                                        </span>
                                ) : null}
                        </div>
                ),
        },
        {
                key: "mileageKm",
                header: "Mileage",
                cell: (row) => (
                        <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium text-neutral-800">
                                        {row.mileageKm != null ? `${row.mileageKm.toLocaleString()} km` : "—"}
                                </span>
                                {row.nextDueMileageKm ? (
                                        <span className="text-xs text-neutral-500">
                                                Next due: {row.nextDueMileageKm.toLocaleString()} km
                                        </span>
                                ) : null}
                        </div>
                ),
        },
        {
                key: "cost",
                header: "Cost",
                cell: (row) => (
                        <span className="text-sm text-neutral-800">
                                {row.cost != null ? formatCurrency(row.cost) : "—"}
                        </span>
                ),
        },
        {
                key: "workshop",
                header: "Workshop",
                cell: (row) => (
                        <span className="text-sm text-neutral-800">{row.workshop || "—"}</span>
                ),
        },
];

const CSV_COLUMNS = [
        "id",
        "vehicleName",
        "serviceType",
        "date",
        "mileageKm",
        "cost",
        "workshop",
        "nextDueDate",
        "nextDueMileageKm",
];

export function ServiceHistoryTableSection({
        tableData,
        filterOptions,
        total,
        totalPages,
        rowsPerPage,
        isLoading,
}: {
        tableData?: ServiceHistoryItem[];
        filterOptions?: MaintenanceFilterOptions;
        total: number;
        totalPages: number;
        rowsPerPage: number;
        isLoading?: boolean;
}) {
        const [editingService, setEditingService] = useState<ServiceHistoryItem | null>(
                null,
        );
        const [isExporting, setIsExporting] = useState(false);
        const searchParams = useSearchParams();

        const [deleteMaintenanceService] = useDeleteMaintenanceServiceMutation();
        const [fetchForExport] = useLazyGetVehicleMaintenanceDashboardQuery();

        // Rows arrive already searched, filtered, sorted and paginated by the API,
        // so they are rendered as-is. Running useTableRows over them here would
        // re-filter a single page and recompute the page count from its length,
        // which is why the footer used to always report one page.
        const rows = tableData ?? [];

        const types = filterOptions?.serviceTypes ?? [];
        const vehicleNames = filterOptions?.vehicleNames ?? [];
        const workshops = filterOptions?.workshops ?? [];

        const handleDelete = async (row: ServiceHistoryItem) => {
                try {
                        await deleteMaintenanceService(row.id).unwrap();
                } catch {
                        // The base query already surfaces the error toast.
                }
        };

        /**
         * The table only holds the current page, so exporting `rows` would silently
         * produce a partial file. Re-fetch the whole filtered set first.
         */
        const handleExport = async () => {
                setIsExporting(true);
                try {
                        const pageCount = Math.max(
                                1,
                                Math.ceil(total / EXPORT_PAGE_SIZE),
                        );
                        const filters = {
                                limit: EXPORT_PAGE_SIZE,
                                search: searchParams.get("ServiceHistory_search") ?? "",
                                serviceType: searchParams.get("ServiceHistory_serviceType") ?? "",
                                vehicle: searchParams.get("ServiceHistory_vehicleName") ?? "",
                                workshop: searchParams.get("ServiceHistory_workshop") ?? "",
                        };

                        const allRows: ServiceHistoryItem[] = [];
                        for (let page = 1; page <= pageCount; page++) {
                                const result = await fetchForExport({ ...filters, page }).unwrap();
                                allRows.push(...result.data.serviceHistory.items);
                        }

                        exportToCSV(allRows.length > 0 ? allRows : rows, {
                                filename: "ServiceHistory",
                                columns: CSV_COLUMNS,
                        });
                } catch {
                        toast.error("Could not export the full history. Please try again.");
                } finally {
                        setIsExporting(false);
                }
        };

        return (
                <>
                        <DataTable
                                tableId="ServiceHistory"
                                columns={serviceHistoryColumns}
                                rows={rows}
                                pagination={{ total, totalPages, rowsPerPage }}
                                loading={isLoading}
                                editAction={{
                                        type: "modal",
                                        onClick: (row) => setEditingService(row),
                                }}
                                deleteAction={{
                                        dataType: "Service Log",
                                        dialogContent: (row) => (
                                                <span>
                                                        Delete the {row.serviceType} logged for{" "}
                                                        <strong>{row.vehicleName}</strong> on{" "}
                                                        {formatReadableDate(row.date)}? This also removes the
                                                        matching expense and frees the maintenance slot held on
                                                        your booking calendar.
                                                </span>
                                        ),
                                        onConfirm: handleDelete,
                                }}
                                toolbar={
                                        <TableToolbar
                                                search={{ placeholder: "Search by vehicle or service type..." }}
                                                filters={[
                                                        ...(types.length > 0
                                                                ? [
                                                                        {
                                                                                title: "All Types",
                                                                                paramKey: "serviceType",
                                                                                items: types.map((t) => ({ label: t, value: t })),
                                                                        },
                                                                ]
                                                                : []),
                                                        ...(vehicleNames.length > 0
                                                                ? [
                                                                        {
                                                                                title: "All Vehicles",
                                                                                paramKey: "vehicleName",
                                                                                items: vehicleNames.map((v) => ({ label: v, value: v })),
                                                                        },
                                                                ]
                                                                : []),
                                                        ...(workshops.length > 0
                                                                ? [
                                                                        {
                                                                                title: "All Workshops",
                                                                                paramKey: "workshop",
                                                                                items: workshops.map((w) => ({ label: w, value: w })),
                                                                        },
                                                                ]
                                                                : []),
                                                ]}
                                                actions={
                                                        <button
                                                                onClick={handleExport}
                                                                disabled={isExporting || total === 0}
                                                                className="flex items-center gap-2 px-3 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 group duration-300 transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                                                        >
                                                                <span className="text-blue-700 text-sm font-medium font-text group-hover:text-blue-200 transition-colors">
                                                                        {isExporting ? "Exporting..." : "Export CSV"}
                                                                </span>
                                                                <Download className="size-4 text-blue-700 group-hover:text-blue-200 transition-colors" />
                                                        </button>
                                                }
                                        />
                                }
                        />

                        {editingService && (
                                <EditMaintenanceServiceModal
                                        service={editingService}
                                        onClose={() => setEditingService(null)}
                                />
                        )}
                </>
        );
}
