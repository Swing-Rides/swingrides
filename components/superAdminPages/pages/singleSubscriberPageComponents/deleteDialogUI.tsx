import {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DeleteDialogUIProps } from "./subscriberDetail.types";

export default function DeleteDialogUI({
        open,
        onOpenChange,
        name,
        dataType,
        onConfirm,
}: DeleteDialogUIProps) {
        return (
                <AlertDialog open={open} onOpenChange={onOpenChange}>
                        <AlertDialogContent>
                                <AlertDialogHeader>
                                        <AlertDialogTitle className="text-neutral-950 text-lg font-semibold font-text leading-7">
                                                Delete {dataType}?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                                <span className="text-gray-500 text-sm font-normal font-text leading-5">
                                                        You are about to permanently remove{" "}
                                                        <span className="font-semibold text-neutral-900">{name}</span>{" "}
                                                        from the platform. This action cannot be undone.
                                                </span>
                                        </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                                onClick={onConfirm}
                                                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                        >
                                                Yes, delete
                                        </AlertDialogAction>
                                </AlertDialogFooter>
                        </AlertDialogContent>
                </AlertDialog>
        );
}