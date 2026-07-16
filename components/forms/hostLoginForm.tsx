"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import MainForm from "./MainForm";
import { validators } from "./form.validators";
import { FormFieldConfig } from "./types";
import { RegisterOptions } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useHostLoginMutation } from "@/app/store/services/hostApi";
import { useRouter } from "next/navigation";

const fields: FormFieldConfig[] = [
  {
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "john@company.com",
    icon: <Mail className="size-4" />,
    validation: validators.email() as RegisterOptions,
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Enter your password",
    validation: validators.required("Password") as RegisterOptions,
  },
];

export default function HostLoginForm() {
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [hostLogin, { isLoading }] = useHostLoginMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (values: Record<string, unknown>) => {
    const payload = {
      email: values.email as string,
      password: values.password as string,
    };

    const response = await hostLogin(payload).unwrap();
    if (response.success) {
      router.push("/us/host");
    } else {
      setErrorMessage(response.message || "Sign in failed. Please try again.");
      return;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 w-full">
        {/* The two main fields via MainForm */}
        <MainForm
          fields={fields}
          onSubmit={onSubmit}
          submitLabel="Sign In"
          className="w-full"
          isLoading={isLoading}
          footerSlot={
            <>
              {errorMessage && <span className="font-text text-xs text-red-500 text-center">
                {errorMessage}
              </span>}
              <RememberForgotRow
                onForgotPassword={() => setForgotPasswordOpen(true)}
              />
            </>
          }
        />
      </div>

      {/* Forgot password dialog */}
      {forgotPasswordOpen && (
        <ForgotPasswordDialog onClose={() => setForgotPasswordOpen(false)} />
      )}
    </>
  );
}

// ─── Remember me + Forgot password row ───────────────────────────────────────

const RememberForgotRow = ({
  onForgotPassword,
}: {
  onForgotPassword: () => void;
}) => {
  const [remembered, setRemembered] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Checkbox
          id="rememberMe"
          checked={remembered}
          onCheckedChange={(v) => setRemembered(!!v)}
          className="border-[#E5E7EB] data-[state=checked]:bg-[#1A56DB] data-[state=checked]:border-[#1A56DB]"
        />
        <label
          htmlFor="rememberMe"
          className="text-[#6B7280] text-sm font-normal font-text cursor-pointer select-none"
        >
          Remember me
        </label>
      </div>
      <button
        type="button"
        onClick={onForgotPassword}
        className="text-[#1A56DB] text-sm font-medium font-text hover:underline cursor-pointer"
      >
        Forgot password?
      </button>
    </div>
  );
};

// ─── Forgot password dialog ───────────────────────────────────────────────────

type ForgotPasswordFormValues = {
  resetEmail: string;
};

const ForgotPasswordDialog = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({ mode: "onTouched" });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    console.log("reset password for:", values.resetEmail);
    // TODO: call reset password API here
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-[10px] border border-[#E5E7EB] p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-[#1F2937] text-lg font-bold font-text leading-6">
              Reset your password
            </h3>
            <span className="text-[#6B7280] text-sm font-normal font-text leading-5">
              Enter your email and we&apos;ll send you a reset link.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[#6B7280] hover:text-[#1F2937] transition-colors duration-150 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="resetEmail"
              className="text-[#1F2937] text-sm font-semibold font-text"
            >
              Email Address <span className="text-[#EF4444]">*</span>
            </Label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[#9CA3AF] pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <Input
                id="resetEmail"
                type="email"
                placeholder="john@company.com"
                autoComplete="email"
                className={cn(
                  "pl-9 border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF]",
                  errors.resetEmail &&
                    "border-[#EF4444] focus-visible:ring-[#EF4444]",
                )}
                {...register(
                  "resetEmail",
                  validators.email() as RegisterOptions<
                    ForgotPasswordFormValues,
                    "resetEmail"
                  >,
                )}
              />
            </div>
            {errors.resetEmail && (
              <span className="text-[#EF4444] text-xs font-normal font-text flex items-center gap-1">
                <ErrorIcon />
                {errors.resetEmail.message as string}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] font-medium font-text cursor-pointer transition-colors duration-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#1A56DB] hover:bg-[#1E429F] text-white font-medium font-text cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner />
                  Sending...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const ErrorIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 1L11 10H1L6 1Z"
      stroke="#EF4444"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6 5V7" stroke="#EF4444" strokeWidth="1" strokeLinecap="round" />
    <circle cx="6" cy="8.5" r="0.5" fill="#EF4444" />
  </svg>
);

const LoadingSpinner = () => (
  <svg
    className="animate-spin w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);
