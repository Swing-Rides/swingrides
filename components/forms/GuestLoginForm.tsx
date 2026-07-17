"use client";

import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import MainForm from "./MainForm";

import { useRenterLoginMutation } from "@/app/store/services/renterApi";
import { validators } from "./form.validators";
import { FormFieldConfig } from "./types";
import { getErrorMessage } from "@/lib/checkout-helpers";

const fields: FormFieldConfig[] = [
  {
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "john@email.com",
    icon: <Mail className="w-4 h-4" />,
    validation: validators.email(),
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Create a password",
    validation: validators.password(),
  },
];

type LoginValues = { email: string; password: string };

type GuestLoginFormProps = {
  /**
   * Where to send the user after a successful login. If omitted, the page
   * is refreshed in place (the default) — pass `onSuccess` instead when you
   * need full control over what happens next (e.g. inside a modal).
   */
  route?: string;
  /** Called after a successful login, before any navigation/refresh. */
  onSuccess?: () => void | Promise<void>;
  /** Optional "Don't have an account? Sign up" affordance for the caller. */
  onSwitchToSignUp?: () => void;
};

export default function GuestLoginForm({
  route,
  onSuccess,
  onSwitchToSignUp,
}: GuestLoginFormProps) {
  const router = useRouter();
  const [renterLogin, { isLoading }] = useRenterLoginMutation();

  const handleSubmit = async (values: LoginValues) => {
    try {
      const response = await renterLogin(values).unwrap();

      if (!response.success) {
        toast.error("Unable to log in. Please check your details and try again.");
        return;
      }

      toast.success("Welcome back!");

      if (onSuccess) {
        // Caller takes over from here (e.g. closing a modal) — skip the
        // default navigation so in-progress state (like a payment intent)
        // isn't disturbed.
        await onSuccess();
        return;
      }

      if (route) {
        router.push(route);
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Login failed. Please try again."));
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <MainForm
        fields={fields}
        onSubmit={async (values) => handleSubmit(values as LoginValues)}
        isLoading={isLoading}
        submitLabel="Sign In"
        className="w-full"
      />
      {onSwitchToSignUp && (
        <p className="text-xs text-center font-text text-gray-500">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-[#1A56DB] font-medium hover:underline"
          >
            Sign up
          </button>
        </p>
      )}
    </div>
  );
}