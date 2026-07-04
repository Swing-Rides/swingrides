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
            data: (args as any).body,
            params: (args as any).params,
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

export type NotificationCategory = "bookings" | "payments" | "maintenance" | "general";

export type HostNotification = {
  _id: string;
  hostEmail: string;
  title: string;
  message: string;
  category: NotificationCategory;
  isRead: boolean;
  readAt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type NotificationSummary = {
  totalCount: number;
  unreadCount: number;
  unreadByCategory: Record<NotificationCategory, number>;
};

export type NotificationListResponse = {
  success: true;
  data: {
    notifications: HostNotification[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    summary: NotificationSummary;
  };
};

export type UnreadCountResponse = {
  success: true;
  data: { unreadCount: number };
};

export type NotificationFilters = {
  category?: NotificationCategory | "all";
  isRead?: boolean;
  page?: number;
  limit?: number;
};

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationListResponse, NotificationFilters | void>({
      query: (filters) => ({
        url: "/api/host/notifications",
        method: "GET",
        params: {
          ...(filters?.category && filters.category !== "all" ? { category: filters.category } : {}),
          ...(filters?.isRead !== undefined ? { isRead: String(filters.isRead) } : {}),
          ...(filters?.page ? { page: filters.page } : {}),
          ...(filters?.limit ? { limit: filters.limit } : {}),
        },
      }),
      providesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => ({ url: "/api/host/notifications/unread-count", method: "GET" }),
      providesTags: [{ type: "Notifications", id: "UNREAD" }],
    }),

    markAsRead: builder.mutation<{ success: true }, string>({
      query: (id) => ({ url: `/api/host/notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: [
        { type: "Notifications", id: "LIST" },
        { type: "Notifications", id: "UNREAD" },
      ],
    }),

    markAllAsRead: builder.mutation<{ success: true; data: { updatedCount: number } }, void>({
      query: () => ({ url: "/api/host/notifications/mark-all-read", method: "PATCH" }),
      invalidatesTags: [
        { type: "Notifications", id: "LIST" },
        { type: "Notifications", id: "UNREAD" },
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationApi;
