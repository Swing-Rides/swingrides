"use client";

import { useRef, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { HEADER_ACTIONS } from "./headerActions";
import { HeaderActionId } from "./subscriberDetail.types";
import SuspendAccountPopup from "./suspendAccountPopup";
import UpgradePlanPopup from "./upgradePlanPopup";
import CheckVerificationPopup from "./checkVerificationPopup";

export default function HeaderActionsMenu({
        organisationName,
        onSuspend,
        onUpgrade,
        onVerify,
}: {
        organisationName: string;
        onSuspend?: () => void;
        onUpgrade?: () => void;
        onVerify?: () => void;
}) {
        const [menuOpen, setMenuOpen] = useState(false);
        const [activePopup, setActivePopup] = useState<HeaderActionId | null>(null);
        const menuRef = useRef<HTMLDivElement>(null);

        const handleSelect = (id: HeaderActionId) => {
                setMenuOpen(false);
                setActivePopup(id);
        };

        const closePopup = () => setActivePopup(null);

        const handleConfirm = (id: HeaderActionId) => {
                if (id === "suspend") onSuspend?.();
                if (id === "upgrade") onUpgrade?.();
                if (id === "verify") onVerify?.();
                closePopup();
        };

        return (
                <div className="relative" ref={menuRef}>
                        <button
                                type="button"
                                onClick={() => setMenuOpen((v) => !v)}
                                aria-label="Subscriber actions"
                                className="size-10 flex items-center justify-center rounded-xs border border-gray-300 text-zinc-700 hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
                        >
                                <EllipsisVertical className="size-5" />
                        </button>

                        {menuOpen && (
                                <>
                                        {/* Backdrop closes the menu on outside click */}
                                        <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md border border-gray-200 shadow-lg z-50 py-1">
                                                {HEADER_ACTIONS.map((action) => (
                                                        <button
                                                                key={action.id}
                                                                type="button"
                                                                onClick={() => handleSelect(action.id)}
                                                                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium font-text text-left hover:bg-gray-50 transition-colors cursor-pointer ${action.danger ? "text-red-600" : "text-gray-700"
                                                                        }`}
                                                        >
                                                                {action.icon}
                                                                {action.label}
                                                        </button>
                                                ))}
                                        </div>
                                </>
                        )}

                        <SuspendAccountPopup
                                open={activePopup === "suspend"}
                                onClose={closePopup}
                                onConfirm={() => handleConfirm("suspend")}
                                organisationName={organisationName}
                        />
                        <UpgradePlanPopup
                                open={activePopup === "upgrade"}
                                onClose={closePopup}
                                onConfirm={() => handleConfirm("upgrade")}
                                organisationName={organisationName}
                        />
                        <CheckVerificationPopup
                                open={activePopup === "verify"}
                                onClose={closePopup}
                                onConfirm={() => handleConfirm("verify")}
                                organisationName={organisationName}
                        />
                </div>
        );
}