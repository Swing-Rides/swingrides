"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import ForgotPasswordDialog from "./forgotPasswordDialog";
import MainForm from "./MainForm";
import { validators } from "./form.validators";
import { FormFieldConfig } from "./types";
import { RegisterOptions } from "react-hook-form";
import { useHostLoginMutation } from "@/app/store/services/hostApi";
import { useDispatch } from "react-redux";
import { resetHostApiState } from "@/app/store/resetState";

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
  const dispatch = useDispatch();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [hostLogin, { isLoading }] = useHostLoginMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (values: Record<string, unknown>) => {
    const payload = {
      email: values.email as string,
      password: values.password as string,
    };

    const response = await hostLogin(payload).unwrap();
    if (response.success) {
      resetHostApiState(dispatch);
      if (response.host && !response.host.emailVerified) {
        window.location.href = `/verify-email?type=host&email=${encodeURIComponent(response.host.email)}`
      } else {
        window.location.href = "/us/host"
      }
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
        <ForgotPasswordDialog
          accountType="host"
          onClose={() => setForgotPasswordOpen(false)}
        />
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

