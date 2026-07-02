'use client'

import { CalendarIcon, Receipt } from 'lucide-react'
import MainForm from '@/components/forms/MainForm'
import { FormFieldConfig } from '@/components/forms/types'
import { RegisterOptions } from 'react-hook-form'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AddExpenseFormValues = {
        vehicle: string
        category: string
        amount: number
        date: string
        description: string
        receipt?: FileList
}

const EXPENSE_CATEGORIES = [
        { label: 'Fuel', value: 'fuel' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Insurance', value: 'insurance' },
        { label: 'Cleaning', value: 'cleaning' },
        { label: 'Registration', value: 'registration' },
        { label: 'Parking', value: 'parking' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Office', value: 'office' },
        { label: 'Other', value: 'other' },
]

type AddExpenseFormProps = {
        fetchVehicles: () => Promise<{ label: string; value: string }[]>
        onCancel: () => void
        onSubmit: (values: AddExpenseFormValues) => void | Promise<void>
}

export default function AddExpenseForm({ fetchVehicles, onSubmit }: AddExpenseFormProps) {

        const fields: FormFieldConfig[] = [
                {
                        name: 'vehicle',
                        type: 'select',
                        label: 'Vehicle',
                        placeholder: 'Select a vehicle',
                        loadOptions: fetchVehicles,
                        validation: { required: 'Please select a vehicle' } as RegisterOptions,
                },
                {
                        name: 'category',
                        type: 'select',
                        label: 'Category',
                        placeholder: 'Select a category',
                        options: EXPENSE_CATEGORIES,
                        validation: { required: 'Please select a category' } as RegisterOptions,
                },
                {
                        name: 'amount',
                        type: 'number-dollar',
                        label: 'Amount',
                        placeholder: '0.00',
                        min: 0,
                        step: 0.01,
                        className: 'w-full',
                        validation: {
                                required: 'Amount is required',
                                min: { value: 0, message: 'Amount cannot be negative' },
                                valueAsNumber: true,
                        } as RegisterOptions,
                },
                {
                        name: 'date',
                        type: 'date',
                        label: 'Date',
                        placeholder: 'Pick a date',
                        icon: <CalendarIcon className='w-4 h-4' />,
                        className: 'w-full',
                        validation: { required: 'Date is required' } as RegisterOptions,
                },
                {
                        name: 'description',
                        type: 'textarea',
                        label: 'Description',
                        placeholder: 'Optional notes about expense',
                        height: 80,
                        validation: {} as RegisterOptions,
                },
                {
                        name: 'receipt',
                        type: 'file',
                        label: 'Upload Receipt',
                        description: 'PNG, JPG, PDF up to 5MB',
                        uploadIcon: <Receipt className='w-5 h-5 text-[#9CA3AF]' />,
                        accept: 'image/png, image/jpeg, application/pdf',
                        validation: {
                                validate: {
                                        fileSize: (files: FileList | undefined) => {
                                                if (!files?.[0]) return true
                                                const sizeMB = files[0].size / (1024 * 1024)
                                                return sizeMB <= 5 || 'File must be under 5MB'
                                        },
                                        fileType: (files: FileList | undefined) => {
                                                if (!files?.[0]) return true
                                                return ['image/png', 'image/jpeg', 'application/pdf'].includes(files[0].type)
                                                        || 'Only PNG, JPG and PDF files are allowed'
                                        },
                                },
                        } as RegisterOptions,
                },
        ]

        const handleFormSubmit = (values: Record<string, unknown>) => {
                return onSubmit(values as AddExpenseFormValues)
        }


        return (
                <MainForm
                        fields={fields}
                        onSubmit={handleFormSubmit}
                        submitLabel='Log Expense'
                        className='w-full'
                        rowPairs={[['amount', 'date']]}
                />
        )
}