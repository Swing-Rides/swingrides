import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, Method } from "axios";
import apiClient from "@/lib";
import { hostApi } from "./hostApi";

type AxiosBaseQueryArgs =
  | string
  | {
      url: string;
      method?: Method;
      body?: unknown;
      data?: unknown;
      params?: Record<string, string | number | boolean | undefined>;
    };

type AxiosBaseQueryError = {
  status?: number;
  data: unknown;
};

const axiosBaseQuery = (): BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  AxiosBaseQueryError
> => {
  return async (args) => {
    const request =
      typeof args === "string"
        ? { url: args, method: "GET" as Method }
        : {
            url: args.url,
            method: args.method ?? "GET",
            data: args.data ?? args.body,
            params: args.params,
          };

    try {
      const result = await apiClient({
        url: request.url,
        method: request.method,
        data: request.data,
        params: request.params,
      });

      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data ?? axiosError.message,
        },
      };
    }
  };
};

export type BillingPaymentStatus = "paid" | "pending" | "failed";
export type CommunicationStatus = "delivered" | "pending" | "failed";
export type AgreementType = "longTerm" | "commercialFleet";
export type HostBusinessVerificationStatus =
  | "not_submitted"
  | "pending"
  | "approved"
  | "rejected";
export type StripeConnectCapabilityStatus =
  | "active"
  | "inactive"
  | "pending"
  | "unrequested";

export type HostProfileCompanySettings = {
  profilePictureUrl?: string;
  fullName: string;
  phoneNumber?: string;
  email: string;
  companyName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  businessVerification: {
    status: HostBusinessVerificationStatus;
    businessLicenseUrl?: string;
    submittedAt?: string;
    reviewedAt?: string;
    notes?: string;
  };
  payment: {
    status: "pending" | "paid" | "quote_required";
    hasPaid: boolean;
    plan: "flex" | "solo" | "fleet";
    isActive: boolean;
    amountPerMonth?: number;
    currency: string;
    subscriptionDate?: string;
    subscriptionCurrentPeriodEnd?: string;
    subscriptionStatus?: string;
    latestPaymentDate?: string;
    latestPaymentStatus?: BillingPaymentStatus;
    stripeConnect: {
      accountId?: string;
      onboardingComplete: boolean;
      detailsSubmitted: boolean;
      chargesEnabled: boolean;
      payoutsEnabled: boolean;
      transfersCapability: StripeConnectCapabilityStatus;
    };
  };
};

export type BillingPaymentHistoryItem = {
  date: string;
  amount: number;
  status: BillingPaymentStatus;
  invoiceId: string;
  invoiceUrl?: string;
};

export type HostBillingSettings = {
  currentPlan: {
    plan: HostPlanType;
    isActive: boolean;
    amountPerMonth?: number;
    currency: string;
    renewsOn?: string;
  };
  paymentHistory: BillingPaymentHistoryItem[];
};

export type CommunicationLogItem = {
  dateTime: string;
  recipient: string;
  message: string;
  status: CommunicationStatus;
};

export type HostCommunicateSettings = {
  communicationLog: CommunicationLogItem[];
};

export type AgreementTemplateItem = {
  type: AgreementType;
  title: string;
  description: string;
  pdfUrl?: string;
  signatureRequestUrl?: string;
  lastSentAt?: string;
};

export type HostAgreementsSettings = {
  templates: AgreementTemplateItem[];
};

export type HostSettingsDashboardData = {
  profileCompany: HostProfileCompanySettings;
  billing: HostBillingSettings;
  communicate: HostCommunicateSettings;
  agreements: HostAgreementsSettings;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type UpdateProfileCompanyRequest = {
  profilePictureUrl?: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  companyName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
};

export type SendSmsRequest = {
  renterPhoneNumber: string;
  message: string;
};

export type UpdateAgreementTemplateRequest = {
  pdfUrl?: string;
  signatureRequestUrl?: string;
};

export type SendAgreementForSignatureRequest = {
  agreementType: AgreementType;
  signatureRequestUrl?: string;
};

export type SubmitHostBusinessVerificationRequest = {
  businessLicenseUrl: string;
};

export type HostBusinessVerificationResponse = {
  status: HostBusinessVerificationStatus;
  businessLicenseUrl?: string;
  submittedAt?: string;
  reviewedAt?: string;
  notes?: string;
};

export type HostPlanType = "flex" | "solo" | "fleet";
export type HostBillingCycle = "monthly" | "yearly";

export type CreateHostPlanPaymentIntentRequest = {
  plan: HostPlanType;
  billingCycle: HostBillingCycle;
  couponCode?: string;
};

export type CreateHostPlanPaymentIntentResponse = {
  id: string;
  subscriptionId: string;
  customerId: string;
  amount: number;
  currency: string;
  clientSecret: string;
  status: string;
  plan: HostPlanType;
  billingCycle: HostBillingCycle;
  subtotal: number;
  discount: number;
  totalAmount: number;
  couponCode?: string;
};

export type CompleteHostPlanPaymentRequest = {
  paymentIntentId: string;
  plan: HostPlanType;
  billingCycle: HostBillingCycle;
};

export type CompleteHostPlanPaymentResponse = {
  paymentStatus: "paid";
  subscriptionDate?: string;
  subscriptionCurrentPeriodEnd?: string;
  subscriptionStatus?: string;
  plan: HostPlanType;
  planPrice?: number;
  currency: string;
  paymentIntentId: string;
  subscriptionId?: string;
  customerId?: string;
  stripeConnectAccountId?: string;
  stripeConnect?: {
    accountId?: string;
    onboardingComplete: boolean;
    detailsSubmitted: boolean;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    transfersCapability: StripeConnectCapabilityStatus;
  };
  onboardingUrl?: string;
};

export type CreateHostStripeConnectOnboardingLinkResponse = {
  accountId: string;
  url: string;
  expiresAt?: string;
  stripeConnect: {
    accountId?: string;
    onboardingComplete: boolean;
    detailsSubmitted: boolean;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    transfersCapability: StripeConnectCapabilityStatus;
  };
};

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["HostSettings"],
  endpoints: (builder) => ({
    getHostSettingsDashboard: builder.query<
      ApiEnvelope<HostSettingsDashboardData>,
      void
    >({
      query: () => ({
        url: "/api/host/settings/dashboard",
        method: "GET",
      }),
      providesTags: [{ type: "HostSettings", id: "DASHBOARD" }],
    }),

    getProfileCompanySettings: builder.query<
      ApiEnvelope<HostProfileCompanySettings>,
      void
    >({
      query: () => ({
        url: "/api/host/settings/profile-company",
        method: "GET",
      }),
      providesTags: [{ type: "HostSettings", id: "PROFILE_COMPANY" }],
    }),

    updateProfileCompanySettings: builder.mutation<
      ApiEnvelope<HostProfileCompanySettings>,
      UpdateProfileCompanyRequest
    >({
      query: (payload) => ({
        url: "/api/host/settings/profile-company",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [
        { type: "HostSettings", id: "DASHBOARD" },
        { type: "HostSettings", id: "PROFILE_COMPANY" },
      ],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(hostApi.util.invalidateTags([{ type: "Host", id: "PROFILE" }]));
      },
    }),

    getBillingSettings: builder.query<ApiEnvelope<HostBillingSettings>, void>({
      query: () => ({
        url: "/api/host/settings/billing",
        method: "GET",
      }),
      providesTags: [{ type: "HostSettings", id: "BILLING" }],
    }),

    getHostBusinessVerification: builder.query<
      ApiEnvelope<HostBusinessVerificationResponse>,
      void
    >({
      query: () => ({
        url: "/api/host/settings/business-verification",
        method: "GET",
      }),
      providesTags: [{ type: "HostSettings", id: "BUSINESS_VERIFICATION" }],
    }),

    submitHostBusinessVerification: builder.mutation<
      ApiEnvelope<HostBusinessVerificationResponse>,
      SubmitHostBusinessVerificationRequest
    >({
      query: (payload) => ({
        url: "/api/host/settings/business-verification",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "HostSettings", id: "DASHBOARD" },
        { type: "HostSettings", id: "PROFILE_COMPANY" },
        { type: "HostSettings", id: "BUSINESS_VERIFICATION" },
      ],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(hostApi.util.invalidateTags([{ type: "Host", id: "PROFILE" }]));
      },
    }),

    getCommunicateSettings: builder.query<
      ApiEnvelope<HostCommunicateSettings>,
      void
    >({
      query: () => ({
        url: "/api/host/settings/communicate",
        method: "GET",
      }),
      providesTags: [{ type: "HostSettings", id: "COMMUNICATE" }],
    }),

    sendSettingsSms: builder.mutation<
      ApiEnvelope<HostCommunicateSettings>,
      SendSmsRequest
    >({
      query: (payload) => ({
        url: "/api/host/settings/communicate/sms",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "HostSettings", id: "DASHBOARD" },
        { type: "HostSettings", id: "COMMUNICATE" },
      ],
    }),

    getAgreementsSettings: builder.query<
      ApiEnvelope<HostAgreementsSettings>,
      void
    >({
      query: () => ({
        url: "/api/host/settings/agreements",
        method: "GET",
      }),
      providesTags: [{ type: "HostSettings", id: "AGREEMENTS" }],
    }),

    updateAgreementTemplate: builder.mutation<
      ApiEnvelope<HostAgreementsSettings>,
      { agreementType: AgreementType; payload: UpdateAgreementTemplateRequest }
    >({
      query: ({ agreementType, payload }) => ({
        url: `/api/host/settings/agreements/${agreementType}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [
        { type: "HostSettings", id: "DASHBOARD" },
        { type: "HostSettings", id: "AGREEMENTS" },
      ],
    }),

    sendAgreementForSignature: builder.mutation<
      ApiEnvelope<HostAgreementsSettings>,
      SendAgreementForSignatureRequest
    >({
      query: ({ agreementType, signatureRequestUrl }) => ({
        url: `/api/host/settings/agreements/${agreementType}/send-signature`,
        method: "POST",
        body: { signatureRequestUrl },
      }),
      invalidatesTags: [
        { type: "HostSettings", id: "DASHBOARD" },
        { type: "HostSettings", id: "AGREEMENTS" },
      ],
    }),

    createHostPlanPaymentIntent: builder.mutation<
      ApiEnvelope<CreateHostPlanPaymentIntentResponse>,
      CreateHostPlanPaymentIntentRequest
    >({
      query: (payload) => ({
        url: "/api/host/settings/plan/create-payment-intent",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "HostSettings", id: "DASHBOARD" },
        { type: "HostSettings", id: "PROFILE_COMPANY" },
        { type: "HostSettings", id: "BILLING" },
      ],
    }),

    completeHostPlanPayment: builder.mutation<
      ApiEnvelope<CompleteHostPlanPaymentResponse>,
      CompleteHostPlanPaymentRequest
    >({
      query: (payload) => ({
        url: "/api/host/settings/plan/payment",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "HostSettings", id: "DASHBOARD" },
        { type: "HostSettings", id: "PROFILE_COMPANY" },
        { type: "HostSettings", id: "BILLING" },
      ],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(hostApi.util.invalidateTags([{ type: "Host", id: "PROFILE" }]));
      },
    }),

    createHostStripeConnectOnboardingLink: builder.mutation<
      ApiEnvelope<CreateHostStripeConnectOnboardingLinkResponse>,
      void
    >({
      query: () => ({
        url: "/api/host/settings/plan/connect/onboarding-link",
        method: "POST",
      }),
      invalidatesTags: [
        { type: "HostSettings", id: "DASHBOARD" },
        { type: "HostSettings", id: "PROFILE_COMPANY" },
        { type: "HostSettings", id: "BILLING" },
      ],
    }),
  }),
});

export const {
  useGetHostSettingsDashboardQuery,
  useGetProfileCompanySettingsQuery,
  useUpdateProfileCompanySettingsMutation,
  useGetBillingSettingsQuery,
  useGetHostBusinessVerificationQuery,
  useSubmitHostBusinessVerificationMutation,
  useGetCommunicateSettingsQuery,
  useSendSettingsSmsMutation,
  useGetAgreementsSettingsQuery,
  useUpdateAgreementTemplateMutation,
  useSendAgreementForSignatureMutation,
  useCreateHostPlanPaymentIntentMutation,
  useCompleteHostPlanPaymentMutation,
  useCreateHostStripeConnectOnboardingLinkMutation,
} = settingsApi;
