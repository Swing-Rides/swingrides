'use server'

import apiClient from '@/lib'
import { AxiosError } from 'axios'
import { cookies } from 'next/headers'
import { ISubscribersResponse, AdminISubscriberByIdResponse } from '@/types/subscribers.type'

const getServerAuthHeaders = async () => {
        const cookieStore = await cookies()
        const session = cookieStore.get('session')?.value
        return session ? { Cookie: `session=${session}` } : {}
}

export const fetchAdminSubscribers = async (): Promise<ISubscribersResponse> => {
        try {
                const response = await apiClient.get<ISubscribersResponse>(
                        '/api/auth/admin/subscribers',
                        { headers: await getServerAuthHeaders() }
                )
                return response.data
        } catch (error) {
                const axiosError = error as AxiosError
                console.error('Error fetching subscribers:', axiosError.message)
                throw error
        }
}

export const fetchAdminSubscriberById = async (
        subscriberId: string
): Promise<AdminISubscriberByIdResponse> => {
        try {
                const response = await apiClient.get<AdminISubscriberByIdResponse>(
                        `/api/auth/admin/subscribers/${subscriberId}`,
                        { headers: await getServerAuthHeaders() }
                )
                return response.data
        } catch (error) {
                const axiosError = error as AxiosError
                console.error(`Error fetching subscriber ${subscriberId}:`, axiosError.message)
                throw error
        }
}