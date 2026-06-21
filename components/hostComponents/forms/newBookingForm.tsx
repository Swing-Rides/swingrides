'use client'

import { useMemo, useState, use, Suspense } from 'react'
import Image from 'next/image'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { format, differenceInCalendarDays } from 'date-fns'
import {
        Car,
        User,
        Mail,
        Phone,
        MapPin,
        CalendarIcon,
        Bell,
        Hash,
        AlertTriangle,
        CheckCircle2,
        Loader2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from '@/components/ui/select'
import {
        Popover,
        PopoverContent,
        PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type VehicleOption = {
        id: string
        name: string
        imageUrl: string
        dailyPrice: number
        weeklyPrice: number
        monthlyPrice: number
}

type AddonOption = {
        id: string
        label: string
        price: number
}

export type NewBookingFormValues = {
        vehicleId: string
        firstName: string
        lastName: string
        email: string
        phoneNumber: string
        pickupDate: string
        returnDate: string
        pickupLocation: string
        pickupCity: string
        pickupState: string
        addonIds: string[]
}

type TaxResult = {
        amount: number
        rate: number   // e.g. 0.08 for 8%
}

type NewBookingFormProps = {
        formId?: string
        bookingId?: string
        fetchVehicles: () => Promise<VehicleOption[]>
        fetchAddons: () => Promise<AddonOption[]>
        checkAvailability: (vehicleId: string, startDate: Date, endDate: Date) => Promise<boolean>
        fetchTax: (subtotal: number) => Promise<TaxResult>
        onCancel?: () => void
        onSubmit: (values: NewBookingFormValues) => void | Promise<void>
}

type PricingTier = 'daily' | 'weekly' | 'monthly'

type PricingLineItem = {
        label: string
        total: number
}

type PricingBreakdown = {
        tier: PricingTier
        durationLabel: string
        baseLineItems: PricingLineItem[]
        baseTotal: number
        addonLineItems: { id: string; label: string; total: number }[]
        addonsTotal: number
        subtotal: number
}

// ─── Pricing helpers ───────────────────────────────────────────────────────────

const getPricingTier = (days: number): PricingTier => {
        if (days < 7) return 'daily'
        if (days < 30) return 'weekly'
        return 'monthly'
}

const pluralize = (count: number, noun: string) => `${count} ${noun}${count !== 1 ? 's' : ''}`

/**
 * Mixed-unit billing: full periods at the tier rate, remaining days at the
 * daily rate — e.g. 35 days = 1 month + 5 days, not 2 months.
 * Add-ons are always billed at their stated per-day price × actual days,
 * regardless of base tier, to avoid ambiguity when units are mixed.
 */
const computePricing = (
        vehicle: VehicleOption,
        days: number,
        addons: AddonOption[],
        selectedAddonIds: string[]
): PricingBreakdown => {
        const tier = getPricingTier(days)

        const baseLineItems: PricingLineItem[] = []
        const durationParts: string[] = []
        let baseTotal = 0

        if (tier === 'daily') {
                baseTotal = vehicle.dailyPrice * days
                const label = pluralize(days, 'day')
                durationParts.push(label)
                baseLineItems.push({ label: `${label} (@ ${formatCurrency(vehicle.dailyPrice)}/day)`, total: baseTotal })
        } else if (tier === 'weekly') {
                const weeks = Math.floor(days / 7)
                const remDays = days % 7

                if (weeks > 0) {
                        const weeksTotal = weeks * vehicle.weeklyPrice
                        baseTotal += weeksTotal
                        const label = pluralize(weeks, 'week')
                        durationParts.push(label)
                        baseLineItems.push({ label: `${label} (@ ${formatCurrency(vehicle.weeklyPrice)}/wk)`, total: weeksTotal })
                }
                if (remDays > 0) {
                        const daysTotal = remDays * vehicle.dailyPrice
                        baseTotal += daysTotal
                        const label = pluralize(remDays, 'day')
                        durationParts.push(label)
                        baseLineItems.push({ label: `${label} (@ ${formatCurrency(vehicle.dailyPrice)}/day)`, total: daysTotal })
                }
        } else {
                const months = Math.floor(days / 30)
                const remDays = days % 30

                if (months > 0) {
                        const monthsTotal = months * vehicle.monthlyPrice
                        baseTotal += monthsTotal
                        const label = pluralize(months, 'month')
                        durationParts.push(label)
                        baseLineItems.push({ label: `${label} (@ ${formatCurrency(vehicle.monthlyPrice)}/mo)`, total: monthsTotal })
                }
                if (remDays > 0) {
                        const daysTotal = remDays * vehicle.dailyPrice
                        baseTotal += daysTotal
                        const label = pluralize(remDays, 'day')
                        durationParts.push(label)
                        baseLineItems.push({ label: `${label} (@ ${formatCurrency(vehicle.dailyPrice)}/day)`, total: daysTotal })
                }
        }

        const selectedAddons = addons.filter(a => selectedAddonIds.includes(a.id))
        const addonLineItems = selectedAddons.map(addon => ({
                id: addon.id,
                label: addon.label,
                total: addon.price * days,
        }))
        const addonsTotal = addonLineItems.reduce((sum, a) => sum + a.total, 0)

        return {
                tier,
                durationLabel: durationParts.join(', '),
                baseLineItems,
                baseTotal,
                addonLineItems,
                addonsTotal,
                subtotal: baseTotal + addonsTotal,
        }
}

const formatCurrency = (amount: number) =>
        amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const formatPercent = (rate: number) =>
        `${(rate * 100).toLocaleString('en-US', { maximumFractionDigits: 2 })}%`

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewBookingForm(props: NewBookingFormProps) {
        return (
                <Suspense fallback={<NewBookingFormSkeleton />}>
                        <NewBookingFormInner {...props} />
                </Suspense>
        )
}

function NewBookingFormInner({
        formId = 'new-booking-form',
        bookingId: bookingIdProp,
        fetchVehicles,
        fetchAddons,
        checkAvailability,
        fetchTax,
        onCancel,
        onSubmit,
}: NewBookingFormProps) {
        // Stable promises — fetched once per mount since fetchVehicles/fetchAddons
        // are expected to be stable references (useCallback) from the parent
        const vehiclesPromise = useMemo(() => fetchVehicles(), [fetchVehicles])
        const addonsPromise = useMemo(() => fetchAddons(), [fetchAddons])

        const vehicles = use(vehiclesPromise)
        const addons = use(addonsPromise)

        // Use the bookingId passed from the parent (page already displays it in
        // pageDescription) — only self-generate as a fallback for standalone usage
        const [generatedBookingId] = useState(() => `BK-${Date.now().toString(36).toUpperCase()}`)
        const bookingId = bookingIdProp ?? generatedBookingId

        const defaultValues: NewBookingFormValues = {
                vehicleId: '',
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                pickupDate: '',
                returnDate: '',
                pickupLocation: '',
                pickupCity: '',
                pickupState: '',
                addonIds: [],
        }

        const {
                register,
                handleSubmit,
                control,
                reset,
                formState: { errors, isSubmitting },
        } = useForm<NewBookingFormValues>({
                mode: 'onTouched',
                defaultValues,
        })

        const vehicleId = useWatch({ control, name: 'vehicleId' })
        const email = useWatch({ control, name: 'email' })
        const pickupDate = useWatch({ control, name: 'pickupDate' })
        const returnDate = useWatch({ control, name: 'returnDate' })
        const addonIds = useWatch({ control, name: 'addonIds' }) ?? []

        const selectedVehicle = vehicles.find(v => v.id === vehicleId)

        const days = pickupDate && returnDate
                ? Math.max(differenceInCalendarDays(new Date(returnDate), new Date(pickupDate)), 0)
                : 0

        const pricing = selectedVehicle && days > 0
                ? computePricing(selectedVehicle, days, addons, addonIds)
                : null

        const onFormSubmit = async (values: NewBookingFormValues) => {
                await onSubmit(values)
        }

        // Cancel resets the form back to its empty defaults — it does not navigate away
        const handleCancel = () => {
                reset(defaultValues)
                onCancel?.()
        }

        return (
                <form
                        id={formId}
                        onSubmit={handleSubmit(onFormSubmit)}
                        className='flex flex-col gap-6 w-full'
                        noValidate
                >
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>

                                {/* ── Left panel: booking inputs ──────────────── */}
                                <div className='p-4 rounded-[10px] border border-gray-200 flex flex-col items-start gap-2.5'>
                                        <div className='flex flex-col gap-5 w-full'>

                                                {/* Section 1: Vehicle Selection */}
                                                <FormSection title='Vehicle Selection'>
                                                        <FormRow label='Select a Vehicle' htmlFor='vehicleId' error={errors.vehicleId?.message}>
                                                                <Controller
                                                                        name='vehicleId'
                                                                        control={control}
                                                                        rules={{ required: 'Please select a vehicle' }}
                                                                        render={({ field }) => (
                                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                                        <SelectTrigger
                                                                                                id='vehicleId'
                                                                                                className={inputCn(!!errors.vehicleId)}
                                                                                        >
                                                                                                <div className='flex items-center gap-2 truncate'>
                                                                                                        <Car className='w-4 h-4 text-[#9CA3AF] shrink-0' />
                                                                                                        <SelectValue placeholder='Select a vehicle' />
                                                                                                </div>
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                {vehicles.map(v => (
                                                                                                        <SelectItem key={v.id} value={v.id} className='font-text text-sm'>
                                                                                                                {v.name}
                                                                                                        </SelectItem>
                                                                                                ))}
                                                                                        </SelectContent>
                                                                                </Select>
                                                                        )}
                                                                />
                                                        </FormRow>
                                                </FormSection>

                                                <Separator />

                                                {/* Section 2: Renter Details */}
                                                <FormSection title='Renter Details'>
                                                        <div className='grid grid-cols-2 gap-3'>
                                                                <FormRow label='First Name' htmlFor='firstName' error={errors.firstName?.message}>
                                                                        <IconInput
                                                                                id='firstName'
                                                                                icon={<User className='w-4 h-4' />}
                                                                                placeholder='John'
                                                                                hasError={!!errors.firstName}
                                                                                {...register('firstName', { required: 'First name is required' })}
                                                                        />
                                                                </FormRow>
                                                                <FormRow label='Last Name' htmlFor='lastName' error={errors.lastName?.message}>
                                                                        <IconInput
                                                                                id='lastName'
                                                                                icon={<User className='w-4 h-4' />}
                                                                                placeholder='Smith'
                                                                                hasError={!!errors.lastName}
                                                                                {...register('lastName', { required: 'Last name is required' })}
                                                                        />
                                                                </FormRow>
                                                        </div>
                                                        <div className='grid grid-cols-2 gap-3'>
                                                                <FormRow label='Email Address' htmlFor='email' error={errors.email?.message}>
                                                                        <IconInput
                                                                                id='email'
                                                                                type='email'
                                                                                icon={<Mail className='w-4 h-4' />}
                                                                                placeholder='john@email.com'
                                                                                hasError={!!errors.email}
                                                                                {...register('email', {
                                                                                        required: 'Email is required',
                                                                                        pattern: {
                                                                                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}$/i,
                                                                                                message: 'Enter a valid email address',
                                                                                        },
                                                                                })}
                                                                        />
                                                                </FormRow>
                                                                <FormRow label='Phone Number' htmlFor='phoneNumber' error={errors.phoneNumber?.message}>
                                                                        <IconInput
                                                                                id='phoneNumber'
                                                                                type='tel'
                                                                                icon={<Phone className='w-4 h-4' />}
                                                                                placeholder='+1 555-123-4567'
                                                                                hasError={!!errors.phoneNumber}
                                                                                {...register('phoneNumber', { required: 'Phone number is required' })}
                                                                        />
                                                                </FormRow>
                                                        </div>
                                                </FormSection>

                                                <Separator />

                                                {/* Section 3: Booking Dates & Location */}
                                                <FormSection title='Booking Dates & Location'>
                                                        <div className='grid grid-cols-2 gap-3'>
                                                                <FormRow label='Pickup Date' htmlFor='pickupDate' error={errors.pickupDate?.message}>
                                                                        <DatePickerField
                                                                                name='pickupDate'
                                                                                control={control}
                                                                                placeholder='Pick a date'
                                                                                error={errors.pickupDate?.message}
                                                                                rules={{ required: 'Pickup date is required' }}
                                                                        />
                                                                </FormRow>
                                                                <FormRow label='Return Date' htmlFor='returnDate' error={errors.returnDate?.message}>
                                                                        <DatePickerField
                                                                                name='returnDate'
                                                                                control={control}
                                                                                placeholder='Pick a date'
                                                                                error={errors.returnDate?.message}
                                                                                minDate={pickupDate ? new Date(pickupDate) : undefined}
                                                                                rules={{
                                                                                        required: 'Return date is required',
                                                                                        validate: (value: string) => {
                                                                                                if (!pickupDate || !value) return true
                                                                                                return new Date(value) > new Date(pickupDate)
                                                                                                        || 'Must be after pickup date'
                                                                                        },
                                                                                }}
                                                                        />
                                                                </FormRow>
                                                        </div>

                                                        <FormRow label='Pickup Location' htmlFor='pickupLocation' error={errors.pickupLocation?.message}>
                                                                <IconInput
                                                                        id='pickupLocation'
                                                                        icon={<MapPin className='w-4 h-4' />}
                                                                        placeholder='e.g. 123 Main Street'
                                                                        hasError={!!errors.pickupLocation}
                                                                        {...register('pickupLocation', { required: 'Pickup location is required' })}
                                                                />
                                                        </FormRow>

                                                        <div className='grid grid-cols-2 gap-3'>
                                                                <FormRow label='City' htmlFor='pickupCity' error={errors.pickupCity?.message}>
                                                                        <Input
                                                                                id='pickupCity'
                                                                                type='text'
                                                                                placeholder='e.g. Austin'
                                                                                className={inputCn(!!errors.pickupCity)}
                                                                                {...register('pickupCity', { required: 'City is required' })}
                                                                        />
                                                                </FormRow>
                                                                <FormRow label='State' htmlFor='pickupState' error={errors.pickupState?.message}>
                                                                        <Input
                                                                                id='pickupState'
                                                                                type='text'
                                                                                placeholder='e.g. TX'
                                                                                className={inputCn(!!errors.pickupState)}
                                                                                {...register('pickupState', { required: 'State is required' })}
                                                                        />
                                                                </FormRow>
                                                        </div>

                                                        {/* Live availability notice */}
                                                        {selectedVehicle && pickupDate && returnDate && days > 0 && (
                                                                <Suspense fallback={<AvailabilityPlaceholder />}>
                                                                        <AvailabilityNotice
                                                                                vehicleId={selectedVehicle.id}
                                                                                vehicleName={selectedVehicle.name}
                                                                                startDate={new Date(pickupDate)}
                                                                                endDate={new Date(returnDate)}
                                                                                checkAvailability={checkAvailability}
                                                                        />
                                                                </Suspense>
                                                        )}
                                                </FormSection>

                                                <Separator />

                                                {/* Section 4: Add-ons */}
                                                <FormSection title='Add-ons'>
                                                        <Controller
                                                                name='addonIds'
                                                                control={control}
                                                                render={({ field }) => (
                                                                        <div className='flex flex-col gap-2 w-full'>
                                                                                {addons.map(addon => {
                                                                                        const checked = field.value?.includes(addon.id) ?? false
                                                                                        return (
                                                                                                <label
                                                                                                        key={addon.id}
                                                                                                        htmlFor={`addon-${addon.id}`}
                                                                                                        className='flex items-center justify-between gap-3 p-3 rounded-md border border-[#E5E7EB] cursor-pointer hover:bg-[#F9FAFB] transition-colors duration-150'
                                                                                                >
                                                                                                        <div className='flex items-center gap-2.5'>
                                                                                                                <Checkbox
                                                                                                                        id={`addon-${addon.id}`}
                                                                                                                        checked={checked}
                                                                                                                        onCheckedChange={(isChecked) => {
                                                                                                                                const current: string[] = field.value ?? []
                                                                                                                                field.onChange(
                                                                                                                                        isChecked
                                                                                                                                                ? [...current, addon.id]
                                                                                                                                                : current.filter((id: string) => id !== addon.id)
                                                                                                                                )
                                                                                                                        }}
                                                                                                                        className='border-[#E5E7EB] data-[state=checked]:bg-[#1A56DB] data-[state=checked]:border-[#1A56DB]'
                                                                                                                />
                                                                                                                <span className='text-[#1F2937] text-sm font-medium font-text'>
                                                                                                                        {addon.label}
                                                                                                                </span>
                                                                                                        </div>
                                                                                                        <span className='text-[#6B7280] text-sm font-normal font-text'>
                                                                                                                {formatCurrency(addon.price)}/day
                                                                                                        </span>
                                                                                                </label>
                                                                                        )
                                                                                })}
                                                                        </div>
                                                                )}
                                                        />
                                                </FormSection>
                                        </div>
                                </div>

                                {/* ── Right panel: booking summary ────────────── */}
                                <div className='p-4 rounded-[10px] border border-gray-200 flex flex-col items-start gap-2.5'>
                                        <div className='flex flex-col gap-5 w-full'>
                                                <h2 className='text-neutral-950 text-base font-semibold font-text'>
                                                        Booking Summary
                                                </h2>

                                                {!selectedVehicle ? (
                                                        <EmptySummaryNotice message='Select a vehicle to see pricing details.' />
                                                ) : (
                                                        <>
                                                                {/* Section 1: Vehicle */}
                                                                <div className='flex items-center gap-3 w-full'>
                                                                        <div className='relative size-14 rounded-md overflow-clip shrink-0 bg-[#F3F4F6]'>
                                                                                <Image
                                                                                        src={selectedVehicle.imageUrl}
                                                                                        alt={selectedVehicle.name}
                                                                                        fill
                                                                                        className='object-cover object-center'
                                                                                />
                                                                        </div>
                                                                        <div className='flex flex-col gap-0.5'>
                                                                                <span className='text-[#1F2937] text-sm font-semibold font-text'>
                                                                                        {selectedVehicle.name}
                                                                                </span>
                                                                                <span className='text-[#6B7280] text-xs font-normal font-text'>
                                                                                        {pricing?.tier === 'weekly'
                                                                                                ? `${formatCurrency(selectedVehicle.weeklyPrice)}/week`
                                                                                                : pricing?.tier === 'monthly'
                                                                                                        ? `${formatCurrency(selectedVehicle.monthlyPrice)}/month`
                                                                                                        : `${formatCurrency(selectedVehicle.dailyPrice)}/day`
                                                                                        }
                                                                                </span>
                                                                        </div>
                                                                </div>

                                                                <Separator />

                                                                {/* Section 2: Itemized breakdown */}
                                                                {pricing ? (
                                                                        <div className='flex flex-col gap-2 w-full'>
                                                                                <SummaryRow
                                                                                        label={`Dates (${pricing.durationLabel})`}
                                                                                        value={`${format(new Date(pickupDate), 'MMM d')} – ${format(new Date(returnDate), 'MMM d, yyyy')}`}
                                                                                />
                                                                                {pricing.baseLineItems.map((item, index) => (
                                                                                        <SummaryRow
                                                                                                key={`base-${index}`}
                                                                                                label={index === 0 ? `Base rate: ${item.label}` : item.label}
                                                                                                value={formatCurrency(item.total)}
                                                                                        />
                                                                                ))}
                                                                                {pricing.addonLineItems.map((addon) => (
                                                                                        <SummaryRow
                                                                                                key={addon.id}
                                                                                                label={`${addon.label} (${pluralize(days, 'day')})`}
                                                                                                value={formatCurrency(addon.total)}
                                                                                        />
                                                                                ))}
                                                                        </div>
                                                                ) : (
                                                                        <EmptySummaryNotice message='Select pickup and return dates to calculate pricing.' />
                                                                )}

                                                                {pricing && (
                                                                        <>
                                                                                <Separator />

                                                                                {/* Section 3: Subtotal + Tax, Section 4: Total */}
                                                                                <Suspense fallback={<TaxPlaceholder subtotal={pricing.subtotal} />}>
                                                                                        <TaxAndTotal
                                                                                                subtotal={pricing.subtotal}
                                                                                                fetchTax={fetchTax}
                                                                                        />
                                                                                </Suspense>
                                                                        </>
                                                                )}

                                                                <Separator />

                                                                {/* Section 5: Booking reference */}
                                                                <div className='p-3 bg-indigo-50 rounded-[10px] flex flex-col justify-center items-center gap-1 w-full'>
                                                                        <span className='text-indigo-700 text-xs font-medium font-text text-center'>
                                                                                Auto-generated Reference
                                                                        </span>
                                                                        <span className='text-indigo-900 text-sm font-bold font-text flex items-center gap-1.5'>
                                                                                <Hash className='w-3.5 h-3.5' />
                                                                                {bookingId}
                                                                        </span>
                                                                </div>

                                                                {/* Section 6: Notification notices */}
                                                                <div className='flex flex-col gap-2 w-full'>
                                                                        <div className='flex items-center gap-2'>
                                                                                <Mail className='w-4 h-4 text-[#6B7280] shrink-0' />
                                                                                <span className='text-[#6B7280] text-xs font-normal font-text'>
                                                                                        Confirmation email will be sent to {email || 'the renter\u2019s email'}
                                                                                </span>
                                                                        </div>
                                                                        <div className='flex items-center gap-2'>
                                                                                <Bell className='w-4 h-4 text-[#6B7280] shrink-0' />
                                                                                <span className='text-[#6B7280] text-xs font-normal font-text'>
                                                                                        Host notification will be sent to your account.
                                                                                </span>
                                                                        </div>
                                                                </div>
                                                        </>
                                                )}
                                        </div>
                                </div>
                        </div>

                        {/* ── Cancel + Create Booking (bottom) — top button lives in pageButton, wired via formId ── */}
                        <div className='flex gap-3 justify-end'>
                                <Button
                                        type='button'
                                        variant='outline'
                                        onClick={handleCancel}
                                        disabled={isSubmitting}
                                        className='px-6 py-2 border-red-500 text-red-500 hover:text-white hover:bg-red-700 rounded-xs font-medium font-text cursor-pointer transition-colors duration-300'
                                >
                                        Cancel
                                </Button>
                                <Button
                                        type='submit'
                                        disabled={isSubmitting}
                                        className='px-6 py-2 border-blue-500 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none'
                                >
                                        {isSubmitting ? (
                                                <span className='flex items-center gap-2'>
                                                        <Loader2 className='animate-spin w-4 h-4' />
                                                        Creating...
                                                </span>
                                        ) : 'Create Booking'}
                                </Button>
                        </div>
                </form>
        )
}

// ─── Availability notice (reactive, own Suspense boundary) ───────────────────

type AvailabilityNoticeProps = {
        vehicleId: string
        vehicleName: string
        startDate: Date
        endDate: Date
        checkAvailability: (vehicleId: string, startDate: Date, endDate: Date) => Promise<boolean>
}

const AvailabilityNotice = ({
        vehicleId,
        vehicleName,
        startDate,
        endDate,
        checkAvailability,
}: AvailabilityNoticeProps) => {
        // Precompute timestamps — primitives are what the memo should actually
        // depend on, and rebuilding Date objects inside the callback keeps the
        // dependency array and the callback's real inputs in sync
        const startTime = startDate.getTime()
        const endTime = endDate.getTime()

        const availabilityPromise = useMemo(
                () => checkAvailability(vehicleId, new Date(startTime), new Date(endTime)),
                [vehicleId, startTime, endTime, checkAvailability]
        )

        const isAvailable = use(availabilityPromise)
        const rangeLabel = `${format(startDate, 'MMM d')} – ${format(endDate, 'MMM d, yyyy')}`

        return isAvailable ? (
                <div className='flex items-center gap-2 p-3 bg-emerald-50 rounded-md text-emerald-700'>
                        <CheckCircle2 className='w-4 h-4 shrink-0' />
                        <span className='text-sm font-medium font-text'>
                                {vehicleName} is available for {rangeLabel}
                        </span>
                </div>
        ) : (
                <div className='flex items-center gap-2 p-3 bg-red-50 rounded-md text-red-600'>
                        <AlertTriangle className='w-4 h-4 shrink-0' />
                        <span className='text-sm font-medium font-text'>
                                {vehicleName} is not available for {rangeLabel}
                        </span>
                </div>
        )
}

const AvailabilityPlaceholder = () => (
        <div className='flex items-center gap-2 p-3 bg-[#F9FAFB] rounded-md text-[#9CA3AF]'>
                <Loader2 className='w-4 h-4 shrink-0 animate-spin' />
                <span className='text-sm font-medium font-text'>Checking availability...</span>
        </div>
)

// ─── Tax + total (reactive, own Suspense boundary) ────────────────────────────

type TaxAndTotalProps = {
        subtotal: number
        fetchTax: (subtotal: number) => Promise<TaxResult>
}

const TaxAndTotal = ({ subtotal, fetchTax }: TaxAndTotalProps) => {
        const taxPromise = useMemo(() => fetchTax(subtotal), [subtotal, fetchTax])
        const tax = use(taxPromise)
        const total = subtotal + tax.amount

        return (
                <>
                        <div className='flex flex-col gap-2 w-full'>
                                <SummaryRow label='Subtotal' value={formatCurrency(subtotal)} />
                                <SummaryRow label={`Tax (${formatPercent(tax.rate)})`} value={formatCurrency(tax.amount)} />
                        </div>

                        <Separator />

                        <div className='flex items-center justify-between w-full'>
                                <span className='text-gray-800 text-base font-bold font-text leading-6'>
                                        Total Amount
                                </span>
                                <span className='text-blue-700 text-xl font-medium font-text leading-7'>
                                        {formatCurrency(total)}
                                </span>
                        </div>
                </>
        )
}

const TaxPlaceholder = ({ subtotal }: { subtotal: number }) => (
        <div className='flex flex-col gap-2 w-full'>
                <SummaryRow label='Subtotal' value={formatCurrency(subtotal)} />
                <div className='flex items-center justify-between'>
                        <span className='text-[#6B7280] text-sm font-normal font-text'>Tax</span>
                        <Skeleton className='h-4 w-16' />
                </div>
        </div>
)

// ─── Shared bits ───────────────────────────────────────────────────────────────

const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className='flex flex-col gap-3 w-full'>
                <span className='text-gray-500 text-xs font-semibold font-text uppercase'>
                        {title}
                </span>
                <div className='flex flex-col gap-3 w-full'>
                        {children}
                </div>
        </div>
)

type FormRowProps = {
        label: string
        htmlFor: string
        error?: string
        children: React.ReactNode
}

const FormRow = ({ label, htmlFor, error, children }: FormRowProps) => (
        <div className='flex flex-col gap-1.5'>
                <Label htmlFor={htmlFor} className='text-gray-500 text-xs font-semibold font-text uppercase'>
                        {label}
                </Label>
                {children}
                {error && (
                        <span className='text-[#EF4444] text-xs font-normal font-text flex items-center gap-1'>
                                <AlertTriangle className='w-3 h-3 shrink-0' />
                                {error}
                        </span>
                )}
        </div>
)

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
                <Input className={cn(inputCn(!!hasError), 'pl-9', className)} {...props} />
        </div>
)

const inputCn = (hasError: boolean) => cn(
        'rounded-xs border-[#E5E7EB] focus-visible:ring-blue-700 font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] w-full',
        hasError && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
)

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
        <div className='flex items-center justify-between gap-3'>
                <span className='text-[#6B7280] text-sm font-normal font-text'>{label}</span>
                <span className='text-[#1F2937] text-sm font-medium font-text text-right'>{value}</span>
        </div>
)

const EmptySummaryNotice = ({ message }: { message: string }) => (
        <span className='text-[#9CA3AF] text-sm font-normal font-text'>{message}</span>
)

// ─── Generic date picker (reused pattern) ─────────────────────────────────────

type DatePickerFieldProps = {
        name: keyof NewBookingFormValues
        control: ReturnType<typeof useForm<NewBookingFormValues>>['control']
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
                                                                        ? 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                                                        : 'border-[#E5E7EB] focus-visible:ring-blue-700'
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
                                                                const today = new Date(new Date().setHours(0, 0, 0, 0))
                                                                if (minDate) {
                                                                        const minDay = new Date(new Date(minDate).setHours(0, 0, 0, 0))
                                                                        return date < today || date < minDay
                                                                }
                                                                return date < today
                                                        }}
                                                        initialFocus
                                                />
                                        </PopoverContent>
                                </Popover>
                        )
                }}
        />
)

// ─── Skeleton (top-level Suspense fallback) ───────────────────────────────────

const NewBookingFormSkeleton = () => (
        <div className='flex flex-col gap-6'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                        {Array.from({ length: 2 }, (_, i) => (
                                <div key={i} className='p-4 rounded-[10px] border border-gray-200 flex flex-col gap-5'>
                                        <Skeleton className='h-4 w-32' />
                                        <Skeleton className='h-10 w-full' />
                                        <Skeleton className='h-4 w-32' />
                                        <Skeleton className='h-10 w-full' />
                                        <Skeleton className='h-10 w-full' />
                                </div>
                        ))}
                </div>
                <div className='flex justify-end gap-3'>
                        <Skeleton className='h-10 w-24' />
                        <Skeleton className='h-10 w-36' />
                </div>
        </div>
)