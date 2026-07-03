import DamageReportForm from "@/components/hostComponents/forms/bookingsPageDamageReportform";
import { Separator } from "@/components/ui/separator";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import {
  BookingSummaryInfo,
  CheckRecord,
  CheckType,
  DamageReportInfo,
  ExtraItem,
  IncidentalInfo,
  NoShowInfo,
  PaymentInfo,
  PreCheckStatusInfo,
  ReimbursementInfo,
  RenterInfo,
  TimelineEvent,
  TripInfo,
  VehicleInfo,
} from "./types";

export const RenterCard = ({
  renterFullname,
  renterEmail,
  renterPhone,
  renterLicenseNumber,
}: RenterInfo) => {
  return (
    <CardWrapper cardTitle="Renter Information">
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <DataList
          icon={<User className="size-4 text-gray-500" />}
          label="Full Name"
          value={renterFullname}
        />
        <DataList
          icon={<Phone className="size-4 text-gray-500" />}
          label="Phone Number"
          value={renterPhone}
        />
        <DataList
          icon={<Mail className="size-4 text-gray-500" />}
          label="Email Address"
          value={renterEmail}
        />
        <DataList
          icon={<CreditCard className="size-4 text-gray-500" />}
          label="License Number"
          value={renterLicenseNumber}
        />
      </div>
    </CardWrapper>
  );
};

export const VehicleCard = ({
  vechicleId,
  vehicleImageSrc,
  vehicleName,
  vehicleType,
  vehiclePlateNumber,
  vehicleGearType,
}: VehicleInfo) => {
  return (
    <CardWrapper cardTitle="Vehicle Information">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-start">
          <div className="aspect-480/320 object-cover max-w-48 w-full rounded-sm bg-gray-300 overflow-clip">
            <Image
              src={vehicleImageSrc || "/images/swingrides-default-img.webp"}
              alt={vehicleName}
              width={192}
              height={128}
              className="aspect-480/320 object-cover w-full rounded-sm"
            />
          </div>
          <div className="space-y-1">
            <h4 className="text-neutral-950 text-base font-bold font-text leading-6">
              {vehicleName}
            </h4>
            <div>
              <span className="text-gray-500 text-sm font-normal font-text leading-5">
                {vehiclePlateNumber} | {vehicleType} | {vehicleGearType}
              </span>
            </div>
          </div>
        </div>
        <div>
          <Link
            href={`${HOST_DASHBOARD_PATH}fleet/edit-vehicle/${vechicleId}`}
            className="py-2 px-4 bg-transparent border border-blue-700 text-blue-700 rounded-xs hover:bg-blue-900 hover:text-white hover:border-blue-900 duration-300 transition-colors text-nowrap"
          >
            View Details
          </Link>
        </div>
      </div>
    </CardWrapper>
  );
};

export const TripCard = ({
  PickUpDateTime,
  ReturnDateTime,
  PickUpLocation,
  ReturnLocation,
}: TripInfo) => {
  return (
    <CardWrapper cardTitle="Trip Details">
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <DataList
          icon={<Calendar className="size-4 text-gray-500" />}
          label="Pickup Date & Time"
          value={PickUpDateTime}
        />
        <DataList
          icon={<Calendar className="size-4 text-gray-500" />}
          label="Return Date & Time"
          value={ReturnDateTime}
        />
        <DataList
          icon={<MapPin className="size-4 text-gray-500" />}
          label="Pickup Location"
          value={PickUpLocation}
        />
        <DataList
          icon={<MapPin className="size-4 text-gray-500" />}
          label="Return Location"
          value={ReturnLocation}
        />
      </div>
    </CardWrapper>
  );
};

interface AddonAndExtraCardProps {
  extras: ExtraItem[];
}

export const AddonAndExtraCard = ({ extras }: AddonAndExtraCardProps) => {
  return (
    <CardWrapper cardTitle="Add-ons & Extras">
      <div className="flex flex-col gap-3">
        {extras.map((item) => {
          const value = `${item.pricingRate} x ${item.duration}`;

          return (
            <div
              key={item.title}
              className="flex gap-4 items-center justify-between"
            >
              <DataListReverse label={item.title} value={value} />

              <span>{item.totalfee}</span>
            </div>
          );
        })}
      </div>
    </CardWrapper>
  );
};

interface CheckInCheckOutProps {
  bookingId: string;
  checkIn?: {
    checkedDateTime: string;
    bookingId: string;
    checkType: "checkIn";
    mileage: string;
    fuelLevel: string;
    condition: string;
    notes?: string;
  };
  checkOut?: {
    checkedDateTime: string;
    bookingId: string;
    checkType: "checkOut";
    mileage: string;
    fuelLevel: string;
    condition: string;
    notes?: string;
  };
}

export const CheckInCheckOutCard = ({
  checkIn,
  checkOut,
  bookingId,
}: CheckInCheckOutProps) => {
  return (
    <CardWrapper cardTitle="Check-In & Check-Out">
      <div className="space-y-3">
        {checkIn ? (
          <CheckInCheckOutCompletedState
            checkedDateTime={checkIn.checkedDateTime}
            bookingId={checkIn.bookingId}
            checkType={checkIn.checkType}
            mileage={checkIn.mileage}
            fuelLevel={checkIn.fuelLevel}
            condition={checkIn.condition}
            notes={checkIn.notes}
          />
        ) : (
          <CheckInCheckOutPendingState
            checkType="checkIn"
            bookingId={bookingId}
          />
        )}

        {checkOut ? (
          <CheckInCheckOutCompletedState
            checkedDateTime={checkOut.checkedDateTime}
            bookingId={checkOut.bookingId}
            checkType={checkOut.checkType}
            mileage={checkOut.mileage}
            fuelLevel={checkOut.fuelLevel}
            condition={checkOut.condition}
            notes={checkOut.notes}
          />
        ) : (
          <CheckInCheckOutPendingState
            checkType="checkOut"
            bookingId={bookingId}
          />
        )}
      </div>
    </CardWrapper>
  );
};

const CheckInCheckOutCompletedState = ({
  checkedDateTime,
  bookingId,
  checkType,
  mileage,
  fuelLevel,
  condition,
  notes,
}: CheckRecord) => {
  return (
    <div className="p-4 bg-slate-200 rounded-[10px] flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center justify-start gap-2">
          <div className="bg-emerald-500 rounded-full w-8 h-8 flex justify-center items-center">
            <Check className="size-4 text-white" />
          </div>
          <DataListReverse
            label={
              checkType === "checkIn"
                ? "Check-In Completed"
                : "Check-Out Completed"
            }
            value={checkedDateTime}
          />
        </div>
        <div>
          <Link
            href={`${HOST_DASHBOARD_PATH}bookings/${bookingId}/${
              checkType === "checkIn"
                ? "complete-check-in"
                : "complete-check-out"
            }`}
            className="py-2 px-4 bg-transparent border border-blue-700 text-blue-700 rounded-xs hover:bg-blue-900 hover:text-white hover:border-blue-900 duration-300 transition-colors text-nowrap"
          >
            View Details
          </Link>
        </div>
      </div>
      <div className="flex gap-4 items-center justify-start">
        <DataList label="Mileage" value={mileage} />
        <DataList label="Fuel Level" value={fuelLevel} />
        <DataList label="Condition" value={condition} />
      </div>
      <Separator />
      <DataListReverse label="Notes:" value={notes || "No notes provided."} />
    </div>
  );
};

interface CheckInCheckOutPendingStateProps {
  checkType: CheckType;
  bookingId: string;
}

const CheckInCheckOutPendingState = ({
  checkType,
  bookingId,
}: CheckInCheckOutPendingStateProps) => {
  return (
    <div className="p-4 bg-slate-50 rounded-[10px] flex justify-between items-center gap-4">
      <div className="flex justify-start items-center gap-2">
        <Clock className="size-4 text-gray-500" />
        <span className="text-gray-500 text-sm font-normal font-text leading-5">
          {checkType === "checkIn" ? "Check-In" : "Check-Out"} is pending.
        </span>
      </div>
      <div>
        <Link
          href={`${HOST_DASHBOARD_PATH}bookings/${bookingId}/${
            checkType === "checkIn" ? "complete-check-in" : "complete-check-out"
          }`}
          className="py-2 px-4 bg-transparent border border-blue-700 text-blue-700 rounded-xs hover:bg-blue-900 hover:text-white hover:border-blue-900 duration-300 transition-colors text-nowrap"
        >
          Start {checkType === "checkIn" ? "Check-In" : "Check-Out"}
        </Link>
      </div>
    </div>
  );
};

export const PreCheckStatusCard = ({
  driverLicenseStatus,
  insuranceStatus,
  paymentStatus,
}: PreCheckStatusInfo) => {
  return (
    <CardWrapper cardTitle="Pre-Check Status">
      <div className="flex flex-col gap-3">
        <PreCheckStatusDataList
          icon={<User className="size-4 text-gray-500" />}
          label="Driver's License"
          status={driverLicenseStatus}
        />
        <PreCheckStatusDataList
          icon={<Shield className="size-4 text-gray-500" />}
          label="Insurance Status"
          status={insuranceStatus}
        />
        <PreCheckStatusDataList
          icon={<CreditCard className="size-4 text-gray-500" />}
          label="Payment Status"
          status={paymentStatus}
        />
      </div>
    </CardWrapper>
  );
};

interface PreCheckStatusDataListProps {
  icon?: React.ReactNode;
  label: string;
  status: "verified" | "pending" | "notVerified";
}

const PreCheckStatusDataList = ({
  icon,
  label,
  status,
}: PreCheckStatusDataListProps) => {
  return (
    <div className="flex gap-4 items-center justify-between p-3">
      <div className="flex justify-start items-center gap-3">
        {icon}
        <span className="flex text-gray-800 text-sm font-semibold font-text leading-5">
          {label}
        </span>
      </div>
      {status === "verified" ? (
        <div className="flex justify-start items-center gap-2">
          <CheckCircle2 className="size-4 text-green-800" />
          <span className="text-green-800 text-sm font-semibold font-text leading-5">
            Verified
          </span>
        </div>
      ) : status === "pending" ? (
        <div className="flex justify-start items-center gap-2">
          <Clock className="size-4 text-amber-500" />
          <span className="text-amber-500 text-sm font-semibold font-text leading-5">
            Pending
          </span>
        </div>
      ) : (
        <div className="flex justify-start items-center gap-2">
          <XCircle className="size-4 text-red-500" />
          <span className="text-red-500 text-sm font-semibold font-text leading-5">
            Not Verified
          </span>
        </div>
      )}
    </div>
  );
};

type DamageReportCardProps = DamageReportInfo & {
  onAcknowledge: () => void | Promise<void>;
};

export const DamageReportCard = ({
  damageType,
  damageUserFullname,
  description,
  uploadedProof,
  isAcknowledged,
  onAcknowledge,
}: DamageReportCardProps) => {
  return (
    <CardWrapper cardTitle="Damage Report">
      <div className="flex flex-col gap-5">
        <DataListReverse label={damageType} value={damageUserFullname} />
        <DamageReportForm
          description={description}
          uploadedProof={uploadedProof}
          isAcknowledged={isAcknowledged}
          onAcknowledge={onAcknowledge}
        />
      </div>
    </CardWrapper>
  );
};

export const IncidentalCard = ({
  incidentType,
  incidentDecription,
  incidentFee,
  incidentImages,
}: IncidentalInfo) => {
  return (
    <CardWrapper cardTitle="Incidentals">
      <div className="space-y-3 p-2 md:p-4 rounded-[10px] border border-gray-200">
        <div className="flex items-start justify-between gap-4">
          <DataListReverse label={incidentType} value={incidentDecription} />
          <span className="jtext-red-500 text-base font-medium font-text leading-6">
            {incidentFee}
          </span>
        </div>
        <div
          className={`${incidentImages && incidentImages.length > 0 ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" : "flex justify-center items-center"}`}
        >
          {incidentImages && incidentImages.length > 0 ? (
            incidentImages.map((src) => (
              <Image
                key={src}
                src={src}
                alt="Incident Image"
                width={200}
                height={200}
                className="aspect-square object-cover w-full rounded-sm"
              />
            ))
          ) : (
            <span className="text-gray-500 text-center text-sm font-normal font-text leading-5">
              No incident images provided.
            </span>
          )}
        </div>
      </div>
    </CardWrapper>
  );
};

export const ReimbursementCard = ({
  reimbursementType,
  reimbursementDescription,
  reimbursementAmount,
  reimbursementRequestedDate,
  reimbursementProcessedDate,
  reimbursementStatus,
}: ReimbursementInfo) => {
  return (
    <CardWrapper cardTitle="Reimbursement Request">
      <div className="flex flex-col md:flex-row gap-3 p-2 md:p-4 rounded-[10px] border border-gray-200">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-start items-center gap-2">
            <h4 className="text-gray-800 text-sm font-semibold font-text leading-5">
              {reimbursementType}
            </h4>
            <span
              className={`${reimbursementStatus === "approved" ? "text-emerald-500 bg-emerald-100" : reimbursementStatus === "pending" ? "text-amber-500 bg-orange-100" : "text-red-500 bg-rose-100"} py-0.5 px-2 rounded-full inline-flex justify-center items-center text-xs font-semibold font-text leading-4`}
            >
              {reimbursementStatus === "approved"
                ? "Approved"
                : reimbursementStatus === "pending"
                  ? "Pending"
                  : "Rejected"}
            </span>
          </div>
          <span className="block text-gray-500 text-sm font-normal font-text leading-5">
            {reimbursementDescription}
          </span>
          <span className="block text-gray-500 text-xs font-normal font-text leading-4">
            Requested: {reimbursementRequestedDate} · Processed:{" "}
            {reimbursementProcessedDate || "Pending"}
          </span>
        </div>
        <div>
          <span className="text-emerald-500 text-base font-medium font-text leading-6">
            {reimbursementAmount}
          </span>
        </div>
      </div>
    </CardWrapper>
  );
};

export const NoShowCard = ({ pickUpDate, pickUpTime }: NoShowInfo) => {
  return (
    <div className="flex items-start justify-start gap-4 rounded-lg border-l-4 border-red-500 p-3 md:py-6 md:px-8 bg-white">
      <div className="rounded-full aspect-square size-12 bg-red-100 flex justify-center items-center">
        <AlertTriangle className="size-6 text-red-500" />
      </div>
      <div className="flex flex-col gap-2.5">
        <h4 className="text-red-600 text-base font-bold font-text leading-6">
          Renter Did Not Show Up
        </h4>
        <span className="text-gray-500 text-sm font-normal font-text leading-5">
          Pickup window expired on{" "}
          <span className="text-gray-800 font-semibold">
            {" "}
            {pickUpDate} at {pickUpTime}
          </span>
        </span>
        <span className="text-gray-500 text-sm font-normal font-text leading-5">
          This booking has been automatically closed. No further actions are
          required unless incidentals apply.
        </span>
      </div>
    </div>
  );
};

export const BookingSummaryCard = ({
  totalPaidByRenter,
  platformCommission,
  netToHost,
}: BookingSummaryInfo) => {
  return (
    <CardWrapper cardTitle="Booking Summary">
      <div className="space-y-3">
        <InlineDataList
          label="Total Paid by Renter"
          value={totalPaidByRenter}
        />
        <InlineDataList
          label="Platform Commission"
          value={platformCommission}
          valueStyle="text-red-500 text-sm leading-5"
        />
        <Separator />
        <div className="flex justify-between items-center gap-3">
          <span className="block text-gray-800 text-base font-bold font-text leading-6">
            Net to Host
          </span>
          <span className="block text-emerald-500 text-lg font-medium font-text leading-7">
            {netToHost}
          </span>
        </div>
      </div>
    </CardWrapper>
  );
};

export const PaymentStatusCard = ({
  paymentStatus,
  totalPaidByRenter,
  paymentDate,
  paymentReciptSrc,
  refund,
  refundAmount,
  cancellationFeeAppliedDate,
}: PaymentInfo) => {
  const statusColor =
    paymentStatus === "paid"
      ? "text-emerald-500 bg-emerald-100"
      : paymentStatus === "pending"
        ? "text-amber-500 bg-amber-100"
        : "text-red-500 bg-red-100";
  const statusText =
    paymentStatus === "paid"
      ? "Paid"
      : paymentStatus === "pending"
        ? "Pending"
        : "Failed";

  return (
    <CardWrapper cardTitle="Payment Status">
      <div className="flex flex-col gap-4">
        <InlineDataList
          label="Payment Status"
          value={statusText}
          valueStyle={`${statusColor} py-1 px-2 rounded-full`}
        />
        {paymentStatus === "pending" ? (
          <div className="p-3 bg-amber-100 rounded-[10px] flex gap-1 justify-start items-start">
            <AlertCircle className="text-amber-500 size-4" />
            <span className="block text-amber-500 text-xs font-normal font-text leading-4">
              Payment to be made at online reservation
            </span>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <InlineDataList
                label="Amount Paid"
                value={totalPaidByRenter}
                valueStyle="text-emerald-500 text-sm leading-5"
              />
              <InlineDataList label="Payment Date" value={paymentDate} />
            </div>
            <Link
              href={paymentReciptSrc}
              className="py-2 px-4 text-center bg-transparent border border-blue-700 text-blue-700 rounded-xs hover:bg-blue-900 hover:text-white hover:border-blue-900 duration-300 transition-colors text-nowrap"
            >
              View Payment Receipt
            </Link>
          </>
        )}
        {refund && (
          <div className="p-3 bg-amber-100 rounded-[10px] border border-amber-200 flex flex-col justify-start items-start gap-1">
            <span className="block text-amber-800 text-xs font-semibold font-text leading-4">
              Refund Processed
            </span>
            <span className="block text-amber-800 text-sm font-medium font-text leading-5">
              {refundAmount}
            </span>
            <span className="block text-amber-800 text-xs font-normal font-text leading-4">
              50% cancellation fee applied on {cancellationFeeAppliedDate}
            </span>
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

interface BookingTimelineProps {
  bookingCreated: TimelineEvent;
  checkInCompleted: TimelineEvent;
  checkOutCompleted: TimelineEvent;
}

export const BookingTimeline = ({
  bookingCreated,
  checkInCompleted,
  checkOutCompleted,
}: BookingTimelineProps) => {
  return (
    <CardWrapper cardTitle="Booking Timeline">
      <div className="space-y-4">
        {checkOutCompleted.completed && (
          <div className="relative border-l-2 pl-4">
            <div className="size-2 bg-blue-700 rounded-full absolute top-0 left-0 translate-x-[-60%]" />
            <DataListReverse
              label="Check-Out Completed"
              value={`${checkOutCompleted.date} · ${checkOutCompleted.time}`}
            />
          </div>
        )}
        {checkInCompleted.completed && (
          <div className="relative border-l-2 pl-4">
            <div className="size-2 bg-blue-700 rounded-full absolute top-0 left-0 translate-x-[-60%]" />
            <DataListReverse
              label="Check-In Completed"
              value={`${checkInCompleted.date} · ${checkInCompleted.time}`}
            />
          </div>
        )}
        {bookingCreated.completed && (
          <div className="relative border-l-2 pl-4">
            <div className="size-2 bg-blue-700 rounded-full absolute top-0 left-0 translate-x-[-60%]" />
            <DataListReverse
              label="Booking Created"
              value={`${bookingCreated.date} · ${bookingCreated.time}`}
            />
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

export const CardWrapper = ({
  children,
  cardTitle,
}: {
  children: React.ReactNode;
  cardTitle: string;
}) => {
  return (
    <div className="bg-white rounded-[10px] border border-gray-200 flex flex-col justify-start gap-3">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col justify-start items-start">
        <h3 className="text-neutral-950 text-base font-semibold font-text leading-6">
          {cardTitle}
        </h3>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
};

interface DataListProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}

export const DataListReverse = ({
  label,
  value,
  valueColor = "text-neutral-950",
}: DataListProps) => {
  return (
    <div className="flex flex-col gap-1 justify-start items-start">
      <div>
        <span
          className={`text-neutral-950 text-sm font-semibold font-text leading-5 ${valueColor}`}
        >
          {label}
        </span>
      </div>
      <div className="flex justify-start items-center gap-2">
        <span className="text-gray-500 text-xs font-normal font-text leading-4">
          {value}
        </span>
      </div>
    </div>
  );
};

export const DataList = ({
  icon,
  label,
  value,
  valueColor = "text-neutral-950",
}: DataListProps) => {
  return (
    <div className="flex flex-col gap-1 justify-start items-start">
      <div className="flex justify-start items-center gap-2">
        {icon && icon}
        <h4 className="text-gray-500 text-xs font-normal font-text leading-4">
          {label}
        </h4>
      </div>
      <div>
        <span
          className={`text-neutral-950 text-sm font-semibold font-text leading-5 ${valueColor}`}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

interface InlineDataListProps {
  label: string;
  value: string;
  valueStyle?: string;
}

export const InlineDataList = ({
  label,
  value,
  valueStyle = "text-gray-800 text-sm leading-5",
}: InlineDataListProps) => {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="block text-gray-500 text-sm font-normal font-text leading-5">
        {label}
      </span>
      <span className={`block font-medium font-text ${valueStyle}`}>
        {value}
      </span>
    </div>
  );
};

interface BookingPageWrapperProps {
  leftComponents: ReactNode;
  rightComponents: ReactNode;
}

export const BookingPageWrapper = ({
  leftComponents,
  rightComponents,
}: BookingPageWrapperProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="col-span-1 lg:col-span-3">{leftComponents}</div>
      <div className="col-span-1 lg:col-span-2">{rightComponents}</div>
    </div>
  );
};
