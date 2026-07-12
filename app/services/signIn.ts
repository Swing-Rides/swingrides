import apiClient from "@/lib";

export type AdminSignInPayload = {
  email: string;
  password: string;
};

export type AdminProfile = {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
};

export type AdminSignInResponse = {
  success: boolean;
  admin?: AdminProfile;
  message: string;
};

export type HostSignInPayload = {
  email: string;
  password: string;
};

export type HostProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  phoneNumber?: string;
  plan: "starter" | "professional" | "enterprise";
  planPrice?: number;
  currency: string;
  paymentStatus: "pending" | "paid" | "quote_required";
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
};

export type HostSignInResponse = {
  success: boolean;
  host?: HostProfile;
  message: string;
};

export interface CreateHostRequest {
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  phoneNumber?: string;
  password: string;
  plan?: "solo" | "flex" | "fleet" | string;
  termsAgreement: boolean;
}

export type CreateHostResponse = {
  success: boolean;
  host?: HostProfile;
  payment: {
    required: boolean;
    amount?: number;
    currency?: string;
    status: "pending" | "paid" | "quote_required";
    note: string;
  };
  message: string;
};

export async function adminSignIn(
  payload: AdminSignInPayload,
): Promise<AdminSignInResponse> {
  const response = await apiClient.post("/api/auth/admin/login", payload);
  return response.data;
}
