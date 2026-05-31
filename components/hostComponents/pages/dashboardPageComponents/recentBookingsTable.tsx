import Link from "next/link";
import { DataTable, useTableRows, ColumnDef } from "@/components/hostComponents/dashboard/customTable";

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

const MOCK_DATA: BookingRow[] = [
        { id: "BK-1001", vehicle: "Tesla Model 3", customer: "Alexander Pierce", status: "pending", amount: "$450.00", date: "2026-06-15" },
        { id: "BK-2001", vehicle: "Ford F-150", customer: "Sarah Jenkins", status: "cancelled", amount: "$320.00", date: "2026-05-20" },
        { id: "BK-3001", vehicle: "Porsche 911", customer: "Michael Chen", status: "pending", amount: "$1,200.00", date: "2026-06-01" },
        { id: "BK-3002", vehicle: "Tesla Model S", customer: "Michael Chen", status: "active", amount: "$900.00", date: "2026-05-11" },
        { id: "BK-5001", vehicle: "Toyota RAV4", customer: "David Smith", status: "pending", amount: "$240.00", date: "2026-05-12" },
        { id: "BK-6001", vehicle: "Honda Civic", customer: "Jordan Taylor", status: "active", amount: "$180.00", date: "2026-05-25" },
        { id: "BK-7001", vehicle: "Subaru Outback", customer: "Samantha Reed", status: "active", amount: "$310.00", date: "2026-05-11" },
        { id: "BK-9001", vehicle: "Mini Cooper", customer: "Olivia Martinez", status: "pending", amount: "$110.00", date: "2026-05-28" },
        { id: "BK-1301", vehicle: "Aston Martin DB5", customer: "James Bond", status: "completed", amount: "$5,000.00", date: "2026-05-07" },
        { id: "BK-1401", vehicle: "Audi A4", customer: "Isabella Garcia", status: "cancelled", amount: "$420.00", date: "2026-05-22" },
        { id: "BK-1501", vehicle: "BMW M4", customer: "Thomas Müller", status: "pending", amount: "$850.00", date: "2026-06-15" },
        { id: "BK-1601", vehicle: "Volvo XC90", customer: "Grace Hopper", status: "active", amount: "$360.00", date: "2026-05-11" },
        { id: "BK-1201", vehicle: "Volkswagen Golf", customer: "Sophia Lee", status: "completed", amount: "$220.00", date: "2026-05-01" }
];

export default function RecentBookingsTable() {

        const { rows, pagination } = useTableRows({
                        tableId: "recentBookings",
                        data: MOCK_DATA,
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