import { Download } from "lucide-react";
import {
        ColumnDef,
        DataTable,
        exportToCSV,
        TableToolbar,
        useTableRows,
} from "../../dashboard/customTable";

export interface VehiclePeformanceRow {
        id: string;
        vehicleName: string;
        trips: number;
        revenue: string;
        averageRentalDays: number;
        lastRentalDate: string;
        totalMilageDriven: string;
}

const vehiclePeformanceColumns: ColumnDef<VehiclePeformanceRow>[] = [
        {
                key: "vehicleName",
                header: "Vehicle Name",
                cell: (row) => (
                        <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
                                {row.vehicleName}
                        </span>
                ),
        },
        {
                key: "trips",
                header: "trips",
                cell: (row) => (
                        <span className="text-neutral-950 text-sm font-normal font-text leading-5">
                                {row.trips}
                        </span>
                ),
        },
        {
                key: "revenue",
                header: "revenue",
                cell: (row) => (
                        <span className="text-emerald-500 text-sm font-medium font-text leading-5">
                                {row.revenue}
                        </span>
                ),
        },
        {
                key: "averageRentalDays",
                header: "Avg Rental Days",
                cell: (row) => (
                        <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
                                {row.averageRentalDays}
                        </span>
                ),
        },
        {
                key: "lastRentalDate",
                header: "Last Rental Date",
                cell: (row) => (
                        <span className="text-neutral-950 text-sm font-normal font-text leading-5">
                                {row.lastRentalDate}
                        </span>
                ),
        },
        {
                key: "totalMilageDriven",
                header: "Total Mileage Driven",
                cell: (row) => (
                        <span className="text-neutral-950 text-sm font-normal font-text leading-5">
                                {row.totalMilageDriven}
                        </span>
                ),
        },
];

export const VehiclePeformanceTable = ({
        tableData,
}: {
        tableData: VehiclePeformanceRow[];
}) => {
        const data = tableData;

        const { rows, pagination } = useTableRows({
                tableId: "vehiclePeformance",
                data,
                rowsPerPage: 10,
                searchFields: ["vehicleName", "id"],
                sortField: "lastRentalDate",
        });

        return (
                <div className="bg-white p-3 md:p-6 rounded-[10px]">
                        <h3 className="font-semibold text-base font-text mb-3">
                                Vehicle Peformance
                        </h3>
                        <DataTable
                                tableId="vehiclePeformance"
                                columns={vehiclePeformanceColumns}
                                rows={rows}
                                pagination={pagination}
                                emptyMessage="No patment history found."
                                toolbar={
                                        <TableToolbar
                                                search={{ placeholder: "Search by vechile name or ID..." }}
                                                dateSort
                                                actions={
                                                        <button
                                                                onClick={() =>
                                                                        exportToCSV(rows, {
                                                                                filename: "VehiclePeformanceReport",
                                                                                columns: [
                                                                                        "id",
                                                                                        "vehicleName",
                                                                                        "trips",
                                                                                        "revenue",
                                                                                        "averageRentalDays",
                                                                                        "lastRentalDate",
                                                                                        "totalMilageDriven",
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
                </div>
        );
};