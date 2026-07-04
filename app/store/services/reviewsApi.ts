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

export type ReviewSortOption = "mostReviewed" | "highestRated" | "latest";

export type ReviewFilters = {
	search?: string;
	stars?: number;
	sortBy?: ReviewSortOption;
	page?: number;
	limit?: number;
};

export type ReviewSummary = {
	averageRating: number;
	totalReviews: number;
	totalVehiclesReviewed: number;
};

export type VehicleReviewItem = {
	vehicleName: string;
	vehicleId?: string;
	totalReviews: number;
	averageRating: number;
	lastReviewed: string;
	reviewCountByStars?: {
		1: number;
		2: number;
		3: number;
		4: number;
		5: number;
	};
	thumbnailUrl?: string;
};

export type ReviewEntry = {
	id: string;
	vehicleName: string;
	customerName: string;
	rating: number;
	title?: string;
	comment: string;
	reviewedAt: string;
	status: "published" | "hidden" | "flagged";
	vehicleId?: string;
	bookingRef?: string;
};

export type VehicleReviewHistoryItem = ReviewEntry & {
	reviewedAtLabel: string;
};

type PaginatedResult<T> = {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};

export type ReviewFiltersResponse = {
	vehicles: string[];
	starOptions: number[];
	sortOptions: ReviewSortOption[];
};

export type ReviewDashboardResponse = {
	success: boolean;
	data: {
		summary: ReviewSummary;
		vehicles: VehicleReviewItem[];
		reviews: PaginatedResult<ReviewEntry>;
	};
};

export type VehicleReviewDetailResponse = {
	success: boolean;
	data: {
		vehicle: VehicleReviewItem;
		history: PaginatedResult<VehicleReviewHistoryItem>;
	};
};

export type CreateReviewRequest = {
	vehicleName: string;
	customerName: string;
	rating: number;
	comment: string;
	title?: string;
	vehicleId?: string;
	bookingRef?: string;
};

type ApiEnvelope<T> = {
	success: boolean;
	data: T;
};

type MutationEnvelope<T> = {
	success: boolean;
	message: string;
	data: T;
};

export const reviewsApi = createApi({
	reducerPath: "reviewsApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["Reviews"],
	endpoints: (builder) => ({
		getReviewSummary: builder.query<ApiEnvelope<ReviewSummary>, void>({
			query: () => ({
				url: "/api/host/reviews/summary",
				method: "GET",
			}),
			providesTags: [{ type: "Reviews", id: "SUMMARY" }],
		}),

		getReviewFilters: builder.query<ApiEnvelope<ReviewFiltersResponse>, void>({
			query: () => ({
				url: "/api/host/reviews/filters",
				method: "GET",
			}),
			providesTags: [{ type: "Reviews", id: "FILTERS" }],
		}),

		getReviewVehicles: builder.query<
			ApiEnvelope<PaginatedResult<VehicleReviewItem>>,
			ReviewFilters | undefined
		>({
			query: (filters) => {
				const query = toQueryString(filters);
				return {
					url: `/api/host/reviews/vehicles${query ? `?${query}` : ""}`,
					method: "GET",
				};
			},
			providesTags: [{ type: "Reviews", id: "VEHICLES" }],
		}),

		getVehicleReviewDetails: builder.query<
			VehicleReviewDetailResponse,
			{ vehicleId: string; filters?: ReviewFilters }
		>({
			query: ({ vehicleId, filters }) => {
				const query = toQueryString(filters);
				return {
					url: `/api/host/reviews/vehicles/${vehicleId}${query ? `?${query}` : ""}`,
					method: "GET",
				};
			},
			providesTags: (_result, _error, { vehicleId }) => [
				{ type: "Reviews", id: `VEHICLE_${vehicleId}` },
			],
		}),

		getReviews: builder.query<
			ApiEnvelope<PaginatedResult<ReviewEntry>>,
			ReviewFilters | undefined
		>({
			query: (filters) => {
				const query = toQueryString(filters);
				return {
					url: `/api/host/reviews${query ? `?${query}` : ""}`,
					method: "GET",
				};
			},
			providesTags: [{ type: "Reviews", id: "LIST" }],
		}),

		getReviewsDashboard: builder.query<
			ReviewDashboardResponse,
			ReviewFilters | undefined
		>({
			query: (filters) => {
				const query = toQueryString(filters);
				return {
					url: `/api/host/reviews/dashboard${query ? `?${query}` : ""}`,
					method: "GET",
				};
			},
			providesTags: [
				{ type: "Reviews", id: "SUMMARY" },
				{ type: "Reviews", id: "VEHICLES" },
				{ type: "Reviews", id: "LIST" },
			],
		}),

		createReview: builder.mutation<
			MutationEnvelope<ReviewEntry>,
			CreateReviewRequest
		>({
			query: (payload) => ({
				url: "/api/host/reviews",
				method: "POST",
				body: payload,
			}),
			invalidatesTags: [
				{ type: "Reviews", id: "SUMMARY" },
				{ type: "Reviews", id: "VEHICLES" },
				{ type: "Reviews", id: "LIST" },
			],
		}),
	}),
});

export const {
	useGetReviewSummaryQuery,
	useGetReviewFiltersQuery,
	useGetReviewVehiclesQuery,
	useGetVehicleReviewDetailsQuery,
	useGetReviewsQuery,
	useGetReviewsDashboardQuery,
	useCreateReviewMutation,
} = reviewsApi;
