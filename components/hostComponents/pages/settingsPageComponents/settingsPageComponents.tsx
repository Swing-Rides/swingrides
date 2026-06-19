"use client"

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import PageWrapper from "../../dashboard/pageWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
        FileText,
        MessageSquare,
        User,
        CreditCard,
} from 'lucide-react'
import { ProfileCompanyFormValues } from '../../forms/profileCompanyForm';
import {
        ProfileCompanyTab,
        BillingTab,
        CommunicateTab,
        AgreementsTab,
        PaymentHistoryRow,
        CommunicationLogRow,
        AgreementData,
} from './settingsTabs';

// ─── Tab nav config ─────────────────────────────────────────────────────────

const settingsTabTitle = [
        {
                value: 'profileCompany',
                icon: (<User className="size-5" />),
                title: 'Profile & Company',
        },
        {
                value: 'billing',
                icon: (<CreditCard className="size-5" />),
                title: 'Billing',
        },
        {
                value: 'communicate',
                icon: (<MessageSquare className="size-5" />),
                title: 'Communicate',
        },
        {
                value: 'agreements',
                icon: (<FileText className="size-5" />),
                title: 'Agreements',
        },
]

export default function SettingsPageComponents() {
        return (
                <Suspense fallback={<div>Loading...</div>}>
                        <SettingsPagePageContent />
                </Suspense>
        )
}

const SettingsPagePageContent = () => {
        const router = useRouter();
        const pathname = usePathname();
        const searchParams = useSearchParams();

        const activeTab = searchParams.get("tab") ?? "profileCompany";

        const handleTabChange = (value: string) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("tab", value);
                router.push(`${pathname}?${params.toString()}`);
        };

        // ─── Profile & Company state ────────────────────────────────────────
        const [profileLoading, setProfileLoading] = useState(true)
        const [profileDefaults, setProfileDefaults] = useState<ProfileCompanyFormValues | null>(null)
        const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | undefined>()

        // ─── Billing state ──────────────────────────────────────────────────
        const [billingStatus, setBillingStatus] = useState('active')
        const [planName, setPlanName] = useState('Professional Plan')
        const [planPrice, setPlanPrice] = useState('$49,000/month')
        const [renewalDate, setRenewalDate] = useState('April 15, 2026')
        const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryRow[]>([])

        // ─── Communicate state ──────────────────────────────────────────────
        const [communicationLog, setCommunicationLog] = useState<CommunicationLogRow[]>([])

        // ─── Agreements state ────────────────────────────────────────────────
        const [agreements, setAgreements] = useState<AgreementData[]>([])

        useEffect(() => {
                // TODO: replace with real fetch(es) to the server
                async function fetchProfileCompany() {
                        // const res = await fetch('/api/settings/profile-company')
                        // const data = await res.json()
                        const data = {
                                firstName: 'John',
                                lastName: 'Smith',
                                phoneNumber: '+1 555-123-4567',
                                email: 'john@company.com',
                                oldPassword: '',
                                newPassword: '',
                                companyName: 'Acme Rentals Ltd.',
                                address: '123 Main Street',
                                city: 'Austin',
                                postalCode: '73301',
                        }
                        setProfileDefaults(data)
                        setProfilePhotoUrl(undefined) // or a real URL
                        setProfileLoading(false)
                }

                async function fetchBilling() {
                        // const res = await fetch('/api/settings/billing')
                        // const data = await res.json()
                        setBillingStatus('active')
                        setPlanName('Professional Plan')
                        setPlanPrice('$49,000/month')
                        setRenewalDate('April 15, 2026')
                        setPaymentHistory([
                                { id: "PAY-001", date: "2026-06-14", amount: "$450.00", status: "paid" },
                                { id: "PAY-002", date: "2026-06-15", amount: "$320.00", status: "pending" },
                                { id: "PAY-003", date: "2026-06-12", amount: "$1,200.00", status: "paid" },
                                { id: "PAY-004", date: "2026-06-10", amount: "$900.00", status: "failed" },
                        ])
                }

                async function fetchCommunicationLog() {
                        // const res = await fetch('/api/settings/communication-log')
                        // const data = await res.json()
                        setCommunicationLog([
                                {
                                        id: "LOG-001",
                                        dateTime: "2026-06-15T10:30:00Z",
                                        recipient: "Alexander Pierce",
                                        message: "Your booking BK-1001 is confirmed.",
                                        status: "delivered"
                                },
                                {
                                        id: "LOG-002",
                                        dateTime: "2026-06-15T11:45:00Z",
                                        recipient: "Sarah Jenkins",
                                        message: "Reminder: Pickup for BK-2001 is in 5 days.",
                                        status: "pending"
                                },
                                {
                                        id: "LOG-003",
                                        dateTime: "2026-06-15T12:00:00Z",
                                        recipient: "Michael Chen",
                                        message: "Invoice for BK-3002 has been sent.",
                                        status: "delivered"
                                },
                                {
                                        id: "LOG-004",
                                        dateTime: "2026-06-15T13:15:00Z",
                                        recipient: "Olivia Martinez",
                                        message: "Unable to process payment for BK-9001.",
                                        status: "failed"
                                },
                                {
                                        id: "LOG-005",
                                        dateTime: "2026-06-15T14:00:00Z",
                                        recipient: "David Smith",
                                        message: "Vehicle for BK-5001 is ready for inspection.",
                                        status: "delivered"
                                },
                        ])
                }

                async function fetchAgreements() {
                        // const res = await fetch('/api/settings/agreements')
                        // const data = await res.json()
                        setAgreements([
                                {
                                        title: "Long-Term",
                                        label: "Extended rental agreement (30+ days)",
                                        previewLink: "https://linear.dr/sign/ag_942Xk9sL",
                                        shareLink: "https://swingrides.ng/sign/ag_942Xk9sL",
                                },
                                {
                                        title: "Commercial Fleet",
                                        label: "Business/corporate fleet agreement",
                                        previewLink: "",
                                        shareLink: "https://swingrides.ng/sign/ag_fleet_001",
                                },
                        ])
                }

                fetchProfileCompany()
                fetchBilling()
                fetchCommunicationLog()
                fetchAgreements()
        }, [])

        const handleProfileSubmit = async (values: ProfileCompanyFormValues) => {
                // TODO: replace with real API call
                console.log('saving profile & company info:', values)
        }

        const handleManageBilling = () => {
                // TODO: replace with real navigation/API call
                console.log('manage billing clicked')
        }

        return (
                <PageWrapper
                        pageTitle="Account Settings"
                        pageDescription="Manage your profile, billing, communication, and payment settings"
                >
                        <div className="mt-4 md:mt-8">
                                <Tabs
                                        value={activeTab}
                                        onValueChange={handleTabChange}
                                        className="w-full space-y-5 md:space-y-8"
                                >
                                        <TabsList
                                                variant="line"
                                                className='gap-20 border-b-2'
                                        >
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
                                                        loading={profileLoading}
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
                                                />
                                        </TabsContent>
                                        <TabsContent value="communicate">
                                                <CommunicateTab
                                                        communicationLog={communicationLog}
                                                />
                                        </TabsContent>
                                        <TabsContent value="agreements">
                                                <AgreementsTab
                                                        agreements={agreements}
                                                />
                                        </TabsContent>
                                </Tabs>
                        </div>
                </PageWrapper>
        );
}