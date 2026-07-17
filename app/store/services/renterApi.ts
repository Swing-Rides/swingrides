import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, Method } from "axios";
import apiClient from "@/lib";
import {
  CreateUserRequest,
  CreateUserResponse,
  GetRenterProfileResponse,
  LoginUserResponse,
} from "@/types/renter.types";
import { SingleRent } from "@/components/pages/profilePages/types";
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

const normalizeRentalDetail = (booking: SingleRent["data"]) => ({
  ...booking,
  pickUpDate: booking.pickupDate,
});

export const renterApi = createApi({
  reducerPath: "renterApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Renter", "Bookings"],
  endpoints: (builder) => ({
    renterRegister: builder.mutation<CreateUserResponse, CreateUserRequest>({
      query: (payload) => ({
        url: "/api/auth/renter/register",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Renter", id: "PROFILE" }],
    }),

    renterLogin: builder.mutation<
      LoginUserResponse,
      {
        email: string;
        password: string;
      }
    >({
      query: (payload) => ({
        url: "/api/auth/renter/login",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Renter", id: "PROFILE" }],
    }),

    getProfile: builder.query<GetRenterProfileResponse, void>({
      query: () => ({
        url: "/api/auth/renter/me",
        method: "GET",
      }),
      providesTags: [{ type: "Renter", id: "PROFILE" }],
    }),

    renterLogout: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      void
    >({
      query: () => ({
        url: "/api/auth/renter/logout",
        method: "POST",
      }),

      invalidatesTags: [{ type: "Renter", id: "PROFILE" }],
    }),

    getBookingById: builder.query<
      {
        success: boolean;
        data: SingleRent['data'];
      },
      { id: string }
    >({
      query: ({ id }) => `/api/auth/renter/bookings/${id}`,
      providesTags: (_result, _error, { id }) => [{ type: "Bookings", id }],
    }),

    updateBooking: builder.mutation<
      {
        success: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any;
      },
      {
        id: string;
        pickupDate?: string;
        returnDate?: string;
        pickupLocation?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/auth/renter/bookings/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Bookings", id }],
    }),

    cancelBooking: builder.mutation<
      {
        success: boolean;
        data: SingleRent["data"];
      },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/api/auth/renter/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Bookings", id },
        { type: "Renter", id: "PROFILE" },
      ],
    }),

    completeVehicleReturn: builder.mutation<
      {
        success: boolean;
        data: SingleRent["data"];
      },
      {
        id: string;
        mileage: number;
        fuelLevel: string;
        photoUrls: string[];
        notes?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/auth/renter/bookings/${id}/complete-return`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Bookings", id },
        { type: "Renter", id: "PROFILE" },
      ],
    }),

    startVehicleCheckIn: builder.mutation<
      {
        success: boolean;
        data: SingleRent["data"];
      },
      {
        id: string;
        mileage: number;
        fuelLevel: string;
        vehicleConditionPhotoUrls: string[];
        driverLicensePhotoUrl: string;
        selfiePhotoUrl: string;
        notes?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/auth/renter/bookings/${id}/start-checkin`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Bookings", id },
        { type: "Renter", id: "PROFILE" },
      ],
    }),

    submitTripReview: builder.mutation<
      {
        success: boolean;
        data: {
          id: string;
          bookingId: string;
          bookingRef: string;
          rating: number;
          title: string;
          comment: string;
          recommend: "yes" | "no";
          categoryRatings: Record<string, number>;
          reviewedAt: string;
        };
      },
      {
        id: string;
        categoryRatings: Record<string, number>;
        review: string;
        recommend: "yes" | "no";
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/auth/renter/bookings/${id}/review`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Bookings", id }],
    }),
  }),
});

export const {
  useRenterRegisterMutation,
  useRenterLoginMutation,
  useGetProfileQuery,
  useRenterLogoutMutation,
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
  useCancelBookingMutation,
  useCompleteVehicleReturnMutation,
  useStartVehicleCheckInMutation,
  useSubmitTripReviewMutation,
} = renterApi;

export { normalizeRentalDetail };
