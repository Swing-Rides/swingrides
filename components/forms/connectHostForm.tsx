'use client'

import { useSearchParams } from 'next/navigation'
import { Phone } from 'lucide-react'
import MainForm from './MainForm'
import { validators } from './form.validators'
import { FormFieldConfig } from './types'
import { RegisterOptions } from 'react-hook-form'

export default function ConnectHostForm() {
        const searchParams = useSearchParams()
        const phoneFromUrl = searchParams.get('phone') ?? ''

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

        const onSubmit = (values: Record<string, unknown>) => {
                console.log(values)
        }

        return (
                <MainForm
                        fields={fields}
                        onSubmit={onSubmit}
                        submitLabel='Connect to Host →'
                        className='w-full'
                />
        )
}