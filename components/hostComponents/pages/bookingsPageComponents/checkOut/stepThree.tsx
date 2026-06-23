import { Controller, useFormContext } from 'react-hook-form'
import { CheckOutFormValues, DEFAULT_CATEGORY_RATINGS, RATING_CATEGORIES } from './checkOutPage'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import StarRating from './starRating'



const MAX_REVIEW_CHARS = 500

const formatAverage = (avg: number) => {
        const display = Number.isInteger(avg) ? `${avg}` : avg.toFixed(1)
        return `${display} out of 5`
}

export default function StepThree() {
        const { control, register, watch } = useFormContext<CheckOutFormValues>()

        const categoryRatings = watch('categoryRatings') ?? DEFAULT_CATEGORY_RATINGS
        const reviewNotes = watch('reviewNotes') ?? ''

        const ratingValues = RATING_CATEGORIES.map(c => categoryRatings[c.id] ?? 0)
        const average = ratingValues.reduce((sum, v) => sum + v, 0) / RATING_CATEGORIES.length
        const roundedAverage = Math.round(average)

        return (
                <div className='shrink grow basis-132.5 p-4 bg-gray-50 rounded-[10px] border border-gray-200 flex flex-col justify-start items-start gap-4 w-full'>
                        <div className='flex flex-col gap-1'>
                                <h3 className='text-neutral-950 text-base font-medium font-text'>
                                        Rate Renter (optional)
                                </h3>
                                <span className='text-gray-500 text-sm font-medium font-text'>
                                        Rate your overall experience
                                </span>
                        </div>

                        <Separator />

                        {/* Overall average — read-only, computed from category ratings below */}
                        <div className='flex flex-col items-center gap-1 w-full'>
                                <StarRating value={roundedAverage} size={28} />
                                <span className='text-gray-500 text-sm font-normal font-text'>
                                        {formatAverage(average)}
                                </span>
                        </div>

                        <Separator />

                        {/* Per-category ratings */}
                        <Controller
                                name='categoryRatings'
                                control={control}
                                render={({ field }) => (
                                        <div className='flex flex-col gap-3 w-full'>
                                                {RATING_CATEGORIES.map((category) => (
                                                        <div
                                                                key={category.id}
                                                                className='flex items-center justify-between gap-3'
                                                        >
                                                                <span className='text-[#1F2937] text-sm font-medium font-text'>
                                                                        {category.label}
                                                                </span>
                                                                <StarRating
                                                                        value={field.value?.[category.id] ?? 0}
                                                                        size={20}
                                                                        onChange={(rating) =>
                                                                                field.onChange({
                                                                                        ...field.value,
                                                                                        [category.id]: rating,
                                                                                })
                                                                        }
                                                                />
                                                        </div>
                                                ))}
                                        </div>
                                )}
                        />

                        <Separator />

                        {/* Review textarea */}
                        <div className='flex flex-col gap-1.5 w-full'>
                                <Label
                                        htmlFor='reviewNotes'
                                        className='text-gray-500 text-xs font-semibold font-text uppercase'
                                >
                                        Write a Review
                                </Label>
                                <Textarea
                                        id='reviewNotes'
                                        placeholder='Additional notes about renter (optional)'
                                        rows={4}
                                        maxLength={MAX_REVIEW_CHARS}
                                        className='resize-none font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] border-[#E5E7EB] focus-visible:ring-blue-700'
                                        {...register('reviewNotes', {
                                                maxLength: {
                                                        value: MAX_REVIEW_CHARS,
                                                        message: `Review cannot exceed ${MAX_REVIEW_CHARS} characters`,
                                                },
                                        })}
                                />
                                <span className={cn(
                                        'self-end text-xs font-normal font-text',
                                        reviewNotes.length >= MAX_REVIEW_CHARS ? 'text-red-500' : 'text-gray-400'
                                )}>
                                        {reviewNotes.length} / {MAX_REVIEW_CHARS}
                                </span>
                        </div>
                </div>
        )
}