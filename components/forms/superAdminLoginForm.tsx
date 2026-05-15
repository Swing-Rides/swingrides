'use client'

import { useState } from 'react'
import MainForm from './MainForm'
import { validators } from './form.validators'
import { FormFieldConfig } from './types'
import { Mail } from 'lucide-react'
import { adminSignInAction } from '@/app/actions/auth.actions'

const fields: FormFieldConfig[] = [
        {
                name: 'email',
                type: 'email',
                label: 'Email Address',
                placeholder: 'admin@swingrides.com',
                icon: <Mail className='w-4 h-4' />,
                validation: validators.email(),
        },
        {
                name: 'password',
                type: 'password',
                label: 'Password',
                placeholder: 'Admin123!@',
                validation: validators.password(),
        },
]

export default function SuperAdminLoginForm() {
        const [isLoading, setIsLoading] = useState(false)
        const [errorMessage, setErrorMessage] = useState<string | null>(null)

        async function handleSubmit(values: Record<string, unknown>) {
                setErrorMessage(null)
                setIsLoading(true)

                try {
                        const payload = {
                                email: values.email as string,
                                password: values.password as string,
                        }

                        await adminSignInAction(payload) // ← server action sets cookie + redirects
                } catch (error) {
                        // Next.js redirect throws internally, let it propagate
                        if ((error as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw error

                        console.error('Admin login failed:', error)
                        setErrorMessage('Sign in failed. Please check your email and password.')
                } finally {
                        setIsLoading(false)
                }
        }

        return (
                <div className='w-full'>
                        <MainForm
                                fields={fields}
                                onSubmit={handleSubmit}
                                submitLabel='Sign In'
                                isLoading={isLoading}
                                className='w-full'
                        />
                        {errorMessage ? (
                                <p className='mt-3 text-sm text-red-600'>{errorMessage}</p>
                        ) : null}
                </div>
        )
}
