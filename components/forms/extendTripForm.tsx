'use client'

import { useMemo } from 'react'
import { differenceInCalendarDays, parseISO } from 'date-fns'

import MainForm from '@/components/forms/MainForm'
import { FormFieldConfig } from '@/components/forms/types'
import { validators } from '@/components/forms/form.validators'
import { formatCurrency } from '@/lib/pricing'
import { VehicleSchedule } from '@/types/public-vehicles.type'
import { useGetPublicVehicleByIdQuery } from '@/app/store/services/publicApi'
import {
    BUFFER_TIME,
    doesRentalPeriodOverlapSchedule as checkRentalPeriodOverlapSchedule,
    isReturnDateTimeAvailable as checkReturnDateTimeAvailable,
    isScheduleDateDisabled as checkScheduleDateDisabled,
} from '@/lib/vehicleBookingHelpers'

// ─── Types ───────────────────────────────────────────────────────────────────

export type ExtendTripFormValues = {
    newReturnDate: string
}

type ExtendTripFormProps = {
    /** ISO date string of the existing return date */
    currentReturnDate: string
    /** The daily rental rate in dollars (e.g. 85) */
    dailyRate: number
    /** The total already paid for this trip */
    currentTotal: number
    /** Vehicle ID to fetch schedule for availability checking */
    vehicleId: string
    onSubmit: (values: ExtendTripFormValues) => void | Promise<void>
    onClose: () => void
    isSubmitting?: boolean
}

export default function ExtendTripForm({
    currentReturnDate,
    dailyRate,
    currentTotal,
    vehicleId,
    onSubmit,
    onClose,
    isSubmitting,
}: ExtendTripFormProps) {
    // ─ Fetch vehicle schedule for availability checks ─────────────────────
    const { data } = useGetPublicVehicleByIdQuery({ id: vehicleId })

    const vehicleSchedule = useMemo<VehicleSchedule[]>(
        () => data?.data.vehicleSchedule ?? [],
        [data?.data.vehicleSchedule],
    )

    const isReturnDateTimeAvailable = useMemo(() => {
        return (returnDateTime: Date) =>
            checkReturnDateTimeAvailable(vehicleSchedule, returnDateTime, BUFFER_TIME)
    }, [vehicleSchedule])

    const doesRentalPeriodOverlapSchedule = useMemo(() => {
        return (pickupDateTime: Date, returnDateTime: Date) =>
            checkRentalPeriodOverlapSchedule(
                vehicleSchedule,
                pickupDateTime,
                returnDateTime,
                BUFFER_TIME,
            )
    }, [vehicleSchedule])

    const isScheduleDateDisabled = useMemo(() => {
        return (date: Date) =>
            checkScheduleDateDisabled(vehicleSchedule, date, BUFFER_TIME)
    }, [vehicleSchedule])

    // ─ Field config ───────────────────────────────────────────────────────
    const fields: FormFieldConfig[] = useMemo(
        () => [
            {
                name: 'currentReturnDate',
                type: 'datetime' as const,
                label: 'Current Return Date',
                defaultValue: currentReturnDate,
                disabled: true,
            },
            {
                name: 'newReturnDate',
                type: 'datetime' as const,
                label: 'New Return Date',
                placeholder: 'Pick a new date',
                minDate: currentReturnDate,
                isDateDisabled: (date: Date) => {
                    const current = parseISO(currentReturnDate)
                    if (date <= current) return true
                    return isScheduleDateDisabled(date)
                },
                validation: {
                    ...validators.required('New return date'),
                    validate: (value: string) => {
                        if (!value) return 'New return date is required'

                        const newDate = new Date(value)
                        const current = parseISO(currentReturnDate)

                        if (newDate <= current) {
                            return 'New return date must be after the current return date'
                        }

                        // Check if the extended period overlaps with any scheduled booking
                        if (doesRentalPeriodOverlapSchedule(current, newDate)) {
                            return 'This vehicle is already booked during part of your requested dates. Please select different dates.'
                        }

                        // Check if the new return datetime conflicts with any scheduled booking
                        if (!isReturnDateTimeAvailable(newDate)) {
                            return 'This vehicle is unavailable at this return time. Please select another date or time.'
                        }

                        return true
                    },
                },
            },
        ],
        [currentReturnDate, isScheduleDateDisabled, doesRentalPeriodOverlapSchedule, isReturnDateTimeAvailable],
    )

    return (
        <MainForm
            title="Extend Return Date"
            fields={fields}
            rowPairs={[['currentReturnDate', 'newReturnDate']]}
            onSubmit={(values) => onSubmit({ newReturnDate: values.newReturnDate as string })}
            isLoading={isSubmitting}
            submitLabel="Confirm Extension"
            footerSlot={(watchedValues) => (
                <ExtendTripSummary
                    currentReturnDate={currentReturnDate}
                    newReturnDate={watchedValues.newReturnDate as string | undefined}
                    dailyRate={dailyRate}
                    currentTotal={currentTotal}
                    onClose={onClose}
                />
            )}
        />
    )
}

// ─── Summary footer ──────────────────────────────────────────────────────────
type ExtendTripSummaryProps = {
    currentReturnDate: string
    newReturnDate?: string
    dailyRate: number
    currentTotal: number
    onClose: () => void
}

function ExtendTripSummary({
    currentReturnDate,
    newReturnDate,
    dailyRate,
    currentTotal,
    onClose,
}: ExtendTripSummaryProps) {
    const additionalDays = useMemo(() => {
        if (!newReturnDate) return 0
        const diff = differenceInCalendarDays(
            new Date(newReturnDate),
            parseISO(currentReturnDate),
        )
        return diff > 0 ? diff : 0
    }, [newReturnDate, currentReturnDate])

    const additionalCost = additionalDays * dailyRate
    const newTotal = currentTotal + additionalCost

    return (
        <>
            {/* Cost summary card */}
            <div className="p-4 bg-indigo-50 rounded-[10px] flex justify-between items-start gap-4">
                <div className="flex flex-col gap-0.5">
                    <span className="text-blue-700 text-sm font-semibold font-text leading-5">
                        Additional Days:{' '} {additionalDays > 0 ? `${additionalDays} days` : '— days'}
                    </span>
                    <span className="text-gray-500 text-xs font-normal font-text leading-4">
                        Extra charges apply at your current daily rate ({formatCurrency(dailyRate)}/day).
                    </span>
                </div>

                <div className="flex flex-col items-end gap-0.5 text-nowrap shrink-0">
                    <span className="text-gray-700 text-sm font-medium font-text leading-5">
                        Additional Cost:{' '} {additionalDays > 0 ? formatCurrency(additionalCost) : '$—'}
                    </span>
                    <span className="text-blue-700 text-base font-bold font-text leading-6">
                        New Total:{' '} {additionalDays > 0 ? formatCurrency(newTotal) : '$—'}
                    </span>
                </div>
            </div>

            {/* Cancel button */}
            <button
                type="button"
                onClick={onClose}
                className="w-full text-sm font-medium font-text leading-5 border border-gray-500 text-gray-500 rounded-xs py-2 px-4 bg-transparent hover:bg-black hover:text-white hover:border-black transition-colors duration-300 cursor-pointer"
            >
                Cancel
            </button>
        </>
    )
}
