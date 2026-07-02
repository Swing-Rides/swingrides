"use client"

import { ComponentType } from "react";
import PageHeader from "./pageHeader";
import ActiveBookingPage from "./activeBookingPage";
import ReservedBookingPage from "./reservedBookingPage";
import ConfirmedBookingPage from "./confirmedBookingPage";
import CompletedBookingPage from "./completedBookingPage";
import NoShowBookingPage from "./noShowBookingPage";
import CancelledBookingPage from "./cancelledBookingPage";
import { BookingPageProps } from "./types";

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

        // TODO: replace with real data fetched via `id`
        const extras = [
                { title: "Child Seat", pricingRate: "5000/day", duration: "7 days", value: "1", totalfee: "35000" },
                { title: "Extra Mileage (100km)", pricingRate: "8000", duration: "one-time", value: "1", totalfee: "8000" },
        ];

        const checkIn = {
                checkedDateTime: "2026-06-28T09:15:00",
                bookingId: id,
                checkType: "checkIn" as const,
                mileage: "24500",
                fuelLevel: "Full",
                condition: "Good — minor scratch on rear bumper",
                notes: "Renter confirmed no pre-existing damage beyond noted scratch.",
        };

        // const checkOut = undefined;
        const checkOut = {
                checkedDateTime: "2026-07-05T17:40:00",
                bookingId: id,
                checkType: "checkOut" as const,
                mileage: "25120",
                fuelLevel: "3/4",
                condition: "Fair — new scuff on front bumper, dent on rear-left door",
                notes: "Damage noted beyond original scratch; flagged for review.",
        };

        const bookingCreated = { completed: true as const, date: "Jun 25, 2026", time: "11:42 AM" };
        const checkInCompleted = { completed: true as const, date: "Jun 28, 2026", time: "9:15 AM" };
        // const checkOutCompleted = { completed: false as const };
        const checkOutCompleted = { completed: true as const, date: "Jul 5, 2026", time: "5:40 PM" };

        const renter = {
                renterFullname: "Mill Jason",
                renterPhone: "+234 803 555 0192",
                renterEmail: "mill.jason@example.com",
                renterLicenseNumber: "LAG-DL-2291847",
        };

        const vehicle = {
                vechicleId: "VH-10432",
                vehicleGearType: "Automatic",
                vehicleImageSrc: "/images/swingrides-default-img.webp",
                vehicleName: "Toyota Camry 2022",
                vehiclePlateNumber: "LSD 452 KJ",
                vehicleType: "Sedan",
        };

        const trip = {
                PickUpDateTime: "2026-06-28T09:00:00",
                ReturnDateTime: "2026-07-05T18:00:00",
                PickUpLocation: "Airport, New York City",
                ReturnLocation: "Airport, New York City",
        };

        const bookingSummary = {
                totalPaidByRenter: "$185,000",
                platformCommission: "$27,750",
                netToHost: "$157,250",
        };

        const payment = {
                paymentStatus: "paid" as const,
                totalPaidByRenter: "$185000",
                paymentDate: "2026-06-25T11:45:00",
                paymentReciptSrc: "/receipts/booking-10432.pdf",
                refund: true,
                refundAmount: "0",
                cancellationFeeAppliedDate: "",
        };

        const preCheckStatus = {
                driverLicenseStatus: "notVerified" as const,
                insuranceStatus: "pending" as const,
                paymentStatus: "verified" as const,
        };

        const damageReport = {
                description: 'Deep scratch along the rear bumper, approximately 30cm. Paint removed down to primer.',
                uploadedProof: [
                        { id: 'proof_001', name: 'damage-front-bumper.webp', url: '/images/host/damage-front-bumper.webp', type: 'image' as const },
                        { id: 'proof_002', name: 'damage-side-panel', url: '/images/host/damage-side-panel.jpeg', type: 'image' as const },
                        { id: 'proof_003', name: 'incident-report.pdf', url: '/docs/incident-report.pdf', type: 'pdf' as const },
                ],
                isAcknowledged: false,
                damageType: "Rear-left door dent, front bumper scuff",
                damageUserFullname: "Adaeze Okonkwo",
        };

        const handleDamageReportAcknowledge = async () => {
                // TODO: replace with real API call
                // await fetch(`/api/damage-reports/${reportId}/acknowledge`, { method: 'POST' })
                console.log('damage report acknowledged')
        }

        const incident = {
                incidentType: "Minor collision damage",
                incidentDecription: "Renter reported clipping a curb while parking; dent and scuff noted at check-out inspection.",
                incidentFee: "$45,000",
                incidentImages: ["/images/host/damage-front-bumper.webp", "/images/host/damage-side-panel.jpeg"],
        };

        const reimbursement = {
                reimbursementType: "Damage repair cost",
                reimbursementDescription: "Cost of bumper repair and door dent removal charged to renter's deposit.",
                reimbursementAmount: "$45,000",
                reimbursementRequestedDate: "2026-07-06T10:00:00",
                reimbursementProcessedDate: "2026-07-08T14:30:00",
                reimbursementStatus: "approved" as const,
        };

        const noShow = {
                pickUpDate: "Mar 14, 2026",
                pickUpTime: "12:00 PM",
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