"use client";

import { memo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import { BookingsStatus } from "./types";
import IncidentAction from "./incidentAction";
import CancelBookingAction from "./cancelBookingAction";

type PageHeaderProps = {
  id: string;
  status: BookingsStatus;
  rawStatus?: string;
  referenceCode: string;
  renterName: string;
  vehicleName: string;
  renterEmail: string;
  renterPhoneNumber: string;
};

export const statusStyles: Record<BookingsStatus, string> = {
  active: "text-emerald-500 bg-green-100",
  completed: "text-white bg-black",
  reserved: "text-gray-500 bg-neutral-200",
  confirmed: "text-blue-500 bg-sky-100",
  cancelled: "text-red-500 bg-rose-100",
  overdue: "text-red-500 bg-rose-100",
  runningLate: "text-red-500 bg-rose-100",
};

function PageHeader({
  id,
  status,
  rawStatus,
  referenceCode,
  renterName,
  vehicleName,
  renterEmail,
  renterPhoneNumber,
}: PageHeaderProps) {
  const statusStyle = statusStyles[status] || "text-amber-500 bg-amber-100";

  // "active" covers both `checked_in` (checked in, but the check-in wizard
  // hasn't been completed yet) and `in_progress` (check-in fully completed,
  // now awaiting checkout) - the raw status is what tells those two apart.
  const needsCheckIn =
    status === "confirmed" || rawStatus === "checked_in";
  const needsCheckOut = rawStatus === "in_progress";

  return (
    <>
      <div className="flex flex-col gap-4">
        <Link
          href={`${HOST_DASHBOARD_PATH}bookings`}
          className="flex justify-start items-center gap-2 text-gray-500 hover:text-gray-900 duration-300 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span className="text-center text-sm font-medium font-text">
            Back to Bookings
          </span>
        </Link>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">
          <div className="flex flex-col justify-start items-start gap-2">
            <div className="flex justify-start items-start">
              <h2 className="text-neutral-950 text-2xl font-bold font-text">
                Booking Details
              </h2>
            </div>
            <div className="flex justify-start items-center gap-3">
              <span className="justify-start text-cyan-600 text-base font-medium font-text">
                {id}
              </span>
              <span
                className={`py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4 capitalize ${statusStyle}`}
              >
                {status}
              </span>
            </div>
          </div>

          <div className="flex justify-start items-center gap-3">
            {["active", "completed"].includes(status) && (
              <IncidentAction
                id={id}
                referenceCode={referenceCode}
                renterName={renterName}
                vehicleName={vehicleName}
                renterEmail={renterEmail}
                status={status}
              />
            )}
            {["active", "reserved", "runningLate", "confirmed"].includes(status) && (
              <CancelBookingAction 
                id={id}
              />
            )}
            {needsCheckIn && (
              <Link
                href={`${HOST_DASHBOARD_PATH}bookings/${id}/complete-check-in`}
                className="bg-blue-700 text-white text-sm font-semibold font-text leading-5 px-6 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 transition-colors duration-300 cursor-pointer"
              >
                Complete Check-In
              </Link>
            )}
            {needsCheckOut && (
              <Link
                href={`${HOST_DASHBOARD_PATH}bookings/${id}/complete-check-out`}
                className="bg-blue-700 text-white text-sm font-semibold font-text leading-5 px-6 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 transition-colors duration-300 cursor-pointer"
              >
                Complete Checkout
              </Link>
            )}
            {["overdue", "runningLate"].includes(status) && (
              <Link
                href={`tel:${renterPhoneNumber}`}
                className="bg-blue-700 text-white text-sm font-semibold font-text leading-5 px-6 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 transition-colors duration-300 cursor-pointer"
              >
                Contact renter
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(PageHeader);