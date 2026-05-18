import { RenterStatus } from "@/constants/renterTestData";
import { ReimbursementRequestsStatus, MaintenanceStatusType, BookingPaymentStatusType } from "@/constants/superAdminSidebar";
import { CarBookingStatus, RenterVerificationDocumentStatus } from "@/types/renters.type";
import { SubscriberPlan, SubscriberStatus, FleetStatus, BookingStatus, BillingStatus, SubscriberBillingStatus } from "@/types/subscribers.type";

export type AdminUsersRoleType = 'super admin' | 'admin' | 'support';
export type AdminUsersStatusType = 'active' | 'suspended' | 'invited';

export const plansItems: { value: SubscriberPlan; label: string }[] = [
        { value: 'enterprise', label: 'Enterprise' },
        { value: 'professional', label: 'Professional' },
        { value: 'starter', label: 'Starter' },
]

export const statusItems: { value: SubscriberStatus; label: string }[] = [
        { value: 'active', label: 'Active' },
        { value: 'past due', label: 'Past Due' },
        { value: 'cancelled', label: 'Cancelled' },
]

export const adminUsersRoleItems: { value: AdminUsersRoleType; label: string }[] = [
        { value: 'super admin', label: 'Super Admin' },
        { value: 'admin', label: 'Admin' },
        { value: 'support', label: 'Support' },
]

export const adminUsersStatusItems: { value: AdminUsersStatusType; label: string }[] = [
        { value: 'active', label: 'Active' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'invited', label: 'Invited' },
]

export const renterStatusItems: { value: RenterStatus; label: string }[] = [
        { value: 'pending', label: 'Pending' },
        { value: 'verified', label: 'Verified' },
        { value: 'rejected', label: 'Rejected' },
]

export const SUBSCRIPTION_PLAN_STYLE: Record<SubscriberPlan, { label: string; textColor: string; bgColor: string }> = {
        'starter': { label: 'Starter', textColor: '#3B82F6', bgColor: '#E3EEFF' },
        'professional': { label: 'Professional', textColor: '#92400E', bgColor: '#FEF3C7' },
        'enterprise': { label: 'Enterprise', textColor: '#3B82F6', bgColor: '#000000' },
}

export const SUBSCRIPTION_BILLING_STATUS_STYLE: Record<SubscriberBillingStatus, { label: string; textColor: string; bgColor: string }> = {
        'paid': { label: 'Paid', textColor: '#10B981', bgColor: '#DAFFF3' },
        'pending': { label: 'Pending', textColor: '#F59E0B', bgColor: '#FFF7E9' },
        'failed': { label: 'Failed', textColor: '#EF4444', bgColor: '#FFE9E9' },
        'refunded': { label: 'Refunded', textColor: '#6B7280', bgColor: '#E5E7EB' },
}

export const STATUS_STYLE: Record<SubscriberStatus, { label: string; textColor: string; bgColor: string }> = {
        'active': { label: 'Active', textColor: '#10B981', bgColor: '#DAFFF3' },
        'past due': { label: 'Past Due', textColor: '#EF4444', bgColor: '#FFE9E9' },
        'cancelled': { label: 'Cancelled', textColor: '#6B7280', bgColor: '#FFFFFF' },
        'suspended': { label: 'Suspended', textColor: '#F59E0B', bgColor: '#FFF6E7' },
}

export const FLEET_STATUS_STYLE: Record<FleetStatus, { label: string; textColor: string; bgColor: string }> = {
        'available': { label: 'Available', textColor: '#10B981', bgColor: '#DAFFF3' },
        'rented': { label: 'Rented', textColor: '#F59E0B', bgColor: '#FEF3C7' },
        'unlisted': { label: 'Unlisted', textColor: '#6B7280', bgColor: '#F4F6F9' },
        'maintenance': { label: 'Maintenance', textColor: '#EF4444', bgColor: '#FEE2E2' },
        'active': { label: 'Active', textColor: '#10B981', bgColor: '#DAFFF3' }, 
        'inactive': { label: 'Inactive', textColor: '#6B7280', bgColor: '#F4F6F9' },
}

export const BOOKING_STATUS_STYLE: Record<BookingStatus, { label: string; textColor: string; bgColor: string }> = {
        "upcoming": { label: "Upcoming", textColor: "#1A56DB", bgColor: "#E3EEFF" },
        "active": { label: "Active", textColor: "#10B981", bgColor: "#DAFFF3" },
        "completed": { label: "Completed", textColor: "#1A56DB", bgColor: "#EBF0FB" },
        "cancelled": { label: "Cancelled", textColor: "#EF4444", bgColor: "#FFE9E9" },
}

export const BILLING_STATUS_STYLE: Record<BillingStatus, { label: string; textColor: string; bgColor: string }> = {
        "successful": { label: "Successful", textColor: "#10B981", bgColor: "#DAFFF3" },
        "pending": { label: "Pending", textColor: "#F59E0B", bgColor: "#FFF6E7" },
        "failed": { label: "Failed", textColor: "#EF4444", bgColor: "#FFE9E9" },
        'paid': { label: 'Paid', textColor: '#065F46', bgColor: '#D1FAE5' },
        'unpaid': { label: 'Unpaid', textColor: '#EF4444', bgColor: '#FFE9E9' },
        'overdue': { label: 'Overdue', textColor: '#ffffff', bgColor: '#EF4444' },
}

export const DAMAGE_STATUS_STYLE: Record<ReimbursementRequestsStatus, { label: string; textColor: string; bgColor: string }> = {
        "approved": { label: "Approved", textColor: "#10B981", bgColor: "#DAFFF3" },
        "pending": { label: "Pending", textColor: "#F59E0B", bgColor: "#FFF6E7" },
        "declined": { label: "Declined", textColor: "#EF4444", bgColor: "#FFE9E9" },
}

export const REIMBURSEMENT_STATUS_STYLE: Record<ReimbursementRequestsStatus, { label: string; textColor: string; bgColor: string }> = {
        "approved": { label: "Approved", textColor: "#10B981", bgColor: "#DAFFF3" },
        "pending": { label: "Pending", textColor: "#F59E0B", bgColor: "#FFF6E7" },
        "declined": { label: "Declined", textColor: "#EF4444", bgColor: "#FFE9E9" },
}

export const MAINTENANCE_STATUS_STYLE: Record<MaintenanceStatusType, { label: string; textColor: string; bgColor: string }> = {
        "overdue": { label: "Overdue", textColor: "#ffffff", bgColor: "#EF4444" },
        "due soon": { label: "Due Soon", textColor: "#ffffff", bgColor: "#F59E0B" },
        "upcoming": { label: "Upcoming", textColor: "#ffffff", bgColor: "#1A56DB" },
        "up to date": { label: "Up to Date", textColor: "#065F46", bgColor: "#D1FAE5" },
}

export const BOOKING_PAYMENT_STATUS_STYLE: Record<BookingPaymentStatusType, { label: string; textColor: string; bgColor: string }> = {
        "declined": { label: "DECLINED", textColor: "#ffffff", bgColor: "#EF4444" },
        "pending": { label: "PENDING", textColor: "#ffffff", bgColor: "#F59E0B" },
        "paid": { label: "PAID", textColor: "#065F46", bgColor: "#D1FAE5" },
}

export const RENTER_STATUS_STYLE: Record<RenterStatus, { label: string; textColor: string; bgColor: string }> = {
        "rejected": { label: "Rejected", textColor: "#ffffff", bgColor: "#EF4444" },
        "pending": { label: "Pending", textColor: "#ffffff", bgColor: "#F59E0B" },
        "verified": { label: "Verified", textColor: "#065F46", bgColor: "#D1FAE5" },
}

export const RENTER_VERIFICATION_STATUS_STYLE: Record<RenterVerificationDocumentStatus, { label: string; textColor: string; bgColor: string }> = {
        "rejected": { label: "Rejected", textColor: "#ffffff", bgColor: "#EF4444" },
        "pending": { label: "Pending", textColor: "#ffffff", bgColor: "#F59E0B" },
        "verified": { label: "Verified", textColor: "#065F46", bgColor: "#D1FAE5" },
}

export const CAR_BOOKING_STATUS_STYLE: Record<CarBookingStatus, { label: string; textColor: string; bgColor: string }> = {
        "upcoming": { label: "Upcoming", textColor: "#3B82F6", bgColor: "#E3EEFF" },
        "active": { label: "Active", textColor: "#10B981", bgColor: "#DAFFF3" },
        "completed": { label: "Completed", textColor: "#6B7280", bgColor: "#E5E7EB" },
        "cancelled": { label: "Cancelled", textColor: "#EF4444", bgColor: "#FFE9E9" },
        "confirmed": { label: "Confirmed", textColor: "#6B7280", bgColor: "#E5E7EB" },
}