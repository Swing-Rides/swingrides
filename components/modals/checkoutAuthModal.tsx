"use client";

import { useState } from "react";
import { X } from "lucide-react";

import ModelBackdrop from "../signUp/modelBackdrop";
import GuestLoginForm from "@/components/forms/GuestLoginForm";
import GuestSignUpForm from "@/components/forms/GuestSignUpForm";
import type { AuthView } from "@/lib/checkout-helpers";

type CheckoutAuthModalProps = {
        /** Called after a successful login/signup — e.g. refetch the profile. */
        onAuthSuccess: () => void | Promise<void>;
        /** Omit to make the modal un-dismissable (forces sign-in to continue). */
        onDismiss?: () => void;
};

/**
 * Guest login/signup modal for checkout. Deliberately stateless with
 * respect to the checkout flow itself — it only owns which tab is active.
 * The payment intent, draft, and clientSecret all live in the parent, so
 * mounting/switching/closing this modal never touches them.
 */
export default function CheckoutAuthModal({
        onAuthSuccess,
        onDismiss,
}: CheckoutAuthModalProps) {
        const [authView, setAuthView] = useState<AuthView>("login");

        return (
                <ModelBackdrop>
                        <div className="w-full max-w-md bg-white rounded-lg p-6 relative">
                                {onDismiss && (
                                        <button
                                                type="button"
                                                aria-label="Close"
                                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                                                onClick={onDismiss}
                                        >
                                                <X className="w-4 h-4" />
                                        </button>
                                )}

                                {/* Tab switcher */}
                                <div className="flex items-center gap-2 mb-5 border-b border-gray-200">
                                        <button
                                                type="button"
                                                className={`px-3 py-2 text-sm font-medium font-text border-b-2 -mb-px transition-colors ${authView === "login"
                                                                ? "border-[#1A56DB] text-[#1A56DB]"
                                                                : "border-transparent text-gray-500 hover:text-gray-700"
                                                        }`}
                                                onClick={() => setAuthView("login")}
                                        >
                                                Log in
                                        </button>
                                        <button
                                                type="button"
                                                className={`px-3 py-2 text-sm font-medium font-text border-b-2 -mb-px transition-colors ${authView === "signup"
                                                                ? "border-[#1A56DB] text-[#1A56DB]"
                                                                : "border-transparent text-gray-500 hover:text-gray-700"
                                                        }`}
                                                onClick={() => setAuthView("signup")}
                                        >
                                                Sign up
                                        </button>
                                </div>

                                <p className="text-sm text-gray-500 font-text mb-4">
                                        {onDismiss
                                                ? "Sign in to continue — your booking details are saved and will still be here."
                                                : "You'll need to sign in to complete this booking — your details are saved and will still be here."}
                                </p>

                                {/*
          No `route` is passed to either form: that keeps them from
          navigating/refreshing on success. Instead `onSuccess` fires
          `onAuthSuccess`, which the checkout page uses to refetch the
          profile — flipping `isLoggedIn` closes this modal without
          touching the payment intent already in flight.
        */}
                                {authView === "login" ? (
                                        <GuestLoginForm
                                                onSuccess={onAuthSuccess}
                                                onSwitchToSignUp={() => setAuthView("signup")}
                                        />
                                ) : (
                                        <GuestSignUpForm
                                                onSuccess={onAuthSuccess}
                                                onSwitchToLogin={() => setAuthView("login")}
                                        />
                                )}
                        </div>
                </ModelBackdrop>
        );
}