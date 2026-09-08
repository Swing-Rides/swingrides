"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import MainForm from "./MainForm";
import { validators } from "./form.validators";
import { FormFieldConfig } from "./types";
import { useResetPasswordMutation } from "@/app/store/services/hostApi";
import { useRenterResetPasswordMutation } from "@/app/store/services/renterApi";
import { getErrorMessage } from "@/lib/checkout-helpers";

type AccountType = "host" | "renter";

/**
 * Hosts and renters have separate reset endpoints backed by separate
 * collections, and the emailed link is the only thing that says which is which
 * — hence the `type` query param that sendPasswordResetEmail now appends.
 * Anything other than "host" is treated as a renter, matching how
 * verifyEmailForm reads the same parameter.
 */
const LOGIN_PAGE: Record<AccountType, string> = {
  host: "/host/login",
  renter: "/sign-in",
};

const fields: FormFieldConfig[] = [
  {
    name: "newPassword",
    type: "password",
    label: "New Password",
    placeholder: "At least 8 characters",
    validation: validators.password(),
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirm New Password",
    placeholder: "Re-enter your new password",
    validation: {
      required: "Please confirm your new password",
      // react-hook-form hands the whole form's values to `validate` as its
      // second argument, which is how this reaches the other field.
      validate: (value: string, formValues: Record<string, unknown>) =>
        value === formValues.newPassword || "Passwords do not match",
    },
  },
];

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const accountType: AccountType =
    searchParams.get("type") === "host" ? "host" : "renter";

  const [resetHostPassword, hostState] = useResetPasswordMutation();
  const [resetRenterPassword, renterState] = useRenterResetPasswordMutation();
  const [done, setDone] = useState(false);

  const isLoading =
    accountType === "host" ? hostState.isLoading : renterState.isLoading;
  const loginHref = LOGIN_PAGE[accountType];

  const handleSubmit = async (values: Record<string, unknown>) => {
    const request =
      accountType === "host" ? resetHostPassword : resetRenterPassword;

    try {
      await request({
        token,
        newPassword: String(values.newPassword),
      }).unwrap();
      setDone(true);
    } catch (error) {
      // Covers an expired or already-used token as well as a rejected password.
      toast.error(
        getErrorMessage(
          error,
          "We couldn't reset your password. The link may have expired.",
        ),
      );
    }
  };

  // A link that arrives without a token can never succeed, so say so up front
  // rather than letting someone fill the form in and then fail.
  if (!token) {
    return (
      <div className="w-full max-w-md flex flex-col items-center gap-4 text-center">
        <XCircle className="size-10 text-[#EF4444]" />
        <h1 className="text-[#1F2937] text-xl font-bold font-text">
          This reset link isn&apos;t valid
        </h1>
        <p className="text-[#6B7280] text-sm font-text">
          It may have been copied incompletely. Request a new link from the
          login page and use the most recent email.
        </p>
        <Link
          href={loginHref}
          className="text-[#1A56DB] text-sm font-medium font-text hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full max-w-md flex flex-col items-center gap-4 text-center">
        <CheckCircle2 className="size-10 text-[#0E9F6E]" />
        <h1 className="text-[#1F2937] text-xl font-bold font-text">
          Password updated
        </h1>
        <p className="text-[#6B7280] text-sm font-text">
          You&apos;ve been signed out on any other devices. Sign in with your
          new password to continue.
        </p>
        <button
          type="button"
          onClick={() => router.push(loginHref)}
          className="bg-[#1A56DB] hover:bg-[#1E429F] text-white text-sm font-medium font-text rounded-md px-5 py-2.5 cursor-pointer transition-colors duration-300"
        >
          Go to login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-[#1F2937] text-xl font-bold font-text">
          Choose a new password
        </h1>
        <p className="text-[#6B7280] text-sm font-text">
          Reset links expire an hour after they&apos;re sent.
        </p>
      </div>
      <MainForm
        fields={fields}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Update Password"
        className="w-full"
      />
      <Link
        href={loginHref}
        className="text-[#1A56DB] text-sm font-medium font-text hover:underline text-center"
      >
        Back to login
      </Link>
    </div>
  );
}
