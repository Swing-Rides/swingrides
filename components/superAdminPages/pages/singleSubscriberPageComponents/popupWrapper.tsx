"use client";

import { X } from "lucide-react";
import { PopupWrapperProps } from "./subscriberDetail.types";

export default function PopupWrapper({
        open,
        title,
        onClose,
        onConfirm,
        onCancel,
        confirmLabel = "Confirm",
        cancelLabel = "Cancel",
        confirmDisabled = false,
        confirmVariant = "primary",
        children,
}: PopupWrapperProps) {
        if (!open) return null;

        const confirmClasses =
                confirmVariant === "danger"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-blue-700 hover:bg-blue-900";

        return (
                <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={onClose}
                >
                        <div
                                className="w-full max-w-md bg-white rounded-md border border-gray-200 relative"
                                onClick={(e) => e.stopPropagation()}
                        >
                                <button
                                        type="button"
                                        onClick={onClose}
                                        aria-label="Close"
                                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                                >
                                        <X className="size-5" />
                                </button>

                                <div className="p-6">
                                        <h3 className="text-neutral-950 text-lg font-semibold font-text leading-7 pr-8">
                                                {title}
                                        </h3>
                                        <div className="mt-3">{children}</div>
                                </div>

                                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                                        <button
                                                type="button"
                                                onClick={onCancel ?? onClose}
                                                className="px-5 py-2 rounded-xs text-sm font-semibold font-text text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
                                        >
                                                {cancelLabel}
                                        </button>
                                        <button
                                                type="button"
                                                onClick={onConfirm}
                                                disabled={confirmDisabled}
                                                className={`px-5 py-2 rounded-xs text-sm font-semibold font-text text-white transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${confirmClasses}`}
                                        >
                                                {confirmLabel}
                                        </button>
                                </div>
                        </div>
                </div>
        );
}