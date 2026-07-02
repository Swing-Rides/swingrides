"use client"

import { ComponentType } from "react";
import PageHeader from "./pageHeader";
import ActiveBookingPage from "./activeBookingPage";
import ReservedBookingPage from "./reservedBookingPage";
import ConfirmedBookingPage from "./confirmedBookingPage";
import CompletedBookingPage from "./completedBookingPage";
import NoShowBookingPage from "./noShowBookingPage";
import CancelledBookingPage from "./cancelledBookingPage";

//CHECK HERE TO SEE THE EXPECTED DATA STRUCTURE AND TYPES
import { BookingPageProps } from "./types";

//FEEL FREE TO DISABLE THIS TO REMOVE THE MOCK DATA
import {
        extras,
        checkIn,
        checkOut,
        bookingCreated,
        checkInCompleted,
        checkOutCompleted,
        renter,
        vehicle,
        trip,
        bookingSummary,
        payment,
        preCheckStatus,
        damageReport,
        incident,
        reimbursement,
        noShow
 } from "@/constants/hostBookingPage";

type SingleBookingPageComponentProps = {
        id: string;
}

type BookingStatusTypes = "active" | "reserved" | "confirmed" | "completed" | "noShow" | "cancelled";

const BookingPageMap: Record<BookingStatusTypes, ComponentType<BookingPageProps>> = {
        active: ActiveBookingPage,
        reserved: ReservedBookingPage,
        confirmed: ConfirmedBookingPage,
        completed: CompletedBookingPage,
        noShow: NoShowBookingPage,
        cancelled: CancelledBookingPage,
}

export default function SingleBookingPageComponent({ id }: SingleBookingPageComponentProps) {

        const status: BookingStatusTypes = "completed"

        const handleDamageReportAcknowledge = async () => {
                // TODO: replace with real API call
                // await fetch(`/api/damage-reports/${reportId}/acknowledge`, { method: 'POST' })
                console.log('damage report acknowledged')
        }

        const GetMappedComponent = BookingPageMap[status];

        return (
                <main className='p-3 md:p-8 space-y-4 md:space-y-8'>
                        <PageHeader
                                id={id}
                                status={status}
                                handleEditBooking={() => console.log("edit")}
                        />
                        <GetMappedComponent
                                id={id}
                                extras={extras}
                                checkIn={checkIn}
                                checkOut={checkOut}
                                bookingCreated={bookingCreated}
                                checkInCompleted={checkInCompleted}
                                checkOutCompleted={checkOutCompleted}
                                renter={renter}
                                vehicle={vehicle}
                                trip={trip}
                                bookingSummary={bookingSummary}
                                payment={payment}
                                preCheckStatus={preCheckStatus} 
                                damageReport={damageReport}
                                incident={incident}
                                reimbursement={reimbursement}
                                onAcknowledge={handleDamageReportAcknowledge}
                                noShow={noShow}
                        />
                </main>
        )
}