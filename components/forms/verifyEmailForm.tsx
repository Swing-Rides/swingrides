"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import {
  useVerifyHostEmailMutation,
  useResendHostVerificationMutation,
} from "@/app/store/services/hostApi";
import {
  useVerifyRenterEmailMutation,
  useResendRenterVerificationMutation,
} from "@/app/store/services/renterApi";
import { getErrorMessage } from "@/lib/checkout-helpers";

type VerifyEmailValues = {
  email: string;
  code: string;
};

type AccountType = "host" | "renter";

const DESTINATION: Record<AccountType, string> = {
  host: "/us/host",
  renter: "/profile",
};

const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountType: AccountType =
    searchParams.get("type") === "host" ? "host" : "renter";
  const emailParam = searchParams.get("email") || "";
  const codeParam = searchParams.get("code") || "";

  const [verifyHostEmail, { isLoading: isVerifyingHost }] =
    useVerifyHostEmailMutation();
  const [resendHostVerification, { isLoading: isResendingHost }] =
    useResendHostVerificationMutation();
  const [verifyRenterEmail, { isLoading: isVerifyingRenter }] =
    useVerifyRenterEmailMutation();
  const [resendRenterVerification, { isLoading: isResendingRenter }] =
    useResendRenterVerificationMutation();

  const isVerifying =
    accountType === "host" ? isVerifyingHost : isVerifyingRenter;
  const isResending =
    accountType === "host" ? isResendingHost : isResendingRenter;

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const hasAutoSubmitted = useRef(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<VerifyEmailValues>({
    defaultValues: { email: emailParam, code: codeParam },
  });

  const submitVerification = async (values: VerifyEmailValues) => {
    setStatus("idle");
    setFeedback(null);

    try {
      if (accountType === "host") {
        await verifyHostEmail({
          email: values.email,
          code: values.code,
        }).unwrap();
      } else {
        await verifyRenterEmail({
          email: values.email,
          code: values.code,
        }).unwrap();
      }

      setStatus("success");
      setFeedback("Your email has been verified.");
      toast.success("Email verified!");
      setTimeout(() => router.push(DESTINATION[accountType]), 1200);
    } catch (error) {
      setStatus("error");
      setFeedback(
        getErrorMessage(error, "That code is invalid or has expired."),
      );
    }
  };

  // A link clicked straight from the email carries both `email` and `code` —
  // verify automatically so the user lands on a finished screen instead of
  // having to retype what the link already gave us.
  useEffect(() => {
    if (hasAutoSubmitted.current || !emailParam || !codeParam) return;
    hasAutoSubmitted.current = true;
    void submitVerification({ email: emailParam, code: codeParam });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailParam, codeParam]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(
      () => setResendCooldown((seconds) => Math.max(0, seconds - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("Enter your email address first.");
      return;
    }

    try {
      if (accountType === "host") {
        await resendHostVerification({ email }).unwrap();
      } else {
        await resendRenterVerification({ email }).unwrap();
      }
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't resend the code."));
    }
  };

  const isAutoVerifying = Boolean(emailParam && codeParam) && status === "idle";

  return (
    <div className="w-full max-w-100 mx-auto flex flex-col gap-6 text-center">
      {isAutoVerifying || (isVerifying && status === "idle") ? (
        <div className="flex flex-col items-center gap-3 py-6">
          <Loader2 className="size-10 text-blue-700 animate-spin" />
          <p className="text-gray-600 text-sm font-normal font-text">
            Verifying your email...
          </p>
        </div>
      ) : status === "success" ? (
        <div className="flex flex-col items-center gap-3 py-6">
          <CheckCircle2 className="size-12 text-emerald-500" />
          <h2 className="text-neutral-950 text-xl font-semibold font-text">
            Email verified
          </h2>
          <p className="text-gray-500 text-sm font-normal font-text">
            Redirecting you now...
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Mail className="size-6 text-blue-700" />
            </div>
            <h2 className="text-neutral-950 text-xl font-semibold font-text">
              Verify your email
            </h2>
            <p className="text-gray-500 text-sm font-normal font-text">
              We sent a 6-digit code to your email. Enter it below, or click
              the &quot;Verify Email&quot; button in that email instead.
            </p>
          </div>

          {status === "error" && feedback ? (
            <div className="flex items-center justify-center gap-2 rounded-[10px] bg-red-50 p-3 text-sm font-medium text-red-700">
              <XCircle className="size-4 shrink-0" />
              <span>{feedback}</span>
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit(submitVerification)}
            className="flex flex-col gap-4 text-left"
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="verify-email"
                className="text-neutral-950 text-sm font-semibold font-text"
              >
                Email Address
              </label>
              <input
                id="verify-email"
                type="email"
                autoComplete="email"
                placeholder="john@email.com"
                className="w-full rounded-xs border border-gray-300 px-3 py-2.5 text-sm font-text text-neutral-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email ? (
                <span className="text-xs text-red-600 font-text">
                  {errors.email.message}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="verify-code"
                className="text-neutral-950 text-sm font-semibold font-text"
              >
                Verification Code
              </label>
              <input
                id="verify-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                className="w-full rounded-xs border border-gray-300 px-3 py-2.5 text-center text-lg tracking-[0.5em] font-text text-neutral-950 placeholder:text-gray-400 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-700"
                {...register("code", {
                  required: "Verification code is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Enter the 6-digit code",
                  },
                })}
              />
              {errors.code ? (
                <span className="text-xs text-red-600 font-text">
                  {errors.code.message}
                </span>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 rounded-xs bg-blue-700 text-white text-sm font-semibold font-text hover:bg-blue-950 transition-colors duration-300 disabled:opacity-60 cursor-pointer"
            >
              {isVerifying ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="text-center">
            <span className="text-gray-500 text-xs font-normal font-text">
              Didn&apos;t get a code?{" "}
            </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className="text-blue-700 text-xs font-semibold font-text hover:underline disabled:opacity-60 disabled:no-underline cursor-pointer"
            >
              {resendCooldown > 0
                ? `Resend code (${resendCooldown}s)`
                : isResending
                  ? "Sending..."
                  : "Resend code"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
