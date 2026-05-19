"use client"

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageWrapper from "../../dashboard/pageWrapper";
import { CircleAlert, Flag, Lock, Mail, Settings2, SlidersVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import AdminCommunicationSettingsForm from "@/components/superAdminPages/forms/adminCommunicationSettingsForm";
import SystemSettingsForm, { SystemSettingsFormValues } from "../../forms/systemSettingsForm";
import SystemSettingsFormSkeleton from "../../loadingSkeletons/systemSettingsFormSkeleton";


const tabTitle = [
        {
                icon: (<Flag size={18}/>),
                label: "Platform Features",
                value: "platform-features",
        },
        {
                icon: (<Settings2 size={18}/>),
                label: "System Settings",
                value: "system-settings",
        },
        {
                icon: (<SlidersVertical size={18}/>),
                label: "Operational Controls",
                value: "operational-controls",
        },
        {
                icon: (<Lock size={18}/>),
                label: "Security & Access",
                value: "security-access",
        },
        {
                icon: (<Mail size={18}/>),
                label: "Communication",
                value: "communication",
        },
]

const platformFeatures = {
        hostRegistrationsSwitch: true,
        renterBookingFlowSwitch: true,
        paymentProcessingSwitch: true,
        smsNotificationsSwitch: true,
        emailNotificationsSwitch: true,
        licenceVerificationSwitch: true,
        hostRenterLinkingSwitch: true,
        reviewsRatingsSwitch: true,
        disputesManagementSwitch: true,
        maintenanceTrackingSwitch: true,
}

const operationalControls = {
        automaticHostApprovalSwitch: true,
        automaticRenterVerificationSwitch: true,
        auditLoggingSwitch: true,
}

type PageTabsProps = {
        platformFeatures: {
                hostRegistrationsSwitch: boolean;
                renterBookingFlowSwitch: boolean;
                paymentProcessingSwitch: boolean;
                smsNotificationsSwitch: boolean;
                emailNotificationsSwitch: boolean;
                licenceVerificationSwitch: boolean;
                hostRenterLinkingSwitch: boolean;
                reviewsRatingsSwitch: boolean;
                disputesManagementSwitch: boolean;
                maintenanceTrackingSwitch: boolean;
        }
        operationalControls: OperationalTabProps;
        strongPasswordRequirementsSwitch: boolean;
        platformFeaturesHandleSaveChanges: () => void;
        operationalTabHandleSaveChanges: () => void;
        securityTabHandleSaveChanges: () => void;
}

type OperationalTabProps = {
        automaticHostApprovalSwitch: boolean;
        automaticRenterVerificationSwitch: boolean;
        auditLoggingSwitch: boolean;
}

type SwitchDataListProps = {
        title: string;
        label: string;
        value: boolean;
}

export type PlatformFeaturesTabProps = {
        hostRegistrationsSwitch: boolean;
        renterBookingFlowSwitch: boolean;
        paymentProcessingSwitch: boolean;
        smsNotificationsSwitch: boolean;
        emailNotificationsSwitch: boolean;
        licenceVerificationSwitch: boolean;
        hostRenterLinkingSwitch: boolean;
        reviewsRatingsSwitch: boolean;
        disputesManagementSwitch: boolean;
        maintenanceTrackingSwitch: boolean;
        handleSaveChanges: () => void;
}

async function handleSave(values: SystemSettingsFormValues) {
        // Replace with your real API call
        console.log('saving system settings', values)
}

export default function GeneralSettingsPageComponent( ) {

        const platformFeaturesHandleSaveChanges = () => {
                window.location.reload()
        }

        const operationalTabHandleSaveChanges = () => {
                window.location.reload()
        }

        const securityTabHandleSaveChanges = () => {
                window.location.reload()
        }

        return (
                <PageWrapper
                        pageTitle='Account Settings'
                        pageDescription='Manage your profile, billing, communication, and payment settings'
                >
                        <div className="mt-4 md:mt-8">
                                <PageTabs
                                        operationalControls={operationalControls}
                                        platformFeatures={platformFeatures}
                                        strongPasswordRequirementsSwitch={true}
                                        platformFeaturesHandleSaveChanges={platformFeaturesHandleSaveChanges}
                                        operationalTabHandleSaveChanges={operationalTabHandleSaveChanges}
                                        securityTabHandleSaveChanges={securityTabHandleSaveChanges}
                                />
                        </div>
                </PageWrapper>
        )
}

const PageTabs = ({ platformFeatures, platformFeaturesHandleSaveChanges, operationalControls, strongPasswordRequirementsSwitch, operationalTabHandleSaveChanges, securityTabHandleSaveChanges }: PageTabsProps ) => {

        const router = useRouter()
        const pathname = usePathname()
        const searchParams = useSearchParams()

        const activeTab = searchParams.get('tab') ?? 'payments'

        const handleTabChange = useCallback((tab: string) => {
                        const params = new URLSearchParams(searchParams.toString())
                        params.set('tab', tab)
                        params.delete('payment_page')
                        params.delete('changes_page')
                        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
                }, [router, pathname, searchParams])

        return (
                <Tabs 
                        value={activeTab} 
                        onValueChange={handleTabChange}
                        className="flex flex-col gap-4 md:gap-8"
                        defaultValue="platform-features"
                >
                        <TabsList 
                                variant='line'
                                className="flex gap-6 md:gap-8"
                        >
                                {tabTitle.map((title) => (
                                        <TabsTrigger 
                                                key={title.value}
                                                value={title.value}
                                                className="cursor-pointer data-active:text-blue-700 group-data-[variant=line]/tabs-list:data-active:after:bg-blue-700"
                                        >
                                                {title.icon}
                                                <span>
                                                        {title.label}
                                                </span>
                                        </TabsTrigger>
                                ))}
                        </TabsList>

                        <div>
                                <TabsContent value="platform-features">
                                        <PlatformFeaturesTab 
                                                hostRegistrationsSwitch={platformFeatures.hostRegistrationsSwitch}
                                                renterBookingFlowSwitch={platformFeatures.renterBookingFlowSwitch} 
                                                paymentProcessingSwitch={platformFeatures.paymentProcessingSwitch} 
                                                smsNotificationsSwitch={platformFeatures.smsNotificationsSwitch} 
                                                emailNotificationsSwitch={platformFeatures.emailNotificationsSwitch} 
                                                licenceVerificationSwitch={platformFeatures.licenceVerificationSwitch} 
                                                hostRenterLinkingSwitch={platformFeatures.hostRenterLinkingSwitch} 
                                                reviewsRatingsSwitch={platformFeatures.reviewsRatingsSwitch} 
                                                disputesManagementSwitch={platformFeatures.disputesManagementSwitch} 
                                                maintenanceTrackingSwitch={platformFeatures.maintenanceTrackingSwitch} 
                                                handleSaveChanges={platformFeaturesHandleSaveChanges}
                                        />
                                </TabsContent>

                                <TabsContent value="system-settings">
                                        <SystemSettings />
                                </TabsContent>

                                <TabsContent value="operational-controls">
                                        <OperationalTab 
                                                automaticHostApprovalSwitch={operationalControls.automaticHostApprovalSwitch}
                                                automaticRenterVerificationSwitch={operationalControls.automaticRenterVerificationSwitch}
                                                auditLoggingSwitch={operationalControls.auditLoggingSwitch}
                                                handleSaveChanges={operationalTabHandleSaveChanges}
                                        />
                                </TabsContent>

                                <TabsContent value="security-access">
                                        <SecurityTab 
                                                strongPasswordRequirementsSwitch={strongPasswordRequirementsSwitch}
                                                handleSaveChanges={securityTabHandleSaveChanges}
                                        />
                                </TabsContent>

                                <TabsContent value="communication">
                                        <CommunicationTab />
                                </TabsContent>

                        </div>
                </Tabs>
        )
}

const PlatformFeaturesTab = ({ hostRegistrationsSwitch, renterBookingFlowSwitch, paymentProcessingSwitch, smsNotificationsSwitch, emailNotificationsSwitch, licenceVerificationSwitch, hostRenterLinkingSwitch, reviewsRatingsSwitch, disputesManagementSwitch, maintenanceTrackingSwitch, handleSaveChanges }: PlatformFeaturesTabProps) => {
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
                                        Changes to feature flags take effect immediately across the entire platform.
                                </span>
                        </div>

                        <div className="space-y-3">
                                <SwitchDataList 
                                        title="Host Registrations"
                                        label="Allow new hosts to register on the platform"
                                        value={hostRegistrationsSwitch}
                                />
                                <SwitchDataList 
                                        title="Renter Booking Flow"
                                        label="Allow renters to browse and book vehicles"
                                        value={renterBookingFlowSwitch}
                                />
                                <SwitchDataList 
                                        title="Payment Processing (Stripe)"
                                        label="Enable card and payment collection"
                                        value={paymentProcessingSwitch}
                                />
                                <SwitchDataList 
                                        title="SMS Notifications"
                                        label="Send SMS alerts to renters and hosts"
                                        value={smsNotificationsSwitch}
                                />
                                <SwitchDataList 
                                        title="Email Notifications"
                                        label="Send transactional emails across the platform"
                                        value={emailNotificationsSwitch}
                                />
                                <SwitchDataList 
                                        title="Driver's Licence Verification"
                                        label="Require document upload before booking confirmation"
                                        value={licenceVerificationSwitch}
                                />
                                <SwitchDataList 
                                        title="Host-Renter Linking"
                                        label="Allow renters to connect directly to a host"
                                        value={hostRenterLinkingSwitch}
                                />
                                <SwitchDataList 
                                        title="Reviews & Ratings"
                                        label="Enable the 5-star review system for hosts and renters"
                                        value={reviewsRatingsSwitch}
                                />
                                <SwitchDataList 
                                        title="Disputes Management"
                                        label="Enable renters and hosts to raise disputes"
                                        value={disputesManagementSwitch}
                                />
                                <SwitchDataList 
                                        title="Maintenance Tracking"
                                        label="Enable maintenance logs and service alerts for hosts"
                                        value={maintenanceTrackingSwitch}
                                />
                        </div>

                        <div className="flex justify-end">
                                <SaveButton
                                        handleSaveChanges={handleSaveChanges}
                                />
                        </div>
                </div>
        )
}

const SystemSettings = () => {

        const settings = {
                defaultTaxRate: 7.5,
                platformCurrency: 'USD $',
                globalTimezone: 'America/New_York',
                minBookingDuration: 1,
                maxBookingDuration: 30,
                cancellationPolicyWindow: 24,
                plans: {
                        starter: { maxVehicles: 5, monthlyPrice: 29 },
                        professional: { maxVehicles: 20, monthlyPrice: 79 },
                        enterprise: { maxVehicles: 100, monthlyPrice: 199 },
                },
        }

        return (
                <Suspense fallback={<SystemSettingsFormSkeleton />}>
                        <SystemSettingsForm
                                defaultValues={settings}
                                onSubmit={handleSave}
                        />
                </Suspense>
        )
}

const OperationalTab = ({ automaticHostApprovalSwitch, automaticRenterVerificationSwitch, auditLoggingSwitch, handleSaveChanges }: OperationalTabProps & { handleSaveChanges: () => void; }) => {
        return (
                <div className="space-y-5">
                        <div className="space-y-3">
                                <SwitchDataList
                                        title="Automatic Host Approval"
                                        label="Approve new host accounts automatically without manual review"
                                        value={automaticHostApprovalSwitch}
                                />
                                <SwitchDataList
                                        title="Automatic Renter Verification"
                                        label="Automatically verify renters without manual document review"
                                        value={automaticRenterVerificationSwitch}
                                />
                                <SwitchDataList
                                        title="Audit Logging"
                                        label="Track all admin actions in a system activity log"
                                        value={auditLoggingSwitch}
                                />
                        </div>

                        <div className="flex justify-end">
                                <SaveButton
                                        handleSaveChanges={handleSaveChanges}
                                />
                        </div>
                </div>
        )
}

const SecurityTab = ({ strongPasswordRequirementsSwitch, handleSaveChanges }: { strongPasswordRequirementsSwitch: boolean; handleSaveChanges: () => void; }) => {
        return (
                <div className="space-y-5">
                        <div>
                                <SwitchDataList
                                        title="Strong Password Requirements"
                                        label="Enforce minimum 12 characters, uppercase, number, and symbol"
                                        value={strongPasswordRequirementsSwitch}
                                />
                        </div>

                        <div className="flex justify-end">
                                <SaveButton
                                        handleSaveChanges={handleSaveChanges}
                                />
                        </div>
                </div>
        )
}

const CommunicationTab = () => {
        return (
                <>
                        <AdminCommunicationSettingsForm />
                </>
        )
}

const SwitchDataList = ({ title, label, value }: SwitchDataListProps) => {
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
                                                <Switch 
                                                        id={String(value)} 
                                                        className="cursor-pointer"
                                                />
                                        </div>
                </div>
        )
}

const SaveButton = ({ handleSaveChanges }: { handleSaveChanges: () => void }) => {
        return (
                <button
                        onClick={handleSaveChanges}
                        className="bg-blue-700 py-2 px-14.5 rounded-xs border border-blue-700 text-blue-100 cursor-pointer hover:bg-blue-950 hover:border-blue-950 duration-300 transition-colors"
                >
                        Save Changes
                </button>
        )
}