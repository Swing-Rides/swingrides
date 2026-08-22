"use client";

import { memo, useState, useCallback } from "react";
import ChargeIncidentModal from "@/components/hostComponents/modals/chargeIncidentModal";
import { BookingsStatus } from "./types";
import { ChargeIncidentFormValues } from "@/components/hostComponents/forms/chargeIncidentForm";
import { useChargeIncidentalsMutation } from "@/app/store/services/bookingApi";

type IncidentActionProps = {
    id: string;
    referenceCode: string;
    renterName: string;
    vehicleName: string;
    renterEmail: string;
    status: BookingsStatus;
};

async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
    });
    if (!response.ok) throw new Error("File upload failed");
    const uploaded = (await response.json()) as { secure_url?: string };
    if (!uploaded.secure_url)
        throw new Error("The upload did not return a file URL");
    return uploaded.secure_url;
}

function IncidentAction({
    id,
    referenceCode,
    renterName,
    vehicleName,
    renterEmail,
    status,
}: IncidentActionProps) {
    const [incidentId, setIncidentId] = useState<string>("");
    const [chargeIncidentals] = useChargeIncidentalsMutation();

    const handleOpen = useCallback(() => setIncidentId(id), [id]);
    const handleClose = useCallback(() => setIncidentId(""), []);

    const handleSubmitIncidentCharges = async (values: ChargeIncidentFormValues) => {
        const incidents = await Promise.all(
            values.incidents.map(async (incident) => {
                const rawFiles = incident.evidenceDocs;
                const fileArray = rawFiles ? Array.from(rawFiles as Iterable<File>) : [];
                const evidenceUrls = await Promise.all(fileArray.map(uploadFile));
                const amount =
                    typeof incident.amount === "number"
                        ? incident.amount
                        : parseFloat(String(incident.amount || 0));

                return {
                    incidentType: incident.incidentType,
                    amount,
                    description: incident.description,
                    evidenceUrls,
                };
            }),
        );

        await chargeIncidentals({ bookingId: id, body: { incidents } }).unwrap();
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
