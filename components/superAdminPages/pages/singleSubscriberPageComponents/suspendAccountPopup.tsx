"use client";

import { AlertTriangle } from "lucide-react";
import PopupWrapper from "./popupWrapper";
import { ActionPopupProps } from "./subscriberDetail.types";

export default function SuspendAccountPopup({
        open,
        onClose,
        onConfirm,
        organisationName,
}: ActionPopupProps) {
        return (
                <PopupWrapper
                        open={open}
                        title="Suspend account?"
                        onClose={onClose}
                        onConfirm={onConfirm}
                        confirmLabel="Yes, suspend"
                        confirmVariant="danger"
                >
                        <div className="flex gap-3">
                                <div className="size-10 shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                                        <AlertTriangle className="size-5 text-red-600" />
                                </div>
                                <p className="text-gray-500 text-sm font-normal font-text leading-5">
                                        Suspending{" "}
                                        <span className="font-semibold text-neutral-900">
                                                {organisationName}
                                        </span>{" "}
                                        will immediately block their access to the platform. They will not
                                        be able to create new bookings until the account is reinstated.
                                </p>
                        </div>
                </PopupWrapper>
        );
}