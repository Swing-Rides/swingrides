"use client";

import { Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useRenterRegisterMutation } from "@/app/store/services/renterApi";
import MainForm from "./MainForm";
import { validators } from "./form.validators";
import { FormFieldConfig } from "./types";
import { getErrorMessage } from "@/lib/checkout-helpers";

const fields: FormFieldConfig[] = [
  {
    name: "firstName",
    type: "text",
    label: "First Name",
    placeholder: "John",
    icon: <User className="size-4" />,
    validation: validators.name("First name"),
    className: "w-full",
  },
  {
    name: "lastName",
    type: "text",
    label: "Last Name",
    placeholder: "Doe",
    icon: <User className="size-4" />,
    validation: validators.name("Last name"),
    className: "w-full",
  },
  {
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "john@email.com",
    icon: <Mail className="size-4" />,
    validation: validators.email(),
  },
  {
    name: "phoneNumber",
    type: "tel",
    label: "Phone Number",
    placeholder: "+1 555-123-4567",
    icon: <Mail className="size-4" />,
    validation: validators.phone(),
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Create a password",
    validation: validators.password(),
  },
  {
    name: "terms",
    type: "checkbox",
    label: "I agree to the Terms and Conditions",
    validation: validators.checkbox("Terms and Conditions"),
  },
];

type SignUpValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  terms: boolean;
};

type GuestSignUpFormProps = {
  /**
   * Where to send the user after a successful signup. If omitted, the page
   * is refreshed in place (the default) — pass `onSuccess` instead when you
   * need full control over what happens next (e.g. inside a modal).
   */
  route?: string;
  /** Called after a successful signup, before any navigation/refresh. */
  onSuccess?: () => void | Promise<void>;
  /** Optional "Already have an account? Log in" affordance for the caller. */
  onSwitchToLogin?: () => void;
};

export default function GuestSignUpForm({
  route,
  onSuccess,
  onSwitchToLogin,
}: GuestSignUpFormProps) {
  const router = useRouter();
  const [renterSignUp, { isLoading }] = useRenterRegisterMutation();

  const handleSubmit = async (values: SignUpValues) => {
    try {
      const response = await renterSignUp({
        email: String(values.email),
        firstName: String(values.firstName),
        lastName: String(values.lastName),
        password: String(values.password),
        phoneNumber: String(values.phoneNumber),
        termsAgreement: Boolean(values.terms),
      }).unwrap();

      if (!response.success) {
        toast.error("Unable to create your account. Please try again.");
        return;
      }

      toast.success("Account created — you're all set!");

      if (onSuccess) {
        await onSuccess();
        return;
      }

      if (route) {
        router.push(route);
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Sign up failed. Please try again."));
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <MainForm
        fields={fields}
        onSubmit={async (values) => handleSubmit(values as SignUpValues)}
        submitLabel="Create Account"
        isLoading={isLoading}
        className="w-full"
        rowPairs={[["firstName", "lastName"]]}
      />
      {onSwitchToLogin && (
        <p className="text-xs text-center font-text text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-[#1A56DB] font-medium hover:underline"
          >
            Log in
          </button>
        </p>
      )}
    </div>
  );
}