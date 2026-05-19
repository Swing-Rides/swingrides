import MainForm from "@/components/forms/MainForm";
import { validators } from "@/components/forms/form.validators";
import { FormFieldConfig } from "@/components/forms/types";

const fields: FormFieldConfig[] = [
        {
                name: 'firstName',
                type: 'text',
                label: 'First Name',
                placeholder: 'Berry',
                validation: validators.name('First name'),
                className: 'w-full',
        },
        {
                name: 'lastName',
                type: 'text',
                label: 'Last Name',
                placeholder: 'Smith',
                validation: validators.name('Last name'),
                className: 'w-full',
        },
        {
                name: 'email',
                type: 'email',
                label: 'Email Address',
                placeholder: 'johnn@swingrides.ng',
                validation: validators.email(),
        },
        {
                name: 'role',
                type: 'select',
                label: 'Role',
                options: [
                        {
                                label: 'Admin',
                                value: 'admin',
                        },
                        {
                                label: 'Support',
                                value: 'support',
                        },
                ]
        }
]

export default function InviteNewAdminForm({ onSubmit }:{ onSubmit: (values: Record<string, unknown>) => void | Promise<void> }) {
        return (
                <MainForm 
                        fields={fields}
                        onSubmit={onSubmit}
                        submitLabel='Send Message'
                        className='w-full'
                        rowPairs={[['firstName', 'lastName']]}
                />
        )
}
