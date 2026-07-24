import {
        FLEET_STATUS_STYLE,
        BOOKING_STATUS_STYLE,
        STATUS_STYLE,
} from "@/components/superAdminPages/utils/helpers";
import { PageIntroProps } from "./subscriberDetail.types";

export default function PageIntro({
        pageTitle,
        pageDesc,
        dataType = "subscribers",
        status,
}: PageIntroProps) {
        const styleMap =
                dataType === "fleet"
                        ? FLEET_STATUS_STYLE
                        : dataType === "booking"
                                ? BOOKING_STATUS_STYLE
                                : STATUS_STYLE;

        const normalizedStatus = status.toLowerCase();

        const { label, textColor, bgColor } = (
                styleMap as Record<
                        string,
                        { label: string; textColor: string; bgColor: string }
                >
        )[normalizedStatus] ?? {
                label: status,
                textColor: "#6B7280",
                bgColor: "#F3F4F6",
        };

        return (
                <div className="flex flex-col gap-1.25">
                        <div className="flex items-center flex-wrap-reverse gap-2">
                                <h2 className="text-neutral-950 md:text-nowrap text-2xl font-semibold font-text">
                                        {pageTitle}
                                </h2>
                                <span
                                        className="py-1 px-2.5 rounded-full text-xs font-semibold font-text leading-4"
                                        style={{ color: textColor, backgroundColor: bgColor }}
                                >
                                        {label}
                                </span>
                        </div>
                        <span className="text-gray-500 text-sm font-normal font-text">
                                {pageDesc}
                        </span>
                </div>
        );
}