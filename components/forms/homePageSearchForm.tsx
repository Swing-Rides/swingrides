'use client'

import { useForm, Controller, Control, FieldValues, Path, RegisterOptions, useWatch } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { CalendarIcon, MapPinIcon, SearchIcon } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
        Popover,
        PopoverContent,
        PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { validators } from './form.validators'

type SearchFormValues = {
        pickupLocation: string
        pickupDatetime: string
        returnDatetime: string
        differentReturnLocation: boolean
        returnLocation?: string
}

export default function HomePageSearchForm() {
        const router = useRouter()
        const [differentLocation, setDifferentLocation] = useState(false)

        const {
                register,
                handleSubmit,
                control,     
                formState: { errors, isValid },
        } = useForm<SearchFormValues>({
                mode: 'onTouched',
                reValidateMode: 'onChange',  // ← revalidate on every change
        })

        // Watch both datetime values so validation reacts in real time
        const pickupDatetime = useWatch({ control, name: 'pickupDatetime' })
        const returnDatetime = useWatch({ control, name: 'returnDatetime' })

        const returnBeforePickup =
                pickupDatetime &&
                returnDatetime &&
                new Date(returnDatetime) <= new Date(pickupDatetime)

        const onSubmit = (values: SearchFormValues) => {
                const params = new URLSearchParams()
                params.set('pickup', values.pickupLocation)
                params.set('pickupDatetime', values.pickupDatetime)
                params.set('returnDatetime', values.returnDatetime)
                if (values.differentReturnLocation && values.returnLocation) {
                        params.set('returnLocation', values.returnLocation)
                }
                router.push(`/browse-cars?${params.toString()}`)
        }

        return (
                <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-4 w-full'
                        noValidate
                >
                        {/* Row 1 — 3 inputs side by side on desktop */}
                        <div className='flex flex-col md:flex-row gap-3 w-full'>

                                {/* Pick-up location */}
                                <div className='flex flex-col gap-1.5 w-full'>
                                        <Label
                                                htmlFor='pickupLocation'
                                                className='text-[#1F2937] text-sm font-semibold font-text'
                                        >
                                                Pick-up Location <span className='text-[#EF4444]'>*</span>
                                        </Label>
                                        <div className='relative flex items-center'>
                                                <span className='absolute left-3 text-[#9CA3AF] pointer-events-none'>
                                                        <MapPinIcon className='size-4 text-[#1A56DB]' />
                                                </span>
                                                <Input
                                                        id='pickupLocation'
                                                        type='text'
                                                        placeholder='City, airport or address'
                                                        autoComplete='street-address'
                                                        className={cn(
                                                                'pl-9 border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF]',
                                                                errors.pickupLocation && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                                        )}
                                                        {...register('pickupLocation', validators.required('Pick-up location') as RegisterOptions<SearchFormValues, 'pickupLocation'>)}
                                                />
                                        </div>
                                        {errors.pickupLocation && (
                                                <FieldError message={errors.pickupLocation.message as string} />
                                        )}
                                </div>

                                {/* Pick-up date & time */}
                                <div className='flex flex-col gap-1.5 w-full'>
                                        <Label
                                                htmlFor='pickupDatetime'
                                                className='text-[#1F2937] text-sm font-semibold font-text'
                                        >
                                                Pick-up Date & Time <span className='text-[#EF4444]'>*</span>
                                        </Label>
                                        <DateTimePickerField<SearchFormValues>
                                                name='pickupDatetime'
                                                control={control}
                                                placeholder='Select pick-up date & time'
                                                error={errors.pickupDatetime?.message as string}
                                                rules={{ required: 'Pick-up date & time is required' }}
                                        />
                                        {errors.pickupDatetime && (
                                                <FieldError message={errors.pickupDatetime.message as string} />
                                        )}
                                </div>

                                {/* Return date & time */}
                                <div className='flex flex-col gap-1.5 w-full'>
                                        <Label
                                                htmlFor='returnDatetime'
                                                className='text-[#1F2937] text-sm font-semibold font-text'
                                        >
                                                Return Date & Time <span className='text-[#EF4444]'>*</span>
                                        </Label>
                                        <DateTimePickerField<SearchFormValues>
                                                name='returnDatetime'
                                                control={control}
                                                placeholder='Select return date & time'
                                                minDate={pickupDatetime ? new Date(pickupDatetime) : undefined}
                                                error={
                                                        errors.returnDatetime?.message as string
                                                        ?? (returnBeforePickup ? 'Return must be after pick-up date & time' : undefined)
                                                }
                                                rules={{
                                                        required: 'Return date & time is required',
                                                        validate: (value: string) => {
                                                                if (!pickupDatetime) return true
                                                                return new Date(value) > new Date(pickupDatetime)
                                                                        ? true
                                                                        : 'Return must be after pick-up date & time'
                                                        },
                                                }}
                                        />
                                        {errors.returnDatetime && (
                                                <FieldError message={errors.returnDatetime.message as string} />
                                        )}
                                </div>
                        </div>

                        {/* Optional return location — shown when checkbox is checked */}
                        {differentLocation && (
                                <div className='flex flex-col gap-1.5 w-full md:max-w-sm'>
                                        <Label
                                                htmlFor='returnLocation'
                                                className='text-[#1F2937] text-sm font-semibold font-text'
                                        >
                                                Return Location <span className='text-[#EF4444]'>*</span>
                                        </Label>
                                        <div className='relative flex items-center'>
                                                <span className='absolute left-3 text-[#9CA3AF] pointer-events-none'>
                                                        <MapPinIcon className='size-4 text-[#1A56DB]' />
                                                </span>
                                                <Input
                                                        id='returnLocation'
                                                        type='text'
                                                        placeholder='Different return city or address'
                                                        autoComplete='street-address'
                                                        className={cn(
                                                                'pl-9 border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF]',
                                                                errors.returnLocation && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                                        )}
                                                        {...register('returnLocation', {
                                                                required: differentLocation ? 'Return location is required' : false,
                                                        } as RegisterOptions<SearchFormValues, 'returnLocation'>)}
                                                />
                                        </div>
                                        {errors.returnLocation && (
                                                <FieldError message={errors.returnLocation.message as string} />
                                        )}
                                </div>
                        )}

                        {/* Row 2 — checkbox left, button right */}
                        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                                <div className='flex items-center gap-2'>
                                        <Checkbox
                                                id='differentReturnLocation'
                                                checked={differentLocation}
                                                onCheckedChange={(checked) => setDifferentLocation(!!checked)}
                                                className='border-[#E5E7EB] data-[state=checked]:bg-[#1A56DB] data-[state=checked]:border-[#1A56DB]'
                                        />
                                        <label
                                                htmlFor='differentReturnLocation'
                                                className='text-[#6B7280] text-sm font-normal font-text cursor-pointer select-none'
                                        >
                                                Return car at a different location
                                        </label>
                                </div>

                                <Button
                                        type='submit'
                                        disabled={!isValid || !!returnBeforePickup}
                                        className={cn(
                                                'flex items-center gap-2 text-white font-medium font-text transition-colors duration-200 md:w-auto w-full',
                                                !isValid || returnBeforePickup
                                                        ? 'bg-[#93C5FD] cursor-not-allowed'
                                                        : 'bg-[#1A56DB] hover:bg-[#1E429F] cursor-pointer'
                                        )}
                                >
                                        <SearchIcon className='w-4 h-4' />
                                        Search Available Cars
                                </Button>
                        </div>
                </form>
        )
}

// ─── Shared datetime picker ───────────────────────────────────────────────────

type DateTimePickerFieldProps<T extends FieldValues> = {
        name: Path<T>
        control: Control<T>
        placeholder?: string
        error?: string
        minDate?: Date        // ← add this
        rules?: Omit<RegisterOptions<T>, 'deps' | 'validate'> & {
                validate?: (value: string, formValues: T) => boolean | string | undefined
        }
}

const DateTimePickerField = <T extends FieldValues>({
        name,
        control,
        placeholder,
        error,
        minDate,
        rules,
}: DateTimePickerFieldProps<T>) => {
        return (
                <Controller
                        name={name}
                        control={control}
                        defaultValue={'' as never}
                        rules={rules}
                        render={({ field }) => {
                                const parsed = field.value ? new Date(field.value) : undefined

                                const handleDateChange = (date?: Date) => {
                                        if (!date) return
                                        const base = field.value ? new Date(field.value) : new Date()
                                        date.setHours(base.getHours(), base.getMinutes())
                                        field.onChange(date.toISOString())
                                }

                                const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                        const [hours, minutes] = e.target.value.split(':').map(Number)
                                        const base = field.value ? new Date(field.value) : new Date()
                                        base.setHours(hours, minutes)
                                        field.onChange(base.toISOString())
                                }

                                const timeValue = parsed
                                        ? `${String(parsed.getHours()).padStart(2, '0')}:${String(parsed.getMinutes()).padStart(2, '0')}`
                                        : ''

                                return (
                                        <Popover>
                                                <PopoverTrigger asChild>
                                                        <Button
                                                                id={name}
                                                                type='button'
                                                                variant='outline'
                                                                className={cn(
                                                                        'w-full justify-start text-left font-normal border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm',
                                                                        !parsed && 'text-[#9CA3AF]',
                                                                        error && 'border-[#EF4444] focus-visible:ring-[#EF4444] text-xs'
                                                                )}
                                                        >
                                                                <CalendarIcon className='mr-2 size-4 text-[#1A56DB] shrink-0' />
                                                                {parsed
                                                                        ? `${format(parsed, 'MMM d, yyyy')} at ${format(parsed, 'h:mm a')}`
                                                                        : placeholder ?? 'Pick date & time'
                                                                }
                                                        </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-auto p-0 font-text' align='start'>
                                                        <Calendar
                                                                mode='single'
                                                                selected={parsed}
                                                                onSelect={handleDateChange}
                                                                disabled={(date) => {
                                                                        const today = new Date(new Date().setHours(0, 0, 0, 0))
                                                                        if (minDate) {          // ← use minDate directly, not field.minDate
                                                                                const minDay = new Date(new Date(minDate).setHours(0, 0, 0, 0))
                                                                                return date < today || date < minDay
                                                                        }
                                                                        return date < today
                                                                }}
                                                                initialFocus
                                                        />
                                                        <div className='border-t border-[#E5E7EB] p-3 flex flex-col gap-1.5'>
                                                                <label className='text-[#6B7280] text-xs font-semibold font-text uppercase tracking-wide'>
                                                                        Time
                                                                </label>
                                                                <input
                                                                        type='time'
                                                                        value={timeValue}
                                                                        onChange={handleTimeChange}
                                                                        className='w-full border border-[#E5E7EB] rounded-md px-3 py-2 text-sm font-text text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent'
                                                                />
                                                        </div>
                                                </PopoverContent>
                                        </Popover>
                                )
                        }}
                />
        )
}

// ─── Error message ────────────────────────────────────────────────────────────

const FieldError = ({ message }: { message: string }) => (
        <span className='text-[#EF4444] text-xs font-normal font-text flex items-center gap-1'>
                <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M6 1L11 10H1L6 1Z' stroke='#EF4444' strokeWidth='1' strokeLinecap='round' strokeLinejoin='round' />
                        <path d='M6 5V7' stroke='#EF4444' strokeWidth='1' strokeLinecap='round' />
                        <circle cx='6' cy='8.5' r='0.5' fill='#EF4444' />
                </svg>
                {message}
        </span>
)