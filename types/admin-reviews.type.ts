// ─── Filters ──────────────────────────────────────────────────────────────────

export type AdminReviewTimeRange = "all" | "7d" | "30d" | "90d" | "1y";
export type AdminReviewStatusFilter =
  | "all"
  | "published"
  | "flagged"
  | "removed";

export interface AdminReviewsQuery {
  search?: string;
  rating?: number;
  timeRange?: AdminReviewTimeRange;
  status?: AdminReviewStatusFilter;
  page?: number;
  limit?: number;
}

// ─── Data shapes ──────────────────────────────────────────────────────────────

export interface AdminReviewSummary {
  totalReviews: number;
  flaggedReviews: number;
  removedReviews: number;
  averageRating: number;
}

export interface AdminReviewRow {
  id: string;
  reviewCode: string;
  renterName: string;
  renterEmail: string | null;
  hostName: string | null;
  vehicleName: string;
  rating: number;
  comment: string;
  date: string;
  status: "published" | "flagged" | "removed";
  actions: {
    canView: boolean;
    canFlag: boolean;
    canDelete: boolean;
  };
}

export interface AdminReviewDetail {
  id: string;
  reviewCode: string;
  renterName: string;
  renterEmail: string | null;
  vehicleName: string;
  hostName: string | null;
  rating: number;
  title?: string;
  comment: string;
  bookingRef?: string;
  date: string;
  status: "published" | "flagged" | "removed";
}

// ─── API responses ────────────────────────────────────────────────────────────

export interface AdminReviewsModerationResponse {
  success: boolean;
  data: {
    summary: AdminReviewSummary;
    filters: {
      search: string;
      rating: number | null;
      timeRange: AdminReviewTimeRange;
      status: AdminReviewStatusFilter;
    };
    table: {
      rows: AdminReviewRow[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  };
}

export interface AdminReviewDetailResponse {
  success: boolean;
  data: AdminReviewDetail;
}

export interface AdminReviewActionResponse {
  success: boolean;
  data: {
    id: string;
    status: string;
    message: string;
  };
}
