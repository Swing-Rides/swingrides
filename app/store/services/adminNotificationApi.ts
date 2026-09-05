import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { AxiosError, Method } from "axios";
import apiClient from "@/lib";

const axiosBaseQuery = (): BaseQueryFn<
  | string
  | {
    url: string;
    method?: Method;
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
  },
  unknown,
  { status?: number; data: unknown }
> => {
  return async (args) => {
    const request =
      typeof args === "string"
        ? { url: args, method: "GET" as Method }
        : {
          url: args.url,
          method: args.method ?? "GET",
          data: args.body,
          params: args.params,
        };
    try {
      const result = await apiClient(request);
      return { data: result.data };
    } catch (error) {
      const e = error as AxiosError;
      return { error: { status: e.response?.status, data: e.response?.data ?? e.message } };
    }
  };
};

export type AdminNotificationCategory =
  | "registrations"
  | "alerts"
  | "reports"
  | "system"
  | "billing"
  | "bookings"
  | "reviews";

export type AdminNotificationPriority = "low" | "medium" | "high" | "urgent";

export type AdminNotification = {
  _id: string;
  adminEmail: string;
  title: string;
  message: string;
  category: AdminNotificationCategory;
  priority: AdminNotificationPriority;
  isRead: boolean;
  readAt?: string;
  metadata?: Record<string, unknown>;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminNotificationSummary = {
  totalCount: number;
  unreadCount: number;
  unreadByCategory: Record<AdminNotificationCategory, number>;
  unreadByPriority: Record<AdminNotificationPriority, number>;
};

export type AdminNotificationListResponse = {
  success: true;
  data: {
    notifications: AdminNotification[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    summary: AdminNotificationSummary;
  };
};

export type AdminNotificationFilters = {
  category?: AdminNotificationCategory | "all";
  priority?: AdminNotificationPriority;
  isRead?: boolean;
  page?: number;
  limit?: number;
};

export const adminNotificationApi = createApi({
  reducerPath: "adminNotificationApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AdminNotifications"],
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getAdminNotifications: builder.query<
      AdminNotificationListResponse,
      AdminNotificationFilters | void
    >({
      query: (filters) => ({
        url: "/api/admin/notifications",
        method: "GET",
        params: {
          ...(filters?.category && filters.category !== "all"
            ? { category: filters.category }
            : {}),
          ...(filters?.priority ? { priority: filters.priority } : {}),
          ...(filters?.isRead !== undefined ? { isRead: String(filters.isRead) } : {}),
          ...(filters?.page ? { page: filters.page } : {}),
          ...(filters?.limit ? { limit: filters.limit } : {}),
        },
      }),
      providesTags: [{ type: "AdminNotifications", id: "LIST" }],
    }),

    markAdminNotificationAsRead: builder.mutation<{ success: true }, string>({
      query: (id) => ({ url: `/api/admin/notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: [{ type: "AdminNotifications", id: "LIST" }],
    }),

    markAllAdminNotificationsAsRead: builder.mutation<
      { success: true; data: { updatedCount: number } },
      void
    >({
      query: () => ({ url: "/api/admin/notifications/mark-all-read", method: "PATCH" }),
      invalidatesTags: [{ type: "AdminNotifications", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAdminNotificationsQuery,
  useMarkAdminNotificationAsReadMutation,
  useMarkAllAdminNotificationsAsReadMutation,
} = adminNotificationApi;
