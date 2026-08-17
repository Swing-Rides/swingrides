import CancelBookingModal from '@/components/hostComponents/modals/cancelBookingModal';
import { useState, useCallback, memo } from 'react';
import { toast } from 'sonner';
import { useCancelBookingMutation } from '@/app/store/services/bookingApi';

type CancelBookingActionProps = {
    id: string;
}

function CancelBookingAction({id}: CancelBookingActionProps) {
    const [bookingId, setBookingId] = useState<string>("");
    const [cancelBooking, { isLoading }] = useCancelBookingMutation();

    const handleOpen = useCallback(() => setBookingId(id), [id]);
    const handleClose = useCallback(() => setBookingId(""), []);

    const handleCancelBooking = async () => {
        const toastId = toast.loading("Cancelling booking...");
        try {
            await cancelBooking(id).unwrap();
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
                isLoading={isLoading}
            />
        </div>
    )
}

export default memo(CancelBookingAction);
