"use client";

import { Loader2, Unplug } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type UnlinkStripeDialogProps = {
  open: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
};

export default function UnlinkStripeDialog({
  open,
  isLoading,
  onOpenChange,
  onConfirm,
}: UnlinkStripeDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isLoading) onOpenChange(nextOpen);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-50 text-red-600">
            <Unplug />
          </AlertDialogMedia>
          <AlertDialogTitle>Unlink Stripe account?</AlertDialogTitle>
          <AlertDialogDescription>
            This will disconnect your Stripe account from SwingRides. You will
            not be able to receive payouts until you connect Stripe again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={(event) => {
              event.preventDefault();
              void onConfirm();
            }}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? "Unlinking…" : "Yes, unlink Stripe"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
