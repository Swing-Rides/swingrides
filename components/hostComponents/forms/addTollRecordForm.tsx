'use client'

import { useMemo } from 'react'
import MainForm from '@/components/forms/MainForm'
import { FormFieldConfig } from '@/components/forms/types'
import { RegisterOptions } from 'react-hook-form'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AddTollRecordFormValues = {
        vehicle: string
        charge: number
        dateTime: string
        route: string
        tollLocation: string
        linkedRental: string
}

type SelectOption = { label: string; value: string }

type AddTollRecordFormProps = {
        fetchVehicles: () => Promise<SelectOption[]>
        fetchRentals: () => Promise<SelectOption[]>
        onCancel: () => void
        onSubmit: (values: AddTollRecordFormValues) => void | Promise<void>
}

export default function AddTollRecordForm({
        fetchVehicles,
        fetchRentals,
        onSubmit,
}: AddTollRecordFormProps) {
        // Memoized so loadOptions keeps a stable reference across re-renders,
        // preventing MainForm's use()-backed select from re-suspending in a loop
        const fields: FormFieldConfig[] = useMemo(() => [
                {
                        name: 'vehicle',
                        type: 'select',
                        label: 'Vehicle',
                        placeholder: 'Select a vehicle',
                        loadOptions: fetchVehicles,
                        validation: { required: 'Please select a vehicle' } as RegisterOptions,
                },
                {
                        name: 'charge',
                        type: 'number-dollar',
                        label: 'Charge',
                        placeholder: '0.00',
                        min: 0,
                        step: 0.01,
                        className: 'w-full',
                        validation: {
                                required: 'Charge is required',
                                min: { value: 0, message: 'Charge cannot be negative' },
                                valueAsNumber: true,
                        } as RegisterOptions,
                },
                {
                        name: 'dateTime',
                        type: 'datetime',
                        label: 'Date & Time',
                        placeholder: 'Pick date & time',
                        className: 'w-full',
                        validation: { required: 'Date & time is required' } as RegisterOptions,
                },
                {
                        name: 'route',
                        type: 'text',
                        label: 'Route',
                        placeholder: 'e.g. I-95 North, Exit 12 to Exit 18',
                        validation: { required: 'Route is required' } as RegisterOptions,
                },
                {
                        name: 'tollLocation',
                        type: 'text',
                        label: 'Toll Location',
                        placeholder: 'e.g. George Washington Bridge',
                        validation: { required: 'Toll location is required' } as RegisterOptions,
                },
                {
                        name: 'linkedRental',
                        type: 'select',
                        label: 'Linked Rental',
                        placeholder: 'Select an invoice',
                        loadOptions: fetchRentals,
                        validation: { required: 'Please select a linked rental' } as RegisterOptions,
                },
        ], [fetchVehicles, fetchRentals])

        const handleFormSubmit = (values: Record<string, unknown>) => {
                return onSubmit(values as AddTollRecordFormValues)
        }

        return (
                <MainForm
                        fields={fields}
                        onSubmit={handleFormSubmit}
                        submitLabel='Log Toll'
                        className='w-full'
                        rowPairs={[['charge', 'dateTime']]}
                />
        )
}