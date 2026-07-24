import Link from "next/link";
import { Eye, Trash, Download } from "lucide-react";
import { DataTableDataType } from "./subscriberDetail.types";

export default function TableUIActionTab({
        slug,
        itemId,
        dataType,
        onDelete,
        onDownload,
}: {
        slug: string;
        itemId: string;
        dataType: DataTableDataType;
        onDelete: () => void;
        onDownload: () => void;
}) {
        // Route per tab type so the eye icon goes to the right detail page
        const href =
                dataType === "Vehicle"
                        ? `/admin/subscribers/${slug}/fleet/${itemId}`
                        : dataType === "Booking"
                                ? `/admin/subscribers/${slug}/bookings/${itemId}`
                                : `/admin/subscribers/${slug}/billing/${itemId}`;

        if (dataType === "Billing History") {
                return (
                        <div className="flex gap-5 items-center">
                                <button className="text-[#6B7280] hover:text-red-500 transition-colors cursor-pointer">
                                        <Download className="size-4" onClick={onDownload} />
                                </button>
                        </div>
                );
        }

        return (
                <div className="flex gap-5 items-center">
                        <Link
                                href={href}
                                className="text-[#6B7280] hover:text-blue-600 transition-colors"
                        >
                                <Eye className="size-4" />
                        </Link>
                        <button
                                onClick={onDelete}
                                className="text-[#6B7280] hover:text-red-500 transition-colors cursor-pointer"
                        >
                                <Trash className="size-4" />
                        </button>
                </div>
        );
}