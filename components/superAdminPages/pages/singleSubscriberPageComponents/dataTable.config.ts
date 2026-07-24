import {
        DataTableDataType,
        DataTableVariant,
        DisplayRow,
        ColumnConfig,
} from "./subscriberDetail.types";

export const ROWS_PER_PAGE = 10;

export const COLUMN_CONFIG: Record<DataTableDataType, ColumnConfig> = {
        Vehicle: {
                nameTitle: "Vehicle Name",
                idTitle: "Fleet ID",
                statusTitle: "Status",
                costTitle: "Daily Rate",
                dateTitle: "Last Booking",
                emptyMsg: "This subscriber has no vehicles listed.",
        },
        Booking: {
                nameTitle: "Package Name",
                idTitle: "Booking ID",
                statusTitle: "Status",
                costTitle: "Total Cost",
                dateTitle: "Booking Date",
                emptyMsg: "This subscriber has no bookings yet.",
        },
        "Billing History": {
                nameTitle: "Description",
                idTitle: "Billing ID",
                statusTitle: "Status",
                costTitle: "Cost",
                dateTitle: "Payment Date",
                emptyMsg: "No billing history found.",
        },
};

// Each data type produces a normalised display row so the table JSX stays generic
export function normalise(variant: DataTableVariant): DisplayRow[] {
        // Defensive guard — rows can arrive as undefined if the parent
        // hasn't passed the prop or the data hasn't loaded yet
        if (!variant.rows) return [];

        if (variant.dataType === "Vehicle") {
                return variant.rows.map((r) => ({
                        id: r.id,
                        name: r.vehicleName,
                        status: r.status,
                        cost: r.dailyRate,
                        date: r.lastBooking,
                }));
        }
        if (variant.dataType === "Booking") {
                return variant.rows.map((r) => ({
                        id: r.id,
                        name: r.vehicleName,
                        status: r.status,
                        cost: Number(r.totalCost), // arrives as string in data
                        date: r.bookingDate,
                }));
        }
        // Billing History
        return variant.rows.map((r) => ({
                id: r.id,
                name: r.package,
                status: r.status,
                cost: Number(r.totalCost), // arrives as string in data
                date: r.date,
        }));
}