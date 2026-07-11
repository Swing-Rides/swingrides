'use client'

import MainForm from '@/components/forms/MainForm'
import { FormFieldConfig } from "@/components/forms/types";
import { validators } from "@/components/forms/form.validators";
import { useState } from 'react';

export type BusinessLicenseVerificationFormValues = {
        businessLicenseUrl: string;
};

type BusinessLicenseVerificationFormRawValues = {
        businessLicenseDocument: FileList;
};

type FormState = 'idle' | 'submitting' | 'submitted' | 'failed'

const fields: FormFieldConfig[] = [
        {
                name: "businessLicenseDocument",
                type: "image",
                label: "Upload Business License",
                description: "PDF, JPG, PNG — up to 10MB",
                accept: "image/*",
                capture: "environment",
                multiple: false,
                maxFiles: 1,
                showPreview: true,
                validation: validators.file({
                        maxFiles: 1,
                        maxSizeMB: 10,
                        maxTotalSizeMB: 10,
                        accept: [
                                "image/jpeg", 
                                "image/png", 
                                "image/webp", 
                                "image/heic",
                                "application/pdf"
                        ],
                }),
        },
]

export default function BusinessLicenseVerificationForm() {

        const [formState, setFormState] = useState<FormState>('idle');

        const handleSubmit = (values: Record<string, unknown>) => {
                if (!(values.businessLicenseDocument instanceof FileList)) {
                        setFormState('failed');
                        return;
                }
                const raw = values as BusinessLicenseVerificationFormRawValues;
                setFormState('submitting');
                console.log(raw);
                setFormState('submitted');
        }

        return (
                <MainForm 
                        fields={fields}
                        isLoading={formState === 'submitting' ? true : false}
                        submitLabel={"Submit for verification"}
                        onSubmit={handleSubmit}
                        className='w-full'
                />
        )
}
