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

export type IssueReportStatus = "open" | "inReview" | "resolved";

export type IssueReportFilters = {
  search?: string;
  status?: IssueReportStatus;
  issueType?: string;
  page?: number;
  limit?: number;
};

export type IssueReportListItem = {
  id: string;
  issueType: string;
  bookingReference: string;
  dateSubmitted: string;
  status: IssueReportStatus;
  isUrgent: boolean;
};

export type IssueReportDetail = {
  id: string;
  issueType: string;
  bookingReference: string;
  dateSubmitted: string;
  status: IssueReportStatus;
  isUrgent: boolean;
  description: string;
  photoUrls: string[];
  responseMessage?: string;
  responseDate?: string;
  respondedBy?: string;
};

type PaginatedIssueReports = {
  items: IssueReportListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type CreateIssueReportPayload = {
  bookingReference: string;
  issueType: string;
  description: string;
  isUrgent?: boolean;
  photoUrls?: string[];
};

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["IssueReports"],
  endpoints: (builder) => ({
    createIssueReport: builder.mutation<
      ApiEnvelope<IssueReportDetail>,
      CreateIssueReportPayload
    >({
      query: (payload) => ({
        url: "/api/host/report-issues",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "IssueReports", id: "LIST" }],
    }),

    getIssueReports: builder.query<
      ApiEnvelope<PaginatedIssueReports>,
      IssueReportFilters | undefined
    >({
      query: (filters) => {
        const query = toQueryString(filters);
        return {
          url: `/api/host/report-issues${query ? `?${query}` : ""}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "IssueReports", id: "LIST" }],
    }),

    getIssueReportById: builder.query<ApiEnvelope<IssueReportDetail>, string>({
      query: (reportId) => ({
        url: `/api/host/report-issues/${reportId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, reportId) => [
        { type: "IssueReports", id: reportId },
      ],
    }),
  }),
});

export const {
  useCreateIssueReportMutation,
  useGetIssueReportsQuery,
  useGetIssueReportByIdQuery,
} = reportApi;
