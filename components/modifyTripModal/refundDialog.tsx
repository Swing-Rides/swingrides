import { Dispatch, SetStateAction } from "react";
import {
        Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogDescription,
        DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

type RefundDialogProps = {
        showRefundDialog: boolean;
        setShowRefundDialog: Dispatch<SetStateAction<boolean>>;
        onClose: () => void;
}
export default function ModifyTripRefundDialog({ showRefundDialog, setShowRefundDialog, onClose }: RefundDialogProps) {
        return (
                <Dialog
                        open={showRefundDialog}
                        onOpenChange={(open: boolean) => {
                                setShowRefundDialog(open);
                                if (!open) onClose();
                        }}
                >
                        <DialogContent>
                                <DialogHeader>
                                        <DialogTitle className="font-text capitalize text-lg">Booking Updated</DialogTitle>
                                        <DialogDescription>
                                                Your new duration is shorter than the original booking. Please
                                                contact your host directly to discuss any refund for the unused
                                                days — refunds aren&apos;t processed automatically.
                                        </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                        <Button
                                                type="button"
                                                onClick={() => {
                                                        setShowRefundDialog(false);
                                                        onClose();
                                                }}
                                                className="w-full bg-blue-700 hover:bg-blue-950 text-white font-medium font-text rounded-xs cursor-pointer transition-colors duration-300"
                                        >
                                                Got it
                                        </Button>
                                </DialogFooter>
                        </DialogContent>
                </Dialog>
        )
}
