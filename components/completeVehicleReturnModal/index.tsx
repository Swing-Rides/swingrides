'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Rentals } from '../pages/profilePages/types'
import { LucideMoveRight, X } from 'lucide-react'
import ReturnVehicleForm, { ReturnVehicleFormValues } from '../forms/returnVehicleForm'

type CompleteVehicleReturnModalProps = {
        rentals?: Rentals[];
        carName: string;
        plateNumber: string;
        pickUpDate: string; 
        returnDate: string;
        onComplete: (updatedRentals: Rentals[]) => void
}

export default function CompleteVehicleReturnModal({ rentals, carName, plateNumber, pickUpDate, returnDate, onComplete }: CompleteVehicleReturnModalProps) {

        const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false)

        const searchParams = useSearchParams()
        const router = useRouter()
        const pathname = usePathname()

        const returnId = searchParams.get('return')
        const rental = rentals?.find(r => r.rentId === returnId && r.status === 'Active')

        const handleClose = useCallback(() => {
                const params = new URLSearchParams(searchParams.toString())
                params.delete('return')
                const query = params.toString()
                router.push(query ? `${pathname}?${query}` : pathname)
        }, [searchParams, router, pathname])

        const handleConfirm = useCallback(
                (values: ReturnVehicleFormValues) => {
                        setIsSubmitting(true)
                        console.log(values)

                        if (!returnId || !rentals) return

                        const updatedRentals = rentals.map((r) =>
                                r.rentId === returnId && r.status === "Active"
                                        ? { ...r, status: "Completed" as const }
                                        : r
                        )

                        onComplete(updatedRentals)
                        setIsSubmitting(false)
                        handleClose()
                },
                [returnId, rentals, onComplete, handleClose]
        )

        if (!returnId || !rental) return null

        return (
                <div
                        className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
                        onClick={handleClose}
                >
                        <div
                                className='relative bg-white rounded-[10px] shadow-xl w-full max-w-lg mx-4 p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto'
                                onClick={(e) => e.stopPropagation()}
                        >
                                {/* Header */}
                                <div className='sticky top-0 left-0 border-b pb-3 md:pb-5 bg-white flex items-center justify-between'>
                                        <div className='flex flex-col gap-0.5'>
                                                <h2 className='text-[#1F2937] text-lg font-bold font-text leading-6'>
                                                        Complete Vehicle Return
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

                                <p className="text-gray-500 text-xs font-normal font-text leading-5">
                                        Upload return condition photos and confirm mileage and fuel level. This protects both you and the host.
                                </p>

                                {/* Trip summary */}
                                <div className='flex justify-between p-3 bg-[#F9FAFB] rounded-lg'>
                                        <div className='flex flex-col gap-0.5'>
                                                <span className='text-gray-500 text-xs font-normal font-text'>Pickup</span>
                                                <span className='text-neutral-950 text-sm font-semibold font-text'>{pickUpDate}</span>
                                        </div>
                                        <LucideMoveRight className='size-4 text-gray-500'/>
                                        <div className='flex flex-col gap-0.5 items-end'>
                                                <span className='text-gray-500 text-xs font-normal font-text'>Return</span>
                                                <span className='text-neutral-950 text-sm font-semibold font-text'>{returnDate}</span>
                                        </div>
                                </div>

                                {/* Form */}
                                <ReturnVehicleForm
                                        onClose={handleClose}
                                        onSubmit={handleConfirm}
                                        isSubmitting={isSubmitting}
                                />
                        </div>
                </div>
        )
}