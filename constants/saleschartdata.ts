import { BookingDonutDataItem } from "@/components/hostComponents/charts/bookingDonutChart";
import { ExpensesByCategoryDataRow } from "@/components/hostComponents/charts/expensesByCategoryChart";
import { RevenueAndBookingChartDataRow } from "@/components/hostComponents/charts/revenueAndBookingChart";
import { GraphDataType, GraphDataPoint } from "@/components/hostComponents/charts/revenueChart";
// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysAgo(n: number): string {
        const d = new Date();
        d.setDate(d.getDate() - n);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function weekdayAgo(n: number): string {
        const d = new Date();
        d.setDate(d.getDate() - n);
        return d.toLocaleDateString("en-US", { weekday: "short" });
}

// ─── 7-day window (last 7 days, labelled Mon–Sun) ────────────────────────────

const sevenDayData: GraphDataPoint[] = [
        { label: weekdayAgo(6), sales: 18_200 },
        { label: weekdayAgo(5), sales: 11_800 },
        { label: weekdayAgo(4), sales: 16_100 },
        { label: weekdayAgo(3), sales: 23_450 },
        { label: weekdayAgo(2), sales: 15_900 },
        { label: weekdayAgo(1), sales: 21_300 },
        { label: weekdayAgo(0), sales: 27_750 },
];

// ─── 30-day window (sampled every ~3 days for readability) ───────────────────

const thirtyDayData: GraphDataPoint[] = [
        { label: daysAgo(29), sales: 19_800 },
        { label: daysAgo(27), sales: 22_400 },
        { label: daysAgo(25), sales: 28_100 },
        { label: daysAgo(23), sales: 36_600 },
        { label: daysAgo(21), sales: 33_200 },
        { label: daysAgo(19), sales: 24_800 },
        { label: daysAgo(17), sales: 19_400 },
        { label: daysAgo(15), sales: 14_300 },
        { label: daysAgo(13), sales: 17_100 },
        { label: daysAgo(11), sales: 18_500 },
        { label: daysAgo(9), sales: 19_200 },
        { label: daysAgo(7), sales: 22_800 },
        { label: daysAgo(5), sales: 11_800 },
        { label: daysAgo(3), sales: 23_450 },
        { label: daysAgo(1), sales: 21_300 },
        { label: daysAgo(0), sales: 27_750 },
];

// ─── 90-day window (sampled weekly) ──────────────────────────────────────────

const ninetyDayData: GraphDataPoint[] = [
        { label: daysAgo(90), sales: 12_200 },
        { label: daysAgo(83), sales: 18_900 },
        { label: daysAgo(76), sales: 28_100 },
        { label: daysAgo(69), sales: 21_300 },
        { label: daysAgo(62), sales: 17_600 },
        { label: daysAgo(55), sales: 13_800 },
        { label: daysAgo(48), sales: 9_500 },
        { label: daysAgo(41), sales: 15_200 },
        { label: daysAgo(34), sales: 19_700 },
        { label: daysAgo(27), sales: 22_400 },
        { label: daysAgo(20), sales: 30_800 },
        { label: daysAgo(13), sales: 17_100 },
        { label: daysAgo(6), sales: 18_200 },
        { label: daysAgo(0), sales: 27_750 },
];

// ─── Exported sample data ─────────────────────────────────────────────────────

export const sampleRevenueGraphData: GraphDataType = {
        "7D": sevenDayData,
        "30D": thirtyDayData,
        "90D": ninetyDayData,
        series: [{ name: "Revenue", color: "#1A56DB" }],
};

export const sampleBookingDonutData: BookingDonutDataItem[] = [
        { bookingStatus: "Active", bookingCount: 42, color: "#1A56DB" },
        { bookingStatus: "Pending", bookingCount: 18, color: "#F59E0B" },
        { bookingStatus: "Completed", bookingCount: 31, color: "#10B981" },
        { bookingStatus: "Cancelled", bookingCount: 8, color: "#EF4444" },
]

export const sampleRevenueAndBookingData: RevenueAndBookingChartDataRow[] = [
        { type: "jul", revenue: 14500, bookings: 7 },
        { type: "aug", revenue: 13750, bookings: 8 },
        { type: "sept", revenue: 16770, bookings: 6 },
        { type: "oct", revenue: 21250, bookings: 17 },
        { type: "nov", revenue: 45500, bookings: 21 },
        { type: "dec", revenue: 59933, bookings: 33 },
        { type: "jan", revenue: 37500, bookings: 18 },
        { type: "feb", revenue: 41705, bookings: 24 },
        { type: "mar", revenue: 38175, bookings: 11 },
        { type: "apr", revenue: 29733, bookings: 17 },
        { type: "may", revenue: 15500, bookings: 8 },
        { type: "jun", revenue: 21575, bookings: 12 },
]

export const sampleExpensesCategoryData: ExpensesByCategoryDataRow[] = [
        { name: "Fuel", value: 1254000 },
        { name: "Maintenance", value: 1050000 },
        { name: "Insurance", value: 821680 },
        { name: "Tolls", value: 493750 },
        { name: "Cleaning", value: 378500 },
        { name: "Registration", value: 353100 },
]