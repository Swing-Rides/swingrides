'use client'

import { ReactNode, useState, useMemo, use, Suspense } from 'react'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
        AlertTriangle,
        Upload,
} from 'lucide-react'
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from '@/components/ui/select'
import { Controller, useFormContext } from 'react-hook-form'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { CheckInData, CheckOutFormValues, FuelLevelValue } from './checkOutPage'


type StepTwoProps = {
        fetchCheckInData: () => Promise<CheckInData>
}


const FUEL_LEVEL_OPTIONS: FuelLevelValue[] = [
        '1/8', '2/8', '3/8', '4/8', '5/8', '6/8', '7/8', '8/8 (Full)',
]

const DAMAGE_TYPES = [
        'Scratch / Paint Damage',
        'Dent',
        'Broken Glass / Mirror',
        'Interior Damage',
        'Mechanical Issue',
        'Tire / Wheel Damage',
        'Other',
]

const parseFuelEighths = (level: string): number => {
        const match = level.match(/^(\d)\/8/)
        return match ? Number(match[1]) : 0
}

export default function StepTwo ({ fetchCheckInData }: StepTwoProps) {
        return (
                <Suspense fallback={<StepTwoSkeleton />}>
                        <StepTwoInner fetchCheckInData={fetchCheckInData} />
                </Suspense>
        )
}

const StepTwoInner = ({ fetchCheckInData }: StepTwoProps) => {
        // Stable promise — fetched once per mount since fetchCheckInData is
        // expected to be a stable reference (useCallback) from the parent
        const checkInDataPromise = useMemo(() => fetchCheckInData(), [fetchCheckInData])
        const checkInData = use(checkInDataPromise)

        const { control, register, watch } = useFormContext<CheckOutFormValues>()
        const checkoutFuelLevel = watch('checkoutFuelLevel')
        const damageStatus = watch('damageStatus')

        const checkInEighths = parseFuelEighths(checkInData.fuelLevel)
        const checkOutEighths = checkoutFuelLevel ? parseFuelEighths(checkoutFuelLevel) : null
        const isFuelLower = checkOutEighths !== null && checkOutEighths < checkInEighths

        return (
                <div className='shrink grow basis-132.5 p-4 bg-gray-50 rounded-[10px] border border-gray-200 flex flex-col justify-start items-start gap-4 w-full'>
                        <h3 className='text-neutral-950 text-base font-medium font-text'>
                                Post-Trip Vehicle Inspection
                        </h3>
                        <Separator />

                        {/* Section 1: Vehicle Condition Comparison */}
                        <FormSection title='Vehicle Condition Comparison'>
                                <div className='grid grid-cols-2 gap-3 w-full'>
                                        <PhotoDisplayBox
                                                label='Before (Check-In)'
                                                imageUrl={checkInData.photoUrl}
                                        />
                                        <PhotoUploadBox
                                                label='After (Check-Out)'
                                                control={control}
                                        />
                                </div>
                        </FormSection>

                        <Separator />

                        {/* Section 2: Return Mileage */}
                        <FormSection title='Return Mileage'>
                                <div className='grid grid-cols-2 gap-3 w-full'>
                                        <ReadOnlyField
                                                label='Check-In Mileage'
                                                value={`${checkInData.mileage.toLocaleString()} mi`}
                                        />
                                        <FormRow label='Check-Out Mileage' htmlFor='checkoutMileage'>
                                                <Controller
                                                        name='checkoutMileage'
                                                        control={control}
                                                        rules={{
                                                                required: 'Check-out mileage is required',
                                                                min: {
                                                                        value: checkInData.mileage,
                                                                        message: `Cannot be less than check-in mileage (${checkInData.mileage.toLocaleString()} mi)`,
                                                                },
                                                        }}
                                                        render={({ field, fieldState }) => (
                                                                <>
                                                                        <Input
                                                                                id='checkoutMileage'
                                                                                type='number'
                                                                                placeholder='e.g. 24650'
                                                                                className={cn(
                                                                                        'rounded-xs font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] w-full',
                                                                                        fieldState.error
                                                                                                ? 'border-red-500 focus-visible:ring-red-500'
                                                                                                : 'border-[#E5E7EB] focus-visible:ring-blue-700'
                                                                                )}
                                                                                {...field}
                                                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                                                value={field.value ?? ''}
                                                                        />
                                                                        {fieldState.error && (
                                                                                <span className='text-red-500 text-xs font-normal font-text flex items-center gap-1 mt-1.5'>
                                                                                        <AlertTriangle className='w-3 h-3 shrink-0' />
                                                                                        {fieldState.error.message}
                                                                                </span>
                                                                        )}
                                                                </>
                                                        )}
                                                />
                                        </FormRow>
                                </div>
                        </FormSection>

                        <Separator />

                        {/* Section 3: Return Fuel Level */}
                        <FormSection title='Return Fuel Level'>
                                <div className='grid grid-cols-2 gap-3 w-full'>
                                        <ReadOnlyField
                                                label='Check-In Fuel Level'
                                                value={checkInData.fuelLevel}
                                        />
                                        <FormRow label='Check-Out Fuel Level' htmlFor='checkoutFuelLevel'>
                                                <Controller
                                                        name='checkoutFuelLevel'
                                                        control={control}
                                                        rules={{ required: 'Please select the fuel level' }}
                                                        render={({ field, fieldState }) => (
                                                                <>
                                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                                                <SelectTrigger
                                                                                        id='checkoutFuelLevel'
                                                                                        className='rounded-xs border-[#E5E7EB] focus:ring-blue-700 font-text text-sm w-full'
                                                                                >
                                                                                        <SelectValue placeholder='Select fuel level' />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                        {FUEL_LEVEL_OPTIONS.map(level => (
                                                                                                <SelectItem key={level} value={level} className='font-text text-sm'>
                                                                                                        {level}
                                                                                                </SelectItem>
                                                                                        ))}
                                                                                </SelectContent>
                                                                        </Select>
                                                                        {fieldState.error && (
                                                                                <span className='text-red-500 text-xs font-normal font-text flex items-center gap-1 mt-1.5'>
                                                                                        <AlertTriangle className='w-3 h-3 shrink-0' />
                                                                                        {fieldState.error.message}
                                                                                </span>
                                                                        )}
                                                                </>
                                                        )}
                                                />
                                        </FormRow>
                                </div>

                                {isFuelLower && <FuelWarningNotice />}
                        </FormSection>

                        <Separator />

                        {/* Section 4: Vehicle Damage Reported? */}
                        <FormSection title='Vehicle Damage Reported?'>
                                <Controller
                                        name='damageStatus'
                                        control={control}
                                        rules={{ required: 'Please select an option' }}
                                        render={({ field, fieldState }) => (
                                                <>
                                                        <div className='grid grid-cols-2 gap-3 w-full'>
                                                                <button
                                                                        type='button'
                                                                        onClick={() => field.onChange('none')}
                                                                        className={cn(
                                                                                'py-2.5 px-4 rounded-xs border text-sm font-medium font-text transition-colors duration-200 cursor-pointer',
                                                                                field.value === 'none'
                                                                                        ? 'bg-emerald-500 text-white border-emerald-500'
                                                                                        : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                                                                        )}
                                                                >
                                                                        No Damage
                                                                </button>
                                                                <button
                                                                        type='button'
                                                                        onClick={() => field.onChange('damage')}
                                                                        className={cn(
                                                                                'py-2.5 px-4 rounded-xs border text-sm font-medium font-text transition-colors duration-200 cursor-pointer',
                                                                                field.value === 'damage'
                                                                                        ? 'bg-red-500 text-white border-red-500'
                                                                                        : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                                                                        )}
                                                                >
                                                                        Damage Found
                                                                </button>
                                                        </div>
                                                        {fieldState.error && (
                                                                <span className='text-red-500 text-xs font-normal font-text flex items-center gap-1 mt-1.5'>
                                                                        <AlertTriangle className='w-3 h-3 shrink-0' />
                                                                        {fieldState.error.message}
                                                                </span>
                                                        )}
                                                </>
                                        )}
                                />

                                {damageStatus === 'damage' && (
                                        <div className='flex flex-col gap-3 w-full'>
                                                <FormRow label='Damage Type' htmlFor='damageType'>
                                                        <Controller
                                                                name='damageType'
                                                                control={control}
                                                                rules={{ required: 'Please select a damage type' }}
                                                                render={({ field, fieldState }) => (
                                                                        <>
                                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                                        <SelectTrigger
                                                                                                id='damageType'
                                                                                                className={cn(
                                                                                                        'rounded-xs font-text text-sm w-full',
                                                                                                        fieldState.error
                                                                                                                ? 'border-red-500 focus:ring-red-500'
                                                                                                                : 'border-[#E5E7EB] focus:ring-blue-700'
                                                                                                )}
                                                                                        >
                                                                                                <SelectValue placeholder='Select damage type' />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                {DAMAGE_TYPES.map(type => (
                                                                                                        <SelectItem key={type} value={type} className='font-text text-sm'>
                                                                                                                {type}
                                                                                                        </SelectItem>
                                                                                                ))}
                                                                                        </SelectContent>
                                                                                </Select>
                                                                                {fieldState.error && (
                                                                                        <span className='text-red-500 text-xs font-normal font-text flex items-center gap-1 mt-1.5'>
                                                                                                <AlertTriangle className='w-3 h-3 shrink-0' />
                                                                                                {fieldState.error.message}
                                                                                        </span>
                                                                                )}
                                                                        </>
                                                                )}
                                                        />
                                                </FormRow>

                                                <FormRow label='Damage Description' htmlFor='damageDescription'>
                                                        <Textarea
                                                                id='damageDescription'
                                                                placeholder='Describe the damage in detail...'
                                                                style={{ height: '80px' }}
                                                                className='resize-none font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] border-[#E5E7EB] focus-visible:ring-blue-700'
                                                                {...register('damageDescription', {
                                                                        required: 'Please describe the damage',
                                                                })}
                                                        />
                                                </FormRow>

                                                <DamageReportNotice />
                                        </div>
                                )}
                        </FormSection>
                </div>
        )
}

const StepTwoSkeleton = () => (
        <div className='shrink grow basis-132.5 p-4 bg-gray-50 rounded-[10px] border border-gray-200 flex flex-col gap-4 w-full'>
                <Skeleton className='h-5 w-48' />
                <Skeleton className='h-px w-full' />
                <div className='grid grid-cols-2 gap-3 w-full'>
                        <Skeleton className='h-32 w-full rounded-md' />
                        <Skeleton className='h-32 w-full rounded-md' />
                </div>
                <div className='grid grid-cols-2 gap-3 w-full'>
                        <Skeleton className='h-10 w-full' />
                        <Skeleton className='h-10 w-full' />
                </div>
        </div>
)

// ─── Step 2 shared bits ────────────────────────────────────────────────────────

const FormSection = ({ title, children }: { title: string; children: ReactNode }) => (
        <div className='flex flex-col gap-3 w-full'>
                <span className='text-gray-800 text-sm font-semibold font-text leading-5'>
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
        children: ReactNode
}

const FormRow = ({ label, htmlFor, children }: FormRowProps) => (
        <div className='flex flex-col gap-1.5'>
                <Label htmlFor={htmlFor} className='text-gray-500 text-xs font-semibold font-text uppercase'>
                        {label}
                </Label>
                {children}
        </div>
)

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
        <div className='flex flex-col gap-1.5'>
                <span className='text-gray-500 text-xs font-semibold font-text uppercase'>
                        {label}
                </span>
                <div className='px-3 py-2.5 rounded-xs border border-[#E5E7EB] bg-[#F3F4F6] text-[#6B7280] text-sm font-text'>
                        {value}
                </div>
        </div>
)

const PhotoDisplayBox = ({ label, imageUrl }: { label: string; imageUrl: string }) => (
        <div className='flex flex-col gap-1.5'>
                <span className='text-gray-500 text-xs font-semibold font-text uppercase'>
                        {label}
                </span>
                <div className='relative w-full aspect-video rounded-md overflow-clip border border-[#E5E7EB] bg-[#F3F4F6]'>
                        <Image
                                src={imageUrl}
                                alt={label}
                                fill
                                className='object-cover object-center'
                        />
                </div>
        </div>
)

const PhotoUploadBox = ({
        label,
        control,
}: {
        label: string
        control: ReturnType<typeof useFormContext<CheckOutFormValues>>['control']
}) => {
        const [preview, setPreview] = useState<string | null>(null)

        return (
                <Controller
                        name='checkoutPhoto'
                        control={control}
                        rules={{ required: 'Please upload an after-checkout photo' }}
                        render={({ field, fieldState }) => (
                                <div className='flex flex-col gap-1.5'>
                                        <span className='text-gray-500 text-xs font-semibold font-text uppercase'>
                                                {label}
                                        </span>
                                        <label
                                                htmlFor='checkoutPhoto'
                                                className={cn(
                                                        'relative flex flex-col items-center justify-center gap-1.5 w-full aspect-video rounded-md border-2 border-dashed cursor-pointer transition-colors duration-200 overflow-clip',
                                                        fieldState.error
                                                                ? 'border-red-500 bg-red-50'
                                                                : 'border-[#E5E7EB] hover:border-blue-700'
                                                )}
                                        >
                                                {preview ? (
                                                        <Image
                                                                src={preview}
                                                                alt='After checkout'
                                                                fill
                                                                className='object-cover object-center'
                                                        />
                                                ) : (
                                                        <>
                                                                <Upload className={cn(
                                                                        'size-5',
                                                                        fieldState.error ? 'text-red-500' : 'text-[#9CA3AF]'
                                                                )} />
                                                                <span className={cn(
                                                                        'text-xs font-medium font-text text-center px-2',
                                                                        fieldState.error ? 'text-red-500' : 'text-blue-700'
                                                                )}>
                                                                        Click to upload
                                                                </span>
                                                        </>
                                                )}
                                                <input
                                                        id='checkoutPhoto'
                                                        type='file'
                                                        accept='image/png, image/jpeg'
                                                        className='hidden'
                                                        onChange={(e) => {
                                                                field.onChange(e.target.files)
                                                                const file = e.target.files?.[0]
                                                                if (file) setPreview(URL.createObjectURL(file))
                                                        }}
                                                />
                                        </label>
                                        {fieldState.error && (
                                                <span className='text-red-500 text-xs font-normal font-text flex items-center gap-1'>
                                                        <AlertTriangle className='w-3 h-3 shrink-0' />
                                                        {fieldState.error.message}
                                                </span>
                                        )}
                                </div>
                        )}
                />
        )
}

const FuelWarningNotice = () => (
        <div className='flex items-start gap-2 p-3 bg-amber-500/10 rounded-md text-amber-600 w-full'>
                <AlertTriangle className='w-4 h-4 shrink-0 mt-0.5' />
                <span className='text-sm font-medium font-text leading-5'>
                        Fuel level is lower than check-in. You can charge the renter for the shortfall via Charge for Incidentals after checkout is complete.
                </span>
        </div>
)

const DamageReportNotice = () => (
        <div className='flex items-start gap-2 p-3 bg-red-500/10 rounded-md text-red-600 w-full'>
                <AlertTriangle className='w-4 h-4 shrink-0 mt-0.5' />
                <span className='text-sm font-medium font-text leading-5'>
                        Submitting this report will create a priority ticket for the SwingRides admin team.
                </span>
        </div>
)
