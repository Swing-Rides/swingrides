'use client'

import { RegisterOptions, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { validators } from '@/components/forms/form.validators'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ConnectHostFormValues = {
        phoneNumber: string
}

export default function NotificationConnectHostForm() {

        const router = useRouter()

        const {
                register,
                handleSubmit,
                formState: { errors },
        } = useForm<ConnectHostFormValues>({ mode: 'onTouched' })

        const onSubmit = (values: ConnectHostFormValues) => {
                const params = new URLSearchParams()
                params.set('phone', values.phoneNumber)
                router.push(`/connect-host?${params.toString()}`)
        }

        return (
                <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-1.5 w-full'
                        noValidate
                >
                        <div className='flex items-center gap-2 w-full'>
                                <div className='flex flex-col gap-1 w-2/3'>
                                        <Input
                                                id='phoneNumber'
                                                type='tel'
                                                placeholder='+1 555-123-4567'
                                                autoComplete='tel'
                                                className={cn(
                                                        'py-1.5 px-4 rounded-xs border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF]',
                                                        errors.phoneNumber && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                                )}
                                                {...register('phoneNumber', validators.phone() as RegisterOptions<ConnectHostFormValues, 'phoneNumber'>)}
                                        />
                                </div>

                                <Button
                                        type='submit'
                                        className='w-1/3 py-1.5 px-4 bg-[#1A56DB] hover:bg-[#1E429F] rounded-xs text-white font-medium font-text cursor-pointer transition-colors duration-200 text-nowrap'
                                >
                                        <span className='hidden md:inline'>Connect →</span>
                                        <span className='inline md:hidden'>→</span>
                                </Button>
                        </div>

                        {errors.phoneNumber && (
                                <span className='text-[#EF4444] text-xs font-normal font-text flex items-center gap-1'>
                                        <ErrorIcon />
                                        {errors.phoneNumber.message as string}
                                </span>
                        )}
                </form>
        )
}

const ErrorIcon = () => (
        <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M6 1L11 10H1L6 1Z' stroke='#EF4444' strokeWidth='1' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M6 5V7' stroke='#EF4444' strokeWidth='1' strokeLinecap='round' />
                <circle cx='6' cy='8.5' r='0.5' fill='#EF4444' />
        </svg>
)