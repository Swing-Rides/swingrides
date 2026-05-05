'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Rentals } from '../pages/profilePages/types'
import { cancelRental } from '../pages/profilePages/utils'

type CancelTripDialogProps = {
        rentals?: Rentals[]
        onCancel: (updatedRentals: Rentals[]) => void
}

export default function CancelTripDialog({ rentals, onCancel }: CancelTripDialogProps) {
        
        const searchParams = useSearchParams()
        const router = useRouter()
        const pathname = usePathname()

        const cancelId = searchParams.get('cancel')
        const rental = rentals?.find(r => r.rentId === cancelId && r.status === 'Upcoming')

        const handleClose = useCallback(() => {
                const params = new URLSearchParams(searchParams.toString())
                params.delete('cancel')
                const query = params.toString()
                router.push(query ? `${pathname}?${query}` : pathname)
        }, [searchParams, router, pathname])

        const handleConfirm = useCallback(() => {
                if (!cancelId || !rentals) return
                const updatedRentals = cancelRental(rentals, cancelId)
                onCancel(updatedRentals)
                handleClose()
        }, [cancelId, rentals, onCancel, handleClose])

        // Only Upcoming rentals can be cancelled — if rental not found or not Upcoming, silently dismiss
        if (!cancelId || !rental) return null

        return (
                <AlertDialog open={!!cancelId && !!rental} onOpenChange={(open) => { if (!open) handleClose() }}>
                        <AlertDialogContent>
                                <AlertDialogHeader>
                                        <AlertDialogTitle>
                                                Cancel this trip?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription asChild>
                                                <div className='flex flex-col gap-3'>
                                                        <span>
                                                                This action cannot be undone. The following trip will be permanently cancelled.
                                                        </span>
                                                        <div className='flex flex-col gap-2 p-3 bg-[#FFF5F5] border border-[#FFE9E9] rounded-lg'>
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
                                                                                Booking ID
                                                                        </span>
                                                                        <span className='text-cyan-600 text-xs font-normal font-text'>
                                                                                {rental.rentId}
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
                                                        </div>
                                                </div>
                                        </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                        <AlertDialogCancel onClick={handleClose}>
                                                Keep trip
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                                onClick={handleConfirm}
                                                className='bg-[#EF4444] text-white hover:bg-[#DC2626] border-transparent'
                                        >
                                                Yes, cancel trip
                                        </AlertDialogAction>
                                </AlertDialogFooter>
                        </AlertDialogContent>
                </AlertDialog>
        )
}
