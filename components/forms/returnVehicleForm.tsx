'use client'

import { Fuel, Gauge } from 'lucide-react'

import MainForm from '@/components/forms/MainForm'
import { FormFieldConfig } from '@/components/forms/types'
import { validators } from '@/components/forms/form.validators'

export type ReturnVehicleFormValues = {
        returnPhotos: FileList
        mileage: string
        fuelLevel: string
        notes?: string
        confirmed: boolean
}

type ReturnVehicleFormProps = {
        onSubmit: (values: ReturnVehicleFormValues) => void | Promise<void>
        onClose: () => void
        isSubmitting?: boolean
}

const fuelLevels = [
        { label: 'Empty', value: 'Empty' },
        { label: '1/8', value: '1/8' },
        { label: '2/8', value: '2/8' },
        { label: '3/8', value: '3/8' },
        { label: '4/8', value: '4/8' },
        { label: '5/8', value: '5/8' },
        { label: '6/8', value: '6/8' },
        { label: '7/8', value: '7/8' },
        { label: 'Full (8/8)', value: '8/8' },
]

export default function ReturnVehicleForm({
        onSubmit,
        onClose,
        isSubmitting,
}: ReturnVehicleFormProps) {

        const fields: FormFieldConfig[] = [
                {
                        name: 'returnPhotos',
                        type: 'image',
                        label: 'Return Condition Photos',
                        description: 'Take clear photos of the vehicle before handing back the keys.',
                        accept: 'image/*',
                        capture: 'environment',
                        multiple: true,
                        maxFiles: 8,
                        showPreview: true,
                        validation: validators.file({
                                maxFiles: 8,
                                maxSizeMB: 10,
                                maxTotalSizeMB: 50,
                                accept: [
                                        'image/jpeg',
                                        'image/png',
                                        'image/webp',
                                        'image/heic',
                                ],
                        }),
                },
                {
                        name: 'mileage',
                        type: 'text',
                        label: 'Return Mileage',
                        placeholder: 'e.g. 43,650 km',
                        icon: <Gauge className="w-4 h-4" />,
                        validation: validators.required('Return mileage'),
                },
                {
                        name: 'fuelLevel',
                        type: 'select',
                        label: 'Fuel Level at Return',
                        placeholder: 'Select fuel level',
                        icon: <Fuel className="w-4 h-4" />,
                        options: fuelLevels,
                        validation: validators.required('Fuel level'),
                },
                {
                        name: 'notes',
                        type: 'textarea',
                        label: 'Additional Notes (Optional)',
                        description: 'Any notes about the vehicle condition on return...',
                        rows: 8,
                        validation: validators.maxLength(1000, 'Notes'),
                },
                {
                        name: 'confirmed',
                        type: 'checkbox',
                        label: 'I confirm the vehicle has been returned in the condition described above.',
                        validation: validators.checkbox('Confirmation'),
                },
        ]

        return (
                <MainForm
                        fields={fields}
                        rowPairs={[['mileage', 'fuelLevel']]}
                        onSubmit={(values) =>
                                onSubmit(values as ReturnVehicleFormValues)
                        }
                        isLoading={isSubmitting}
                        submitLabel="Confirm Return"
                        footerSlot={
                                <button
                                        type="button"
                                        onClick={onClose}
                                        className="w-full text-sm font-medium font-text leading-5 border border-gray-500 text-gray-500 rounded-xs py-2 px-4 bg-transparent hover:bg-black hover:text-white hover:border-black transition-colors duration-300 cursor-pointer"
                                >
                                        Discard
                                </button>
                        }
                />
        )
}