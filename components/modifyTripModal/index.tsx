'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'


type ModifyTripModalProps = {
        rentals?: {
                rentId: string
                pickUpDate: string
                returnDate: string
                price: number
                car: {
                        carName: string
                        plateNumber: string
                }
        }[]
}

export default function ModifyTripModal({ rentals }: ModifyTripModalProps) {

        const searchParams = useSearchParams()
        const router = useRouter()
        const pathname = usePathname()

        const modifyId = searchParams.get('modify')
        const rental = rentals?.find(r => r.rentId === modifyId)

        const handleClose = useCallback(() => {
                const params = new URLSearchParams(searchParams.toString())
                params.delete('modify')
                const query = params.toString()
                router.push(query ? `${pathname}?${query}` : pathname)
        }, [searchParams, router, pathname])

        if (!modifyId || !rental) return null

        return (
                <div
                        className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
                        onClick={handleClose}
                >
                        <div
                                className='relative bg-white rounded-[10px] shadow-xl w-full max-w-md mx-4 p-6 flex flex-col gap-5'
                                onClick={(e) => e.stopPropagation()}
                        >
                                {/* Header */}
                                <div className='flex items-center justify-between'>
                                        <h2 className='text-[#1F2937] text-lg font-bold font-text leading-6'>
                                                Modify Trip
                                        </h2>
                                        <button
                                                onClick={handleClose}
                                                className='text-[#6B7280] hover:text-[#1F2937] transition-colors duration-200 cursor-pointer'
                                                aria-label='Close modal'
                                        >
                                                <CloseIcon />
                                        </button>
                                </div>

                                {/* Trip summary */}
                                <div className='flex flex-col gap-2 p-4 bg-[#F9FAFB] rounded-lg'>
                                        <div className='flex justify-between items-center'>
                                                <span className='text-[#6B7280] text-xs font-normal font-text'>
                                                        Vehicle
                                                </span>
                                                <span className='text-[#1F2937] text-sm font-semibold font-text'>
                                                        {rental.car.carName}
                                                </span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                                <span className='text-[#6B7280] text-xs font-normal font-text'>
                                                        Plate
                                                </span>
                                                <span className='text-[#1F2937] text-sm font-semibold font-text'>
                                                        {rental.car.plateNumber}
                                                </span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                                <span className='text-[#6B7280] text-xs font-normal font-text'>
                                                        Pickup
                                                </span>
                                                <span className='text-[#1F2937] text-sm font-semibold font-text'>
                                                        {rental.pickUpDate}
                                                </span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                                <span className='text-[#6B7280] text-xs font-normal font-text'>
                                                        Return
                                                </span>
                                                <span className='text-[#1F2937] text-sm font-semibold font-text'>
                                                        {rental.returnDate}
                                                </span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                                <span className='text-[#6B7280] text-xs font-normal font-text'>
                                                        Daily rate
                                                </span>
                                                <span className='text-[#1F2937] text-sm font-semibold font-text'>
                                                        {rental.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                                </span>
                                        </div>
                                </div>

                                {/* Actions */}
                                <div className='flex gap-3 justify-end'>
                                        <button
                                                onClick={handleClose}
                                                className='text-sm font-medium font-text leading-5 border border-[#E5E7EB] text-[#6B7280] rounded-xs py-2 px-4 bg-transparent hover:bg-[#F3F4F6] transition-colors duration-200 cursor-pointer'
                                        >
                                                Discard
                                        </button>
                                        <button
                                                className='text-sm font-medium font-text leading-5 border border-[#1A56DB] text-white rounded-xs py-2 px-4 bg-[#1A56DB] hover:bg-[#1E429F] transition-colors duration-200 cursor-pointer'
                                        >
                                                Save changes
                                        </button>
                                </div>
                        </div>
                </div>
        )
}

const CloseIcon = () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
)