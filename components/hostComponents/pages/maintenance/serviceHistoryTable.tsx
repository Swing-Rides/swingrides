import { Download } from "lucide-react";
import {
        ColumnDef,
        DataTable,
        exportToCSV,
        TableToolbar,
        useTableRows,
} from "../../dashboard/customTable";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import { ServiceHistoryItem } from "@/types/logservice.type";

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