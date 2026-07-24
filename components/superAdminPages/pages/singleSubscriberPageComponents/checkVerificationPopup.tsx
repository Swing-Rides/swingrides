"use client";

import { ShieldCheck } from "lucide-react";
import PopupWrapper from "./popupWrapper";
import { ActionPopupProps } from "./subscriberDetail.types";

export default function CheckVerificationPopup({
        open,
        onClose,
        onConfirm,
        organisationName,
}: ActionPopupProps) {
        return (
                <PopupWrapper
                        open={open}
                        title="Check verification status"
                        onClose={onClose}
                        onConfirm={onConfirm}
                        confirmLabel="Run check"
                >
                        <div className="flex gap-3">
                                <div className="size-10 shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                                        <ShieldCheck className="size-5 text-emerald-500" />
                                </div>
                                <p className="text-gray-500 text-sm font-normal font-text leading-5">
                                        This will re-run identity and document verification checks for{" "}
                                        <span className="font-semibold text-neutral-900">
                                                {organisationName}
                                        </span>
                                        . Results will appear in the activity log once complete.
                                </p>
                        </div>
                </PopupWrapper>
        );
}