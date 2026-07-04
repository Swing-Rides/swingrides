"use client";

import { Suspense } from "react";
import { useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import PageWrapper from "../../dashboard/pageWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ColumnDef,
  DataTable,
  useTableRows,
} from "../../dashboard/customTable";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import HostReportAnIssueForm from "./reportIssueForm";
import { Separator } from "@/components/ui/separator";
import type { HostIssueReportSubmitPayload } from "./reportIssueForm";
import {
  useCreateIssueReportMutation,
  useGetIssueReportsQuery,
} from "@/app/store/services/reportApi";

export default function ReportAnIssuePageComponents() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportAnIssuePageContent />
    </Suspense>
  );
}

function ReportAnIssuePageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") ?? "reportAnIssue";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("reports_page");
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const [createIssueReport] = useCreateIssueReportMutation();

  const handleCreateIssueReport = async (
    payload: HostIssueReportSubmitPayload,
  ) => {
    await createIssueReport(payload).unwrap();

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "myReports");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <PageWrapper
      pageTitle="Report An Issue"
      pageDescription="Submit a complaint or support request to the SwingRides team. We'll respond within 24 hours."
    >
      <div className="mt-4 md:mt-8">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full space-y-5 md:space-y-8"
        >
          <TabsList variant="line">
            <TabsTrigger
              value="reportAnIssue"
              className="data-[state=active]:text-blue-700 group-data-[variant=line]/tabs-list:data-active:after:bg-blue-700 cursor-pointer"
            >
              Report an Issue
            </TabsTrigger>
            <TabsTrigger
              value="myReports"
              className="data-[state=active]:text-blue-700 group-data-[variant=line]/tabs-list:data-active:after:bg-blue-700 cursor-pointer"
            >
              My Reports
            </TabsTrigger>
          </TabsList>
          <TabsContent value="reportAnIssue">
            <div className="p-3 md:p-8 bg-white rounded-[10px] border border-[#E5E7EB] max-w-225 space-y-5">
              <h3 className="font-text font-semibold text-base leading-6">
                Issue Details
              </h3>
              <Separator />
              <HostReportAnIssueForm onSubmit={handleCreateIssueReport} />
            </div>
          </TabsContent>
          <TabsContent value="myReports">
            <ReportsTable />
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
}

export type IssueReportStatusTypes = "open" | "inReview" | "resolved";

interface ReportRow {
  id: string;
  issueType: string;
  bookingReference: string;
  dateSubmitted: string;
  status: IssueReportStatusTypes;
}

const reportColumns: ColumnDef<ReportRow>[] = [
  {
    key: "id",
    header: "Report ID",
    cell: (row) => <span className="text-blue-700">{row.id}</span>,
  },
  {
    key: "issueType",
    header: "Issue Type",
  },
  {
    key: "bookingReference",
    header: "Booking Reference",
    cell: (row) => (
      <span className="text-cyan-500">{row.bookingReference}</span>
    ),
  },
  {
    key: "dateSubmitted",
    header: "Date Submitted",
    cell: (row) => <span className="text-gray-500">{row.dateSubmitted}</span>,
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <ReportStatus status={row.status} />,
  },
];

export function ReportStatus({ status }: { status: IssueReportStatusTypes }) {
  const styles: Record<string, string> = {
    open: "bg-blue-50 text-blue-700",
    inReview: "bg-orange-50 text-amber-500",
    resolved: "bg-green-50 text-green-500",
  };

  return (
    <span
      className={`flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] ?? styles.open}`}
    >
      {status === "inReview" ? "In Review" : status}
    </span>
  );
}

const formatIssueType = (issueType: string) =>
  issueType
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export function ReportsTable() {
  const { data: reportsResponse } = useGetIssueReportsQuery({
    page: 1,
    limit: 100,
  });

  const data = useMemo<ReportRow[]>(() => {
    const items = reportsResponse?.data.items ?? [];
    return items.map((item) => ({
      id: item.id,
      issueType: formatIssueType(item.issueType),
      bookingReference: item.bookingReference,
      dateSubmitted: item.dateSubmitted,
      status: item.status,
    }));
  }, [reportsResponse]);

  const { rows, pagination } = useTableRows({
    tableId: "reports",
    data,
    rowsPerPage: 10,
  });

  return (
    <DataTable
      tableId="reports"
      columns={reportColumns}
      rows={rows}
      pagination={pagination}
      emptyMessage="You are yet to submit any reports. If you have an issue with a booking, please submit a report and our team will get back to you within 24 hours."
      linkAction={{
        label: "View Details",
        href: (row) => `${HOST_DASHBOARD_PATH}report-an-issue/${row.id}`,
      }}
    />
  );
}
