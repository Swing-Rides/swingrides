'use client'

import { Fuel, Gauge } from 'lucide-react'

import MainForm from '@/components/forms/MainForm'
import { FormFieldConfig } from '@/components/forms/types'
import { validators } from '@/components/forms/form.validators'

export type GuestCheckInFormValues = {
        vehicleConditionPhotos: FileList
        driverLicensePhoto: FileList
        selfiePhoto: FileList
        mileage: string
        fuelLevel: string
        notes?: string
        confirmed: boolean
}

type GuestCheckInFormProps = {
        onSubmit: (values: GuestCheckInFormValues) => void | Promise<void>
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

export default function GuestCheckInForm({
        onSubmit,
        onClose,
        isSubmitting,
}: GuestCheckInFormProps) {

        const fields: FormFieldConfig[] = [
                {
                        name: 'vehicleConditionPhotos',
                        type: 'image',
                        label: 'Pick Up Condition Photos',
                        description: 'Take clear photos of the vehicle before driving the vehicle.',
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
                        name: 'driverLicensePhoto',
                        type: 'image',
                        label: `Driver's License Photo`,
                        description: `You will need to upload your driver's license photo to confirm this booking.`,
                        accept: 'image/*',
                        capture: 'environment',
                        multiple: false,
                        showPreview: true,
                        validation: validators.file({
                                maxFiles: 1,
                                maxSizeMB: 10,
                                maxTotalSizeMB: 10,
                                accept: [
                                        'image/jpeg',
                                        'image/png',
                                        'image/webp',
                                        'image/heic',
                                ],
                        }),
                },
                {
                        name: 'selfiePhoto',
                        type: 'image',
                        label: `Selfie Photo`,
                        description: 'You will need to upload your selfie holding your license to confirm this booking.',
                        accept: 'image/*',
                        capture: 'environment',
                        multiple: false,
                        showPreview: true,
                        validation: validators.file({
                                maxFiles: 1,
                                maxSizeMB: 10,
                                maxTotalSizeMB: 10,
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
                        label: 'I confirm the vehicle has been picked up in the condition described above.',
                        validation: validators.checkbox('Confirmation'),
                },
        ]


        return (
                <MainForm
                        fields={fields}
                        rowPairs={[['mileage', 'fuelLevel']]}
                        onSubmit={(values) =>
                                onSubmit(values as GuestCheckInFormValues)
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
