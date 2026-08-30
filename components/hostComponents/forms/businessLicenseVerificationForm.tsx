'use client'

import MainForm from '@/components/forms/MainForm'
import { FormFieldConfig } from "@/components/forms/types";
import { validators } from "@/components/forms/form.validators";
import { useState } from 'react';
import {
  HostBusinessVerificationStatus,
  HostPlanType,
  HostVerificationDocument,
  SubmitHostBusinessVerificationRequest,
  useSubmitHostBusinessVerificationMutation,
} from "@/app/store/services/settingsApi";

type FormState = 'idle' | 'submitting' | 'submitted' | 'failed'

const STATUS_LABEL: Record<HostBusinessVerificationStatus, string> = {
  not_submitted: "Not submitted",
  pending: "Under review",
  approved: "Verified",
  rejected: "Rejected",
};

const STATUS_STYLE: Record<HostBusinessVerificationStatus, string> = {
  not_submitted: "bg-gray-100 text-gray-500",
  pending: "bg-blue-50 text-blue-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
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

type DocumentUploadCardProps = {
  label: string;
  fieldName: string;
  document?: HostVerificationDocument;
  required: boolean;
  onSubmit: (url: string) => Promise<void>;
};

function DocumentUploadCard({
  label,
  fieldName,
  document,
  required,
  onSubmit,
}: DocumentUploadCardProps) {
  const [formState, setFormState] = useState<FormState>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const status = document?.status ?? "not_submitted";
  const canUpload =
    (status === "not_submitted" || status === "rejected") &&
    formState !== "submitted";

  const fields: FormFieldConfig[] = [
    {
      name: fieldName,
      type: "file",
      label: `Upload ${label}`,
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
  ];

  const handleSubmit = async (values: Record<string, unknown>) => {
    const files = values[fieldName];
    const file = files instanceof FileList ? files[0] : undefined;

    if (!file) {
      setFormState('failed');
      setFeedbackMessage(`Please upload your ${label.toLowerCase()}.`);
      return;
    }

    setFormState('submitting');
    setFeedbackMessage(null);

    try {
      const url = await uploadDocument(file);
      await onSubmit(url);

      setFormState('submitted');
      setFeedbackMessage(
        `Your ${label.toLowerCase()} has been submitted and is now under review.`,
      );
    } catch (error) {
      setFormState('failed');
      setFeedbackMessage(
        getErrorMessage(
          error,
          `We couldn't submit your ${label.toLowerCase()} right now.`,
        ),
      );
    }
  };

  return (
    <div className="w-full rounded-[10px] border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-medium text-neutral-950">
          {label}
          {required ? null : (
            <span className="text-gray-400 font-normal"> (optional)</span>
          )}
        </h4>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${STATUS_STYLE[status]}`}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>

      {document?.url ? (
        <a
          href={document.url}
          target="_blank"
          rel="noreferrer"
          className="block text-sm text-blue-700 underline w-fit"
        >
          View uploaded document
        </a>
      ) : null}

      {document?.submittedAt ? (
        <p className="text-xs text-gray-500">
          Submitted on {new Date(document.submittedAt).toLocaleDateString()}
        </p>
      ) : null}

      {status === "rejected" && document?.notes ? (
        <p className="text-xs text-red-600">{document.notes}</p>
      ) : null}

      {feedbackMessage ? (
        <div
          className={`rounded-[10px] p-3 text-sm font-medium ${
            formState === "failed"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {feedbackMessage}
        </div>
      ) : null}

      {status === "pending" ? (
        <p className="text-xs text-blue-700">This document is under review.</p>
      ) : null}

      {canUpload ? (
        <MainForm
          fields={fields}
          isLoading={formState === 'submitting'}
          submitLabel={status === "rejected" ? "Resubmit" : "Submit"}
          onSubmit={handleSubmit}
          className="w-full"
        />
      ) : null}
    </div>
  );
}

type BusinessLicenseVerificationFormProps = {
  idCard?: HostVerificationDocument;
  businessLicense?: HostVerificationDocument;
  plan?: HostPlanType;
};

export default function BusinessLicenseVerificationForm({
  idCard,
  businessLicense,
  plan = "flex",
}: BusinessLicenseVerificationFormProps) {
  const [submitHostBusinessVerification] =
    useSubmitHostBusinessVerificationMutation();

  const submit = (payload: SubmitHostBusinessVerificationRequest) =>
    submitHostBusinessVerification(payload).unwrap().then(() => undefined);

  return (
    <div className="w-full space-y-4">
      <DocumentUploadCard
        label="Identity Card"
        fieldName="IdCard"
        document={idCard}
        required
        onSubmit={(idCardUrl) => submit({ idCardUrl })}
      />
      <DocumentUploadCard
        label="Business License"
        fieldName="businessLicenseDocument"
        document={businessLicense}
        required={plan === "fleet"}
        onSubmit={(businessLicenseUrl) => submit({ businessLicenseUrl })}
      />
    </div>
  );
}
