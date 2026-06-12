"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import PageWrapper from "../../dashboard/pageWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColumnDef, DataTable, useTableRows } from "../../dashboard/customTable";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import HostReportAnIssueForm from "./reportIssueForm";
import { Separator } from "@/components/ui/separator";


export default function ReportAnIssuePageComponents() {
        return (
                <Suspense fallback={<div>Loading...</div>}>
                        <ReportAnIssuePageContent />
                </Suspense>
        )
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
                                                        <HostReportAnIssueForm />
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
                cell: (row) => (
                        <span className="text-blue-700">
                                {row.id}
                        </span>
                ),

        },
        { 
                key: "issueType", 
                header: "Issue Type"

        },
        { 
                key: "bookingReference", 
                header: "Booking Reference",
                cell: (row) => (
                        <span className="text-cyan-500">
                                {row.bookingReference}
                        </span>
                ),

        },
        { 
                key: "dateSubmitted", 
                header: "Date Submitted",
                cell: (row) => (
                        <span className="text-gray-500">
                                {row.dateSubmitted}
                        </span>
                ),
        },
        {
                key: "status",
                header: "Status",
                cell: (row) => (
                        <ReportStatus status={row.status}/>
                ),
        },
];

export function ReportStatus({ status }: { status: IssueReportStatusTypes }) {

        const styles: Record<string, string> = {
                open: "bg-blue-50 text-blue-700",
                inReview: "bg-orange-50 text-amber-500",
                resolved: "bg-green-50 text-green-500",
        };

        return (
                <span className={`flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] ?? styles.open}`}>
                        {status === "inReview" ? "In Review" : status}
                </span>
        );
}

const MOCK_REPORTS: ReportRow[] = [
        { id: "REP-001", issueType: "Billing Error", bookingReference: "BK-1001", dateSubmitted: "2026-06-10", status: "open" },
        { id: "REP-002", issueType: "Vehicle Damage", bookingReference: "BK-2001", dateSubmitted: "2026-06-08", status: "inReview" },
        { id: "REP-003", issueType: "Late Return", bookingReference: "BK-3002", dateSubmitted: "2026-06-05", status: "resolved" },
        { id: "REP-004", issueType: "Cleanliness", bookingReference: "BK-5001", dateSubmitted: "2026-06-02", status: "open" },
        { id: "REP-005", issueType: "Mechanical Issue", bookingReference: "BK-7001", dateSubmitted: "2026-05-30", status: "inReview" },
        { id: "REP-006", issueType: "Fuel Level", bookingReference: "BK-1301", dateSubmitted: "2026-05-28", status: "resolved" },
        { id: "REP-007", issueType: "Customer Conduct", bookingReference: "BK-1502", dateSubmitted: "2026-05-25", status: "open" },
        { id: "REP-008", issueType: "Access Issue", bookingReference: "BK-1601", dateSubmitted: "2026-05-20", status: "resolved" },
        { id: "REP-009", issueType: "Billing Error", bookingReference: "BK-1201", dateSubmitted: "2026-05-18", status: "inReview" },
        { id: "REP-010", issueType: "Vehicle Damage", bookingReference: "BK-9001", dateSubmitted: "2026-05-15", status: "open" },
        { id: "REP-011", issueType: "Late Return", bookingReference: "BK-1002", dateSubmitted: "2026-05-12", status: "resolved" },
        { id: "REP-012", issueType: "Mechanical Issue", bookingReference: "BK-3003", dateSubmitted: "2026-05-10", status: "inReview" },
        { id: "REP-013", issueType: "Cleanliness", bookingReference: "BK-4002", dateSubmitted: "2026-05-08", status: "resolved" },
        { id: "REP-014", issueType: "Fuel Level", bookingReference: "BK-5002", dateSubmitted: "2026-05-05", status: "open" },
        { id: "REP-015", issueType: "Access Issue", bookingReference: "BK-6002", dateSubmitted: "2026-05-01", status: "resolved" }
];

export function ReportsTable() {
        const data = MOCK_REPORTS as ReportRow[]

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
