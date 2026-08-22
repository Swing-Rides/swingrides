"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

export type PopupWrapperProps = {
  onClose: () => void;
  popupTitle: string;
  popupDescription?: string;
  children: ReactNode;
};

// ─── PopupWrapper ───────────────────────────────────────────────────────────

export const PopupWrapper = ({
  onClose,
  popupTitle,
  popupDescription,
  children,
}: PopupWrapperProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex flex-col w-full max-w-lg max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 pt-5 pb-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm md:text-[20px] font-semibold font-text text-neutral-900">
                {popupTitle}
              </h3>
              {popupDescription && (
                <span className="text-sm font-normal font-text text-gray-400 text-center block">
                  {popupDescription}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center size-7 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="size-4 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 md:px-5 py-4 flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PopupWrapper;
