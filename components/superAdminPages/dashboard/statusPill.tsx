import { BookingPaymentStatusType, MaintenanceStatusType, SubscriberPlan } from "@/constants/superAdminSidebar";
import { ADMIN_TICKET_STATUS_STYLE, ADMIN_USER_ROLE_STYLE, ADMIN_USER_STATUS_STYLE, ADMIN_USER_TYPE_STYLE, AdminTicketStatusItemsType, AdminUsersRoleType, AdminUsersStatusType, AdminUserTypeItemsType, BOOKING_PAYMENT_STATUS_STYLE, CAR_BOOKING_STATUS_STYLE, MAINTENANCE_STATUS_STYLE, RENTER_STATUS_STYLE, RENTER_VERIFICATION_STATUS_STYLE, SUBSCRIPTION_BILLING_STATUS_STYLE, SUBSCRIPTION_PLAN_STYLE } from "../utils/helpers";
import { RenterStatus } from "@/constants/renterTestData";
import { CarBookingStatus, RenterVerificationDocumentStatus } from "@/types/renters.type";
import { SubscriberBillingStatus } from "@/types/subscribers.type";

type MaintenanceStatusPillProps = {
        status: MaintenanceStatusType
}

type SubscriptionPlanPillProps = {
        status: SubscriberPlan
}

type SubscriptionBillingStatusPillProps = {
        status: SubscriberBillingStatus
}

type BookingPaymentPillProps = {
        status: BookingPaymentStatusType
}

type RenterStatusPillProps = {
        status: RenterStatus
}

type RenterVerificationStatusPillProps = {
        status: RenterVerificationDocumentStatus
}

type CarBookingStatusProps = {
        status: CarBookingStatus
}

export const MaintenanceStatusPill = ({ status }: MaintenanceStatusPillProps ) => {

        const styleMap = MAINTENANCE_STATUS_STYLE
        const normalizedStatus = status.toLowerCase()

        const { label, textColor, bgColor } = (styleMap as Record<string, { label: string; textColor: string; bgColor: string }>)[normalizedStatus]

        return (
                <span
                        className="py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4"
                        style={{ color: textColor, backgroundColor: bgColor }}
                >
                        {label}
                </span>
        )
}

export const SubscriptionPlanPill = ({ status }: SubscriptionPlanPillProps ) => {

        const styleMap = SUBSCRIPTION_PLAN_STYLE
        const normalizedStatus = status.toLowerCase()

        const { label, textColor, bgColor } = (styleMap as Record<string, { label: string; textColor: string; bgColor: string }>)[normalizedStatus]

        return (
                <span
                        className="py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4"
                        style={{ color: textColor, backgroundColor: bgColor }}
                >
                        {label}
                </span>
        )
}

export const SubscriptionBillingStatusPill = ({ status }: SubscriptionBillingStatusPillProps ) => {

        const styleMap = SUBSCRIPTION_BILLING_STATUS_STYLE
        const normalizedStatus = status.toLowerCase() as SubscriberBillingStatus

        const { label, textColor, bgColor } = (styleMap as Record<string, { label: string; textColor: string; bgColor: string }>)[normalizedStatus]

        return (
                <span
                        className="py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4"
                        style={{ color: textColor, backgroundColor: bgColor }}
                >
                        {label}
                </span>
        )
}

export const BookingPaymentPill = ({ status }: BookingPaymentPillProps ) => {

        const styleMap = BOOKING_PAYMENT_STATUS_STYLE
        const normalizedStatus = status.toLowerCase()

        const { label, textColor, bgColor } = (styleMap as Record<string, { label: string; textColor: string; bgColor: string }>)[normalizedStatus]

        return (
                <span
                        className="py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4"
                        style={{ color: textColor, backgroundColor: bgColor }}
                >
                        {label}
                </span>
        )
}

export const RenterStatusPill = ({ status }: RenterStatusPillProps ) => {

        const styleMap = RENTER_STATUS_STYLE
        const normalizedStatus = status.toLowerCase() as RenterStatus

        const style = (styleMap as Record<string, { label: string; textColor: string; bgColor: string }>)[normalizedStatus]

        if (!style) return <span className="text-xs text-gray-400">{status}</span>

        const { label, textColor, bgColor } = style

        return (
                <span
                        className="py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4"
                        style={{ color: textColor, backgroundColor: bgColor }}
                >
                        {label}
                </span>
        )
}

export const RenterVerificationStatusPill = ({ status }: RenterVerificationStatusPillProps ) => {

        const styleMap = RENTER_VERIFICATION_STATUS_STYLE
        const normalizedStatus = status.toLowerCase() as RenterVerificationDocumentStatus

        const style = (styleMap as Record<string, { label: string; textColor: string; bgColor: string }>)[normalizedStatus]

        if (!style) return <span className="text-xs bg-black text-gray-400">{status}</span>

        const { label, textColor, bgColor } = style

        return (
                <span
                        className="py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4"
                        style={{ color: textColor, backgroundColor: bgColor }}
                >
                        {label}
                </span>
        )
}

export const CarBookingStatusPill = ({ status }: CarBookingStatusProps) => {

        const styleMap = CAR_BOOKING_STATUS_STYLE
        const normalizedStatus = status.toLowerCase() as CarBookingStatus

        const style = (styleMap as Record<string, { label: string; textColor: string; bgColor: string }>)[normalizedStatus]

        if (!style) return <span className="text-xs bg-black text-gray-400">{status}</span>

        const { label, textColor, bgColor } = style

        return (
                <span
                        className="py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4"
                        style={{ color: textColor, backgroundColor: bgColor }}
                >
                        {label}
                </span>
        )       
}

export const AdminUsersRolePill = ({ status }: { status: AdminUsersRoleType }) => {

        const styleMap = ADMIN_USER_ROLE_STYLE
        const normalizedStatus = status.toLowerCase() as AdminUsersRoleType

        const style = (styleMap as Record<string, { label: string; textColor: string; bgColor: string }>)[normalizedStatus]

        if (!style) return <span className="text-xs bg-black text-gray-400">{status}</span>

        const { label, textColor, bgColor } = style

        return (
                <span
                        className="py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4"
                        style={{ color: textColor, backgroundColor: bgColor }}
                >
                        {label}
                </span>
        )       
}

export const AdminUsersStatusPill = ({ status }: { status: AdminUsersStatusType }) => {

        const styleMap = ADMIN_USER_STATUS_STYLE
        const normalizedStatus = status.toLowerCase() as AdminUsersStatusType

        const style = (styleMap as Record<string, { label: string; textColor: string; bgColor: string }>)[normalizedStatus]

        if (!style) return <span className="text-xs bg-black text-gray-400">{status}</span>

        const { label, textColor, bgColor } = style

        return (
                <span
                        className="py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4"
                        style={{ color: textColor, backgroundColor: bgColor }}
                >
                        {label}
                </span>
        )       
}

export const AdminTicketStatusPill = ({ status }: { status: AdminTicketStatusItemsType }) => {

        const styleMap = ADMIN_TICKET_STATUS_STYLE
        const normalizedStatus = status.toLowerCase() as AdminTicketStatusItemsType

        const style = (styleMap as Record<string, { label: string; textColor: string; bgColor: string }>)[normalizedStatus]

        if (!style) return <span className="text-xs bg-black text-gray-400">{status}</span>

        const { label, textColor, bgColor } = style

        return (
                <span
                        className="py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4"
                        style={{ color: textColor, backgroundColor: bgColor }}
                >
                        {label}
                </span>
        )       
}

export const AdminUserTypePill = ({ status }: { status: AdminUserTypeItemsType }) => {

        const styleMap = ADMIN_USER_TYPE_STYLE
        const normalizedStatus = status.toLowerCase() as AdminUserTypeItemsType

        const style = (styleMap as Record<string, { label: string; textColor: string; bgColor: string }>)[normalizedStatus]

        if (!style) return <span className="text-xs bg-black text-gray-400">{status}</span>

        const { label, textColor, bgColor } = style

        return (
                <span
                        className="py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4"
                        style={{ color: textColor, backgroundColor: bgColor }}
                >
                        {label}
                </span>
        )       
}