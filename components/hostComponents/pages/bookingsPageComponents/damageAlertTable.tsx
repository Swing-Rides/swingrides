import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import { ColumnDef, DataTable, exportToCSV, TableToolbar, useTableRows } from "../../dashboard/customTable";
import { Download } from "lucide-react";

type DamageAlertTableStatusType = "damageReported" 

export interface DamageAlertTableRow {
        id: string;
        vehicle: string;
        damageType: string;
        renter: string;
        reportedDate: string;
        status: DamageAlertTableStatusType;
}

function StatusBadge({ status }: { status: string }) {

        const styles: Record<string, string> = {
                damageReported: "bg-red-500/10 text-red-500",
        };

        return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] ?? "bg-black text-white"}`}>
                        {status}
                </span>
        );
}

const damageAlertTableRowColumns: ColumnDef<DamageAlertTableRow>[] = [
        {
                key: "id",
                header: "Booking Ref",
                cell: (row) => (
                        <span className="text-cyan-600 text-sm font-normal font-text leading-5">
                                {row.id}
                        </span>
                ),
        },
        {
                key: "vehicle",
                header: "Vehicle",
                cell: (row) => (
                        <span className="text-gray-800 text-sm font-normal font-text leading-5">
                                {row.vehicle}
                        </span>
                ),
        },
        {
                key: "damageType",
                header: "Damage Type",
                cell: (row) => (
                        <span className="text-gray-800 text-sm font-normal font-text leading-5">
                                {row.damageType}
                        </span>
                ),
        },
        {
                key: "renter",
                header: "Renter",
                cell: (row) => (
                        <span className="text-gray-800 text-sm font-normal font-text leading-5">
                                {row.renter}
                        </span>
                ),
        },
        {
                key: "reportedDate",
                header: "Reported Date",
                cell: (row) => (
                        <span className={`text-gray-500 text-sm font-medium font-text leading-5`}>
                                {row.reportedDate}
                        </span>
                ),
        },
        {
                key: "status",
                header: "status",
                cell: (row) => (
                        <StatusBadge
                                status={row.status}
                        />
                ),
        },
];

type DamageAlertTableProps = {
        tableData: DamageAlertTableRow[];
}

export default function DamageAlertTable({ tableData }: DamageAlertTableProps ) {
        
        const data = tableData
        
        const { rows, pagination } = useTableRows({
                tableId: "damageAlertRecords",
                data,
                rowsPerPage: 10,
                searchFields: ["vehicle", "id", "renter"],
                sortField: "reportedDate",
        });

        return (
                <DataTable
                        tableId="damageAlertRecords"
                        columns={damageAlertTableRowColumns}
                        rows={rows}
                        pagination={pagination}
                        emptyMessage="No booking records found."
                        toolbar={
                                <TableToolbar
                                        search={{ placeholder: "Search by vechile name, renter name, or ID..." }}
                                        dateSort
                                        actions={
                                                <button
                                                        onClick={() =>
                                                                exportToCSV(rows, {
                                                                        filename: "DamageAlertRecords",
                                                                        columns: ["id", "vehicleName", "renter", "returnDate",  "status", ],
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
                                href: (row) => `${HOST_DASHBOARD_PATH}report-an-issue/${row.id}`,
                                label: 'View Report',
                                mergeParams: false,
                        }}
                />
        )
}
