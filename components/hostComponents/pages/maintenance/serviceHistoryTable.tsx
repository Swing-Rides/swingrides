"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import {
        ColumnDef,
        DataTable,
        exportToCSV,
        TableToolbar,
        useTableRows,
} from "../../dashboard/customTable";
import { ServiceHistoryItem } from "@/types/logservice.type";
import EditMaintenanceServiceModal from "./editMaintenanceServiceModal";

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
                                {row.cost != null ? `$${row.cost}` : "—"}
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

function getFilterOptions(rows: ServiceHistoryItem[]) {
        const types = [...new Set(rows.map((r) => r.serviceType).filter(Boolean))];
        const vehicleNames = [...new Set(rows.map((r) => r.vehicleName).filter(Boolean))];
        const workshops = [...new Set(rows.map((r) => r.workshop).filter(Boolean))];

        return { types, vehicleNames, workshops };
}

export function ServiceHistoryTableSection({
        tableData,
        isLoading,
}: {
        tableData?: ServiceHistoryItem[];
        isLoading?: boolean;
}) {
        const [editingService, setEditingService] = useState<ServiceHistoryItem | null>(null);

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
                <>
                        <DataTable
                                tableId="ServiceHistory"
                                columns={serviceHistoryColumns}
                                rows={rows}
                                pagination={pagination}
                                loading={isLoading}
                                editAction={{
                                        type: "modal",
                                        onClick: (row) => setEditingService(row),
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
                                                                                        "mileageKm",
                                                                                        "cost",
                                                                                        "workshop",
                                                                                        "nextDueDate",
                                                                                        "nextDueMileageKm",
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