import { Ban, TrendingUp, ShieldCheck } from "lucide-react";
import { HeaderActionItem } from "./subscriberDetail.types";

export const HEADER_ACTIONS: HeaderActionItem[] = [
        {
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