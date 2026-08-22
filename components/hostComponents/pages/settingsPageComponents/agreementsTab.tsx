"use client";

import { useState } from "react";
import { FileText, Upload, AlertCircle } from "lucide-react";
import {
  SendAgreementForm,
  UploadDocumentForm,
} from "../../forms/agreementForms";
import { PopupWrapper } from "../../modals/popupWrapper";
import type { AgreementType, AgreementData } from "./settingsTabs";
import {
  useUpdateAgreementTemplateMutation,
  useSendAgreementForSignatureMutation,
} from "@/app/store/services/settingsApi";
import { toast } from "sonner";

// ─── Upload helper ──────────────────────────────────────────────────────────
// Same pattern used everywhere else in the app: upload to Cloudinary via the
// existing /api/upload route, then persist the resulting URL through the
// backend's own JSON endpoint.
async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("File upload failed");
  const uploaded = (await response.json()) as { secure_url?: string };
  if (!uploaded.secure_url)
    throw new Error("The upload did not return a file URL");
  return uploaded.secure_url;
}

const AGREEMENT_TYPE_TO_API: Record<AgreementType, "longTerm" | "shortTerm" | "commercialFleet" | "custom"> = {
  "long-term": "longTerm",
  "short-term": "shortTerm",
  "commercial-fleet": "commercialFleet",
  custom: "custom",
};

// ─── Constants ──────────────────────────────────────────────────────────────

const AGREEMENT_CARDS: {
  type: AgreementType;
  title: string;
  label: string;
}[] = [
  {
    type: "long-term",
    title: "Long-Term Rental",
    label: "Standard long-term vehicle rental agreement",
  },
  {
    type: "short-term",
    title: "Short-Term Rental",
    label: "Standard short-term vehicle rental agreement",
  },
  {
    type: "commercial-fleet",
    title: "Commercial Fleet",
    label: "Fleet rental agreement for commercial clients",
  },
  {
    type: "custom",
    title: "Custom Agreement",
    label: "Upload your own custom rental agreement",
  },
];

// ─── AgreementsTab ──────────────────────────────────────────────────────────

export type AgreementsTabProps = {
  agreements: AgreementData[];
};

export const AgreementsTab = ({ agreements }: AgreementsTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {AGREEMENT_CARDS.map((card) => {
        const data = agreements.find((a) => a.type === card.type);
        return (
          <AgreementsCard
            key={card.type}
            agreementType={card.type}
            title={card.title}
            label={card.label}
            previewLink={data?.previewLink}
            shareLink={data?.shareLink ?? ""}
          />
        );
      })}
    </div>
  );
};

// ─── AgreementsCard ─────────────────────────────────────────────────────────

type AgreementsCardProps = {
  agreementType: AgreementType;
  title: string;
  label: string;
  previewLink?: string;
  shareLink: string;
};

const AgreementsCard = ({
  agreementType,
  title,
  label,
  previewLink,
  shareLink,
}: AgreementsCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const isCustom = agreementType === "custom";

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
        {isCustom ? (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2.5 py-3 px-6 w-full bg-transparent text-[#6B7280] border border-[#E5E7EB] rounded-xs hover:bg-blue-900 hover:text-blue-50 transition-colors duration-300 cursor-pointer"
          >
            <Upload className="size-4" />
            Upload Document
          </button>
        ) : (
          <button
            className="py-3 px-6 w-full text-nowrap bg-transparent text-[#6B7280] border border-[#E5E7EB] rounded-xs hover:bg-blue-900 hover:text-blue-50 transition-colors duration-300 cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            Send Agreement
          </button>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <AgreementModal
          isCustom={isCustom}
          agreementType={agreementType}
          previewLink={previewLink}
          shareLink={shareLink}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

// ─── Agreement Modal ────────────────────────────────────────────────────────

type AgreementModalProps = {
  isCustom: boolean;
  agreementType: AgreementType;
  previewLink?: string;
  shareLink: string;
  onClose: () => void;
};

const AgreementModal = ({
  isCustom,
  agreementType,
  previewLink,
  shareLink,
  onClose,
}: AgreementModalProps) => {
  const [updateAgreementTemplate] = useUpdateAgreementTemplateMutation();
  const [sendAgreementForSignature] = useSendAgreementForSignatureMutation();

  const handleSendAgreement = async (values: { email: string; message: string }) => {
    try {
      await sendAgreementForSignature({
        agreementType: AGREEMENT_TYPE_TO_API[agreementType],
        email: values.email,
        message: values.message || undefined,
      }).unwrap();
    } catch (error) {
      toast.error(getMutationErrorMessage(error, "Failed to send agreement"));
      throw error;
    }
  };

  const handleUploadCustomAgreement = async (values: { email: string; document: FileList }) => {
    const file = values.document?.[0];
    if (!file) {
      toast.error("Please select a document to upload");
      return;
    }

    try {
      const pdfUrl = await uploadFile(file);
      await updateAgreementTemplate({
        agreementType: AGREEMENT_TYPE_TO_API[agreementType],
        payload: { pdfUrl },
      }).unwrap();

      await sendAgreementForSignature({
        agreementType: AGREEMENT_TYPE_TO_API[agreementType],
        email: values.email,
      }).unwrap();

      toast.success("Custom agreement uploaded and sent successfully");
    } catch (error) {
      toast.error(getMutationErrorMessage(error, "Failed to upload agreement"));
      throw error;
    }
  };

  // Custom type → always show upload form (with email + file)
  if (isCustom) {
    return (
      <PopupWrapper
        onClose={onClose}
        popupTitle="Upload Custom Agreement"
        popupDescription="Upload your custom agreement and enter the renter's email to send it"
      >
        <UploadDocumentForm
          agreementType={agreementType}
          onClose={onClose}
          onSubmit={handleUploadCustomAgreement}
        />
      </PopupWrapper>
    );
  }

  // Non-custom type without a server-loaded document → empty state
  if (!previewLink) {
    return (
      <PopupWrapper
        onClose={onClose}
        popupTitle="Send Agreement"
        popupDescription="Share this agreement with the renter for review and signature"
      >
        <NoDocumentState onClose={onClose} />
      </PopupWrapper>
    );
  }

  // Non-custom type with a server-loaded document → send form
  return (
    <PopupWrapper
      onClose={onClose}
      popupTitle="Send Agreement"
      popupDescription="Share this agreement with the renter for review and signature"
    >
      <SendAgreementForm
        agreementType={agreementType}
        shareLink={shareLink}
        previewLink={previewLink}
        onClose={onClose}
        onSubmit={handleSendAgreement}
      />
    </PopupWrapper>
  );
};

// ─── Mutation error helper ───────────────────────────────────────────────────

function getMutationErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== "object") return fallback;

  const data = "data" in error ? (error as { data?: unknown }).data : undefined;

  if (typeof data === "string") return data;

  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
}

// ─── Empty state when no document is loaded ─────────────────────────────────

const NoDocumentState = ({ onClose }: { onClose: () => void }) => (
  <div className="flex flex-col items-center gap-4 py-6 text-center">
    <div className="flex items-center justify-center size-14 rounded-full bg-amber-50">
      <AlertCircle className="size-7 text-amber-500" />
    </div>
    <div className="flex flex-col gap-1.5">
      <h4 className="text-[#1F2937] text-sm font-semibold font-text">
        No Agreement Available
      </h4>
      <p className="text-[#6B7280] text-sm font-normal font-text max-w-xs">
        No agreement document has been uploaded yet. Please contact support or
        upload a custom agreement.
      </p>
    </div>
    <button
      type="button"
      onClick={onClose}
      className="px-5 py-2.5 bg-blue-700 hover:bg-blue-900 rounded-xs text-white text-sm font-medium font-text cursor-pointer transition-colors duration-300"
    >
      Close
    </button>
  </div>
);