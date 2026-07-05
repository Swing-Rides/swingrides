import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, Method } from "axios";
import apiClient from "@/lib";
import {
  CreateUserRequest,
  CreateUserResponse,
  GetRenterProfileResponse,
  LoginUserResponse,
} from "@/types/renter.types";

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

export const renterApi = createApi({
  reducerPath: "renterApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Renter"],
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
  }),
});

export const {
  useRenterRegisterMutation,
  useRenterLoginMutation,
  useGetProfileQuery,
  useRenterLogoutMutation
} = renterApi;
