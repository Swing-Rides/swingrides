import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { AxiosError, Method } from "axios";
import apiClient from "@/lib";
import {
  AdminBillingFilters,
  AdminBillingResponse,
  AdminOverviewResponse,
} from "@/types/admin.type";
import { AdminRenterByIdResponse } from "@/types/renters.type";
import {
  AdminISubscriberFleetDetailResponse,
  AdminISubscriberByIdResponse,
  ISubscribersResponse,
} from "@/types/subscribers.type";
import { AdminSignInPayload, AdminSignInResponse } from "@/app/services/signIn";
import {
  AdminVerificationPendingRenterResponse,
  IRentersResponse,
} from "@/types/renters.type";

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

type AdminSubscribersQuery = {
  search?: string;
  status?: "all" | "active" | "past_due" | "cancelled";
  plan?: "all" | "starter" | "professional" | "enterprise";
  page?: number;
  limit?: number;
};

type AdminRentersQuery = {
  search?: string;
  status?: "all" | "verified" | "pending" | "rejected";
  page?: number;
  limit?: number;
};

type AdminVerificationQueueQuery = {
  page?: number;
  limit?: number;
};

type AdminSubscriberFleetDetailQuery = {
  subscriberId: string;
  fleetId: string;
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

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AdminRenters", "AdminVerificationQueue", "AdminRenter"],
  endpoints: (builder) => ({
    adminLogin: builder.mutation<AdminSignInResponse, AdminSignInPayload>({
      query: (payload) => ({
        url: "/api/auth/admin/login",
        method: "POST",
        body: payload,
      }),
    }),
    getAdminOverview: builder.query<AdminOverviewResponse, void>({
      query: () => "/api/auth/admin/overview",
    }),
    getAdminBilling: builder.query<
      AdminBillingResponse,
      AdminBillingFilters | undefined
    >({
      query: (filters) => {
        const query = toQueryString(filters);
        return `/api/auth/admin/billing${query ? `?${query}` : ""}`;
      },
    }),
    getAdminSubscribers: builder.query<
      ISubscribersResponse,
      AdminSubscribersQuery | undefined
    >({
      query: (filters) => {
        const query = toQueryString(filters);
        return `/api/auth/admin/subscribers${query ? `?${query}` : ""}`;
      },
    }),
    getAdminSubscriberById: builder.query<AdminISubscriberByIdResponse, string>(
      {
        query: (subscriberId) => `/api/auth/admin/subscribers/${subscriberId}`,
      },
    ),
    getAdminSubscriberFleetDetail: builder.query<
      AdminISubscriberFleetDetailResponse,
      AdminSubscriberFleetDetailQuery
    >({
      query: ({ subscriberId, fleetId }) =>
        `/api/auth/admin/subscribers/${subscriberId}/fleet/${fleetId}`,
    }),
    getAdminRenterById: builder.query<AdminRenterByIdResponse, string>({
      query: (renterId) => `/api/auth/admin/renters/${renterId}`,
      providesTags: (_result, _error, renterId) => [
        { type: "AdminRenter", id: renterId },
      ],
    }),
    getAdminRenters: builder.query<
      IRentersResponse,
      AdminRentersQuery | undefined
    >({
      query: (filters) => {
        const query = toQueryString(filters);
        return `/api/auth/admin/renters${query ? `?${query}` : ""}`;
      },
      providesTags: [{ type: "AdminRenters", id: "LIST" }],
    }),
    getAdminVerificationPendingRenters: builder.query<
      AdminVerificationPendingRenterResponse,
      AdminVerificationQueueQuery | undefined
    >({
      query: (filters) => {
        const query = toQueryString(filters);
        return `/api/auth/admin/renters/verification-queue${query ? `?${query}` : ""}`;
      },
      providesTags: [{ type: "AdminVerificationQueue", id: "LIST" }],
    }),
    approveRenterVerification: builder.mutation<unknown, string>({
      query: (renterId) => ({
        url: `/api/auth/admin/renters/${renterId}/verification`,
        method: "PATCH",
        body: { status: "verified" },
      }),
      invalidatesTags: (_result, _error, renterId) => [
        { type: "AdminRenters", id: "LIST" },
        { type: "AdminVerificationQueue", id: "LIST" },
        { type: "AdminRenter", id: renterId },
      ],
    }),
    rejectRenterVerification: builder.mutation<unknown, string>({
      query: (renterId) => ({
        url: `/api/auth/admin/renters/${renterId}/verification`,
        method: "PATCH",
        body: { status: "rejected" },
      }),
      invalidatesTags: (_result, _error, renterId) => [
        { type: "AdminRenters", id: "LIST" },
        { type: "AdminVerificationQueue", id: "LIST" },
        { type: "AdminRenter", id: renterId },
      ],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetAdminOverviewQuery,
  useGetAdminBillingQuery,
  useGetAdminSubscribersQuery,
  useGetAdminSubscriberByIdQuery,
  useGetAdminSubscriberFleetDetailQuery,
  useGetAdminRenterByIdQuery,
  useGetAdminRentersQuery,
  useGetAdminVerificationPendingRentersQuery,
  useApproveRenterVerificationMutation,
  useRejectRenterVerificationMutation,
} = adminApi;
