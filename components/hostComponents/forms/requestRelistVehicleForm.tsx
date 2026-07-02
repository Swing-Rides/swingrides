'use client'

import { useMemo } from 'react'
import { FileCheck } from 'lucide-react'
import MainForm from '@/components/forms/MainForm'
import { FormFieldConfig } from '@/components/forms/types'
import { RegisterOptions } from 'react-hook-form'

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_REASON_CHARS = 180
const MAX_DOC_SIZE_MB = 10
const ACCEPTED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']

// ─── Types ────────────────────────────────────────────────────────────────────

export type RequestRelistFormValues = {
        reason: string
        supportingDocuments?: FileList
}

type RequestRelistFormProps = {
        onCancel: () => void
        onSubmit: (values: RequestRelistFormValues) => void | Promise<void>
}

export default function RequestRelistVehicleForm({ onCancel, onSubmit }: RequestRelistFormProps) {
        const fields: FormFieldConfig[] = useMemo(() => [
                {
                        name: 'reason',
                        type: 'textarea',
                        label: 'Reason for Relisting',
                        placeholder: 'e.g. Repairs completed, vehicle ready for rental',
                        rows: 4,
                        validation: {
                                required: 'Please provide a reason for relisting',
                                maxLength: {
                                        value: MAX_REASON_CHARS,
                                        message: `Reason cannot exceed ${MAX_REASON_CHARS} characters`,
                                },
                        } as RegisterOptions,
                },
                {
                        name: 'supportingDocuments',
                        type: 'file',
                        label: 'Supporting Documents',
                        description: 'Maintenance invoices, repair receipts, accident clearance photos',
                        uploadIcon: <FileCheck className='w-5 h-5 text-[#9CA3AF]' />,
                        accept: '.pdf,image/jpeg,image/jpg,image/png',
                        multiple: true,
                        validation: {
                                validate: {
                                        fileSize: (files: FileList | undefined) => {
                                                if (!files?.length) return true
                                                const oversized = Array.from(files).filter(
                                                        f => f.size / (1024 * 1024) > MAX_DOC_SIZE_MB
                                                )
                                                return oversized.length === 0
                                                        || `Each file must be under ${MAX_DOC_SIZE_MB}MB`
                                        },
                                        fileType: (files: FileList | undefined) => {
                                                if (!files?.length) return true
                                                const invalid = Array.from(files).filter(
                                                        f => !ACCEPTED_DOC_TYPES.includes(f.type)
                                                )
                                                return invalid.length === 0
                                                        || 'Only PDF, JPG, JPEG and PNG files are allowed'
                                        },
                                },
                        } as RegisterOptions,
                },
        ], [])

        const handleFormSubmit = (values: Record<string, unknown>) => {
                return onSubmit(values as RequestRelistFormValues)
        }

        return (
                <MainForm
                        fields={fields}
                        onSubmit={handleFormSubmit}
                        submitLabel='Submit Request'
                        className='w-full'
                        footerSlot={
                                <button
                                        type='button'
                                        onClick={onCancel}
                                        className='order-first w-full md:w-auto px-6 py-2.5 border border-[#E5E7EB] text-[#6B7280] rounded-xs font-medium font-text hover:bg-[#F3F4F6] transition-colors duration-200 cursor-pointer'
                                >
                                        Cancel
                                </button>
                        }
                />
        )
}