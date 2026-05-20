// ─── Admin Users ──────────────────────────────────────────────────────────────

export type AdminUserRole = 'super admin' | 'admin' | 'support';
export type AdminUserStatus = 'active' | 'invited' | 'suspended';

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  lastActive: string;
  dateAdded: string;
}

export interface AdminUsersListData {
  admins: AdminUserRow[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminUsersListResponse {
  success: boolean;
  data: AdminUsersListData;
}

export interface AdminActivityLogRow {
  id: string;
  name: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface AdminActivityLogData {
  logs: AdminActivityLogRow[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminActivityLogResponse {
  success: boolean;
  data: AdminActivityLogData;
}

export interface InviteAdminPayload {
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'support';
}

export interface InviteAdminResponse {
  success: boolean;
  data: AdminUserRow;
}

// ─── Platform Settings ────────────────────────────────────────────────────────

export interface PlatformFeaturesSettings {
  hostRegistrations: boolean;
  renterBookingFlow: boolean;
  paymentProcessing: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  licenceVerification: boolean;
  hostRenterLinking: boolean;
  reviewsRatings: boolean;
  disputesManagement: boolean;
  maintenanceTracking: boolean;
}

export interface PlanLimits {
  maxVehicles: number;
  monthlyPrice: number;
}

export interface SystemSettings {
  defaultTaxRate: number;
  platformCurrency: string;
  globalTimezone: string;
  minBookingDuration: number;
  maxBookingDuration: number;
  cancellationPolicyWindow: number;
  plans: {
    starter: PlanLimits;
    professional: PlanLimits;
    enterprise: PlanLimits;
  };
}

export interface OperationalControlsSettings {
  automaticHostApproval: boolean;
  automaticRenterVerification: boolean;
  auditLogging: boolean;
}

export interface SecuritySettings {
  strongPasswordRequirements: boolean;
}

export interface NotificationChannels {
  email: boolean;
  sms: boolean;
}

export interface CommunicationSettings {
  smsSenderName: string;
  supportEmail: string;
  notifications: Record<string, NotificationChannels>;
}

export interface PlatformSettingsData {
  platformFeatures: PlatformFeaturesSettings;
  systemSettings: SystemSettings;
  operationalControls: OperationalControlsSettings;
  security: SecuritySettings;
  communication: CommunicationSettings;
}

export interface PlatformSettingsResponse {
  success: boolean;
  data: PlatformSettingsData;
}

// ─── Email Actions ────────────────────────────────────────────────────────────

export type EmailLogStatus = 'sent' | 'failed';

export interface RecentSendRow {
  id: string;
  emailType: string;
  name: string;
  email: string;
  triggeredBy: string;
  sentAt: string;
  status: EmailLogStatus;
}

export interface RecentSendsData {
  sends: RecentSendRow[];
  total: number;
  page: number;
  totalPages: number;
}

export interface RecentSendsResponse {
  success: boolean;
  data: RecentSendsData;
}

export interface RecipientResult {
  id: string;
  name: string;
  email: string;
  type: 'renter' | 'host';
}

export interface RecipientsResponse {
  success: boolean;
  data: RecipientResult[];
}

export interface SendEmailPayload {
  emailType: string;
  recipientId: string;
}

// ─── Query arg types ──────────────────────────────────────────────────────────

export interface AdminUsersQuery {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface ActivityLogQuery {
  page?: number;
  limit?: number;
}

export interface RecentSendsQuery {
  page?: number;
  limit?: number;
}
