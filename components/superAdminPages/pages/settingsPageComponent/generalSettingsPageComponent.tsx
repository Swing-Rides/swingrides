"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageWrapper from "../../dashboard/pageWrapper";
import {
  CircleAlert,
  Flag,
  Lock,
  Mail,
  Settings2,
  SlidersVertical,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import AdminCommunicationSettingsForm from "@/components/superAdminPages/forms/adminCommunicationSettingsForm";
import SystemSettingsForm, {
  SystemSettingsFormValues,
} from "../../forms/systemSettingsForm";
import SystemSettingsFormSkeleton from "../../loadingSkeletons/systemSettingsFormSkeleton";
import {
  useGetPlatformSettingsQuery,
  useUpdatePlatformFeaturesMutation,
  useUpdateSystemSettingsMutation,
  useUpdateOperationalControlsMutation,
  useUpdateSecuritySettingsMutation,
} from "@/app/store/services/adminApi";
import {
  PlatformFeaturesSettings,
  OperationalControlsSettings,
} from "@/types/settings.type";

const tabTitle = [
  {
    icon: <Flag size={18} />,
    label: "Platform Features",
    value: "platform-features",
  },
  {
    icon: <Settings2 size={18} />,
    label: "System Settings",
    value: "system-settings",
  },
  {
    icon: <SlidersVertical size={18} />,
    label: "Operational Controls",
    value: "operational-controls",
  },
  {
    icon: <Lock size={18} />,
    label: "Security & Access",
    value: "security-access",
  },
  {
    icon: <Mail size={18} />,
    label: "Communication",
    value: "communication",
  },
];

const DEFAULT_PLATFORM_FEATURES: PlatformFeaturesSettings = {
  hostRegistrations: true,
  renterBookingFlow: true,
  paymentProcessing: true,
  smsNotifications: true,
  emailNotifications: true,
  licenceVerification: true,
  hostRenterLinking: true,
  reviewsRatings: true,
  disputesManagement: true,
  maintenanceTracking: true,
};

const DEFAULT_OPERATIONAL_CONTROLS: OperationalControlsSettings = {
  automaticHostApproval: false,
  automaticRenterVerification: false,
  auditLogging: true,
};

type PageTabsProps = {
  platformFeatures: PlatformFeaturesSettings;
  operationalControls: OperationalTabProps;
  strongPasswordRequirementsSwitch: boolean;
  platformFeaturesHandleSaveChanges: () => Promise<void>;
  operationalTabHandleSaveChanges: () => Promise<void>;
  securityTabHandleSaveChanges: () => Promise<void>;
  onPlatformFeatureChange: (
    key: keyof PlatformFeaturesSettings,
    value: boolean,
  ) => void;
  onOperationalControlChange: (
    key: keyof OperationalControlsSettings,
    value: boolean,
  ) => void;
  onSecurityChange: (value: boolean) => void;
  onUpdateSystemSettings: (values: SystemSettingsFormValues) => void | Promise<any>;
  systemSettingsData?: {
    defaultTaxRate: number;
    platformCurrency: string;
    globalTimezone: string;
    minBookingDuration: number;
    maxBookingDuration: number;
    cancellationPolicyWindow: number;
    plans: {
      starter: { maxVehicles: number; monthlyPrice: number };
      professional: { maxVehicles: number; monthlyPrice: number };
      enterprise: { maxVehicles: number; monthlyPrice: number };
    };
  };
  communicationSettings?: {
    smsSenderName: string;
    supportEmail: string;
    notifications: Record<string, { email: boolean; sms: boolean }>;
  };
};

type OperationalTabProps = {
  automaticHostApproval: boolean;
  automaticRenterVerification: boolean;
  auditLogging: boolean;
};

type SwitchDataListProps = {
  title: string;
  label: string;
  value: boolean;
  onChange?: (checked: boolean) => void;
};

export type PlatformFeaturesTabProps = {
  platformFeatures: PlatformFeaturesSettings;
  onFeatureChange: (key: keyof PlatformFeaturesSettings, value: boolean) => void;
  handleSaveChanges: () => Promise<void>;
};

export default function GeneralSettingsPageComponent() {
  const { data: settingsData } = useGetPlatformSettingsQuery();
  const [updatePlatformFeatures] = useUpdatePlatformFeaturesMutation();
  const [updateSystemSettingsMutation] = useUpdateSystemSettingsMutation();
  const [updateOperationalControls] = useUpdateOperationalControlsMutation();
  const [updateSecuritySettings] = useUpdateSecuritySettingsMutation();
  const [platformFeatures, setPlatformFeatures] =
    useState<PlatformFeaturesSettings>(DEFAULT_PLATFORM_FEATURES);
  const [operationalControls, setOperationalControls] =
    useState<OperationalControlsSettings>(DEFAULT_OPERATIONAL_CONTROLS);
  const [strongPassword, setStrongPassword] = useState(true);

  useEffect(() => {
    if (!settingsData?.data) {
      return;
    }

    setPlatformFeatures(settingsData.data.platformFeatures);
    setOperationalControls(settingsData.data.operationalControls);
    setStrongPassword(settingsData.data.security.strongPasswordRequirements);
  }, [settingsData]);

  const platformFeaturesHandleSaveChanges = async () => {
    await updatePlatformFeatures(platformFeatures).unwrap();
  };

  const operationalTabHandleSaveChanges = async () => {
    await updateOperationalControls(operationalControls).unwrap();
  };

  const securityTabHandleSaveChanges = async () => {
    await updateSecuritySettings({
      strongPasswordRequirements: strongPassword,
    }).unwrap();
  };

  const handlePlatformFeatureChange = (
    key: keyof PlatformFeaturesSettings,
    value: boolean,
  ) => {
    setPlatformFeatures((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleOperationalControlChange = (
    key: keyof OperationalControlsSettings,
    value: boolean,
  ) => {
    setOperationalControls((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleUpdateSystemSettings = async (
    values: SystemSettingsFormValues,
  ) => {
    await updateSystemSettingsMutation({
      defaultTaxRate: typeof values.defaultTaxRate === "string" ? parseFloat(values.defaultTaxRate) || 0 : values.defaultTaxRate,
      platformCurrency: values.platformCurrency,
      globalTimezone: values.globalTimezone,
      minBookingDuration: typeof values.minBookingDuration === "string" ? parseInt(values.minBookingDuration) || 1 : values.minBookingDuration,
      maxBookingDuration: typeof values.maxBookingDuration === "string" ? parseInt(values.maxBookingDuration) || 30 : values.maxBookingDuration,
      cancellationPolicyWindow: typeof values.cancellationPolicyWindow === "string" ? parseInt(values.cancellationPolicyWindow) || 24 : values.cancellationPolicyWindow,
      plans: {
        starter: {
          maxVehicles: typeof values.plans.starter.maxVehicles === "string" ? parseInt(values.plans.starter.maxVehicles) || 5 : values.plans.starter.maxVehicles,
          monthlyPrice: typeof values.plans.starter.monthlyPrice === "string" ? parseFloat(values.plans.starter.monthlyPrice) || 29 : values.plans.starter.monthlyPrice,
        },
        professional: {
          maxVehicles: typeof values.plans.professional.maxVehicles === "string" ? parseInt(values.plans.professional.maxVehicles) || 20 : values.plans.professional.maxVehicles,
          monthlyPrice: typeof values.plans.professional.monthlyPrice === "string" ? parseFloat(values.plans.professional.monthlyPrice) || 79 : values.plans.professional.monthlyPrice,
        },
        enterprise: {
          maxVehicles: typeof values.plans.enterprise.maxVehicles === "string" ? parseInt(values.plans.enterprise.maxVehicles) || 100 : values.plans.enterprise.maxVehicles,
          monthlyPrice: typeof values.plans.enterprise.monthlyPrice === "string" ? parseFloat(values.plans.enterprise.monthlyPrice) || 199 : values.plans.enterprise.monthlyPrice,
        },
      },
    });
  };

  return (
    <PageWrapper
      pageTitle="Account Settings"
      pageDescription="Manage your profile, billing, communication, and payment settings"
    >
      <div className="mt-4 md:mt-8">
        <PageTabs
          operationalControls={operationalControls}
          platformFeatures={platformFeatures}
          strongPasswordRequirementsSwitch={strongPassword}
          platformFeaturesHandleSaveChanges={platformFeaturesHandleSaveChanges}
          operationalTabHandleSaveChanges={operationalTabHandleSaveChanges}
          securityTabHandleSaveChanges={securityTabHandleSaveChanges}
          onPlatformFeatureChange={handlePlatformFeatureChange}
          onOperationalControlChange={handleOperationalControlChange}
          onSecurityChange={setStrongPassword}
          onUpdateSystemSettings={handleUpdateSystemSettings}
          systemSettingsData={settingsData?.data?.systemSettings}
          communicationSettings={settingsData?.data?.communication}
        />
      </div>
    </PageWrapper>
  );
}

const PageTabs = ({
  platformFeatures,
  platformFeaturesHandleSaveChanges,
  operationalControls,
  strongPasswordRequirementsSwitch,
  operationalTabHandleSaveChanges,
  securityTabHandleSaveChanges,
  onPlatformFeatureChange,
  onOperationalControlChange,
  onSecurityChange,
  onUpdateSystemSettings,
  systemSettingsData,
  communicationSettings,
}: PageTabsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") ?? "platform-features";

  const handleTabChange = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      params.delete("payment_page");
      params.delete("changes_page");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="flex flex-col gap-4 md:gap-8"
      defaultValue="platform-features"
    >
      <TabsList variant="line" className="flex gap-6 md:gap-8">
        {tabTitle.map((title) => (
          <TabsTrigger
            key={title.value}
            value={title.value}
            className="cursor-pointer data-active:text-blue-700 group-data-[variant=line]/tabs-list:data-active:after:bg-blue-700"
          >
            {title.icon}
            <span>{title.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <div>
        <TabsContent value="platform-features">
          <PlatformFeaturesTab
            platformFeatures={platformFeatures}
            onFeatureChange={onPlatformFeatureChange}
            handleSaveChanges={platformFeaturesHandleSaveChanges}
          />
        </TabsContent>

        <TabsContent value="system-settings">
          <SystemSettings
            onSubmit={onUpdateSystemSettings}
            systemSettingsData={systemSettingsData}
          />
        </TabsContent>

        <TabsContent value="operational-controls">
          <OperationalTab
            automaticHostApproval={operationalControls.automaticHostApproval}
            automaticRenterVerification={
              operationalControls.automaticRenterVerification
            }
            auditLogging={operationalControls.auditLogging}
            onControlChange={onOperationalControlChange}
            handleSaveChanges={operationalTabHandleSaveChanges}
          />
        </TabsContent>

        <TabsContent value="security-access">
          <SecurityTab
            strongPasswordRequirementsSwitch={strongPasswordRequirementsSwitch}
            onToggleChange={onSecurityChange}
            handleSaveChanges={securityTabHandleSaveChanges}
          />
        </TabsContent>

        <TabsContent value="communication">
          <CommunicationTab communicationSettings={communicationSettings} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

const PlatformFeaturesTab = ({
  platformFeatures,
  onFeatureChange,
  handleSaveChanges,
}: PlatformFeaturesTabProps) => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-neutral-950 text-base font-semibold font-text leading-6">
          Platform Feature Flags
        </h3>
        <span className="text-gray-500 text-xs font-normal font-text leading-4">
          Enable or disable major platform features globally
        </span>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex justify-start items-center gap-3">
        <CircleAlert size={16} className="text-blue-500" />
        <span className="text-blue-800 text-xs font-normal font-text leading-4">
          Changes to feature flags take effect immediately across the entire
          platform.
        </span>
      </div>

      <div className="space-y-3">
        <SwitchDataList
          title="Host Registrations"
          label="Allow new hosts to register on the platform"
          value={platformFeatures.hostRegistrations}
          onChange={(checked) => onFeatureChange("hostRegistrations", checked)}
        />
        <SwitchDataList
          title="Renter Booking Flow"
          label="Allow renters to browse and book vehicles"
          value={platformFeatures.renterBookingFlow}
          onChange={(checked) => onFeatureChange("renterBookingFlow", checked)}
        />
        <SwitchDataList
          title="Payment Processing (Stripe)"
          label="Enable card and payment collection"
          value={platformFeatures.paymentProcessing}
          onChange={(checked) => onFeatureChange("paymentProcessing", checked)}
        />
        <SwitchDataList
          title="SMS Notifications"
          label="Send SMS alerts to renters and hosts"
          value={platformFeatures.smsNotifications}
          onChange={(checked) => onFeatureChange("smsNotifications", checked)}
        />
        <SwitchDataList
          title="Email Notifications"
          label="Send transactional emails across the platform"
          value={platformFeatures.emailNotifications}
          onChange={(checked) => onFeatureChange("emailNotifications", checked)}
        />
        <SwitchDataList
          title="Driver's Licence Verification"
          label="Require document upload before booking confirmation"
          value={platformFeatures.licenceVerification}
          onChange={(checked) => onFeatureChange("licenceVerification", checked)}
        />
        <SwitchDataList
          title="Host-Renter Linking"
          label="Allow renters to connect directly to a host"
          value={platformFeatures.hostRenterLinking}
          onChange={(checked) => onFeatureChange("hostRenterLinking", checked)}
        />
        <SwitchDataList
          title="Reviews & Ratings"
          label="Enable the 5-star review system for hosts and renters"
          value={platformFeatures.reviewsRatings}
          onChange={(checked) => onFeatureChange("reviewsRatings", checked)}
        />
        <SwitchDataList
          title="Disputes Management"
          label="Enable renters and hosts to raise disputes"
          value={platformFeatures.disputesManagement}
          onChange={(checked) => onFeatureChange("disputesManagement", checked)}
        />
        <SwitchDataList
          title="Maintenance Tracking"
          label="Enable maintenance logs and service alerts for hosts"
          value={platformFeatures.maintenanceTracking}
          onChange={(checked) => onFeatureChange("maintenanceTracking", checked)}
        />
      </div>

      <div className="flex justify-end">
        <SaveButton handleSaveChanges={handleSaveChanges} />
      </div>
    </div>
  );
};

const DEFAULT_SYSTEM_SETTINGS = {
  defaultTaxRate: 7.5,
  platformCurrency: "USD $",
  globalTimezone: "America/New_York",
  minBookingDuration: 1,
  maxBookingDuration: 30,
  cancellationPolicyWindow: 24,
  plans: {
    starter: { maxVehicles: 5, monthlyPrice: 29 },
    professional: { maxVehicles: 20, monthlyPrice: 79 },
    enterprise: { maxVehicles: 100, monthlyPrice: 199 },
  },
};

const SystemSettings = ({
  onSubmit,
  systemSettingsData,
}: {
  onSubmit: (values: SystemSettingsFormValues) => void | Promise<any>;
  systemSettingsData?: PageTabsProps["systemSettingsData"];
}) => {
  const settings = systemSettingsData ?? DEFAULT_SYSTEM_SETTINGS;

  return (
    <Suspense fallback={<SystemSettingsFormSkeleton />}>
      <SystemSettingsForm defaultValues={settings} onSubmit={onSubmit} />
    </Suspense>
  );
};

const OperationalTab = ({
  automaticHostApproval,
  automaticRenterVerification,
  auditLogging,
  onControlChange,
  handleSaveChanges,
}: OperationalTabProps & {
  onControlChange: (key: keyof OperationalControlsSettings, value: boolean) => void;
  handleSaveChanges: () => Promise<void>;
}) => {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <SwitchDataList
          title="Automatic Host Approval"
          label="Approve new host accounts automatically without manual review"
          value={automaticHostApproval}
          onChange={(checked) => onControlChange("automaticHostApproval", checked)}
        />
        <SwitchDataList
          title="Automatic Renter Verification"
          label="Automatically verify renters without manual document review"
          value={automaticRenterVerification}
          onChange={(checked) =>
            onControlChange("automaticRenterVerification", checked)
          }
        />
        <SwitchDataList
          title="Audit Logging"
          label="Track all admin actions in a system activity log"
          value={auditLogging}
          onChange={(checked) => onControlChange("auditLogging", checked)}
        />
      </div>

      <div className="flex justify-end">
        <SaveButton handleSaveChanges={handleSaveChanges} />
      </div>
    </div>
  );
};

const SecurityTab = ({
  strongPasswordRequirementsSwitch,
  onToggleChange,
  handleSaveChanges,
}: {
  strongPasswordRequirementsSwitch: boolean;
  onToggleChange: (value: boolean) => void;
  handleSaveChanges: () => Promise<void>;
}) => {
  return (
    <div className="space-y-5">
      <div>
        <SwitchDataList
          title="Strong Password Requirements"
          label="Enforce minimum 12 characters, uppercase, number, and symbol"
          value={strongPasswordRequirementsSwitch}
          onChange={onToggleChange}
        />
      </div>

      <div className="flex justify-end">
        <SaveButton handleSaveChanges={handleSaveChanges} />
      </div>
    </div>
  );
};

const CommunicationTab = ({
  communicationSettings,
}: {
  communicationSettings?: PageTabsProps["communicationSettings"];
}) => {
  return (
    <>
      <AdminCommunicationSettingsForm defaultValues={communicationSettings} />
    </>
  );
};

const SwitchDataList = ({ title, label, value, onChange }: SwitchDataListProps) => {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
          {title}
        </span>
        <span className="text-gray-500 text-xs font-normal font-text leading-4">
          {label}
        </span>
      </div>
      <div>
        <Switch checked={value} onCheckedChange={onChange} className="cursor-pointer" />
      </div>
    </div>
  );
};

const SaveButton = ({
  handleSaveChanges,
}: {
  handleSaveChanges: () => void;
}) => {
  return (
    <button
      onClick={handleSaveChanges}
      className="bg-blue-700 py-2 px-14.5 rounded-xs border border-blue-700 text-blue-100 cursor-pointer hover:bg-blue-950 hover:border-blue-950 duration-300 transition-colors"
    >
      Save Changes
    </button>
  );
};
