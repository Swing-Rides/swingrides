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

export type FinanceSummary = {
	totalRevenue: number;
	totalExpenses: number;
	netProfit: number;
	pendingInvoices: number;
};

export type FinanceFilters = {
	search?: string;
	vehicle?: string;
	category?: string;
	month?: string;
	page?: number;
	limit?: number;
};

export type FinanceFilterOptions = {
	vehicles: string[];
	categories: string[];
	months: string[];
};

export type SpendingCategoryItem = {
	category: string;
	amount: number;
};

export type PaginatedResult<T> = {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};

export type ExpenseItem = {
	id: string;
	date: string;
	vehicle: string;
	category: string;
	description: string;
	amount: number;
	receiptUrl?: string;
	status: "logged";
};

export type InvoiceItem = {
	id: string;
	invoiceNumber: string;
	customer: string;
	vehicle: string;
	period: string;
	days: number;
	amount: number;
	status: "paid" | "pending";
	pdfUrl?: string;
};

export type TollRecordItem = {
	id: string;
	dateTime: string;
	vehicle: string;
	route: string;
	tollLocation: string;
	charge: number;
	linkedRental: string;
};

type ApiEnvelope<T> = {
	success: boolean;
	data: T;
};

export type ExpensesResponse = {
	summary: FinanceSummary;
	spendingByCategory: SpendingCategoryItem[];
	filters: FinanceFilterOptions;
	table: PaginatedResult<ExpenseItem>;
};

export type InvoicesResponse = {
	summary: FinanceSummary;
	filters: FinanceFilterOptions;
	table: PaginatedResult<InvoiceItem>;
};

export type TollRecordsResponse = {
	summary: FinanceSummary;
	filters: FinanceFilterOptions;
	table: PaginatedResult<TollRecordItem>;
};

export type LogExpensePayload = {
	vehicle: string;
	category: string;
	description?: string;
	amount: number;
	date: string;
	receiptUrl?: string;
};

export type LogTollRecordPayload = {
	vehicle: string;
	charge: number;
	dateTime: string;
	route: string;
	tollLocation: string;
	linkedRental: string;
};

type MutationEnvelope<T> = {
	success: boolean;
	message: string;
	data: T;
};

export const expensesApi = createApi({
	reducerPath: "expensesApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["Finance"],
	endpoints: (builder) => ({
		getFinanceSummary: builder.query<ApiEnvelope<FinanceSummary>, void>({
			query: () => ({
				url: "/api/host/finance/summary",
				method: "GET",
			}),
			providesTags: [{ type: "Finance", id: "SUMMARY" }],
		}),

		getExpenses: builder.query<ApiEnvelope<ExpensesResponse>, FinanceFilters | undefined>({
			query: (filters) => {
				const query = toQueryString(filters);
				return {
					url: `/api/host/finance/expenses${query ? `?${query}` : ""}`,
					method: "GET",
				};
			},
			providesTags: [{ type: "Finance", id: "EXPENSES" }],
		}),

		getInvoices: builder.query<ApiEnvelope<InvoicesResponse>, FinanceFilters | undefined>({
			query: (filters) => {
				const query = toQueryString(filters);
				return {
					url: `/api/host/finance/invoices${query ? `?${query}` : ""}`,
					method: "GET",
				};
			},
			providesTags: [{ type: "Finance", id: "INVOICES" }],
		}),

		getTollRecords: builder.query<ApiEnvelope<TollRecordsResponse>, FinanceFilters | undefined>({
			query: (filters) => {
				const query = toQueryString(filters);
				return {
					url: `/api/host/finance/toll-records${query ? `?${query}` : ""}`,
					method: "GET",
				};
			},
			providesTags: [{ type: "Finance", id: "TOLL_RECORDS" }],
		}),

		logExpense: builder.mutation<MutationEnvelope<ExpenseItem>, LogExpensePayload>({
			query: (payload) => ({
				url: "/api/host/finance/expenses",
				method: "POST",
				body: payload,
			}),
			invalidatesTags: [
				{ type: "Finance", id: "SUMMARY" },
				{ type: "Finance", id: "EXPENSES" },
			],
		}),

		logTollRecord: builder.mutation<
			MutationEnvelope<TollRecordItem>,
			LogTollRecordPayload
		>({
			query: (payload) => ({
				url: "/api/host/finance/toll-records",
				method: "POST",
				body: payload,
			}),
			invalidatesTags: [
				{ type: "Finance", id: "SUMMARY" },
				{ type: "Finance", id: "TOLL_RECORDS" },
			],
		}),
	}),
});

export const {
	useGetFinanceSummaryQuery,
	useGetExpensesQuery,
	useGetInvoicesQuery,
	useGetTollRecordsQuery,
	useLogExpenseMutation,
	useLogTollRecordMutation,
} = expensesApi;
