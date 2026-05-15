'use server'

import apiClient from '@/lib';
import { IRentersResponse, AdminRenterData, AdminVerificationPendingRenterResponse, AdminRenterByIdResponse } from '@/types/renters.type';
import { AxiosError } from 'axios';
import { cookies } from 'next/headers';

const getServerAuthHeaders = async () => {
        const cookieStore = await cookies()
        const session = cookieStore.get('session')?.value

        console.log('Session found:', session ? 'YES' : 'NONE')

        if (!session) return {}

        // Forward as a Cookie header — the API reads it as a session cookie
        return {
                Cookie: `session=${session}`
        }
}

export const fetchAdminRenters = async (): Promise<IRentersResponse> => {
        try {
                const response = await apiClient.get<IRentersResponse>(
                        '/api/auth/admin/renters',
                        { headers: await getServerAuthHeaders() }
                );
                return response.data;
        } catch (error) {
                const axiosError = error as AxiosError;
                console.error('Error fetching renters:', axiosError.message);
                throw error;
        }
};

export const fetchAdminVerificationPendingRenters = async (): Promise<AdminVerificationPendingRenterResponse> => {
        try {
                const response = await apiClient.get<AdminVerificationPendingRenterResponse>(
                        '/api/auth/admin/renters/verification-queue',
                        { headers: await getServerAuthHeaders() }
                );
                return response.data;
        } catch (error) {
                const axiosError = error as AxiosError;
                console.error('Error fetching renters:', axiosError.message);
                throw error;
        }
};

export const fetchAdminRenterById = async (
        renterId: string
): Promise<AdminRenterByIdResponse> => {
        try {
                const response = await apiClient.get<AdminRenterByIdResponse>(
                        `/api/auth/admin/renters/${renterId}`,
                        { headers: await getServerAuthHeaders() }
                );
                return response.data;
        } catch (error) {
                const axiosError = error as AxiosError;
                console.error(`Error fetching renter ${renterId}:`, axiosError.message);
                throw error;
        }
};

export default fetchAdminRenters;
