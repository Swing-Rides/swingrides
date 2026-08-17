'use client'

import { memo, ReactNode, useMemo, use, Suspense } from 'react'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle } from 'lucide-react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { CheckInData, CheckOutFormValues, FuelLevelValue } from './checkOutPage'
import { FormField } from '@/components/forms/MainForm'

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

export default memo(function StepTwo ({ fetchCheckInData }: StepTwoProps) {
        return (
                <Suspense fallback={<StepTwoSkeleton />}>
                        <StepTwoInner fetchCheckInData={fetchCheckInData} />
                </Suspense>
        )
})

const StepTwoInner = memo(function StepTwoInner ({ fetchCheckInData }: StepTwoProps) {
        // Stable promise — fetched once per mount since fetchCheckInData is
        // expected to be a stable reference (useCallback) from the parent
        const checkInDataPromise = useMemo(() => fetchCheckInData(), [fetchCheckInData])
        const checkInData = use(checkInDataPromise)

        const { control, register, getValues, formState: { errors } } = useFormContext<CheckOutFormValues>()

        return (
                <div className='shrink grow basis-132.5 p-4 bg-gray-50 rounded-[10px] border border-gray-200 flex flex-col justify-start items-start gap-4 w-full'>
                        <h3 className='text-neutral-950 text-base font-medium font-text'>
                                Post-Trip Vehicle Inspection
                        </h3>
                        <Separator />

                        {/* Section 1: Vehicle Condition Comparison */}
                        <FormSection title='Vehicle Condition Comparison'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full items-start'>
                                        <PhotoDisplayBox
                                                label='Before (Check-In)'
                                                imageUrl={checkInData.photoUrl}
                                        />
                                        <FormField
                                                field={{
                                                        name: 'checkoutPhoto',
                                                        type: 'image',
                                                        label: 'After (Check-Out)',
                                                        accept: 'image/png, image/jpeg',
                                                        validation: { required: 'Please upload an after-checkout photo' },
                                                }}
                                                register={register}
                                                control={control}
                                                getValues={getValues}
                                                errors={errors}
                                        />
                                </div>
                        </FormSection>

                        <Separator />

                        {/* Section 2: Return Mileage */}
                        <FormSection title='Return Mileage'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full items-start'>
                                        <ReadOnlyField
                                                label='Check-In Mileage'
                                                value={`${checkInData.mileage.toLocaleString()} mi`}
                                        />
                                        <FormField
                                                field={{
                                                        name: 'checkoutMileage',
                                                        type: 'number',
                                                        label: 'Check-Out Mileage',
                                                        placeholder: 'e.g. 24650',
                                                        validation: {
                                                                required: 'Check-out mileage is required',
                                                                min: {
                                                                        value: checkInData.mileage,
                                                                        message: `Cannot be less than check-in mileage (${checkInData.mileage.toLocaleString()} mi)`,
                                                                },
                                                                valueAsNumber: true,
                                                        },
                                                }}
                                                register={register}
                                                control={control}
                                                getValues={getValues}
                                                errors={errors}
                                        />
                                </div>
                        </FormSection>

                        <Separator />

                        {/* Section 3: Return Fuel Level */}
                        <FormSection title='Return Fuel Level'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full items-start'>
                                        <ReadOnlyField
                                                label='Check-In Fuel Level'
                                                value={checkInData.fuelLevel}
                                        />
                                        <FormField
                                                field={{
                                                        name: 'checkoutFuelLevel',
                                                        type: 'select',
                                                        label: 'Check-Out Fuel Level',
                                                        placeholder: 'Select fuel level',
                                                        options: FUEL_LEVEL_OPTIONS.map(level => ({ label: level, value: level })),
                                                        validation: { required: 'Please select the fuel level' },
                                                }}
                                                register={register}
                                                control={control}
                                                getValues={getValues}
                                                errors={errors}
                                        />
                                </div>

                                <FuelWarningNotice checkInFuelLevel={checkInData.fuelLevel} />
                        </FormSection>

                        <Separator />

                        {/* Section 4: Vehicle Damage Reported? */}
                        <DamageSection />
                </div>
        )
})

const DamageSection = memo(function DamageSection() {
        const { control, register, getValues, formState: { errors } } = useFormContext<CheckOutFormValues>()
        const damageStatus = useWatch<CheckOutFormValues, 'damageStatus'>({ name: 'damageStatus' })

        return (
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
                                        <FormField
                                                field={{
                                                        name: 'damageType',
                                                        type: 'select',
                                                        label: 'Damage Type',
                                                        placeholder: 'Select damage type',
                                                        options: DAMAGE_TYPES.map(type => ({ label: type, value: type })),
                                                        validation: { required: 'Please select a damage type' },
                                                }}
                                                register={register}
                                                control={control}
                                                getValues={getValues}
                                                errors={errors}
                                        />

                                        <FormField
                                                field={{
                                                        name: 'damageDescription',
                                                        type: 'textarea',
                                                        label: 'Damage Description',
                                                        placeholder: 'Describe the damage in detail...',
                                                        height: 80,
                                                        validation: { required: 'Please describe the damage' },
                                                }}
                                                register={register}
                                                control={control}
                                                getValues={getValues}
                                                errors={errors}
                                        />

                                        <DamageReportNotice />
                                </div>
                        )}
                </FormSection>
        )
})

const StepTwoSkeleton = memo(function StepTwoSkeleton() {
        return (
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
})

// ─── Step 2 shared bits ────────────────────────────────────────────────────────

const FormSection = memo(function FormSection({ title, children }: { title: string; children: ReactNode }) {
        return (
                <div className='flex flex-col gap-3 w-full'>
                        <span className='text-gray-800 text-sm font-semibold font-text leading-5'>
                                {title}
                        </span>
                        <div className='flex flex-col gap-3 w-full'>
                                {children}
                        </div>
                </div>
        )
})

const ReadOnlyField = memo(function ReadOnlyField({ label, value }: { label: string; value: string }) {
        return (
                <div className='flex flex-col gap-1.5'>
                        <span className='text-gray-500 text-xs font-semibold font-text uppercase'>
                                {label}
                        </span>
                        <div className='px-3 py-2.5 rounded-xs border border-[#E5E7EB] bg-[#F3F4F6] text-[#6B7280] text-sm font-text'>
                                {value}
                        </div>
                </div>
        )
})

const PhotoDisplayBox = memo(function PhotoDisplayBox({ label, imageUrl }: { label: string; imageUrl: string }) {
        return (
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
})

const FuelWarningNotice = memo(function FuelWarningNotice({ checkInFuelLevel }: { checkInFuelLevel: FuelLevelValue }) {
        const checkoutFuelLevel = useWatch<CheckOutFormValues, 'checkoutFuelLevel'>({ name: 'checkoutFuelLevel' })
        const checkInEighths = parseFuelEighths(checkInFuelLevel)
        const checkOutEighths = checkoutFuelLevel ? parseFuelEighths(checkoutFuelLevel) : null
        const isFuelLower = checkOutEighths !== null && checkOutEighths < checkInEighths

        if (!isFuelLower) return null

        return (
                <div className='flex items-start gap-2 p-3 bg-amber-500/10 rounded-md text-amber-600 w-full'>
                        <AlertTriangle className='w-4 h-4 shrink-0 mt-0.5' />
                        <span className='text-sm font-medium font-text leading-5'>
                                Fuel level is lower than check-in. You can charge the renter for the shortfall via Charge for Incidentals after checkout is complete.
                        </span>
                </div>
        )
})

const DamageReportNotice = memo(function DamageReportNotice() {
        return (
                <div className='flex items-start gap-2 p-3 bg-red-500/10 rounded-md text-red-600 w-full'>
                        <AlertTriangle className='w-4 h-4 shrink-0 mt-0.5' />
                        <span className='text-sm font-medium font-text leading-5'>
                                Submitting this report will create a priority ticket for the SwingRides admin team.
                        </span>
                </div>
        )
})
