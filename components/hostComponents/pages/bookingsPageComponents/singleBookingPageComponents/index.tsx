"use client";

import { ComponentType } from "react";
import {
  useGetBookingByIdQuery,
  useGetBookingByReferenceQuery,
} from "@/app/store/services/bookingApi";
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
  noShow,
} from "@/constants/hostBookingPage";

type SingleBookingPageComponentProps = {
  id: string;
};

type BookingStatusTypes =
  | "active"
  | "reserved"
  | "confirmed"
  | "completed"
  | "noShow"
  | "cancelled";

const BookingPageMap: Record<
  BookingStatusTypes,
  ComponentType<BookingPageProps>
> = {
  active: ActiveBookingPage,
  reserved: ReservedBookingPage,
  confirmed: ConfirmedBookingPage,
  completed: CompletedBookingPage,
  noShow: NoShowBookingPage,
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

  const toBookingStatus = (apiStatus: string): BookingStatusTypes => {
    if (apiStatus === "pending") return "reserved";
    if (apiStatus === "confirmed") return "confirmed";
    if (apiStatus === "completed") return "completed";
    if (apiStatus === "cancelled") return "cancelled";
    return "active";
  };

  const status: BookingStatusTypes = booking
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
    return date.toISOString();
  };

  const vehicleDetails = booking
    ? getVehicleDetails(booking.vehicleDetails)
    : { plateNumber: "", vehicleType: "", gearType: "" };
  const checkInTimestamp = booking?.checkIn?.checkInTime || booking?.updatedAt || booking?.createdAt;

  const bookingProps: BookingPageProps = booking
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
        checkOut: undefined,
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
        checkInCompleted: booking.checkIn
          ? {
              completed: true,
              date: new Date(checkInTimestamp || booking.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              time: new Date(checkInTimestamp || booking.createdAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              }),
            }
          : { completed: false },
        checkOutCompleted: booking.status === "completed"
          ? {
              completed: true,
              date: new Date(booking.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              time: new Date(booking.updatedAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              }),
            }
          : { completed: false },
        renter: {
          renterFullname: booking.renterName,
          renterPhone: booking.renterPhone,
          renterEmail: booking.renterEmail,
          renterLicenseNumber: "Not provided",
        },
        vehicle: {
          vechicleId: booking.vehicleId,
          vehicleGearType: vehicleDetails.gearType,
          vehicleImageSrc: "/images/swingrides-default-img.webp",
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
          totalPaidByRenter: toCurrency(booking.totalAmount),
          platformCommission: toCurrency(booking.totalAmount * 0.15),
          netToHost: toCurrency(booking.totalAmount * 0.85),
        },
        payment: {
          paymentStatus:
            booking.status === "cancelled"
              ? "refunded"
              : booking.status === "pending"
                ? "pending"
                : "paid",
          totalPaidByRenter: toCurrency(booking.totalAmount),
          paymentDate: formatDateTime(booking.createdAt),
          paymentReciptSrc: "",
          refund: booking.status === "cancelled",
          refundAmount:
            booking.status === "cancelled" ? toCurrency(booking.totalAmount) : "0",
          cancellationFeeAppliedDate: "",
        },
        preCheckStatus: {
          driverLicenseStatus: booking.checkIn ? "verified" : "pending",
          insuranceStatus: booking.checkInCompletion ? "verified" : "pending",
          paymentStatus:
            booking.status === "pending" ? "pending" : "verified",
        },
        damageReport: {
          damageType:
            booking.checkIn?.vehicleCondition?.damages?.join(", ") || "No reported damage",
          damageUserFullname: booking.renterName,
          description:
            booking.checkIn?.vehicleCondition?.damages?.join(", ") || "No damage report submitted",
          uploadedProof: [],
          isAcknowledged: false,
        },
        incident: {
          incidentType: "No incident",
          incidentDecription: "No incident recorded",
          incidentFee: toCurrency(0),
          incidentImages: [],
        },
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

  const handleDamageReportAcknowledge = async () => {
    // TODO: replace with real API call
    // await fetch(`/api/damage-reports/${reportId}/acknowledge`, { method: 'POST' })
    console.log("damage report acknowledged");
  };

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
        id={booking?.referenceCode || id}
        status={status}
        handleEditBooking={() => console.log("edit")}
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
