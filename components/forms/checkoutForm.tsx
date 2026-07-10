'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import {
        Clock,
        User,
        Mail,
        Phone,
        Lock,
        ShieldCheck,
        AlertTriangle,
        Loader2,
        LogIn,
        MapPin,
        Building2,
        Map as MapIcon,
        Hash,
} from 'lucide-react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import GuestSignUpForm from './GuestSignUpForm'

// ─── Types ────────────────────────────────────────────────────────────────────

export type CheckoutContact = {
        firstName: string
        lastName: string
        email: string
        phoneNumber: string
        streetAddress: string
        city: string
        state: string
        postalCode: string
}

export type CheckoutItem = {
        id: string;
        vehicleName: string;
        vehicleType: string;
        vehicleGearType: string;
        imageUrl?: string;
        duration: number;
        total: number;
}

export type CheckoutSummary = {
        vehicle: CheckoutItem;
        subtotal: number;
        taxAmount: number;
        taxRate: number;
        total: number;
        currency?: string; // ISO 4217, defaults to 'USD'
        reference?: string; // order/booking reference shown to the user
}

export type CheckoutFormValues = CheckoutContact & {
        paymentIntentId?: string
}

type CheckoutFormProps = {
        id: string
        formId?: string
        user?: CheckoutContact | null
        imageUrl: string
        vehicleName: string
        vehicleType: string
        vehicleGearType: string
        duration: string
        totalPrice: string
        subTotalFee: string
        taxPercentageRate: string
        taxFee: string
        /** Insurance fee shown in the order summary. Defaults to "$0.00" when not provided. */
        insuranceFee?: string
        /** Checkout session length. Defaults to 20 minutes. */
        durationSeconds?: number
        /** Called once, when the countdown reaches zero. */
        onExpire?: () => void
        /** Route the user to your login flow (e.g. router.push('/login?next=/checkout')). */
        onLogin?: () => void
        /** Stripe's client secret for this checkout session (from a PaymentIntent your server already created). */
        clientSecret: string
        /** Where Stripe redirects for payment methods that require it. */
        returnUrl: string
        /** Gives the parent a chance to persist contact data before Stripe redirects. */
        onBeforeConfirm?: (values: CheckoutContact) => void | Promise<void>
        /** Fires after Stripe confirms the payment client-side. The parent owns everything after this — creating the order record, redirecting, etc. */
        onSubmit: (values: CheckoutFormValues) => void | Promise<void>
        onCancel?: () => void
        /** Extra error to surface (e.g. the parent's post-payment server call failed). */
        submitError?: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pad = (n: number) => n.toString().padStart(2, '0')

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutForm(props: CheckoutFormProps) {
        if (!props.id) return <CheckoutFormSkeleton />
        return <CheckoutFormInner {...props} />
}

function CheckoutFormInner({
        // id,
        formId = 'checkout-form',
        user,
        durationSeconds = 20 * 60,
        onExpire,
        onLogin,
        // clientSecret,
        returnUrl,
        onBeforeConfirm,
        onSubmit,
        onCancel,
        submitError,
        imageUrl,
        vehicleName,
        vehicleType,
        vehicleGearType,
        duration,
        totalPrice,
        subTotalFee,
        taxPercentageRate,
        taxFee,
        insuranceFee = '$0.00',
}: CheckoutFormProps) {
        const isLoggedIn = !!user

        // const [guestDetails, setGuestDetails] = useState<CheckoutContact | null>(null)
        const [isProcessing, setIsProcessing] = useState(false)
        const [stripeError, setStripeError] = useState<string | null>(null)
        const [expired, setExpired] = useState(false)

        const stripe = useStripe()
        const elements = useElements()

        const emptyContact: CheckoutContact = {
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                streetAddress: '',
                city: '',
                state: '',
                postalCode: '',
        }

        const {
                register,
                handleSubmit,
                // setValue,
                reset,
                formState: { errors },
        } = useForm<CheckoutContact>({
                mode: 'onTouched',
                defaultValues: user ?? emptyContact,
        })

        // Keep the form in sync if the logged-in user's info arrives/changes after mount
        useEffect(() => {
                if (user) reset(user)
        }, [user, reset])

        const hasContactInfo = isLoggedIn

        const handleCancel = () => {
                reset(user ?? emptyContact)
                onCancel?.()
        }

        const onFormSubmit = async (values: CheckoutContact) => {
                if (expired) return
                if (!stripe || !elements) return
                setStripeError(null)
                setIsProcessing(true)

                try {
                        await onBeforeConfirm?.(values)

                        const { error, paymentIntent } = await stripe.confirmPayment({
                                elements,
                                confirmParams: {
                                        return_url: returnUrl,
                                        payment_method_data: {
                                                billing_details: {
                                                        name: `${values.firstName} ${values.lastName}`.trim(),
                                                        email: values.email,
                                                        phone: values.phoneNumber,
                                                        address: {
                                                                line1: values.streetAddress,
                                                                city: values.city,
                                                                state: values.state,
                                                                postal_code: values.postalCode,
                                                        },
                                                },
                                        },
                                },
                                redirect: 'if_required',
                        })

                        if (error) {
                                setStripeError(error.message ?? 'Your payment could not be processed. Please check your card details and try again.')
                                return
                        }

                        await onSubmit({ ...values, paymentIntentId: paymentIntent?.id })
                } finally {
                        setIsProcessing(false)
                }
        }

        const isSubmitting = isProcessing
        const displayError = submitError ?? stripeError

        return (
                <form
                        id={formId}
                        onSubmit={handleSubmit(onFormSubmit)}
                        className='flex flex-col gap-4 w-full'
                        noValidate
                >
                        <CheckoutCountdown
                                durationSeconds={durationSeconds}
                                onExpire={() => {
                                        setExpired(true)
                                        onExpire?.()
                                }}
                        />

                        <div className='grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 items-start'>

                                {/* ── Left: contact + payment ─────────────────────────── */}
                                <div className='order-2 lg:order-1 flex flex-col gap-4 w-full'>

                                        {/* Contact information */}
                                        <div className='p-4 rounded-[10px] border border-gray-200 bg-white flex flex-col gap-4 w-full'>
                                                <div className='flex items-center justify-between gap-3 flex-wrap'>
                                                        <span className='text-neutral-950 text-base font-semibold font-text'>
                                                                Contact Information
                                                        </span>
                                                        {isLoggedIn ? (
                                                                <span className='text-emerald-500 bg-emerald-50 text-xs font-medium font-text px-2 py-1 rounded-full'>
                                                                        Signed in as {user!.email}
                                                                </span>
                                                        ) : (
                                                                <button
                                                                        type='button'
                                                                        onClick={onLogin}
                                                                        className='flex items-center gap-1 text-blue-700 text-xs font-medium font-text hover:text-blue-900 transition-colors duration-150'
                                                                >
                                                                        <LogIn className='w-3.5 h-3.5' />
                                                                        Already have an account? Log in
                                                                </button>
                                                        )}
                                                </div>

                                                {isLoggedIn ? (
                                                        <div className='flex flex-col gap-3 w-full'>
                                                                <div className='grid grid-cols-2 gap-3'>
                                                                        <FormRow label='First Name' htmlFor='firstName' error={errors.firstName?.message}>
                                                                                <IconInput
                                                                                        id='firstName'
                                                                                        icon={<User className='w-4 h-4' />}
                                                                                        hasError={!!errors.firstName}
                                                                                        {...register('firstName', { required: 'First name is required' })}
                                                                                />
                                                                        </FormRow>
                                                                        <FormRow label='Last Name' htmlFor='lastName' error={errors.lastName?.message}>
                                                                                <IconInput
                                                                                        id='lastName'
                                                                                        icon={<User className='w-4 h-4' />}
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
                                                                                        hasError={!!errors.phoneNumber}
                                                                                        {...register('phoneNumber', { required: 'Phone number is required' })}
                                                                                />
                                                                        </FormRow>
                                                                </div>

                                                                <FormRow label='Street Address' htmlFor='streetAddress' error={errors.streetAddress?.message}>
                                                                        <IconInput
                                                                                id='streetAddress'
                                                                                icon={<MapPin className='w-4 h-4' />}
                                                                                hasError={!!errors.streetAddress}
                                                                                placeholder='123 Main St'
                                                                                {...register('streetAddress', { required: 'Street address is required' })}
                                                                        />
                                                                </FormRow>

                                                                <div className='grid grid-cols-3 gap-3'>
                                                                        <FormRow label='City' htmlFor='city' error={errors.city?.message}>
                                                                                <IconInput
                                                                                        id='city'
                                                                                        icon={<Building2 className='w-4 h-4' />}
                                                                                        hasError={!!errors.city}
                                                                                        {...register('city', { required: 'City is required' })}
                                                                                />
                                                                        </FormRow>
                                                                        <FormRow label='State' htmlFor='state' error={errors.state?.message}>
                                                                                <IconInput
                                                                                        id='state'
                                                                                        icon={<MapIcon className='w-4 h-4' />}
                                                                                        hasError={!!errors.state}
                                                                                        placeholder='e.g. CA'
                                                                                        {...register('state', { required: 'State is required' })}
                                                                                />
                                                                        </FormRow>
                                                                        <FormRow label='Postal Code' htmlFor='postalCode' error={errors.postalCode?.message}>
                                                                                <IconInput
                                                                                        id='postalCode'
                                                                                        icon={<Hash className='w-4 h-4' />}
                                                                                        hasError={!!errors.postalCode}
                                                                                        {...register('postalCode', { required: 'Postal code is required' })}
                                                                                />
                                                                        </FormRow>
                                                                </div>
                                                        </div>
                                                ) : (
                                                        //TO DO
                                                        //Create a new sign form here
                                                        <GuestSignUpForm />
                                                )}
                                        </div>

                                        {/* Payment */}
                                        <div className='p-4 rounded-[10px] border border-gray-200 bg-white flex flex-col gap-4 w-full'>
                                                <span className='flex items-center gap-2 text-neutral-950 text-base font-semibold font-text'>
                                                        <Lock className='w-4 h-4 text-[#6B7280]' />
                                                        Payment Details
                                                </span>

                                                <PaymentElement
                                                        options={{
                                                                fields: { billingDetails: { name: 'never', email: 'never', phone: 'never' } },
                                                        }}
                                                />

                                                <div className='flex items-center gap-2 text-[#6B7280]'>
                                                        <ShieldCheck className='w-4 h-4 shrink-0' />
                                                        <span className='text-xs font-normal font-text'>
                                                                Payments are processed securely by Stripe. We never see or store your card details.
                                                        </span>
                                                </div>

                                                {displayError && (
                                                        <div className='flex items-center gap-2 p-3 bg-red-50 rounded-md text-red-600'>
                                                                <AlertTriangle className='w-4 h-4 shrink-0' />
                                                                <span className='text-sm font-medium font-text'>{displayError}</span>
                                                        </div>
                                                )}
                                        </div>

                                        {/* Actions */}
                                        <div className='flex gap-3 justify-end'>
                                                {onCancel && (
                                                        <Button
                                                                type='button'
                                                                variant='outline'
                                                                onClick={handleCancel}
                                                                disabled={isSubmitting}
                                                                className='px-6 py-2 border-red-500 text-red-500 hover:text-white hover:bg-red-700 rounded-xs font-medium font-text cursor-pointer transition-colors duration-300'
                                                        >
                                                                Cancel
                                                        </Button>
                                                )}
                                                <Button
                                                        type='submit'
                                                        disabled={isSubmitting || !hasContactInfo || !stripe || !elements || expired}
                                                        className='px-6 py-2 border-blue-500 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text hover:bg-blue-900 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none'
                                                >
                                                        {isSubmitting ? (
                                                                <span className='flex items-center gap-2'>
                                                                        <Loader2 className='animate-spin w-4 h-4' />
                                                                        Processing payment...
                                                                </span>
                                                        ) : (
                                                                `Pay ${totalPrice}`
                                                        )}
                                                </Button>
                                        </div>
                                </div>

                                {/* ── Right: order summary ────────────────────────────── */}
                                <div className='order-1 lg:order-2 lg:sticky lg:top-4 p-4 rounded-[10px] border border-gray-200 bg-white flex flex-col gap-5 w-full'>
                                        <h2 className='text-neutral-950 text-base font-semibold font-text'>
                                                Order Summary
                                        </h2>

                                        <div className='flex flex-col gap-3 w-full'>
                                                <div className='flex items-center gap-3 w-full'>
                                                        <div className='relative size-12 rounded-md overflow-clip shrink-0 bg-[#F3F4F6]'>
                                                                <Image
                                                                        src={imageUrl || '/images/swingrides-default-img.webp'}
                                                                        alt={vehicleName}
                                                                        width={240}
                                                                        height={160}
                                                                        className='aspect-48/32 w-full object-cover object-center'
                                                                />
                                                        </div>
                                                        <div className='flex flex-col gap-0.5 flex-1 min-w-0'>
                                                                <span className='text-[#1F2937] text-sm font-semibold font-text truncate'>
                                                                        {vehicleName}
                                                                </span>
                                                                <span className='text-[#1F2937] text-sm font-normal font-text truncate'>
                                                                        {vehicleType} - {vehicleGearType}
                                                                </span>

                                                        </div>
                                                        <span className='text-[#1F2937] text-sm font-medium font-text shrink-0'>
                                                                {duration} for {totalPrice}
                                                        </span>
                                                </div>
                                        </div>

                                        <Separator />

                                        <div className='flex flex-col gap-2 w-full'>
                                                <SummaryRow label='Subtotal' value={subTotalFee} />
                                                <SummaryRow
                                                        label={`Tax (${taxPercentageRate})`}
                                                        value={taxFee}
                                                />
                                                <SummaryRow label='Insurance Fee' value={insuranceFee} />
                                        </div>

                                        <Separator />

                                        <div className='flex items-center justify-between w-full'>
                                                <span className='text-gray-800 text-base font-bold font-text leading-6'>
                                                        Total Amount
                                                </span>
                                                <span className='text-blue-700 text-xl font-medium font-text leading-7'>
                                                        {totalPrice}
                                                </span>
                                        </div>
                                </div>
                        </div>
                </form>
        )
}

// ─── Countdown ────────────────────────────────────────────────────────────────

const CheckoutCountdown = ({
        durationSeconds,
        onExpire,
}: {
        durationSeconds: number
        onExpire?: () => void
}) => {
        const [secondsLeft, setSecondsLeft] = useState(durationSeconds)
        const hasExpiredRef = useRef(false)

        useEffect(() => {
                if (secondsLeft <= 0) {
                        if (!hasExpiredRef.current) {
                                hasExpiredRef.current = true
                                onExpire?.()
                        }
                        return
                }
                const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000)
                return () => clearTimeout(timer)
        }, [secondsLeft, onExpire])

        const minutes = Math.floor(Math.max(secondsLeft, 0) / 60)
        const seconds = Math.max(secondsLeft, 0) % 60
        const isCritical = secondsLeft <= 60
        const isWarning = secondsLeft > 60 && secondsLeft <= 300

        return (
                <div
                        className={cn(
                                'sticky top-0 z-20 flex items-center justify-center gap-2 py-2 px-4 rounded-[10px] border text-sm font-medium font-text',
                                isCritical
                                        ? 'bg-red-50 border-red-200 text-red-700'
                                        : isWarning
                                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                                : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                        )}
                >
                        <Clock className='w-4 h-4 shrink-0' />
                        {secondsLeft > 0 ? (
                                <span>
                                        Your checkout session expires in{' '}
                                        <strong className='tabular-nums'>{pad(minutes)}:{pad(seconds)}</strong>
                                </span>
                        ) : (
                                <span>Your checkout session has expired. Please refresh to start over.</span>
                        )}
                </div>
        )
}

// ─── Shared bits (mirrors newBookingForm conventions) ─────────────────────────

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

// ─── Skeleton (shown while the parent is still fetching the order summary) ────

const CheckoutFormSkeleton = () => (
        <div className='flex flex-col gap-4 w-full'>
                <Skeleton className='h-9 w-full rounded-[10px]' />
                <div className='grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4'>
                        <div className='order-2 lg:order-1 flex flex-col gap-4'>
                                <div className='p-4 rounded-[10px] border border-gray-200 flex flex-col gap-5'>
                                        <Skeleton className='h-4 w-40' />
                                        <Skeleton className='h-10 w-full' />
                                        <Skeleton className='h-10 w-full' />
                                </div>
                                <div className='p-4 rounded-[10px] border border-gray-200 flex flex-col gap-5'>
                                        <Skeleton className='h-4 w-32' />
                                        <Skeleton className='h-24 w-full' />
                                </div>
                        </div>
                        <div className='order-1 lg:order-2 p-4 rounded-[10px] border border-gray-200 flex flex-col gap-4'>
                                <Skeleton className='h-4 w-28' />
                                <Skeleton className='h-12 w-full' />
                                <Skeleton className='h-12 w-full' />
                                <Skeleton className='h-8 w-full' />
                        </div>
                </div>
        </div>
)
