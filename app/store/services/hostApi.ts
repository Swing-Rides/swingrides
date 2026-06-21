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
  IVehicleDataFilters,
} from "@/types/vehicle.type";
import {
  LogServiceModalRequest,
  LogServiceRequest,
  MaintenanceDashboardQuery,
  MaintenanceDashboardResponse,
  ServiceHistoryItem,
} from "@/types/logservice.type";

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

export const hostApi = createApi({
  reducerPath: "hostApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Host", "Fleet", "Maintainance"],
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

    // vehicle management endpoints
    listVehcle: builder.query<IListVehiclesResponse, IVehicleDataFilters>({
      query: (filters) => ({
        url: `/api/host/vehicles?${toQueryString(filters)}`,
        method: "GET",
      }),
      providesTags: [{ type: "Fleet", id: "LIST" }],
    }),

    getVehicle: builder.query({
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

    snoozeVehicle: builder.mutation<void, string>({
      query: (vehicleId) => ({
        url: `/api/host/vehicles/${vehicleId}/snooze`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, vehicleId) => [
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

    relistVehicle: builder.mutation<void, string>({
      query: (vehicleId) => ({
        url: `/api/host/vehicles/${vehicleId}/relist`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, vehicleId) => [
        { type: "Fleet", id: vehicleId },
        { type: "Fleet", id: "LIST" },
      ],
    }),

    updateVehicle: builder.mutation<
      void,
      { vehicleId: string; data: Partial<CreateVehicle> }
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
  }),
});

export const {
  useHostLoginMutation,
  useHostRegisterMutation,
  useAddVehicleMutation,
  useDeleteVehicleMutation,
  useForgotPasswordMutation,
  useGetVehicleQuery,
  useMarkUnavailableMutation,
  useRelistVehicleMutation,
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
} = hostApi;
