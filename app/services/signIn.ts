import apiClient from '@/lib'

export type AdminSignInPayload = {
    email: string
    password: string
}

export type AdminSignInResponse = {
    token?: string
    [key: string]: unknown
}

export async function adminSignIn(payload: AdminSignInPayload): Promise<AdminSignInResponse> {
    const response = await apiClient.post('/api/auth/admin/login', payload)
    return response.data
}