'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Phone } from 'lucide-react'
import { toast } from 'sonner'
import MainForm from './MainForm'
import { validators } from './form.validators'
import { FormFieldConfig } from './types'
import { RegisterOptions } from 'react-hook-form'
import { useConnectToHostMutation } from '@/app/store/services/publicApi'
import { setStoredConnectedPhone } from '@/lib/connectedHost'

export default function ConnectHostForm() {
        const router = useRouter()
        const searchParams = useSearchParams()
        const phoneFromUrl = searchParams.get('phone') ?? ''
        const [isSubmitting, setIsSubmitting] = useState(false)
        const [connectToHost] = useConnectToHostMutation()

        const fields: FormFieldConfig[] = [
                {
                        name: 'phoneNumber',
                        type: 'tel',
                        label: 'Phone Number',
                        placeholder: '+1 555-123-4567',
                        icon: <Phone className='w-4 h-4' />,
                        autoComplete: 'tel',
                        defaultValue: phoneFromUrl,
                        description: 'Enter the phone number associated with your host account.',
                        validation: validators.phone() as RegisterOptions,
                },
        ]

        const onSubmit = async (values: Record<string, unknown>) => {
                const phoneNumber = String(values.phoneNumber ?? '').trim()
                setIsSubmitting(true)
                try {
                        await connectToHost({ phoneNumber }).unwrap()
                        setStoredConnectedPhone(phoneNumber)
                        router.push(`/connect-host/confirmed?phone=${encodeURIComponent(phoneNumber)}`)
                } catch (error: unknown) {
                        const message =
                                typeof error === 'object' &&
                                        error !== null &&
                                        'data' in error &&
                                        typeof error.data === 'object' &&
                                        error.data !== null &&
                                        'message' in error.data &&
                                        typeof error.data.message === 'string'
                                        ? error.data.message
                                        : 'Failed to connect to host. Please check the phone number and try again.'
                        toast.error(message)
                } finally {
                        setIsSubmitting(false)
                }
        }

        return (
                <MainForm
                        fields={fields}
                        onSubmit={onSubmit}
                        isLoading={isSubmitting}
                        submitLabel='Connect to Host →'
                        className='w-full'
                />
        )
}