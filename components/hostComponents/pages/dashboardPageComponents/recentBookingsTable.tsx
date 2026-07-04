import Link from "next/link";
import { DataTable, useTableRows, ColumnDef } from "@/components/hostComponents/dashboard/customTable";
import { RecentBooking } from "@/app/store/services/dashboardApi";

interface BookingRow {
        id: string;
        vehicle: string;
        customer: string;
        status: string;
        amount: string;
        date: string;
}

const bookingColumns: ColumnDef<BookingRow>[] = [
        { 
                key: "id", 
                header: "Booking ID",
                cell: (row) => (
                        <span className="text-cyan-600 font-normal">
                                {row.id}
                        </span>
                ),
        },
        { 
                key: "vehicle", 
                header: "Vehicle",
                cell: (row) => (
                        <span className="text-neutral-950 font-medium">
                                {row.vehicle}
                        </span>
                ),
        },
        { 
                key: "customer", 
                header: "Customer",
                cell: (row) => (
                        <span className="text-gray-500 font-normal">
                                {row.customer}
                        </span>
                ),
        },
        {
                key: "status",
                header: "Status",
                cell: (row) => <StatusBadge status={row.status} />,
        },
        { 
                key: "amount", 
                header: "Amount",
                cell: (row) => (
                        <span className="text-neutral-950 font-medium">
                                {row.amount}
                        </span>
                ), 
        },
        { 
                key: "date", 
                header: "Date",
                cell: (row) => (
                        <span className="text-gray-500 font-normal">
                                {new Date(row.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                ),
        },
];

export default function RecentBookingsTable({
        bookings,
        isLoading,
}: {
        bookings: RecentBooking[];
        isLoading?: boolean;
}) {
        const data: BookingRow[] = bookings.map((b) => ({
                id: b.bookingId,
                vehicle: b.vehicle,
                customer: b.customer,
                status: b.status,
                amount: b.amountFormatted,
                date: b.date,
        }));

        const { rows, pagination } = useTableRows({
                tableId: "recentBookings",
                data,
                rowsPerPage: 10,
        });
        
        return (
                <>
                        <div className="flex flex-wrap gap-3 items-center justify-between">
                                <h3 className="text-neutral-950 text-base font-semibold font-text">
                                        Recent Bookings
                                </h3>
                                <Link 
                                        href={'/us/host/bookings'}
                                        className="text-blue-700 text-xs font-medium font-text leading-4 hover:text-blue-950 duration-300 transition-colors"
                                >
                                        View all
                                </Link>
                        </div>
                        <DataTable
                                tableId="recentBookings"
                                columns={bookingColumns}
                                rows={rows}
                                pagination={pagination}
                        />
                </>
        )
}

function StatusBadge({ status }: { status: string }) {
        const styles: Record<string, string> = {
                pending: "bg-orange-50 text-amber-500",
                active: "bg-sky-100 text-blue-500",
                completed: "bg-green-100 text-emerald-500",
                cancelled: "bg-red-100 text-red-500",
                inactive: "bg-gray-100 text-gray-500",
        };
        return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${styles[status] ?? styles.inactive}`}>
                        {status}
                </span>
        );
}