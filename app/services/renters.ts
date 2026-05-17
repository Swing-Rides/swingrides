import apiClient from "@/lib";
import {
  IRentersResponse,
  AdminVerificationPendingRenterResponse,
  AdminRenterByIdResponse,
} from "@/types/renters.type";
import { AxiosError } from "axios";

export const fetchAdminRenters = async (): Promise<IRentersResponse> => {
  try {
    const response = await apiClient.get<IRentersResponse>(
      "/api/auth/admin/renters",
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error fetching renters:", axiosError.message);
    throw error;
  }
};

export const fetchAdminVerificationPendingRenters =
  async (): Promise<AdminVerificationPendingRenterResponse> => {
    try {
      const response =
        await apiClient.get<AdminVerificationPendingRenterResponse>(
          "/api/auth/admin/renters/verification-queue",
        );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching renters:", axiosError.message);
      throw error;
    }
  };

export const fetchAdminRenterById = async (
  renterId: string,
): Promise<AdminRenterByIdResponse> => {
  try {
    const response = await apiClient.get<AdminRenterByIdResponse>(
      `/api/auth/admin/renters/${renterId}`,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`Error fetching renter ${renterId}:`, axiosError.message);
    throw error;
  }
};

export const approveRenter = async (renterId: string) => {
  const response = await apiClient.patch(
    `/api/auth/admin/renters/${renterId}/verification`,
    { status: "verified" },
  );

  return response.data;
};

export const rejectRenter = async (renterId: string) => {
  const response = await apiClient.patch(
    `/api/auth/admin/renters/${renterId}/verification`,
    { status: "rejected" },
  );

  return response.data;
};

export default fetchAdminRenters;
