'use client'

import { useState, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import Image from 'next/image'
import { Upload, Mail, User, Phone, Building2, MapPin, AlertTriangle, Loader2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { validators } from '@/components/forms/form.validators'
import { RegisterOptions } from 'react-hook-form'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProfileCompanyFormValues = {
        profilePhoto?: FileList
        firstName: string
        lastName: string
        phoneNumber: string
        email: string
        oldPassword: string
        newPassword: string
        companyName: string
        address: string
        city: string
        postalCode: string
}

type ProfileCompanyFormProps = {
        defaultValues: ProfileCompanyFormValues   // fetched from server by parent
        currentPhotoUrl?: string                  // existing profile photo URL from server
        onSubmit: (values: ProfileCompanyFormValues) => void | Promise<void>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (firstName?: string, lastName?: string) => {
        const first = firstName?.trim()[0]?.toUpperCase() ?? ''
        const last = lastName?.trim()[0]?.toUpperCase() ?? ''
        return `${first}${last}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileCompanyForm({
        defaultValues,
        currentPhotoUrl,
        onSubmit,
}: ProfileCompanyFormProps) {
        const [photoPreview, setPhotoPreview] = useState<string | null>(currentPhotoUrl ?? null)
        const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
        const photoInputRef = useRef<HTMLInputElement | null>(null)

        const {
                register,
                handleSubmit,
                control,
                formState: { errors, isDirty, isSubmitting },
        } = useForm<ProfileCompanyFormValues>({
                mode: 'onTouched',
                defaultValues,
        })

        const firstName = useWatch({ control, name: 'firstName' })
        const lastName = useWatch({ control, name: 'lastName' })

        const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0]
                if (!file) return
                setPhotoPreview(URL.createObjectURL(file))
        }

        const onFormSubmit = async (values: ProfileCompanyFormValues) => {
                await onSubmit(values)
        }

        return (
                <>
                        <form
                                onSubmit={handleSubmit(onFormSubmit)}
                                className='flex flex-col gap-6 w-full'
                                noValidate
                        >
                                {/* ── 1. Profile Picture ────────────────────── */}
                                <Section title='Profile Picture'>
                                        <div className='flex items-center gap-5'>
                                                <div className='relative size-20 rounded-full overflow-clip shrink-0'>
                                                        {photoPreview ? (
                                                                <Image
                                                                        src={photoPreview}
                                                                        alt={`${firstName} ${lastName}`.trim() || 'Profile photo'}
                                                                        fill
                                                                        className='object-cover object-center'
                                                                />
                                                        ) : (
                                                                <div className='flex items-center justify-center size-full bg-blue-700 text-white text-2xl font-bold font-text uppercase'>
                                                                        {getInitials(firstName, lastName) || '?'}
                                                                </div>
                                                        )}
                                                </div>

                                                <label
                                                        htmlFor='profilePhoto'
                                                        className='flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-xs text-[#1F2937] text-sm font-medium font-text cursor-pointer hover:bg-[#F3F4F6] transition-colors duration-200'
                                                >
                                                        <Upload className='w-4 h-4' />
                                                        Upload Photo
                                                        <input
                                                                id='profilePhoto'
                                                                type='file'
                                                                accept='image/png, image/jpeg'
                                                                className='hidden'
                                                                {...register('profilePhoto')}
                                                                ref={(e) => {
                                                                        register('profilePhoto').ref(e)
                                                                        photoInputRef.current = e
                                                                }}
                                                                onChange={handlePhotoChange}
                                                        />
                                                </label>
                                        </div>
                                </Section>

                                {/* ── 2. Personal Information ───────────────── */}
                                <Section title='Personal Information'>
                                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
                                                <FormRow label='First Name' htmlFor='firstName' error={errors.firstName?.message}>
                                                        <IconInput
                                                                id='firstName'
                                                                icon={<User className='w-4 h-4' />}
                                                                placeholder='John'
                                                                hasError={!!errors.firstName}
                                                                {...register('firstName', validators.name('First name') as RegisterOptions<ProfileCompanyFormValues, 'firstName'>)}
                                                        />
                                                </FormRow>

                                                <FormRow label='Last Name' htmlFor='lastName' error={errors.lastName?.message}>
                                                        <IconInput
                                                                id='lastName'
                                                                icon={<User className='w-4 h-4' />}
                                                                placeholder='Smith'
                                                                hasError={!!errors.lastName}
                                                                {...register('lastName', validators.name('Last name') as RegisterOptions<ProfileCompanyFormValues, 'lastName'>)}
                                                        />
                                                </FormRow>

                                                <FormRow label='Phone Number' htmlFor='phoneNumber' error={errors.phoneNumber?.message}>
                                                        <IconInput
                                                                id='phoneNumber'
                                                                type='tel'
                                                                icon={<Phone className='w-4 h-4' />}
                                                                placeholder='+1 555-123-4567'
                                                                hasError={!!errors.phoneNumber}
                                                                {...register('phoneNumber', validators.phone() as RegisterOptions<ProfileCompanyFormValues, 'phoneNumber'>)}
                                                        />
                                                </FormRow>

                                                <FormRow label='Email Address' htmlFor='email' description="Email can't be changed.">
                                                        <IconInput
                                                                id='email'
                                                                type='email'
                                                                icon={<Mail className='w-4 h-4' />}
                                                                disabled
                                                                className='cursor-not-allowed opacity-60'
                                                                {...register('email')}
                                                        />
                                                </FormRow>
                                        </div>
                                </Section>

                                {/* ── 3. Password ───────────────────────────── */}
                                <Section title='Password'>
                                        <div className='flex flex-col md:flex-row md:items-end gap-4 w-full'>
                                                <FormRow label='Old Password' htmlFor='oldPassword' className='w-full'>
                                                        <Input
                                                                id='oldPassword'
                                                                type='password'
                                                                placeholder='••••••••'
                                                                className={inputCn(false)}
                                                                {...register('oldPassword')}
                                                        />
                                                </FormRow>

                                                <FormRow label='New Password' htmlFor='newPassword' className='w-full'>
                                                        <Input
                                                                id='newPassword'
                                                                type='password'
                                                                placeholder='••••••••'
                                                                className={inputCn(false)}
                                                                {...register('newPassword')}
                                                        />
                                                </FormRow>

                                                <Button
                                                        type='button'
                                                        onClick={() => setResetPasswordOpen(true)}
                                                        variant='outline'
                                                        className='border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] font-medium font-text cursor-pointer transition-colors duration-200 w-full md:w-auto text-nowrap shrink-0'
                                                >
                                                        Reset Password
                                                </Button>
                                        </div>
                                </Section>

                                {/* ── 4. Company Information ────────────────── */}
                                <Section title='Company Information'>
                                        <FormRow label='Company Name' htmlFor='companyName' description="Company name can't be changed." className='w-full'>
                                                <IconInput
                                                        id='companyName'
                                                        icon={<Building2 className='w-4 h-4' />}
                                                        disabled
                                                        className='cursor-not-allowed opacity-60'
                                                        {...register('companyName')}
                                                />
                                        </FormRow>

                                        <FormRow label='Address' htmlFor='address' error={errors.address?.message} className='w-full'>
                                                <IconInput
                                                        id='address'
                                                        icon={<MapPin className='w-4 h-4' />}
                                                        placeholder='123 Main Street'
                                                        hasError={!!errors.address}
                                                        {...register('address', { required: 'Address is required' })}
                                                />
                                        </FormRow>

                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
                                                <FormRow label='City' htmlFor='city' error={errors.city?.message}>
                                                        <Input
                                                                id='city'
                                                                type='text'
                                                                placeholder='Austin'
                                                                className={inputCn(!!errors.city)}
                                                                {...register('city', { required: 'City is required' })}
                                                        />
                                                </FormRow>

                                                <FormRow label='Postal Code' htmlFor='postalCode' error={errors.postalCode?.message}>
                                                        <Input
                                                                id='postalCode'
                                                                type='text'
                                                                placeholder='73301'
                                                                className={inputCn(!!errors.postalCode)}
                                                                {...register('postalCode', { required: 'Postal code is required' })}
                                                        />
                                                </FormRow>
                                        </div>
                                </Section>

                                {/* ── Save button ───────────────────────────── */}
                                <div className='flex justify-end'>
                                        <Button
                                                type='submit'
                                                disabled={!isDirty || isSubmitting}
                                                className='bg-blue-700 hover:bg-blue-900 text-white font-medium font-text cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none'
                                        >
                                                {isSubmitting ? (
                                                        <span className='flex items-center gap-2'>
                                                                <Loader2 className='animate-spin w-4 h-4' />
                                                                Saving...
                                                        </span>
                                                ) : 'Save Changes'}
                                        </Button>
                                </div>
                        </form>

                        {/* Reset password dialog */}
                        {resetPasswordOpen && (
                                <ResetPasswordDialog onClose={() => setResetPasswordOpen(false)} />
                        )}
                </>
        )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className='p-4 md:p-6 bg-white rounded-[10px] border border-gray-200 flex flex-col justify-start items-start gap-6 w-full'>
                <h3 className='text-neutral-950 text-base font-semibold font-text leading-6'>
                        {title}
                </h3>
                {children}
        </div>
)

// ─── Form row ─────────────────────────────────────────────────────────────────

type FormRowProps = {
        label: string
        htmlFor: string
        description?: string
        error?: string
        className?: string
        children: React.ReactNode
}

const FormRow = ({ label, htmlFor, description, error, className, children }: FormRowProps) => (
        <div className={cn('flex flex-col gap-2', className)}>
                <Label htmlFor={htmlFor} className='text-gray-500 text-xs font-semibold font-text uppercase leading-4'>
                        {label}
                </Label>
                {children}
                {description && !error && (
                        <span className='text-[#9CA3AF] text-xs font-normal font-text'>{description}</span>
                )}
                {error && (
                        <span className='text-[#EF4444] text-xs font-normal font-text flex items-center gap-1'>
                                <AlertTriangle className='w-3 h-3 shrink-0' />
                                {error}
                        </span>
                )}
        </div>
)

// ─── Icon input ───────────────────────────────────────────────────────────────

const IconInput = ({
        icon,
        hasError,
        className,
        ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode; hasError?: boolean }) => (
        <div className='relative flex items-center'>
                <span className='absolute left-3 text-[#9CA3AF] pointer-events-none'>
                        {icon}
                </span>
                <Input
                        className={cn(inputCn(!!hasError), 'pl-9', className)}
                        {...props}
                />
        </div>
)

// ─── Shared input class helper ────────────────────────────────────────────────

const inputCn = (hasError: boolean) => cn(
        'rounded-xs border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] w-full',
        hasError && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
)

// ─── Reset password dialog ────────────────────────────────────────────────────

type ResetPasswordFormValues = {
        resetEmail: string
}

const ResetPasswordDialog = ({ onClose }: { onClose: () => void }) => {
        const {
                register,
                handleSubmit,
                formState: { errors, isSubmitting },
        } = useForm<ResetPasswordFormValues>({ mode: 'onTouched' })

        const onSubmit = (values: ResetPasswordFormValues) => {
                console.log('reset password for:', values.resetEmail)
                onClose()
        }

        return (
                <div
                        className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'
                        onClick={onClose}
                >
                        <div
                                className='w-full max-w-md bg-white rounded-[10px] border border-[#E5E7EB] p-6 flex flex-col gap-5'
                                onClick={(e) => e.stopPropagation()}
                        >
                                <div className='flex items-start justify-between gap-4'>
                                        <div className='flex flex-col gap-1'>
                                                <h3 className='text-[#1F2937] text-lg font-bold font-text leading-6'>
                                                        Reset your password
                                                </h3>
                                                <span className='text-[#6B7280] text-sm font-normal font-text leading-5'>
                                                        Enter your email and we&apos;ll send you a reset link.
                                                </span>
                                        </div>
                                        <button
                                                type='button'
                                                onClick={onClose}
                                                aria-label='Close'
                                                className='text-[#6B7280] hover:text-[#1F2937] transition-colors duration-150 cursor-pointer shrink-0'
                                        >
                                                <X className='w-5 h-5' />
                                        </button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4' noValidate>
                                        <FormRow label='Email Address' htmlFor='resetEmail' error={errors.resetEmail?.message}>
                                                <IconInput
                                                        id='resetEmail'
                                                        type='email'
                                                        icon={<Mail className='w-4 h-4' />}
                                                        placeholder='john@company.com'
                                                        autoComplete='email'
                                                        hasError={!!errors.resetEmail}
                                                        {...register('resetEmail', validators.email() as RegisterOptions<ResetPasswordFormValues, 'resetEmail'>)}
                                                />
                                        </FormRow>

                                        <div className='flex gap-3 justify-end pt-1'>
                                                <Button
                                                        type='button'
                                                        variant='outline'
                                                        onClick={onClose}
                                                        className='border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] font-medium font-text cursor-pointer transition-colors duration-200'
                                                >
                                                        Cancel
                                                </Button>
                                                <Button
                                                        type='submit'
                                                        disabled={isSubmitting}
                                                        className='bg-[#1A56DB] hover:bg-[#1E429F] text-white font-medium font-text cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none'
                                                >
                                                        {isSubmitting ? (
                                                                <span className='flex items-center gap-2'>
                                                                        <Loader2 className='animate-spin w-4 h-4' />
                                                                        Sending...
                                                                </span>
                                                        ) : 'Send Reset Link'}
                                                </Button>
                                        </div>
                                </form>
                        </div>
                </div>
        )
}