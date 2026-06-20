'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Phone, MessageSquare, AlertTriangle, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { validators } from '@/components/forms/form.validators'
import { RegisterOptions } from 'react-hook-form'

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_SMS_CHARS = 160

// ─── Types ────────────────────────────────────────────────────────────────────

type SendSmsFormValues = {
        phoneNumber: string
        message: string
}

type SendSmsFormProps = {
        defaultPhone?: string
        onSubmit?: (values: SendSmsFormValues) => void | Promise<void>
}

// ─── Placeholder submit ───────────────────────────────────────────────────────

const sendSms = async (values: SendSmsFormValues) => {
        // TODO: replace with real API / SMS gateway call
        // await fetch('/api/sms/send', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(values),
        // })
        console.log('sending SMS:', values)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SendSmsForm({
        defaultPhone = '',
        onSubmit: onSubmitProp,
}: SendSmsFormProps) {
        const [charCount, setCharCount] = useState(0)

        const {
                register,
                handleSubmit,
                formState: { errors, isSubmitting },
        } = useForm<SendSmsFormValues>({
                mode: 'onTouched',
                defaultValues: {
                        phoneNumber: defaultPhone,
                        message: '',
                },
        })

        const onSubmit = async (values: SendSmsFormValues) => {
                if (onSubmitProp) {
                        await onSubmitProp(values)
                } else {
                        await sendSms(values)
                }
        }

        return (
                <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-4 w-full'
                        noValidate
                >
                        {/* 1. Renter Phone Number */}
                        <div className='flex flex-col gap-1.5'>
                                <Label
                                        htmlFor='phoneNumber'
                                        className='text-gray-500 text-xs font-semibold font-text uppercase'
                                >
                                        Renter Phone Number
                                        <span className='text-[#EF4444] ml-1'>*</span>
                                </Label>
                                <div className='relative flex items-center'>
                                        <span className='absolute left-3 text-[#9CA3AF] pointer-events-none'>
                                                <Phone className='w-4 h-4' />
                                        </span>
                                        <Input
                                                id='phoneNumber'
                                                type='tel'
                                                placeholder='+1 802 555 0123'
                                                autoComplete='tel'
                                                className={cn(
                                                        'pl-9 border-[#E5E7EB] rounded-xs focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF]',
                                                        errors.phoneNumber && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                                )}
                                                {...register(
                                                        'phoneNumber',
                                                        validators.phone() as RegisterOptions<SendSmsFormValues, 'phoneNumber'>
                                                )}
                                        />
                                </div>
                                {errors.phoneNumber && (
                                        <FieldError message={errors.phoneNumber.message as string} />
                                )}
                        </div>

                        {/* 2. Message */}
                        <div className='flex flex-col gap-1.5'>
                                <div className='flex items-center justify-between'>
                                        <Label
                                                htmlFor='message'
                                                className='text-gray-500 text-xs font-semibold font-text uppercase'
                                        >
                                                Message
                                                <span className='text-[#EF4444] ml-1'>*</span>
                                        </Label>
                                        <span className={cn(
                                                'text-xs font-normal font-text tabular-nums',
                                                charCount >= MAX_SMS_CHARS
                                                        ? 'text-[#EF4444]'
                                                        : charCount >= MAX_SMS_CHARS * 0.85
                                                                ? 'text-amber-500'
                                                                : 'text-[#9CA3AF]'
                                        )}>
                                                {charCount} / {MAX_SMS_CHARS}
                                        </span>
                                </div>
                                <div className='relative'>
                                        <MessageSquare className='absolute left-3 top-3 w-4 h-4 text-[#9CA3AF] pointer-events-none' />
                                        <Textarea
                                                id='message'
                                                placeholder='Type your SMS message here...'
                                                maxLength={MAX_SMS_CHARS}
                                                className={cn(
                                                        'pl-9 resize-none font-text text-sm rounded-xs text-[#1F2937] placeholder:text-[#9CA3AF]',
                                                        'h-50',
                                                        errors.message
                                                                ? 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                                                : 'border-[#E5E7EB] focus-visible:ring-[#1A56DB]'
                                                )}
                                                {...register('message', {
                                                        required: 'Message is required',
                                                        minLength: {
                                                                value: 5,
                                                                message: 'Message must be at least 5 characters',
                                                        },
                                                        maxLength: {
                                                                value: MAX_SMS_CHARS,
                                                                message: `Message cannot exceed ${MAX_SMS_CHARS} characters`,
                                                        },
                                                        onChange: (e) => setCharCount(e.target.value.length),
                                                })}
                                        />
                                </div>
                                {errors.message && (
                                        <FieldError message={errors.message.message as string} />
                                )}
                                <span className='text-[#9CA3AF] text-xs font-normal font-text'>
                                        Standard SMS messages are 160 characters. Longer messages may be split into multiple SMS segments.
                                </span>
                        </div>

                        {/* Send button — right aligned */}
                        <div className='flex justify-end'>
                                <Button
                                        type='submit'
                                        disabled={isSubmitting}
                                        className='bg-blue-700 hover:bg-blue-900 text-white font-medium font-text rounded-xs cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none'
                                >
                                        {isSubmitting
                                                ? (
                                                        <span className='flex items-center gap-2'>
                                                                <Loader2 className='animate-spin w-4 h-4' />
                                                                Sending...
                                                        </span>
                                                )
                                                : 'Send SMS'
                                        }
                                </Button>
                        </div>
                </form>
        )
}

// ─── Field error ──────────────────────────────────────────────────────────────

const FieldError = ({ message }: { message: string }) => (
        <span className='text-[#EF4444] text-xs font-normal font-text flex items-center gap-1'>
                <AlertTriangle className='w-3 h-3 shrink-0' />
                {message}
        </span>
)