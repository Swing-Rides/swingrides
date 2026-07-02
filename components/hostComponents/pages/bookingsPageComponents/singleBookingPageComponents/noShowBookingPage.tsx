import { 
        AddonAndExtraCard, 
        BookingPageWrapper, 
        BookingSummaryCard, 
        BookingTimeline, 
        NoShowCard, 
        PaymentStatusCard, 
        RenterCard, 
        TripCard, 
        VehicleCard } from "./bookingCards";
import { BookingPageProps } from "./types";

export default function NoShowBookingPage({
        extras,
        bookingCreated,
        checkInCompleted,
        checkOutCompleted,
        renter,
        vehicle,
        trip,
        bookingSummary,
        payment,
        noShow,
}: BookingPageProps) {
        return (
                <BookingPageWrapper
                        leftComponents={
                                <div className="space-y-4">
                                        <NoShowCard
                                                pickUpDate={noShow.pickUpDate}
                                                pickUpTime={noShow.pickUpTime}
                                        />
                                        <RenterCard
                                                renterFullname={renter.renterFullname}
                                                renterPhone={renter.renterPhone}
                                                renterEmail={renter.renterEmail}
                                                renterLicenseNumber={renter.renterLicenseNumber}
                                        />
                                        <VehicleCard
                                                vechicleId={vehicle.vechicleId}
                                                vehicleGearType={vehicle.vehicleGearType}
                                                vehicleImageSrc={vehicle.vehicleImageSrc}
                                                vehicleName={vehicle.vehicleName}
                                                vehiclePlateNumber={vehicle.vehiclePlateNumber}
                                                vehicleType={vehicle.vehicleType}
                                        />
                                        <TripCard
                                                PickUpDateTime={trip.PickUpDateTime}
                                                ReturnDateTime={trip.ReturnDateTime}
                                                PickUpLocation={trip.PickUpLocation}
                                                ReturnLocation={trip.ReturnLocation}
                                        />
                                        <AddonAndExtraCard
                                                extras={extras}
                                        />
                                </div>
                        }
                        rightComponents={
                                <div className="space-y-4">
                                        <BookingSummaryCard
                                                totalPaidByRenter={bookingSummary.totalPaidByRenter}
                                                platformCommission={bookingSummary.platformCommission}
                                                netToHost={bookingSummary.netToHost}
                                        />
                                        <PaymentStatusCard
                                                paymentStatus={payment.paymentStatus}
                                                totalPaidByRenter={payment.totalPaidByRenter}
                                                paymentDate={payment.paymentDate}
                                                paymentReciptSrc={payment.paymentReciptSrc}
                                                refund={payment.refund}
                                                refundAmount={payment.refundAmount}
                                                cancellationFeeAppliedDate={payment.cancellationFeeAppliedDate}
                                        />
                                        <BookingTimeline
                                                bookingCreated={bookingCreated}
                                                checkInCompleted={checkInCompleted}
                                                checkOutCompleted={checkOutCompleted}
                                        />
                                </div>
                        }
                />
        )
}