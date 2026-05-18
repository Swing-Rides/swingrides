'use client'

import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

type NotificationRow = {
        id: string
        label: string
}

type NotificationSettings = {
        email: boolean
        sms: boolean
}

type SettingsFormValues = {
        smsSenderName: string
        supportEmail: string
        notifications: Record<string, NotificationSettings>
}

const NOTIFICATION_ROWS: NotificationRow[] = [
        { id: 'newBooking', label: 'New Booking' },
        { id: 'paymentReceived', label: 'Payment Received' },
        { id: 'failedPayment', label: 'Failed Payment' },
        { id: 'newSubscriber', label: 'New Subscriber' },
        { id: 'disputeRaised', label: 'Dispute Raised' },
        { id: 'systemAlert', label: 'System Alert' },
]

const DEFAULT_NOTIFICATIONS = Object.fromEntries(
        NOTIFICATION_ROWS.map(row => [row.id, { email: false, sms: false }])
)

export default function AdminCommunicationSettingsForm() {
        const {
                register,
                handleSubmit,
                control,
                formState: { errors, isDirty, isSubmitting },
        } = useForm<SettingsFormValues>({
                mode: 'onTouched',
                defaultValues: {
                        smsSenderName: 'SwingRides',
                        supportEmail: 'support@swingrides.ng',
                        notifications: DEFAULT_NOTIFICATIONS,
                },
        })

        const onSubmit = (values: SettingsFormValues) => {
                console.log(values)
        }

        return (
                <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-6 w-full'
                        noValidate
                >
                        {/* ── Section 1: Platform defaults ─────────────────── */}
                        <div className='p-4 md:p-6 bg-white rounded-lg border border-gray-200'>
                                <div className='flex flex-col md:flex-row gap-5'>
                                        {/* SMS Sender Name */}
                                        <div className='flex flex-col gap-2 w-full'>
                                                <Label
                                                        htmlFor='smsSenderName'
                                                        className='text-gray-700 text-xs font-medium font-text leading-5'
                                                >
                                                        Default SMS Sender Name
                                                </Label>
                                                <Input
                                                        id='smsSenderName'
                                                        type='text'
                                                        placeholder='e.g. SwingRides'
                                                        className={cn(
                                                                'border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF]',
                                                                errors.smsSenderName && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                                        )}
                                                        {...register('smsSenderName', {
                                                                required: 'SMS sender name is required',
                                                                maxLength: {
                                                                        value: 11,
                                                                        message: 'SMS sender name cannot exceed 11 characters',
                                                                },
                                                        })}
                                                />
                                                {errors.smsSenderName && (
                                                        <FieldError message={errors.smsSenderName.message as string} />
                                                )}
                                                <span className='text-[#9CA3AF] text-xs font-normal font-text'>
                                                        Max 11 characters — carrier restriction.
                                                </span>
                                        </div>

                                        {/* Support Email */}
                                        <div className='flex flex-col gap-2 w-full'>
                                                <Label
                                                        htmlFor='supportEmail'
                                                        className='text-gray-700 text-xs font-medium font-text leading-5'
                                                >
                                                        Platform Support Email
                                                </Label>
                                                <Input
                                                        id='supportEmail'
                                                        type='email'
                                                        placeholder='e.g. support@swingrides.ng'
                                                        className={cn(
                                                                'border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF]',
                                                                errors.supportEmail && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                                        )}
                                                        {...register('supportEmail', {
                                                                required: 'Support email is required',
                                                                pattern: {
                                                                        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}$/i,
                                                                        message: 'Enter a valid email address',
                                                                },
                                                        })}
                                                />
                                                {errors.supportEmail && (
                                                        <FieldError message={errors.supportEmail.message as string} />
                                                )}
                                        </div>
                                </div>
                        </div>

                        {/* ── Section 2: Notification matrix ───────────────── */}
                        <div className='bg-white rounded-lg border border-gray-200 overflow-clip'>
                                {/* Table header */}
                                <div className='px-4 md:px-6 py-4 border-b border-[#E5E7EB]'>
                                        <h3 className='text-neutral-950 text-base font-semibold font-text leading-6'>
                                                Notification Preferences
                                        </h3>
                                </div>

                                {/* Column headings */}
                                <div className='grid grid-cols-[1fr_120px_120px] items-center px-4 md:px-6 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB]'>
                                        <span className='text-gray-700 text-xs font-semibold font-text leading-5'>
                                                Notification Type
                                        </span>
                                        <span className='text-gray-700 text-xs font-semibold font-text leading-5 text-center'>
                                                Email
                                        </span>
                                        <span className='text-gray-700 text-xs font-semibold font-text leading-5 text-center'>
                                                SMS
                                        </span>
                                </div>

                                {/* Notification rows */}
                                <div className='divide-y divide-[#E5E7EB]'>
                                        {NOTIFICATION_ROWS.map((row, index) => (
                                                <div
                                                        key={row.id}
                                                        className={cn(
                                                                'grid grid-cols-[1fr_120px_120px] items-center px-4 md:px-6 py-4 transition-colors duration-150',
                                                                index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                                                        )}
                                                >
                                                        <span className='justify-start text-neutral-950 text-sm font-medium font-text capitalize leading-5'>
                                                                {row.label}
                                                        </span>

                                                        {/* Email checkbox */}
                                                        <div className='flex justify-center'>
                                                                <Controller
                                                                        name={`notifications.${row.id}.email`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                                <Checkbox
                                                                                        id={`${row.id}-email`}
                                                                                        checked={!!field.value}
                                                                                        onCheckedChange={field.onChange}
                                                                                        className='border-[#D1D5DC] data-[state=checked]:bg-[#1A56DB] data-[state=checked]:border-[#1A56DB]'
                                                                                        aria-label={`${row.label} email notification`}
                                                                                />
                                                                        )}
                                                                />
                                                        </div>

                                                        {/* SMS checkbox */}
                                                        <div className='flex justify-center'>
                                                                <Controller
                                                                        name={`notifications.${row.id}.sms`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                                <Checkbox
                                                                                        id={`${row.id}-sms`}
                                                                                        checked={!!field.value}
                                                                                        onCheckedChange={field.onChange}
                                                                                        className='border-[#D1D5DC] data-[state=checked]:bg-[#1A56DB] data-[state=checked]:border-[#1A56DB]'
                                                                                        aria-label={`${row.label} SMS notification`}
                                                                                />
                                                                        )}
                                                                />
                                                        </div>
                                                </div>
                                        ))}
                                </div>
                        </div>

                        {/* ── Save button ───────────────────────────────────── */}
                        <div className='flex justify-end'>
                                <Button
                                        type='submit'
                                        disabled={!isDirty || isSubmitting}
                                        className='bg-blue-700 py-2 px-14.5 rounded-xs border border-blue-700 text-blue-100 cursor-pointer hover:bg-blue-950 hover:border-blue-950 duration-300 transition-colors disabled:opacity-50 disabled:pointer-events-none'
                                >
                                        {isSubmitting ? (
                                                <span className='flex items-center gap-2'>
                                                        <LoadingSpinner />
                                                        Saving...
                                                </span>
                                        ) : 'Save Changes'}
                                </Button>
                        </div>
                </form>
        )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FieldError = ({ message }: { message: string }) => (
        <span className='text-[#EF4444] text-xs font-normal font-text flex items-center gap-1'>
                <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M6 1L11 10H1L6 1Z' stroke='#EF4444' strokeWidth='1' strokeLinecap='round' strokeLinejoin='round' />
                        <path d='M6 5V7' stroke='#EF4444' strokeWidth='1' strokeLinecap='round' />
                        <circle cx='6' cy='8.5' r='0.5' fill='#EF4444' />
                </svg>
                {message}
        </span>
)

const LoadingSpinner = () => (
        <svg className='animate-spin w-4 h-4' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z' />
        </svg>
)