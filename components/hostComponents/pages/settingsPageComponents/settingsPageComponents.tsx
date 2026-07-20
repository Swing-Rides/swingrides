"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import PageWrapper from "../../dashboard/pageWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageSquare, User, CreditCard } from "lucide-react";
import { ProfileCompanyFormValues } from "../../forms/profileCompanyForm";
import {
  ProfileCompanyTab,
  BillingTab,
  CommunicateTab,
  AgreementsTab,
  PaymentHistoryRow,
  CommunicationLogRow,
  AgreementData,
} from "./settingsTabs";
import {
  HostPlanType,
  HostBillingCycle,
  UpgradePlanResponse,
  useGetHostSettingsDashboardQuery,
  useUpdateProfileCompanySettingsMutation,
  useUnlinkStripeConnectMutation,
  useUpgradePlanMutation,
} from "@/app/store/services/settingsApi";
import { useGetHostProfileQuery } from "@/app/store/services/hostApi";
import { toast } from "sonner";
import ManageBillingModal from "./manageBillingModal";

// ─── Tab nav config ─────────────────────────────────────────────────────────

const settingsTabTitle = [
  {
    value: "profileCompany",
    icon: <User className="size-5" />,
    title: "Profile & Company",
  },
  {
    value: "billing",
    icon: <CreditCard className="size-5" />,
    title: "Payment & Billings",
  },
  {
    value: "communicate",
    icon: <MessageSquare className="size-5" />,
    title: "Communicate",
  },
  {
    value: "agreements",
    icon: <FileText className="size-5" />,
    title: "Agreements",
  },
];

export default function SettingsPageComponents() {
  return (
    <PageWrapper
      pageTitle="Account Settings"
      pageDescription="Manage your profile, billing, communication, and payment settings"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <SettingsPageContent />
      </Suspense>
    </PageWrapper>
  );
}

const SettingsPageContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") ?? "profileCompany";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const { data: settingsResponse, isLoading: settingsLoading } =
    useGetHostSettingsDashboardQuery();
  const [updateProfileCompanySettings] =
    useUpdateProfileCompanySettingsMutation();
  const [unlinkStripeConnect, { isLoading: isUnlinkingStripe }] =
    useUnlinkStripeConnectMutation();
  const [upgradePlan] = useUpgradePlanMutation();
  const { refetch } = useGetHostProfileQuery();

  const settingsData = settingsResponse?.data;

  const profileDefaults = useMemo<ProfileCompanyFormValues | null>(() => {
    const profile = settingsData?.profileCompany;
    if (!profile) {
      return null;
    }

    const [firstName = "", ...lastNameParts] = profile.fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return {
      profilePhoto: undefined,
      firstName,
      lastName: lastNameParts.join(" "),
      phoneNumber: profile.phoneNumber ?? "",
      email: profile.email,
      oldPassword: "",
      newPassword: "",
      companyName: profile.companyName ?? "",
      address: profile.address ?? "",
      city: profile.city ?? "",
      postalCode: profile.postalCode ?? "",
    };
  }, [settingsData]);

  const profilePhotoUrl = settingsData?.profileCompany.profilePictureUrl;

  const billingStatus = settingsData?.billing.currentPlan.isActive
    ? "active"
    : "cancelled";

  const planName = useMemo(() => {
    const plan = settingsData?.billing.currentPlan.plan;
    if (!plan) {
      return "Plan";
    }
    return `${plan.charAt(0).toUpperCase()}${plan.slice(1)} Plan`;
  }, [settingsData]);

  const planPrice = useMemo(() => {
    const currentPlan = settingsData?.billing.currentPlan;
    if (!currentPlan?.amountPerMonth) {
      return "Custom pricing";
    }

    return (
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currentPlan.currency || "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(currentPlan.amountPerMonth) + "/month"
    );
  }, [settingsData]);

  const renewalDate = useMemo(() => {
    const renewsOn = settingsData?.billing.currentPlan.renewsOn;
    if (!renewsOn) {
      return "N/A";
    }

    return new Date(renewsOn).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [settingsData]);

  const paymentHistory = useMemo<PaymentHistoryRow[]>(() => {
    const rows = settingsData?.billing.paymentHistory ?? [];

    return rows.map((item) => ({
      id: item.invoiceId,
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      amount: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: settingsData?.billing.currentPlan.currency || "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(item.amount),
      status: item.status,
    }));
  }, [settingsData]);

  const communicationLog = useMemo<CommunicationLogRow[]>(() => {
    const rows = settingsData?.communicate.communicationLog ?? [];

    return rows.map((item, index) => ({
      id: `LOG-${index + 1}`,
      dateTime: new Date(item.dateTime).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      recipient: item.recipient,
      message: item.message,
      status: item.status,
    }));
  }, [settingsData]);

  const agreements = useMemo<AgreementData[]>(() => {
    const templates = settingsData?.agreements.templates ?? [];

    return templates.map((item) => ({
      title:
        item.type === "longTerm"
          ? "Long-Term"
          : item.type === "shortTerm"
            ? "Short-Term"
            : "Commercial Fleet and Custom Agreement",
      label: item.description,
      previewLink: item.pdfUrl,
      shareLink: item.signatureRequestUrl || "",
    }));
  }, [settingsData]);

  const [showBillingModal, setShowBillingModal] = useState(false);

  const handleProfileSubmit = async (values: ProfileCompanyFormValues) => {
    const fullName = `${values.firstName} ${values.lastName}`.trim();

    try {
      await updateProfileCompanySettings({
        fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        companyName: values.companyName,
        address: values.address,
        city: values.city,
        postalCode: values.postalCode,
        profilePictureUrl: values.profilePhotoUrl ?? profilePhotoUrl,
      }).unwrap();

      await refetch();

      toast.success("Profile updated", {
        description: "Your profile and company details have been saved.",
      });
    } catch (error) {
      toast.error("Update failed", {
        description:
          (error as { data?: { message?: string } })?.data?.message ??
          "Something went wrong while saving your changes. Please try again.",
      });
    }
  };

  const handleManageBilling = () => {
    setShowBillingModal(true);
  };

  const onSelectNewPlan = async (
    plan: HostPlanType,
    billingCycle: HostBillingCycle,
  ): Promise<UpgradePlanResponse | null> => {
    try {
      const result = await upgradePlan({ plan, billingCycle }).unwrap();
      return result.data;
    } catch {
      return null;
    }
  };

  const onUpgradeComplete = () => {
    refetch();
  };

  const onWithdrawFund = () => {
    // TODO: open withdraw funds flow / redirect to Stripe dashboard
    console.log("WithdrawFund stripe clicked");
  };

  const onUnlinkStripe = async () => {
    try {
      await unlinkStripeConnect().unwrap();
      toast.success("Stripe disconnected", {
        description: "Your Stripe Connect account has been unlinked.",
      });
      await refetch();
    } catch (error) {
      toast.error("Failed to unlink Stripe", {
        description:
          (error as { data?: { message?: string } })?.data?.message ??
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="mt-4 md:mt-8">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full space-y-5 md:space-y-8"
      >
        <TabsList variant="line" className="gap-20 border-b-2">
          {settingsTabTitle.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="flex gap-2 item-center justify-start data-[state=active]:text-blue-700 group-data-[variant=line]/tabs-list:data-active:after:bg-blue-700 cursor-pointer"
            >
              {item.icon}
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="profileCompany">
          <ProfileCompanyTab
            loading={settingsLoading}
            defaults={profileDefaults}
            photoUrl={profilePhotoUrl}
            onSubmit={handleProfileSubmit}
          />
        </TabsContent>
        <TabsContent value="billing">
          <BillingTab
            status={billingStatus}
            planName={planName}
            planPrice={planPrice}
            renewalDate={renewalDate}
            onManageBilling={handleManageBilling}
            paymentHistory={paymentHistory}
            onWithdrawFund={onWithdrawFund}
            onUnlinkStripe={onUnlinkStripe}
            isUnlinkingStripe={isUnlinkingStripe}
            wallet={settingsData?.profileCompany.payment.wallet}
          />
        </TabsContent>
        <TabsContent value="communicate">
          <CommunicateTab communicationLog={communicationLog} />
        </TabsContent>
        <TabsContent value="agreements">
          <AgreementsTab agreements={agreements} />
        </TabsContent>
      </Tabs>
      {showBillingModal && (
        <ManageBillingModal
          currentPlan={settingsData?.billing.currentPlan.plan}
          onClose={() => setShowBillingModal(false)}
          onSelect={onSelectNewPlan}
          onUpgradeComplete={onUpgradeComplete}
        />
      )}
    </div>
  );
};