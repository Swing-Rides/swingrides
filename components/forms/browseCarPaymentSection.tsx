'use client'

import { memo, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format, addDays, differenceInCalendarDays } from 'date-fns'
import { Shield, CalendarIcon, AlertTriangle, Loader2 } from 'lucide-react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
        Popover,
        PopoverContent,
        PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentFormValues = {
        pickupDate: string
        returnDate: string
        pickupLocation: string
        // Insurance — all optional but cross-validated
        insuranceProvider: string
        policyNumber: string
        insuranceExpiry: string
        hostProvidingCoverage: boolean
        // Terms
        agreedToTerms: boolean
}

type PriceConfig = {
        daily: number
        weekly: number
        monthly: number
}

type PaymentSectionProps = {
        price: PriceConfig
        defaultPickupLocation?: string
        onSubmit: (values: PaymentFormValues) => void | Promise<void>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
        amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const pluralize = (n: number, word: string) => `${n} ${word}${n !== 1 ? 's' : ''}`

const getPricingTier = (days: number): { unit: 'day' | 'week' | 'month'; unitPrice: number; units: number } => {
        if (days < 7) return { unit: 'day', unitPrice: 0, units: days }
        if (days < 30) return { unit: 'week', unitPrice: 0, units: Math.ceil(days / 7) }
        return { unit: 'month', unitPrice: 0, units: Math.ceil(days / 30) }
}

const THIRTY_DAYS_FROM_NOW = addDays(new Date(), 30)

// ─── Component ────────────────────────────────────────────────────────────────

export const PaymentSection = memo(({
        price,
        defaultPickupLocation = '',
        onSubmit,
}: PaymentSectionProps) => {
        const today = useMemo(() => {
                const d = new Date()
                d.setHours(0, 0, 0, 0)
                return d
        }, [])

        const {
                register,
                handleSubmit,
                control,
                setValue,
                formState: { errors, isSubmitting },
        } = useForm<PaymentFormValues>({
                mode: 'onTouched',
                defaultValues: {
                        pickupDate: '',
                        returnDate: '',
                        pickupLocation: defaultPickupLocation,
                        insuranceProvider: '',
                        policyNumber: '',
                        insuranceExpiry: '',
                        hostProvidingCoverage: true,
                        agreedToTerms: false,
                },
        })

        // Live reactive values for UI derivation — no useEffect
        const pickupDate = useWatch({ control, name: 'pickupDate' })
        const returnDate = useWatch({ control, name: 'returnDate' })
        const insuranceProvider = useWatch({ control, name: 'insuranceProvider' })
        const policyNumber = useWatch({ control, name: 'policyNumber' })
        const insuranceExpiry = useWatch({ control, name: 'insuranceExpiry' })
        const hostProvidingCoverage = useWatch({ control, name: 'hostProvidingCoverage' })

        // Whether the user has started filling insurance fields
        const hasInsuranceInput = !!(insuranceProvider || policyNumber || insuranceExpiry)
        // If they've entered insurance, unmark host coverage automatically
        const effectiveHostCoverage = hasInsuranceInput ? false : hostProvidingCoverage

        // Keep the checkbox in sync when insurance is filled in
        const handleInsuranceChange = () => {
                if (hasInsuranceInput && hostProvidingCoverage) {
                        setValue('hostProvidingCoverage', false, { shouldValidate: false })
                }
        }

        // ─ Derived pricing ──────────────────────────────────────────────
        const days = pickupDate && returnDate
                ? Math.max(differenceInCalendarDays(new Date(returnDate), new Date(pickupDate)), 0)
                : 0

        const tier = getPricingTier(days)
        let displayPrice: number
        let displayPriceTier: string

        if (days === 0) {
                displayPrice = price.daily
                displayPriceTier = 'day'
        } else if (tier.unit === 'day') {
                displayPrice = price.daily
                displayPriceTier = 'day'
        } else if (tier.unit === 'week') {
                displayPrice = price.weekly
                displayPriceTier = 'week'
        } else {
                displayPrice = price.monthly
                displayPriceTier = 'month'
        }

        const totalPrice = days > 0 ? displayPrice * tier.units : null

        const enteredPickUpDate = pickupDate ? format(new Date(pickupDate), 'MMM d') : null
        const enteredReturnDate = returnDate ? format(new Date(returnDate), 'MMM d') : null

        const onFormSubmit = async (values: PaymentFormValues) => {
                // Sync effectiveHostCoverage back into the payload before sending
                await onSubmit({ ...values, hostProvidingCoverage: effectiveHostCoverage })
        }

        return (
                <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-6' noValidate>

                        {/* ── Main booking card ───────────────────────────── */}
                        <div className='flex flex-col gap-5 p-4 md:p-6 rounded-[10px] border border-gray-200 bg-white'>

                                {/* Price display */}
                                <div className='flex flex-col gap-2'>
                                        <div>
                                                <span className='text-blue-700 text-3xl font-medium font-text leading-12'>
                                                        {formatCurrency(displayPrice)}
                                                </span>
                                                <span className='text-gray-500 text-base font-normal font-text leading-6'>
                                                        /{displayPriceTier}
                                                </span>
                                        </div>
                                        {totalPrice !== null && (
                                                <span className='text-neutral-950 text-sm font-semibold font-text leading-5'>
                                                        Total: {formatCurrency(totalPrice)} for {pluralize(days, 'day')}
                                                </span>
                                        )}
                                </div>

                                {/* ── Form fields ─────────────────────────── */}
                                <div className='flex flex-col gap-4'>

                                        {/* Row 1: Pickup + Return dates */}
                                        <div className='grid grid-cols-2 gap-3'>
                                                <FormRow
                                                        label='Pick-up Date'
                                                        htmlFor='pickupDate'
                                                        error={errors.pickupDate?.message}
                                                >
                                                        <DatePickerField
                                                                name='pickupDate'
                                                                control={control}
                                                                placeholder='Pick a date'
                                                                error={errors.pickupDate?.message}
                                                                rules={{ required: 'Pick-up date is required' }}
                                                                minDate={today}
                                                        />
                                                </FormRow>

                                                <FormRow
                                                        label='Return Date'
                                                        htmlFor='returnDate'
                                                        error={errors.returnDate?.message}
                                                >
                                                        <DatePickerField
                                                                name='returnDate'
                                                                control={control}
                                                                placeholder='Pick a date'
                                                                error={errors.returnDate?.message}
                                                                minDate={pickupDate ? addDays(new Date(pickupDate), 1) : today}
                                                                rules={{
                                                                        required: 'Return date is required',
                                                                        validate: (value: string) => {
                                                                                if (!pickupDate || !value) return true
                                                                                return new Date(value) > new Date(pickupDate)
                                                                                        || 'Must be after pick-up date'
                                                                        },
                                                                }}
                                                        />
                                                </FormRow>
                                        </div>

                                        {/* Row 2: Pickup Location */}
                                        <FormRow
                                                label='Pick-up Location'
                                                htmlFor='pickupLocation'
                                                error={errors.pickupLocation?.message}
                                        >
                                                <Input
                                                        id='pickupLocation'
                                                        type='text'
                                                        placeholder='Enter pickup address'
                                                        className={inputCn(!!errors.pickupLocation)}
                                                        {...register('pickupLocation', { required: 'Pick-up location is required' })}
                                                />
                                        </FormRow>
                                </div>

                                {/* Date range summary pill */}
                                {enteredPickUpDate && enteredReturnDate && days > 0 && (
                                        <div className='bg-[#EBF0FB] rounded-[10px] p-2.5 md:p-3'>
                                                <span className='text-blue-700 text-sm font-medium font-text leading-5'>
                                                        {pluralize(days, 'day')}
                                                </span>
                                                {' '}
                                                <span className='text-blue-700 text-sm font-medium font-text leading-5'>
                                                        · {enteredPickUpDate} - {enteredReturnDate}
                                                </span>
                                        </div>
                                )}

                                {/* Price breakdown */}
                                {totalPrice !== null && (
                                        <div className='flex flex-col gap-3 pb-6.25 border-b border-b-[#E5E7EB]'>
                                                <div className='flex justify-between gap-4'>
                                                        <span className='text-[#6B7280] text-sm font-normal font-text leading-5'>
                                                                {formatCurrency(displayPrice)} x {pluralize(days, 'day')}
                                                        </span>
                                                        <span className='text-[#1F2937] text-sm font-medium font-text'>
                                                                {formatCurrency(totalPrice)}
                                                        </span>
                                                </div>
                                        </div>
                                )}

                                {/* Total estimate */}
                                <div className='flex justify-between items-center'>
                                        <span className='text-[#0B0B0B] text-base font-bold font-text leading-6'>
                                                Total Estimate
                                        </span>
                                        <span className='text-[#1A56DB] text-xl font-medium font-text leading-7'>
                                                {totalPrice !== null ? formatCurrency(totalPrice) : '—'}
                                        </span>
                                </div>

                                {/* Terms checkbox */}
                                <Controller
                                        name='agreedToTerms'
                                        control={control}
                                        rules={{
                                                validate: (value) =>
                                                        value === true || 'You must agree to the terms and conditions',
                                        }}
                                        render={({ field }) => (
                                                <div className='flex flex-col gap-1.5'>
                                                        <div className='flex items-center gap-2'>
                                                                <Checkbox
                                                                        id='agreedToTerms'
                                                                        checked={!!field.value}
                                                                        onCheckedChange={field.onChange}
                                                                        className={cn(
                                                                                'data-[state=checked]:bg-[#1A56DB] data-[state=checked]:border-[#1A56DB]',
                                                                                errors.agreedToTerms ? 'border-red-500' : 'border-[#E5E7EB]'
                                                                        )}
                                                                />
                                                                <label
                                                                        htmlFor='agreedToTerms'
                                                                        className='text-gray-800 text-xs font-medium font-text leading-5 cursor-pointer'
                                                                >
                                                                        I agree to the{' '}
                                                                        <Link
                                                                                href='/'
                                                                                className='text-[#1A56DB] hover:text-blue-900 duration-300 transition-colors underline'
                                                                                target='_blank'
                                                                                title='terms and conditions link'
                                                                        >
                                                                                terms and conditions
                                                                        </Link>
                                                                </label>
                                                        </div>
                                                        {errors.agreedToTerms && (
                                                                <FieldError message={errors.agreedToTerms.message as string} />
                                                        )}
                                                </div>
                                        )}
                                />

                                {/* Security notice */}
                                <div className='flex items-center gap-2'>
                                        <Shield className='size-6 text-gray-500' />
                                        <span className='text-[#6B7280] text-xs font-normal font-text leading-4'>
                                                Your booking is secure. Documents verified before confirmation.
                                        </span>
                                </div>
                        </div>

                        {/* ── Insurance card ──────────────────────────────── */}
                        <div className='flex flex-col gap-5 p-4 md:p-6 rounded-[10px] border border-gray-200 bg-white'>
                                <div className='flex items-center justify-between gap-3'>
                                        <h4 className='text-neutral-950 text-base font-semibold font-text leading-6'>
                                                Insurance Details
                                        </h4>
                                        <span className='block py-0.5 px-3 rounded-full bg-amber-100 text-amber-500 text-xs font-semibold'>
                                                OPTIONAL
                                        </span>
                                </div>

                                <div className='flex flex-col gap-4'>
                                        {/* Insurance Provider */}
                                        <FormRow
                                                label='Insurance Provider'
                                                htmlFor='insuranceProvider'
                                                error={errors.insuranceProvider?.message}
                                        >
                                                <Input
                                                        id='insuranceProvider'
                                                        type='text'
                                                        placeholder='e.g. Progressive, Geico, State Farm'
                                                        className={inputCn(!!errors.insuranceProvider)}
                                                        {...register('insuranceProvider', {
                                                                onChange: handleInsuranceChange,
                                                        })}
                                                />
                                        </FormRow>

                                        {/* Policy Number */}
                                        <FormRow
                                                label='Policy Number'
                                                htmlFor='policyNumber'
                                                error={errors.policyNumber?.message}
                                        >
                                                <Input
                                                        id='policyNumber'
                                                        type='text'
                                                        placeholder='e.g. PLY-123456789'
                                                        className={inputCn(!!errors.policyNumber)}
                                                        {...register('policyNumber', {
                                                                onChange: handleInsuranceChange,
                                                                validate: (value) => {
                                                                        // If provider is filled, policy number becomes required
                                                                        if (insuranceProvider && !value) {
                                                                                return 'Policy number is required when provider is entered'
                                                                        }
                                                                        return true
                                                                },
                                                        })}
                                                />
                                        </FormRow>

                                        {/* Expiry Date */}
                                        <FormRow
                                                label='Expiry Date'
                                                htmlFor='insuranceExpiry'
                                                error={errors.insuranceExpiry?.message}
                                        >
                                                <DatePickerField
                                                        name='insuranceExpiry'
                                                        control={control}
                                                        placeholder='Pick expiry date'
                                                        error={errors.insuranceExpiry?.message}
                                                        // Only dates more than 30 days from now are valid
                                                        minDate={THIRTY_DAYS_FROM_NOW}
                                                        rules={{
                                                                validate: (value: string) => {
                                                                        // Required if either provider or policy number is filled
                                                                        if ((insuranceProvider || policyNumber) && !value) {
                                                                                return 'Expiry date is required with insurance details'
                                                                        }
                                                                        if (!value) return true
                                                                        const expiry = new Date(value)
                                                                        if (expiry <= THIRTY_DAYS_FROM_NOW) {
                                                                                return 'Expiry date must be more than 30 days from today'
                                                                        }
                                                                        return true
                                                                },
                                                        }}
                                                />
                                        </FormRow>

                                        {/* Host providing coverage checkbox */}
                                        <Controller
                                                name='hostProvidingCoverage'
                                                control={control}
                                                render={({ field }) => (
                                                        <div className='flex items-center gap-2'>
                                                                <Checkbox
                                                                        id='hostProvidingCoverage'
                                                                        checked={effectiveHostCoverage}
                                                                        disabled={hasInsuranceInput}
                                                                        onCheckedChange={(checked) => {
                                                                                // Block re-checking when insurance fields are filled
                                                                                if (hasInsuranceInput) return
                                                                                field.onChange(!!checked)
                                                                        }}
                                                                        className={cn(
                                                                                'data-[state=checked]:bg-[#1A56DB] data-[state=checked]:border-[#1A56DB]',
                                                                                hasInsuranceInput
                                                                                        ? 'opacity-50 cursor-not-allowed'
                                                                                        : 'border-[#E5E7EB]'
                                                                        )}
                                                                />
                                                                <label
                                                                        htmlFor='hostProvidingCoverage'
                                                                        className={cn(
                                                                                'text-sm font-medium font-text cursor-pointer select-none',
                                                                                hasInsuranceInput
                                                                                        ? 'text-[#9CA3AF] cursor-not-allowed'
                                                                                        : 'text-[#1F2937]'
                                                                        )}
                                                                >
                                                                        Host is providing coverage
                                                                </label>
                                                        </div>
                                                )}
                                        />

                                        {hasInsuranceInput && (
                                                <div className='flex items-start gap-2 p-3 bg-amber-500/10 rounded-md text-amber-600'>
                                                        <AlertTriangle className='w-4 h-4 shrink-0 mt-0.5' />
                                                        <span className='text-xs font-medium font-text leading-4'>
                                                                Your own insurance will be used. Host coverage has been deselected.
                                                        </span>
                                                </div>
                                        )}
                                </div>
                        </div>

                        {/* ── Submit ──────────────────────────────────────── */}
                        <button
                                type='submit'
                                disabled={isSubmitting}
                                className='w-full font-text text-white px-10 py-3 bg-[#1A56DB] rounded-xs cursor-pointer hover:bg-blue-900 duration-300 transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2'
                        >
                                {isSubmitting ? (
                                        <>
                                                <Loader2 className='animate-spin w-4 h-4' />
                                                Processing...
                                        </>
                                ) : 'Proceed to Payment'}
                        </button>
                </form>
        )
})
PaymentSection.displayName = 'PaymentSection'

// ─── Date picker field ────────────────────────────────────────────────────────

type DatePickerFieldProps = {
        name: keyof PaymentFormValues
        control: ReturnType<typeof useForm<PaymentFormValues>>['control']
        placeholder?: string
        error?: string
        minDate?: Date
        rules?: object
}

const DatePickerField = ({ name, control, placeholder, error, minDate, rules }: DatePickerFieldProps) => (
        <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => {
                        const parsed = field.value ? new Date(field.value as string) : undefined

                        return (
                                <Popover>
                                        <PopoverTrigger asChild>
                                                <Button
                                                        type='button'
                                                        variant='outline'
                                                        className={cn(
                                                                'w-full justify-start text-left font-normal rounded-xs font-text text-sm',
                                                                !parsed && 'text-[#9CA3AF]',
                                                                error
                                                                        ? 'border-red-500 focus-visible:ring-red-500'
                                                                        : 'border-[#E5E7EB] focus-visible:ring-[#1A56DB]'
                                                        )}
                                                >
                                                        <CalendarIcon className='mr-2 h-4 w-4 text-[#9CA3AF] shrink-0' />
                                                        {parsed ? format(parsed, 'MMM d, yyyy') : placeholder ?? 'Pick a date'}
                                                </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                                <Calendar
                                                        mode='single'
                                                        selected={parsed}
                                                        onSelect={(date) => field.onChange(date?.toISOString() ?? '')}
                                                        disabled={(date) => {
                                                                if (minDate) {
                                                                        return date < new Date(new Date(minDate).setHours(0, 0, 0, 0))
                                                                }
                                                                return false
                                                        }}
                                                        initialFocus
                                                />
                                        </PopoverContent>
                                </Popover>
                        )
                }}
        />
)

// ─── Shared bits ──────────────────────────────────────────────────────────────

type FormRowProps = {
        label: string
        htmlFor: string
        error?: string
        children: React.ReactNode
}

const FormRow = ({ label, htmlFor, error, children }: FormRowProps) => (
        <div className='flex flex-col gap-1.5'>
                <Label htmlFor={htmlFor} className='text-[#1F2937] text-xs font-semibold font-text uppercase'>
                        {label}
                </Label>
                {children}
                {error && <FieldError message={error} />}
        </div>
)

const FieldError = ({ message }: { message: string }) => (
        <span className='text-red-500 text-xs font-normal font-text flex items-center gap-1'>
                <AlertTriangle className='w-3 h-3 shrink-0' />
                {message}
        </span>
)

const inputCn = (hasError: boolean) => cn(
        'rounded-xs border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] w-full',
        hasError && 'border-red-500 focus-visible:ring-red-500'
)