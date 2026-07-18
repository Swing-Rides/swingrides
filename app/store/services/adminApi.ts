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
  AdminISubscriberBookingDetailResponse,
  AdminISubscriberFleetDetailResponse,
  AdminISubscriberByIdResponse,
  ISubscribersResponse,
} from "@/types/subscribers.type";
import { AdminSignInPayload, AdminSignInResponse } from "@/app/services/signIn";
import {
  AdminVerificationPendingRenterResponse,
  IRentersResponse,
} from "@/types/renters.type";
import {
  AdminUsersListResponse,
  AdminActivityLogResponse,
  InviteAdminPayload,
  InviteAdminResponse,
  PlatformSettingsResponse,
  PlatformFeaturesSettings,
  SystemSettings,
  OperationalControlsSettings,
  SecuritySettings,
  CommunicationSettings,
  RecentSendsResponse,
  RecipientsResponse,
  SendEmailPayload,
  AdminUsersQuery,
  ActivityLogQuery,
  RecentSendsQuery,
} from "@/types/settings.type";
import {
  AdminReviewsQuery,
  AdminReviewsModerationResponse,
  AdminReviewDetailResponse,
  AdminReviewActionResponse,
} from "@/types/admin-reviews.type";
import { toast } from "sonner";

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

interface ErrorResponseData {
  message?: string;
}

interface SuccessResponseData {
  message?: string;
}

const MUTATING_METHODS: Method[] = ["POST", "PUT", "PATCH", "DELETE"];


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

    const isMutatingMethod = MUTATING_METHODS.includes(
      request.method.toUpperCase() as Method
    );

    try {
      const result = await apiClient({
        url: request.url,
        method: request.method,
        data: request.data,
        params: request.params,
      });

      if (isMutatingMethod) {
        const successData = result.data as SuccessResponseData;
        if (typeof successData?.message === "string") {
          toast.success(successData.message);
        }
      }

      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponseData>;
      const responseData = axiosError.response?.data;

      const message =
        typeof responseData?.message === "string"
          ? responseData.message
          : typeof responseData === "string"
            ? responseData
            : "Process failed";

      if (isMutatingMethod) {
        toast.error(message);
      }

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

type AdminSubscriberBookingDetailQuery = {
  subscriberId: string;
  bookingId: string;
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
  tagTypes: ["AdminRenters", "AdminVerificationQueue", "AdminRenter", "AdminSettingsUsers", "AdminActivityLog", "PlatformSettings", "EmailSends", "AdminReviews"],
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
    getAdminSubscriberBookingDetail: builder.query<
      AdminISubscriberBookingDetailResponse,
      AdminSubscriberBookingDetailQuery
    >({
      query: ({ subscriberId, bookingId }) =>
        `/api/auth/admin/subscribers/${subscriberId}/bookings/${bookingId}`,
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

    // ─── Settings: Admin Users ───────────────────────────────────────────────
    getAdminUsersList: builder.query<AdminUsersListResponse, AdminUsersQuery | undefined>({
      query: (filters) => {
        const query = toQueryString(filters);
        return `/api/auth/admin/settings/admin-users${query ? `?${query}` : ""}`;
      },
      providesTags: [{ type: "AdminSettingsUsers", id: "LIST" }],
    }),
    inviteAdmin: builder.mutation<InviteAdminResponse, InviteAdminPayload>({
      query: (payload) => ({
        url: "/api/auth/admin/settings/admin-users/invite",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "AdminSettingsUsers", id: "LIST" },
        { type: "AdminActivityLog", id: "LIST" },
      ],
    }),
    updateAdminRole: builder.mutation<unknown, { adminId: string; role: "admin" | "support" }>({
      query: ({ adminId, role }) => ({
        url: `/api/auth/admin/settings/admin-users/${adminId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: [
        { type: "AdminSettingsUsers", id: "LIST" },
        { type: "AdminActivityLog", id: "LIST" },
      ],
    }),
    suspendAdminUser: builder.mutation<unknown, string>({
      query: (adminId) => ({
        url: `/api/auth/admin/settings/admin-users/${adminId}/suspend`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "AdminSettingsUsers", id: "LIST" },
        { type: "AdminActivityLog", id: "LIST" },
      ],
    }),
    reactivateAdminUser: builder.mutation<unknown, string>({
      query: (adminId) => ({
        url: `/api/auth/admin/settings/admin-users/${adminId}/reactivate`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "AdminSettingsUsers", id: "LIST" },
        { type: "AdminActivityLog", id: "LIST" },
      ],
    }),
    resendAdminInvite: builder.mutation<unknown, string>({
      query: (adminId) => ({
        url: `/api/auth/admin/settings/admin-users/${adminId}/resend-invite`,
        method: "PATCH",
      }),
    }),
    removeAdminUser: builder.mutation<unknown, string>({
      query: (adminId) => ({
        url: `/api/auth/admin/settings/admin-users/${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "AdminSettingsUsers", id: "LIST" },
        { type: "AdminActivityLog", id: "LIST" },
      ],
    }),
    getAdminActivityLog: builder.query<AdminActivityLogResponse, ActivityLogQuery | undefined>({
      query: (filters) => {
        const query = toQueryString(filters);
        return `/api/auth/admin/settings/activity-log${query ? `?${query}` : ""}`;
      },
      providesTags: [{ type: "AdminActivityLog", id: "LIST" }],
    }),

    // ─── Settings: General ───────────────────────────────────────────────────
    getPlatformSettings: builder.query<PlatformSettingsResponse, void>({
      query: () => "/api/auth/admin/settings/general",
      providesTags: ["PlatformSettings"],
    }),
    updatePlatformFeatures: builder.mutation<unknown, Partial<PlatformFeaturesSettings>>({
      query: (body) => ({
        url: "/api/auth/admin/settings/general/platform-features",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PlatformSettings"],
    }),
    updateSystemSettings: builder.mutation<unknown, Partial<SystemSettings>>({
      query: (body) => ({
        url: "/api/auth/admin/settings/general/system",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PlatformSettings"],
    }),
    updateOperationalControls: builder.mutation<unknown, Partial<OperationalControlsSettings>>({
      query: (body) => ({
        url: "/api/auth/admin/settings/general/operational-controls",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PlatformSettings"],
    }),
    updateSecuritySettings: builder.mutation<unknown, Partial<SecuritySettings>>({
      query: (body) => ({
        url: "/api/auth/admin/settings/general/security",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PlatformSettings"],
    }),
    updateCommunicationSettings: builder.mutation<unknown, Partial<CommunicationSettings>>({
      query: (body) => ({
        url: "/api/auth/admin/settings/general/communication",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PlatformSettings"],
    }),

    // ─── Settings: Email Actions ─────────────────────────────────────────────
    getRecentEmailSends: builder.query<RecentSendsResponse, RecentSendsQuery | undefined>({
      query: (filters) => {
        const query = toQueryString(filters);
        return `/api/auth/admin/settings/email-actions/recent-sends${query ? `?${query}` : ""}`;
      },
      providesTags: ["EmailSends"],
    }),
    searchEmailRecipients: builder.query<RecipientsResponse, string>({
      query: (search) =>
        `/api/auth/admin/settings/email-actions/recipients?search=${encodeURIComponent(search)}`,
    }),
    sendSystemEmail: builder.mutation<unknown, SendEmailPayload>({
      query: (payload) => ({
        url: "/api/auth/admin/settings/email-actions/send",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["EmailSends"],
    }),

    // ─── Reviews ─────────────────────────────────────────────────────────────
    getAdminReviewsModeration: builder.query<
      AdminReviewsModerationResponse,
      AdminReviewsQuery | undefined
    >({
      query: (filters) => {
        const query = toQueryString(filters);
        return `/api/auth/admin/reviews${query ? `?${query}` : ""}`;
      },
      providesTags: [{ type: "AdminReviews", id: "LIST" }],
    }),
    getAdminReviewDetail: builder.query<AdminReviewDetailResponse, string>({
      query: (reviewId) => `/api/auth/admin/reviews/${reviewId}`,
      providesTags: (_result, _error, reviewId) => [
        { type: "AdminReviews", id: reviewId },
      ],
    }),
    flagAdminReview: builder.mutation<AdminReviewActionResponse, string>({
      query: (reviewId) => ({
        url: `/api/auth/admin/reviews/${reviewId}/flag`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "AdminReviews", id: "LIST" }],
    }),
    unflagAdminReview: builder.mutation<AdminReviewActionResponse, string>({
      query: (reviewId) => ({
        url: `/api/auth/admin/reviews/${reviewId}/unflag`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "AdminReviews", id: "LIST" }],
    }),
    deleteAdminReview: builder.mutation<AdminReviewActionResponse, string>({
      query: (reviewId) => ({
        url: `/api/auth/admin/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "AdminReviews", id: "LIST" }],
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
  useGetAdminSubscriberBookingDetailQuery,
  useGetAdminRenterByIdQuery,
  useGetAdminRentersQuery,
  useGetAdminVerificationPendingRentersQuery,
  useApproveRenterVerificationMutation,
  useRejectRenterVerificationMutation,
  // Settings: Admin Users
  useGetAdminUsersListQuery,
  useInviteAdminMutation,
  useUpdateAdminRoleMutation,
  useSuspendAdminUserMutation,
  useReactivateAdminUserMutation,
  useResendAdminInviteMutation,
  useRemoveAdminUserMutation,
  useGetAdminActivityLogQuery,
  // Settings: General
  useGetPlatformSettingsQuery,
  useUpdatePlatformFeaturesMutation,
  useUpdateSystemSettingsMutation,
  useUpdateOperationalControlsMutation,
  useUpdateSecuritySettingsMutation,
  useUpdateCommunicationSettingsMutation,
  // Settings: Email Actions
  useGetRecentEmailSendsQuery,
  useSearchEmailRecipientsQuery,
  useSendSystemEmailMutation,
  // Reviews
  useGetAdminReviewsModerationQuery,
  useGetAdminReviewDetailQuery,
  useFlagAdminReviewMutation,
  useUnflagAdminReviewMutation,
  useDeleteAdminReviewMutation,
} = adminApi;
