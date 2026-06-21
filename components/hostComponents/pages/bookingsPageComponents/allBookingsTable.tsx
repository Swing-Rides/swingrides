import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import { ColumnDef, DataTable, exportToCSV, TableToolbar, useTableRows } from "../../dashboard/customTable";
import { Download } from "lucide-react";

type BookingStatusType = "active" | "reserved" | "confirmed" | "completed" | 'noShow' 

export interface BookingRecordsRow {
        id: string;
        vehicle: string;
        renter: string;
        pickupDate: string;
        returnDate: string;
        duration: string;
        amount: string;
        status: BookingStatusType;
}

function StatusBadge({ status }: { status: string }) {
        const styles: Record<string, string> = {
                active: "bg-emerald-500/10 text-emerald-500",
                reserved: "bg-gray-100 text-gray-500",
                confirmed: "bg-blue-500/10 text-blue-500",
                completed: "bg-cyan-600/10 text-cyan-600",
                noShow: "bg-red-500/10 text-red-500",
        };
        return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] ?? "bg-black text-white"}`}>
                        {status}
                </span>
        );
}

const bookingRecordsRowColumns: ColumnDef<BookingRecordsRow>[] = [
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
                key: "pickupDate",
                header: "Pickup Date",
                cell: (row) => (
                        <span className="text-gray-500 text-sm font-normal font-text leading-5">
                                {row.pickupDate}
                        </span>
                ),

        },
        {
                key: "returnDate",
                header: "Return Date",
                cell: (row) => (
                        <span className="text-gray-500 text-sm font-normal font-text leading-5">
                                {row.returnDate}
                        </span>
                ),

        },
        {
                key: "duration",
                header: "Duration",
                cell: (row) => (
                        <span className='text-gray-500 text-sm font-normal font-text leading-5'>
                                {row.duration}
                        </span>
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

type AllBookingsTableProps = {
        tableData: BookingRecordsRow[];
}

export default function AllBookingsTable({ tableData }: AllBookingsTableProps ) {
        const data = tableData

        const { rows, pagination } = useTableRows({
                tableId: "bookingsRecords",
                data,
                rowsPerPage: 10,
                searchFields: ["vehicle", "id", "renter"],
                filters: [
                        { paramKey: "status", field: "status" },
                ],
                sortField: "pickupDate",
        });

        return (
                <DataTable
                        tableId="bookingsRecords"
                        columns={bookingRecordsRowColumns}
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
                                                                { label: 'Active', value: 'active' },
                                                                { label: 'Reserved', value: 'reserved' },
                                                                { label: 'Confirmed', value: 'confirmed' },
                                                                { label: 'Completed', value: 'completed' },
                                                                { label: 'No Show', value: 'noShow' },
                                                        ],
                                                },
                                        ]}
                                        dateSort
                                        actions={
                                                <button
                                                        onClick={() =>
                                                                exportToCSV(rows, {
                                                                        filename: "BookingsRecords",
                                                                        columns: ["id", "vehicleName", "renter", "pickupDate", "returnDate", "duration", "amount", "status"],
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

                        viewAction={{
                                type: "link",
                                href: (row) => `${HOST_DASHBOARD_PATH}bookings/${row.id}`,
                        }}
                />
        )
}