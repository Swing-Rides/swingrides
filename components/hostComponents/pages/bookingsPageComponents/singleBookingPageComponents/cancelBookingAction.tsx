import CancelBookingModal from '@/components/hostComponents/modals/cancelBookingModal';
import { useState, useCallback, memo } from 'react';
import { toast } from 'sonner';

type CancelBookingActionProps = {
    id: string;
}

function CancelBookingAction({id}: CancelBookingActionProps) {
    const [bookingId, setBookingId] = useState<string>("");

    const handleOpen = useCallback(() => setBookingId(id), [id]);
    const handleClose = useCallback(() => setBookingId(""), []);

    const handleCancelBooking = async () => {
        if (handleClose) {
            const toastId = toast.loading("Cancelling booking..."); 
            try {
                // TODO ACTION HERE API FOR CANCELLING BOOKING
                toast.success("Booking cancelled successfully!", { id: toastId });
                handleClose();
            } catch (error) {
                console.error(error);
                const message =
                    error instanceof Error ? error.message : "Please try again.";
                toast.error("Failed to cancel booking!", {
                    id: toastId,
                    description: message,
                });
            }
        } else {
            toast.error("Failed to submit charges! Please try again.");
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={handleOpen}
                className="text-center text-red-500 text-sm font-semibold font-text capitalize px-6 py-2 rounded-xs border border-red-500 hover:bg-red-900 hover:text-white transition-colors duration-300 cursor-pointer"
            >
                Cancel Booking
            </button>
            <CancelBookingModal 
                bookingId={bookingId}
                handleClose={handleClose}  
                handleCancelBooking={handleCancelBooking}
            />
        </div>
    )
}

export default memo(CancelBookingAction);
