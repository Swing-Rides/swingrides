"use client"

import MainForm from "@/components/forms/MainForm";
import { validators } from "@/components/forms/form.validators";
import { FormFieldConfig } from "@/components/forms/types";
import PageWrapper from "../../dashboard/pageWrapper";
import { useChangeAdminPasswordMutation } from "@/app/store/services/adminApi";

const fields: FormFieldConfig[] = [
        {
                name: 'currentPassword',
                type: 'password',
                label: 'Current Password',
                placeholder: 'Enter your current password',
                validation: validators.required('Current password'),
                autoComplete: 'current-password',
                className: 'w-full',
        },
        {
                name: 'newPassword',
                type: 'password',
                label: 'New Password',
                placeholder: 'At least 8 characters',
                description: 'Must include an uppercase letter, a lowercase letter, a number and a special character.',
                validation: validators.password(),
                autoComplete: 'new-password',
                className: 'w-full',
        },
        {
                name: 'confirmPassword',
                type: 'password',
                label: 'Confirm New Password',
                placeholder: 'Re-enter your new password',
                validation: {
                        required: 'Please confirm your new password',
                        // react-hook-form passes the whole form's values as the
                        // second argument, which is how this reaches newPassword.
                        validate: (value: string, formValues: Record<string, unknown>) =>
                                value === formValues.newPassword || 'Passwords do not match',
                },
                autoComplete: 'new-password',
                className: 'w-full',
        },
]

export default function SecuritySettingsPageComponent() {
        const [changeAdminPassword, { isLoading }] = useChangeAdminPasswordMutation()

        const handleSubmit = async (values: Record<string, unknown>) => {
                try {
                        // confirmPassword is a client-side check only; the server
                        // never needs it.
                        await changeAdminPassword({
                                currentPassword: String(values.currentPassword),
                                newPassword: String(values.newPassword),
                        }).unwrap()
                } catch {
                        // adminApi's base query already raises a toast carrying the
                        // server's message ("Current password is incorrect", and so on),
                        // so there is nothing to add here.
                }
        }

        return (
                <PageWrapper
                        pageTitle='Security'
                        pageDescription='Change the password for your admin account'
                >
                        <div className="mt-4 md:mt-8 max-w-xl">
                                <p className="mb-6 text-sm text-slate-500 font-text">
                                        Changing your password signs you out everywhere else. This
                                        session stays active.
                                </p>
                                <MainForm
                                        fields={fields}
                                        onSubmit={handleSubmit}
                                        submitLabel='Update Password'
                                        isLoading={isLoading}
                                        className='w-full'
                                />
                        </div>
                </PageWrapper>
        )
}
