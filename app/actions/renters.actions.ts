'use server'

import apiClient from '@/lib'
import { cookies } from 'next/headers'

const getServerAuthHeaders = async () => {
        const cookieStore = await cookies()
        const session = cookieStore.get('session')?.value
        return session ? { Cookie: `session=${session}` } : {}
}

export async function approveRenterAction(renterId: string) {
        const response = await apiClient.patch(
                `/api/auth/admin/renters/${renterId}/verification`,
                { status: 'verified' },
                { headers: await getServerAuthHeaders() }
        )
        return response.data
}

export async function rejectRenterAction(renterId: string) {
        const response = await apiClient.patch(
                `/api/auth/admin/renters/${renterId}/verification`,
                { status: 'rejected' },
                { headers: await getServerAuthHeaders() }
        )
        return response.data
}