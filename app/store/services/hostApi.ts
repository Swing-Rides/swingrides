import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { AxiosError, Method } from "axios";
import apiClient from "@/lib";
import {
  CreateHostRequest,
  CreateHostResponse,
  HostSignInPayload,
  HostSignInResponse,
} from "@/app/services/signIn";

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
  tagTypes: ["Host"],
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
  }),
});

export const { useHostLoginMutation, useHostRegisterMutation } = hostApi;
