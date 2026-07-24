import { ReactNode } from "react";
import {
        AdminSubscriberByIdDataFleet,
        FleetStatus,
        BookingStatus,
        BillingStatus,
        BookingRow,
        BillingRow,
        SubscriberStatus,
} from "@/types/subscribers.type";

// ─── Page ───────────────────────────────────────────────────────────────────

export type SlugType = { slug: string };

export type SubscriberDetailPageProps = {
        organisation: { name: string };
        status: SubscriberStatus;
        vehicles: number;
        activeBookings: number;
        monthlyRevenue: number;
        totalEarning: number;
        revenue: { month: string; totalRevenue: number }[];
        fleet: AdminSubscriberByIdDataFleet[];
        booking: BookingRow[];
        billingHistory: BillingRow[];
        canSuspend: boolean;
        canUpgradePlan: boolean;
        ownerName: string;
        ownerEmail: string;
        plan: string;
        joinedDate: string;
        activityLog: {
                time: string;
                eventType: string;
                details: string;
                action: string;
        }[];
};

// ─── Page intro / overview card ────────────────────────────────────────────

export type PageIntroProps = {
        pageTitle: string;
        pageDesc: string;
        dataType: "subscribers" | "booking" | "fleet" | "billing";
        status: SubscriberStatus | BookingStatus | FleetStatus | BillingStatus;
};

export type OverviewCardProps = {
        icon: ReactNode;
        title: string;
        number: number | string;
};

// ─── Data table ─────────────────────────────────────────────────────────────

export type DataTableDataType = "Vehicle" | "Booking" | "Billing History";

// Discriminated union keeps DataTable fully type-safe per data type
export type DataTableVariant =
        | {
                dataType: "Vehicle";
                rows: AdminSubscriberByIdDataFleet[];
                setRows: React.Dispatch<
                        React.SetStateAction<AdminSubscriberByIdDataFleet[]>
                >;
        }
        | {
                dataType: "Booking";
                rows: BookingRow[];
                setRows: React.Dispatch<React.SetStateAction<BookingRow[]>>;
        }
        | {
                dataType: "Billing History";
                rows: BillingRow[];
                setRows: React.Dispatch<React.SetStateAction<BillingRow[]>>;
        };

export type DisplayRow = {
        id: string;
        name: string;
        status: FleetStatus | BookingStatus | BillingStatus;
        cost: number;
        date: string;
};

export type DeleteDialogUIProps = {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        name: string | undefined;
        dataType: DataTableDataType;
        onConfirm: () => void;
};

export type ColumnConfig = {
        nameTitle: string;
        idTitle: string;
        statusTitle: string;
        costTitle: string;
        dateTitle: string;
        emptyMsg: string;
};

// ─── Header actions menu / popups ──────────────────────────────────────────

export type HeaderActionId = "suspend" | "upgrade" | "verify";

export type HeaderActionItem = {
        id: HeaderActionId;
        label: string;
        icon: ReactNode;
        danger?: boolean;
};

export type PopupWrapperProps = {
        open: boolean;
        title: string;
        onClose: () => void;
        onConfirm: () => void;
        onCancel?: () => void;
        confirmLabel?: string;
        cancelLabel?: string;
        confirmDisabled?: boolean;
        confirmVariant?: "primary" | "danger";
        children: ReactNode;
};

export type ActionPopupProps = {
        open: boolean;
        onClose: () => void;
        onConfirm: () => void;
        organisationName: string;
};