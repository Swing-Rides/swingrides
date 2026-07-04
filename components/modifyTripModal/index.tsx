'use client'

import { DEFAULT_IMAGE_SRC } from '@/constants/constant'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import ModifyBookingForm from '../forms/modifyBookingForm'
import { ModifyTripModalProps } from './types'
import { X } from 'lucide-react'

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
                        className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
                        onClick={handleClose}
                >
                        <div
                                className='relative bg-white rounded-[10px] shadow-xl w-full max-w-md mx-4 p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto'
                                onClick={(e) => e.stopPropagation()}
                        >
                                {/* Header */}
                                <div className='flex items-center justify-between gap-5'>
                                        <div className='flex justify-start items-center gap-3'>
                                                <h2 className='text-neutral-950 text-lg font-bold font-text leading-6'>
                                                        Modify Trip
                                                </h2>
                                                <span className="text-cyan-600 text-sm font-normal font-['DM_Mono'] leading-5">
                                                        {rental.rentId}
                                                </span>
                                        </div>
                                        <button
                                                onClick={handleClose}
                                                className='text-gray-500 hover:text-neutral-950 transition-colors duration-200 cursor-pointer'
                                                aria-label='Close modal'
                                        >
                                                <X className='size-4' />
                                        </button>
                                </div>

                                <Separator />

                                <span className='text-gray-500 text-xs font-normal font-text leading-5'>
                                        You can modify your pickup date, return date, and pickup location. Changes are subject to availability.
                                </span>

                                {/* Trip summary */}
                                <div className='p-4 bg-gray-100 rounded-[10px] flex justify-start items-center gap-3'>
                                        <div className='w-14 h-10 rounded-lg flex flex-col justify-start items-start overflow-hidden'>
                                                <Image
                                                        src={rental.car.imageUrl || DEFAULT_IMAGE_SRC}
                                                        alt={rental.car.carName}
                                                        title={rental.car.carName}
                                                        width={120}
                                                        height={80}
                                                        className='aspect-15/10 w-full max-w-15 object-cover'
                                                />
                                        </div>
                                        <div className='flex flex-col justify-start items-start'>
                                                <span className='block text-gray-800 text-sm font-semibold font-text leading-5'>
                                                        {rental.car.carName}
                                                </span>
                                                <span className='flex text-gray-500 text-xs font-normal font-text leading-5'>
                                                        {rental.pickUpDate} - {rental.returnDate} · {rental.tripDurationDays} · {rental.price}
                                                </span>
                                        </div>
                                </div>

                                {/* ── Modify form ──────────────────────────── */}
                                <ModifyBookingForm
                                        rental={rental}
                                        onClose={handleClose}
                                />
                        </div>
                </div>
        )
}

