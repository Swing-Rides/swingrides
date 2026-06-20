'use client'

import { useState } from 'react'
import { format, addDays, addMonths } from 'date-fns'
import { CalendarIcon, Loader2, AlertTriangle } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type SnoozeDuration = '1-day' | '1-week' | '1-month' | 'custom'

export type SnoozeFormValues = {
        duration: SnoozeDuration
        startDate: Date
        endDate: Date
}

type SnoozeFormProps = {
        defaultValues?: Partial<SnoozeFormValues>   // pass existing snooze when editing
        onCancel: () => void
        onSubmit: (values: SnoozeFormValues) => void | Promise<void>
}

const DURATION_OPTIONS: { value: SnoozeDuration; label: string }[] = [
        { value: '1-day', label: '1 Day' },
        { value: '1-week', label: '1 Week' },
        { value: '1-month', label: '1 Month' },
        { value: 'custom', label: 'Custom Date Range' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getTodayStart = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return today
}

const computeEndDate = (duration: SnoozeDuration, start: Date): Date => {
        switch (duration) {
                case '1-day': return addDays(start, 1)
                case '1-week': return addDays(start, 7)
                case '1-month': return addMonths(start, 1)
                default: return start
        }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SnoozeForm({ defaultValues, onCancel, onSubmit }: SnoozeFormProps) {
        const today = getTodayStart()

        const [duration, setDuration] = useState<SnoozeDuration>(defaultValues?.duration ?? '1-day')
        const [customRange, setCustomRange] = useState<DateRange | undefined>(
                defaultValues?.duration === 'custom' && defaultValues.startDate && defaultValues.endDate
                        ? { from: defaultValues.startDate, to: defaultValues.endDate }
                        : undefined
        )
        const [error, setError] = useState<string | null>(null)
        const [isSubmitting, setIsSubmitting] = useState(false)

        const isEditing = !!defaultValues

        const handleDurationChange = (value: SnoozeDuration) => {
                setDuration(value)
                setError(null)
                if (value !== 'custom') {
                        setCustomRange(undefined)
                }
        }

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault()
                setError(null)

                let startDate: Date
                let endDate: Date

                if (duration === 'custom') {
                        if (!customRange?.from || !customRange?.to) {
                                setError('Please select a start and end date')
                                return
                        }
                        startDate = customRange.from
                        endDate = customRange.to
                } else {
                        startDate = today
                        endDate = computeEndDate(duration, today)
                }

                setIsSubmitting(true)
                try {
                        await onSubmit({ duration, startDate, endDate })
                } finally {
                        setIsSubmitting(false)
                }
        }

        return (
                <form onSubmit={handleSubmit} className='flex flex-col gap-5 w-full' noValidate>
                        {/* Duration radio group */}
                        <div className='flex flex-col gap-3'>
                                <Label className='text-[#1F2937] text-sm font-semibold font-text'>
                                        Snooze Duration <span className='text-[#EF4444]'>*</span>
                                </Label>

                                <div className='flex flex-col gap-2'>
                                        {DURATION_OPTIONS.map((option) => (
                                                <label
                                                        key={option.value}
                                                        htmlFor={option.value}
                                                        className={cn(
                                                                'flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors duration-150',
                                                                duration === option.value
                                                                        ? 'border-[#1A56DB] bg-[#EBF0FB]'
                                                                        : 'border-[#E5E7EB] hover:bg-[#F9FAFB]'
                                                        )}
                                                >
                                                        <input
                                                                type='radio'
                                                                id={option.value}
                                                                name='duration'
                                                                value={option.value}
                                                                checked={duration === option.value}
                                                                onChange={() => handleDurationChange(option.value)}
                                                                className='accent-[#1A56DB] w-4 h-4 cursor-pointer'
                                                        />
                                                        <span className={cn(
                                                                'text-sm font-medium font-text',
                                                                duration === option.value ? 'text-[#1A56DB]' : 'text-[#1F2937]'
                                                        )}>
                                                                {option.label}
                                                        </span>
                                                </label>
                                        ))}
                                </div>
                        </div>

                        {/* Custom date range calendar — only shown when "custom" is selected */}
                        {duration === 'custom' && (
                                <div className='flex flex-col gap-2'>
                                        <Label className='text-[#1F2937] text-sm font-semibold font-text'>
                                                Select Date Range <span className='text-[#EF4444]'>*</span>
                                        </Label>
                                        <div className='border border-[#E5E7EB] rounded-md p-2 flex justify-center'>
                                                <Calendar
                                                        mode='range'
                                                        selected={customRange}
                                                        onSelect={setCustomRange}
                                                        disabled={(date) => date < today}
                                                        defaultMonth={customRange?.from ?? today}
                                                        numberOfMonths={1}
                                                        initialFocus
                                                />
                                        </div>
                                        {customRange?.from && customRange?.to && (
                                                <div className='flex items-center gap-2 text-sm font-text text-[#6B7280]'>
                                                        <CalendarIcon className='w-4 h-4 shrink-0' />
                                                        <span>
                                                                {format(customRange.from, 'MMM d, yyyy')} — {format(customRange.to, 'MMM d, yyyy')}
                                                        </span>
                                                </div>
                                        )}
                                </div>
                        )}

                        {/* Error */}
                        {error && (
                                <span className='text-[#EF4444] text-xs font-normal font-text flex items-center gap-1'>
                                        <AlertTriangle className='w-3 h-3 shrink-0' />
                                        {error}
                                </span>
                        )}

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
                                        className='bg-[#1A56DB] hover:bg-[#1E429F] text-white font-medium font-text cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none'
                                >
                                        {isSubmitting ? (
                                                <span className='flex items-center gap-2'>
                                                        <Loader2 className='animate-spin w-4 h-4' />
                                                        Saving...
                                                </span>
                                        ) : isEditing ? 'Update Snooze' : 'Set Snooze'}
                                </Button>
                        </div>
                </form>
        )
}