import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, Method } from "axios";
import apiClient from "@/lib";
import {
  PublicBrowseVehiclesQuery,
  PublicBrowseVehiclesResponse,
} from "@/types/public-vehicles.type";

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
  tagTypes: ["PublicVehicles"],
  endpoints: (builder) => ({
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
  }),
});

export const { useGetPublicBrowseVehiclesQuery } = publicApi;
