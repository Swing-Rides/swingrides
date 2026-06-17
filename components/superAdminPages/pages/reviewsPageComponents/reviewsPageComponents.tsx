"use client";

import { Suspense, useCallback, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Flag,
  MessageSquare,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import PageWrapper from "../../dashboard/pageWrapper";
import ReviewOverviewCard from "./reviewOverviewCard";
import { SelectUI } from "../subscribersPageComponents";
import { reviewStarRatingItems } from "../../utils/helpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableUserCard } from "../settingsPageComponent/adminUsersSettingsPageComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useGetAdminReviewsModerationQuery,
  useFlagAdminReviewMutation,
  useUnflagAdminReviewMutation,
  useDeleteAdminReviewMutation,
} from "@/app/store/services/adminApi";
import { AdminReviewRow } from "@/types/admin-reviews.type";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReviewsPageComponents() {
  return (
    <PageWrapper
      pageTitle="Reviews"
      pageDescription="Platform-wide review moderation and rating activity"
    >
      <Suspense>
        <ReviewsContent />
      </Suspense>
    </PageWrapper>
  );
}

// ─── Inner component (uses hooks that depend on Suspense for useSearchParams) ─

function ReviewsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = searchParams.get("search") ?? undefined;
  const ratingParam = searchParams.get("rating");
  const rating = ratingParam ? Number(ratingParam) : undefined;
  const currentPage = Number(searchParams.get("page") ?? 1);

  const { data, isLoading } = useGetAdminReviewsModerationQuery({
    search,
    rating,
    page: currentPage,
    limit: 8,
  });

  const [flagReview] = useFlagAdminReviewMutation();
  const [unflagReview] = useUnflagAdminReviewMutation();
  const [deleteReview] = useDeleteAdminReviewMutation();

  const summary = data?.data.summary;
  const rows = data?.data.table.rows ?? [];
  const pagination = data?.data.table.pagination ?? {
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  };

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  return (
    <div className="flex flex-col gap-5 md:gap-8">
      <div className="flex flex-wrap gap-4 mt-8">
        <ReviewOverviewCard
          icon={<MessageSquare className="size-5 text-blue-700" />}
          iconBG="bg-indigo-50"
          label="Total Reviews"
          number={summary?.totalReviews ?? 0}
        />
        <ReviewOverviewCard
          icon={<Flag className="size-5 text-amber-500" />}
          iconBG="bg-orange-50"
          label="Flagged Reviews"
          number={summary?.flaggedReviews ?? 0}
        />
        <ReviewOverviewCard
          icon={<Trash2 className="size-5 text-red-500" />}
          iconBG="bg-rose-100"
          label="Removed Reviews"
          number={summary?.removedReviews ?? 0}
        />
        <ReviewOverviewCard
          icon={<Star className="size-5 text-emerald-500" />}
          iconBG="bg-green-100"
          label="Average Rating"
          number={summary?.averageRating ?? 0}
        />
      </div>

      <ReviewListTable
        rows={rows}
        pagination={pagination}
        isLoading={isLoading}
        goToPage={goToPage}
        onFlag={(id) => flagReview(id)}
        onUnflag={(id) => unflagReview(id)}
        onDelete={(id) => deleteReview(id)}
      />
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

type ReviewListTableProps = {
  rows: AdminReviewRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  goToPage: (page: number) => void;
  onFlag: (id: string) => void;
  onUnflag: (id: string) => void;
  onDelete: (id: string) => void;
};

const ReviewListTable = ({
  rows,
  pagination,
  isLoading,
  goToPage,
  onFlag,
  onUnflag,
  onDelete,
}: ReviewListTableProps) => {
  const [viewReview, setViewReview] = useState<AdminReviewRow | null>(null);

  const { page, total, totalPages } = pagination;
  const startItem = total === 0 ? 0 : (page - 1) * pagination.limit + 1;
  const endItem = Math.min(page * pagination.limit, total);

  return (
    <>
      <div className="space-y-5 md:space-y-8">
        <SearchFilterSection />
        <div>
          <Table className="py-2.5 bg-white rounded-lg border border-gray-200">
            <TableHeader className="bg-gray-100">
              <TableRow>
                {[
                  "Review ID",
                  "Renter Name",
                  "Host / Vehicle",
                  "Rating",
                  "Comment",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <TableHead
                    key={h}
                    className="pl-5 text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-16 text-gray-400 text-sm"
                  >
                    Loading reviews…
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-16 text-gray-400 text-sm"
                  >
                    No reviews match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-700 text-xs font-medium font-text leading-5">
                          {item.reviewCode}
                        </span>
                        {item.status === "flagged" && (
                          <Flag className="size-3.5 text-amber-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="pl-5">
                      <TableUserCard
                        name={item.renterName}
                        email={item.renterEmail ?? "—"}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
                          {item.hostName ?? "—"}
                        </span>
                        <span className="text-gray-500 text-xs font-normal font-text leading-5">
                          {item.vehicleName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={item.rating} />
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-500 text-sm font-normal font-text leading-5 text-wrap line-clamp-2 max-w-sm">
                        {item.comment}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-500 text-sm font-normal font-text leading-5">
                        {formatDate(item.date)}
                      </span>
                    </TableCell>
                    <TableCell className="pr-5">
                      <TableAction
                        flagged={item.status === "flagged"}
                        canFlag={item.actions.canFlag}
                        canDelete={item.actions.canDelete}
                        onViewReview={() => setViewReview(item)}
                        onFlag={() => onFlag(item.id)}
                        onUnflag={() => onUnflag(item.id)}
                        onDelete={() => onDelete(item.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-5 rounded-b-sm bg-white border border-gray-200">
            <span className="block text-gray-500 text-sm font-normal font-text">
              Showing {startItem}–{endItem} of {total} review
              {total !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors duration-150"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors duration-150"
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewReview && (
        <Modal onClose={() => setViewReview(null)}>
          <ViewReviewModal
            review={viewReview}
            onFlag={() => {
              onFlag(viewReview.id);
              setViewReview(null);
            }}
            onUnflag={() => {
              onUnflag(viewReview.id);
              setViewReview(null);
            }}
            onDelete={() => {
              onDelete(viewReview.id);
              setViewReview(null);
            }}
            onClose={() => setViewReview(null)}
          />
        </Modal>
      )}
    </>
  );
};

// ─── Search / filter ──────────────────────────────────────────────────────────

const SearchFilterSection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      if (key !== "page") params.delete("page");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const search = searchParams.get("search") ?? "";

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-white rounded-[10px] border border-gray-200">
      <div className="relative flex items-center w-full max-w-6xl">
        <Search className="absolute left-3 size-4 text-gray-400 pointer-events-none shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setParam("search", e.target.value)}
          placeholder="Search by name, email or ID..."
          className={[
            "w-full pl-9 pr-4 py-2 rounded-lg",
            "bg-gray-50 border border-gray-300",
            "text-xs text-[#0B0B0B]/50 placeholder:text-gray-400 font-text",
            "outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            "transition-all duration-200",
          ].join(" ")}
        />
      </div>
      <SelectUI
        title="All Ratings"
        items={reviewStarRatingItems}
        paramKey="rating"
      />
    </div>
  );
};

// ─── Table action ─────────────────────────────────────────────────────────────

type TableActionProps = {
  flagged: boolean;
  canFlag: boolean;
  canDelete: boolean;
  onViewReview: () => void;
  onFlag: () => void;
  onUnflag: () => void;
  onDelete: () => void;
};

const TableAction = ({
  flagged,
  canFlag,
  canDelete,
  onViewReview,
  onFlag,
  onUnflag,
  onDelete,
}: TableActionProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <EllipsisVertical className="size-5 cursor-pointer" />
    </PopoverTrigger>
    <PopoverContent className="max-w-62.5 min-w-37.5 w-full p-0">
      <div className="flex flex-col justify-start divide-y gap-0">
        <ActionButton
          label="View Full Review"
          onClick={onViewReview}
          color="default"
        />
        {canFlag && (
          flagged ? (
            <ActionButton
              label="Unflag Review"
              onClick={onUnflag}
              color="black"
            />
          ) : (
            <ActionButton label="Flag Review" onClick={onFlag} color="black" />
          )
        )}
        {canDelete && (
          <ActionButton label="Delete Review" onClick={onDelete} color="red" />
        )}
      </div>
    </PopoverContent>
  </Popover>
);

type ActionButtonColor = "default" | "black" | "red";

const colorClass: Record<ActionButtonColor, string> = {
  default: "text-blue-700",
  black: "text-neutral-950",
  red: "text-red-500",
};

const ActionButton = ({
  label,
  onClick,
  color = "default",
}: {
  label: string;
  onClick: () => void;
  color?: ActionButtonColor;
}) => (
  <div>
    <button
      onClick={onClick}
      className={`p-3.5 text-sm font-semibold font-text leading-4 outline-none border-none cursor-pointer w-full text-left ${colorClass[color]}`}
    >
      {label}
    </button>
  </div>
);

// ─── Modal wrapper ────────────────────────────────────────────────────────────

export const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 z-999 flex items-center justify-center backdrop-blur-md bg-black/50 px-4"
    onClick={onClose}
  >
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

// ─── View review modal ────────────────────────────────────────────────────────

const ViewReviewModal = ({
  review,
  onFlag,
  onUnflag,
  onDelete,
  onClose,
}: {
  review: AdminReviewRow;
  onFlag: () => void;
  onUnflag: () => void;
  onDelete: () => void;
  onClose: () => void;
}) => (
  <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-sm flex flex-col gap-4">
    {/* Header */}
    <div className="flex items-start justify-between gap-2">
      <div className="flex flex-col gap-3 w-full">
        <div className="flex gap-3 items-center">
          <span className="text-blue-700 text-lg font-medium font-text leading-6">
            {review.reviewCode}
          </span>
          {review.status === "flagged" && (
            <span className="flex items-center gap-1.5 text-amber-600 text-xs font-medium font-text leading-4">
              <Flag className="size-3" />
              Flagged
            </span>
          )}
        </div>
        <TableUserCard
          name={review.renterName}
          email={review.renterEmail ?? "—"}
        />
        <div className="flex gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-500 text-xs font-normal font-text uppercase leading-4 tracking-tight">
              Host
            </span>
            <span className="text-neutral-950 text-sm font-medium font-text leading-5">
              {review.hostName ?? "—"}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-500 text-xs font-normal font-text uppercase leading-4 tracking-tight">
              Vehicle
            </span>
            <span className="text-neutral-950 text-sm font-medium font-text leading-5">
              {review.vehicleName}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1.5">
            <h4 className="text-gray-500 text-xs font-normal font-text uppercase leading-4 tracking-tight">
              Rating
            </h4>
            <StarRating rating={review.rating} />
          </div>
          <div className="flex flex-col gap-1.5 text-right">
            <h4 className="text-gray-500 text-xs font-normal font-text uppercase leading-4 tracking-tight">
              Date
            </h4>
            <span className="text-gray-700 text-sm font-normal font-text leading-5">
              {formatDate(review.date)}
            </span>
          </div>
        </div>
      </div>
      <button onClick={onClose} className="cursor-pointer" aria-label="Close">
        <X className="size-4 text-red-500 hover:text-red-900 transition-colors duration-300" />
      </button>
    </div>

    {/* Comment */}
    <div className="flex flex-col gap-1.5">
      <h4 className="text-neutral-950 text-base font-semibold font-text leading-6">
        Full Review
      </h4>
      <span className="text-gray-700 text-sm font-normal font-text leading-6">
        {review.comment}
      </span>
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-3">
      {review.actions.canFlag && (
        review.status === "flagged" ? (
          <button
            onClick={onUnflag}
            className="py-2 px-3.5 flex items-center gap-2 border border-amber-500 text-amber-600 text-sm font-medium rounded-xs hover:bg-amber-50 transition-colors duration-200 cursor-pointer"
          >
            <Flag className="size-4" />
            Unflag Review
          </button>
        ) : (
          <button
            onClick={onFlag}
            className="py-2 px-3.5 flex items-center gap-2 border border-amber-500 text-amber-600 text-sm font-medium rounded-xs hover:bg-amber-50 transition-colors duration-200 cursor-pointer"
          >
            <Flag className="size-4" />
            Flag Review
          </button>
        )
      )}
      {review.actions.canDelete && (
        <button
          onClick={onDelete}
          className="py-2 px-3.5 flex items-center gap-2 border border-red-500 text-red-500 text-sm font-medium rounded-xs hover:bg-red-50 transition-colors duration-200 cursor-pointer"
        >
          <Trash2 className="size-4" />
          Delete Review
        </button>
      )}
    </div>
  </div>
);

export const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className="size-4"
          style={{
            fill: i < rating ? "#EAB308" : "transparent",
            color: i < rating ? "#EAB308" : "#D1D5DB",
          }}
        />
      ))}
    </div>
  );
};
