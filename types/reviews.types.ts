 export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  totalVehiclesReviewed: number;
}

export interface VehicleReviewItem {
  vehicleName: string;
  vehicleId?: string;
  totalReviews: number;
  averageRating: number;
  lastReviewed: string;
  reviewCountByStars?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  thumbnailUrl?: string;
}

export interface ReviewEntry {
  id: string;
  vehicleName: string;
  customerName: string;
  rating: number;
  title?: string;
  comment: string;
  reviewedAt: Date;
  status: 'published' | 'hidden' | 'flagged';
  vehicleId?: string;
  bookingRef?: string;
}

export interface ReviewDashboardResponse {
  success: boolean;
  data: {
    summary: ReviewSummary;
    vehicles: VehicleReviewItem[];
    reviews: {
      items: ReviewEntry[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface VehicleReviewHistoryItem extends ReviewEntry {
  reviewedAtLabel: string;
}

export interface VehicleReviewDetailResponse {
  success: boolean;
  data: {
    vehicle: VehicleReviewItem;
    history: {
      items: VehicleReviewHistoryItem[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}