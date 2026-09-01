"use client";

import { Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ColumnDef,
  DataTable,
  useTableRows,
} from "../../dashboard/customTable";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import SendSmsForm from "../../forms/sendSMSForm";
import ProfileCompanyForm, {
  ProfileCompanyFormValues,
} from "../../forms/profileCompanyForm";
import ProfileCompanyErrorState from "./profileCompanyErrorState";
import { DataList } from "../bookingsPageComponents/singleBookingPageComponents/bookingCards";

// ─── Shared Types ───────────────────────────────────────────────────────────

export type AgreementType = "long-term" | "short-term" | "commercial-fleet" | "custom";

export type PaymentHistoryStatusTypes = "paid" | "pending" | "failed";

export interface PaymentHistoryRow {
  id: string;
  date: string;
  amount: string;
  status: PaymentHistoryStatusTypes;
}

export type CommunicationLogStatusTypes = "delivered" | "pending" | "failed";

export interface CommunicationLogRow {
  id: string;
  dateTime: string;
  recipient: string;
  message: string;
  status: CommunicationLogStatusTypes;
}

export interface AgreementData {
  type: AgreementType;
  title: string;
  label: string;
  previewLink?: string;
  shareLink: string;
}

// ─── Profile & Company Tab ──────────────────────────────────────────────────

export type ProfileCompanyTabProps = {
  loading: boolean;
  defaults: ProfileCompanyFormValues | null;
  photoUrl?: string;
  onSubmit: (values: ProfileCompanyFormValues) => void | Promise<void>;
};

export const ProfileCompanyTab = ({
  loading,
  defaults,
  photoUrl,
  onSubmit,
}: ProfileCompanyTabProps) => {
  if (loading) {
    return <ProfileCompanyFormSkeleton />;
  }

  if (!defaults) {
    return <ProfileCompanyErrorState />;
  }

  return (
    <div>
      <ProfileCompanyForm
        defaultValues={defaults}
        currentPhotoUrl={photoUrl}
        onSubmit={onSubmit}
      />
    </div>
  );
};

const ProfileCompanyFormSkeleton = () => (
  <div className="flex flex-col gap-6">
    {Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className="p-4 md:p-6 bg-white rounded-[10px] border border-gray-200 flex flex-col gap-6"
      >
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
  </div>
);

// ─── Billing Tab ────────────────────────────────────────────────────────────

export type BillingTabProps = {
  status: string;
  planName: string;
  planPrice: string;
  renewalDate: string;
  // Set only while a discount (e.g. the free-signup coupon) is active —
  // renewalDate alone would misleadingly read as "you'll be charged next
  // month" during a multi-month free period.
  freeUntilDate?: string;
  onManageBilling?: () => void;
  onWithdrawFund: () => void;
  onUnlinkStripe: () => void;
  isUnlinkingStripe?: boolean;
  paymentHistory: PaymentHistoryRow[];
  wallet?: {
    totalEarnings: number;
    totalWithdrawals: number;
    walletBalance: number;
    currency: string;
  };
};

export const BillingTab = ({
  status,
  planName,
  planPrice,
  renewalDate,
  freeUntilDate,
  onManageBilling,
  paymentHistory,
  onWithdrawFund,
  onUnlinkStripe,
  isUnlinkingStripe,
  wallet,
}: BillingTabProps) => {
  const formatAmount = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="space-y-6 max-w-237.5">
      {/* Current Plan */}
      <div className="bg-white p-3 md:p-6 rounded-[10px]">
        <h3 className="font-semibold text-base font-text mb-3 md:mb-6">
          Current Plan
        </h3>
        <div className="flex items-center justify-between gap-5">
          <div>
            <div className="flex gap-3 items-center">
              <h4 className="font-text font-bold text-[20px]">{planName}</h4>
              <BillingPlanStatus status={status} />
            </div>
            <span className="text-sm text-gray-400 font-normal mt-2 block">
              {freeUntilDate
                ? `Free until ${freeUntilDate} — then ${planPrice}`
                : `${planPrice} • Renews on ${renewalDate}`}
            </span>
          </div>
          <button
            onClick={onManageBilling}
            className="border border-blue-700 text-blue-700 bg-transparent text-xs py-2.5 px-5 rounded-xs hover:bg-blue-900 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            Manage Billing
          </button>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white p-3 md:p-6 rounded-[10px] space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base font-text">Payments</h3>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onWithdrawFund}
              className="border border-blue-700 text-blue-700 bg-transparent text-xs py-2.5 px-5 rounded-xs hover:bg-blue-900 hover:text-white transition-colors duration-300 cursor-pointer"
            >
              Withdraw Funds
            </button>
            <button
              onClick={onUnlinkStripe}
              disabled={isUnlinkingStripe}
              className="border border-red-500 bg-red-500 text-white text-xs py-2.5 px-5 rounded-xs hover:bg-red-900 hover:border-red-900 hover:text-white transition-colors duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUnlinkingStripe ? "Unlinking…" : "Unlink Stripe"}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-start gap-10">
          <DataList
            label="Total Earnings"
            value={
              wallet ? formatAmount(wallet.totalEarnings, wallet.currency) : "—"
            }
          />
          <DataList
            label="Total Withdrawals"
            value={
              wallet
                ? formatAmount(wallet.totalWithdrawals, wallet.currency)
                : "—"
            }
          />
          <DataList
            label="Wallet Balance"
            value={
              wallet ? formatAmount(wallet.walletBalance, wallet.currency) : "—"
            }
          />
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white p-3 md:p-6 rounded-[10px]">
        <h3 className="font-semibold text-base font-text mb-3">
          Billing History
        </h3>
        <PaymentHistoryTable data={paymentHistory} />
      </div>
    </div>
  );
};

const BillingPlanStatus = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    active: "bg-emerald-100 text-green-500",
    cancelled: "bg-rose-100 text-red-500",
  };

  return (
    <Badge className={`capitalize ${styles[status] ?? styles.active}`}>
      {status}
    </Badge>
  );
};

const paymentHistoryColumns: ColumnDef<PaymentHistoryRow>[] = [
  {
    key: "date",
    header: "Date",
    cell: (row) => (
      <span className="text-sm font-normal text-gray-900">{row.date}</span>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    cell: (row) => (
      <span className="text-sm font-medium text-gray-900">{row.amount}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <PaymentHistoryStatus status={row.status} />,
  },
];

const PaymentHistoryTable = ({ data }: { data: PaymentHistoryRow[] }) => {
  const { rows, pagination } = useTableRows({
    tableId: "paymentHistory",
    data,
    rowsPerPage: 10,
  });

  return (
    <DataTable
      tableId="paymentHistory"
      columns={paymentHistoryColumns}
      rows={rows}
      pagination={pagination}
      emptyMessage="No patment history found."

      linkAction={{
        linkIcon: <Download className="size-4" />,
        label: "Download Invoice",
        href: (row) => `${HOST_DASHBOARD_PATH}settings?tab=billing/${row.id}`,
      }}
    />
  );
};

const PaymentHistoryStatus = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    paid: "bg-emerald-100 text-green-500",
    pending: "bg-orange-100 text-amber-500",
    failed: "bg-rose-100 text-red-500",
  };

  return (
    <Badge className={`capitalize ${styles[status] ?? styles.paid}`}>
      {status}
    </Badge>
  );
};

// ─── Communicate Tab ────────────────────────────────────────────────────────

export type CommunicateTabProps = {
  onSendSms?: (...args: unknown[]) => void | Promise<void>;
  communicationLog: CommunicationLogRow[];
};

export const CommunicateTab = ({ communicationLog }: CommunicateTabProps) => {
  return (
    <div className="space-y-3 md:space-y-6 max-w-237.5">
      <div className="bg-white rounded-[10px] p-3 md:p-6">
        <h3 className="font-semibold text-base font-text mb-3 md:mb-6">
          Send SMS
        </h3>
        <SendSmsForm />
      </div>

      <div className="bg-white rounded-[10px] p-3 md:p-6">
        <h3 className="font-semibold text-base font-text mb-3 md:mb-6">
          Communication Log
        </h3>
        <CommunicationLogTable data={communicationLog} />
      </div>
    </div>
  );
};

const CommunicationLogColumns: ColumnDef<CommunicationLogRow>[] = [
  {
    key: "dateTime",
    header: "Date/Time",
    cell: (row) => (
      <span className="text-sm font-normal text-gray-900">{row.dateTime}</span>
    ),
  },
  {
    key: "recipient",
    header: "Recipient",
    cell: (row) => (
      <span className="text-sm font-normal text-gray-900">{row.recipient}</span>
    ),
  },
  {
    key: "message",
    header: "Message",
    cell: (row) => (
      <span className="text-sm font-normal text-gray-400">{row.message}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <CommunicationLogStatus status={row.status} />,
  },
];

const CommunicationLogTable = ({ data }: { data: CommunicationLogRow[] }) => {
  const { rows, pagination } = useTableRows({
    tableId: "communicationLog",
    data,
    rowsPerPage: 10,
  });

  return (
    <DataTable
      tableId="communicationLog"
      columns={CommunicationLogColumns}
      rows={rows}
      pagination={pagination}
      emptyMessage="You are yet to send a SMS."
    />
  );
};

const CommunicationLogStatus = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    delivered: "bg-emerald-100 text-green-500",
    pending: "bg-orange-100 text-amber-500",
    failed: "bg-rose-100 text-red-500",
  };

  return (
    <Badge className={`capitalize ${styles[status] ?? styles.delivered}`}>
      {status}
    </Badge>
  );
};

