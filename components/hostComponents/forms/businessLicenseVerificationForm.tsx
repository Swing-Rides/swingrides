'use client'

import MainForm from '@/components/forms/MainForm'
import { FormFieldConfig } from "@/components/forms/types";
import { validators } from "@/components/forms/form.validators";
import { useState } from 'react';
import {
  HostBusinessVerificationStatus,
  HostPlanType,
  useSubmitHostBusinessVerificationMutation,
} from "@/app/store/services/settingsApi";

export type BusinessLicenseVerificationFormValues = {
  idCardUrl: string;
  businessLicenseUrl?: string;
};

type BusinessLicenseVerificationFormRawValues = {
  IdCard: FileList;
  businessLicenseDocument?: FileList;
};

type FormState = 'idle' | 'submitting' | 'submitted' | 'failed'

const buildFields = (isBusinessLicenseRequired: boolean): FormFieldConfig[] => [
  {
    name: "IdCard",
    type: "file",
    label: "Upload Personal Identity Card",
    description: "PDF, JPG, PNG — up to 10MB",
    accept: "image/*,application/pdf",
    capture: "environment",
    multiple: false,
    maxFiles: 1,
    showPreview: true,
    validation: validators.file({
      required: true,
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
  {
    name: "businessLicenseDocument",
    type: "file",
    label: isBusinessLicenseRequired
      ? "Upload Business License"
      : "Upload Business License (optional)",
    description: "PDF, JPG, PNG — up to 10MB",
    accept: "image/*,application/pdf",
    capture: "environment",
    multiple: false,
    maxFiles: 1,
    showPreview: true,
    validation: validators.file({
      required: isBusinessLicenseRequired,
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
  idCardUrl?: string;
  notes?: string;
  plan?: HostPlanType;
};

const uploadDocument = async (file: File): Promise<string> => {
  const fd = new FormData();
  fd.append("file", file);

  const uploadResponse = await fetch("/api/upload", {
    method: "POST",
    body: fd,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload document");
  }

  const uploadData = await uploadResponse.json();
  return uploadData.secure_url as string;
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
  idCardUrl,
  notes,
  plan = "flex",
}: BusinessLicenseVerificationFormProps) {
  const [formState, setFormState] = useState<FormState>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [submitHostBusinessVerification] =
    useSubmitHostBusinessVerificationMutation();

  const isPending = verificationStatus === "pending";
  const isApproved = verificationStatus === "approved";
  const isBusinessLicenseRequired = plan === "fleet";
  const fields = buildFields(isBusinessLicenseRequired);

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!(values.IdCard instanceof FileList)) {
      setFormState('failed');
      setFeedbackMessage("Please upload your identity card.");
      return;
    }

    const raw = values as BusinessLicenseVerificationFormRawValues;
    const idCardFile = raw.IdCard?.[0];
    const businessLicenseFile = raw.businessLicenseDocument?.[0];

    if (!idCardFile) {
      setFormState('failed');
      setFeedbackMessage("Please upload your identity card.");
      return;
    }

    if (isBusinessLicenseRequired && !businessLicenseFile) {
      setFormState('failed');
      setFeedbackMessage("Business license is required for the fleet plan.");
      return;
    }

    setFormState('submitting');
    setFeedbackMessage(null);

    try {
      const [idCardUrl, businessLicenseUrl] = await Promise.all([
        uploadDocument(idCardFile),
        businessLicenseFile ? uploadDocument(businessLicenseFile) : Promise.resolve(undefined),
      ]);

      await submitHostBusinessVerification({
        idCardUrl,
        ...(businessLicenseUrl ? { businessLicenseUrl } : {}),
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
      {businessLicenseUrl || idCardUrl ? (
        <div className="w-full rounded-[10px] border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-neutral-950">
            Current documents on file
          </p>
          {idCardUrl ? (
            <a
              href={idCardUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block text-sm text-blue-700 underline"
            >
              View uploaded identity card
            </a>
          ) : null}
          {businessLicenseUrl ? (
            <a
              href={businessLicenseUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block text-sm text-blue-700 underline"
            >
              View uploaded business license
            </a>
          ) : null}
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
