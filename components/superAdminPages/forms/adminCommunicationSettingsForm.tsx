"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUpdateCommunicationSettingsMutation } from "@/app/store/services/adminApi";
import {
  FormField,
  CheckboxInput,
  LoadingSpinner,
} from "@/components/forms/MainForm";

type NotificationRow = {
  id: string;
  label: string;
};

type NotificationSettings = {
  email: boolean;
  sms: boolean;
};

type SettingsFormValues = {
  smsSenderName: string;
  supportEmail: string;
  notifications: Record<string, NotificationSettings>;
};

type AdminCommunicationSettingsFormProps = {
  defaultValues?: Partial<SettingsFormValues>;
};

const NOTIFICATION_ROWS: NotificationRow[] = [
  { id: "newBooking", label: "New Booking" },
  { id: "paymentReceived", label: "Payment Received" },
  { id: "failedPayment", label: "Failed Payment" },
  { id: "newSubscriber", label: "New Subscriber" },
  { id: "disputeRaised", label: "Dispute Raised" },
  { id: "systemAlert", label: "System Alert" },
];

const DEFAULT_NOTIFICATIONS = Object.fromEntries(
  NOTIFICATION_ROWS.map((row) => [row.id, { email: false, sms: false }]),
) as Record<string, NotificationSettings>;

export default function AdminCommunicationSettingsForm({
  defaultValues,
}: AdminCommunicationSettingsFormProps) {
  const [updateCommunication] = useUpdateCommunicationSettingsMutation();
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SettingsFormValues>({
    mode: "onTouched",
    defaultValues: {
      smsSenderName: defaultValues?.smsSenderName ?? "SwingRides",
      supportEmail: defaultValues?.supportEmail ?? "support@swingrides.ng",
      notifications: {
        ...DEFAULT_NOTIFICATIONS,
        ...defaultValues?.notifications,
      },
    },
    values: defaultValues
      ? {
        smsSenderName: defaultValues.smsSenderName ?? "SwingRides",
        supportEmail: defaultValues.supportEmail ?? "support@swingrides.ng",
        notifications: {
          ...DEFAULT_NOTIFICATIONS,
          ...defaultValues.notifications,
        },
      }
      : undefined,
  });

  const onSubmit = async (values: SettingsFormValues) => {
    await updateCommunication({
      smsSenderName: values.smsSenderName,
      supportEmail: values.supportEmail,
      notifications: values.notifications,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full"
      noValidate
    >
      {/* ── Section 1: Platform defaults ─────────────────── */}
      <div className="p-4 md:p-6 bg-white rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-5">
          {/* SMS Sender Name */}
          <FormField<SettingsFormValues>
            field={{
              name: "smsSenderName",
              type: "text",
              label: "Default SMS Sender Name",
              placeholder: "e.g. SwingRides",
              description: "Max 11 characters — carrier restriction.",
              validation: {
                required: "SMS sender name is required",
                maxLength: {
                  value: 11,
                  message: "SMS sender name cannot exceed 11 characters",
                },
              },
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />

          {/* Support Email */}
          <FormField<SettingsFormValues>
            field={{
              name: "supportEmail",
              type: "email",
              label: "Platform Support Email",
              placeholder: "e.g. support@swingrides.ng",
              validation: {
                required: "Support email is required",
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}$/i,
                  message: "Enter a valid email address",
                },
              },
            }}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />
        </div>
      </div>

      {/* ── Section 2: Notification matrix ───────────────── */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-clip">
        {/* Table header */}
        <div className="px-4 md:px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-neutral-950 text-base font-semibold font-text leading-6">
            Notification Preferences
          </h3>
        </div>

        {/* Column headings */}
        <div className="grid grid-cols-[1fr_120px_120px] items-center px-4 md:px-6 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB]">
          <span className="text-gray-700 text-xs font-semibold font-text leading-5">
            Notification Type
          </span>
          <span className="text-gray-700 text-xs font-semibold font-text leading-5 text-center">
            Email
          </span>
          <span className="text-gray-700 text-xs font-semibold font-text leading-5 text-center">
            SMS
          </span>
        </div>

        {/* Notification rows */}
        <div className="divide-y divide-[#E5E7EB]">
          {NOTIFICATION_ROWS.map((row, index) => (
            <div
              key={row.id}
              className={cn(
                "grid grid-cols-[1fr_120px_120px] items-center px-4 md:px-6 py-4 transition-colors duration-150",
                index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]",
              )}
            >
              <span className="justify-start text-neutral-950 text-sm font-medium font-text capitalize leading-5">
                {row.label}
              </span>

              {/* Email checkbox */}
              <div className="flex justify-center">
                <CheckboxInput<SettingsFormValues>
                  field={{
                    name: `notifications.${row.id}.email`,
                    type: "checkbox",
                    className: "justify-center",
                  }}
                  control={control}
                />
              </div>

              {/* SMS checkbox */}
              <div className="flex justify-center">
                <CheckboxInput<SettingsFormValues>
                  field={{
                    name: `notifications.${row.id}.sms`,
                    type: "checkbox",
                    className: "justify-center",
                  }}
                  control={control}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Save button ───────────────────────────────────── */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="bg-blue-700 py-2 px-14.5 rounded-xs border border-blue-700 text-blue-100 cursor-pointer hover:bg-blue-950 hover:border-blue-950 duration-300 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
