"use client";

import { useState } from "react";
import { CircleCheckBig, CircleX, ExternalLink } from "lucide-react";
import PopupWrapper from "./popupWrapper";
import { formatDate } from "../../utils/formatDate";
import {
  useApproveHostBusinessVerificationMutation,
  useRejectHostBusinessVerificationMutation,
} from "@/app/store/services/adminApi";
import { HostBusinessVerificationStatus } from "@/app/store/services/settingsApi";

const STATUS_STYLE: Record<
  HostBusinessVerificationStatus,
  { label: string; textColor: string; bgColor: string }
> = {
  not_submitted: {
    label: "Not Submitted",
    textColor: "#6B7280",
    bgColor: "#F3F4F6",
  },
  pending: { label: "Pending", textColor: "#B45309", bgColor: "#FEF3C7" },
  approved: { label: "Approved", textColor: "#047857", bgColor: "#D1FAE5" },
  rejected: { label: "Rejected", textColor: "#B91C1C", bgColor: "#FEE2E2" },
};

type BusinessVerificationCardProps = {
  hostId: string;
  status: HostBusinessVerificationStatus;
  businessLicenseUrl?: string;
  submittedAt?: string;
};

export default function BusinessVerificationCard({
  hostId,
  status,
  businessLicenseUrl,
  submittedAt,
}: BusinessVerificationCardProps) {
  const [popup, setPopup] = useState<"approve" | "reject" | null>(null);
  const [approve, { isLoading: approving }] =
    useApproveHostBusinessVerificationMutation();
  const [reject, { isLoading: rejecting }] =
    useRejectHostBusinessVerificationMutation();

  const style = STATUS_STYLE[status];
  const canReview = status === "pending";

  const handleApprove = async () => {
    try {
      await approve(hostId).unwrap();
    } catch (error) {
      console.error("Approve business verification failed:", error);
    } finally {
      setPopup(null);
    }
  };

  const handleReject = async () => {
    try {
      await reject(hostId).unwrap();
    } catch (error) {
      console.error("Reject business verification failed:", error);
    } finally {
      setPopup(null);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h3 className="text-neutral-950 text-sm font-semibold font-text leading-5">
            Business Verification
          </h3>
          <span
            className="rounded-full px-2.5 py-1 text-xs font-medium font-text border"
            style={{
              color: style.textColor,
              backgroundColor: style.bgColor,
              borderColor: style.bgColor,
            }}
          >
            {style.label}
          </span>
        </div>
        {submittedAt && (
          <span className="text-gray-500 text-xs font-normal font-text leading-4">
            Submitted: {formatDate(submittedAt)}
          </span>
        )}
        {businessLicenseUrl && (
          <a
            href={businessLicenseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-900 transition-colors w-fit"
          >
            View business license
            <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>

      {canReview && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPopup("approve")}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-950 transition-colors duration-300 rounded-md px-6 py-2 text-white text-xs font-semibold font-text leading-5 border border-emerald-500 cursor-pointer"
          >
            <CircleCheckBig className="size-3.5" />
            <span>Approve</span>
          </button>
          <button
            type="button"
            onClick={() => setPopup("reject")}
            className="flex items-center gap-1.5 bg-transparent hover:bg-red-500 transition-colors duration-300 rounded-md px-6 py-2 text-red-500 hover:text-red-100 text-xs font-semibold font-text leading-5 border border-red-500 cursor-pointer"
          >
            <CircleX className="size-3.5" />
            <span>Reject</span>
          </button>
        </div>
      )}

      <PopupWrapper
        open={popup === "approve"}
        title="Approve business verification"
        onClose={() => setPopup(null)}
        onConfirm={handleApprove}
        confirmLabel="Approve"
        confirmDisabled={approving}
      >
        <p className="text-gray-500 text-sm font-normal font-text leading-5">
          This will mark the host&apos;s business license as verified.
        </p>
      </PopupWrapper>

      <PopupWrapper
        open={popup === "reject"}
        title="Reject business verification"
        onClose={() => setPopup(null)}
        onConfirm={handleReject}
        confirmLabel="Reject"
        confirmVariant="danger"
        confirmDisabled={rejecting}
      >
        <p className="text-gray-500 text-sm font-normal font-text leading-5">
          This will reject the host&apos;s submitted business license. They
          will need to resubmit.
        </p>
      </PopupWrapper>
    </div>
  );
}
