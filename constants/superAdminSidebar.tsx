import { FleetStatus } from "@/types/subscribers.type"
import { Building2, CreditCard, LayoutDashboard, Mail, MessageSquare, Settings, Shield, SlidersHorizontalIcon, Star, UserCheck, Users } from "lucide-react"

export const userContent = {
        fullname: 'Super Admin',
        role: 'Super Admin',
}

export const sidebarContent = [
        {
                title: 'Main',
                menu: [
                        {
                                icon: (
                                        <LayoutDashboard />
                                ),
                                label: 'Overview',
                                url: '/admin/'
                        },
                        {
                                icon: (
                                        <Users />
                                ),
                                label: 'Subscribers',
                                url: '/admin/subscribers'
                        },
                        {
                                icon: (
                                        <UserCheck/>
                                ),
                                label: 'Renters',
                                url: '/admin/renters'
                        },
                ]
        },
        {
                title: 'Platform',
                menu: [
                        {
                                icon: (
                                        <CreditCard />
                                ),
                                label: 'Billing',
                                url: '/admin/billing'
                        },
                        {
                                icon: (
                                        <Star/>
                                ),
                                label: 'Reviews',
                                url: '/admin/reviews'
                        }
                ]
        },
        {
                title: 'System',
                menu: [
                        {
                                icon: (
                                        <Settings/>
                                ),
                                label: 'Settings',
                                url: '/admin/settings',
                                subMenu: [
                                        {
                                                icon: (
                                                        <SlidersHorizontalIcon/>
                                                ),
                                                label: 'General',
                                                url: '/admin/settings/general?tab=platform-features'
                                        },
                                        {
                                                icon: (
                                                        <Mail/>
                                                ),
                                                label: 'Email Actions',
                                                url: '/admin/settings/email-actions'
                                        },
                                        {
                                                icon: (
                                                        <Shield/>
                                                ),
                                                label: 'Admin Users',
                                                url: '/admin/settings/admin-users'
                                        },
                                ]
                        },
                        {
                                icon: (
                                        <MessageSquare/>
                                ),
                                label: 'Tickets',
                                url: '/admin/tickets'
                        }
                ]
        },
]


export const ActiveSubscribersOverviewCardContent = {
        icon: (
                <Building2 />
        ),
        title: 'Total Active Subscribers',
        presentDayNumber: 124,
        last30Days: 102,
}

export const RecurringRevenueOverviewCardContent = {
        icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 9.99999C0 4.47714 4.47715 0 10 0H37.9997C43.5226 0 47.9997 4.47715 47.9997 10V37.9997C47.9997 43.5226 43.5226 47.9997 37.9997 47.9997H9.99999C4.47714 47.9997 0 43.5226 0 37.9997V9.99999Z" fill="#D1FAE5" />
                        <path d="M23.9961 14.002V33.9961" stroke="#10B981" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M28.9948 17.002H21.497C20.569 17.002 19.6791 17.3706 19.0229 18.0268C18.3667 18.683 17.998 19.5729 17.998 20.5009C17.998 21.4289 18.3667 22.3189 19.0229 22.9751C19.6791 23.6313 20.569 23.9999 21.497 23.9999H26.4956C27.4236 23.9999 28.3135 24.3686 28.9697 25.0247C29.6259 25.6809 29.9946 26.5709 29.9946 27.4989C29.9946 28.4269 29.6259 29.3169 28.9697 29.9731C28.3135 30.6292 27.4236 30.9979 26.4956 30.9979H17.998" stroke="#10B981" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
        ),
        title: 'Monthly Recurring Revenue',
        presentDayNumber: 203789.4,
        last30Days: 189764,
}

export const TotalRenterOverviewCardContent = {
        icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 9.99999C0 4.47714 4.47715 0 10 0H37.9997C43.5226 0 47.9997 4.47715 47.9997 10V37.9997C47.9997 43.5226 43.5226 47.9997 37.9997 47.9997H9.99999C4.47714 47.9997 0 43.5226 0 37.9997V9.99999Z" fill="#FEF3C7" />
                        <path d="M27.9959 32.9973V30.9979C27.9959 29.9373 27.5746 28.9202 26.8247 28.1703C26.0748 27.4203 25.0576 26.999 23.9971 26.999H17.9988C16.9383 26.999 15.9212 27.4203 15.1712 28.1703C14.4213 28.9202 14 29.9373 14 30.9979V32.9973" stroke="#F59E0B" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20.9969 22.9996C23.2054 22.9996 24.9957 21.2093 24.9957 19.0008C24.9957 16.7923 23.2054 15.002 20.9969 15.002C18.7884 15.002 16.998 16.7923 16.998 19.0008C16.998 21.2093 18.7884 22.9996 20.9969 22.9996Z" stroke="#F59E0B" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M33.9933 32.9972V30.9978C33.9926 30.1118 33.6977 29.2511 33.1549 28.5508C32.612 27.8506 31.852 27.3504 30.9941 27.1289" stroke="#F59E0B" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M27.9961 15.1318C28.8563 15.3521 29.6187 15.8523 30.1631 16.5537C30.7075 17.2551 31.0031 18.1178 31.0031 19.0057C31.0031 19.8936 30.7075 20.7563 30.1631 21.4577C29.6187 22.1591 28.8563 22.6593 27.9961 22.8796" stroke="#F59E0B" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
        ),
        title: 'Total Registered Renter',
        presentDayNumber: 8947,
        last30Days: 8471,
}

export const ActiveRentalsOverviewCardContent = {
        icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 9.99999C0 4.47714 4.47715 0 10 0H37.9997C43.5226 0 47.9997 4.47715 47.9997 10V37.9997C47.9997 43.5226 43.5226 47.9997 37.9997 47.9997H9.99999C4.47714 47.9997 0 43.5226 0 37.9997V9.99999Z" fill="#FEF3C7" />
                        <path d="M27.9959 32.9973V30.9979C27.9959 29.9373 27.5746 28.9202 26.8247 28.1703C26.0748 27.4203 25.0576 26.999 23.9971 26.999H17.9988C16.9383 26.999 15.9212 27.4203 15.1712 28.1703C14.4213 28.9202 14 29.9373 14 30.9979V32.9973" stroke="#F59E0B" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20.9969 22.9996C23.2054 22.9996 24.9957 21.2093 24.9957 19.0008C24.9957 16.7923 23.2054 15.002 20.9969 15.002C18.7884 15.002 16.998 16.7923 16.998 19.0008C16.998 21.2093 18.7884 22.9996 20.9969 22.9996Z" stroke="#F59E0B" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M33.9933 32.9972V30.9978C33.9926 30.1118 33.6977 29.2511 33.1549 28.5508C32.612 27.8506 31.852 27.3504 30.9941 27.1289" stroke="#F59E0B" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M27.9961 15.1318C28.8563 15.3521 29.6187 15.8523 30.1631 16.5537C30.7075 17.2551 31.0031 18.1178 31.0031 19.0057C31.0031 19.8936 30.7075 20.7563 30.1631 21.4577C29.6187 22.1591 28.8563 22.6593 27.9961 22.8796" stroke="#F59E0B" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

        ),
        title: 'Active Rentals Platform-wide',
        presentDayNumber: 342,
        last30Days: 412,
}


export const MonthlyRevenueBillingOverviewCardContent = {
        icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 9.99999C0 4.47714 4.47715 0 10 0H37.9997C43.5226 0 47.9997 4.47715 47.9997 10V37.9997C47.9997 43.5226 43.5226 47.9997 37.9997 47.9997H9.99999C4.47714 47.9997 0 43.5226 0 37.9997V9.99999Z" fill="#DAFFF3" />
                        <path d="M23.9922 14.0039V33.9981" stroke="#10B981" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M28.9909 17.002H21.4931C20.5651 17.002 19.6752 17.3706 19.019 18.0268C18.3628 18.683 17.9941 19.5729 17.9941 20.5009C17.9941 21.4289 18.3628 22.3189 19.019 22.9751C19.6752 23.6313 20.5651 23.9999 21.4931 23.9999H26.4917C27.4197 23.9999 28.3096 24.3686 28.9658 25.0247C29.622 25.6809 29.9907 26.5709 29.9907 27.4989C29.9907 28.4269 29.622 29.3169 28.9658 29.9731C28.3096 30.6292 27.4197 30.9979 26.4917 30.9979H17.9941" stroke="#10B981" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
        ),
        title: 'Monthly Recurring Revenue',
        presentDayNumber: 593874,
        last30Days: 483412,
}

export const AnnualRevenueBillingOverviewCardContent = {
        icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 9.99999C0 4.47714 4.47715 0 10 0H37.9997C43.5226 0 47.9997 4.47715 47.9997 10V37.9997C47.9997 43.5226 43.5226 47.9997 37.9997 47.9997H9.99999C4.47714 47.9997 0 43.5226 0 37.9997V9.99999Z" fill="#E3EEFF" />
                        <path d="M33.9942 19.002L25.4967 27.4995L20.4981 22.5009L14 28.999" stroke="#1A56DB" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M27.9961 19.002H33.9943V25.0002" stroke="#1A56DB" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

        ),
        title: 'Annual Recurring Revenue',
        presentDayNumber: 2443549,
        last30Days: 1457085,
}

export const FailedPaymentsBillingOverviewCardContent = {
        icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 9.99999C0 4.47714 4.47715 0 10 0H37.9997C43.5226 0 47.9997 4.47715 47.9997 10V37.9997C47.9997 43.5226 43.5226 47.9997 37.9997 47.9997H9.99999C4.47714 47.9997 0 43.5226 0 37.9997V9.99999Z" fill="#FFE9E9" />
                        <path d="M23.9971 33.9981C29.5183 33.9981 33.9942 29.5222 33.9942 24.001C33.9942 18.4798 29.5183 14.0039 23.9971 14.0039C18.4759 14.0039 14 18.4798 14 24.001C14 29.5222 18.4759 33.9981 23.9971 33.9981Z" stroke="#EF4444" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M26.9963 21.002L20.998 27.0002" stroke="#EF4444" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20.998 21.002L26.9963 27.0002" stroke="#EF4444" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
        ),
        title: 'Failed Payments',
        presentDayNumber: 12,
        last30Days: 9,
}

export const ChurnRateBillingOverviewCardContent = {
        icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 9.99999C0 4.47714 4.47715 0 10 0H37.9997C43.5226 0 47.9997 4.47715 47.9997 10V37.9997C47.9997 43.5226 43.5226 47.9997 37.9997 47.9997H9.99999C4.47714 47.9997 0 43.5226 0 37.9997V9.99999Z" fill="#FFF6E7" />
                        <path d="M33.9942 28.999L25.4967 20.5015L20.4981 25.5001L14 19.002" stroke="#F59E0B" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M27.9961 28.9983H33.9943V23" stroke="#F59E0B" strokeWidth="1.99942" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
        ),
        title: 'Churn Rate MTD',
        presentDayNumber: 2.4,
        last30Days: 5.2,
}


export const testDonutChartData = [
        {
                userPackage: 'Starter',
                userCount: 42,
                color: '#10B981',
        },
        {
                userPackage: 'Professional',
                userCount: 58,
                color: '#1A56DB',
        },
        {
                userPackage: 'Enterprise',
                userCount: 24,
                color: '#F59E0B',
        },
]

export const MonthlyRecurringRevenueChartData = {
        data: [
                { sales: 179057, month: "Jan" },
                { sales: 221753, month: "Feb" },
                { sales: 309981, month: "Mar" },
                { sales: 483412, month: "Apr" },
                { sales: 593874, month: "May" },
                { sales: 8186, month: "Jun" },
                { sales: 9034, month: "Jul" },
                { sales: 15099, month: "Aug" },
                { sales: 38932, month: "Sept" },
                { sales: 42678, month: "Oct" },
                { sales: 69001, month: "Nov" },
                { sales: 99621, month: "Dec" },
        ],
        series: [{ name: "sales", color: "#1A56DB" }],
}


// ─── Plan Prices (USD / month per user) ──────────────────────────────────────

export const PLAN_PRICES = {
        starter: 29,
        professional: 79,
        enterprise: 120,
} as const

// ─── Raw user-count data ──────────────────────────────────────────────────────

const rawData = [
        { starter: 11, professional: 4, enterprise: 1, month: "Nov" },
        { starter: 21, professional: 7, enterprise: 4, month: "Dec" },
        { starter: 55, professional: 20, enterprise: 9, month: "Jan" },
        { starter: 73, professional: 27, enterprise: 13, month: "Feb" },
        { starter: 122, professional: 43, enterprise: 22, month: "Mar" },
        { starter: 179, professional: 60, enterprise: 27, month: "Apr" },
        { starter: 246, professional: 81, enterprise: 37, month: "May" },
]

// ─── Revenue data (users × price) ────────────────────────────────────────────
// This is what gets charted so the Y-axis correctly represents USD revenue.

export const revenueByPlanTestData = {
        data: rawData.map((d) => ({
                month: d.month,
                starter: d.starter * PLAN_PRICES.starter,
                professional: d.professional * PLAN_PRICES.professional,
                enterprise: d.enterprise * PLAN_PRICES.enterprise,
        })),
        // ↓ `as const` on `name` narrows the type to the literal union
        //   that @chakra-ui/charts SeriesItem<T> requires.
        series: [
                { name: "starter" as const, color: "#9CA3AF", stackId: "a" },
                { name: "professional" as const, color: "#1A56DB", stackId: "a" },
                { name: "enterprise" as const, color: "#10B981", stackId: "a" },
        ],
} 

export type SubscriberStatus = "active" | "past due" | "cancelled"
export type SubscriberPlan = "flex" | "solo" | "fleet"

export type RevenueData = {
        month: string
        totalRevenue: number
}

// export type FleetStatus =
//         | "available"
//         | "rented"
//         | "unlisted"
//         | "maintenance"

export type BookingStatus =
        | "upcoming"
        | "active"
        | "completed"
        | "cancelled"

export type BillingStatus = "successful" | "pending" | "failed"

export type ReimbursementRequestsStatus =
        | "approved"
        | "pending"
        | "declined"

export type MaintenanceStatusType =
        | "overdue"
        | "due soon"
        | "upcoming"
        | "up to date"

export type BookingPaymentStatusType =
        | "paid"
        | "declined"
        | "pending"


export type Booking = {
        id: string
        status: BookingStatus
        totalCost: string
        bookingDate: string
        pickupDateAndTime: string
        returnDateAndTime: string
        pickupLocation: string
        returnLocation: string
        vehicleInformation: {
                id: string
                vehicleName: string
                plateNumber: string
                transmission: string
                bodyType: string
        }
        renter: RenterType
        organisationName?: string;
}

export type BillingHistory = {
        id: string
        package: string
        status: BillingStatus
        totalCost: string
        date: string
}

export type DamageReport = {
        name: string
        submittedDate: string
        gallery: {
                id: string
                imageUrl: string
        }[]
        totalCost: number
        status: ReimbursementRequestsStatus
        description: string
}

export type ReimbursementRequest = {
        name: string
        submittedDate: string
        totalCost: number
        status: ReimbursementRequestsStatus
        description: string
}

export type Subscriber = {
        id: string
        organisation: {
                name: string
                email: string
        }
        plan: SubscriberPlan
        vehicles: number
        status: SubscriberStatus
        totalEarning: number
        dateJoined: string
        slug: string

        activeBookings: number
        monthlyRevenue: number

        revenue: RevenueData[]
        fleet: FleetVehicle[]
        booking: Booking[]
        billingHistory: BillingHistory[]
        damageReports: DamageReport[]
        reimbursementRequests: ReimbursementRequest[]
}

export type FleetRow = {
        id: string
        name: string
        status: FleetStatus
        cost: number  
        date: string  
}

export type FleetVehicle = {
        id: string
        vehicleName: string  
        status: FleetStatus
        dailyRate: number  
        lastBookings: string  
        plateNumber: string
        transmission: string
        bodyType: string
}

export type RenterType = {
        fullname: string;
        phoneNumber: string;
        licenseNumber?: string;
        email: string;
}

export type BookingRow = {
        id: string
        vehicleName: string     
        status: BookingStatus
        totalCost: string       
        bookingDate: string
        // extra fields
        pickupDateAndTime: string
        returnDateAndTime: string
        pickupLocation: string
        returnLocation: string
}

export type BillingRow = {
        id: string
        package: string       
        status: BillingStatus
        totalCost: string       
        date: string     
}

export const subscribersTestData: Subscriber[] = [
        {
                id: "metro-fleet-solutions-782342",
                organisation: {
                        name: "Metro Fleet Solutions",
                        email: "james@metrofleet.com",
                },
                plan: "fleet",
                vehicles: 142,
                status: "active",
                totalEarning: 2550,
                dateJoined: "4th April, 2023",
                slug: "metro-fleet-solutions",

                activeBookings: 23,
                monthlyRevenue: 342,

                revenue: [
                        { month: "Jan", totalRevenue: 1350 },
                        { month: "Feb", totalRevenue: 1196 },
                        { month: "Mar", totalRevenue: 1519 },
                        { month: "Apr", totalRevenue: 1752 },
                        { month: "May", totalRevenue: 2189 },
                ],

                fleet: [
                        {
                                id: "VEH-2847",
                                vehicleName: "2023 Tesla Model 3",
                                status: "rented",
                                dailyRate: 89,
                                lastBookings: "Mar 24, 2026",
                                plateNumber: "ABC-1234",
                                transmission: "Automatic",
                                bodyType: "Sedan",
                        },
                        {
                                id: "VEH-2345",
                                vehicleName: "2024 Tesla Model 3",
                                status: "rented",
                                dailyRate: 89,
                                lastBookings: "May 24, 2026",
                                plateNumber: "ABC-1234",
                                transmission: "Automatic",
                                bodyType: "Sedan",
                        },
                        {
                                id: "VEH-1145",
                                vehicleName: "2026 Bentley Bentayga",
                                status: "rented",
                                dailyRate: 89,
                                lastBookings: "May 24, 2026",
                                plateNumber: "ABC-1234",
                                transmission: "Automatic",
                                bodyType: "Sedan",
                        },
                ],

                booking: [
                        {
                                id: "rental-2847",
                                status: "upcoming",
                                totalCost: "213",
                                bookingDate: "Mar 11, 2026",
                                pickupDateAndTime:
                                        "Mar 15, 2026 at 10:00 AM",
                                returnDateAndTime:
                                        "Mar 18, 2026 at 11:00 PM",
                                pickupLocation: "123 Main St, Downtown",
                                returnLocation: "123 Main St, Downtown",
                                renter: {
                                        fullname: "Michael Johnson",
                                        phoneNumber: "+1 (555) 123-4567",
                                        licenseNumber: "DL-78451293",
                                        email: "michael.johnson@example.com",
                                },
                                vehicleInformation: {
                                        id: "sha3984j",
                                        vehicleName: "Toyota Camry 2023",
                                        plateNumber: "8ABC123", // California-style format
                                        transmission: "Automatic",
                                        bodyType: "Sedan",
                                },
                        },
                        {
                                id: "rental-1247",
                                status: "completed",
                                totalCost: "577",
                                bookingDate: "Dec 31, 2025",
                                pickupDateAndTime:
                                        "Jan 09, 2026 at 10:00 AM",
                                returnDateAndTime:
                                        "Jan 13, 2026 at 11:00 PM",
                                pickupLocation: "123 Main St, Downtown",
                                returnLocation: "123 Main St, Downtown",
                                renter: {
                                        fullname: "Sarah Williams",
                                        phoneNumber: "+1 (555) 234-5678",
                                        licenseNumber: "DL-90234781",
                                        email: "sarah.williams@example.com",
                                },
                                vehicleInformation: {
                                        id: "sha1284j",
                                        vehicleName: "Honda CR-V 2022",
                                        plateNumber: "KLT-4821",
                                        transmission: "Automatic",
                                        bodyType: "SUV",
                                },
                        },
                        {
                                id: "rental-4574",
                                status: "active",
                                totalCost: "15013",
                                bookingDate: "Apr 27, 2026",
                                pickupDateAndTime:
                                        "May 1, 2026 at 12:00 AM",
                                returnDateAndTime:
                                        "Mar 30, 2026 at 11:00 PM",
                                pickupLocation: "123 Main St, Downtown",
                                returnLocation: "123 Main St, Downtown",
                                renter: {
                                        fullname: "David Thompson",
                                        phoneNumber: "+1 (555) 345-6789",
                                        licenseNumber: "DL-61547820",
                                        email: "david.thompson@example.com",
                                },
                                vehicleInformation: {
                                        id: "sha3944j",
                                        vehicleName: "Ford Ranger 2024",
                                        plateNumber: "TXR-9045", 
                                        transmission: "Manual",
                                        bodyType: "Pickup Truck",
                                },
                        },
                        {
                                id: "rental-1233",
                                status: "cancelled",
                                totalCost: "577",
                                bookingDate: "Dec 31, 2025",
                                pickupDateAndTime:
                                        "Jan 09, 2026 at 10:00 AM",
                                returnDateAndTime:
                                        "Jan 13, 2026 at 11:00 PM",
                                pickupLocation: "123 Main St, Downtown",
                                returnLocation: "123 Main St, Downtown",
                                renter: {
                                        fullname: "Emily Carter",
                                        phoneNumber: "+1 (555) 456-7890",
                                        email: "emily.carter@example.com", 
                                },
                                vehicleInformation: {
                                        id: "sha398fr",
                                        vehicleName: "Mercedes-Benz Sprinter 2021",
                                        plateNumber: "FLA-7719", 
                                        transmission: "Automatic",
                                        bodyType: "Van",
                                },
                        },
                ],

                billingHistory: [
                        {
                                id: "billing-2847",
                                package: "Enterprise",
                                status: "successful",
                                totalCost: "299",
                                date: "Mar 30, 2026",
                        },
                        {
                                id: "billing-2847",
                                package: "Enterprise",
                                status: "failed",
                                totalCost: "299",
                                date: "Apr 30, 2026",
                        },
                        {
                                id: "billing-2847",
                                package: "Enterprise",
                                status: "pending",
                                totalCost: "299",
                                date: "Apr 30, 2026",
                        },
                ],

                damageReports: [
                        {
                                name: "Front Bumper Scratch",
                                submittedDate: "2026-01-12",
                                gallery: [
                                        {
                                                id: "img-001",
                                                imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
                                        },
                                        {
                                                id: "img-002",
                                                imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
                                        },
                                ],
                                totalCost: 450,
                                status: "pending",
                                description:
                                        "Minor scratches and paint damage were discovered on the front bumper after the vehicle was returned by the customer.",
                        },
                        {
                                name: "Broken Side Mirror",
                                submittedDate: "2026-02-03",
                                gallery: [
                                        {
                                                id: "img-003",
                                                imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
                                        },
                                        {
                                                id: "img-004",
                                                imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
                                        },
                                ],
                                totalCost: 320,
                                status: "approved",
                                description:
                                        "The driver's side mirror was found cracked and detached, requiring a full replacement.",
                        },
                        {
                                name: "Rear Door Dent",
                                submittedDate: "2026-02-18",
                                gallery: [
                                        {
                                                id: "img-005",
                                                imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
                                        },
                                        {
                                                id: "img-006",
                                                imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
                                        },
                                ],
                                totalCost: 780,
                                status: "declined",
                                description:
                                        "A noticeable dent was identified on the rear passenger door, likely caused by impact with another object.",
                        },
                        {
                                name: "Windshield Crack",
                                submittedDate: "2026-03-07",
                                gallery: [
                                        {
                                                id: "img-007",
                                                imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
                                        },
                                        {
                                                id: "img-008",
                                                imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
                                        },
                                ],
                                totalCost: 610,
                                status: "approved",
                                description:
                                        "A long crack developed across the lower section of the windshield, requiring complete replacement.",
                        },
                        {
                                name: "Interior Seat Tear",
                                submittedDate: "2026-03-22",
                                gallery: [
                                        {
                                                id: "img-009",
                                                imageUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f",
                                        },
                                        {
                                                id: "img-010",
                                                imageUrl: "https://images.unsplash.com/photo-1504215680853-026ed2a45def",
                                        },
                                ],
                                totalCost: 290,
                                status: "pending",
                                description:
                                        "A tear was found on the front passenger leather seat, requiring upholstery repair.",
                        },
                ],

                reimbursementRequests: [
                        {
                                name: "Fuel Reimbursement",
                                submittedDate: "Mar 16, 2026",
                                totalCost: 45,
                                status: "approved",
                                description:
                                        "Refueling reimbursement after late-night return.",
                        },
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "coastal-car-sharing-782342",
                organisation: {
                        name: "Coastal Car Sharing",
                        email: "operations@coastal.ca",
                },
                plan: "fleet",
                vehicles: 43,
                status: "active",
                totalEarning: 2025,
                dateJoined: "30th April, 2024",
                slug: "coastal-car-sharing",

                activeBookings: 11,
                monthlyRevenue: 278,

                revenue: [
                        { month: "Jan", totalRevenue: 980 },
                        { month: "Feb", totalRevenue: 1210 },
                        { month: "Mar", totalRevenue: 1540 },
                        { month: "Apr", totalRevenue: 1830 },
                        { month: "May", totalRevenue: 2025 },
                ],

                fleet: [
                        {
                                id: "VEH-9021",
                                vehicleName: "2024 Hyundai Tucson",
                                status: "rented",
                                dailyRate: 78,
                                lastBookings: "Apr 11, 2026",
                                plateNumber: "CSC-4402",
                                transmission: "Automatic",
                                bodyType: "SUV",
                        },
                ],

                booking: [
                        {
                                id: "rental-9921",
                                status: "active",
                                totalCost: "468",
                                bookingDate: "Apr 08, 2026",
                                pickupDateAndTime:
                                        "Apr 10, 2026 at 9:00 AM",
                                returnDateAndTime:
                                        "Apr 16, 2026 at 5:00 PM",
                                pickupLocation:
                                        "18 Ocean Drive, Vancouver",
                                returnLocation:
                                        "18 Ocean Drive, Vancouver",

                                renter: {
                                        fullname: "Sarah Williams",
                                        phoneNumber: "+1 (555) 234-5678",
                                        licenseNumber: "DL-90234781",
                                        email: "sarah.williams@example.com",
                                },
                                vehicleInformation: {
                                        id: "shafc84j",
                                        vehicleName: "Hyundai Elantra 2023",
                                        plateNumber: "7XYZ842", 
                                        transmission: "Automatic",
                                        bodyType: "Sedan",
                                },
                        },
                ],

                billingHistory: [
                        {
                                id: "billing-8832",
                                package: "Enterprise",
                                status: "successful",
                                totalCost: "299",
                                date: "Apr 30, 2026",
                        },
                ],

                damageReports: [
                        {
                                name: "Front Bumper Scratch",
                                submittedDate: "2026-01-12",
                                gallery: [
                                        {
                                                id: "img-001",
                                                imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
                                        },
                                        {
                                                id: "img-002",
                                                imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
                                        },
                                ],
                                totalCost: 450,
                                status: "pending",
                                description:
                                        "Minor scratches and paint damage were discovered on the front bumper after the vehicle was returned by the customer.",
                        },
                        {
                                name: "Broken Side Mirror",
                                submittedDate: "2026-02-03",
                                gallery: [
                                        {
                                                id: "img-003",
                                                imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
                                        },
                                        {
                                                id: "img-004",
                                                imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
                                        },
                                ],
                                totalCost: 320,
                                status: "approved",
                                description:
                                        "The driver's side mirror was found cracked and detached, requiring a full replacement.",
                        },
                        {
                                name: "Rear Door Dent",
                                submittedDate: "2026-02-18",
                                gallery: [
                                        {
                                                id: "img-005",
                                                imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
                                        },
                                        {
                                                id: "img-006",
                                                imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
                                        },
                                ],
                                totalCost: 780,
                                status: "declined",
                                description:
                                        "A noticeable dent was identified on the rear passenger door, likely caused by impact with another object.",
                        },
                        {
                                name: "Windshield Crack",
                                submittedDate: "2026-03-07",
                                gallery: [
                                        {
                                                id: "img-007",
                                                imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
                                        },
                                        {
                                                id: "img-008",
                                                imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
                                        },
                                ],
                                totalCost: 610,
                                status: "approved",
                                description:
                                        "A long crack developed across the lower section of the windshield, requiring complete replacement.",
                        },
                        {
                                name: "Interior Seat Tear",
                                submittedDate: "2026-03-22",
                                gallery: [
                                        {
                                                id: "img-009",
                                                imageUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f",
                                        },
                                        {
                                                id: "img-010",
                                                imageUrl: "https://images.unsplash.com/photo-1504215680853-026ed2a45def",
                                        },
                                ],
                                totalCost: 290,
                                status: "pending",
                                description:
                                        "A tear was found on the front passenger leather seat, requiring upholstery repair.",
                        },
                ],

                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "urban-mobility-hub-112983",
                organisation: {
                        name: "Urban Mobility Hub",
                        email: "admin@urbanmobility.io",
                },
                plan: "solo",
                vehicles: 27,
                status: "active",
                totalEarning: 1106,
                dateJoined: "12th January, 2024",
                slug: "urban-mobility-hub",

                activeBookings: 7,
                monthlyRevenue: 146,

                revenue: [
                        { month: "Jan", totalRevenue: 420 },
                        { month: "Feb", totalRevenue: 670 },
                        { month: "Mar", totalRevenue: 812 },
                        { month: "Apr", totalRevenue: 943 },
                        { month: "May", totalRevenue: 1106 },
                ],

                fleet: [
                        {
                                id: "VEH-6621",
                                vehicleName: "2022 Honda Civic",
                                status: "rented",
                                dailyRate: 58,
                                lastBookings: "May 01, 2026",
                                plateNumber: "UMH-4431",
                                transmission: "Automatic",
                                bodyType: "Sedan",
                        },
                        {
                                id: "VEH-2847",
                                vehicleName: "2023 Tesla Model 3",
                                status: "rented",
                                dailyRate: 89,
                                lastBookings: "Mar 24, 2026",
                                plateNumber: "ABC-1234",
                                transmission: "Automatic",
                                bodyType: "Sedan",
                        },
                        {
                                id: "VEH-2345",
                                vehicleName: "2024 Tesla Model 3",
                                status: "rented",
                                dailyRate: 89,
                                lastBookings: "May 24, 2026",
                                plateNumber: "ABC-1234",
                                transmission: "Automatic",
                                bodyType: "Sedan",
                        },
                        {
                                id: "VEH-1145",
                                vehicleName: "2026 Bentley Bentayga",
                                status: "rented",
                                dailyRate: 89,
                                lastBookings: "May 24, 2026",
                                plateNumber: "ABC-1234",
                                transmission: "Automatic",
                                bodyType: "Sedan",
                        },
                ],

                booking: [
                        {
                                id: "rental-8832",
                                status: "completed",
                                totalCost: "174",
                                bookingDate: "Apr 18, 2026",
                                pickupDateAndTime:
                                        "Apr 20, 2026 at 8:00 AM",
                                returnDateAndTime:
                                        "Apr 23, 2026 at 6:00 PM",
                                pickupLocation:
                                        "21 King Street, Chicago",
                                returnLocation:
                                        "21 King Street, Chicago",

                                renter: {
                                        fullname: "Sarah Williams",
                                        phoneNumber: "+1 (555) 234-5678",
                                        licenseNumber: "DL-90234781",
                                        email: "sarah.williams@example.com",
                                },
                                vehicleInformation: {
                                        id: "shsf384j",
                                        vehicleName: "Hyundai Elantra 2023",
                                        plateNumber: "7XYZ842",
                                        transmission: "Automatic",
                                        bodyType: "Sedan",
                                },
                        },
                ],

                billingHistory: [
                        {
                                id: "billing-1021",
                                package: "Professional",
                                status: "successful",
                                totalCost: "149",
                                date: "Apr 28, 2026",
                        },
                        {
                                id: "billing-1020",
                                package: "Professional",
                                status: "failed",
                                totalCost: "149",
                                date: "Apr 27, 2026",
                        },
                ],

                damageReports: [
                        {
                                name: "Front Bumper Scratch",
                                submittedDate: "2026-01-12",
                                gallery: [
                                        {
                                                id: "img-001",
                                                imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
                                        },
                                        {
                                                id: "img-002",
                                                imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
                                        },
                                ],
                                totalCost: 450,
                                status: "pending",
                                description:
                                        "Minor scratches and paint damage were discovered on the front bumper after the vehicle was returned by the customer.",
                        },
                        {
                                name: "Broken Side Mirror",
                                submittedDate: "2026-02-03",
                                gallery: [
                                        {
                                                id: "img-003",
                                                imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
                                        },
                                        {
                                                id: "img-004",
                                                imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
                                        },
                                ],
                                totalCost: 320,
                                status: "approved",
                                description:
                                        "The driver's side mirror was found cracked and detached, requiring a full replacement.",
                        },
                        {
                                name: "Rear Door Dent",
                                submittedDate: "2026-02-18",
                                gallery: [
                                        {
                                                id: "img-005",
                                                imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
                                        },
                                        {
                                                id: "img-006",
                                                imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
                                        },
                                ],
                                totalCost: 780,
                                status: "declined",
                                description:
                                        "A noticeable dent was identified on the rear passenger door, likely caused by impact with another object.",
                        },
                        {
                                name: "Windshield Crack",
                                submittedDate: "2026-03-07",
                                gallery: [
                                        {
                                                id: "img-007",
                                                imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
                                        },
                                        {
                                                id: "img-008",
                                                imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
                                        },
                                ],
                                totalCost: 610,
                                status: "approved",
                                description:
                                        "A long crack developed across the lower section of the windshield, requiring complete replacement.",
                        },
                        {
                                name: "Interior Seat Tear",
                                submittedDate: "2026-03-22",
                                gallery: [
                                        {
                                                id: "img-009",
                                                imageUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f",
                                        },
                                        {
                                                id: "img-010",
                                                imageUrl: "https://images.unsplash.com/photo-1504215680853-026ed2a45def",
                                        },
                                ],
                                totalCost: 290,
                                status: "pending",
                                description:
                                        "A tear was found on the front passenger leather seat, requiring upholstery repair.",
                        },
                ],

                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "rideshare-co-332901",
                organisation: {
                        name: "RideShare Co.",
                        email: "hello@rideshareco.com",
                },
                plan: "flex",
                vehicles: 8,
                status: "past due",
                totalEarning: 232,
                dateJoined: "3rd March, 2024",
                slug: "rideshare-co",

                activeBookings: 2,
                monthlyRevenue: 38,

                revenue: [
                        { month: "Jan", totalRevenue: 90 },
                        { month: "Feb", totalRevenue: 118 },
                        { month: "Mar", totalRevenue: 145 },
                        { month: "Apr", totalRevenue: 191 },
                        { month: "May", totalRevenue: 232 },
                ],

                fleet: [
                        {
                                id: "VEH-1203",
                                vehicleName: "2021 Nissan Altima",
                                status: "maintenance",
                                dailyRate: 42,
                                lastBookings: "Apr 19, 2026",
                                plateNumber: "RSC-1022",
                                transmission: "Automatic",
                                bodyType: "Sedan",
                        },
                ],

                booking: [
                        {
                                id: "rental-8832",
                                status: "completed",
                                totalCost: "174",
                                bookingDate: "Apr 18, 2026",
                                pickupDateAndTime:
                                        "Apr 20, 2026 at 8:00 AM",
                                returnDateAndTime:
                                        "Apr 23, 2026 at 6:00 PM",
                                pickupLocation:
                                        "21 King Street, Chicago",
                                returnLocation:
                                        "21 King Street, Chicago",
                                renter: {
                                        fullname: "Sarah Williams",
                                        phoneNumber: "+1 (555) 234-5678",
                                        licenseNumber: "DL-90234781",
                                        email: "sarah.williams@example.com",
                                },
                                vehicleInformation: {
                                        id: "sha3ds4j",
                                        vehicleName: "Hyundai Elantra 2023",
                                        plateNumber: "7XYZ842",
                                        transmission: "Automatic",
                                        bodyType: "Sedan",
                                },
                        },
                ],

                billingHistory: [
                        {
                                id: "billing-1021",
                                package: "Professional",
                                status: "successful",
                                totalCost: "149",
                                date: "Apr 28, 2026",
                        },
                        {
                                id: "billing-1020",
                                package: "Professional",
                                status: "failed",
                                totalCost: "149",
                                date: "Apr 27, 2026",
                        },
                ],
                damageReports: [
                        {
                                name: "Front Bumper Scratch",
                                submittedDate: "2026-01-12",
                                gallery: [
                                        {
                                                id: "img-001",
                                                imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
                                        },
                                        {
                                                id: "img-002",
                                                imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
                                        },
                                ],
                                totalCost: 450,
                                status: "pending",
                                description:
                                        "Minor scratches and paint damage were discovered on the front bumper after the vehicle was returned by the customer.",
                        },
                        {
                                name: "Broken Side Mirror",
                                submittedDate: "2026-02-03",
                                gallery: [
                                        {
                                                id: "img-003",
                                                imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
                                        },
                                        {
                                                id: "img-004",
                                                imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
                                        },
                                ],
                                totalCost: 320,
                                status: "approved",
                                description:
                                        "The driver's side mirror was found cracked and detached, requiring a full replacement.",
                        },
                        {
                                name: "Rear Door Dent",
                                submittedDate: "2026-02-18",
                                gallery: [
                                        {
                                                id: "img-005",
                                                imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
                                        },
                                        {
                                                id: "img-006",
                                                imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
                                        },
                                ],
                                totalCost: 780,
                                status: "declined",
                                description:
                                        "A noticeable dent was identified on the rear passenger door, likely caused by impact with another object.",
                        },
                        {
                                name: "Windshield Crack",
                                submittedDate: "2026-03-07",
                                gallery: [
                                        {
                                                id: "img-007",
                                                imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
                                        },
                                        {
                                                id: "img-008",
                                                imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
                                        },
                                ],
                                totalCost: 610,
                                status: "approved",
                                description:
                                        "A long crack developed across the lower section of the windshield, requiring complete replacement.",
                        },
                        {
                                name: "Interior Seat Tear",
                                submittedDate: "2026-03-22",
                                gallery: [
                                        {
                                                id: "img-009",
                                                imageUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f",
                                        },
                                        {
                                                id: "img-010",
                                                imageUrl: "https://images.unsplash.com/photo-1504215680853-026ed2a45def",
                                        },
                                ],
                                totalCost: 290,
                                status: "pending",
                                description:
                                        "A tear was found on the front passenger leather seat, requiring upholstery repair.",
                        },
                ],
                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "northgate-transit-449012",
                organisation: {
                        name: "Northgate Transit",
                        email: "ops@northgatetransit.com",
                },
                plan: "solo",
                vehicles: 34,
                status: "active",
                totalEarning: 2686,
                dateJoined: "19th June, 2023",
                slug: "northgate-transit",

                activeBookings: 14,
                monthlyRevenue: 395,

                revenue: [
                        { month: "Jan", totalRevenue: 1640 },
                        { month: "Feb", totalRevenue: 1880 },
                        { month: "Mar", totalRevenue: 2145 },
                        { month: "Apr", totalRevenue: 2470 },
                        { month: "May", totalRevenue: 2686 },
                ],

                fleet: [
                        {
                                id: "VEH-7122",
                                vehicleName: "2024 Ford Explorer",
                                status: "rented",
                                dailyRate: 96,
                                lastBookings: "May 02, 2026",
                                plateNumber: "NGT-5520",
                                transmission: "Automatic",
                                bodyType: "SUV",
                        },
                ],

                booking: [
                        {
                                id: "rental-8832",
                                status: "completed",
                                totalCost: "174",
                                bookingDate: "Apr 18, 2026",
                                pickupDateAndTime:
                                        "Apr 20, 2026 at 8:00 AM",
                                returnDateAndTime:
                                        "Apr 23, 2026 at 6:00 PM",
                                pickupLocation:
                                        "21 King Street, Chicago",
                                returnLocation:
                                        "21 King Street, Chicago",
                                renter: {
                                        fullname: "James Anderson",
                                        phoneNumber: "+1 (555) 567-8901",
                                        licenseNumber: "DL-43892176",
                                        email: "james.anderson@example.com",
                                },
                                vehicleInformation: {
                                        id: "shscs84j",
                                        vehicleName: "Hyundai Elantra 2023",
                                        plateNumber: "7XYZ842",
                                        transmission: "Automatic",
                                        bodyType: "Sedan",
                                },
                        },
                ],

                billingHistory: [
                        {
                                id: "billing-1021",
                                package: "Professional",
                                status: "successful",
                                totalCost: "149",
                                date: "Apr 28, 2026",
                        },
                        {
                                id: "billing-1020",
                                package: "Professional",
                                status: "failed",
                                totalCost: "149",
                                date: "Apr 27, 2026",
                        },
                ],
                damageReports: [
                        {
                                name: "Front Bumper Scratch",
                                submittedDate: "2026-01-12",
                                gallery: [
                                        {
                                                id: "img-001",
                                                imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
                                        },
                                        {
                                                id: "img-002",
                                                imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
                                        },
                                ],
                                totalCost: 450,
                                status: "pending",
                                description:
                                        "Minor scratches and paint damage were discovered on the front bumper after the vehicle was returned by the customer.",
                        },
                        {
                                name: "Broken Side Mirror",
                                submittedDate: "2026-02-03",
                                gallery: [
                                        {
                                                id: "img-003",
                                                imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
                                        },
                                        {
                                                id: "img-004",
                                                imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
                                        },
                                ],
                                totalCost: 320,
                                status: "approved",
                                description:
                                        "The driver's side mirror was found cracked and detached, requiring a full replacement.",
                        },
                        {
                                name: "Rear Door Dent",
                                submittedDate: "2026-02-18",
                                gallery: [
                                        {
                                                id: "img-005",
                                                imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
                                        },
                                        {
                                                id: "img-006",
                                                imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
                                        },
                                ],
                                totalCost: 780,
                                status: "declined",
                                description:
                                        "A noticeable dent was identified on the rear passenger door, likely caused by impact with another object.",
                        },
                        {
                                name: "Windshield Crack",
                                submittedDate: "2026-03-07",
                                gallery: [
                                        {
                                                id: "img-007",
                                                imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
                                        },
                                        {
                                                id: "img-008",
                                                imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
                                        },
                                ],
                                totalCost: 610,
                                status: "approved",
                                description:
                                        "A long crack developed across the lower section of the windshield, requiring complete replacement.",
                        },
                        {
                                name: "Interior Seat Tear",
                                submittedDate: "2026-03-22",
                                gallery: [
                                        {
                                                id: "img-009",
                                                imageUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f",
                                        },
                                        {
                                                id: "img-010",
                                                imageUrl: "https://images.unsplash.com/photo-1504215680853-026ed2a45def",
                                        },
                                ],
                                totalCost: 290,
                                status: "pending",
                                description:
                                        "A tear was found on the front passenger leather seat, requiring upholstery repair.",
                        },
                ],
                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "greenway-rentals-556123",
                organisation: {
                        name: "Greenway Rentals",
                        email: "contact@greenwayrentals.co",
                },
                plan: "flex",
                vehicles: 11,
                status: "cancelled",
                totalEarning: 319,
                dateJoined: "7th September, 2023",
                slug: "greenway-rentals",

                activeBookings: 0,
                monthlyRevenue: 0,

                revenue: [
                        { month: "Jan", totalRevenue: 101 },
                        { month: "Feb", totalRevenue: 188 },
                        { month: "Mar", totalRevenue: 250 },
                        { month: "Apr", totalRevenue: 301 },
                        { month: "May", totalRevenue: 319 },
                ],

                fleet: [
                        {
                                id: "VEH-3411",
                                vehicleName: "2020 Kia Rio",
                                status: "unlisted",
                                dailyRate: 34,
                                lastBookings: "Jan 10, 2026",
                                plateNumber: "GWR-7811",
                                transmission: "Automatic",
                                bodyType: "Hatchback",
                        },
                ],

                booking: [
                        {
                                id: "rental-8832",
                                status: "completed",
                                totalCost: "174",
                                bookingDate: "Apr 18, 2026",
                                pickupDateAndTime:
                                        "Apr 20, 2026 at 8:00 AM",
                                returnDateAndTime:
                                        "Apr 23, 2026 at 6:00 PM",
                                pickupLocation:
                                        "21 King Street, Chicago",
                                returnLocation:
                                        "21 King Street, Chicago",
                                renter: {
                                        fullname: "James Anderson",
                                        phoneNumber: "+1 (555) 567-8901",
                                        licenseNumber: "DL-43892176",
                                        email: "james.anderson@example.com",
                                },
                                vehicleInformation: {
                                        id: "sh5cf4j",
                                        vehicleName: "Hyundai Elantra 2023",
                                        plateNumber: "7XYZ842",
                                        transmission: "Automatic",
                                        bodyType: "Sedan",
                                },
                        },
                ],

                billingHistory: [
                        {
                                id: "billing-1021",
                                package: "Professional",
                                status: "successful",
                                totalCost: "149",
                                date: "Apr 28, 2026",
                        },
                        {
                                id: "billing-1020",
                                package: "Professional",
                                status: "failed",
                                totalCost: "149",
                                date: "Apr 27, 2026",
                        },
                ],
                damageReports: [
                        {
                                name: "Front Bumper Scratch",
                                submittedDate: "2026-01-12",
                                gallery: [
                                        {
                                                id: "img-001",
                                                imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
                                        },
                                        {
                                                id: "img-002",
                                                imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
                                        },
                                ],
                                totalCost: 450,
                                status: "pending",
                                description:
                                        "Minor scratches and paint damage were discovered on the front bumper after the vehicle was returned by the customer.",
                        },
                        {
                                name: "Broken Side Mirror",
                                submittedDate: "2026-02-03",
                                gallery: [
                                        {
                                                id: "img-003",
                                                imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
                                        },
                                        {
                                                id: "img-004",
                                                imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
                                        },
                                ],
                                totalCost: 320,
                                status: "approved",
                                description:
                                        "The driver's side mirror was found cracked and detached, requiring a full replacement.",
                        },
                        {
                                name: "Rear Door Dent",
                                submittedDate: "2026-02-18",
                                gallery: [
                                        {
                                                id: "img-005",
                                                imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
                                        },
                                        {
                                                id: "img-006",
                                                imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
                                        },
                                ],
                                totalCost: 780,
                                status: "declined",
                                description:
                                        "A noticeable dent was identified on the rear passenger door, likely caused by impact with another object.",
                        },
                        {
                                name: "Windshield Crack",
                                submittedDate: "2026-03-07",
                                gallery: [
                                        {
                                                id: "img-007",
                                                imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
                                        },
                                        {
                                                id: "img-008",
                                                imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
                                        },
                                ],
                                totalCost: 610,
                                status: "approved",
                                description:
                                        "A long crack developed across the lower section of the windshield, requiring complete replacement.",
                        },
                        {
                                name: "Interior Seat Tear",
                                submittedDate: "2026-03-22",
                                gallery: [
                                        {
                                                id: "img-009",
                                                imageUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f",
                                        },
                                        {
                                                id: "img-010",
                                                imageUrl: "https://images.unsplash.com/photo-1504215680853-026ed2a45def",
                                        },
                                ],
                                totalCost: 290,
                                status: "pending",
                                description:
                                        "A tear was found on the front passenger leather seat, requiring upholstery repair.",
                        },
                ],
                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "apex-logistics-667234",
                organisation: {
                        name: "Apex Logistics",
                        email: "fleet@apexlogistics.net",
                },
                plan: "fleet",
                vehicles: 98,
                status: "active",
                totalEarning: 11760,
                dateJoined: "22nd February, 2023",
                slug: "apex-logistics",

                activeBookings: 31,
                monthlyRevenue: 1240,

                revenue: [
                        { month: "Jan", totalRevenue: 8420 },
                        { month: "Feb", totalRevenue: 9170 },
                        { month: "Mar", totalRevenue: 10180 },
                        { month: "Apr", totalRevenue: 10940 },
                        { month: "May", totalRevenue: 11760 },
                ],

                fleet: [
                        {
                                id: "VEH-8120",
                                vehicleName: "2023 Mercedes Sprinter",
                                status: "rented",
                                dailyRate: 165,
                                lastBookings: "May 03, 2026",
                                plateNumber: "APX-5501",
                                transmission: "Automatic",
                                bodyType: "Van",
                        },
                ],

                booking: [
                        {
                                id: "rental-8832",
                                status: "completed",
                                totalCost: "174",
                                bookingDate: "Apr 18, 2026",
                                pickupDateAndTime:
                                        "Apr 20, 2026 at 8:00 AM",
                                returnDateAndTime:
                                        "Apr 23, 2026 at 6:00 PM",
                                pickupLocation:
                                        "21 King Street, Chicago",
                                returnLocation:
                                        "21 King Street, Chicago",
                                renter: {
                                        fullname: "James Anderson",
                                        phoneNumber: "+1 (555) 567-8901",
                                        licenseNumber: "DL-43892176",
                                        email: "james.anderson@example.com",
                                },
                                vehicleInformation: {
                                        id: "shvfg4j",
                                        vehicleName: "Hyundai Elantra 2023",
                                        plateNumber: "7XYZ842",
                                        transmission: "Automatic",
                                        bodyType: "Sedan",
                                },
                        },
                ],

                billingHistory: [
                        {
                                id: "billing-1021",
                                package: "Professional",
                                status: "successful",
                                totalCost: "149",
                                date: "Apr 28, 2026",
                        },
                        {
                                id: "billing-1020",
                                package: "Professional",
                                status: "failed",
                                totalCost: "149",
                                date: "Apr 27, 2026",
                        },
                ],
                damageReports: [
                        {
                                name: "Front Bumper Scratch",
                                submittedDate: "2026-01-12",
                                gallery: [
                                        {
                                                id: "img-001",
                                                imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
                                        },
                                        {
                                                id: "img-002",
                                                imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
                                        },
                                ],
                                totalCost: 450,
                                status: "pending",
                                description:
                                        "Minor scratches and paint damage were discovered on the front bumper after the vehicle was returned by the customer.",
                        },
                        {
                                name: "Broken Side Mirror",
                                submittedDate: "2026-02-03",
                                gallery: [
                                        {
                                                id: "img-003",
                                                imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
                                        },
                                        {
                                                id: "img-004",
                                                imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
                                        },
                                ],
                                totalCost: 320,
                                status: "approved",
                                description:
                                        "The driver's side mirror was found cracked and detached, requiring a full replacement.",
                        },
                        {
                                name: "Rear Door Dent",
                                submittedDate: "2026-02-18",
                                gallery: [
                                        {
                                                id: "img-005",
                                                imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
                                        },
                                        {
                                                id: "img-006",
                                                imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
                                        },
                                ],
                                totalCost: 780,
                                status: "declined",
                                description:
                                        "A noticeable dent was identified on the rear passenger door, likely caused by impact with another object.",
                        },
                        {
                                name: "Windshield Crack",
                                submittedDate: "2026-03-07",
                                gallery: [
                                        {
                                                id: "img-007",
                                                imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
                                        },
                                        {
                                                id: "img-008",
                                                imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
                                        },
                                ],
                                totalCost: 610,
                                status: "approved",
                                description:
                                        "A long crack developed across the lower section of the windshield, requiring complete replacement.",
                        },
                        {
                                name: "Interior Seat Tear",
                                submittedDate: "2026-03-22",
                                gallery: [
                                        {
                                                id: "img-009",
                                                imageUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f",
                                        },
                                        {
                                                id: "img-010",
                                                imageUrl: "https://images.unsplash.com/photo-1504215680853-026ed2a45def",
                                        },
                                ],
                                totalCost: 290,
                                status: "pending",
                                description:
                                        "A tear was found on the front passenger leather seat, requiring upholstery repair.",
                        },
                ],
                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "suncoast-cars-778345",
                organisation: {
                        name: "Suncoast Cars",
                        email: "info@suncoastcars.com",
                },
                plan: "solo",
                vehicles: 19,
                status: "past due",
                totalEarning: 1501,
                dateJoined: "15th November, 2023",
                slug: "suncoast-cars",

                activeBookings: 5,
                monthlyRevenue: 185,

                revenue: [
                        { month: "Jan", totalRevenue: 780 },
                        { month: "Feb", totalRevenue: 1020 },
                        { month: "Mar", totalRevenue: 1184 },
                        { month: "Apr", totalRevenue: 1340 },
                        { month: "May", totalRevenue: 1501 },
                ],

                fleet: [],
                booking: [
                        {
                                id: "rental-8832",
                                status: "completed",
                                totalCost: "174",
                                bookingDate: "Apr 18, 2026",
                                pickupDateAndTime:
                                        "Apr 20, 2026 at 8:00 AM",
                                returnDateAndTime:
                                        "Apr 23, 2026 at 6:00 PM",
                                pickupLocation:
                                        "21 King Street, Chicago",
                                returnLocation:
                                        "21 King Street, Chicago",
                                renter: {
                                        fullname: "James Anderson",
                                        phoneNumber: "+1 (555) 567-8901",
                                        licenseNumber: "DL-43892176",
                                        email: "james.anderson@example.com",
                                },
                                vehicleInformation: {
                                        id: "sha39iuj",
                                        vehicleName: "Hyundai Elantra 2023",
                                        plateNumber: "7XYZ842",
                                        transmission: "Automatic",
                                        bodyType: "Sedan",
                                },
                        },
                ],

                billingHistory: [
                        {
                                id: "billing-1021",
                                package: "Professional",
                                status: "successful",
                                totalCost: "149",
                                date: "Apr 28, 2026",
                        },
                        {
                                id: "billing-1020",
                                package: "Professional",
                                status: "failed",
                                totalCost: "149",
                                date: "Apr 27, 2026",
                        },
                ],
                damageReports: [
                        {
                                name: "Front Bumper Scratch",
                                submittedDate: "2026-01-12",
                                gallery: [
                                        {
                                                id: "img-001",
                                                imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
                                        },
                                        {
                                                id: "img-002",
                                                imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
                                        },
                                ],
                                totalCost: 450,
                                status: "pending",
                                description:
                                        "Minor scratches and paint damage were discovered on the front bumper after the vehicle was returned by the customer.",
                        },
                        {
                                name: "Broken Side Mirror",
                                submittedDate: "2026-02-03",
                                gallery: [
                                        {
                                                id: "img-003",
                                                imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
                                        },
                                        {
                                                id: "img-004",
                                                imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
                                        },
                                ],
                                totalCost: 320,
                                status: "approved",
                                description:
                                        "The driver's side mirror was found cracked and detached, requiring a full replacement.",
                        },
                        {
                                name: "Rear Door Dent",
                                submittedDate: "2026-02-18",
                                gallery: [
                                        {
                                                id: "img-005",
                                                imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
                                        },
                                        {
                                                id: "img-006",
                                                imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
                                        },
                                ],
                                totalCost: 780,
                                status: "declined",
                                description:
                                        "A noticeable dent was identified on the rear passenger door, likely caused by impact with another object.",
                        },
                        {
                                name: "Windshield Crack",
                                submittedDate: "2026-03-07",
                                gallery: [
                                        {
                                                id: "img-007",
                                                imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
                                        },
                                        {
                                                id: "img-008",
                                                imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
                                        },
                                ],
                                totalCost: 610,
                                status: "approved",
                                description:
                                        "A long crack developed across the lower section of the windshield, requiring complete replacement.",
                        },
                        {
                                name: "Interior Seat Tear",
                                submittedDate: "2026-03-22",
                                gallery: [
                                        {
                                                id: "img-009",
                                                imageUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f",
                                        },
                                        {
                                                id: "img-010",
                                                imageUrl: "https://images.unsplash.com/photo-1504215680853-026ed2a45def",
                                        },
                                ],
                                totalCost: 290,
                                status: "pending",
                                description:
                                        "A tear was found on the front passenger leather seat, requiring upholstery repair.",
                        },
                ],
                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "citylink-fleets-889456",
                organisation: {
                        name: "CityLink Fleets",
                        email: "admin@citylinkfleets.io",
                },
                plan: "flex",
                vehicles: 6,
                status: "active",
                totalEarning: 174,
                dateJoined: "1st August, 2024",
                slug: "citylink-fleets",

                activeBookings: 1,
                monthlyRevenue: 22,

                revenue: [
                        { month: "Jan", totalRevenue: 51 },
                        { month: "Feb", totalRevenue: 82 },
                        { month: "Mar", totalRevenue: 110 },
                        { month: "Apr", totalRevenue: 141 },
                        { month: "May", totalRevenue: 174 },
                ],

                fleet: [],
                booking: [
                        {
                                id: "rental-8832",
                                status: "completed",
                                totalCost: "174",
                                bookingDate: "Apr 18, 2026",
                                pickupDateAndTime:
                                        "Apr 20, 2026 at 8:00 AM",
                                returnDateAndTime:
                                        "Apr 23, 2026 at 6:00 PM",
                                pickupLocation:
                                        "21 King Street, Chicago",
                                returnLocation:
                                        "21 King Street, Chicago",
                                renter: {
                                        fullname: "James Anderson",
                                        phoneNumber: "+1 (555) 567-8901",
                                        licenseNumber: "DL-43892176",
                                        email: "james.anderson@example.com",
                                },
                                vehicleInformation: {
                                        id: "shds84j",
                                        vehicleName: "Hyundai Elantra 2023",
                                        plateNumber: "7XYZ842",
                                        transmission: "Automatic",
                                        bodyType: "Sedan",
                                },
                        },
                ],

                billingHistory: [
                        {
                                id: "billing-1021",
                                package: "Professional",
                                status: "successful",
                                totalCost: "149",
                                date: "Apr 28, 2026",
                        },
                        {
                                id: "billing-1020",
                                package: "Professional",
                                status: "failed",
                                totalCost: "149",
                                date: "Apr 27, 2026",
                        },
                ],
                damageReports: [
                        {
                                name: "Front Bumper Scratch",
                                submittedDate: "2026-01-12",
                                gallery: [
                                        {
                                                id: "img-001",
                                                imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
                                        },
                                        {
                                                id: "img-002",
                                                imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
                                        },
                                ],
                                totalCost: 450,
                                status: "pending",
                                description:
                                        "Minor scratches and paint damage were discovered on the front bumper after the vehicle was returned by the customer.",
                        },
                        {
                                name: "Broken Side Mirror",
                                submittedDate: "2026-02-03",
                                gallery: [
                                        {
                                                id: "img-003",
                                                imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
                                        },
                                        {
                                                id: "img-004",
                                                imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
                                        },
                                ],
                                totalCost: 320,
                                status: "approved",
                                description:
                                        "The driver's side mirror was found cracked and detached, requiring a full replacement.",
                        },
                        {
                                name: "Rear Door Dent",
                                submittedDate: "2026-02-18",
                                gallery: [
                                        {
                                                id: "img-005",
                                                imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
                                        },
                                        {
                                                id: "img-006",
                                                imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
                                        },
                                ],
                                totalCost: 780,
                                status: "declined",
                                description:
                                        "A noticeable dent was identified on the rear passenger door, likely caused by impact with another object.",
                        },
                        {
                                name: "Windshield Crack",
                                submittedDate: "2026-03-07",
                                gallery: [
                                        {
                                                id: "img-007",
                                                imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
                                        },
                                        {
                                                id: "img-008",
                                                imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
                                        },
                                ],
                                totalCost: 610,
                                status: "approved",
                                description:
                                        "A long crack developed across the lower section of the windshield, requiring complete replacement.",
                        },
                        {
                                name: "Interior Seat Tear",
                                submittedDate: "2026-03-22",
                                gallery: [
                                        {
                                                id: "img-009",
                                                imageUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f",
                                        },
                                        {
                                                id: "img-010",
                                                imageUrl: "https://images.unsplash.com/photo-1504215680853-026ed2a45def",
                                        },
                                ],
                                totalCost: 290,
                                status: "pending",
                                description:
                                        "A tear was found on the front passenger leather seat, requiring upholstery repair.",
                        },
                ],
                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "harbour-drive-990567",
                organisation: {
                        name: "Harbour Drive",
                        email: "fleet@harbourdrive.com.au",
                },
                plan: "fleet",
                vehicles: 73,
                status: "cancelled",
                totalEarning: 8760,
                dateJoined: "10th May, 2022",
                slug: "harbour-drive",

                activeBookings: 0,
                monthlyRevenue: 0,

                revenue: [
                        { month: "Jan", totalRevenue: 7020 },
                        { month: "Feb", totalRevenue: 7610 },
                        { month: "Mar", totalRevenue: 8035 },
                        { month: "Apr", totalRevenue: 8450 },
                        { month: "May", totalRevenue: 8760 },
                ],

                fleet: [],
                booking: [
                        {
                                id: "rental-8832",
                                status: "completed",
                                totalCost: "174",
                                bookingDate: "Apr 18, 2026",
                                pickupDateAndTime:
                                        "Apr 20, 2026 at 8:00 AM",
                                returnDateAndTime:
                                        "Apr 23, 2026 at 6:00 PM",
                                pickupLocation:
                                        "21 King Street, Chicago",
                                returnLocation:
                                        "21 King Street, Chicago",
                                renter: {
                                        fullname: "James Anderson",
                                        phoneNumber: "+1 (555) 567-8901",
                                        licenseNumber: "DL-43892176",
                                        email: "james.anderson@example.com",
                                },
                                vehicleInformation: {
                                        id: "sha3984j",
                                        vehicleName: "Hyundai Elantra 2023",
                                        plateNumber: "7XYZ842",
                                        transmission: "Automatic",
                                        bodyType: "Sedan",
                                },
                        },
                ],

                billingHistory: [
                        {
                                id: "billing-1021",
                                package: "Professional",
                                status: "successful",
                                totalCost: "149",
                                date: "Apr 28, 2026",
                        },
                        {
                                id: "billing-1020",
                                package: "Professional",
                                status: "failed",
                                totalCost: "149",
                                date: "Apr 27, 2026",
                        },
                ],
                damageReports: [
                        {
                                name: "Front Bumper Scratch",
                                submittedDate: "2026-01-12",
                                gallery: [
                                        {
                                                id: "img-001",
                                                imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
                                        },
                                        {
                                                id: "img-002",
                                                imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
                                        },
                                ],
                                totalCost: 450,
                                status: "pending",
                                description:
                                        "Minor scratches and paint damage were discovered on the front bumper after the vehicle was returned by the customer.",
                        },
                        {
                                name: "Broken Side Mirror",
                                submittedDate: "2026-02-03",
                                gallery: [
                                        {
                                                id: "img-003",
                                                imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
                                        },
                                        {
                                                id: "img-004",
                                                imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
                                        },
                                ],
                                totalCost: 320,
                                status: "approved",
                                description:
                                        "The driver's side mirror was found cracked and detached, requiring a full replacement.",
                        },
                        {
                                name: "Rear Door Dent",
                                submittedDate: "2026-02-18",
                                gallery: [
                                        {
                                                id: "img-005",
                                                imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
                                        },
                                        {
                                                id: "img-006",
                                                imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
                                        },
                                ],
                                totalCost: 780,
                                status: "declined",
                                description:
                                        "A noticeable dent was identified on the rear passenger door, likely caused by impact with another object.",
                        },
                        {
                                name: "Windshield Crack",
                                submittedDate: "2026-03-07",
                                gallery: [
                                        {
                                                id: "img-007",
                                                imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
                                        },
                                        {
                                                id: "img-008",
                                                imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
                                        },
                                ],
                                totalCost: 610,
                                status: "approved",
                                description:
                                        "A long crack developed across the lower section of the windshield, requiring complete replacement.",
                        },
                        {
                                name: "Interior Seat Tear",
                                submittedDate: "2026-03-22",
                                gallery: [
                                        {
                                                id: "img-009",
                                                imageUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f",
                                        },
                                        {
                                                id: "img-010",
                                                imageUrl: "https://images.unsplash.com/photo-1504215680853-026ed2a45def",
                                        },
                                ],
                                totalCost: 290,
                                status: "pending",
                                description:
                                        "A tear was found on the front passenger leather seat, requiring upholstery repair.",
                        },
                ],
                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "swift-auto-group-101678",
                organisation: {
                        name: "Swift Auto Group",
                        email: "ops@swiftauto.co",
                },
                plan: "solo",
                vehicles: 22,
                status: "active",
                totalEarning: 1738,
                dateJoined: "28th October, 2023",
                slug: "swift-auto-group",

                activeBookings: 8,
                monthlyRevenue: 244,

                revenue: [
                        { month: "Jan", totalRevenue: 960 },
                        { month: "Feb", totalRevenue: 1180 },
                        { month: "Mar", totalRevenue: 1360 },
                        { month: "Apr", totalRevenue: 1510 },
                        { month: "May", totalRevenue: 1738 },
                ],

                fleet: [],
                booking: [
                        {
                                id: "rental-8832",
                                status: "completed",
                                totalCost: "174",
                                bookingDate: "Apr 18, 2026",
                                pickupDateAndTime:
                                        "Apr 20, 2026 at 8:00 AM",
                                returnDateAndTime:
                                        "Apr 23, 2026 at 6:00 PM",
                                pickupLocation:
                                        "21 King Street, Chicago",
                                returnLocation:
                                        "21 King Street, Chicago",
                                renter: {
                                        fullname: "James Anderson",
                                        phoneNumber: "+1 (555) 567-8901",
                                        licenseNumber: "DL-43892176",
                                        email: "james.anderson@example.com",
                                },
                                vehicleInformation: {
                                        id: "sha3984j",
                                        vehicleName: "Hyundai Elantra 2023",
                                        plateNumber: "7XYZ842",
                                        transmission: "Automatic",
                                        bodyType: "Sedan",
                                },
                        },
                ],

                billingHistory: [
                        {
                                id: "billing-1021",
                                package: "Professional",
                                status: "successful",
                                totalCost: "149",
                                date: "Apr 28, 2026",
                        },
                        {
                                id: "billing-1020",
                                package: "Professional",
                                status: "failed",
                                totalCost: "149",
                                date: "Apr 27, 2026",
                        },
                ],
                damageReports: [
                        {
                                name: "Front Bumper Scratch",
                                submittedDate: "2026-01-12",
                                gallery: [
                                        {
                                                id: "img-001",
                                                imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
                                        },
                                        {
                                                id: "img-002",
                                                imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
                                        },
                                ],
                                totalCost: 450,
                                status: "pending",
                                description:
                                        "Minor scratches and paint damage were discovered on the front bumper after the vehicle was returned by the customer.",
                        },
                        {
                                name: "Broken Side Mirror",
                                submittedDate: "2026-02-03",
                                gallery: [
                                        {
                                                id: "img-003",
                                                imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
                                        },
                                        {
                                                id: "img-004",
                                                imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
                                        },
                                ],
                                totalCost: 320,
                                status: "approved",
                                description:
                                        "The driver's side mirror was found cracked and detached, requiring a full replacement.",
                        },
                        {
                                name: "Rear Door Dent",
                                submittedDate: "2026-02-18",
                                gallery: [
                                        {
                                                id: "img-005",
                                                imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
                                        },
                                        {
                                                id: "img-006",
                                                imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
                                        },
                                ],
                                totalCost: 780,
                                status: "declined",
                                description:
                                        "A noticeable dent was identified on the rear passenger door, likely caused by impact with another object.",
                        },
                        {
                                name: "Windshield Crack",
                                submittedDate: "2026-03-07",
                                gallery: [
                                        {
                                                id: "img-007",
                                                imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
                                        },
                                        {
                                                id: "img-008",
                                                imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
                                        },
                                ],
                                totalCost: 610,
                                status: "approved",
                                description:
                                        "A long crack developed across the lower section of the windshield, requiring complete replacement.",
                        },
                        {
                                name: "Interior Seat Tear",
                                submittedDate: "2026-03-22",
                                gallery: [
                                        {
                                                id: "img-009",
                                                imageUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f",
                                        },
                                        {
                                                id: "img-010",
                                                imageUrl: "https://images.unsplash.com/photo-1504215680853-026ed2a45def",
                                        },
                                ],
                                totalCost: 290,
                                status: "pending",
                                description:
                                        "A tear was found on the front passenger leather seat, requiring upholstery repair.",
                        },
                ],
                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "peak-vehicle-services-112789",
                organisation: {
                        name: "Peak Vehicle Services",
                        email: "admin@peakvehicles.com",
                },
                plan: "flex",
                vehicles: 14,
                status: "past due",
                totalEarning: 406,
                dateJoined: "5th December, 2023",
                slug: "peak-vehicle-services",

                activeBookings: 3,
                monthlyRevenue: 55,

                revenue: [
                        { month: "Jan", totalRevenue: 120 },
                        { month: "Feb", totalRevenue: 185 },
                        { month: "Mar", totalRevenue: 246 },
                        { month: "Apr", totalRevenue: 320 },
                        { month: "May", totalRevenue: 406 },
                ],

                fleet: [],
                booking: [
                        {
                                id: "rental-8832",
                                status: "completed",
                                totalCost: "174",
                                bookingDate: "Apr 18, 2026",
                                pickupDateAndTime:
                                        "Apr 20, 2026 at 8:00 AM",
                                returnDateAndTime:
                                        "Apr 23, 2026 at 6:00 PM",
                                pickupLocation:
                                        "21 King Street, Chicago",
                                returnLocation:
                                        "21 King Street, Chicago",
                                renter: {
                                        fullname: "James Anderson",
                                        phoneNumber: "+1 (555) 567-8901",
                                        licenseNumber: "DL-43892176",
                                        email: "james.anderson@example.com",
                                },
                                vehicleInformation: {
                                        id: "sha3984j",
                                        vehicleName: "Hyundai Elantra 2023",
                                        plateNumber: "7XYZ842",
                                        transmission: "Automatic",
                                        bodyType: "Sedan",
                                },
                        },
                ],

                billingHistory: [
                        {
                                id: "billing-1021",
                                package: "Professional",
                                status: "successful",
                                totalCost: "149",
                                date: "Apr 28, 2026",
                        },
                        {
                                id: "billing-1020",
                                package: "Professional",
                                status: "failed",
                                totalCost: "149",
                                date: "Apr 27, 2026",
                        },
                ],
                damageReports: [],
                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "transcity-mobility-223890",
                organisation: {
                        name: "TransCity Mobility",
                        email: "hello@transcity.io",
                },
                plan: "fleet",
                vehicles: 201,
                status: "active",
                totalEarning: 24120,
                dateJoined: "17th March, 2022",
                slug: "transcity-mobility",

                activeBookings: 56,
                monthlyRevenue: 2480,

                revenue: [
                        { month: "Jan", totalRevenue: 18120 },
                        { month: "Feb", totalRevenue: 19480 },
                        { month: "Mar", totalRevenue: 20810 },
                        { month: "Apr", totalRevenue: 22360 },
                        { month: "May", totalRevenue: 24120 },
                ],

                fleet: [
                        {
                                id: "VEH-7122",
                                vehicleName: "2024 Ford Explorer",
                                status: "rented",
                                dailyRate: 96,
                                lastBookings: "May 02, 2026",
                                plateNumber: "NGT-5520",
                                transmission: "Automatic",
                                bodyType: "SUV",
                        },
                ],
                booking: [
                        {
                                id: "rental-8832",
                                status: "completed",
                                totalCost: "174",
                                bookingDate: "Apr 18, 2026",
                                pickupDateAndTime:
                                        "Apr 20, 2026 at 8:00 AM",
                                returnDateAndTime:
                                        "Apr 23, 2026 at 6:00 PM",
                                pickupLocation:
                                        "21 King Street, Chicago",
                                returnLocation:
                                        "21 King Street, Chicago",
                                renter: {
                                        fullname: "James Anderson",
                                        phoneNumber: "+1 (555) 567-8901",
                                        licenseNumber: "DL-43892176",
                                        email: "james.anderson@example.com",
                                },
                                vehicleInformation: {
                                        id: "sha3984j",
                                        vehicleName: "Hyundai Elantra 2023",
                                        plateNumber: "7XYZ842",
                                        transmission: "Automatic",
                                        bodyType: "Sedan",
                                },
                        },
                ],

                billingHistory: [
                        {
                                id: "billing-1021",
                                package: "Professional",
                                status: "successful",
                                totalCost: "149",
                                date: "Apr 28, 2026",
                        },
                        {
                                id: "billing-1020",
                                package: "Professional",
                                status: "failed",
                                totalCost: "149",
                                date: "Apr 27, 2026",
                        },
                ],
                damageReports: [],
                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "westside-car-club-334901",
                organisation: {
                        name: "Westside Car Club",
                        email: "support@westsidecarclub.com",
                },
                plan: "flex",
                vehicles: 5,
                status: "cancelled",
                totalEarning: 145,
                dateJoined: "20th July, 2024",
                slug: "westside-car-club",

                activeBookings: 0,
                monthlyRevenue: 0,

                revenue: [
                        { month: "Jan", totalRevenue: 41 },
                        { month: "Feb", totalRevenue: 78 },
                        { month: "Mar", totalRevenue: 102 },
                        { month: "Apr", totalRevenue: 124 },
                        { month: "May", totalRevenue: 145 },
                ],

                fleet: [],
                booking: [
                        {
                                id: "rental-8832",
                                status: "completed",
                                totalCost: "174",
                                bookingDate: "Apr 18, 2026",
                                pickupDateAndTime:
                                        "Apr 20, 2026 at 8:00 AM",
                                returnDateAndTime:
                                        "Apr 23, 2026 at 6:00 PM",
                                pickupLocation:
                                        "21 King Street, Chicago",
                                returnLocation:
                                        "21 King Street, Chicago",
                                renter: {
                                        fullname: "James Anderson",
                                        phoneNumber: "+1 (555) 567-8901",
                                        licenseNumber: "DL-43892176",
                                        email: "james.anderson@example.com",
                                },
                                vehicleInformation: {
                                        id: "sha3984j",
                                        vehicleName: "Hyundai Elantra 2023",
                                        plateNumber: "7XYZ842",
                                        transmission: "Automatic",
                                        bodyType: "Sedan",
                                },
                        },
                ],

                billingHistory: [
                        {
                                id: "billing-1021",
                                package: "Professional",
                                status: "successful",
                                totalCost: "149",
                                date: "Apr 28, 2026",
                        },
                        {
                                id: "billing-1020",
                                package: "Professional",
                                status: "failed",
                                totalCost: "149",
                                date: "Apr 27, 2026",
                        },
                ],
                damageReports: [],
                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "delta-fleet-management-445012",
                organisation: {
                        name: "Delta Fleet Management",
                        email: "ops@deltafleet.co.uk",
                },
                plan: "solo",
                vehicles: 41,
                status: "active",
                totalEarning: 3239,
                dateJoined: "9th January, 2023",
                slug: "delta-fleet-management",

                activeBookings: 17,
                monthlyRevenue: 431,

                revenue: [
                        { month: "Jan", totalRevenue: 2010 },
                        { month: "Feb", totalRevenue: 2380 },
                        { month: "Mar", totalRevenue: 2720 },
                        { month: "Apr", totalRevenue: 3015 },
                        { month: "May", totalRevenue: 3239 },
                ],

                fleet: [],
                booking: [],
                billingHistory: [],
                damageReports: [],
                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "ionic-ride-solutions-556123",
                organisation: {
                        name: "Ionic Ride Solutions",
                        email: "admin@ionicride.com",
                },
                plan: "solo",
                vehicles: 16,
                status: "past due",
                totalEarning: 1264,
                dateJoined: "14th February, 2024",
                slug: "ionic-ride-solutions",

                activeBookings: 4,
                monthlyRevenue: 171,

                revenue: [
                        { month: "Jan", totalRevenue: 680 },
                        { month: "Feb", totalRevenue: 840 },
                        { month: "Mar", totalRevenue: 1015 },
                        { month: "Apr", totalRevenue: 1148 },
                        { month: "May", totalRevenue: 1264 },
                ],

                fleet: [],
                booking: [],
                billingHistory: [],
                damageReports: [],
                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },

        {
                id: "elevate-auto-667234",
                organisation: {
                        name: "Elevate Auto",
                        email: "fleet@elevateauto.io",
                },
                plan: "fleet",
                vehicles: 55,
                status: "active",
                totalEarning: 6600,
                dateJoined: "3rd June, 2023",
                slug: "elevate-auto",

                activeBookings: 20,
                monthlyRevenue: 810,

                revenue: [
                        { month: "Jan", totalRevenue: 4210 },
                        { month: "Feb", totalRevenue: 4880 },
                        { month: "Mar", totalRevenue: 5420 },
                        { month: "Apr", totalRevenue: 6010 },
                        { month: "May", totalRevenue: 6600 },
                ],

                fleet: [
                        {
                                id: "VEH-9902",
                                vehicleName: "2024 Audi Q5",
                                status: "rented",
                                dailyRate: 142,
                                lastBookings: "May 05, 2026",
                                plateNumber: "ELA-2209",
                                transmission: "Automatic",
                                bodyType: "SUV",
                        },
                ],

                booking: [],
                billingHistory: [],
                damageReports: [],
                reimbursementRequests: [
                        {
                                name: "Cleaning Reimbursement",
                                submittedDate: "Apr 07, 2026",
                                totalCost: 56.70,
                                status: "pending",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Refuel Reimbursement",
                                submittedDate: "Jan 12, 2026",
                                totalCost: 250,
                                status: "approved",
                                description:
                                        "Interior deep cleaning after extended rental.",
                        },
                        {
                                name: "Damage Fix Reimbursement",
                                submittedDate: "Dec 31, 2025",
                                totalCost: 700,
                                status: "declined",
                                description:
                                        "",
                        },
                ],
        },
]