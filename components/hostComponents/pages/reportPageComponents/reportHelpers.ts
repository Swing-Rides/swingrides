import { DateRange } from "@/app/store/services/analyticsApi";

export const DATE_RANGE_BY_DURATION: Record<string, DateRange> = {
        "3m": "3Months",
        "6m": "6Months",
        "1y": "1Year",
};

export const STATUS_COLORS: Record<string, string> = {
        active: "#1A56DB",
        pending: "#F59E0B",
        completed: "#10B981",
        cancelled: "#EF4444",
};

export const formatNaira = (amount: number) =>
        new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
        }).format(amount);

export const toTitleCase = (value: string) =>
        value.length === 0 ? value : `${value[0].toUpperCase()}${value.slice(1)}`;