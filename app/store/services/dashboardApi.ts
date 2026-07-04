import { createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, Method } from "axios";
import apiClient from "@/lib";

const axiosBaseQuery = () => {
	return async (args: string | { url: string; method?: Method; params?: Record<string, string | undefined> }) => {
		const request =
			typeof args === "string"
				? { url: args, method: "GET" as Method }
				: { url: args.url, method: args.method ?? "GET", params: (args as any).params };
		try {
			const result = await apiClient({ url: request.url, method: request.method, params: request.params });
			return { data: result.data };
		} catch (error) {
			const axiosError = error as AxiosError;
			return { error: { status: axiosError.response?.status, data: axiosError.response?.data ?? axiosError.message } };
		}
	};
};

export type DashboardDuration = "7d" | "30d" | "90d";

export type DashboardSummary = {
	totalVehicles: number;
	activeRentals: number;
	pendingBookings: number;
	monthlyRevenue: number;
	monthlyRevenueFormatted: string;
	utilizationRate: number;
	revenueGrowthPercent: number;
};

export type RevenuePoint = { label: string; revenue: number };

export type BookingStatusSummary = {
	active: number;
	pending: number;
	completed: number;
	cancelled: number;
	total: number;
};

export type FleetStatusSummary = {
	available: number;
	rented: number;
	maintenance: number;
	inactive: number;
	totalFleet: number;
};

export type RecentBooking = {
	bookingId: string;
	vehicle: string;
	customer: string;
	status: "active" | "pending" | "completed" | "cancelled";
	amount: number;
	amountFormatted: string;
	date: string;
};

export type HostDashboardResponse = {
	success: true;
	data: {
		duration: DashboardDuration;
		summary: DashboardSummary;
		revenueOverview: {
			totalRevenue: number;
			totalRevenueFormatted: string;
			points: RevenuePoint[];
		};
		bookingStatus: BookingStatusSummary;
		fleetStatus: FleetStatusSummary;
		recentBookings: RecentBooking[];
	};
};

export const dashboardApi = createApi({
	reducerPath: "dashboardApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["Dashboard"],
	endpoints: (builder) => ({
		getHostDashboard: builder.query<HostDashboardResponse, DashboardDuration | undefined>({
			query: (duration) => ({
				url: "/api/host/dashboard",
				method: "GET",
				params: duration ? { duration } : undefined,
			}),
			providesTags: [{ type: "Dashboard", id: "HOST" }],
		}),
	}),
});

export const { useGetHostDashboardQuery } = dashboardApi;
