import MainForm from '@/components/forms/MainForm'
import { FormFieldConfig } from '@/components/forms/types'
import { validators } from '@/components/forms/form.validators'
import { useState } from 'react';
import { toast } from 'sonner';

export type DamageReportFormValues = {
    damageType: string;
    damageDescription: string;
    uploadPhotos: FileList;
};

const damageTypes = [
    { label: "Scratch", value: "scratch" },
    { label: "Dent", value: "dent" },
    { label: "Broken Glass", value: "brokenGlass" },
    { label: "Tyre Damage", value: "tyreDamage" },
    { label: "Paint Damage", value: "paintDamage" },
    { label: "Interior Damage", value: "interiorDamage" },
    { label: "Mechanical Issue", value: "mechanicalIssue" },
    { label: "Missing Part", value: "missingPart" },
    { label: "Other", value: "other" },
];

export default function ReportVehicleDamageForm({ tripId }: { tripId: string; }) {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fields: FormFieldConfig[] = [
        {
            name: "damageType",
            type: "select",
            label: "Damage Type",
            placeholder: "Select damage type",
            options: damageTypes,
            validation: validators.required("Damage Type"),
        },
        {
            name: "damageDescription",
            type: "textarea",
            label: "Damage Description",
            placeholder: "Describe the damage in detail...",
            rows: 5,
            validation: validators.maxLength(1000, "Damage Description"),
        },
        {
            name: "uploadPhotos",
            type: "image",
            label: "Upload Photos",
            description:
                "Maintenance invoices, repair receipts, accident clearance photos",
            accept: "image/*",
            capture: "environment",
            multiple: true,
            maxFiles: 2,
            showPreview: true,
            validation: validators.file({
                maxFiles: 2,
                maxSizeMB: 5,
                maxTotalSizeMB: 10,
                accept: [
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                    "image/heic",
                ],
            }),
        },
    ];

    const onSubmit = async (values: DamageReportFormValues) => {
        setIsSubmitting(true);

        console.log("Submitting damage report:", values);

        // Placeholder for API request
        await new Promise((resolve) => setTimeout(resolve, 3000));

        setIsSubmitting(false);

        toast.success("Damage report submitted successfully.");
        //ADD REDIRECT TO /trip/{tripId}
    };

    return (
        <MainForm
            description={tripId}
            fields={fields}
            onSubmit={(values) =>
                onSubmit(values as DamageReportFormValues)
            }
            isLoading={isSubmitting}
            submitLabel="Submit Damage Report"
        />
    )
}
