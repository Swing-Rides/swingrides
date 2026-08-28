import {
  HostProfileResponse,
  HostProfileData,
  HostBusinessVerificationStatus,
  HostPlanType,
  HostPaymentStatus,
} from "@/types/host-profile.type";

export interface HostProfileValidationResult {
  /** True if profile data is loaded and non-null */
  isAuthenticated: boolean;
  /** Extracted profile data (if available) */
  host: HostProfileData | null;
  /** Business verification details */
  verification: {
    status: HostBusinessVerificationStatus;
    isApproved: boolean;
    isPending: boolean;
    isRejected: boolean;
    isNotSubmitted: boolean;
    licenseUrl?: string;
  };
  /** Payment details */
  payment: {
    status: HostPaymentStatus;
    hasPaid: boolean;
    isActive: boolean;
    plan: HostPlanType | string;
    hasValidPlan: boolean;
    amountPerMonth?: number;
    currency: string;
    isStripeOnboarded: boolean;
  };
  /** Overall readiness */
  isFullyOnboarded: boolean;
  needsVerification: boolean;
  needsPayment: boolean;
  needsPlan: boolean;
  /** Suggested redirect URL if access cannot be granted */
  suggestedRedirectUrl: string | null;
}

const DEFAULT_LOGIN_PATH = "/host/login";
const DEFAULT_REGISTRATION_PATH = "/us/host/host-complete-registration";

/**
 * Pure validation helper function that evaluates the host profile response.
 * Checks for null data, business verification, payment status, and payment plan.
 */
export function validateHostProfile(
  profileInput?: HostProfileResponse | HostProfileData | null
): HostProfileValidationResult {
  // If input is wrapped in { success, data } envelope or passed directly as HostProfileData
  const profile: HostProfileData | null =
    profileInput && "data" in profileInput && profileInput.data
      ? profileInput.data
      : profileInput && "fullName" in profileInput
      ? (profileInput as HostProfileData)
      : null;

  if (!profile) {
    return {
      isAuthenticated: false,
      host: null,
      verification: {
        status: "not_submitted",
        isApproved: false,
        isPending: false,
        isRejected: false,
        isNotSubmitted: true,
      },
      payment: {
        status: "pending",
        hasPaid: false,
        isActive: false,
        plan: "",
        hasValidPlan: false,
        currency: "USD",
        isStripeOnboarded: false,
      },
      isFullyOnboarded: false,
      needsVerification: true,
      needsPayment: true,
      needsPlan: true,
      suggestedRedirectUrl: DEFAULT_LOGIN_PATH,
    };
  }

  // Check business verification
  const verificationStatus: HostBusinessVerificationStatus =
    profile.businessVerification?.status ?? "not_submitted";
  const isApproved = verificationStatus === "approved";
  const isPending = verificationStatus === "pending";
  const isRejected = verificationStatus === "rejected";
  const isNotSubmitted = verificationStatus === "not_submitted";

  // Check payment and plan
  const payment = profile.payment;
  const paymentStatus: HostPaymentStatus = payment?.status ?? "pending";
  const hasPaid = Boolean(payment?.hasPaid && (paymentStatus === "paid" || payment?.isActive));
  const isActive = Boolean(payment?.isActive);
  const plan: HostPlanType = payment?.plan ?? "";
  const validPlans = ["solo", "flex", "fleet"];
  const hasValidPlan = Boolean(plan && validPlans.includes(plan.toLowerCase()));
  const isStripeOnboarded = Boolean(payment?.stripeConnect?.onboardingComplete);

  const isSoloPlan = plan.toLowerCase() === "solo";
  const needsVerification = !isSoloPlan && !isApproved;
  const needsPayment = !hasPaid || paymentStatus !== "paid";
  const needsPlan = !hasValidPlan;
  const isFullyOnboarded =
    (isSoloPlan || isApproved) && hasPaid && isActive && hasValidPlan;

  let suggestedRedirectUrl: string | null = null;
  if (needsPayment || needsPlan) {
    suggestedRedirectUrl = DEFAULT_REGISTRATION_PATH;
  }

  return {
    isAuthenticated: true,
    host: profile,
    verification: {
      status: verificationStatus,
      isApproved,
      isPending,
      isRejected,
      isNotSubmitted,
      licenseUrl: profile.businessVerification?.businessLicenseUrl,
    },
    payment: {
      status: paymentStatus,
      hasPaid,
      isActive,
      plan,
      hasValidPlan,
      amountPerMonth: payment?.amountPerMonth,
      currency: payment?.currency ?? "USD",
      isStripeOnboarded,
    },
    isFullyOnboarded,
    needsVerification,
    needsPayment,
    needsPlan,
    suggestedRedirectUrl,
  };
}

export interface CheckHostAccessOptions {
  profile?: HostProfileResponse | HostProfileData | null;
  router?: { replace: (url: string) => void; push: (url: string) => void };
  requirePayment?: boolean;
  requireVerification?: boolean;
  onUnauthenticated?: () => void;
  onPaymentRequired?: () => void;
  onVerificationRequired?: () => void;
}

export interface CheckHostAccessResult {
  canAccess: boolean;
  redirectUrl: string | null;
  status: HostProfileValidationResult;
}

/**
 * Reusable helper function to enforce host access protection.
 * If user data is null or fails authentication, redirects to /host/login.
 * Also evaluates business verification, payment status, and payment plan.
 */
export function checkHostAccess({
  profile,
  router,
  requirePayment = false,
  requireVerification = false,
  onUnauthenticated,
  onPaymentRequired,
  onVerificationRequired,
}: CheckHostAccessOptions): CheckHostAccessResult {
  const status = validateHostProfile(profile);

  // 1. Check if user is authenticated (data not null)
  if (!status.isAuthenticated) {
    if (onUnauthenticated) {
      onUnauthenticated();
    } else if (router) {
      router.replace(DEFAULT_LOGIN_PATH);
    } else if (typeof window !== "undefined") {
      window.location.href = DEFAULT_LOGIN_PATH;
    }
    return {
      canAccess: false,
      redirectUrl: DEFAULT_LOGIN_PATH,
      status,
    };
  }

  // 2. Check payment status & plan (if strictly required)
  if (requirePayment && (status.needsPayment || status.needsPlan)) {
    const redirectUrl = status.suggestedRedirectUrl ?? DEFAULT_REGISTRATION_PATH;
    if (onPaymentRequired) {
      onPaymentRequired();
    } else if (router) {
      router.replace(redirectUrl);
    } else if (typeof window !== "undefined") {
      window.location.href = redirectUrl;
    }
    return {
      canAccess: false,
      redirectUrl,
      status,
    };
  }

  // 3. Check business verification (if strictly required)
  if (requireVerification && status.needsVerification) {
    const redirectUrl = DEFAULT_REGISTRATION_PATH;
    if (onVerificationRequired) {
      onVerificationRequired();
    } else if (router) {
      router.replace(redirectUrl);
    } else if (typeof window !== "undefined") {
      window.location.href = redirectUrl;
    }
    return {
      canAccess: false,
      redirectUrl,
      status,
    };
  }

  return {
    canAccess: true,
    redirectUrl: null,
    status,
  };
}
