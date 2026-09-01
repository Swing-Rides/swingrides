import type { Metadata } from "next";
import ReportIssuePageComponents from "@/components/pages/reportIssue";
import { constructMetadata } from "@/lib/seo/metadata";
import {
  JsonLd,
  getContactPageSchema,
  getBreadcrumbSchema,
} from "@/components/seo/jsonLd";

export const metadata: Metadata = constructMetadata({
  title: "Report an Issue",
  description:
    "Report an issue with your trip, vehicle condition, account, or booking dispute to Swing Rides resolution support.",
  path: "/report-an-issue",
  keywords: [
    "report issue car rental",
    "trip complaint Swing Rides",
    "dispute resolution",
    "vehicle condition report",
  ],
});

export default function ReportAnIssuePage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Report an Issue", path: "/report-an-issue" },
  ];

  return (
    <main>
      <JsonLd
        schema={[
          getContactPageSchema({
            name: "Report an Issue | Swing Rides",
            description:
              "Report an issue with your trip, vehicle condition, account, or booking dispute to Swing Rides resolution support.",
            path: "/report-an-issue",
          }),
          getBreadcrumbSchema(breadcrumbs),
        ]}
      />
      <ReportIssuePageComponents />
    </main>
  );
}