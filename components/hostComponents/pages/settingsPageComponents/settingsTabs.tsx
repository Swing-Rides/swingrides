"use client";

import { ReactNode, useState } from "react";
import { FileText, X, Download } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SendAgreementForm,
  UploadDocumentForm,
} from "../../forms/agreementForms";
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

// ─── Shared Types ───────────────────────────────────────────────────────────

export type AgreementType = "long-term" | "short-term" | "commercial-fleet";

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
  onManageBilling?: () => void;
  paymentHistory: PaymentHistoryRow[];
};

export const BillingTab = ({
  status,
  planName,
  planPrice,
  renewalDate,
  onManageBilling,
  paymentHistory,
}: BillingTabProps) => {
  return (
    <div className="space-y-6 max-w-237.5">
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
              {planPrice} • Renews on {renewalDate}
            </span>
          </div>
          <button
            onClick={onManageBilling}
            className="border border-blue-700 text-blue-700 bg-transparent py-2.5 px-4 rounded-xs hover:bg-blue-900 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            Manage Billing
          </button>
        </div>
      </div>
      <div className="bg-white p-3 md:p-6 rounded-[10px]">
        <h3 className="font-semibold text-base font-text mb-3">
          Payment History
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

// ─── Agreements Tab ─────────────────────────────────────────────────────────

export type AgreementsTabProps = {
  agreements: AgreementData[];
};

export const AgreementsTab = ({ agreements }: AgreementsTabProps) => {
  return (
    <div className="flex gap-4 justify-start items-start">
      {agreements.map((agreement) => (
        <AgreementsCard
          key={agreement.title}
          title={agreement.title}
          label={agreement.label}
          previewLink={agreement.previewLink}
          shareLink={agreement.shareLink}
        />
      ))}
    </div>
  );
};

type AgreementsCardProps = {
  title: string;
  label: string;
  previewLink?: string;
  shareLink: string;
};

const AgreementsCard = ({
  title,
  label,
  previewLink,
  shareLink,
}: AgreementsCardProps) => {
  const agreementType: AgreementType =
    title === "Long-Term" ? "long-term" : "commercial-fleet";

  const [sendOpen, setSendOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div className="grow shrink-0 p-3 md:p-6 bg-white rounded-[10px] space-y-4">
      <div className="flex justify-start items-center gap-4">
        <div className="bg-blue-200 p-3 rounded-[16px] aspect-square size-12">
          <FileText className="max-w-6" />
        </div>
        <div className="flex flex-col gap-1 justify-start items-start">
          <span className="font-bold text-base font-text text-[#0B0B0B]">
            {title}
          </span>
          <span className="text-[#6B7280] text-sm font-normal">{label}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {previewLink ? (
          <Link
            href={previewLink}
            className="w-full text-nowrap cursor-pointer"
            target="_blank"
          >
            <button className="py-3 px-6 w-full bg-transparent text-[#6B7280] border border-[#E5E7EB] rounded-xs hover:bg-blue-900 hover:text-blue-50 transition-colors duration-300 cursor-pointer">
              Preview PDF
            </button>
          </Link>
        ) : (
          <button
            onClick={() => setUploadOpen(true)}
            className="py-3 px-6 w-full bg-transparent text-[#6B7280] border border-[#E5E7EB] rounded-xs hover:bg-blue-900 hover:text-blue-50 transition-colors duration-300 cursor-pointer"
          >
            Upload Document
          </button>
        )}

        {previewLink && (
          <button
            onClick={() => setSendOpen(true)}
            className="py-3 px-6 w-full bg-blue-700 text-white border border-blue-700 rounded-xs hover:bg-blue-900 cursor-pointer transition-colors duration-300"
          >
            Send for Signature
          </button>
        )}
      </div>

      {/* Send Agreement popup */}
      {sendOpen && (
        <PopupWrapper
          onClose={() => setSendOpen(false)}
          popupTitle="Send Agreement"
          popupDescription="Share this agreement with the renter for review and signature"
        >
          <SendAgreementForm
            agreementType={agreementType}
            shareLink={shareLink}
            previewLink={previewLink}
            onClose={() => setSendOpen(false)}
          />
        </PopupWrapper>
      )}

      {/* Upload Document popup */}
      {uploadOpen && (
        <PopupWrapper
          onClose={() => setUploadOpen(false)}
          popupTitle="Upload Document"
          popupDescription="Upload your signed agreement document"
        >
          <UploadDocumentForm
            agreementType={agreementType}
            onClose={() => setUploadOpen(false)}
          />
        </PopupWrapper>
      )}
    </div>
  );
};

// ─── Shared Popup Wrapper ───────────────────────────────────────────────────

type PopupWrapperProps = {
  onClose: () => void;
  popupTitle: string;
  popupDescription?: string;
  children: ReactNode;
};

export const PopupWrapper = ({
  onClose,
  popupTitle,
  popupDescription,
  children,
}: PopupWrapperProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex flex-col w-full max-w-lg max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 pt-5 pb-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm md:text-[20px] font-semibold font-text text-neutral-900">
                {popupTitle}
              </h3>
              {popupDescription && (
                <span className="text-sm font-normal font-text text-gray-400 text-center block">
                  {popupDescription}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center size-7 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="size-4 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 md:px-5 py-4 flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};