'use client'

import { useState } from 'react'
import { format, addDays, addMonths } from 'date-fns'
import { CalendarIcon, Clock, Loader2, AlertTriangle } from 'lucide-react'
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

const getDayStart = (d: Date) => {
        const copy = new Date(d)
        copy.setHours(0, 0, 0, 0)
        return copy
}

const applyTimeToDate = (date: Date, timeStr: string): Date => {
        const result = new Date(date)
        if (!timeStr) return result
        const [hoursStr, minutesStr] = timeStr.split(':')
        const hours = parseInt(hoursStr ?? '0', 10)
        const minutes = parseInt(minutesStr ?? '0', 10)
        result.setHours(isNaN(hours) ? 0 : hours, isNaN(minutes) ? 0 : minutes, 0, 0)
        return result
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
        const isEditing = !!defaultValues

        const minDate = isEditing && defaultValues?.startDate && defaultValues.startDate < today
                ? getDayStart(defaultValues.startDate)
                : today

        const startMonth = minDate
        const endMonth = new Date(today.getFullYear() + 10, 11)

        const [duration, setDuration] = useState<SnoozeDuration>(defaultValues?.duration ?? '1-day')
        const [customRange, setCustomRange] = useState<DateRange | undefined>(
                defaultValues?.duration === 'custom' && defaultValues.startDate && defaultValues.endDate
                        ? { from: defaultValues.startDate, to: defaultValues.endDate }
                        : undefined
        )
        const [startTime, setStartTime] = useState<string>(() => {
                if (defaultValues?.startDate) {
                        return format(defaultValues.startDate, 'HH:mm')
                }
                return ''
        })
        const [endTime, setEndTime] = useState<string>(() => {
                if (defaultValues?.endDate) {
                        return format(defaultValues.endDate, 'HH:mm')
                }
                return ''
        })
        const [error, setError] = useState<string | null>(null)
        const [isSubmitting, setIsSubmitting] = useState(false)

        const handleDurationChange = (value: SnoozeDuration) => {
                setDuration(value)
                setError(null)
                if (value !== 'custom') {
                        setCustomRange(undefined)
                }
        }

        const handleStartTimeChange = (value: string) => {
                setStartTime(value)
                setError(null)
        }

        const handleEndTimeChange = (value: string) => {
                setEndTime(value)
                setError(null)
        }

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault()
                setError(null)

                let startDate: Date
                let endDate: Date

                if (duration === 'custom') {
                        if (!customRange?.from || !customRange?.to) {
                                setError('Please select both a start and end date')
                                return
                        }
                        if (!startTime && !endTime) {
                                setError('Please select both start and end times')
                                return
                        }
                        if (!startTime) {
                                setError('Please select a start time')
                                return
                        }
                        if (!endTime) {
                                setError('Please select an end time')
                                return
                        }

                        startDate = applyTimeToDate(customRange.from, startTime)
                        endDate = applyTimeToDate(customRange.to, endTime)

                        if (endDate.getTime() <= startDate.getTime()) {
                                setError('End date and time must be after start date and time')
                                return
                        }
                } else {
                        if (!endTime) {
                                setError('Please select an end time')
                                return
                        }

                        const now = new Date()
                        startDate = now
                        const computedEnd = computeEndDate(duration, now)
                        endDate = applyTimeToDate(computedEnd, endTime)

                        if (endDate.getTime() <= startDate.getTime()) {
                                setError('End date and time must be in the future')
                                return
                        }
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

                        {/* End time selection for preset durations */}
                        {duration !== 'custom' && (
                                <div className='flex flex-col gap-3'>
                                        <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='preset-end-time' className='text-xs font-semibold font-text text-[#374151]'>
                                                        End Time <span className='text-[#EF4444]'>*</span>
                                                </Label>
                                                <div className='relative flex items-center'>
                                                        <Clock className='absolute left-3 size-4 text-[#9CA3AF] pointer-events-none' />
                                                        <input
                                                                type='time'
                                                                id='preset-end-time'
                                                                value={endTime}
                                                                onChange={(e) => handleEndTimeChange(e.target.value)}
                                                                className='w-full pl-9 pr-3 py-2 border border-[#E5E7EB] rounded-md text-sm font-text text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent transition-all'
                                                        />
                                                </div>
                                        </div>

                                        {/* Preset snooze preview */}
                                        <div className='flex items-center gap-2 text-xs font-text text-[#4B5563] bg-[#F9FAFB] border border-[#E5E7EB] rounded-md p-2.5'>
                                                <CalendarIcon className='w-4 h-4 text-[#1A56DB] shrink-0' />
                                                <span>
                                                        {endTime ? (
                                                                <>
                                                                        Snooze until{' '}
                                                                        <span className='font-medium text-[#111827]'>
                                                                                {format(applyTimeToDate(computeEndDate(duration, new Date()), endTime), 'MMM d, yyyy, h:mm a')}
                                                                        </span>
                                                                </>
                                                        ) : (
                                                                <span>
                                                                        Snooze until{' '}
                                                                        <span className='font-medium text-[#111827]'>
                                                                                {format(computeEndDate(duration, new Date()), 'MMM d, yyyy')}
                                                                        </span>
                                                                        <span className='text-[#6B7280]'> (Please pick an end time)</span>
                                                                </span>
                                                        )}
                                                </span>
                                        </div>
                                </div>
                        )}

                        {/* Custom date range calendar — only shown when "custom" is selected */}
                        {duration === 'custom' && (
                                <div className='flex flex-col gap-3'>
                                        <Label className='text-[#1F2937] text-sm font-semibold font-text'>
                                                Select Date Range <span className='text-[#EF4444]'>*</span>
                                        </Label>
                                        <div className='border border-[#E5E7EB] rounded-md p-2 flex justify-center'>
                                                <Calendar
                                                        mode='range'
                                                        captionLayout='dropdown'
                                                        startMonth={startMonth}
                                                        endMonth={endMonth}
                                                        selected={customRange}
                                                        onSelect={(range) => {
                                                                setCustomRange(range)
                                                                setError(null)
                                                        }}
                                                        disabled={(date) => date < minDate}
                                                        defaultMonth={customRange?.from ?? today}
                                                        numberOfMonths={1}
                                                        initialFocus
                                                />
                                        </div>

                                        {/* Time selection */}
                                        <div className='grid grid-cols-2 gap-3'>
                                                <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='snooze-start-time' className='text-xs font-semibold font-text text-[#374151]'>
                                                                Start Time <span className='text-[#EF4444]'>*</span>
                                                        </Label>
                                                        <div className='relative flex items-center'>
                                                                <Clock className='absolute left-3 size-4 text-[#9CA3AF] pointer-events-none' />
                                                                <input
                                                                        type='time'
                                                                        id='snooze-start-time'
                                                                        value={startTime}
                                                                        onChange={(e) => handleStartTimeChange(e.target.value)}
                                                                        className='w-full pl-9 pr-3 py-2 border border-[#E5E7EB] rounded-md text-sm font-text text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent transition-all'
                                                                />
                                                        </div>
                                                </div>

                                                <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='snooze-end-time' className='text-xs font-semibold font-text text-[#374151]'>
                                                                End Time <span className='text-[#EF4444]'>*</span>
                                                        </Label>
                                                        <div className='relative flex items-center'>
                                                                <Clock className='absolute left-3 size-4 text-[#9CA3AF] pointer-events-none' />
                                                                <input
                                                                        type='time'
                                                                        id='snooze-end-time'
                                                                        value={endTime}
                                                                        onChange={(e) => handleEndTimeChange(e.target.value)}
                                                                        className='w-full pl-9 pr-3 py-2 border border-[#E5E7EB] rounded-md text-sm font-text text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent transition-all'
                                                                />
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Range & Time Summary */}
                                        {customRange?.from && (
                                                <div className='flex items-center gap-2 text-xs font-text text-[#4B5563] bg-[#F9FAFB] border border-[#E5E7EB] rounded-md p-2.5'>
                                                        <CalendarIcon className='w-4 h-4 text-[#1A56DB] shrink-0' />
                                                        <span className='truncate'>
                                                                {customRange.to ? (
                                                                        <>
                                                                                <span className='font-medium text-[#111827]'>
                                                                                        {startTime
                                                                                                ? format(applyTimeToDate(customRange.from, startTime), 'MMM d, yyyy, h:mm a')
                                                                                                : format(customRange.from, 'MMM d, yyyy')}
                                                                                </span>
                                                                                {!startTime && <span className='text-[#6B7280]'> (Pick start time)</span>}
                                                                                {' — '}
                                                                                <span className='font-medium text-[#111827]'>
                                                                                        {endTime
                                                                                                ? format(applyTimeToDate(customRange.to, endTime), 'MMM d, yyyy, h:mm a')
                                                                                                : format(customRange.to, 'MMM d, yyyy')}
                                                                                </span>
                                                                                {!endTime && <span className='text-[#6B7280]'> (Pick end time)</span>}
                                                                        </>
                                                                ) : (
                                                                        <>
                                                                                <span className='font-medium text-[#111827]'>
                                                                                        {startTime
                                                                                                ? format(applyTimeToDate(customRange.from, startTime), 'MMM d, yyyy, h:mm a')
                                                                                                : format(customRange.from, 'MMM d, yyyy')}
                                                                                </span>
                                                                                {!startTime && <span className='text-[#6B7280]'> (Pick start time)</span>}
                                                                                <span className='text-[#6B7280]'> (Select an end date)</span>
                                                                        </>
                                                                )}
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