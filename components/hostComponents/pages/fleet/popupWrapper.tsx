"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

type PopupWrapperProps = {
        isOpen: boolean;
        title: string;
        description?: string;
        form: ReactNode;
        onClose: () => void;
}

export default function PopupWrapper({ isOpen, title, description, form, onClose }: PopupWrapperProps) {
        // Close on Escape — only listens while the popup is actually open.
        useEffect(() => {
                if (!isOpen) return;
                const handleKeyDown = (e: KeyboardEvent) => {
                        if (e.key === "Escape") onClose();
                };
                window.addEventListener("keydown", handleKeyDown);
                return () => window.removeEventListener("keydown", handleKeyDown);
        }, [isOpen, onClose]);

        if (!isOpen) return null;

        return (
                <div
                        className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                        <div className="relative w-full max-w-md max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
                                <div className="flex items-start justify-between gap-4 border-b px-4 md:px-6 py-4 md:py-5">
                                        <div className="flex flex-col gap-1">
                                                <h3 className="text-neutral-950 text-xl font-semibold font-text leading-7">
                                                        {title}
                                                </h3>
                                                {description && (
                                                        <span className="text-gray-500 text-sm font-normal font-text leading-5">
                                                                {description}
                                                        </span>
                                                )}
                                        </div>
                                        <button
                                                type="button"
                                                onClick={onClose}
                                                aria-label="Close"
                                                className="p-1 bg-white rounded-sm cursor-pointer hover:bg-gray-200 duration-300 transition-colors shrink-0"
                                        >
                                                <X className="text-gray-500 size-5" />
                                        </button>
                                </div>
                                <div className="px-4 md:px-6 py-4 overflow-y-auto">
                                        {form}
                                </div>
                        </div>
                </div>
        )
}