import { ProofFile } from "@/components/hostComponents/forms/bookingsPageDamageReportform";

export type TimelineEvent =
        | { completed: true; date: string; time: string }
        | { completed: false; date?: undefined; time?: undefined };

export interface ExtraItem {
        title: string;
        pricingRate: string;
        duration: string;
        value: string; 
        totalfee: string;
}

export type CheckType = "checkIn" | "checkOut";

export type PreCheckStatusType = "verified" | "pending" | "notVerified";

export interface CheckRecord {
        checkedDateTime: string;
        bookingId: string;
        checkType: "checkIn" | "checkOut";
        mileage: string;
        fuelLevel: string;
        condition: string;
        notes?: string;
}

export interface RenterInfo {
        renterFullname: string;
        renterPhone: string;
        renterEmail: string;
        renterLicenseNumber: string;
}

export interface VehicleInfo {
        vechicleId: string;
        vehicleGearType: string;
        vehicleImageSrc: string;
        vehicleName: string;
        vehiclePlateNumber: string;
        vehicleType: string;
}

export interface TripInfo {
        PickUpDateTime: string;
        ReturnDateTime: string;
        PickUpLocation: string;
        ReturnLocation: string;
}

export interface BookingSummaryInfo {
        totalPaidByRenter: string;
        platformCommission: string;
        netToHost: string;
}

export interface PreCheckStatusInfo {
        driverLicenseStatus: PreCheckStatusType;
        insuranceStatus: PreCheckStatusType;
        paymentStatus: PreCheckStatusType;
}

export type PaymentStatusType = "paid" | "pending" | "refunded" | "failed";

export interface PaymentInfo {
        paymentStatus: PaymentStatusType;
        totalPaidByRenter: string;
        paymentDate: string;
        paymentReciptSrc: string;
        refund: boolean;
        refundAmount: string;
        cancellationFeeAppliedDate: string;
}

export interface DamageReportInfo {
        damageType: string;
        damageUserFullname: string;
        description: string;
        uploadedProof: ProofFile[];
        isAcknowledged?: boolean;
}

export interface IncidentalInfo {
        incidentType: string;
        incidentDecription: string;
        incidentFee: string;
        incidentImages?: string[];
}

type ReimbursementStatusType = "approved" | "pending" | "rejected";

export interface ReimbursementInfo {
        reimbursementType: string;
        reimbursementDescription: string;
        reimbursementAmount: string;
        reimbursementRequestedDate: string;
        reimbursementProcessedDate?: string;
        reimbursementStatus: ReimbursementStatusType;
}

export interface NoShowInfo {
        pickUpDate: string;
        pickUpTime: string;
}

// Shared prop contract every status page component must satisfy,
// so they can all live in the same lookup map with full type safety.
export interface BookingPageProps {
        id: string;
        extras: ExtraItem[];
        checkIn?: CheckRecord & { checkType: "checkIn" };
        checkOut?: CheckRecord & { checkType: "checkOut" };
        bookingCreated: TimelineEvent;
        checkInCompleted: TimelineEvent;
        checkOutCompleted: TimelineEvent;
        renter: RenterInfo;
        vehicle: VehicleInfo;
        trip: TripInfo;
        bookingSummary: BookingSummaryInfo;
        payment: PaymentInfo;
        preCheckStatus: PreCheckStatusInfo;
        damageReport: DamageReportInfo;
        incident: IncidentalInfo;
        reimbursement: ReimbursementInfo;
        onAcknowledge: () => void | Promise<void>;
        noShow: NoShowInfo;
}