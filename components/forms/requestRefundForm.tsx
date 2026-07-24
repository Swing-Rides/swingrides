'use client'

import MainForm from '@/components/forms/MainForm'
import { FormFieldConfig } from '@/components/forms/types'
import { validators } from '@/components/forms/form.validators'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { useCancelBookingMutation } from '@/app/store/services/renterApi'
import { useRouter } from 'next/navigation'

export type RequestRefundFormValues = {
        cancellationReason: string;
        refundMethod: string;
        additionalComments?: string;
        confirmed: boolean;
}

const cancellationReasons = [
        { label: "Change of plans", value: "changeOfPlans" },
        { label: "Found an alternative vehicle", value: "alternativeVehicle" },
        { label: "Trip no longer required", value: "tripNotRequired" },
        { label: "Vehicle unavailable", value: "vehicleUnavailable" },
        { label: "Pricing concerns", value: "pricing" },
        { label: "Unexpected emergency", value: "emergency" },
        { label: "Booking created by mistake", value: "mistake" },
        { label: "Other", value: "other" },
];

const refundMethods = [
        {
                label: "Original Payment Method",
                value: "original",
        },
];

type RequestRefundFormProps = { 
        tripId: string; 
        upcomingTrip: boolean;
}

export default function RequestRefundForm({ tripId, upcomingTrip }: RequestRefundFormProps) {

        const router = useRouter()

        const [cancelBooking, { isLoading }] = useCancelBookingMutation()

        const handleCancel = useCallback(async (values: RequestRefundFormValues) => {
                if (!upcomingTrip) {
                        toast.error("Can not cancel trip")
                        return
                }

                try {
                        await cancelBooking({ id: tripId }).unwrap()
                        //TODO: ADD THE FORM PAYLOAD TO SERVER
                        console.log('Form Submitted:=:', values)
                        
                        toast.success(`Trip has been cancelled! Refund request submitted. We'll review your request and process any eligible refund.`)
                        router.push('/profile?tab=Cancelled')
                } catch (error) {
                        toast.error(`Failed to cancel booking: ${error instanceof Error ? error.message : 'Unknown error'}`)
                }
        }, [upcomingTrip, cancelBooking, tripId, router])

        const fields: FormFieldConfig[] = [
                {
                        name: "cancellationReason",
                        type: "select",
                        label: "Reason for Cancellation",
                        placeholder: "Select a reason",
                        options: cancellationReasons,
                        validation: validators.required("Cancellation Reason"),
                },

                {
                        name: "refundMethod",
                        type: "select",
                        label: "Refund Method",
                        placeholder: "Select refund method",
                        options: refundMethods,
                        validation: validators.required("Refund Method"),
                },

                {
                        name: "additionalComments",
                        type: "textarea",
                        label: "Additional Comments (Optional)",
                        placeholder:
                                "Provide any additional information that may help us process your refund request.",
                        rows: 8,
                        validation: validators.maxLength(500, "Additional Comments"),
                },

                {
                        name: "confirmed",
                        type: "checkbox",
                        label:
                                "I understand that a 50% cancellation fee will be deducted from my booking amount before my refund is processed.",
                        validation: validators.checkbox("Confirmation"),
                },
        ];

        return (
                <MainForm
                        fields={fields}
                        rowPairs={[
                                ["expenseType", "amount"],
                                ["bankName", "accountType"],
                                ["routingNumber", "accountNumber"],
                        ]}
                        onSubmit={(values) =>
                                handleCancel(values as RequestRefundFormValues)
                        }
                        isLoading={isLoading}
                        submitLabel="Request Refund"
                />
        )
}