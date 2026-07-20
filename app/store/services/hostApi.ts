import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { AxiosError, Method } from "axios";
import apiClient from "@/lib";
import {
  CreateHostRequest,
  CreateHostResponse,
  HostSignInPayload,
  HostSignInResponse,
} from "@/app/services/signIn";
import {
  CreateVehicle,
  CreateVehicleResponse,
  IListVehiclesResponse,
  IListVehiclesDatum,
  IVehicleDataFilters,
} from "@/types/vehicle.type";
import {
  LogServiceModalRequest,
  LogServiceRequest,
  MaintenanceDashboardQuery,
  MaintenanceDashboardResponse,
  ServiceHistoryItem,
} from "@/types/logservice.type";
import { toast } from "sonner";
import {
  BillingPaymentStatus,
  HostBusinessVerificationStatus,
} from "./settingsApi";

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
      request.method.toUpperCase() as Method,
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

const toQueryString = <T extends object>(filters?: T) => {
  if (!filters) return "";

  const params = new URLSearchParams();
  Object.entries(filters as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });

  return params.toString();
};

type GetVehicleResponse = {
  success: boolean;
  data: IListVehiclesDatum;
};

type UpdateVehiclePayload = Partial<CreateVehicle> & {
  status?: string;
};

type CreateBookingPayload = {
  vehicleId: string;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  pickupDate: string;
  returnDate: string;
  location: string;
  addOns: string[];
};

type CreateBookingResponse = {
  success: boolean;
  message: string;
  data: unknown;
};

type RelistVehiclePayload = {
  vehicleId: string;
  reason: string;
  supportingDocuments?: string[];
};

type SnoozeVehiclePayload = {
  vehicleId: string;
  snoozeStart: string;
  snoozeEnd: string;
};

type EndSnoozeEarlyPayload = {
  vehicleId: string;
};

export const hostApi = createApi({
  reducerPath: "hostApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Host", "Fleet", "Maintainance", "Reviews"],
  endpoints: (builder) => ({
    hostLogin: builder.mutation<HostSignInResponse, HostSignInPayload>({
      query: (payload) => ({
        url: "/api/host/login",
        method: "POST",
        body: payload,
      }),
    }),

    hostRegister: builder.mutation<CreateHostResponse, CreateHostRequest>({
      query: (payload) => ({
        url: "/api/host/register",
        method: "POST",
        body: payload,
      }),
    }),

    forgotPassword: builder.mutation<void, { email: string }>({
      query: (payload) => ({
        url: "/api/host/forgot-password",
        method: "POST",
        body: payload,
      }),
    }),

    resetPassword: builder.mutation<
      void,
      { token: string; newPassword: string }
    >({
      query: (payload) => ({
        url: "/api/host/reset-password",
        method: "POST",
        body: payload,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/host/logout",
        method: "POST",
      }),
    }),

    // vehicle management endpoints
    listVehcle: builder.query<IListVehiclesResponse, IVehicleDataFilters>({
      query: (filters) => ({
        url: `/api/host/vehicles?${toQueryString(filters)}`,
        method: "GET",
      }),
      providesTags: [{ type: "Fleet", id: "LIST" }],
    }),

    getVehicle: builder.query<GetVehicleResponse, string>({
      query: (vehicleId) => ({
        url: `/api/host/vehicles/${vehicleId}`,
        method: "GET",
      }),
      providesTags: (result, error, vehicleId) => [
        { type: "Fleet", id: vehicleId },
      ],
    }),

    addVehicle: builder.mutation<CreateVehicleResponse, CreateVehicle>({
      query: (payload) => ({
        url: "/api/host/vehicles",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Fleet", id: "LIST" }],
    }),

    unlistVehicle: builder.mutation<
      void,
      { vehicleId: string; reason: string }
    >({
      query: ({ vehicleId, reason }) => ({
        url: `/api/host/vehicles/${vehicleId}/unlist`,
        method: "PUT",
        body: { reason },
      }),
      invalidatesTags: (result, error, { vehicleId }) => [
        { type: "Fleet", id: vehicleId },
        { type: "Fleet", id: "LIST" },
      ],
    }),

    snoozeVehicle: builder.mutation<void, SnoozeVehiclePayload>({
      query: ({ vehicleId, snoozeStart, snoozeEnd }) => ({
        url: `/api/host/vehicles/${vehicleId}/snooze`,
        method: "PUT",
        body: { snoozeStart, snoozeEnd },
      }),
      invalidatesTags: (result, error, { vehicleId }) => [
        { type: "Fleet", id: vehicleId },
        { type: "Fleet", id: "LIST" },
      ],
    }),

    endSnoozeEarly: builder.mutation<void, EndSnoozeEarlyPayload>({
      query: ({ vehicleId }) => ({
        url: `/api/host/vehicles/${vehicleId}/snooze/end-early`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, { vehicleId }) => [
        { type: "Fleet", id: vehicleId },
        { type: "Fleet", id: "LIST" },
      ],
    }),

    markUnavailable: builder.mutation<void, string>({
      query: (vehicleId) => ({
        url: `/api/host/vehicles/${vehicleId}/unavailable`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, vehicleId) => [
        { type: "Fleet", id: vehicleId },
        { type: "Fleet", id: "LIST" },
      ],
    }),

    relistVehicle: builder.mutation<void, RelistVehiclePayload>({
      query: ({ vehicleId, reason, supportingDocuments }) => ({
        url: `/api/host/vehicles/${vehicleId}/relist`,
        method: "PUT",
        body: { reason, supportingDocuments },
      }),
      invalidatesTags: (result, error, { vehicleId }) => [
        { type: "Fleet", id: vehicleId },
        { type: "Fleet", id: "LIST" },
      ],
    }),

    updateVehicle: builder.mutation<
      void,
      { vehicleId: string; data: UpdateVehiclePayload }
    >({
      query: ({ vehicleId, data }) => ({
        url: `/api/host/vehicles/${vehicleId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "Fleet", id: "LIST" }],
    }),

    deleteVehicle: builder.mutation<void, string>({
      query: (vehicleId) => ({
        url: `/api/host/vehicles/${vehicleId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Fleet", id: "LIST" }],
    }),

    createBooking: builder.mutation<
      CreateBookingResponse,
      CreateBookingPayload
    >({
      query: (payload) => ({
        url: "/api/host/vehicles/bookings",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Fleet", id: "LIST" }],
    }),
    // vehicle management endpoints

    // maintenance endpoints
    getVehicleMaintenanceDashboard: builder.query<
      MaintenanceDashboardResponse,
      MaintenanceDashboardQuery
    >({
      query: (filters) => ({
        url: `/api/host/maintenance/dashboard?${toQueryString(filters)}`,
        method: "GET",
      }),
      providesTags: [{ type: "Maintainance", id: "LIST" }],
    }),

    logMaintenanceService: builder.mutation<void, LogServiceRequest>({
      query: (payload) => ({
        url: "/api/host/maintenance/services",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Maintainance", id: "LIST" }],
    }),

    logServiceModal: builder.mutation<
      {
        success: boolean;
        data: ServiceHistoryItem;
        message: string;
      },
      LogServiceModalRequest
    >({
      query: (payload) => ({
        url: "/api/host/maintenance/log-service",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Maintainance", id: "LIST" }],
    }),
    // maintenance endpoints

    // review endpoints
    getReviewsSummary: builder.query({
      query: () => ({
        url: "/api/host/reviews/summary",
        method: "GET",
      }),
    }),

    getReviewFilters: builder.query({
      query: () => ({
        url: "/api/host/reviews/filters",
        method: "GET",
      }),
    }),

    getVehicleReviews: builder.query({
      query: (filters) => ({
        url: `/api/host/reviews/vehicles?${toQueryString(filters)}`,
        method: "GET",
      }),
    }),

    getVehicleReviewDetails: builder.query({
      query: (vehicleId) => ({
        url: `/api/host/reviews/vehicles/${vehicleId}`,
        method: "GET",
      }),
    }),

    // profile
    getHostProfile: builder.query<
      {
        success: boolean;
        data: {
          fullName: string;
          email: string;
          companyName?: string;
          profilePictureUrl?: string;
          phoneNumber?: string;
          taxFee?: number;
          insurance?: {
            fee: number;
            provvider: string;
            policyNumber: string;
            expiryDate: string;
          };
          businessVerification: {
            status: HostBusinessVerificationStatus;
          };
          payment: {
            plan: BillingPaymentStatus;
          };
        };
      },
      void
    >({
      query: () => ({
        url: "/api/host/settings/profile-company",
        method: "GET",
      }),
      providesTags: [{ type: "Host", id: "PROFILE" }],
    }),
  }),
});

export const {
  useHostLoginMutation,
  useHostRegisterMutation,
  useAddVehicleMutation,
  useDeleteVehicleMutation,
  useCreateBookingMutation,
  useForgotPasswordMutation,
  useGetVehicleQuery,
  useMarkUnavailableMutation,
  useRelistVehicleMutation,
  useEndSnoozeEarlyMutation,
  useSnoozeVehicleMutation,
  useUpdateVehicleMutation,
  useLazyGetVehicleQuery,
  useResetPasswordMutation,
  useUnlistVehicleMutation,
  useLazyListVehcleQuery,
  useListVehcleQuery,

  // maintenance endpoints
  useGetVehicleMaintenanceDashboardQuery,
  useLazyGetVehicleMaintenanceDashboardQuery,
  useLogMaintenanceServiceMutation,
  useLogServiceModalMutation,
  // maintenance endpoints

  useLogoutMutation,

  useGetHostProfileQuery,
} = hostApi;
