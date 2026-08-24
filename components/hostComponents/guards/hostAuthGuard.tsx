"use client";

import { ReactNode, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetHostProfileQuery } from "@/app/store/services/hostApi";
import {
  checkHostAccess,
  validateHostProfile,
} from "../utils/hostAuthHelper";
import HostProfileErrorState from "./hostProfileErrorState";
import { Loader2 } from "lucide-react";

export interface HostAuthGuardProps {
  children: ReactNode;
  requirePayment?: boolean;
  requireVerification?: boolean;
  fallback?: ReactNode;
}

/**
 * Checks if an error represents an authentication failure (401/403)
 * versus a server/network error (500/502/503/timeout/network offline).
 */
export function isAuthenticationError(error: unknown): boolean {
  if (!error) return false;
  if (typeof error === "object" && error !== null) {
    const errObj = error as {
      status?: number | string;
      data?: { message?: string } | string;
    };

    if (
      errObj.status === 401 ||
      errObj.status === 403 ||
      errObj.status === "401" ||
      errObj.status === "403"
    ) {
      return true;
    }

    const message =
      typeof errObj.data === "string"
        ? errObj.data
        : errObj.data?.message;

    if (typeof message === "string") {
      const lower = message.toLowerCase();
      if (
        lower.includes("unauthorized") ||
        lower.includes("unauthenticated") ||
        lower.includes("invalid token") ||
        lower.includes("session expired") ||
        lower.includes("jwt expired")
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Reusable Host Auth Guard component.
 * - If session verification is in flight: displays loading state.
 * - If server / network error occurs: displays HostProfileErrorState with retry option.
 * - If unauthenticated (null data / 401 / 403): redirects to /host/login.
 * - If authenticated: renders children.
 */
export default function HostAuthGuard({
  children,
  requirePayment = false,
  requireVerification = false,
  fallback,
}: HostAuthGuardProps) {
  const router = useRouter();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetHostProfileQuery();

  // While initially loading profile data, display fallback or spinner
  if (isLoading) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="flex-1 w-full min-h-[60vh] flex flex-col items-center justify-center p-6 gap-3">
        <Loader2 className="size-8 text-blue-700 animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          Verifying host session...
        </p>
      </div>
    );
  }

  // If an API error occurred:
  if (isError) {
    // 1. If it's strictly an authentication error (401/403/expired session), redirect to login
    if (isAuthenticationError(error)) {
      router.replace("/host/login");
      return (
        <div className="flex-1 w-full min-h-[60vh] flex flex-col items-center justify-center p-6 gap-3">
          <Loader2 className="size-8 text-blue-700 animate-spin" />
          <p className="text-sm font-medium text-slate-500">
            Session expired. Redirecting to host login...
          </p>
        </div>
      );
    }

    // 2. If it is a server outage, 500, network error, or gateway error, show UI Error State with Retry
    const errorData = (error as { data?: { message?: string } | string })?.data;
    const errorMessage =
      typeof errorData === "string"
        ? errorData
        : errorData?.message || undefined;

    return (
      <HostProfileErrorState
        onRetry={refetch}
        isRetrying={isFetching}
        errorMessage={errorMessage}
      />
    );
  }

  // Check access using helper function for non-error null checks & permission rules
  const access = checkHostAccess({
    profile: data,
    router,
    requirePayment,
    requireVerification,
  });

  // If user data returned null without HTTP error (explicit empty payload), redirect to login
  if (!access.canAccess || !data?.data) {
    return (
      <div className="flex-1 w-full min-h-[60vh] flex flex-col items-center justify-center p-6 gap-3">
        <Loader2 className="size-8 text-blue-700 animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          Redirecting to host login...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Reusable hook to check and guard host access inside host components.
 */
export function useHostAuthGuard(options?: {
  requirePayment?: boolean;
  requireVerification?: boolean;
}) {
  const router = useRouter();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetHostProfileQuery();

  const isAuthFail = isAuthenticationError(error);
  const isServerFail = isError && !isAuthFail;

  const validation = useMemo(() => validateHostProfile(data), [data]);

  const access = useMemo(
    () =>
      checkHostAccess({
        profile: data,
        requirePayment: options?.requirePayment,
        requireVerification: options?.requireVerification,
      }),
    [data, options?.requirePayment, options?.requireVerification]
  );

  const enforceRedirect = () => {
    if (!access.canAccess && access.redirectUrl) {
      router.replace(access.redirectUrl);
    }
  };

  return {
    host: data?.data,
    profileResponse: data,
    isLoading,
    isFetching,
    isError,
    isAuthError: isAuthFail,
    isServerError: isServerFail,
    error,
    isAuthorized: access.canAccess && !isError,
    validation,
    enforceRedirect,
    refetch,
  };
}
