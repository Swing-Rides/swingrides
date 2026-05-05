'use client'

import MainForm from './MainForm'
import { validators } from './form.validators'
import { FormFieldConfig } from './types'
import { Mail, User } from 'lucide-react'
import { RegisterOptions } from 'react-hook-form'

const fields: FormFieldConfig[] = [
        {
                name: 'firstName',
                type: 'text',
                label: 'First Name',
                placeholder: 'John',
                icon: <User className='w-4 h-4' />,
                validation: validators.name('First name'),
                className: 'w-full',
        },
        {
                name: 'lastName',
                type: 'text',
                label: 'Last Name',
                placeholder: 'Smith',
                icon: <User className='w-4 h-4' />,
                validation: validators.name('Last name'),
                className: 'w-full',
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
                name: 'subject',
                type: 'text',
                label: 'Subject',
                placeholder: 'How can we help you?',
                validation: validators.required('Subject'),
        },
        {
                name: 'message',
                type: 'textarea',
                label: 'Message',
                placeholder: 'Tell us more about your question or issue',
                rows: 5,
                validation: {
                        ...validators.required('Message'),
                        ...validators.minLength(10, 'Message'),
                } as RegisterOptions,
        },
]

export default function ContactForm() {
        return (
                <MainForm
                        fields={fields}
                        onSubmit={(values) => console.log(values)}
                        submitLabel='Send Message'
                        className='w-full'
                        rowPairs={[['firstName', 'lastName']]}
                />
        )
}