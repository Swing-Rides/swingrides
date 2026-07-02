'use client'

import { useForm } from 'react-hook-form'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export type UnlistVehicleFormValues = {
        reason: string
}

type UnlistVehicleFormProps = {
        snoozeEnd: string;
        onCancel: () => void;
        onSubmit: (values: UnlistVehicleFormValues) => void | Promise<void>;
}

export default function UnlistVehicleForm({ snoozeEnd, onCancel, onSubmit }: UnlistVehicleFormProps) {
        const {
                register,
                handleSubmit,
                formState: { errors, isSubmitting },
        } = useForm<UnlistVehicleFormValues>({ mode: 'onTouched' })

        const onFormSubmit = async (values: UnlistVehicleFormValues) => {
                await onSubmit(values)
        }

        return (
                <form
                        onSubmit={handleSubmit(onFormSubmit)}
                        className='flex flex-col gap-4 w-full'
                        noValidate
                >
                        {/* Snooze notification */}
                        <div className='flex items-start gap-2 bg-amber-500/10 p-3 rounded-[10px] text-amber-500'>
                                <AlertTriangle className='w-4 h-4 shrink-0 mt-0.5' />
                                <span className='text-sm font-medium font-text leading-5'>
                                        Snoozed until {snoozeEnd} — vehicle will automatically relist on {snoozeEnd}.
                                </span>
                        </div>

                        {/* Reason for unlisting */}
                        <div className='flex flex-col gap-1.5'>
                                <Label
                                        htmlFor='reason'
                                        className='text-[#1F2937] text-sm font-semibold font-text'
                                >
                                        Reason for Unlisting <span className='text-[#EF4444]'>*</span>
                                </Label>
                                <Textarea
                                        id='reason'
                                        placeholder='e.g. Sending for repairs, taking a break from renting...'
                                        rows={4}
                                        className={cn(
                                                'resize-none font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF]',
                                                errors.reason
                                                        ? 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                                        : 'border-[#E5E7EB] focus-visible:ring-[#1A56DB]'
                                        )}
                                        {...register('reason', { required: 'Please provide a reason for unlisting' })}
                                />
                                {errors.reason && (
                                        <span className='text-[#EF4444] text-xs font-normal font-text flex items-center gap-1'>
                                                <AlertTriangle className='w-3 h-3 shrink-0' />
                                                {errors.reason.message}
                                        </span>
                                )}
                        </div>

                        {/* Actions */}
                        <div className='flex gap-3 justify-end pt-1'>
                                <Button
                                        type='button'
                                        variant='outline'
                                        onClick={onCancel}
                                        className='border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] font-medium font-text cursor-pointer transition-colors duration-300'
                                >
                                        Cancel
                                </Button>
                                <Button
                                        type='submit'
                                        disabled={isSubmitting}
                                        className='bg-red-500 hover:bg-red-900 text-white font-medium font-text cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none'
                                >
                                        {isSubmitting ? (
                                                <span className='flex items-center gap-2'>
                                                        <Loader2 className='animate-spin size-4' />
                                                        Unlisting...
                                                </span>
                                        ) : 'Unlist Vehicle'}
                                </Button>
                        </div>
                </form>
        )
}