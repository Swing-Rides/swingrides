import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, Method } from "axios";
import apiClient from "@/lib";

type AxiosBaseQueryArgs =
	| string
	| {
			url: string;
			method?: Method;
			body?: unknown;
			data?: unknown;
			params?: Record<string, string | number | boolean | undefined>;
		};

type AxiosBaseQueryError = {
	status?: number;
	data: unknown;
};

const axiosBaseQuery = (): BaseQueryFn<
	AxiosBaseQueryArgs,
	unknown,
	AxiosBaseQueryError
> => {
	return async (args) => {
		const request =
			typeof args === "string"
				? { url: args, method: "GET" as Method }
				: {
						url: args.url,
						method: args.method ?? "GET",
						data: args.data ?? args.body,
						params: args.params,
					};

		try {
			const result = await apiClient({
				url: request.url,
				method: request.method,
				data: request.data,
				params: request.params,
			});

			return { data: result.data };
		} catch (error) {
			const axiosError = error as AxiosError;
			return {
				error: {
					status: axiosError.response?.status,
					data: axiosError.response?.data ?? axiosError.message,
				},
			};
		}
	};
};

const toQueryString = <T extends object>(filters?: T) => {
	if (!filters) return "";

	const params = new URLSearchParams();
	Object.entries(filters as Record<string, unknown>).forEach(([key, value]) => {
		if (value === undefined || value === null || value === "") return;
		params.set(key, String(value));
	});

	return params.toString();
};

export type DateRange = "3Months" | "6Months" | "1Year";

export type AnalyticsQuery = {
	dateRange?: DateRange;
	startDate?: string;
	endDate?: string;
	vehicleId?: string;
	category?: string;
	aggregationLevel?: "daily" | "weekly" | "monthly";
};

export type KPIItem = {
	label: string;
	value: string;
	trend: string;
	trendDirection: "up" | "down";
	format: "currency" | "number" | "percentage" | "decimal";
};

export type KPIResponse = {
	success: boolean;
	data: {
		totalRevenue: KPIItem;
		netProfit: KPIItem;
		totalBookings: KPIItem;
		averageRating: KPIItem;
	};
};

export type RevenueTrendItem = {
	month: string;
	revenue: number;
	bookings: number;
};

export type RevenueTrendsResponse = {
	success: boolean;
	data: {
		trends: RevenueTrendItem[];
		totalRevenue: number;
		totalBookings: number;
		averageRevenuePerMonth: number;
		averageBookingsPerMonth: number;
	};
};

export type BookingStatusItem = {
	status: "active" | "pending" | "completed" | "cancelled";
	count: number;
	percentage: number;
	color?: string;
};

export type BookingStatusResponse = {
	success: boolean;
	data: {
		statusBreakdown: BookingStatusItem[];
		totalBookings: number;
	};
};

export type ExpenseCategoryItem = {
	category: string;
	amount: number;
	percentage: number;
	color?: string;
};

export type ExpenseBreakdownResponse = {
	success: boolean;
	data: {
		categories: ExpenseCategoryItem[];
		totalExpenses: number;
		highestCategory: {
			name: string;
			amount: number;
		};
	};
};

export type VehiclePerformanceItem = {
	vehicleName: string;
	vehicleId?: string;
	trips: number;
	revenue: number;
	averageRentalDays: number;
	lastRentalDate: string;
	totalMileageDriven: string;
	utilizationRate?: number;
	revenuePerTrip?: number;
};

export type VehiclePerformanceResponse = {
	success: boolean;
	data: {
		vehicles: VehiclePerformanceItem[];
		totalVehicles: number;
		averageUtilization?: number;
		topPerformer?: VehiclePerformanceItem;
	};
};

export type AnalyticsDashboardResponse = {
	success: boolean;
	data: {
		kpis: KPIResponse["data"];
		revenueTrends: RevenueTrendItem[];
		bookingStatus: BookingStatusItem[];
		expenseBreakdown: ExpenseCategoryItem[];
		vehiclePerformance: VehiclePerformanceItem[];
	};
};

export const analyticsApi = createApi({
	reducerPath: "analyticsApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["Analytics"],
	endpoints: (builder) => ({
		getAnalyticsKPIs: builder.query<KPIResponse, AnalyticsQuery | undefined>({
			query: (filters) => {
				const query = toQueryString(filters);
				return {
					url: `/api/host/analytics/kpis${query ? `?${query}` : ""}`,
					method: "GET",
				};
			},
			providesTags: [{ type: "Analytics", id: "KPIS" }],
		}),

		getRevenueTrends: builder.query<
			RevenueTrendsResponse,
			AnalyticsQuery | undefined
		>({
			query: (filters) => {
				const query = toQueryString(filters);
				return {
					url: `/api/host/analytics/revenue-trends${query ? `?${query}` : ""}`,
					method: "GET",
				};
			},
			providesTags: [{ type: "Analytics", id: "REVENUE_TRENDS" }],
		}),

		getBookingStatus: builder.query<
			BookingStatusResponse,
			AnalyticsQuery | undefined
		>({
			query: (filters) => {
				const query = toQueryString(filters);
				return {
					url: `/api/host/analytics/booking-status${query ? `?${query}` : ""}`,
					method: "GET",
				};
			},
			providesTags: [{ type: "Analytics", id: "BOOKING_STATUS" }],
		}),

		getExpenseBreakdown: builder.query<
			ExpenseBreakdownResponse,
			AnalyticsQuery | undefined
		>({
			query: (filters) => {
				const query = toQueryString(filters);
				return {
					url: `/api/host/analytics/expense-breakdown${query ? `?${query}` : ""}`,
					method: "GET",
				};
			},
			providesTags: [{ type: "Analytics", id: "EXPENSE_BREAKDOWN" }],
		}),

		getVehiclePerformance: builder.query<
			VehiclePerformanceResponse,
			AnalyticsQuery | undefined
		>({
			query: (filters) => {
				const query = toQueryString(filters);
				return {
					url: `/api/host/analytics/vehicle-performance${query ? `?${query}` : ""}`,
					method: "GET",
				};
			},
			providesTags: [{ type: "Analytics", id: "VEHICLE_PERFORMANCE" }],
		}),

		getAnalyticsDashboard: builder.query<
			AnalyticsDashboardResponse,
			AnalyticsQuery | undefined
		>({
			query: (filters) => {
				const query = toQueryString(filters);
				return {
					url: `/api/host/analytics/dashboard${query ? `?${query}` : ""}`,
					method: "GET",
				};
			},
			providesTags: [{ type: "Analytics", id: "DASHBOARD" }],
		}),
	}),
});

export const {
	useGetAnalyticsKPIsQuery,
	useGetRevenueTrendsQuery,
	useGetBookingStatusQuery,
	useGetExpenseBreakdownQuery,
	useGetVehiclePerformanceQuery,
	useGetAnalyticsDashboardQuery,
} = analyticsApi;
