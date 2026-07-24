import {
        FLEET_STATUS_STYLE,
        BOOKING_STATUS_STYLE,
        BILLING_STATUS_STYLE,
} from "@/components/superAdminPages/utils/helpers";
import {
        DataTableDataType,
} from "./subscriberDetail.types";
import { FleetStatus, BookingStatus, BillingStatus } from "@/types/subscribers.type";

export default function StatusBadge({
        dataType,
        status,
}: {
        dataType: DataTableDataType;
        status: FleetStatus | BookingStatus | BillingStatus;
}) {
        const styleMap =
                dataType === "Vehicle"
                        ? FLEET_STATUS_STYLE
                        : dataType === "Booking"
                                ? BOOKING_STATUS_STYLE
                                : BILLING_STATUS_STYLE;

        const normalizedStatus = status.toLowerCase();

        const { label, textColor, bgColor } = (
                styleMap as Record<
                        string,
                        { label: string; textColor: string; bgColor: string }
                >
        )[normalizedStatus];

        return (
                <span
                        className="rounded-full px-2.5 py-1 text-xs font-medium font-text border"
                        style={{
                                color: textColor,
                                backgroundColor: bgColor,
                                borderColor: bgColor === "#FFFFFF" ? "#E5E7EB" : bgColor,
                        }}
                >
                        {label}
                </span>
        );
}