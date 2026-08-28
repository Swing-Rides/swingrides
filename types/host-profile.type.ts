import {
  HostBusinessVerificationStatus,
  HostPlanType,
} from "@/app/store/services/settingsApi";

export type { HostBusinessVerificationStatus, HostPlanType };

export type HostPaymentStatus =
  | "pending"
  | "paid"
  | "quote_required"
  | "failed"
  | "incomplete"
  | string;

export type StripeConnectCapabilityStatus =
  | "active"
  | "inactive"
  | "pending"
  | "unrequested"
  | string;

export interface HostInsuranceInfo {
  fee: number;
  provvider: string;
  policyNumber: string;
  expiryDate: string;
}

export interface HostBusinessVerificationInfo {
  status: HostBusinessVerificationStatus;
  businessLicenseUrl?: string;
  submittedAt?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface HostStripeConnectInfo {
  accountId?: string;
  onboardingComplete: boolean;
  detailsSubmitted: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  transfersCapability: StripeConnectCapabilityStatus;
}

export interface HostWalletInfo {
  totalEarnings: number;
  totalWithdrawals: number;
  walletBalance: number;
  currency: string;
}

export interface HostPaymentInfo {
  status: HostPaymentStatus;
  hasPaid: boolean;
  plan: HostPlanType;
  isActive: boolean;
  amountPerMonth?: number;
  currency: string;
  subscriptionDate?: string;
  subscriptionCurrentPeriodEnd?: string;
  subscriptionStatus?: string;
  latestPaymentDate?: string;
  latestPaymentStatus?: string;
  stripeConnect: HostStripeConnectInfo;
  wallet: HostWalletInfo;
}

export interface HostProfileData {
  profilePictureUrl?: string;
  fullName: string;
  phoneNumber?: string;
  email: string;
  companyName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  taxFee?: number;
  insurance?: HostInsuranceInfo;
  businessVerification: HostBusinessVerificationInfo;
  payment: HostPaymentInfo;
}

export interface HostProfileResponse {
  success: boolean;
  data: HostProfileData;
  message?: string;
}
