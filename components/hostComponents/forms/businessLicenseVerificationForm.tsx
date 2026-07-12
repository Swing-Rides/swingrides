'use client'

import MainForm from '@/components/forms/MainForm'
import { FormFieldConfig } from "@/components/forms/types";
import { validators } from "@/components/forms/form.validators";
import { useState } from 'react';
import {
  HostBusinessVerificationStatus,
  useSubmitHostBusinessVerificationMutation,
} from "@/app/store/services/settingsApi";

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
    type: "file",
    label: "Upload Business License",
    description: "PDF, JPG, PNG — up to 10MB",
    accept: "image/*,application/pdf",
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
        "application/pdf",
      ],
    }),
  },
]

type BusinessLicenseVerificationFormProps = {
  verificationStatus?: HostBusinessVerificationStatus;
  submittedAt?: string;
  businessLicenseUrl?: string;
  notes?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export default function BusinessLicenseVerificationForm({
  verificationStatus = "not_submitted",
  submittedAt,
  businessLicenseUrl,
  notes,
}: BusinessLicenseVerificationFormProps) {
  const [formState, setFormState] = useState<FormState>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [submitHostBusinessVerification] =
    useSubmitHostBusinessVerificationMutation();

  const isPending = verificationStatus === "pending";
  const isApproved = verificationStatus === "approved";

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!(values.businessLicenseDocument instanceof FileList)) {
      setFormState('failed');
      setFeedbackMessage("Please upload your business license document.");
      return;
    }

    const raw = values as BusinessLicenseVerificationFormRawValues;
    const file = raw.businessLicenseDocument?.[0];

    if (!file) {
      setFormState('failed');
      setFeedbackMessage("Please upload your business license document.");
      return;
    }

    setFormState('submitting');
    setFeedbackMessage(null);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload business license");
      }

      const uploadData = await uploadResponse.json();

      await submitHostBusinessVerification({
        businessLicenseUrl: uploadData.secure_url as string,
      }).unwrap();

      setFormState('submitted');
      setFeedbackMessage(
        "Your business verification has been submitted and is now under review.",
      );
    } catch (error) {
      setFormState('failed');
      setFeedbackMessage(
        getErrorMessage(
          error,
          "We couldn't submit your business verification right now.",
        ),
      );
    }
  }

  return (
    <div className='w-full space-y-4'>
      {businessLicenseUrl ? (
        <div className="w-full rounded-[10px] border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-neutral-950">
            Current document on file
          </p>
          <a
            href={businessLicenseUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block text-sm text-blue-700 underline"
          >
            View uploaded business license
          </a>
          {submittedAt ? (
            <p className="mt-2 text-xs text-gray-500">
              Submitted on {new Date(submittedAt).toLocaleDateString()}
            </p>
          ) : null}
          {notes ? (
            <p className="mt-2 text-xs text-red-600">{notes}</p>
          ) : null}
        </div>
      ) : null}

      {feedbackMessage ? (
        <div
          className={`w-full rounded-[10px] p-3 text-sm font-medium ${
            formState === "failed"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {feedbackMessage}
        </div>
      ) : null}

      {isApproved ? null : isPending ? (
        <div className="w-full rounded-[10px] bg-blue-50 p-3 text-sm font-medium text-blue-700">
          Your business verification submission is being reviewed.
        </div>
      ) : (
        <MainForm 
          fields={fields}
          isLoading={formState === 'submitting' ? true : false}
          submitLabel={"Submit for verification"}
          onSubmit={handleSubmit}
          className='w-full'
        />
      )}
    </div>
  )
}
