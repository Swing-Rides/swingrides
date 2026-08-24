"use client";

import { AlertTriangle, RefreshCw, LogIn } from "lucide-react";
import Link from "next/link";

type HostProfileErrorStateProps = {
  onRetry: () => void;
  isRetrying?: boolean;
  errorMessage?: string;
};

export default function HostProfileErrorState({
  onRetry,
  isRetrying = false,
  errorMessage,
}: HostProfileErrorStateProps) {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-lg p-8 md:p-12 bg-white rounded-md border border-gray-200 shadow-xs flex flex-col items-center justify-center text-center gap-5">
        {/* Error Icon */}
        <div className="size-14 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="size-7 text-red-600" />
        </div>

        {/* Headline and Message */}
        <div className="space-y-1.5 max-w-md">
          <h3 className="text-neutral-950 text-lg font-semibold font-text">
            We couldn&apos;t load your host account
          </h3>
          <p className="text-gray-500 text-sm font-normal font-text leading-relaxed">
            {errorMessage ||
              "Something went wrong while connecting to the host service. This could be due to a temporary server outage or network issue. Please check your connection and try again."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-blue-700 rounded-xs text-white text-sm font-semibold font-text hover:bg-blue-900 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <RefreshCw
              className={`size-4 ${isRetrying ? "animate-spin" : ""}`}
            />
            {isRetrying ? "Retrying..." : "Try Again"}
          </button>

          <Link
            href="/host/login"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xs border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors duration-300"
          >
            <LogIn className="size-4" />
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
