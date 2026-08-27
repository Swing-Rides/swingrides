export type IssueTypeValue =
  | "technical issue"
  | "billing query"
  | "dispute"
  | "relist request"
  | "damage report"
  | "incidental charge"
  | "feature request";

export const issueTypeOptions: { value: IssueTypeValue; label: string }[] = [
  { value: "technical issue", label: "Technical Issue" },
  { value: "billing query", label: "Billing Query" },
  { value: "dispute", label: "Dispute" },
  { value: "relist request", label: "Relist Request" },
  { value: "damage report", label: "Damage Report" },
  { value: "incidental charge", label: "Incidental Charge" },
  { value: "feature request", label: "Feature Request" },
];
