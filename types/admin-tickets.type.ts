import { AdminTicketStatusItemsType, AdminTicketTypesItemsType } from "@/components/superAdminPages/utils/helpers";

export type AdminTicketSubmitterType = "host" | "renter" | "account";

export interface AdminTicketsQuery {
  search?: string;
  status?: AdminTicketStatusItemsType;
  issueType?: AdminTicketTypesItemsType;
  submitterType?: AdminTicketSubmitterType;
  page?: number;
  limit?: number;
}

export interface AdminTicketRow {
  id: string;
  ticketCode: string;
  submitterType: AdminTicketSubmitterType;
  submitterName: string;
  submitterEmail: string;
  issueType: AdminTicketTypesItemsType;
  bookingReference: string;
  description: string;
  status: AdminTicketStatusItemsType;
  isUrgent: boolean;
  photoUrls: string[];
  dateSubmitted: string;
}

export interface AdminTicketDetail extends AdminTicketRow {
  responseMessage?: string;
  responseDate?: string;
  respondedBy?: string;
}

export interface AdminTicketSummary {
  totalTickets: number;
  open: number;
  inProgress: number;
  resolved: number;
  damageReports: number;
}

export interface AdminTicketPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminTicketsResponse {
  success: boolean;
  data: {
    summary: AdminTicketSummary;
    rows: AdminTicketRow[];
    pagination: AdminTicketPagination;
  };
}

export interface AdminTicketDetailResponse {
  success: boolean;
  data: AdminTicketDetail;
}

export interface ResolveTicketPayload {
  ticketId: string;
  responseMessage?: string;
}
