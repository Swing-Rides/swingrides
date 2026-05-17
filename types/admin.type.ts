import type { ReactNode } from "react";

export type AdminOverviewCardTrendDirection = "up" | "down" | "flat";

export interface AdminOverviewCard {
  key: string;
  label: string;
  value: string | number;
  trend: string;
  trendDirection: AdminOverviewCardTrendDirection;
}

export interface AdminOverviewTrendPoint {
  month: string;
  value: number;
  key?: string;
}

export interface AdminOverviewSubscriberDistributionItem {
  plan: "starter" | "professional" | "enterprise";
  count: number;
  percentage: number;
}

export interface AdminOverviewRecentActivityItem {
  time: string;
  eventType: string;
  entity: string;
  details: string;
  action: string;
}

export interface AdminOverviewResponseData {
  cards: AdminOverviewCard[];
  mrrGrowth: {
    range: string;
    data: AdminOverviewTrendPoint[];
  };
  subscriberDistribution: AdminOverviewSubscriberDistributionItem[];
  recentActivity: AdminOverviewRecentActivityItem[];
}

export interface AdminOverviewResponse {
  success: boolean;
  data: AdminOverviewResponseData;
}

export type BillingRange = "3Months" | "6Months" | "1Year";
export type BillingTab = "payments" | "plan_changes";
export type BillingPaymentStatus =
  | "all"
  | "paid"
  | "pending"
  | "failed"
  | "refunded";
export type BillingPlan = "all" | "starter" | "professional" | "enterprise";

export interface AdminBillingFilters {
  tab?: BillingTab;
  range?: BillingRange;
  search?: string;
  plan?: BillingPlan;
  status?: BillingPaymentStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AdminBillingSummaryCard {
  key: "mrr" | "arr" | "failed_payments" | "churn_mtd";
  label: string;
  value: number;
  formattedValue: string;
  trend: string;
  trendDirection: "up" | "down" | "flat";
  icon?: ReactNode;
}

export interface AdminBillingTrendPoint {
  month: string;
  key: string;
  value: number;
}

export interface AdminBillingRevenueByPlanItem {
  plan: "starter" | "professional" | "enterprise";
  value: number;
  percentage: number;
}

export interface AdminBillingPaymentRow {
  id: string;
  organization: string;
  email: string;
  plan: string;
  amount: number;
  amountFormatted: string;
  billingDate: string;
  paymentMethod: string;
  status: "Paid" | "Pending" | "Failed" | "Refunded";
  actions: {
    canRetry: boolean;
    canDownloadInvoice: boolean;
  };
}

export interface AdminBillingPlanChangeRow {
  id: string;
  name: string;
  changedFrom: string;
  changedTo: string;
  changeType: string;
  date: string;
  actionedBy: string;
}

export interface AdminBillingResponseData {
  summaryCards: AdminBillingSummaryCard[];
  charts: {
    mrrTrend: {
      range: BillingRange;
      data: AdminBillingTrendPoint[];
    };
    revenueByPlan: {
      month: string;
      total: number;
      breakdown: AdminBillingRevenueByPlanItem[];
    };
  };
  tabs: {
    active: BillingTab;
    available: BillingTab[];
  };
  filters: {
    search: string;
    plan: BillingPlan;
    status: BillingPaymentStatus;
    startDate: string | null;
    endDate: string | null;
  };
  payments: {
    rows: AdminBillingPaymentRow[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  planChanges: {
    rows: AdminBillingPlanChangeRow[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  dataCoverage: {
    planChangesEstimated: boolean;
    note?: string;
  };
}

export interface AdminBillingResponse {
  success: boolean;
  data: AdminBillingResponseData;
}
