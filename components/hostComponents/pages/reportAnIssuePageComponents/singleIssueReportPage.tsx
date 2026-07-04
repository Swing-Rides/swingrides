"use client";

import { Separator } from "@/components/ui/separator";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  IssueReportStatusTypes,
  ReportStatus,
} from "./reportAnIssuePageComponents";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useGetIssueReportByIdQuery } from "@/app/store/services/reportApi";

interface SingleIssueReportPageProps {
  reportId: string;
}

const formatIssueType = (issueType: string) =>
  issueType
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatDateTime = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function SingleIssueReportPage({ reportId }: SingleIssueReportPageProps) {
  const { data, isLoading, isError } = useGetIssueReportByIdQuery(reportId);

  if (isLoading) {
    return (
      <div className="p-3 md:p-8">
        <span className="text-sm text-gray-500">Loading report details...</span>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="p-3 md:p-8">
        <span className="text-sm text-red-600">
          We could not load this report right now. Please try again.
        </span>
      </div>
    );
  }

  const report = data.data;
  const attachedPhotos = report.photoUrls.map((src, index) => ({
    id: `IMG-${index + 1}`,
    src,
  }));

  return (
    <div className="p-3 md:p-8 space-y-4 md:space-y-8">
      <Breadcrumbs id={reportId} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <div className="col-span-1 md:col-span-2 space-y-3 md:space-y-6">
          <CardWrapper>
            <div className="flex flex-col gap-3 md:gap-6">
              <h3 className="text-lg md:text-2xl font-bold font-text text-[#1F2937] leading-6">
                Report Details
              </h3>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div className="flex flex-col gap-2 justify-start">
                  <DataTitle title="Report ID" />
                  <span className="font-medium text-sm text-blue-700">
                    {report.id}
                  </span>
                </div>
                <div className="flex flex-col gap-2 justify-start">
                  <DataTitle title="Issue Type" />
                  <span className="font-medium text-sm">
                    {formatIssueType(report.issueType)}
                  </span>
                </div>
                <div className="flex flex-col gap-2 justify-start">
                  <DataTitle title="Booking Reference" />
                  <span className="font-medium text-sm text-cyan-500">
                    {report.bookingReference}
                  </span>
                </div>
                <div className="flex flex-col gap-2 justify-start">
                  <DataTitle title="Date Submitted" />
                  <span className="font-medium text-sm">
                    {formatDateTime(report.dateSubmitted)}
                  </span>
                </div>
              </div>
              <div>
                {report.isUrgent && (
                  <Badge className="p-1.5 bg-red-50 text-red-500">
                    🔴 Marked as Urgent
                  </Badge>
                )}
              </div>
              <Separator />
              <div className="flex flex-col gap-3 justify-start">
                <DataTitle title="Issue Description" />
                <span className="text-sm font-normal text-[#1F2937]">
                  {report.description}
                </span>
              </div>
            </div>
          </CardWrapper>
          <CardWrapper>
            <div className="space-y-5">
              <h3 className="font-semibold text-base font-text leading-6">
                Attached Photo{attachedPhotos.length > 1 ? "s" : ""}{" "}
                {attachedPhotos.length > 0 && `(${attachedPhotos.length})`}
              </h3>
              <Separator />
              <div className="flex flex-wrap gap-2 justify-start items-center">
                {attachedPhotos.length === 0 ? (
                  <EmptyImagePlaceholder />
                ) : (
                  attachedPhotos.map((item) => (
                    <div
                      key={item.id}
                      className="basis-60 grow-0 shrink aspect-250/150 rounded-[10px] border overflow-hidden group"
                    >
                      <Image
                        src={item.src}
                        alt={item.id}
                        width={250}
                        height={150}
                        className="w-full object-cover object-center aspect-250/150 group-hover:scale-110 transition-transform duration-300 ease-in-out"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardWrapper>
        </div>
        <div className="col-span-1">
          <CardWrapper>
            <div className="space-y-5">
              <h3 className="font-semibold text-base font-text leading-6">
                Response from SwingRides
              </h3>
              <Separator />
              <div className="flex flex-col gap-3 justify-start">
                <DataTitle title="Current Status" />
                <ReportStatus status={report.status as IssueReportStatusTypes} />
              </div>
              <div className="flex flex-col gap-3 justify-start">
                <DataTitle title="Message" />
                <div className="p-2.5 md:p-4 rounded-[10px] bg-gray-200">
                  <span className="font-normal text-sm text-[#1F2937]">
                    {report.responseMessage ?? "No response from SwingRides yet."}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 justify-start">
                <DataTitle title="Response Date" />
                <span className="text-sm font-normal text-[#6B7280]">
                  {formatDateTime(report.responseDate)}
                </span>
              </div>
              <div className="flex flex-col gap-3 justify-start">
                <DataTitle title="Responded By" />
                <span className="font-semibold text-sm text-[#1F2937]">
                  {report.respondedBy ?? "-"}
                </span>
              </div>
            </div>
          </CardWrapper>
        </div>
      </div>
    </div>
  );
}

const Breadcrumbs = ({ id }: { id: string }) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex gap-2 items-center justify-start">
        <span className="text-gray-500 text-sm font-medium leading-5 font-text">
          Report An Issue
        </span>
        <ChevronRight className="size-4 text-gray-500" />
        <Link
          href={`${HOST_DASHBOARD_PATH}report-an-issue?tab=myReports`}
          className="text-gray-500 text-sm font-medium leading-5 font-text"
        >
          My Reports
        </Link>
        <ChevronRight className="size-4 text-gray-500" />
        <span className="text-gray-900 text-sm font-medium leading-5 font-text">
          {id}
        </span>
      </div>
      <Link
        href={`${HOST_DASHBOARD_PATH}report-an-issue?tab=myReports`}
        className="flex items-center justify-start"
      >
        <ArrowLeft className="mr-2 size-4 text-blue-700" />
        <span className="text-blue-700 font-semibold text-sm leadeing-5 font-text">
          Back to My Reports
        </span>
      </Link>
    </div>
  );
};

const CardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white rounded-[10px] border p-2.5 md:p-6">
      {children}
    </div>
  );
};

const DataTitle = ({ title }: { title: string }) => {
  return (
    <h4 className="text-gray-500 text-xs font-semibold font-text uppercase">
      {title}
    </h4>
  );
};

const EmptyImagePlaceholder = () => {
  return (
    <div className="w-full h-40 bg-gray-100 rounded-[10px] flex items-center justify-center">
      <span className="text-gray-400 text-sm">
        No image was attached to this issue report
      </span>
    </div>
  );
};
