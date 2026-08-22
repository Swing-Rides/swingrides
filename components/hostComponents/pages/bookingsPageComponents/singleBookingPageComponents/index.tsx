"use client";

import { ComponentType, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  useGetBookingByIdQuery,
  useGetBookingByReferenceQuery,
  useAcknowledgeDamageReportMutation,
} from "@/app/store/services/bookingApi";
import PageHeader from "./pageHeader";
import ActiveBookingPage from "./activeBookingPage";
import ReservedBookingPage from "./reservedBookingPage";
import ConfirmedBookingPage from "./confirmedBookingPage";
import CompletedBookingPage from "./completedBookingPage";
import NoShowBookingPage from "./noShowBookingPage";
import CancelledBookingPage from "./cancelledBookingPage";
import { BookingsStatus } from "./types";

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
  noShow,
} from "@/constants/hostBookingPage";

type SingleBookingPageComponentProps = {
  id: string;
};

const BookingPageMap: Record<
  BookingsStatus,
  ComponentType<BookingPageProps>
> = {
  active: ActiveBookingPage,
  reserved: ReservedBookingPage,
  confirmed: ConfirmedBookingPage,
  runningLate: ConfirmedBookingPage,
  completed: CompletedBookingPage,
  overdue: NoShowBookingPage,
  cancelled: CancelledBookingPage,
};

export default function SingleBookingPageComponent({
  id,
}: SingleBookingPageComponentProps) {
  const isReferenceCode = /^SR-\d{4}-\d{4}$/i.test(id);
  const {
    data: bookingById,
    isLoading: isBookingByIdLoading,
    isError: isBookingByIdError,
  } = useGetBookingByIdQuery(id, { skip: isReferenceCode });
  const {
    data: bookingByReference,
    isLoading: isBookingByReferenceLoading,
    isError: isBookingByReferenceError,
  } = useGetBookingByReferenceQuery(id, { skip: !isReferenceCode });

  const booking = isReferenceCode ? bookingByReference?.data : bookingById?.data;

  const toBookingStatus = (apiStatus: string): BookingsStatus => {
    if (apiStatus === "pending") return "reserved";
    if (apiStatus === "confirmed") return "confirmed";
    if (apiStatus === "completed") return "completed";
    if (apiStatus === "cancelled") return "cancelled";
    // checked_in / in_progress always route to the active/checkout page -
    // "overdue"/"runningLate" here would render the no-show/pre-pickup pages,
    // which have no vehicle-return UI. A late return is still an active trip;
    // lateness is surfaced via the booking's displayStatus badge elsewhere.
    return "active";
  };

  const status: BookingsStatus = booking
    ? toBookingStatus(booking.status)
    : "reserved";

  const toCurrency = (value: number) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const getVehicleDetails = (details: string) => {
    const [plateNumber = "", vehicleType = "", gearType = ""] = details
      .split(" - ")
      .map((part) => part.trim());
    return { plateNumber, vehicleType, gearType };
  };

  const formatDateTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const vehicleDetails = booking
    ? getVehicleDetails(booking.vehicleDetails)
    : { plateNumber: "", vehicleType: "", gearType: "" };
  const checkInTimestamp = booking?.checkInCompletion?.completedAt || booking?.checkIn?.checkInTime;
  const checkOutTimestamp = booking?.checkOut?.completedAt;
  const hasValidCheckOutTimestamp = Boolean(
    checkOutTimestamp && !Number.isNaN(new Date(checkOutTimestamp).getTime()),
  );

  const bookingProps: BookingPageProps = useMemo(() => {
    return booking
      ? {
          id: booking.referenceCode,
          extras: booking.addOns.map((addon) => ({
            title: addon.name,
            pricingRate: `${toCurrency(addon.pricePerDay)}/day`,
            duration: "Booking duration",
            value: "1",
            totalfee: toCurrency(addon.pricePerDay),
          })),
          checkIn: booking.checkIn
            ? {
                checkedDateTime: formatDateTime(checkInTimestamp || booking.createdAt),
                bookingId: booking.referenceCode,
                checkType: "checkIn",
                mileage: String(booking.checkIn.odometerReading ?? ""),
                fuelLevel: String(booking.checkIn.fuelLevel ?? ""),
                condition: booking.checkIn.vehicleCondition?.damages?.join(", ") || "Good",
                notes: booking.checkIn.notes,
              }
            : undefined,
          checkOut: booking.checkOut
            ? {
                checkedDateTime: formatDateTime(booking.checkOut.completedAt),
                bookingId: booking.referenceCode,
                checkType: "checkOut",
                mileage: String(booking.checkOut.vehicleInspection.mileage),
                fuelLevel: booking.checkOut.vehicleInspection.fuelLevel,
                condition: booking.checkOut.vehicleInspection.damageStatus === "damage"
                  ? booking.checkOut.vehicleInspection.damageType || "Damage reported"
                  : "No damage reported",
                notes: booking.checkOut.vehicleInspection.damageDescription,
              }
            : undefined,
          bookingCreated: {
            completed: true,
            date: new Date(booking.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            time: new Date(booking.createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            }),
          },
          checkInCompleted: checkInTimestamp
            ? {
                completed: true,
                date: new Date(checkInTimestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                time: new Date(checkInTimestamp).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                }),
              }
            : { completed: false },
          checkOutCompleted: hasValidCheckOutTimestamp
            ? {
                completed: true,
                date: new Date(checkOutTimestamp!).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                time: new Date(checkOutTimestamp!).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                }),
              }
            : { completed: false },
          renter: {
            renterFullname: booking.renterName,
            renterPhone: booking.renterPhone,
            renterEmail: booking.renterEmail,
            renterLicenseNumber: booking.checkIn?.driverLicenseNumber || "Not provided",
          },
          vehicle: {
            vechicleId: booking.vehicleId,
            vehicleGearType: vehicleDetails.gearType,
            vehicleImageSrc: booking.vehicleImage || "/images/swingrides-default-img.webp",
            vehicleName: booking.vehicleName,
            vehiclePlateNumber: vehicleDetails.plateNumber,
            vehicleType: vehicleDetails.vehicleType,
          },
          trip: {
            PickUpDateTime: formatDateTime(booking.pickupDate),
            ReturnDateTime: formatDateTime(booking.returnDate),
            PickUpLocation: booking.location,
            ReturnLocation: booking.location,
          },
          bookingSummary: {
            totalPaidByRenter: toCurrency(booking.payment?.amountPaid ?? 0),
            platformCommission: toCurrency(booking.payment?.platformCommission ?? 0),
            netToHost: toCurrency(booking.payment?.netToHost ?? 0),
          },
          payment: {
            paymentStatus: booking.payment?.status ?? "pending",
            totalPaidByRenter: toCurrency(booking.payment?.amountPaid ?? 0),
            paymentDate: booking.payment?.paymentDate
              ? formatDateTime(booking.payment.paymentDate)
              : "Not available",
            paymentReciptSrc: booking.payment?.receiptPdfUrl
              ? `/backend${booking.payment.receiptPdfUrl}`
              : "",
            refund: (booking.payment?.refundedAmount ?? 0) > 0,
            refundAmount: toCurrency(booking.payment?.refundedAmount ?? 0),
            cancellationFeeAppliedDate: booking.payment?.refundDate
              ? formatDateTime(booking.payment.refundDate)
              : "",
            paymentMethod: booking.payment?.cardLast4
              ? `${booking.payment.cardBrand || "Card"} ending in ${booking.payment.cardLast4}`
              : booking.payment?.paymentMethod,
          },
          timeline: booking.timeline,
          preCheckStatus: {
            // `booking.checkIn`/`checkInCompletion` merely existing doesn't mean
            // anything was verified - Mongoose populates `checkIn`'s nested
            // array fields with empty-array defaults even when check-in never
            // ran, so testing its truthiness is always true. The checklist
            // booleans set by the actual check-in-completion flow are the only
            // reliable verification signal.
            driverLicenseStatus: booking.checkInCompletion?.checklist
              ?.identityVerified
              ? "verified"
              : "pending",
            insuranceStatus: booking.checkInCompletion?.checklist
              ?.insuranceConfirmed
              ? "verified"
              : "pending",
            paymentStatus: booking.payment?.status === "paid" ||
              booking.payment?.status === "refunded" ||
              booking.payment?.status === "partially_refunded"
              ? "verified"
              : booking.payment?.status === "failed"
                ? "notVerified"
                : "pending",
          },
          damageReport: {
            damageType:
              booking.checkOut?.vehicleInspection.damageType ||
              booking.checkIn?.vehicleCondition?.damages?.join(", ") ||
              "No reported damage",
            damageUserFullname: booking.renterName,
            description:
              booking.checkOut?.vehicleInspection.damageDescription ||
              booking.checkIn?.vehicleCondition?.damages?.join(", ") ||
              "No damage report submitted",
            uploadedProof: (booking.checkOut?.vehicleInspection.photoUrls || []).map(
              (url, index) => ({
                id: `checkout-photo-${index}`,
                name: `Checkout inspection photo ${index + 1}`,
                url,
                type: "image" as const,
              }),
            ),
            isAcknowledged:
              booking.checkOut?.vehicleInspection.damageAcknowledged || false,
          },
          incident: (() => {
            const incidentCharges = booking.incidentCharges || [];
            if (incidentCharges.length === 0) {
              return {
                incidentType: "No incident",
                incidentDecription: "No incident recorded",
                incidentFee: toCurrency(0),
                incidentImages: [],
              };
            }
            const totalFee = incidentCharges.reduce(
              (sum, charge) => sum + Number(charge.amount || 0),
              0,
            );
            return {
              incidentType:
                incidentCharges.length === 1
                  ? incidentCharges[0].incidentType
                  : `${incidentCharges.length} incidents`,
              incidentDecription: incidentCharges
                .map((charge) => charge.description)
                .join("; "),
              incidentFee: toCurrency(totalFee),
              incidentImages: incidentCharges.flatMap(
                (charge) => charge.evidenceUrls || [],
              ),
            };
          })(),
          reimbursement: {
            reimbursementType: "N/A",
            reimbursementDescription: "No reimbursement requested",
            reimbursementAmount: toCurrency(0),
            reimbursementRequestedDate: formatDateTime(booking.createdAt),
            reimbursementStatus: "pending",
          },
          noShow: {
            pickUpDate: new Date(booking.pickupDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            pickUpTime: new Date(booking.pickupDate).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            }),
          },
          onAcknowledge: async () => {
            console.log("damage report acknowledged");
          },
        }
      : {
          id,
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
          noShow,
          onAcknowledge: async () => {
            console.log("damage report acknowledged");
          },
        };
  }, [booking, checkInTimestamp, checkOutTimestamp, hasValidCheckOutTimestamp, id, vehicleDetails.gearType, vehicleDetails.plateNumber, vehicleDetails.vehicleType]);

  const [acknowledgeDamageReport] = useAcknowledgeDamageReportMutation();

  const handleDamageReportAcknowledge = useCallback(async () => {
    try {
      await acknowledgeDamageReport(id).unwrap();
    } catch (error) {
      const message =
        typeof error === "object" &&
        error &&
        "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message ===
          "string"
          ? (error as { data: { message: string } }).data.message
          : "Failed to acknowledge damage report";
      toast.error(message);
      throw error;
    }
  }, [acknowledgeDamageReport, id]);

  const GetMappedComponent = BookingPageMap[status];

  if (isBookingByIdLoading || isBookingByReferenceLoading) {
    return (
      <main className="p-3 md:p-8">
        <p className="text-sm font-medium text-gray-500">Loading booking details...</p>
      </main>
    );
  }

  if ((isBookingByIdError || isBookingByReferenceError) && !booking) {
    return (
      <main className="p-3 md:p-8">
        <p className="text-sm font-medium text-red-600">
          Unable to load booking details. Please try again.
        </p>
      </main>
    );
  }

  return (
    <main className="p-3 md:p-8 space-y-4 md:space-y-8">
      <PageHeader
        id={id}
        status={status}
        rawStatus={booking?.status}
        referenceCode={booking?.referenceCode || ""}
        renterName={booking?.renterName || ""}
        vehicleName={booking?.vehicleName || ""}
        renterEmail={booking?.renterEmail || ""}
        renterPhoneNumber={booking?.renterPhone || ""}
      />
      <GetMappedComponent
        id={bookingProps.id}
        extras={bookingProps.extras}
        checkIn={bookingProps.checkIn}
        checkOut={bookingProps.checkOut}
        bookingCreated={bookingProps.bookingCreated}
        checkInCompleted={bookingProps.checkInCompleted}
        checkOutCompleted={bookingProps.checkOutCompleted}
        renter={bookingProps.renter}
        vehicle={bookingProps.vehicle}
        trip={bookingProps.trip}
        bookingSummary={bookingProps.bookingSummary}
        payment={bookingProps.payment}
        preCheckStatus={bookingProps.preCheckStatus}
        damageReport={bookingProps.damageReport}
        incident={bookingProps.incident}
        reimbursement={bookingProps.reimbursement}
        onAcknowledge={handleDamageReportAcknowledge}
        noShow={bookingProps.noShow}
      />
    </main>
  );
}
