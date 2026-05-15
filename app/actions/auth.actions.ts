'use server'

import { cookies } from 'next/headers'
import { adminSignIn, AdminSignInPayload } from '@/app/services/signIn'
import { redirect } from 'next/navigation'
import apiClient from '@/lib'

export async function adminSignInAction(payload: AdminSignInPayload) {
        const response = await apiClient.post('/api/auth/admin/login', payload)

        // The API sets a session cookie — extract and forward it
        const setCookieHeader = response.headers['set-cookie']

        if (!setCookieHeader || setCookieHeader.length === 0) {
                throw new Error('No session cookie received from login API')
        }

        // Parse the session cookie value from the Set-Cookie header
        const sessionCookie = setCookieHeader[0] // "session=...; Max-Age=...; Path=/; ..."
        const sessionValue = sessionCookie.split(';')[0].split('=')[1] // URL-encoded session value

        const cookieStore = await cookies()
        cookieStore.set('session', sessionValue, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/admin',
        })

        redirect('/admin')
}