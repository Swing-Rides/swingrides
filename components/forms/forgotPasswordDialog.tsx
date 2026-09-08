"use client";

import { useState } from "react";
import { useForm, RegisterOptions } from "react-hook-form";
import { Loader2, Mail, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { validators } from "./form.validators";
import { useForgotPasswordMutation } from "@/app/store/services/hostApi";
import { useRenterForgotPasswordMutation } from "@/app/store/services/renterApi";

type ForgotPasswordFormValues = {
  resetEmail: string;
};

export type ForgotPasswordAccountType = "host" | "renter";

/**
 * Shared by the host and renter login forms.
 *
 * The two account types have separate endpoints backed by separate collections,
 * so the caller says which it is and the right mutation is used. The success
 * copy is deliberately non-committal — the API returns the same response whether
 * or not an account exists for the address, and saying "we sent you an email"
 * unconditionally is what keeps this from becoming a way to discover which
 * addresses are registered.
 */
export default function ForgotPasswordDialog({
  accountType,
  onClose,
}: {
  accountType: ForgotPasswordAccountType;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ mode: "onTouched" });

  const [hostForgotPassword, hostState] = useForgotPasswordMutation();
  const [renterForgotPassword, renterState] = useRenterForgotPasswordMutation();

  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  const isLoading =
    accountType === "host" ? hostState.isLoading : renterState.isLoading;

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setFailed(false);
    const request =
      accountType === "host" ? hostForgotPassword : renterForgotPassword;

    try {
      await request({ email: values.resetEmail }).unwrap();
      setSent(true);
    } catch {
      // Covers a genuine outage or the 3-per-hour send limit; the address
      // itself is never confirmed either way.
      setFailed(true);
    }
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
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-[#1F2937] text-lg font-bold font-text leading-6">
              {sent ? "Check your email" : "Reset your password"}
            </h3>
            <span className="text-[#6B7280] text-sm font-normal font-text leading-5">
              {sent
                ? "If an account exists for that address, we've sent a link to reset your password. It expires in one hour."
                : "Enter your email and we'll send you a reset link."}
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

        {sent ? (
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={onClose}
              className="bg-[#1A56DB] hover:bg-[#1E429F] text-white font-medium font-text cursor-pointer transition-colors duration-300"
            >
              Done
            </Button>
          </div>
        ) : (
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
                <span className="text-[#EF4444] text-xs font-normal font-text">
                  {errors.resetEmail.message as string}
                </span>
              )}
              {failed && (
                <span className="text-[#EF4444] text-xs font-normal font-text">
                  We couldn&apos;t send the email just now. Please try again in a
                  few minutes.
                </span>
              )}
            </div>

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
                disabled={isLoading}
                className="bg-[#1A56DB] hover:bg-[#1E429F] text-white font-medium font-text cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
