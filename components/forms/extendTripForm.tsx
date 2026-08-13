'use client'

import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { differenceInCalendarDays, parse, parseISO } from 'date-fns'

import { FormField, LoadingSpinner } from '@/components/forms/MainForm'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
    type PriceConfig,
    computePricing,
    computeInsuranceFee,
    computeTotal,
    formatCurrency,
    pluralize,
} from '@/lib/pricing'
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
    currentReturnDate: string
    newReturnDate: string
}

type ExtendTripFormProps = {
    /** ISO date string of the existing return date */
    currentReturnDate: string
    /** Full tiered pricing config (daily/weekly/monthly) */
    rentalRate: PriceConfig
    /** Total amount previously paid for this booking */
    currentTotal: number
    /** Vehicle ID to fetch schedule for availability checking */
    vehicleId: string
    /** Per-day insurance fee charged when host provides coverage */
    insuranceFeePerDay: number
    /** Whether the host provides insurance coverage */
    hostProvidingCoverage: boolean
    /** Tax rate percentage (e.g. 8.25) */
    taxRate: number
    onSubmit: (values: ExtendTripFormValues) => void | Promise<void>
    onClose: () => void
    isSubmitting?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const parseDateSafely = (dateVal: string | Date | undefined): Date | null => {
    if (!dateVal) return null
    if (dateVal instanceof Date) return isNaN(dateVal.getTime()) ? null : dateVal

    // Try standard ISO
    try {
        const iso = parseISO(dateVal)
        if (!isNaN(iso.getTime())) return iso
    } catch {}

    // Try native constructor
    const d = new Date(dateVal)
    if (!isNaN(d.getTime())) return d

    // Try 'MMM d, yyyy'
    try {
        const parsed = parse(dateVal, 'MMM d, yyyy', new Date())
        if (!isNaN(parsed.getTime())) return parsed
    } catch {}

    // Try 'yyyy-MM-dd'
    try {
        const parsed = parse(dateVal, 'yyyy-MM-dd', new Date())
        if (!isNaN(parsed.getTime())) return parsed
    } catch {}

    return null
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ExtendTripForm({
    currentReturnDate,
    rentalRate,
    currentTotal,
    vehicleId,
    insuranceFeePerDay,
    hostProvidingCoverage,
    taxRate,
    onSubmit,
    onClose,
    isSubmitting,
}: ExtendTripFormProps) {
    const {
        register,
        handleSubmit,
        control,
        getValues,
        formState: { errors },
    } = useForm<ExtendTripFormValues>({
        mode: 'onChange',
        defaultValues: {
            currentReturnDate,
            newReturnDate: '',
        },
    })

    // Live reactive value — drives the summary immediately as user picks date
    const newReturnDate = useWatch({ control, name: 'newReturnDate' })

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

    // ─ Derived summary calculations using pricing helpers ─────────────────
    const extraDays = useMemo(() => {
        if (!newReturnDate) return 0
        const newD = parseDateSafely(newReturnDate)
        const currD = parseDateSafely(currentReturnDate)
        if (!newD || !currD) return 0

        const diff = differenceInCalendarDays(newD, currD)
        return diff > 0 ? diff : 0
    }, [newReturnDate, currentReturnDate])

    const summary = useMemo(() => {
        if (extraDays <= 0) return null

        const pricing = computePricing(rentalRate, extraDays)
        const insuranceFee = computeInsuranceFee(
            extraDays,
            insuranceFeePerDay,
            hostProvidingCoverage,
        )
        const totalBreakdown = computeTotal(
            pricing.total,
            insuranceFee,
            taxRate,
        )

        return {
            days: extraDays,
            breakdown: pricing.lineItems,
            subtotal: pricing.total,
            insuranceFee,
            taxRate,
            taxAmount: totalBreakdown.tax,
            additionalCost: totalBreakdown.totalAmount,
            newTotal: currentTotal + totalBreakdown.totalAmount,
        }
    }, [extraDays, rentalRate, currentTotal, insuranceFeePerDay, hostProvidingCoverage, taxRate])

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
        >
            {/* Section label */}
            <Label className="text-zinc-500 text-xs font-semibold font-text uppercase tracking-wider">
                Extend Return Date
            </Label>

            {/* Date fields row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    field={{
                        name: 'currentReturnDate',
                        type: 'datetime',
                        label: 'Current Return Date',
                        defaultValue: currentReturnDate,
                        disabled: true,
                    }}
                    register={register}
                    control={control}
                    getValues={getValues}
                    errors={errors}
                />

                <FormField
                    field={{
                        name: 'newReturnDate',
                        type: 'datetime',
                        label: 'New Return Date',
                        placeholder: 'Pick a new date',
                        minDate: currentReturnDate,
                        isDateDisabled: (date: Date) => {
                            const current = parseDateSafely(currentReturnDate)
                            if (current && date <= current) return true
                            return isScheduleDateDisabled(date)
                        },
                        validation: {
                            required: 'New return date is required',
                            validate: (value: string) => {
                                if (!value) return 'New return date is required'

                                const newDate = parseDateSafely(value)
                                const current = parseDateSafely(currentReturnDate)

                                if (!newDate || !current) return 'Invalid date selected'

                                if (newDate <= current) {
                                    return 'New return date must be after the current return date'
                                }

                                if (doesRentalPeriodOverlapSchedule(current, newDate)) {
                                    return 'This vehicle is already booked during part of your requested dates. Please select different dates.'
                                }

                                if (!isReturnDateTimeAvailable(newDate)) {
                                    return 'This vehicle is unavailable at this return time. Please select another date or time.'
                                }

                                return true
                            },
                        },
                    }}
                    register={register}
                    control={control}
                    getValues={getValues}
                    errors={errors}
                />
            </div>

            {/* ── Summary Card (with Breakdown, Insurance & Tax) ─────────── */}
            <div className="p-4 bg-[#EBF0FB] rounded-[10px] flex flex-col gap-3">
                {/* Top header row */}
                <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-blue-700 text-sm font-semibold font-text leading-5">
                            Additional Days:{' '}
                            {extraDays > 0 ? pluralize(extraDays, 'day') : '— days'}
                        </span>
                        <span className="text-gray-500 text-xs font-normal font-text leading-4">
                            Extra charges apply at your current daily rate ({formatCurrency(rentalRate?.daily ?? 0)}/day).
                        </span>
                    </div>

                    <div className="flex flex-col items-end gap-0.5 text-nowrap shrink-0">
                        <span className="text-blue-700 text-sm font-medium font-text leading-5">
                            Additional Cost:{' '}
                            {summary ? formatCurrency(summary.additionalCost) : '$—'}
                        </span>
                        <span className="text-blue-700 text-base font-bold font-text leading-6">
                            New Total:{' '}
                            {summary ? formatCurrency(summary.newTotal) : '$—'}
                        </span>
                    </div>
                </div>

                {/* Detailed cost breakdown with Insurance & Tax */}
                {summary && (
                    <>
                        <Separator className="bg-blue-200" />

                        <div className="flex flex-col gap-1.5 text-xs font-text">
                            {summary.breakdown.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-gray-600">
                                    <span>{item.label}</span>
                                    <span className="font-medium text-gray-500">{formatCurrency(item.total)}</span>
                                </div>
                            ))}

                            <div className="flex justify-between items-center text-gray-700 font-medium">
                                <span>Extension Subtotal</span>
                                <span className="text-gray-900">{formatCurrency(summary.subtotal)}</span>
                            </div>

                            {hostProvidingCoverage && summary.insuranceFee > 0 && (
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Insurance ({pluralize(summary.days, 'day')} @ {formatCurrency(insuranceFeePerDay)}/day)</span>
                                    <span className="font-medium text-gray-800">{formatCurrency(summary.insuranceFee)}</span>
                                </div>
                            )}

                            {summary.taxRate > 0 && (
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Estimated Tax ({summary.taxRate}%)</span>
                                    <span className="font-medium text-gray-800">{formatCurrency(summary.taxAmount)}</span>
                                </div>
                            )}
                        </div>

                        <Separator className="bg-blue-200" />

                        <div className="flex justify-between items-center text-xs text-gray-500 font-text">
                            <span>Final amount will be confirmed at checkout.</span>
                            <span className="text-blue-700 font-semibold text-sm">
                                Additional Charge: {formatCurrency(summary.additionalCost)}
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* ── Buttons Row (Side by side) ─────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full text-sm font-medium font-text py-2.5 px-4 rounded-xs border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting || extraDays <= 0}
                    className="w-full font-text text-white text-sm font-medium px-4 py-2.5 bg-blue-700 rounded-xs cursor-pointer hover:bg-blue-900 duration-300 transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <LoadingSpinner />
                            Processing...
                        </>
                    ) : (
                        'Confirm Extension'
                    )}
                </button>
            </div>
        </form>
    )
}
