'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Rentals } from '../pages/profilePages/types'
import { X } from 'lucide-react'
import GuestCheckInForm, { GuestCheckInFormValues } from '../forms/guestCheckInForm'

type StartVehicleCheckInProps = {
        rentals?: Rentals[];
        carName: string;
        plateNumber: string;
        onComplete: (updatedRentals: Rentals[]) => void
}

export default function StartVehicleCheckIn({ rentals, carName, plateNumber, onComplete }: StartVehicleCheckInProps) {

        const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false)

        const searchParams = useSearchParams()
        const router = useRouter()
        const pathname = usePathname()

        const checkInId = searchParams.get('checkIn')
        const rental = rentals?.find(r => r.rentId === checkInId && r.status === 'Upcoming')

        const handleClose = useCallback(() => {
                const params = new URLSearchParams(searchParams.toString())
                params.delete('checkIn')
                const query = params.toString()
                router.push(query ? `${pathname}?${query}` : pathname)
        }, [searchParams, router, pathname])

        
        const handleConfirm = useCallback(
                (values: GuestCheckInFormValues) => {
                        setIsSubmitting(true)
                        console.log(values)

                        if (!checkInId || !rentals) return

                        const updatedRentals = rentals.map((r) =>
                                r.rentId === checkInId && r.status === "Active"
                                        ? { ...r, status: "Completed" as const }
                                        : r
                        )

                        onComplete(updatedRentals)
                        setIsSubmitting(false)
                        handleClose()
                },
                [checkInId, rentals, onComplete, handleClose]
        )

        if (!checkInId || !rental) return null

        return (
                <div
                        className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
                        onClick={handleClose}
                >
                        <div
                                className='relative bg-white rounded-[10px] shadow-xl w-full max-w-lg mx-4 p-6 flex flex-col gap-5 max-h-[90vh]'
                                onClick={(e) => e.stopPropagation()}
                        >
                                {/* Header */}
                                <div className='sticky top-0 left-0 border-b pb-3 md:pb-5 bg-white flex items-center justify-between'>
                                        <div className='flex flex-col gap-0.5'>
                                                <h2 className='text-[#1F2937] text-lg font-bold font-text leading-6'>
                                                        Start Check-In
                                                </h2>
                                                <span className='text-gray-500 text-xs font-normal font-text'>
                                                        {carName} · {plateNumber}
                                                </span>
                                        </div>
                                        <button
                                                onClick={handleClose}
                                                className='text-gray-500 hover:text-neutral-950 transition-colors duration-300 cursor-pointer'
                                                aria-label='Close modal'
                                        >
                                                <X className='size-4' />
                                        </button>
                                </div>

                                <div className='flex flex-col gap-5 px-0.5 overflow-y-auto'>
                                        <p className="text-gray-500 text-xs font-normal font-text leading-5">
                                                Upload vehicle condition photos and confirm mileage and fuel level. This protects both you and the host.
                                        </p>

                                        {/* Form */}
                                        <GuestCheckInForm
                                                onClose={handleClose}
                                                onSubmit={handleConfirm}
                                                isSubmitting={isSubmitting} 
                                        />
                                </div>
                        </div>
                </div>
        )
}
