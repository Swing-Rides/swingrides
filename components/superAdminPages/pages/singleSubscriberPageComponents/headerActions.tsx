import { Ban, CircleCheck, TrendingUp, ShieldCheck } from "lucide-react";
import { HeaderActionItem } from "./subscriberDetail.types";

export const getHeaderActions = (isSuspended: boolean): HeaderActionItem[] => [
        isSuspended
                ? {
                        id: "suspend",
                        label: "Reactivate Account",
                        icon: <CircleCheck className="size-4" />,
                }
                : {
                        id: "suspend",
                        label: "Suspend Account",
                        icon: <Ban className="size-4" />,
                        danger: true,
                },
        {
                id: "upgrade",
                label: "Upgrade Plan",
                icon: <TrendingUp className="size-4" />,
        },
        {
                id: "verify",
                label: "Check Verification",
                icon: <ShieldCheck className="size-4" />,
        },
];
