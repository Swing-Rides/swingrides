"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import MainForm from "@/components/forms/MainForm";
import { validators } from "@/components/forms/form.validators";
import { FormFieldConfig } from "@/components/forms/types";
import PageWrapper from "../../dashboard/pageWrapper";
import { useChangeAdminPasswordMutation } from "@/app/store/services/adminApi";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
        const [isSuccessOpen, setIsSuccessOpen] = useState(false)
        const [formKey, setFormKey] = useState(0)

        const handleSubmit = async (values: Record<string, unknown>) => {
                try {
                        // confirmPassword is a client-side check only; the server
                        // never needs it.
                        await changeAdminPassword({
                                currentPassword: String(values.currentPassword),
                                newPassword: String(values.newPassword),
                        }).unwrap()
                        setFormKey((prev) => prev + 1)
                        setIsSuccessOpen(true)
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
                                        key={formKey}
                                        fields={fields}
                                        onSubmit={handleSubmit}
                                        submitLabel='Update Password'
                                        isLoading={isLoading}
                                        className='w-full'
                                />
                        </div>

                        <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                                <DialogContent className="sm:max-w-md p-6">
                                        <div className="flex flex-col items-center text-center gap-4 pt-2">
                                                <div className="size-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                        <CheckCircle2 className="size-6" />
                                                </div>
                                                <DialogHeader className="gap-2 text-center sm:text-center">
                                                        <DialogTitle className="text-lg md:text-xl font-semibold font-text text-neutral-950 text-center">
                                                                Password Changed Successfully
                                                        </DialogTitle>
                                                        <DialogDescription className="text-sm text-gray-500 font-text text-center">
                                                                Your admin password has been updated. You have been signed out of other active sessions. You can now return to the admin dashboard.
                                                        </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter className="w-full mt-2 sm:justify-center">
                                                        <Button
                                                                asChild
                                                                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium font-text py-2.5 rounded-xs cursor-pointer transition-colors"
                                                        >
                                                                <Link href="/admin">
                                                                        Go to Admin Dashboard
                                                                </Link>
                                                        </Button>
                                                </DialogFooter>
                                        </div>
                                </DialogContent>
                        </Dialog>
                </PageWrapper>
        )
}
