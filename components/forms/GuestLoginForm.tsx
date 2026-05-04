'use client'

import MainForm from './MainForm'
import { validators } from './form.validators'
import { FormFieldConfig } from './types'
import { Mail } from 'lucide-react'

const fields: FormFieldConfig[] = [
        {
                name: 'email',
                type: 'email',
                label: 'Email Address',
                placeholder: 'john@email.com',
                icon: <Mail className='w-4 h-4' />,
                validation: validators.email(),
        },
        {
                name: 'password',
                type: 'password',
                label: 'Password',
                placeholder: 'Create a password',
                validation: validators.password(),
        },
]

export default function GuestLoginForm() {
        return (
                <MainForm
                        fields={fields}
                        onSubmit={(values) => console.log(values)}
                        submitLabel='Sign In'
                        className='w-full'
                />
        )
}
