'use client'

import { useState } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { Star, Loader2, AlertTriangle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type CategoryKey =
        | 'vehicleCondition'
        | 'vehiclePerformance'
        | 'cleanliness'
        | 'hostCommunication'
        | 'pickupExperience'
        | 'valueForMoney'

type Recommendation = 'yes' | 'no'

export type RateTripFormValues = {
        categoryRatings: Record<CategoryKey, number>
        review: string
        recommend: Recommendation | ''
}

type RateTripFormProps = {
        onSubmit: (values: RateTripFormValues) => void | Promise<void>
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORIES: { id: CategoryKey; label: string }[] = [
        { id: 'vehicleCondition', label: 'Vehicle Condition' },
        { id: 'vehiclePerformance', label: 'Vehicle Performance' },
        { id: 'cleanliness', label: 'Cleanliness' },
        { id: 'hostCommunication', label: 'Host Communication' },
        { id: 'pickupExperience', label: 'Pickup Experience' },
        { id: 'valueForMoney', label: 'Value for Money' },
]

const DEFAULT_RATINGS: Record<CategoryKey, number> = {
        vehicleCondition: 0,
        vehiclePerformance: 0,
        cleanliness: 0,
        hostCommunication: 0,
        pickupExperience: 0,
        valueForMoney: 0,
}

const MAX_REVIEW_CHARS = 500

const OVERALL_LABELS: Record<number, string> = {
        0: 'Not yet rated',
        1: '1 out of 5',
        2: '2 out of 5',
        3: '3 out of 5',
        4: '4 out of 5',
        5: '5 out of 5',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const computeAverage = (ratings: Record<CategoryKey, number>): number => {
        const values = Object.values(ratings)
        const rated = values.filter(v => v > 0)
        if (rated.length === 0) return 0
        return rated.reduce((sum, v) => sum + v, 0) / rated.length
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RateTripForm({ onSubmit }: RateTripFormProps) {
        const {
                control,
                register,
                handleSubmit,
                formState: { errors, isSubmitting },
        } = useForm<RateTripFormValues>({
                mode: 'onTouched',
                defaultValues: {
                        categoryRatings: DEFAULT_RATINGS,
                        review: '',
                        recommend: '',
                },
        })

        const categoryRatings = useWatch({ control, name: 'categoryRatings' })
        const review = useWatch({ control, name: 'review' }) ?? ''

        const rawAverage = computeAverage(categoryRatings ?? DEFAULT_RATINGS)
        const roundedAverage = Math.round(rawAverage)

        const onFormSubmit = async (values: RateTripFormValues) => {
                await onSubmit(values)
        }

        return (
                <form
                        onSubmit={handleSubmit(onFormSubmit)}
                        className='flex flex-col gap-6'
                        noValidate
                >
                        {/* ── Form card ─────────────────────────────────────── */}
                        <div className='p-8 bg-white rounded-[10px] border border-gray-200 flex flex-col gap-6'>

                                {/* Overall experience — read-only computed stars */}
                                <div className='flex flex-col gap-3'>
                                        <span className='text-neutral-950 text-base font-semibold font-text leading-6'>
                                                Overall Experience
                                        </span>
                                        <div className='flex flex-col items-center gap-2'>
                                                <StarRow value={roundedAverage} size={32} />
                                                <span className='text-gray-500 text-sm font-normal font-text'>
                                                        {OVERALL_LABELS[roundedAverage]}
                                                </span>
                                        </div>
                                </div>

                                <Separator />

                                {/* Per-category ratings */}
                                <Controller
                                        name='categoryRatings'
                                        control={control}
                                        rules={{
                                                validate: (value) => {
                                                        const allRated = CATEGORIES.every(c => (value?.[c.id] ?? 0) > 0)
                                                        return allRated || 'Please rate all categories'
                                                },
                                        }}
                                        render={({ field, fieldState }) => (
                                                <div className='flex flex-col gap-4'>
                                                        {CATEGORIES.map(category => (
                                                                <div
                                                                        key={category.id}
                                                                        className='flex items-center justify-between gap-3'
                                                                >
                                                                        <span className='text-[#1F2937] text-sm font-medium font-text'>
                                                                                {category.label}
                                                                        </span>
                                                                        <StarRow
                                                                                value={field.value?.[category.id] ?? 0}
                                                                                size={22}
                                                                                onChange={(rating) =>
                                                                                        field.onChange({
                                                                                                ...field.value,
                                                                                                [category.id]: rating,
                                                                                        })
                                                                                }
                                                                        />
                                                                </div>
                                                        ))}
                                                        {fieldState.error && (
                                                                <FieldError message={fieldState.error.message as string} />
                                                        )}
                                                </div>
                                        )}
                                />

                                <Separator />

                                {/* Review textarea */}
                                <div className='flex flex-col gap-2'>
                                        <Label
                                                htmlFor='review'
                                                className='text-neutral-950 text-sm font-semibold font-text'
                                        >
                                                Write a Review
                                        </Label>
                                        <Textarea
                                                id='review'
                                                placeholder='Share your experience with this car and host. What did you enjoy? What could be improved?'
                                                rows={8}
                                                maxLength={MAX_REVIEW_CHARS}
                                                className='resize-none h-40 font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] border-[#E5E7EB] focus-visible:ring-blue-700'
                                                {...register('review', {
                                                        maxLength: {
                                                                value: MAX_REVIEW_CHARS,
                                                                message: `Review cannot exceed ${MAX_REVIEW_CHARS} characters`,
                                                        },
                                                })}
                                        />
                                        <div className='flex items-center justify-between'>
                                                <span className='text-[#9CA3AF] text-xs font-normal font-text'>
                                                        Share your experience with this car and host. What did you enjoy? What could be improved?
                                                </span>
                                                <span className={cn(
                                                        'text-xs font-normal font-text tabular-nums shrink-0',
                                                        review.length >= MAX_REVIEW_CHARS ? 'text-red-500' : 'text-[#9CA3AF]'
                                                )}>
                                                        {review.length} / {MAX_REVIEW_CHARS}
                                                </span>
                                        </div>
                                        {errors.review && <FieldError message={errors.review.message as string} />}
                                </div>

                                <Separator />

                                {/* Recommend buttons */}
                                <Controller
                                        name='recommend'
                                        control={control}
                                        rules={{ required: 'Please select a recommendation' }}
                                        render={({ field, fieldState }) => (
                                                <div className='flex flex-col gap-3'>
                                                        <span className='text-neutral-950 text-sm font-semibold font-text'>
                                                                Would you recommend this car to other renters?
                                                        </span>
                                                        <div className='flex gap-3'>
                                                                <button
                                                                        type='button'
                                                                        onClick={() => field.onChange('yes')}
                                                                        className={cn(
                                                                                'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xs border text-sm font-medium font-text transition-colors duration-300 cursor-pointer',
                                                                                field.value === 'yes'
                                                                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                                                                        : 'border-emerald-500 bg-emerald-100 text-emerald-500 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-600'
                                                                        )}
                                                                >
                                                                        <span>👍</span>
                                                                        Yes, Recommend
                                                                </button>
                                                                <button
                                                                        type='button'
                                                                        onClick={() => field.onChange('no')}
                                                                        className={cn(
                                                                                'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xs border text-sm font-medium font-text transition-colors duration-300 cursor-pointer',
                                                                                field.value === 'no'
                                                                                        ? 'bg-gray-500 border-gray-500 text-white'
                                                                                        : 'bg-transparent border-gray-500 text-gray-500 hover:bg-gray-100'
                                                                        )}
                                                                >
                                                                        <span>👎</span>
                                                                        Not Really
                                                                </button>
                                                        </div>
                                                        {fieldState.error && (
                                                                <FieldError message={fieldState.error.message as string} />
                                                        )}
                                                </div>
                                        )}
                                />
                        </div>

                        {/* ── Submit — outside the card ────────────────────── */}
                        <button
                                type='submit'
                                disabled={isSubmitting}
                                className='w-full py-3 px-10 bg-[#1A56DB] hover:bg-blue-900 text-white font-medium font-text rounded-xs cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2'
                        >
                                {isSubmitting ? (
                                        <>
                                                <Loader2 className='animate-spin w-4 h-4' />
                                                Submitting...
                                        </>
                                ) : 'Submit Review'}
                        </button>
                </form>
        )
}

// ─── Star row (clickable or read-only) ────────────────────────────────────────

type StarRowProps = {
        value: number
        onChange?: (value: number) => void
        size?: number
}

const StarRow = ({ value, onChange, size = 24 }: StarRowProps) => {
        const [hovered, setHovered] = useState<number | null>(null)
        const interactive = !!onChange
        const displayValue = hovered ?? value

        return (
                <div className='flex items-center gap-1'>
                        {[1, 2, 3, 4, 5].map((star) => {
                                const filled = star <= displayValue
                                return (
                                        <button
                                                key={star}
                                                type='button'
                                                disabled={!interactive}
                                                onClick={() => onChange?.(star)}
                                                onMouseEnter={() => interactive && setHovered(star)}
                                                onMouseLeave={() => interactive && setHovered(null)}
                                                className={cn(
                                                        'transition-transform duration-100',
                                                        interactive
                                                                ? 'cursor-pointer hover:scale-110'
                                                                : 'cursor-default'
                                                )}
                                                aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                                        >
                                                <Star
                                                        width={size}
                                                        height={size}
                                                        fill={filled ? '#F59E0B' : 'none'}
                                                        stroke={filled ? '#F59E0B' : '#6B7280'}
                                                        strokeWidth={1.5}
                                                />
                                        </button>
                                )
                        })}
                </div>
        )
}

// ─── Field error ──────────────────────────────────────────────────────────────

const FieldError = ({ message }: { message: string }) => (
        <span className='text-red-500 text-xs font-normal font-text flex items-center gap-1'>
                <AlertTriangle className='w-3 h-3 shrink-0' />
                {message}
        </span>
)