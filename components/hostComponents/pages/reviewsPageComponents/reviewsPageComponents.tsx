"use client";

import { ReactNode, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import PageWrapper from "../../dashboard/pageWrapper";
import { Download, Flag, MessageSquare, Star, Trash, X } from "lucide-react";
import {
        ColumnDef,
        DataTable,
        exportToCSV,
        TableToolbar,
        useTableRows,
} from "../../dashboard/customTable";
import Image from "next/image";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ReviewComment {
        commenterName: string;
        stars: number;
        comment: string;
        date: string;
}

interface ReviewTableRow {
        id: string;
        vehicleImgSrc: string;
        vehicleName: string;
        totalReviews: number;
        averageRating: string;
        lastReviewed: string;
        comments?: ReviewComment[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_REVIEW_DATA: ReviewTableRow[] = [
        {
                id: "R-001", vehicleImgSrc: "/images/tesla-m3.png", vehicleName: "Tesla Model 3",
                totalReviews: 124, averageRating: "4.8", lastReviewed: "2026-06-05",
                comments: [
                        { commenterName: "Alice Johnson", stars: 5, comment: "Absolutely loved the Tesla Model 3! Very clean and smooth ride.", date: "2026-06-05" },
                        { commenterName: "Mark Spencer", stars: 4, comment: "Great experience overall. The autopilot feature was impressive.", date: "2026-05-30" },
                        { commenterName: "Priya Nair", stars: 5, comment: "Fantastic car. Would rent again without hesitation.", date: "2026-05-22" },
                ],
        },
        { id: "R-002", vehicleImgSrc: "/images/bmw-x5.png", vehicleName: "BMW X5", totalReviews: 89, averageRating: "4.6", lastReviewed: "2026-06-01" },
        { id: "R-003", vehicleImgSrc: "/images/audi-a4.png", vehicleName: "Audi A4", totalReviews: 56, averageRating: "4.5", lastReviewed: "2026-05-28" },
        { id: "R-004", vehicleImgSrc: "/images/honda-accord.png", vehicleName: "Honda Accord", totalReviews: 210, averageRating: "4.7", lastReviewed: "2026-05-25" },
        { id: "R-005", vehicleImgSrc: "/images/ford-f150.png", vehicleName: "Ford F-150", totalReviews: 95, averageRating: "4.4", lastReviewed: "2026-05-20" },
        { id: "R-006", vehicleImgSrc: "/images/toyota-rav4.png", vehicleName: "Toyota RAV4", totalReviews: 340, averageRating: "4.9", lastReviewed: "2026-06-06" },
        { id: "R-007", vehicleImgSrc: "/images/porsche-911.png", vehicleName: "Porsche 911", totalReviews: 42, averageRating: "5.0", lastReviewed: "2026-05-15" },
        { id: "R-008", vehicleImgSrc: "/images/nissan-rogue.png", vehicleName: "Nissan Rogue", totalReviews: 78, averageRating: "4.3", lastReviewed: "2026-05-10" },
        { id: "R-009", vehicleImgSrc: "/images/chevy-tahoe.png", vehicleName: "Chevrolet Tahoe", totalReviews: 65, averageRating: "4.5", lastReviewed: "2026-05-05" },
        { id: "R-010", vehicleImgSrc: "/images/mercedes-e.png", vehicleName: "Mercedes E-Class", totalReviews: 52, averageRating: "4.7", lastReviewed: "2026-04-30" },
        { id: "R-011", vehicleImgSrc: "/images/mazda-miata.png", vehicleName: "Mazda Miata", totalReviews: 115, averageRating: "4.8", lastReviewed: "2026-06-02" },
        { id: "R-012", vehicleImgSrc: "/images/jeep-wrangler.png", vehicleName: "Jeep Wrangler", totalReviews: 180, averageRating: "4.6", lastReviewed: "2026-05-22" },
        { id: "R-013", vehicleImgSrc: "/images/subaru-outback.png", vehicleName: "Subaru Outback", totalReviews: 132, averageRating: "4.5", lastReviewed: "2026-05-18" },
        { id: "R-014", vehicleImgSrc: "/images/ford-mustang.png", vehicleName: "Ford Mustang", totalReviews: 88, averageRating: "4.4", lastReviewed: "2026-05-12" },
        { id: "R-015", vehicleImgSrc: "/images/tesla-ms.png", vehicleName: "Tesla Model S", totalReviews: 67, averageRating: "4.7", lastReviewed: "2026-06-04" },
        { id: "R-016", vehicleImgSrc: "/images/mini-cooper.png", vehicleName: "Mini Cooper", totalReviews: 45, averageRating: "4.6", lastReviewed: "2026-05-01" },
        { id: "R-017", vehicleImgSrc: "/images/vw-golf.png", vehicleName: "Volkswagen Golf", totalReviews: 102, averageRating: "4.4", lastReviewed: "2026-04-25" },
        { id: "R-018", vehicleImgSrc: "/images/volvo-xc90.png", vehicleName: "Volvo XC90", totalReviews: 58, averageRating: "4.8", lastReviewed: "2026-06-06" },
        { id: "R-019", vehicleImgSrc: "/images/range-rover.png", vehicleName: "Range Rover", totalReviews: 38, averageRating: "4.9", lastReviewed: "2026-05-29" },
        { id: "R-020", vehicleImgSrc: "/images/hyundai-elantra.png", vehicleName: "Hyundai Elantra", totalReviews: 156, averageRating: "4.2", lastReviewed: "2026-04-15" },
        { id: "R-021", vehicleImgSrc: "/images/bmw-m4.png", vehicleName: "BMW M4", totalReviews: 29, averageRating: "5.0", lastReviewed: "2026-06-03" },
        { id: "R-022", vehicleImgSrc: "/images/kia-soul.png", vehicleName: "Kia Soul", totalReviews: 84, averageRating: "4.3", lastReviewed: "2026-05-08" },
        { id: "R-023", vehicleImgSrc: "/images/subaru-impreza.png", vehicleName: "Subaru Impreza", totalReviews: 111, averageRating: "4.5", lastReviewed: "2026-05-20" },
];

// ─────────────────────────────────────────────────────────────────────────────
// ReviewsOverviewCard
// ─────────────────────────────────────────────────────────────────────────────

type ReviewsOverviewCardProps = {
        icon: ReactNode;
        iconBgColor?: string;
        title: string;
        number: number;
};

function ReviewsOverviewCard({ icon, iconBgColor, title, number }: ReviewsOverviewCardProps) {
        return (
                <div className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
                        <div className={`size-12 rounded-[10px] flex justify-center items-center overflow-clip ${iconBgColor ?? "bg-indigo-50"}`}>
                                {icon}
                        </div>
                        <span className="text-gray-500 text-xs font-semibold font-text uppercase">{title}</span>
                        <span className="text-neutral-950 text-3xl font-medium font-text">{number}</span>
                </div>
        );
}

// ─────────────────────────────────────────────────────────────────────────────
// StarRating
// ─────────────────────────────────────────────────────────────────────────────

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
        const sizeClass = size === "md" ? "size-4" : "size-3";
        return (
                <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                        key={i}
                                        className={`${sizeClass} ${i <= Math.round(rating)
                                                        ? "text-yellow-500 fill-yellow-500"
                                                        : "text-gray-300 fill-gray-300"
                                                }`}
                                />
                        ))}
                </div>
        );
}

// ─────────────────────────────────────────────────────────────────────────────
// ReviewModal — driven by ?review=<id> in the URL
// ─────────────────────────────────────────────────────────────────────────────

type SortOption = "newest" | "oldest" | "highest" | "lowest";

function ReviewModal({ row, onClose }: { row: ReviewTableRow; onClose: () => void }) {
        const [sort, setSort] = useState<SortOption>("newest");
        const comments = row.comments ?? [];

        const sorted = [...comments].sort((a, b) => {
                if (sort === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
                if (sort === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
                if (sort === "highest") return b.stars - a.stars;
                if (sort === "lowest") return a.stars - b.stars;
                return 0;
        });

        return (
                <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                        <div className="relative flex flex-col w-full max-w-lg max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">

                                {/* Sticky header */}
                                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 pt-5 pb-4 flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-medium font-text text-neutral-900">Vehicle Review</h3>
                                                <button
                                                        onClick={onClose}
                                                        className="flex items-center justify-center size-7 rounded-full hover:bg-gray-100 transition-colors"
                                                        aria-label="Close"
                                                >
                                                        <X className="size-4 text-gray-500" />
                                                </button>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                                <Image
                                                        src={row.vehicleImgSrc}
                                                        alt={row.vehicleName}
                                                        width={40}
                                                        height={40}
                                                        className="size-10 rounded-sm object-cover aspect-square bg-gray-300"
                                                />
                                                <span className="text-sm font-medium text-neutral-900">{row.vehicleName}</span>
                                        </div>

                                        <div className="flex justify-between items-center gap-4">
                                                <div className="flex flex-col gap-1.5">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rating</span>
                                                        <div className="flex gap-2.5 items-center">
                                                                <StarRating rating={parseFloat(row.averageRating)} size="md" />
                                                                <span className="text-sm text-neutral-800">{row.averageRating}</span>
                                                        </div>
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Reviews</span>
                                                        <span className="text-sm font-semibold text-neutral-800">{row.totalReviews} reviews</span>
                                                </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent History</span>
                                                <select
                                                        value={sort}
                                                        onChange={(e) => setSort(e.target.value as SortOption)}
                                                        className="text-xs border border-gray-200 rounded-xs px-2 py-1 text-neutral-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                                >
                                                        <option value="newest">Newest first</option>
                                                        <option value="oldest">Oldest first</option>
                                                        <option value="highest">Highest rating</option>
                                                        <option value="lowest">Lowest rating</option>
                                                </select>
                                        </div>
                                </div>

                                {/* Scrollable body */}
                                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
                                        {sorted.length === 0 ? (
                                                <span className="text-sm text-gray-400 text-center py-8 block">No reviews yet.</span>
                                        ) : (
                                                sorted.map((c, idx) => (
                                                        <div key={idx} className="flex flex-col gap-1.5 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                                                <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium text-neutral-900">{c.commenterName}</span>
                                                                        <span className="text-xs text-gray-400">{c.date}</span>
                                                                </div>
                                                                <StarRating rating={c.stars} />
                                                                <span className="text-sm text-neutral-600 leading-relaxed">{c.comment}</span>
                                                        </div>
                                                ))
                                        )}
                                </div>

                                {/* Sticky footer */}
                                <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 px-5 py-4 flex justify-end">
                                        <button
                                                onClick={onClose}
                                                className="px-4 py-2 rounded-xs border border-gray-200 bg-transparent text-gray-400 text-sm font-medium hover:border-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
                                        >
                                                Close
                                        </button>
                                </div>
                        </div>
                </div>
        );
}

// ─────────────────────────────────────────────────────────────────────────────
// Table columns
// ─────────────────────────────────────────────────────────────────────────────

const reviewsColumns: ColumnDef<ReviewTableRow>[] = [
        {
                key: "vehicleName",
                header: "Vehicle Name",
                className: "w-56",
                cell: (row) => (
                        <div className="flex items-center gap-2">
                                <Image
                                        src={row.vehicleImgSrc}
                                        alt={row.vehicleName}
                                        width={32}
                                        height={32}
                                        className="size-8 aspect-square rounded-xs object-cover"
                                />
                                <span className="text-sm text-neutral-900">{row.vehicleName}</span>
                        </div>
                ),
        },
        {
                key: "totalReviews",
                header: "Total Reviews",
                cell: (row) => <span className="text-sm text-neutral-800">{row.totalReviews}</span>,
        },
        {
                key: "averageRating",
                header: "Average Rating",
                cell: (row) => (
                        <div className="flex items-center gap-1.5">
                                <Star className="size-4 text-yellow-600 fill-yellow-600" />
                                <span className="text-sm text-neutral-800">{row.averageRating}</span>
                        </div>
                ),
        },
        {
                key: "lastReviewed",
                header: "Last Reviewed",
                cell: (row) => <span className="text-sm text-neutral-800">{row.lastReviewed}</span>,
        },
];

// ─────────────────────────────────────────────────────────────────────────────
// ReviewsTableSection
// ─────────────────────────────────────────────────────────────────────────────

export function ReviewsTableSection() {
        const router = useRouter();
        const pathname = usePathname();
        const searchParams = useSearchParams();

        // Modal state driven by ?review=<id>
        const activeReviewId = searchParams.get("review");
        const activeRow = activeReviewId
                ? MOCK_REVIEW_DATA.find((r) => r.id === activeReviewId) ?? null
                : null;

        function closeReview() {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("review");
                const qs = params.toString();
                router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
        }

        const { rows, pagination } = useTableRows({
                tableId: "ReviewsTable",
                data: MOCK_REVIEW_DATA,
                searchFields: ["vehicleName", "id"],
                filters: [
                        {
                                paramKey: "averageRating",
                                field: "averageRating",
                                matchMode: "floor",
                        },
                ],
                sortField: "lastReviewed",
                rowsPerPage: 10,
        });

        return (
                <>
                        <DataTable
                                tableId="ReviewsTable"
                                columns={reviewsColumns}
                                rows={rows}
                                pagination={pagination}
                                toolbar={
                                        <TableToolbar
                                                search={{ placeholder: "Search by vehicle name or ID..." }}
                                                filters={[
                                                        {
                                                                title: "All Ratings",
                                                                paramKey: "averageRating",
                                                                // whole-number buckets — matchMode:"floor" does the decimal matching
                                                                items: ["5", "4", "3", "2", "1"].map((n) => ({
                                                                        label: `${n} ★`,
                                                                        value: n,
                                                                })),
                                                        },
                                                ]}
                                                dateSort
                                                actions={
                                                        <button
                                                                onClick={() =>
                                                                        exportToCSV(rows, {
                                                                                filename: "ReviewsHistory",
                                                                                columns: ["id", "vehicleName", "totalReviews", "averageRating", "lastReviewed"],
                                                                        })
                                                                }
                                                                className="flex items-center gap-2 px-3 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 group duration-300 transition-colors cursor-pointer"
                                                        >
                                                                <span className="text-blue-700 text-sm font-medium font-text group-hover:text-blue-200 transition-colors">
                                                                        Export CSV
                                                                </span>
                                                                <Download className="size-4 text-blue-700 group-hover:text-blue-200 transition-colors" />
                                                        </button>
                                                }
                                        />
                                }
                                // mergeParams (default true) preserves all table state in the URL;
                                // only ?review=<id> is added on top of whatever is already there.
                                linkAction={{
                                        label: "View",
                                        href: (row) => `${HOST_DASHBOARD_PATH}reviews/?review=${row.id}`,
                                }}
                        />

                        {activeRow && <ReviewModal row={activeRow} onClose={closeReview} />}
                </>
        );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ReviewsPageComponents() {
        return (
                <PageWrapper
                        pageTitle="Reviews"
                        pageDescription="View feedback from renters on your vehicles."
                >
                        <div className="mt-4 md:mt-8">
                                <div className="flex flex-wrap gap-4 mt-8">
                                        <ReviewsOverviewCard
                                                icon={<MessageSquare className="size-6 text-blue-700" />}
                                                iconBgColor="bg-indigo-50"
                                                title="Average Rating"
                                                number={4.8}
                                        />
                                        <ReviewsOverviewCard
                                                icon={<Flag className="size-6 text-amber-500" />}
                                                iconBgColor="bg-amber-100"
                                                title="Total Reviews"
                                                number={131}
                                        />
                                        <ReviewsOverviewCard
                                                icon={<Trash className="size-6 text-red-500" />}
                                                iconBgColor="bg-red-100"
                                                title="Total Vehicles Reviewed"
                                                number={11}
                                        />
                                </div>
                                <div>
                                        <ReviewsTableSection />
                                </div>
                        </div>
                </PageWrapper>
        );
}