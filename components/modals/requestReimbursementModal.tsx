'use client'

import { useCallback } from "react";
import { ModifyTripModalProps } from "../modifyTripModal/types";
import ModalWrapper from "./modalWrapper";
import RequestReimbursementForm from "../forms/requestReimbursementForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function RequestReimbursementModal({ rentals }: ModifyTripModalProps ) {
        
        const searchParams = useSearchParams();
        const router = useRouter();
        const pathname = usePathname();

        const reimbursementId = searchParams.get("reimbursement");
        const rental = rentals?.find((r) => r.id === reimbursementId);

        const handleClose = useCallback(() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("reimbursement");
                const query = params.toString();
                router.push(query ? `${pathname}?${query}` : pathname);
        }, [searchParams, router, pathname]);

        if (!reimbursementId || !rental) return null;

        return (
                <ModalWrapper
                        title="Request Reimbursement"
                        description="Submit a request for expenses incurred during your trip. Your host will review and respond."
                        handleClose={handleClose}
                >
                        <RequestReimbursementForm 
                                tripId={rental.rentId}
                        />
                </ModalWrapper>
        )
}