import SingleIssueReportPage from "@/components/hostComponents/pages/reportAnIssuePageComponents/singleIssueReportPage";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SingleIssueReportPage reportId={id} />;
}
