"use client";

import { ReactNode } from "react";
import SubscribersSubPageWrapper from "../dashboard/subscribersSubPageWrapper";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, ExternalLink, MapPin } from "lucide-react";
import { formatNumberToUSD } from "../utils/formatNumbertoUSD";
import {
  STATUS_STYLE,
  DAMAGE_STATUS_STYLE,
  REIMBURSEMENT_STATUS_STYLE,
} from "../utils/helpers";
import {
  SubscriberStatus,
  BookingStatus,
  BillingStatus,
  RenterType,
  FleetVehicle,
  DamageReport,
  ReimbursementRequest,
  SubscriberPlan,
  BookingPaymentStatusType,
} from "@/constants/superAdminSidebar";
import { FleetStatus } from "@/types/subscribers.type";
import { InLineDataListPrice } from "./vehicleDetailPage";
import { getTripDuration } from "@/components/pages/profilePages/utils";
import {
  BookingPaymentPill,
  SubscriptionPlanPill,
} from "../dashboard/statusPill";
import { useGetAdminSubscriberBookingDetailQuery } from "@/app/store/services/adminApi";

type BookingDetailPageProps = {
  parentSlug?: string;
  id: string;
  status: SubscriberStatus | BookingStatus | FleetStatus | BillingStatus;
  renter: RenterType;
  vehicleInformation: FleetVehicle;
  pickupDateAndTime: string;
  returnDateAndTime: string;
  pickupLocation: string;
  returnLocation: string;
  damageReport: DamageReport | null;
  reimbursementRequests: ReimbursementRequest | null;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  insuranceFee: number;
  organisationName: string;
  subscriptionPlan: SubscriberPlan;
  hostEmail: string;
  bookingPaymentStatus: BookingPaymentStatusType;
  paymentDateTime: string;
};

const BASE_PLATFORM_FEE_PERCENTAGE = 8;
const TAX_RATE_PERCENTAGE = 8;

const formatDateTime = (value?: string) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getTripLengthInDays = (
  pickupDateAndTime: string,
  returnDateAndTime: string,
) => {
  const pickupDate = new Date(pickupDateAndTime);
  const returnDate = new Date(returnDateAndTime);

  if (
    Number.isNaN(pickupDate.getTime()) ||
    Number.isNaN(returnDate.getTime())
  ) {
    return 1;
  }

  const difference = returnDate.getTime() - pickupDate.getTime();
  const dayInMs = 1000 * 60 * 60 * 24;

  return Math.max(1, Math.ceil(difference / dayInMs));
};

const BookingDetailPageContent = ({
  parentSlug,
  id,
  status,
  renter,
  vehicleInformation,
  pickupDateAndTime,
  returnDateAndTime,
  pickupLocation,
  returnLocation,
  damageReport,
  reimbursementRequests,
  dailyRate,
  weeklyRate,
  monthlyRate,
  insuranceFee,
  organisationName,
  subscriptionPlan,
  hostEmail,
  bookingPaymentStatus,
  paymentDateTime,
}: BookingDetailPageProps) => {
  const tripDuration = getTripDuration(pickupDateAndTime, returnDateAndTime);
  const tripLengthInDays = getTripLengthInDays(
    pickupDateAndTime,
    returnDateAndTime,
  );
  const tripCost =
    tripLengthInDays >= 30
      ? (tripLengthInDays / 30) * monthlyRate
      : tripLengthInDays >= 7
        ? (tripLengthInDays / 7) * weeklyRate
        : tripLengthInDays * dailyRate;
  const platformFee = (BASE_PLATFORM_FEE_PERCENTAGE / 100) * tripCost;
  const subtotalCost = tripCost + platformFee + (insuranceFee || 0);
  const taxFee = (TAX_RATE_PERCENTAGE / 100) * subtotalCost;
  const totalAmount = subtotalCost + taxFee;

  return (
    <div>
      <SubscribersSubPageWrapper
        pageTitle={id}
        pageDescription="View complete booking information and history"
        status={status}
        parentSlug={parentSlug}
        dataType="booking"
      >
        <div className="grid md:grid-cols-5 gap-4">
          <div className="md:col-span-3">
            <SectionWrapper title="Renter Information">
              <div className="grid grid-cols-2 gap-4">
                <DataList title="Full Name" label={renter.fullname} />
                <DataList title="Phone Number" label={renter.phoneNumber} />
                <DataList title="Email Address" label={renter.email} />
                <DataList
                  title="License Number"
                  label={renter?.licenseNumber}
                />
              </div>
            </SectionWrapper>

            <SectionWrapper title="Vehicle Information">
              <div className="grid grid-cols-2 gap-4">
                <DataList title="Name" label={vehicleInformation.vehicleName} />
                <DataList
                  title="Plate Number"
                  label={vehicleInformation.plateNumber}
                />
                <DataList title="Type" label={vehicleInformation.bodyType} />
                <DataList
                  title="Transmission"
                  label={vehicleInformation.transmission}
                />
              </div>
              <div>
                <Link
                  href={`/admin/subscribers/${parentSlug}/fleet/${vehicleInformation.id}`}
                  className="flex gap-1 items-center text-blue-700 text-sm font-medium font-text leading-5"
                >
                  <span>View Fleet Detail</span>
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>
            </SectionWrapper>

            <SectionWrapper title="Trip Details">
              <div className="grid md:grid-cols-2 gap-4">
                <DataList
                  title="Pickup Date & Time"
                  label={formatDateTime(pickupDateAndTime)}
                  icon={<Calendar className="size-4 text-[#6B7280]" />}
                />
                <DataList
                  title="Return Date & Time"
                  label={formatDateTime(returnDateAndTime)}
                  icon={<Calendar className="size-4 text-[#6B7280]" />}
                />
                <DataList
                  title="Pickup Location"
                  label={pickupLocation}
                  icon={<MapPin className="size-4 text-[#6B7280]" />}
                />
                <DataList
                  title="Return Location"
                  label={returnLocation}
                  icon={<MapPin className="size-4 text-[#6B7280]" />}
                />
              </div>
            </SectionWrapper>

            <SectionWrapper title="Damage Reports">
              <div>
                {damageReport ? (
                  <InLineDataList
                    title={damageReport?.name}
                    dateSubmitted={damageReport?.submittedDate}
                    status={damageReport?.status}
                    dataType="damageReport"
                    price={damageReport?.totalCost}
                    description={damageReport?.description}
                  />
                ) : (
                  <div className="flex justify-center items-center p-2.5 md:p-4 rounded-md border border-gray-200">
                    <span className="text-center text-gray-500 text-sm font-normal font-text leading-5">
                      No damage report filed for this booking
                    </span>
                  </div>
                )}
              </div>
            </SectionWrapper>

            <SectionWrapper title="Reimbursement Requests">
              <div>
                {reimbursementRequests ? (
                  <InLineDataList
                    title={reimbursementRequests?.name}
                    dateSubmitted={reimbursementRequests?.submittedDate}
                    status={reimbursementRequests?.status}
                    dataType="reimbursementRequests"
                    price={reimbursementRequests?.totalCost}
                    description={reimbursementRequests?.description}
                  />
                ) : (
                  <div className="flex justify-center items-center p-2.5 md:p-4 rounded-md border border-gray-200">
                    <span className="text-center text-gray-500 text-sm font-normal font-text leading-5">
                      No reimbursement request filed for this booking
                    </span>
                  </div>
                )}
              </div>
            </SectionWrapper>
          </div>

          <div className="md:col-span-2 space-y-4 md:space-y-6">
            <SectionWrapper title="Booking Summary">
              <div className="space-y-3">
                <InLineDataListPrice
                  label={`Base Rate (${tripDuration})`}
                  price={Number(tripCost)}
                  priceClassName="text-neutral-950 text-sm font-normal font-text leading-5"
                />
                <InLineDataListPrice
                  label={`Insurance`}
                  price={insuranceFee ? insuranceFee : 0}
                  priceClassName="text-neutral-950 text-sm font-normal font-text leading-5"
                />
                <InLineDataListPrice
                  label={`Platform Fee (${BASE_PLATFORM_FEE_PERCENTAGE})%`}
                  price={platformFee}
                  priceClassName="text-neutral-950 text-sm font-normal font-text leading-5"
                />
                <div className="h-px w-full bg-zinc-200" />
                <InLineDataListPrice
                  label={`Subtotal`}
                  price={subtotalCost}
                  priceClassName="text-neutral-950 text-sm font-normal font-text leading-5"
                />
                <div className="h-px w-full bg-zinc-200" />
                <InLineDataListPrice
                  label={`Tax (${TAX_RATE_PERCENTAGE})%`}
                  price={taxFee}
                  priceClassName="text-neutral-950 text-sm font-normal font-text leading-5"
                />
                <div className="h-px w-full bg-zinc-200" />
                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-neutral-950 text-base font-semibold font-text leading-5">
                    Total Amount
                  </span>
                  <span className="text-neutral-950 text-xl font-normal font-text leading-6">
                    {formatNumberToUSD(totalAmount)}
                  </span>
                </div>
              </div>
            </SectionWrapper>

            <SectionWrapper title="Booking Summary">
              <div className="space-y-3">
                <DataList
                  title="Status"
                  status={<BookingPaymentPill status={bookingPaymentStatus} />}
                />
                <DataList
                  title="Amount Paid"
                  label={formatNumberToUSD(totalAmount)}
                />
                <DataList
                  title="Payment Date"
                  label={formatDateTime(paymentDateTime)}
                />
              </div>
            </SectionWrapper>

            <SectionWrapper title="Host Organisation">
              <div className="grid gap-4">
                <DataList
                  title="Organisation Name"
                  label={organisationName}
                  labelClassName="text-neutral-950 text-base font-semibold font-text leading-5"
                />
                <DataList
                  title="Subscription Plan"
                  status={<SubscriptionPlanPill status={subscriptionPlan} />}
                />
                <DataList title="Host Email" label={hostEmail} />
                <div>
                  {parentSlug && (
                    <Link
                      href={`/admin/subscribers/${parentSlug}`}
                      className="flex items-center gap-1 text-blue-700 text-sm font-medium font-text leading-5 hover:text-blue-900 duration-300 transition-colors"
                    >
                      <span>View Subscriber Detail</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  )}
                </div>
              </div>
            </SectionWrapper>
          </div>
        </div>
      </SubscribersSubPageWrapper>
    </div>
  );
};

export default function BookingDetailPage() {
  const params = useParams<{ slug?: string; id?: string }>();
  const parentSlug = typeof params?.slug === "string" ? params.slug : "";
  const bookingId = typeof params?.id === "string" ? params.id : "";

  const { data, isLoading, isError } = useGetAdminSubscriberBookingDetailQuery(
    {
      subscriberId: parentSlug,
      bookingId,
    },
    {
      skip: !parentSlug || !bookingId,
    },
  );

  if (!parentSlug || !bookingId) {
    return (
      <div className="p-6 text-sm text-red-600">
        Invalid booking route parameters.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading booking details...
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="p-6 text-sm text-red-600">
        Failed to load booking details.
      </div>
    );
  }

  const { booking, subscriber } = data.data;

  return (
    <BookingDetailPageContent
      parentSlug={parentSlug}
      id={booking.id}
      status={booking.status as BookingStatus}
      renter={booking.renter as RenterType}
      vehicleInformation={booking.vehicleInformation as FleetVehicle}
      pickupDateAndTime={booking.pickupDateAndTime}
      returnDateAndTime={booking.returnDateAndTime}
      pickupLocation={booking.pickupLocation}
      returnLocation={booking.returnLocation}
      damageReport={booking.damageReport as DamageReport}
      reimbursementRequests={
        booking.reimbursementRequests as ReimbursementRequest
      }
      dailyRate={booking.pricing.dailyRate}
      weeklyRate={booking.pricing.weeklyRate}
      monthlyRate={booking.pricing.monthlyRate}
      insuranceFee={booking.pricing.insuranceFee}
      organisationName={subscriber.organization}
      subscriptionPlan={subscriber.plan as SubscriberPlan}
      hostEmail={subscriber.ownerEmail}
      bookingPaymentStatus={booking.paymentStatus as BookingPaymentStatusType}
      paymentDateTime={booking.paymentDateTime}
    />
  );
}

type SectionWrapperProps = {
  title: string;
  className?: string;
  children: ReactNode;
};

const SectionWrapper = ({
  title,
  className,
  children,
}: SectionWrapperProps) => {
  return (
    <div
      className={`p-3 md:p-6 my-4 bg-white rounded-lg border border-gray-200 ${className}`}
    >
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-neutral-950 text-lg font-semibold font-text leading-6">
            {title}
          </h3>
        </div>
        {children}
      </div>
    </div>
  );
};

type DataListProps = {
  title: string;
  label?: string | number;
  className?: string;
  icon?: ReactNode;
  labelClassName?: string;
  status?: ReactNode;
};

type InLineDataListProps = {
  title: string;
  dateSubmitted: string;
  status: "approved" | "declined" | "pending";
  dataType: "damageReport" | "reimbursementRequests";
  price: number;
  className?: string;
  description?: string;
};

export const DataList = ({
  title,
  label,
  icon,
  className,
  labelClassName,
  status,
}: DataListProps) => {
  return (
    <div
      className={`flex flex-col justify-start items-start gap-2  ${className}`}
    >
      <h4 className="text-gray-500 text-xs font-medium font-text uppercase leading-4 tracking-tight">
        {title}
      </h4>
      {status}
      {label && (
        <div className="flex justify-start items-center gap-2">
          {icon}
          <span
            className={
              labelClassName
                ? labelClassName
                : "text-neutral-950 text-sm font-normal font-text leading-5"
            }
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
};

const InLineDataList = ({
  title,
  dateSubmitted,
  status,
  price,
  dataType,
  className,
  description,
}: InLineDataListProps) => {
  const styleMap =
    dataType === "damageReport"
      ? DAMAGE_STATUS_STYLE
      : dataType === "reimbursementRequests"
        ? REIMBURSEMENT_STATUS_STYLE
        : STATUS_STYLE;

  const { label, textColor, bgColor } = (
    styleMap as Record<
      string,
      { label: string; textColor: string; bgColor: string }
    >
  )[status];

  return (
    <div
      className={`p-2.5 md:p-4 rounded-md border border-gray-200 flex flex-col gap-3 ${className}`}
    >
      <div className="flex justify-between items-start gap-5">
        <div className="flex flex-col justify-start items-start gap-1">
          <h4 className="text-neutral-950 text-sm font-medium font-text leading-5">
            {title}
          </h4>
          <span className="text-gray-500 text-xs font-normal font-text leading-4">
            Submitted on ${dateSubmitted}
          </span>
        </div>
        <div className="flex flex-col justify-start items-end gap-2">
          <span className="text-neutral-950 text-base font-medium font-text leading-5">
            {formatNumberToUSD(price)}
          </span>
          <span
            className="py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4"
            style={{ color: textColor, backgroundColor: bgColor }}
          >
            {label}
          </span>
        </div>
      </div>
      <div>
        <span className="justify-start text-gray-700 text-xs font-normal font-['DM_Sans'] leading-5">
          {description}
        </span>
      </div>
    </div>
  );
};
