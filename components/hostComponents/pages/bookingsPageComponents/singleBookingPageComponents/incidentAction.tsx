"use client";

import { memo, useState, useCallback } from "react";
import ChargeIncidentModal from "@/components/hostComponents/modals/chargeIncidentModal";
import { BookingsStatus } from "./types";
import { ChargeIncidentFormValues } from "@/components/hostComponents/forms/chargeIncidentForm";

type IncidentActionProps = {
    id: string;
    referenceCode: string;
    renterName: string;
    vehicleName: string;
    renterEmail: string;
    status: BookingsStatus;
};

function IncidentAction({
    id,
    referenceCode,
    renterName,
    vehicleName,
    renterEmail,
    status,
}: IncidentActionProps) {
    const [incidentId, setIncidentId] = useState<string>("");

    const handleOpen = useCallback(() => setIncidentId(id), [id]);
    const handleClose = useCallback(() => setIncidentId(""), []);

    const handleSubmitIncidentCharges = async (values: ChargeIncidentFormValues) => {
        try {
            console.log("Incident charges submitted successfully!", values);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <button
                type="button"
                className="text-gray-500 text-sm font-semibold font-text leading-5 px-6 py-2 rounded-xs border border-gray-500 hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer"
                onClick={handleOpen}
            >
                Charge Incidentals
            </button>
            <ChargeIncidentModal
                referenceCode={referenceCode}
                onClose={handleClose}
                onSubmit={handleSubmitIncidentCharges}
                id={incidentId}
                renterName={renterName}
                vehicleName={vehicleName}
                renterEmail={renterEmail}
                status={status}
            />
        </>
    );
}

export default memo(IncidentAction);