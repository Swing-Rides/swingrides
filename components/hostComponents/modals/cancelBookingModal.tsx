import { AlertTriangle } from 'lucide-react';
import HostModalWrapper from './hostModalsWrapper'

type CancelBookingModalProps = {
    bookingId: string;
    handleClose: () => void;
    handleCancelBooking: () => void;
    isLoading?: boolean;
};

export default function CancelBookingModal({bookingId, handleClose, handleCancelBooking, isLoading = false}: CancelBookingModalProps) {
    
    if (!bookingId || bookingId === "") {
        return null;
    }
    
    return (
        <HostModalWrapper
            title="Cancel booking"
            description={bookingId}
            handleClose={handleClose}
            maxWidthStyle="max-w-xl"
        >
            <div className='space-y-3'>
                <div className='flex justify-start items-center gap-2'>
                    <AlertTriangle className='size-5 text-red-500' />
                    <h3 className="text-red-500 text-xl font-semibold font-text">
                        Are you sure you want to cancel this booking?
                    </h3>
                </div>
                <span className='block text-zinc-700 text-sm font-normal font-text'>
                    This action will cancel the booking, notify the renter by email and in-app notification, and make the vehicle available for booking immediately.
                </span>
                <div className="flex justify-end items-center gap-3 pt-4">
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-6 py-2 border border-neutral-700 rounded-xs text-neutral-700 text-sm font-medium font-text hover:bg-neutral-700 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCancelBooking}
                        disabled={isLoading}
                        className="px-6 py-2 bg-red-500 text-white text-sm font-semibold font-text rounded-xs border border-red-500 hover:bg-red-900 transition-colors duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Cancelling..." : "Confirm Cancel"}
                    </button>
                </div>
            </div>
        </HostModalWrapper>
    )
}
