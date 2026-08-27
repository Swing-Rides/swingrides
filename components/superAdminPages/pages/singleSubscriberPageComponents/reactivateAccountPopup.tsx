"use client";

import { CircleCheck } from "lucide-react";
import PopupWrapper from "./popupWrapper";
import { ActionPopupProps } from "./subscriberDetail.types";

export default function ReactivateAccountPopup({
        open,
        onClose,
        onConfirm,
        organisationName,
        confirmDisabled,
}: ActionPopupProps) {
        return (
                <PopupWrapper
                        open={open}
                        title="Reactivate account?"
                        onClose={onClose}
                        onConfirm={onConfirm}
                        confirmLabel="Yes, reactivate"
                        confirmDisabled={confirmDisabled}
                >
                        <div className="flex gap-3">
                                <div className="size-10 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <CircleCheck className="size-5 text-emerald-600" />
                                </div>
                                <p className="text-gray-500 text-sm font-normal font-text leading-5">
                                        Reactivating{" "}
                                        <span className="font-semibold text-neutral-900">
                                                {organisationName}
                                        </span>{" "}
                                        will restore their access to the platform immediately.
                                </p>
                        </div>
                </PopupWrapper>
        );
}
