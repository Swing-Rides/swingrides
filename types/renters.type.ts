export type AdminRenterDataStatus = "verified" | "pending" | "rejected";

export type RenterVerificationDocumentStatus = "pending" | "verified" | "rejected";

export type CarBookingStatus = "upcoming" | "active" | "completed" | "cancelled" | "confirmed";


export interface IRentersResponse {
        success: boolean;
        data: AdminRenterData;
}

export interface AdminRenterData {
        summary:    Summary;
        pagination: Pagination;
        rows:       AdminRenterDataRow[];
}

export interface Pagination {
        page:       number;
        limit:      number;
        total:      number;
        totalPages: number;
}

export interface AdminRenterDataRow {
        id:                  string;
        name:                string;
        email:               string;
        phone:               string;
        totalBookings:       number;
        totalSpent:          number;
        totalSpentFormatted: string;
        status:              AdminRenterDataStatus;
        joinedDate:          string;
        document?: {
                imageUrl:    string;
                type:        string;
                submittedDate: string;
        }
}

export interface Summary {
        totalRegisteredRenters: number;
        verifiedRenters:        number;
        pendingVerifications:   number;
        newlyPendingThisMonth:  number;
}

export interface AdminVerificationPendingRenterResponse {
        success: boolean;
        data:    AdminVerificationPendingRenterData;
}

export interface AdminVerificationPendingRenterData {
        pagination: Pagination;
        queue:      AdminVerificationPendingRenterRow[];
}

export interface Pagination {
        page:       number;
        limit:      number;
        total:      number;
        totalPages: number;
}

export interface AdminVerificationPendingRenterRow {
        id:           string;
        name:         string;
        email:        string;
        phone:        string;
        documentType: string;
        submittedAt:  string;
        documentUrl:  string;
        status:       AdminRenterDataStatus;
}

export interface AdminRenterByIdResponse {
        success: boolean
        data: AdminRenterByIdData
}

export interface AdminRenterByIdData {
        renter: AdminRenterByIdResponseRenter
        stats: AdminRenterByIdResponseStats
        verification: AdminRenterByIdResponseVerification
        bookings: AdminRenterByIdResponseBookings
        documents: AdminRenterByIdResponseDocuments[]
}

export interface AdminRenterByIdResponseRenter {
        id: string
        firstName: string
        lastName: string
        name: string
        email: string
        phone: string
        isActive: boolean
        joinedDate: string
        lastLogin: string
}

export interface AdminRenterByIdResponseStats {
        totalBookings: number
        totalSpent: number
        totalSpentFormatted: string
        averageBookingValue: number
}

export interface AdminRenterByIdResponseVerification {
        status: AdminRenterDataStatus
        documentType: string
        documentUrl: string
        submittedAt: string
        reviewedAt: string
        notes: string | null
}

export interface AdminRenterByIdResponseDocuments {
        type: string
        uploadedAt: string
        status: RenterVerificationDocumentStatus
        url: string
}

export interface AdminRenterByIdResponseBookings {
        pagination: Pagination
        rows: AdminRenterByIdResponseBookingsRow[]
}

export interface AdminRenterByIdResponseBookingsRow {
        bookingRef: string
        vehicleName: string
        hostOrganisation: string
        pickupDate: string
        returnDate: string
        amount: number
        amountFormatted: string
        status: CarBookingStatus
        bookingType: string
}