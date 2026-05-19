'use client'

import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FieldSeparator } from '@/components/ui/field'
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// ─── All IANA timezones ───────────────────────────────────────────────────────
const TIMEZONES = Intl.supportedValuesOf('timeZone')

// ─── Types ────────────────────────────────────────────────────────────────────
type PlanKey = 'starter' | 'professional' | 'enterprise'

type PlanLimits = {
        maxVehicles: number | ''
        monthlyPrice: number | ''
}

export type SystemSettingsFormValues = {
        defaultTaxRate: number | ''
        platformCurrency: string
        globalTimezone: string
        minBookingDuration: number | ''
        maxBookingDuration: number | ''
        cancellationPolicyWindow: number | ''
        plans: Record<PlanKey, PlanLimits>
}

type SystemSettingsFormProps = {
        defaultValues?: Partial<SystemSettingsFormValues>
        onSubmit: (values: SystemSettingsFormValues) => void | Promise<void>
}

const PLANS: { key: PlanKey; label: string }[] = [
        { key: 'starter', label: 'Starter' },
        { key: 'professional', label: 'Professional' },
        { key: 'enterprise', label: 'Enterprise' },
]

const FALLBACK_DEFAULTS: SystemSettingsFormValues = {
        defaultTaxRate: '',
        platformCurrency: 'USD $',
        globalTimezone: 'America/New_York',
        minBookingDuration: '',
        maxBookingDuration: '',
        cancellationPolicyWindow: '',
        plans: {
                starter: { maxVehicles: '', monthlyPrice: '' },
                professional: { maxVehicles: '', monthlyPrice: '' },
                enterprise: { maxVehicles: '', monthlyPrice: '' },
        },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SystemSettingsForm({ defaultValues, onSubmit }: SystemSettingsFormProps) {

        const {
                register,
                handleSubmit,
                control,
                formState: { errors, isDirty, isSubmitting },
        } = useForm<SystemSettingsFormValues>({
                mode: 'onTouched',
                defaultValues: {
                        ...FALLBACK_DEFAULTS,
                        ...defaultValues,
                        plans: {
                                ...FALLBACK_DEFAULTS.plans,
                                ...defaultValues?.plans,
                        },
                },
        })

        return (
                <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-6 w-full'
                        noValidate
                >
                        {/* ── Section 1: General settings ──────────────────── */}
                        <div className='p-4 md:p-6 bg-white rounded-[10px] border border-[#E5E7EB] flex flex-col gap-4'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        {/* 1. Default Tax Rate */}
                                        <FormRow
                                                label='Default Tax Rate (%)'
                                                htmlFor='defaultTaxRate'
                                                error={errors.defaultTaxRate?.message}
                                        >
                                                <Input
                                                        id='defaultTaxRate'
                                                        type='number'
                                                        placeholder='e.g. 7.5'
                                                        min={0}
                                                        max={100}
                                                        step={0.1}
                                                        className={inputCn(!!errors.defaultTaxRate)}
                                                        {...register('defaultTaxRate', {
                                                                min: { value: 0, message: 'Tax rate cannot be negative' },
                                                                max: { value: 100, message: 'Tax rate cannot exceed 100%' },
                                                                valueAsNumber: true,
                                                        })}
                                                />
                                        </FormRow>

                                        {/* 2. Platform Currency — disabled */}
                                        <FormRow
                                                label='Platform Currency'
                                                htmlFor='platformCurrency'
                                                description='Feature presently disabled'
                                        >
                                                <Input
                                                        id='platformCurrency'
                                                        type='text'
                                                        placeholder='USD $'
                                                        disabled
                                                        className={cn(inputCn(false), 'cursor-not-allowed opacity-60')}
                                                        {...register('platformCurrency')}
                                                />
                                        </FormRow>

                                        {/* 3. Global Timezone */}
                                        <FormRow
                                                label='Global Timezone'
                                                htmlFor='globalTimezone'
                                                error={errors.globalTimezone?.message}
                                        >
                                                <Controller
                                                        name='globalTimezone'
                                                        control={control}
                                                        rules={{ required: 'Timezone is required' }}
                                                        render={({ field }) => (
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                        <SelectTrigger
                                                                                id='globalTimezone'
                                                                                className={inputCn(!!errors.globalTimezone)}
                                                                        >
                                                                                <SelectValue placeholder='Select a timezone' />
                                                                        </SelectTrigger>
                                                                        <SelectContent className='max-h-72'>
                                                                                {TIMEZONES.map(tz => (
                                                                                        <SelectItem
                                                                                                key={tz}
                                                                                                value={tz}
                                                                                                className='font-text text-sm'
                                                                                        >
                                                                                                {tz}
                                                                                        </SelectItem>
                                                                                ))}
                                                                        </SelectContent>
                                                                </Select>
                                                        )}
                                                />
                                        </FormRow>

                                        {/* 4. Minimum Booking Duration */}
                                        <FormRow
                                                label='Minimum Booking Duration'
                                                htmlFor='minBookingDuration'
                                                error={errors.minBookingDuration?.message}
                                        >
                                                <SuffixInput
                                                        id='minBookingDuration'
                                                        suffix='day(s)'
                                                        placeholder='e.g. 1'
                                                        hasError={!!errors.minBookingDuration}
                                                        {...register('minBookingDuration', {
                                                                min: { value: 1, message: 'Minimum is 1 day' },
                                                                valueAsNumber: true,
                                                        })}
                                                />
                                        </FormRow>

                                        {/* 5. Maximum Booking Duration */}
                                        <FormRow
                                                label='Maximum Booking Duration'
                                                htmlFor='maxBookingDuration'
                                                error={errors.maxBookingDuration?.message}
                                        >
                                                <SuffixInput
                                                        id='maxBookingDuration'
                                                        suffix='day(s)'
                                                        placeholder='e.g. 30'
                                                        hasError={!!errors.maxBookingDuration}
                                                        {...register('maxBookingDuration', {
                                                                min: { value: 1, message: 'Minimum is 1 day' },
                                                                valueAsNumber: true,
                                                        })}
                                                />
                                        </FormRow>

                                        {/* 6. Cancellation Policy Window */}
                                        <FormRow
                                                label='Cancellation Policy Window'
                                                htmlFor='cancellationPolicyWindow'
                                                error={errors.cancellationPolicyWindow?.message}
                                        >
                                                <SuffixInput
                                                        id='cancellationPolicyWindow'
                                                        suffix='hours before pickup'
                                                        placeholder='e.g. 24'
                                                        hasError={!!errors.cancellationPolicyWindow}
                                                        {...register('cancellationPolicyWindow', {
                                                                min: { value: 1, message: 'Minimum is 1 hour' },
                                                                valueAsNumber: true,
                                                        })}
                                                />
                                        </FormRow>
                                </div>
                        </div>

                        {/* ── Section 2: Subscription plan limits ──────────── */}
                        <div className='flex flex-col gap-4'>
                                <div>
                                        <h3 className='text-[#1F2937] text-base font-semibold font-text leading-6'>
                                                Subscription Plan Limits
                                        </h3>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                        {PLANS.map(({ key, label }) => (
                                                <div
                                                        key={key}
                                                        className='flex flex-col gap-4 p-4 bg-white border border-[#E5E7EB] rounded-[10px]'
                                                >
                                                        {/* Pill */}
                                                        <span className='self-start px-3 py-1 rounded-full text-xs font-semibold font-text text-blue-700 bg-indigo-50'>
                                                                {label}
                                                        </span>

                                                        {/* Max Vehicles */}
                                                        <FormRow
                                                                label='Max Vehicles'
                                                                htmlFor={`plans.${key}.maxVehicles`}
                                                                error={(errors.plans?.[key]?.maxVehicles as { message?: string } | undefined)?.message}
                                                        >
                                                                <Input
                                                                        id={`plans.${key}.maxVehicles`}
                                                                        type='number'
                                                                        placeholder='e.g. 10'
                                                                        min={1}
                                                                        className={inputCn(!!errors.plans?.[key]?.maxVehicles)}
                                                                        {...register(`plans.${key}.maxVehicles` as const, {
                                                                                min: { value: 1, message: 'Must be at least 1' },
                                                                                valueAsNumber: true,
                                                                        })}
                                                                />
                                                        </FormRow>

                                                        {/* Monthly Price */}
                                                        <FormRow
                                                                label='Monthly Price'
                                                                htmlFor={`plans.${key}.monthlyPrice`}
                                                                error={(errors.plans?.[key]?.monthlyPrice as { message?: string } | undefined)?.message}
                                                        >
                                                                <div className='relative flex items-center'>
                                                                        <span className='absolute left-3 text-[#6B7280] text-sm font-medium font-text pointer-events-none select-none'>
                                                                                $
                                                                        </span>
                                                                        <Input
                                                                                id={`plans.${key}.monthlyPrice`}
                                                                                type='number'
                                                                                placeholder='0.00'
                                                                                min={0}
                                                                                step={0.01}
                                                                                className={cn(inputCn(!!errors.plans?.[key]?.monthlyPrice), 'pl-7')}
                                                                                {...register(`plans.${key}.monthlyPrice` as const, {
                                                                                        min: { value: 0, message: 'Price cannot be negative' },
                                                                                        valueAsNumber: true,
                                                                                })}
                                                                        />
                                                                </div>
                                                        </FormRow>
                                                </div>
                                        ))}
                                </div>
                        </div>

                        {/* ── Save button ───────────────────────────────────── */}
                        <div className='flex justify-end'>
                                <Button
                                        type='submit'
                                        disabled={!isDirty || isSubmitting}
                                        className='px-14.5 py-3.75 rounded-xs bg-blue-700 hover:bg-blue-900 text-white font-semibold font-text cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none'
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

// ─── Suffix input (day(s) / hours before pickup) ──────────────────────────────

type SuffixInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
        suffix: string
        hasError?: boolean
}

const SuffixInput = ({ suffix, hasError, ...props }: SuffixInputProps) => (
        <div className='flex items-center gap-2'>
                <Input
                        type='number'
                        className={cn(inputCn(!!hasError), 'w-28 shrink-0')}
                        {...props}
                />
                <span className='text-[#6B7280] text-sm font-normal font-text text-nowrap'>
                        {suffix}
                </span>
        </div>
)

// ─── Reusable form row ────────────────────────────────────────────────────────

type FormRowProps = {
        label: string
        htmlFor: string
        description?: string
        error?: string
        children: React.ReactNode
}

const FormRow = ({ label, htmlFor, description, error, children }: FormRowProps) => (
        <div className='flex flex-col gap-1.5'>
                <Label htmlFor={htmlFor} className='text-gray-500 text-xs font-medium font-text uppercase'>
                        {label}
                </Label>
                {children}
                {description && !error && (
                        <span className='text-[#9CA3AF] text-xs font-normal font-text'>{description}</span>
                )}
                {error && (
                        <span className='text-[#EF4444] text-xs font-normal font-text flex items-center gap-1'>
                                <ErrorIcon />
                                {error}
                        </span>
                )}
        </div>
)

// ─── Shared input class helper ────────────────────────────────────────────────

const inputCn = (hasError: boolean) => cn(
        'border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] w-full',
        hasError && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
)

// ─── Icons ────────────────────────────────────────────────────────────────────

const ErrorIcon = () => (
        <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M6 1L11 10H1L6 1Z' stroke='#EF4444' strokeWidth='1' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M6 5V7' stroke='#EF4444' strokeWidth='1' strokeLinecap='round' />
                <circle cx='6' cy='8.5' r='0.5' fill='#EF4444' />
        </svg>
)

const LoadingSpinner = () => (
        <svg className='animate-spin w-4 h-4' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z' />
        </svg>
)