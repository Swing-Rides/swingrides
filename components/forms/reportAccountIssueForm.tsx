"use client";

import { useState } from "react";
import { RegisterOptions } from "react-hook-form";
import MainForm from "@/components/forms/MainForm";
import { FormFieldConfig } from "@/components/forms/types";
import { validators } from "@/components/forms/form.validators";
import { useCreatePublicAccountIssueReportMutation } from "@/app/store/services/publicApi";
import { toast } from "sonner";

export const accountIssueTypeOptions = [
  { value: "account_access", label: "Account Access / Login Issue" },
  { value: "profile_verification", label: "Identity & Profile Verification" },
  { value: "billing_payment", label: "Payment Method & Billing Issue" },
  { value: "security_suspicious", label: "Security & Suspicious Activity" },
  {
    value: "notifications_settings",
    label: "Notification & Account Settings",
  },
  { value: "deactivation", label: "Account Deactivation / Deletion Request" },
  { value: "technical issue", label: "Technical App Issue / Bug" },
  { value: "other", label: "Other Account Issue" },
];

export default function ReportAccountIssueForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createPublicAccountIssueReport] =
    useCreatePublicAccountIssueReportMutation();

  const uploadFiles = async (files: FileList | File[]): Promise<string[]> => {
    const fileArray = Array.isArray(files)
      ? files
      : typeof FileList !== "undefined" && files instanceof FileList
        ? Array.from(files)
        : [];

    if (!fileArray.length) return [];

    return await Promise.all(
      fileArray.map(async (file) => {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        if (!res.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await res.json();
        return data.secure_url as string;
      }),
    );
  };

  const fields: FormFieldConfig[] = [
    {
      name: "email",
      type: "email",
      label: "Account Email",
      placeholder: "e.g. user@example.com",
      description:
        "The email address associated with your Swing Rides account.",
      validation: validators.email(),
    },
    {
      name: "name",
      type: "text",
      label: "Full Name",
      placeholder: "e.g. Jane Doe",
      validation: validators.name("Full name"),
    },
    {
      name: "issueType",
      type: "select",
      label: "Account Issue Category",
      placeholder: "Select issue category",
      options: accountIssueTypeOptions,
      validation: validators.required("Issue category"),
    },
    {
      name: "subject",
      type: "text",
      label: "Subject / Summary",
      placeholder: "e.g. Unable to update account phone number",
      validation: validators.required("Subject"),
    },
    {
      name: "description",
      type: "textarea",
      label: "Describe the Issue",
      placeholder:
        "Please describe the problem with your account in as much detail as possible...",
      rows: 8,
      validation: {
        ...validators.required("Description"),
        ...validators.minLength(20, "Description"),
      } as RegisterOptions,
    },
    {
      name: "uploadPhotos",
      type: "image",
      label: "Upload Screenshots / Supporting Documents (Optional)",
      description:
        "Attach up to 4 screenshots or files that support your report. JPG, PNG · Max 5MB each.",
      accept: "image/jpeg, image/png",
      multiple: true,
      maxFiles: 4,
      showPreview: true,
      validation: validators.file({
        required: false,
        maxFiles: 4,
        maxSizeMB: 5,
        accept: ["image/jpeg", "image/png"],
      }),
    },
    {
      name: "isUrgent",
      type: "checkbox",
      label:
        "Mark as Urgent (Account compromised or immediate security attention needed)",
      description: "Select if this is an urgent account security concern.",
    },
  ];

  const onSubmit = async (values: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      let photoUrls: string[] = [];
      if (values.uploadPhotos) {
        photoUrls = await uploadFiles(values.uploadPhotos as FileList | File[]);
      }

      await createPublicAccountIssueReport({
        email: values.email as string,
        name: values.name as string,
        issueType: values.issueType as string,
        subject: values.subject as string,
        description: values.description as string,
        isUrgent: Boolean(values.isUrgent),
        photoUrls,
      }).unwrap();

      toast.success(
        "Account issue report submitted successfully. Our support team will follow up shortly.",
      );
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const message =
        err?.data?.message ??
        err?.message ??
        "Failed to submit account issue report. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainForm
      fields={fields}
      rowPairs={[["email", "name"]]}
      onSubmit={onSubmit}
      isLoading={isSubmitting}
      submitLabel="Submit Account Issue"
    />
  );
}

