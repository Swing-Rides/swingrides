'use client'

import { memo, useState, Suspense, useCallback } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { TripStatus } from "../profilePages/types"
import { ManageBookingButtonConfig, ManageBookingCardProps } from "./types"
import { Car, ClipboardPen, PenLine, PhoneCall, Repeat, ThumbsUp, X } from "lucide-react"
import ModifyTripModal from "@/components/modifyTripModal"
import CancelTripDialog from "@/components/cancelTripDialog"
import CompleteVehicleReturnModal from "@/components/completeVehicleReturnModal"
import { Rentals } from "../profilePages/types"
import StartVehicleCheckIn from "@/components/startVehicleCheckInModal"


export default function RightContent({ rentals: initialRentals }: ManageBookingCardProps) {

        const [rental, setRental] = useState<Rentals | undefined>(initialRentals)

        const rentalsAsArray = rental ? [rental] : undefined

        const handleCancel = useCallback((updatedRentals: Rentals[]) => {
                const updated = updatedRentals.find(r => r.rentId === rental?.rentId)
                if (updated) setRental(updated)
        }, [rental?.rentId])

        const handleComplete = useCallback((updatedRentals: Rentals[]) => {
                const updated = updatedRentals.find(r => r.rentId === rental?.rentId)
                if (updated) setRental(updated)
        }, [rental?.rentId])

        const handleCheckIn = useCallback((updatedRentals: Rentals[]) => {
                const updated = updatedRentals.find(r => r.rentId === rental?.rentId)
                if (updated) setRental(updated)
        }, [rental?.rentId])

        return (
                <>
                        <div className="col-span-1 md:col-span-5 w-full">
                                <Suspense>
                                        <ManageBookingCard
                                                rentals={rental}
                                        />
                                </Suspense>
                        </div>

                        <Suspense>
                                <ModifyTripModal rentals={rentalsAsArray} />
                        </Suspense>

                        <Suspense>
                                <CancelTripDialog
                                        rentals={rentalsAsArray}
                                        onCancel={handleCancel}
                                />
                        </Suspense>

                        <Suspense>
                                <StartVehicleCheckIn 
                                        rentals={rentalsAsArray}
                                        carName={"Toyota"}
                                        plateNumber={"ABC-123-NY"}
                                        onComplete={handleCheckIn}
                                />
                        </Suspense>

                        <Suspense>
                                <CompleteVehicleReturnModal
                                        rentals={rentalsAsArray}
                                        carName={"Toyota"}
                                        plateNumber={"ABC-123-NY"}
                                        pickUpDate={"May 12, 2026"}
                                        returnDate={"June 2, 2026"}
                                        onComplete={handleComplete}
                                />
                        </Suspense>
                </>
        )
}

export const getManageBookingButtons = (
        status: TripStatus,
        rentId: string,
        currentParams: string,
        contactNumber: string
): ManageBookingButtonConfig[] => {

        const checkInParams = new URLSearchParams(currentParams)
        checkInParams.set('checkIn', rentId)

        const modifyParams = new URLSearchParams(currentParams)
        modifyParams.set('modify', rentId)

        const returnParams = new URLSearchParams(currentParams)
        returnParams.set('return', rentId)

        const completedStyle = "bg-[#1A56DB] text-white border-[#1A56DB] hover:bg-transparent hover:text-[#1A56DB]"
        const checkInStyle = "bg-blue-700 text-white border-blue-700 hover:bg-blue-950"
        const modifyStyle = "bg-transparent text-[#1A56DB] border-[#1A56DB] hover:bg-[#1A56DB] hover:text-white"
        const cancelStyle = "bg-transparent text-[#EF4444] border-[#EF4444] hover:bg-[#EF4444] hover:text-white"
        const contactStyle = "bg-transparent text-[#333333] border-[#333333] hover:bg-[#333333] hover:text-white"
        const reportStyle = "bg-[#EF4444] text-white border-[#EF4444] hover:bg-red-900"

        switch (status) {
                case 'Upcoming':
                        return [
                                {
                                        icon: <Car className="w-4" />,
                                        label: 'Start Check-In',
                                        href: `?${checkInParams.toString()}`,
                                        className: checkInStyle,
                                },
                                {
                                        icon: <PenLine className="w-4" />,
                                        label: 'Modify',
                                        href: `?${modifyParams.toString()}`,
                                        className: modifyStyle,
                                },
                                {
                                        icon: <X className="w-4" />,
                                        label: 'Cancel',
                                        href: `?${(() => { const p = new URLSearchParams(currentParams); p.set('cancel', rentId); return p.toString() })()}`,
                                        className: cancelStyle,
                                },
                                {
                                        icon: <PhoneCall className="w-4" />,
                                        label: 'Contact Host',
                                        href: `tel:${contactNumber}`,
                                        className: contactStyle,
                                },
                        ]
                case 'Active':
                        return [
                                {
                                        icon: <Car className="w-4" />,
                                        label: 'Complete Vehicle Return',
                                        href: `?${returnParams.toString()}`,
                                        className: completedStyle,
                                },
                                {
                                        icon: <PhoneCall className="w-4" />,
                                        label: 'Contact Host',
                                        href: `tel:${contactNumber}`,
                                        className: contactStyle,
                                },
                        ]
                case 'Completed':
                        return [
                                {
                                        icon: <Repeat className="w-4" />,
                                        label: 'Book Again',
                                        href: `/trip/${rentId}`,
                                        className: modifyStyle,
                                },
                                {
                                        icon: <ThumbsUp className="w-4" />,
                                        label: 'Rate Trip',
                                        href: `/trip/${rentId}/rate`,
                                        className: completedStyle,
                                },
                                {
                                        icon: <PhoneCall className="w-4" />,
                                        label: 'Contact Host',
                                        href: `tel:${contactNumber}`,
                                        className: contactStyle,
                                },
                        ]
                case 'Cancelled':
                        return [
                                {       
                                        icon: <ClipboardPen className="w-4" />,
                                        label: 'Submit A Report',
                                        href: `tel:${contactNumber}`,
                                        className: reportStyle,
                                },
                                {
                                        icon: <PhoneCall className="w-4" />,
                                        label: 'Contact Host',
                                        href: `tel:${contactNumber}`,
                                        className: contactStyle
                                },
                        ]
                default:
                        return []
        }
}

const ManageBookingCard = memo(({ rentals }: ManageBookingCardProps) => {
        const searchParams = useSearchParams()

        if (!rentals) return null 

        const buttons = getManageBookingButtons(
                rentals.status,
                rentals.rentId,
                searchParams.toString(),
                rentals.host.contactNumber
        )
        return (
                <div className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200">
                        <div className="flex flex-col gap-3 pb-3 border-b border-[#E5E7EB]">
                                <h3 className="text-[#0B0B0B] text-base font-semibold font-text leading-6">
                                        Manage Booking
                                </h3>
                                <span className="text-gray-500 text-xs font-normal font-text leading-5">
                                        Use this when returning the vehicle to your host. You will be asked to upload return photos, mileage, and fuel level.
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
        )
})
ManageBookingCard.displayName = "ManageBookingCard"

const ManageBookingButton = memo(({ href, className, label, icon }: ManageBookingButtonConfig ) => {
        return (
                <Link
                        href={href}
                >
                        <button className={`flex gap-2 justify-center items-center w-full px-36 py-3 rounded-xs border cursor-pointer duration-300 transition-colors ${className}`}>
                                {icon}
                                <span>
                                        {label}
                                </span>
                        </button>
                </Link>
        )
})
ManageBookingButton.displayName = "ManageBookingButton"