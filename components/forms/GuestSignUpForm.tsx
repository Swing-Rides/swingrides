'use client'

import MainForm from './MainForm'
import { validators } from './form.validators'
import { FormFieldConfig } from './types'
import { Mail, User } from 'lucide-react'

const fields: FormFieldConfig[] = [
        {
                name: 'fullName',
                type: 'text',
                label: 'Full Name',
                placeholder: 'John Smith',
                icon: <User className='w-4 h-4' />,
                validation: validators.name('Full name'),
        },
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
        {
                name: 'terms',
                type: 'checkbox',
                label: 'I agree to the Terms and Conditions',
                validation: validators.checkbox('Terms and Conditions'),
        },
]

export default function GuestSignUpForm() {
        return (
                <MainForm
                        fields={fields}
                        onSubmit={(values) => console.log(values)}
                        submitLabel='Proceed to Payment'
                        className='w-full'
                />
        )
}
