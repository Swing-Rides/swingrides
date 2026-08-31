import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, Method } from "axios";
import apiClient from "@/lib";
import {
  PublicBrowseVehiclesQuery,
  PublicBrowseVehiclesResponse,
  VehicleDetails,
  HostConnectionResponse,
} from "@/types/public-vehicles.type";
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

const toQueryString = (filters?: PublicBrowseVehiclesQuery) => {
  if (!filters) return "";

  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.set(key, value.join(","));
      }
      return;
    }

    params.set(key, String(value));
  });

  return params.toString();
};

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["PublicVehicles", "PublicBookings", "HostConnection", "HostPlanPrices"],
  endpoints: (builder) => ({
    getHostPlanPrices: builder.query<
      { success: boolean; data: Record<"flex" | "solo" | "fleet", number> },
      void
    >({
      query: () => "/api/public/host-plans",
      providesTags: [{ type: "HostPlanPrices", id: "CURRENT" }],
    }),

    getPublicBrowseVehicles: builder.query<
      PublicBrowseVehiclesResponse,
      PublicBrowseVehiclesQuery | undefined
    >({
      query: (filters) => {
        const query = toQueryString(filters);
        return `/api/public/vehicles${query ? `?${query}` : ""}`;
      },
      providesTags: [{ type: "PublicVehicles", id: "LIST" }],
    }),

    getPublicVehicleById: builder.query<
      {
        data: VehicleDetails;
        success: boolean;
      },
      { id: string }
    >({
      query: ({ id }) => `/api/public/vehicles/${id}`,
      providesTags: (_result, _error, { id }) => [
        { type: "PublicVehicles", id },
      ],
    }),

    createPublicBooking: builder.mutation<
      {
        success: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any;
      },
      {
        vehicleId: string;
        paymentIntentId: string;
        pickupDate: string;
        returnDate: string;
        pickupLocation: string;
        streetAddress: string;
        city: string;
        state: string;
        postalCode: string;
        pickupTime: string;
        returnTime: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        insuranceProvider?: string;
        policyNumber?: string;
        insuranceExpiry?: string;
        hostProvidingCoverage?: boolean;
      }
    >({
      query: (bookingData) => ({
        url: "/api/auth/renter/bookings",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: [{ type: "PublicBookings", id: "LIST" }],
    }),

    connectToHost: builder.mutation<HostConnectionResponse, { phoneNumber: string }>({
      query: (payload) => ({
        url: "/api/public/connect-host",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "HostConnection", id: "CURRENT" }],
    }),

    getHostConnection: builder.query<HostConnectionResponse, string>({
      query: (phoneNumber) => ({
        url: "/api/public/connect-host",
        method: "GET",
        params: { phoneNumber },
      }),
      providesTags: [{ type: "HostConnection", id: "CURRENT" }],
    }),

    disconnectHost: builder.mutation<
      { success: boolean; data: { disconnected: boolean } },
      string
    >({
      query: (phoneNumber) => ({
        url: "/api/public/connect-host",
        method: "DELETE",
        params: { phoneNumber },
      }),
      invalidatesTags: [{ type: "HostConnection", id: "CURRENT" }],
    }),

    createPublicAccountIssueReport: builder.mutation<
      {
        success: boolean;
        data: {
          id: string;
          email: string;
          name: string;
          issueType: string;
          subject: string;
          description: string;
          dateSubmitted: string;
          status: "open" | "inReview" | "resolved";
          isUrgent: boolean;
          photoUrls: string[];
        };
      },
      {
        email: string;
        name: string;
        issueType: string;
        subject: string;
        description: string;
        isUrgent?: boolean;
        photoUrls?: string[];
      }
    >({
      query: (payload) => ({
        url: "/api/public/account-issues",
        method: "POST",
        body: payload,
      }),
    }),

    createCheckoutPaymentIntent: builder.mutation<
      {
        success: boolean;
        message: string;
        data: {
          id: string;
          amount: number;
          currency: string;
          clientSecret: string;
          status: string;
          subtotal: number;
          tax: number;
          taxRate: number;
          totalAmount: number;
          metadata?: Record<string, string>;
        };
      },
      {
        vehicleId: string;
        pickupDate: string;
        returnDate: string;
        currency?: string;
        hostProvidingCoverage?: boolean;
        metadata?: Record<string, string>;
      }
    >({
      query: (payload) => ({
        url: "/api/payments/create-payment-intent",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetHostPlanPricesQuery,
  useGetPublicBrowseVehiclesQuery,
  useGetPublicVehicleByIdQuery,
  useCreatePublicBookingMutation,
  useCreatePublicAccountIssueReportMutation,
  useConnectToHostMutation,
  useGetHostConnectionQuery,
  useDisconnectHostMutation,
  useCreateCheckoutPaymentIntentMutation,
} = publicApi;
