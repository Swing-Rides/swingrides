'use server'

import apiClient from '@/lib'
import { AxiosError } from 'axios'
import { cookies } from 'next/headers'
import { IBIllingsResponse } from '@/types/billing.type'

const getServerAuthHeaders = async () => {
        const cookieStore = await cookies()
        const session = cookieStore.get('session')?.value
        return session ? { Cookie: `session=${session}` } : {}
}

export const fetchAdminBillings = async (): Promise<IBIllingsResponse> => {
        try {
                const response = await apiClient.get<IBIllingsResponse>(
                        '/api/auth/admin/billing',
                        { headers: await getServerAuthHeaders() }
                )
                return response.data
        } catch (error) {
                const axiosError = error as AxiosError
                console.error('Error fetching billing:', axiosError.message)
                throw error
        }
}
