import { ColumnDef, DataTable, exportToCSV, TableToolbar, useTableRows } from "../../dashboard/customTable";
import { Download } from "lucide-react";

type UpcomingBookingStatusType = "dueToday" | "dueTomorrow" | "overdue" | "notSoon"

export interface UpcomingBookingRecordsRow {
        id: string;
        vehicle: string;
        renter: string;
        returnDate: string;
        returnStatus: UpcomingBookingStatusType;
        amount: string;
}

function StatusBadge({ status }: { status: string }) {
        const styles: Record<string, string> = {
                notSoon: "bg-emerald-500/10 text-emerald-500",
                dueToday: "bg-amber-100 text-amber-500",
                dueTomorrow: "bg-blue-500/10 text-blue-500",
                overdue: "bg-red-500/10 text-red-500",
        };
        return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] ?? "bg-black text-white"}`}>
                        {status}
                </span>
        );
}

const upcomingBookingsRecordsRowColumns: ColumnDef<UpcomingBookingRecordsRow>[] = [
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
                key: "renter",
                header: "Renter",
                cell: (row) => (
                        <span className="text-gray-800 text-sm font-normal font-text leading-5">
                                {row.renter}
                        </span>
                ),
        },
        {
                key: "returnDate",
                header: "Return Date",
                cell: (row) => (
                        <span className={`text-sm font-normal font-text leading-5 ${row.returnStatus === 'overdue' ? 'text-red-500' : 'text-gray-500'}`}>
                                {row.returnDate}
                        </span>
                ),
        },
        {
                key: "returnStatus",
                header: "ReturnStatus",
                cell: (row) => (
                        <StatusBadge
                                status={row.returnStatus}
                        />
                ),
        },
        {
                key: "amount",
                header: "amount",
                cell: (row) => (
                        <span className='text-gray-800 text-sm font-medium font-text leading-5'>
                                {row.amount}
                        </span>
                ),
        },
];

type UpcomingBookingsRecordsTableProps = {
        tableData: UpcomingBookingRecordsRow[];
}

export default function UpcomingBookingsRecordsTable({ tableData }: UpcomingBookingsRecordsTableProps) {
        
        const data = tableData
        
        const { rows, pagination } = useTableRows({
                tableId: "upcomingBookingsRecords",
                data,
                rowsPerPage: 10,
                searchFields: ["vehicle", "id", "renter"],
                filters: [
                        { paramKey: "status", field: "returnStatus" },
                ],
                sortField: "returnDate",
        });

        return (
                <DataTable
                        tableId="upcomingBookingsRecords"
                        columns={upcomingBookingsRecordsRowColumns}
                        rows={rows}
                        pagination={pagination}
                        emptyMessage="No booking records found."
                        toolbar={
                                <TableToolbar
                                        search={{ placeholder: "Search by vechile name, renter name, or ID..." }}
                                        filters={[
                                                {
                                                        title: "All Status",
                                                        paramKey: "status",
                                                        items: [
                                                                { label: 'Due Today', value: "dueToday" },
                                                                { label: 'Due Tomorrow', value: "dueTomorrow" },
                                                                { label: 'Overdue', value: "overdue" },
                                                                { label: 'Not Soon', value: "notSoon" },
                                                        ],
                                                },
                                        ]}
                                        dateSort
                                        actions={
                                                <button
                                                        onClick={() =>
                                                                exportToCSV(rows, {
                                                                        filename: "UpcomingBookingsRecords",
                                                                        columns: ["id", "vehicleName", "renter", "returnDate",  "status", "amount",],
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
        )
}
