import apiClient from "@/lib";

export type AdminSignInPayload = {
  email: string;
  password: string;
};

export type AdminProfile = {
  id: string
  email: string
  role: string
  permissions: string[]
  isActive: boolean
  createdAt: string
  lastLogin: string
}

export type AdminSignInResponse = {
  success: boolean
  admin?: AdminProfile
  message: string
};

export async function adminSignIn(
  payload: AdminSignInPayload,
): Promise<AdminSignInResponse> {
  const response = await apiClient.post("/api/auth/admin/login", payload);
  return response.data;
}
