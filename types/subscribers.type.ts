export interface ISubscribersResponse {
        success: boolean
        data: AdminSubscribersListData
}

export interface AdminSubscribersListData {
        summary: AdminSubscribersSummary
        filters: AdminSubscribersFilters
        pagination: AdminSubscribersPagination
        rows: AdminSubscriberRow[]
}

export interface AdminSubscribersSummary {
        totalSubscribers: number
        activeSubscribers: number
        churnedThisMonth: number
}

export interface AdminSubscribersFilters {
        search: string
        status: SubscriberStatus
        plan: SubscriberPlan
}

export type SubscriberStatus = "active" | "past due" | "cancelled" | "suspended"
export type SubscriberBillingStatus = "paid" | "failed" | "pending" | "refunded"
export type SubscriberPlan = "enterprise" | "professional" | "starter"
export type FleetStatus =
        | "available"
        | "rented"
        | "unlisted"
        | "maintenance"
        | "active"
        | "inactive"
export type BookingStatus =
        | "upcoming"
        | "active"
        | "completed"
        | "cancelled"
export type BillingStatus = "successful" | "pending" | "failed" | "paid" | "unpaid" | "overdue"


export interface AdminSubscribersPagination {
        page: number
        limit: number
        total: number
        totalPages: number
}

export interface AdminSubscriberRow {
        id: string
        organization: string
        ownerEmail: string
        plan: string
        vehicles: number
        status: SubscriberStatus
        monthlyRevenue: number
        monthlyRevenueFormatted: string
        joinedDate: string
}

export interface AdminISubscriberByIdResponse {
        success: boolean
        data: AdminSubscriberByIdData
}

export interface AdminSubscriberByIdData {
        subscriber: AdminSubscriberByIdDataSubscriber
        actions: AdminSubscriberByIdDataActions
        stats: AdminSubscriberByIdDataStats
        trend: AdminSubscriberByIdDataTrend
        subscriberDistribution: AdminSubscriberByIdDataSubscriberDistribution[]
        fleet: AdminSubscriberByIdDataFleet[]
        billingHistory: AdminSubscriberByIdDataBillingHistory[]
        activityLog: AdminSubscriberByIdDataActivityLog[]
        dataCoverage: AdminSubscriberByIdDataDataCoverage
}

export interface AdminSubscriberByIdDataSubscriber {
        id: string
        organization: string
        ownerName: string
        ownerEmail: string
        status: SubscriberStatus
        plan: SubscriberPlan
        joinedDate: string
}

export interface AdminSubscriberByIdDataActions {
        canSuspend: boolean
        canUpgradePlan: boolean
}

export interface AdminSubscriberByIdDataStats {
        totalVehicles: number
        activeBookings: number
        monthlyRevenueMrr: number
        totalRevenue: number
}

export interface AdminSubscriberByIdDataTrend {
        range: string
        data: {
                key: string
                month: string
                revenue: number
                bookings: number
        } []
}

export interface AdminSubscriberByIdDataSubscriberDistribution {
        plan: string
        count: number
        percentage: number
}

export interface AdminSubscriberByIdDataFleet {
        id: string
        fleetId: string
        vehicleName: string
        status: FleetStatus
        dailyRate: number
        lastBooking: string
}

export interface AdminSubscriberByIdDataBillingHistory {
        id: string
        invoiceNumber: string
        amount: number
        status: BillingStatus
        createdAt: string
        vehicleName: string
}

export interface AdminSubscriberByIdDataActivityLog {
        time: string
        eventType: string
        details: string
        action: string
}

export interface AdminSubscriberByIdDataDataCoverage {
        linkedVehicles: number
        linkedInvoices: number
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