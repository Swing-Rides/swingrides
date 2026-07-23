'use client'

import { DollarSign } from 'lucide-react'
import MainForm from '@/components/forms/MainForm'
import { FormFieldConfig } from '@/components/forms/types'
import { validators } from '@/components/forms/form.validators'
import { useState } from 'react'
import { toast } from 'sonner'

export type RequestReimbursementFormValues = {
        expenseType: string;
        amount: number;
        description: string;

        bankName: string;
        accountType: string;
        accountHolderName: string;
        routingNumber: string;
        accountNumber: string;

        uploadProof: FileList;
        confirmed: boolean;
};

const accountTypes = [
        { label: "Checking", value: "checking" },
        { label: "Savings", value: "savings" },
        { label: "Business", value: "business" },
];

const expenseType = [
        { label: "Additional Distance", value: "additionalDistance" },
        { label: "Extra Fuel", value: "extraFuel" },
        { label: "Vehicle Cleaning", value: "vehicleCleaning" },
        { label: "Interior Damage", value: "interiorDamage" },
        { label: "Exterior Damage", value: "exteriorDamage" },
        { label: "Missing Accessories", value: "missingAccessories" },
        { label: "Late Return Fee", value: "lateReturnFee" },
        { label: "Traffic Fine / Toll", value: "trafficFine" },
        { label: "Parking Violation", value: "parkingViolation" },
        { label: "Mechanical Repair", value: "mechanicalRepair" },
        { label: "Tyre Damage", value: "tyreDamage" },
        { label: "Battery Replacement", value: "batteryReplacement" },
        { label: "Key Replacement", value: "keyReplacement" },
        { label: "Smoking / Odor Removal", value: "smokingCleaning" },
        { label: "Other", value: "other" },
];

export default  function RequestReimbursementForm({ tripId }: {tripId: string;}) {

        const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

        const onSubmit = async (values: RequestReimbursementFormValues) => {
                setIsSubmitting(true);

                console.log('Form Submitted:=:', values)

                // Placeholder for API request
                await new Promise((resolve) => setTimeout(resolve, 3000));
                
                setIsSubmitting(false);

                toast.success("Form Submitted Successfully")

                //ADD REDIRECT TO /trip/{tripId}
        }

        const fields: FormFieldConfig[] = [
                {
                        name: 'expenseType',
                        type: 'select',
                        label: 'Expense Type',
                        placeholder: 'Select expense type',
                        options: expenseType,
                        validation: validators.required('Expense Type'),
                },
                {
                        name: 'amount',
                        type: 'number',
                        label: 'Amount',
                        placeholder: 'e.g. 124',
                        icon: <DollarSign className="size-4" />,
                        validation: validators.required('Amount'),
                },
                {
                        name: 'description',
                        type: 'textarea',
                        label: 'Description',
                        description: 'e.g. Repairs completed, vehicle ready for rental...',
                        rows: 8,
                        validation: validators.maxLength(500, 'Description'),
                },
                {
                        name: "bankName",
                        type: "text",
                        label: "Bank Name",
                        placeholder: "e.g. Chase Bank",
                        validation: validators.required("Bank Name"),
                },
                {
                        name: "accountType",
                        type: "select",
                        label: "Account Type",
                        placeholder: "Select account type",
                        options: accountTypes,
                        validation: validators.required("Account Type"),
                },
                {
                        name: "accountHolderName",
                        type: "text",
                        label: "Account Holder Name",
                        placeholder: "e.g. Jane Doe",
                        validation: validators.required("Account Holder Name"),
                },
                {
                        name: "routingNumber",
                        type: "number",
                        label: "Routing Number (ABA)",
                        placeholder: "e.g. 021000021",
                        validation: validators.required("Routing Number"),
                },
                {
                        name: "accountNumber",
                        type: "number",
                        label: "Account Number",
                        placeholder: "e.g. 123456789012",
                        validation: validators.required("Account Number"),
                },
                {
                        name: 'uploadProof',
                        type: 'file',
                        label: 'Upload Proof',
                        description: 'Upload receipts or evidence to support your request',
                        accept: 'image/*, application/pdf',
                        capture: 'environment',
                        multiple: true,
                        maxFiles: 2,
                        showPreview: true,
                        validation: validators.file({
                                maxFiles: 2,
                                maxSizeMB: 5,
                                maxTotalSizeMB: 10,
                                accept: [
                                        'image/jpeg',
                                        'image/png',
                                        'image/webp',
                                        'image/heic',
                                        'application/pdf'
                                ],
                        }),
                },
                {
                        name: 'confirmed',
                        type: 'checkbox',
                        label: 'Send to host for direct resolution.',
                        validation: validators.checkbox('Confirmation'),
                },
        ]

        return (
                <MainForm
                        // REMOVE THE {tripId} AFTER THE ENDPONIT HAS BEEN CONSUMED
                        description={tripId}
                        fields={fields}
                        rowPairs={[
                                ["expenseType", "amount"],
                                ["bankName", "accountType"],
                                ["routingNumber", "accountNumber"],
                        ]}
                        onSubmit={(values) =>
                                onSubmit(values as RequestReimbursementFormValues)
                        }
                        isLoading={isSubmitting}
                        submitLabel="Submit Request"
                />
        )
}