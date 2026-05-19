import MainForm from "@/components/forms/MainForm"
import { validators } from "@/components/forms/form.validators"
import { RegisterOptions } from "react-hook-form"

type EditAdminRoleFormProps = {
        firstName: string
        lastName: string
        email: string
        onSubmit: (values: Record<string, unknown>) => void | Promise<void>
}

export default function EditAdminRoleForm({ firstName, lastName, email, onSubmit }: EditAdminRoleFormProps) {
        return (
                <MainForm
                        fields={[
                                {
                                        name: 'firstName',
                                        type: 'text',
                                        label: 'First Name',
                                        validation: validators.name('First name') as RegisterOptions,
                                        className: 'w-full',
                                        defaultValue: firstName,  
                                        disabled: true,
                                },
                                {
                                        name: 'lastName',
                                        type: 'text',
                                        label: 'Last Name',
                                        validation: validators.name('Last name') as RegisterOptions,
                                        className: 'w-full',
                                        defaultValue: lastName, 
                                        disabled: true,
                                },
                                {
                                        name: 'email',
                                        type: 'email',
                                        label: 'Email Address',
                                        validation: validators.email() as RegisterOptions,
                                        defaultValue: email,
                                        disabled: true,
                                },
                                {
                                        name: 'role',
                                        type: 'select',
                                        label: 'Role',
                                        validation: validators.required('Role') as RegisterOptions,
                                        options: [
                                                { label: 'Admin', value: 'admin' },
                                                { label: 'Support', value: 'support' },
                                        ],
                                },
                        ]}
                        onSubmit={onSubmit}
                        submitLabel='Save Changes'
                        className='w-full'
                        rowPairs={[['firstName', 'lastName']]}
                />
        )
}