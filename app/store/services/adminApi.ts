import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AdminBillingFilters,
  AdminBillingResponse,
  AdminOverviewResponse,
} from "@/types/admin.type";
import { AdminRenterByIdResponse } from "@/types/renters.type";
import {
  AdminISubscriberByIdResponse,
  ISubscribersResponse,
} from "@/types/subscribers.type";
import { AdminSignInPayload, AdminSignInResponse } from "@/app/services/signIn";
import {
  AdminVerificationPendingRenterResponse,
  IRentersResponse,
} from "@/types/renters.type";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

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
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
  }),
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
    getAdminRenterById: builder.query<AdminRenterByIdResponse, string>({
      query: (renterId) => `/api/auth/admin/renters/${renterId}`,
    }),
    getAdminRenters: builder.query<
      IRentersResponse,
      AdminRentersQuery | undefined
    >({
      query: (filters) => {
        const query = toQueryString(filters);
        return `/api/auth/admin/renters${query ? `?${query}` : ""}`;
      },
    }),
    getAdminVerificationPendingRenters: builder.query<
      AdminVerificationPendingRenterResponse,
      AdminVerificationQueueQuery | undefined
    >({
      query: (filters) => {
        const query = toQueryString(filters);
        return `/api/auth/admin/renters/verification-queue${query ? `?${query}` : ""}`;
      },
    }),
    approveRenterVerification: builder.mutation<unknown, string>({
      query: (renterId) => ({
        url: `/api/auth/admin/renters/${renterId}/verification`,
        method: "PATCH",
        body: { status: "verified" },
      }),
    }),
    rejectRenterVerification: builder.mutation<unknown, string>({
      query: (renterId) => ({
        url: `/api/auth/admin/renters/${renterId}/verification`,
        method: "PATCH",
        body: { status: "rejected" },
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetAdminOverviewQuery,
  useGetAdminBillingQuery,
  useGetAdminSubscribersQuery,
  useGetAdminSubscriberByIdQuery,
  useGetAdminRenterByIdQuery,
  useGetAdminRentersQuery,
  useGetAdminVerificationPendingRentersQuery,
  useApproveRenterVerificationMutation,
  useRejectRenterVerificationMutation,
} = adminApi;
