export type IssueTypeValue =
  | "technical issue"
  | "billing query"
  | "dispute"
  | "relist request"
  | "damage report"
  | "incidental charge"
  | "feature request"
  | "account_access"
  | "profile_verification"
  | "billing_payment"
  | "security_suspicious"
  | "notifications_settings"
  | "deactivation"
  | "other";

export const issueTypeOptions: { value: IssueTypeValue; label: string }[] = [
  { value: "technical issue", label: "Technical Issue" },
  { value: "billing query", label: "Billing Query" },
  { value: "dispute", label: "Dispute" },
  { value: "relist request", label: "Relist Request" },
  { value: "damage report", label: "Damage Report" },
  { value: "incidental charge", label: "Incidental Charge" },
  { value: "feature request", label: "Feature Request" },
  { value: "account_access", label: "Account Access / Login Issue" },
  { value: "profile_verification", label: "Identity & Profile Verification" },
  { value: "billing_payment", label: "Payment Method & Billing Issue" },
  { value: "security_suspicious", label: "Security & Suspicious Activity" },
  { value: "notifications_settings", label: "Notification & Account Settings" },
  { value: "deactivation", label: "Account Deactivation / Deletion Request" },
  { value: "other", label: "Other Account Issue" },
];
