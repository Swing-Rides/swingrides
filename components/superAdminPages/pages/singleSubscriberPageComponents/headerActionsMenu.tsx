"use client";

import { useRef, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { getHeaderActions } from "./headerActions";
import { HeaderActionId, SubscriberPlanKey } from "./subscriberDetail.types";
import SuspendAccountPopup from "./suspendAccountPopup";
import ReactivateAccountPopup from "./reactivateAccountPopup";
import UpgradePlanPopup from "./upgradePlanPopup";

export default function HeaderActionsMenu({
        organisationName,
        currentPlan,
        isSuspended,
        onToggleSuspend,
        onUpgrade,
        onVerify,
        suspendDisabled,
        upgradeDisabled,
}: {
        organisationName: string;
        currentPlan?: string;
        isSuspended: boolean;
        onToggleSuspend?: () => void | Promise<void>;
        onUpgrade?: (plan: SubscriberPlanKey) => void | Promise<void>;
        onVerify?: () => void;
        suspendDisabled?: boolean;
        upgradeDisabled?: boolean;
}) {
        const [menuOpen, setMenuOpen] = useState(false);
        const [activePopup, setActivePopup] = useState<HeaderActionId | null>(null);
        const menuRef = useRef<HTMLDivElement>(null);
        const headerActions = getHeaderActions(isSuspended);

        const handleSelect = (id: HeaderActionId) => {
                setMenuOpen(false);
                // "verify" jumps straight to the Business Verification section —
                // it's navigation, not a consequential action, so it skips the
                // confirmation popup the other actions use.
                if (id === "verify") {
                        onVerify?.();
                        return;
                }
                setActivePopup(id);
        };

        const closePopup = () => setActivePopup(null);

        const handleSuspendConfirm = async () => {
                await onToggleSuspend?.();
                closePopup();
        };

        const handleUpgradeConfirm = async (plan: SubscriberPlanKey) => {
                await onUpgrade?.(plan);
                closePopup();
        };

        return (
                <div className="relative" ref={menuRef}>
                        <button
                                type="button"
                                onClick={() => setMenuOpen((v) => !v)}
                                aria-label="Subscriber actions"
                                className="size-10 flex items-center justify-center rounded-xs bg-zinc-100 border border-gray-300 text-zinc-700 hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
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
                                                {headerActions.map((action) => (
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

                        {isSuspended ? (
                                <ReactivateAccountPopup
                                        open={activePopup === "suspend"}
                                        onClose={closePopup}
                                        onConfirm={handleSuspendConfirm}
                                        organisationName={organisationName}
                                        confirmDisabled={suspendDisabled}
                                />
                        ) : (
                                <SuspendAccountPopup
                                        open={activePopup === "suspend"}
                                        onClose={closePopup}
                                        onConfirm={handleSuspendConfirm}
                                        organisationName={organisationName}
                                        confirmDisabled={suspendDisabled}
                                />
                        )}
                        <UpgradePlanPopup
                                open={activePopup === "upgrade"}
                                onClose={closePopup}
                                onConfirm={handleUpgradeConfirm}
                                organisationName={organisationName}
                                currentPlan={currentPlan}
                                confirmDisabled={upgradeDisabled}
                        />
                </div>
        );
}
