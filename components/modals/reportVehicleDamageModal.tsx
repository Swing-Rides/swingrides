import { useCallback } from "react";
import { ModifyTripModalProps } from "../modifyTripModal/types";
import ModalWrapper from "./modalWrapper";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ReportVehicleDamageForm from "../forms/reportVehicleDamageForm";

export default function ReportVehicleDamageModal({ rentals }: ModifyTripModalProps ) {
        
        const searchParams = useSearchParams();
        const router = useRouter();
        const pathname = usePathname();

        const reportVehicleDamageId = searchParams.get("reportVehicleDamage");
        const rental = rentals?.find((r) => r.id === reportVehicleDamageId);

        const handleClose = useCallback(() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("reportVehicleDamage");
                const query = params.toString();
                router.push(query ? `${pathname}?${query}` : pathname);
        }, [searchParams, router, pathname]);

        if (!reportVehicleDamageId || !rental) return null;

        return (
                <ModalWrapper
                        title="Report Vehicle Damage"
                        description="Notify your host about any damage during your trip."
                        handleClose={handleClose}
                >
                        <ReportVehicleDamageForm
                                tripId={rental.rentId}
                        />
                </ModalWrapper>
        )
}