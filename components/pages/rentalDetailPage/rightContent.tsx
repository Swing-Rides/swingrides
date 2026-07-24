"use client";

import { memo, useState, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TripStatus } from "../profilePages/types";
import { ManageBookingButtonConfig, ManageBookingCardProps } from "./types";
import {
  BanknoteArrowUp,
  Car,
  PenLine,
  PhoneCall,
  Repeat,
  ThumbsUp,
  X,
} from "lucide-react";
import ModifyTripModal from "@/components/modifyTripModal";
import CancelTripDialog from "@/components/cancelTripDialog";
import CompleteVehicleReturnModal from "@/components/completeVehicleReturnModal";
import { Rentals } from "../profilePages/types";
import StartVehicleCheckIn from "@/components/startVehicleCheckInModal";
import RequestReimbursementModal from "@/components/modals/requestReimbursementModal";
import ReportVehicleDamageModal from "@/components/modals/reportVehicleDamageModal";

export default function RightContent({
  rentals: initialRentals,
}: ManageBookingCardProps) {
  const [rental, setRental] = useState<Rentals | undefined>(initialRentals);

  const rentalsAsArray = rental ? [rental] : undefined;

  // const handleCancel = useCallback((updatedRental: Rentals) => {
  //   setRental(updatedRental);
  // }, []);

  const handleComplete = useCallback((updatedRental: Rentals) => {
    setRental(updatedRental);
  }, []);

  const handleCheckIn = useCallback((updatedRental: Rentals) => {
    setRental(updatedRental);
  }, []);

  if (!rental) return null;

  const status = rental.status;
  const isUpcoming = status === "Upcoming";
  const isActive = status === "Active";
  const isCompleted = status === "Completed";


  return (
    <div className="col-span-1 md:col-span-5 w-full space-y-3 md:space-y-6">
      <div className="w-full">
        <Suspense>
          <ManageBookingCard rentals={rental} />
        </Suspense>
      </div>

      {(isActive || isCompleted) && (
        <div>
          <ReportVehicleDamageCard rentals={rental} />
        </div>
      )}

      {isUpcoming && (
        <Suspense>
          <StartVehicleCheckIn rentals={rentalsAsArray} onComplete={handleCheckIn} />
        </Suspense>
      )}

      {isUpcoming && (
        <Suspense>
          <ModifyTripModal rentals={rentalsAsArray} />
        </Suspense>
      )}

      {isUpcoming && (
        <Suspense>
          <CancelTripDialog rentals={rentalsAsArray} />
        </Suspense>
      )}

      {isActive && (
        <Suspense>
          <CompleteVehicleReturnModal rentals={rentalsAsArray} onComplete={handleComplete} />
        </Suspense>
      )}

      {(isActive || isCompleted) && (
        <Suspense>
          <RequestReimbursementModal rentals={rentalsAsArray} />
        </Suspense>
      )}

      {(isActive || isCompleted) && (
        <Suspense>
          <ReportVehicleDamageModal
            rentals={rentalsAsArray} 
          />
        </Suspense>
      )}
    </div>
  );
}

export const getManageBookingButtons = (
  status: TripStatus,
  rentId: string,
  currentParams: string,
  contactNumber: string,
  carId: string,
): ManageBookingButtonConfig[] => {

  const checkInParams = new URLSearchParams(currentParams);
  checkInParams.set("checkIn", rentId);

  const modifyParams = new URLSearchParams(currentParams);
  modifyParams.set("modify", rentId);

  const returnParams = new URLSearchParams(currentParams);
  returnParams.set("return", rentId);

  const reimbursementParams = new URLSearchParams(currentParams);
  reimbursementParams.set("reimbursement", rentId);

  const refundParams = new URLSearchParams(currentParams);
  refundParams.set("refund", rentId);

  const completedStyle =
    "bg-blue-700 text-white border-blue-700 hover:bg-blue-950 hover:border-blue-950";
  const checkInStyle =
    "bg-blue-700 text-white border-blue-700 hover:bg-blue-950";
  const modifyStyle =
    "bg-transparent text-blue-700 border-blue-700 hover:bg-blue-950 hover:border-blue-950 hover:text-white";
  const cancelStyle =
    "bg-transparent text-red-500 border-red-500 hover:bg-red-500 hover:text-white";
  const contactStyle =
    "bg-transparent text-zinc-800 border-zinc-800 hover:bg-zinc-800 hover:text-white";
  const reportStyle =
    "bg-red-500 text-white border-red-500 hover:bg-red-900 hover:border-red-900";

  switch (status) {
    case "Upcoming":
      return [
        {
          icon: <Car className="w-4" />,
          label: "Start Check-In",
          href: `?${checkInParams.toString()}`,
          className: checkInStyle,
        },
        {
          icon: <PenLine className="w-4" />,
          label: "Modify",
          href: `?${modifyParams.toString()}`,
          className: modifyStyle,
        },
        {
          icon: <X className="w-4" />,
          label: "Cancel",
          href: `?${(() => {
            const p = new URLSearchParams(currentParams);
            p.set("cancel", rentId);
            return p.toString();
          })()}`,
          className: cancelStyle,
        },
        {
          icon: <PhoneCall className="w-4" />,
          label: "Contact Host",
          href: `tel:${contactNumber}`,
          className: contactStyle,
        },
      ];
    case "Active":
      return [
        {
          icon: <Car className="w-4" />,
          label: "Complete Vehicle Return",
          href: `?${returnParams.toString()}`,
          className: completedStyle,
        },
        {
          icon: <PhoneCall className="w-4" />,
          label: "Contact Host",
          href: `tel:${contactNumber}`,
          className: contactStyle,
        },
        {
          icon: <BanknoteArrowUp className="size-4" />,
          label: "Request Reimbursement",
          href: `?${reimbursementParams.toString()}`,
          className: reportStyle,
        },
      ];
    case "Completed":
      return [
        {
          icon: <Repeat className="w-4" />,
          label: "Book Again",
          href: `/browse-cars/${carId}`,
          className: modifyStyle,
        },
        {
          icon: <ThumbsUp className="w-4" />,
          label: "Rate Trip",
          href: `/trip/${rentId}/rate`,
          className: completedStyle,
        },
        {
          icon: <BanknoteArrowUp className="size-4" />,
          label: "Request Reimbursement",
          href: `?${reimbursementParams.toString()}`,
          className: reportStyle,
        },
        {
          icon: <PhoneCall className="w-4" />,
          label: "Contact Host",
          href: `tel:${contactNumber}`,
          className: contactStyle,
        },
      ];
    case "Cancelled":
      return [
        {
          icon: <BanknoteArrowUp className="size-4" />,
          label: "Request Refund",
          href: `?${refundParams.toString()}`,
          className: reportStyle,
        },
        {
          icon: <PhoneCall className="size-4" />,
          label: "Contact Host",
          href: `tel:${contactNumber}`,
          className: contactStyle,
        },
      ];
    default:
      return [];
  }
};

const ManageBookingCard = memo(({ rentals }: ManageBookingCardProps) => {
  const searchParams = useSearchParams();

  if (!rentals) return null;

  const buttons = getManageBookingButtons(
    rentals.status,
    rentals.id,
    searchParams.toString(),
    rentals.host.contactNumber,
    rentals.car.carId
  );

  return (
    <div className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200">
      <div className="flex flex-col gap-3 pb-3 mb-3 border-b border-gray-300">
        <h3 className="text-neutral-950 text-base font-semibold font-text leading-6">
          Manage Booking
        </h3>
        <span className="text-gray-500 text-xs font-normal font-text leading-5">
          Use this when returning the vehicle to your host. You will be asked to
          upload return photos, mileage, and fuel level.
        </span>
      </div>
      <Suspense>
        <div className="flex flex-col gap-3">
          {buttons.map((item) => (
            <ManageBookingButton
              key={item.label}
              icon={item.icon}
              href={item.href}
              className={item.className}
              label={item.label}
            />
          ))}
        </div>
      </Suspense>
    </div>
  );
});
ManageBookingCard.displayName = "ManageBookingCard";

const ManageBookingButton = memo(
  ({ href, className, label, icon }: ManageBookingButtonConfig) => {
    return (
      <Link href={href}>
        <button
          className={`flex gap-2 justify-center items-center w-full px-6 py-2.5 rounded-xs border cursor-pointer duration-300 transition-colors ${className}`}
        >
          {icon}
          <span>{label}</span>
        </button>
      </Link>
    );
  },
);
ManageBookingButton.displayName = "ManageBookingButton";

const ReportVehicleDamageCard = memo(({ rentals }: ManageBookingCardProps) => {

  if (!rentals) return null;

  const tripId = rentals.id

  return (
    <div className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200">
      <div className="flex flex-col gap-3 pb-3 border-b border-gray-300">
        <h3 className="text-blue-700 text-base font-semibold font-text leading-6">
          Report Vehicle Damage
        </h3>
        <span className="text-gray-500 text-xs font-normal font-text leading-5">
          Notify your host about any damage during your trip.
        </span>
      </div>

      <Link 
        href={`?reportVehicleDamage=${tripId}`}
        className="flex gap-2 justify-center items-center w-full px-6 py-2.5 rounded-xs border bg-black text-white border-black hover:bg-black/80 hover:border-black/80 duration-300 transition-colors"
      >
        <PhoneCall className="size-4 text-white"/>
        <span>
          Report Damage
        </span>
      </Link>
    </div>
  );
});
ReportVehicleDamageCard.displayName = "ReportVehicleDamageCard";