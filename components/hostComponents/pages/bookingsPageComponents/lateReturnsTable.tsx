import { ColumnDef, DataTable, exportToCSV, TableToolbar, useTableRows } from "../../dashboard/customTable";
import { Download } from "lucide-react";

type LateReturnsTableStatusType = "lateReturn" 

export interface LateReturnsTableRow {
        id: string;
        vehicle: string;
        renter: string;
        returnDate: string;
        returnStatus: LateReturnsTableStatusType;
        renterPhoneNumber: string;
}

function StatusBadge({ status }: { status: string }) {

        const styles: Record<string, string> = {
                lateReturn: "bg-red-500/10 text-red-500",
        };

        return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] ?? "bg-black text-white"}`}>
                        {status}
                </span>
        );
}

const getOverdueText = (returnDate: string) => {
        const today = new Date();
        const dueDate = new Date(returnDate);

        // Remove time portion to compare only dates
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);

        const diffInMs = today.getTime() - dueDate.getTime();
        const daysOverdue = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        return `${daysOverdue} ${daysOverdue === 1 ? "day" : "days"} overdue`;
};

const lateReturnsTableRowColumns: ColumnDef<LateReturnsTableRow>[] = [
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
                        <div className="flex flex-col gap-1.5">
                                <span className={`text-sm font-normal font-text leading-5 text-red-500`}>
                                        {row.returnDate}
                                </span>
                                <span className="text-red-500 text-xs font-semibold font-text leading-5">
                                        {getOverdueText(`${row.returnDate}`)}
                                </span>
                        </div>
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
];

type LateReturnsTableProps = {
        tableData: LateReturnsTableRow[];
}

export default function LateReturnsTable({ tableData }: LateReturnsTableProps ) {

        const data = tableData
        
        const { rows, pagination } = useTableRows({
                tableId: "lateReturnsRecords",
                data,
                rowsPerPage: 10,
                searchFields: ["vehicle", "id", "renter"],
                sortField: "returnDate",
        });

        return (
                <DataTable
                        tableId="lateReturnsRecords"
                        columns={lateReturnsTableRowColumns}
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
                                                                        filename: "LateReturnsRecords",
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
                                href: (row) => `tel:${row.renterPhoneNumber}`,
                                label: 'Call Renter',
                                mergeParams: false,
                        }}
                />
        )
}
