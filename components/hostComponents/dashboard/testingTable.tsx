"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import {
        DataTable,
        TableToolbar,
        exportToCSV,
        useTableRows,
        type ColumnDef,
} from "@/components/hostComponents/dashboard/customTable";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface SubscriberRow {
        id: string;
        organization: string;
        ownerEmail: string;
        plan: "starter" | "pro" | "enterprise";
        vehicles: number;
        status: "active" | "inactive" | "trial";
        monthlyRevenue: number;
        joinedDate: string;
}

interface TransactionRow {
        id: string;
        reference: string;
        amount: number;
        currency: string;
        createdAt: string;
}

interface ReportRow {
        id: string;
        title: string;
        type: string;
        region: string;
        period: string;
        generatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_SUBSCRIBERS: SubscriberRow[] = [
        { id: "sub_1", organization: "Acme Logistics", ownerEmail: "ops@acme.com", plan: "enterprise", vehicles: 42, status: "active", monthlyRevenue: 8400, joinedDate: "2023-03-12" },
        { id: "sub_2", organization: "Rapid Freight Co.", ownerEmail: "admin@rapid.io", plan: "pro", vehicles: 18, status: "active", monthlyRevenue: 3200, joinedDate: "2023-07-01" },
        { id: "sub_3", organization: "City Couriers", ownerEmail: "info@citycouriers.ng", plan: "starter", vehicles: 6, status: "trial", monthlyRevenue: 0, joinedDate: "2024-01-20" },
        { id: "sub_4", organization: "Atlas Transport", ownerEmail: "billing@atlas.com", plan: "pro", vehicles: 25, status: "inactive", monthlyRevenue: 0, joinedDate: "2022-11-08" },
        { id: "sub_5", organization: "Sunrise Deliveries", ownerEmail: "hello@sunrise.co", plan: "enterprise", vehicles: 60, status: "active", monthlyRevenue: 12000, joinedDate: "2022-06-15" },
        { id: "sub_6", organization: "Delta Movers", ownerEmail: "ops@deltamovers.com", plan: "starter", vehicles: 3, status: "trial", monthlyRevenue: 0, joinedDate: "2024-04-02" },
        { id: "sub_7", organization: "Peak Haulage", ownerEmail: "cfo@peakhaulage.com", plan: "pro", vehicles: 14, status: "active", monthlyRevenue: 2800, joinedDate: "2023-09-30" },
];

const MOCK_TRANSACTIONS: TransactionRow[] = [
        { id: "txn_1", reference: "TXN-20240301-001", amount: 8400.00, currency: "USD", createdAt: "2024-03-01T09:15:00Z" },
        { id: "txn_2", reference: "TXN-20240301-002", amount: 3200.00, currency: "USD", createdAt: "2024-03-01T10:42:00Z" },
        { id: "txn_3", reference: "TXN-20240302-001", amount: 12000.00, currency: "USD", createdAt: "2024-03-02T08:00:00Z" },
        { id: "txn_4", reference: "TXN-20240302-002", amount: 2800.00, currency: "USD", createdAt: "2024-03-02T14:20:00Z" },
        { id: "txn_5", reference: "TXN-20240303-001", amount: 950.50, currency: "USD", createdAt: "2024-03-03T11:05:00Z" },
];

const MOCK_REPORTS: ReportRow[] = [
        { id: "rep_1", title: "Q1 Revenue Summary", type: "revenue", region: "na", period: "q1", generatedAt: "2024-04-01T08:00:00Z" },
        { id: "rep_2", title: "Fleet Usage – Africa Q1", type: "usage", region: "af", period: "q1", generatedAt: "2024-04-02T09:30:00Z" },
        { id: "rep_3", title: "EU Audit Report Q4 2023", type: "audit", region: "eu", period: "q4", generatedAt: "2024-01-10T07:45:00Z" },
        { id: "rep_4", title: "Q2 Revenue – North America", type: "revenue", region: "na", period: "q2", generatedAt: "2024-07-01T08:00:00Z" },
        { id: "rep_5", title: "Africa Usage Q2", type: "usage", region: "af", period: "q2", generatedAt: "2024-07-03T10:00:00Z" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
        const styles: Record<string, string> = {
                active: "bg-green-50 text-green-700 border-green-200",
                inactive: "bg-gray-100 text-gray-500 border-gray-200",
                trial: "bg-amber-50 text-amber-700 border-amber-200",
        };
        return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${styles[status] ?? styles.inactive}`}>
                        {status}
                </span>
        );
}

// function DetailRow({ label, value }: { label: string; value: string }) {
//         return (
//                 <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
//                         <span className="text-gray-500">{label}</span>
//                         <span className="font-medium text-neutral-800">{value}</span>
//                 </div>
//         );
// }

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

const subscriberColumns: ColumnDef<SubscriberRow>[] = [
        {
                key: "organization",
                header: "Organisation",
                className: "w-56",
                cell: (row) => (
                        <div className="flex flex-col">
                                <span className="text-sm font-medium text-neutral-800">{row.organization}</span>
                                <span className="text-xs text-gray-400">{row.ownerEmail}</span>
                        </div>
                ),
        },
        {
                key: "plan",
                header: "Plan",
                cell: (row) => <span className="capitalize text-sm text-neutral-800">{row.plan}</span>,
        },
        {
                key: "vehicles",
                header: "Vehicles",
                cell: (row) => <span className="text-sm text-neutral-800">{row.vehicles}</span>,
        },
        {
                key: "status",
                header: "Status",
                cell: (row) => <StatusBadge status={row.status} />,
        },
        {
                key: "monthlyRevenue",
                header: "Total Earnings",
                cell: (row) => (
                        <span className="text-sm text-neutral-800">
                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(row.monthlyRevenue)}
                        </span>
                ),
        },
        {
                key: "joinedDate",
                header: "Joined Date",
                cell: (row) => (
                        <span className="text-sm text-neutral-800">
                                {new Date(row.joinedDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                ),
        },
];

const transactionColumns: ColumnDef<TransactionRow>[] = [
        { key: "reference", header: "Reference" },
        {
                key: "amount",
                header: "Amount",
                cell: (row) => (
                        <span className="text-sm font-medium text-neutral-800">
                                {row.currency} {row.amount.toFixed(2)}
                        </span>
                ),
        },
        {
                key: "createdAt",
                header: "Date",
                cell: (row) => (
                        <span className="text-sm text-gray-500">
                                {new Date(row.createdAt).toLocaleDateString()}
                        </span>
                ),
        },
];

const reportColumns: ColumnDef<ReportRow>[] = [
        { key: "title", header: "Report Title" },
        { key: "type", header: "Type" },
        { key: "region", header: "Region" },
        { key: "period", header: "Period" },
        {
                key: "generatedAt",
                header: "Generated",
                cell: (row) => (
                        <span className="text-sm text-gray-500">
                                {new Date(row.generatedAt).toLocaleDateString()}
                        </span>
                ),
        },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 1 — Subscribers
// Eye   → link to detail page
// Pencil → edit dialog (parent controls form fields)
// Trash  → delete dialog (parent controls warning copy)
// ─────────────────────────────────────────────────────────────────────────────

export function SubscribersTableSection() {
        const [data, setData] = useState<SubscriberRow[]>(MOCK_SUBSCRIBERS);

        const { rows, pagination } = useTableRows({
                tableId: "subscribers",
                data,
                searchFields: ["organization", "ownerEmail", "id"],
                filters: [
                        { paramKey: "status", field: "status" },
                        { paramKey: "plan", field: "plan" },
                ],
                sortField: "joinedDate",   // enables the date sort toggle
                rowsPerPage: 10,
        });

        return (
                <DataTable
                        tableId="subscribers"
                        columns={subscriberColumns}
                        rows={rows}
                        pagination={pagination}
                        toolbar={
                                <TableToolbar
                                        search={{ placeholder: "Search by name, email or ID..." }}
                                        filters={[
                                                {
                                                        title: "All Status",
                                                        paramKey: "status",
                                                        items: [
                                                                { label: "Active", value: "active" },
                                                                { label: "Inactive", value: "inactive" },
                                                                { label: "Trial", value: "trial" },
                                                        ],
                                                },
                                                {
                                                        title: "All Plans",
                                                        paramKey: "plan",
                                                        items: [
                                                                { label: "Starter", value: "starter" },
                                                                { label: "Pro", value: "pro" },
                                                                { label: "Enterprise", value: "enterprise" },
                                                        ],
                                                },
                                        ]}
                                        dateSort
                                        actions={
                                                <button
                                                        onClick={() =>
                                                                exportToCSV(rows, {
                                                                        filename: "subscribers",
                                                                        columns: ["id", "organization", "ownerEmail", "plan", "vehicles", "status", "monthlyRevenue", "joinedDate"],
                                                                })
                                                        }
                                                        className="flex items-center gap-2 px-3 py-2 rounded-xs border border-blue-700 hover:bg-blue-900 group duration-300 transition-colors cursor-pointer"
                                                >
                                                        <span className="text-blue-700 text-sm font-medium font-text group-hover:text-blue-200 transition-colors">
                                                                Export CSV
                                                        </span>
                                                        <Download className="size-4 text-blue-700 group-hover:text-blue-200 transition-colors" />
                                                </button>
                                        }
                                />
                        }

                        // Eye → navigate to subscriber detail page
                        viewAction={{
                                type: "link",
                                href: (row) => `/subscribers/${row.id}`,
                        }}

                        // Pencil → edit dialog; parent supplies the form fields as ReactNode
                        editAction={{
                                confirmLabel: "Save changes",
                                onConfirm: (row) => {
                                        console.log("save subscriber", row.id);
                                        // In a real app: call your API, then refresh data
                                },
                                dialogContent: (row) => (
                                        <div className="space-y-4">
                                                <p className="text-gray-500 text-sm">
                                                        Update the details for <span className="font-semibold text-neutral-800">{row.organization}</span>.
                                                </p>
                                                <div className="space-y-3">
                                                        <div>
                                                                <label className="block text-xs font-medium text-gray-600 mb-1">Organisation name</label>
                                                                <input
                                                                        defaultValue={row.organization}
                                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                                />
                                                        </div>
                                                        <div>
                                                                <label className="block text-xs font-medium text-gray-600 mb-1">Owner email</label>
                                                                <input
                                                                        defaultValue={row.ownerEmail}
                                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                                />
                                                        </div>
                                                        <div>
                                                                <label className="block text-xs font-medium text-gray-600 mb-1">Plan</label>
                                                                <select
                                                                        defaultValue={row.plan}
                                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                                >
                                                                        <option value="starter">Starter</option>
                                                                        <option value="pro">Pro</option>
                                                                        <option value="enterprise">Enterprise</option>
                                                                </select>
                                                        </div>
                                                </div>
                                        </div>
                                ),
                        }}

                        // Trash → delete dialog; parent supplies warning copy
                        deleteAction={{
                                dataType: "Subscriber",
                                onConfirm: (row) => {
                                        setData((prev) => prev.filter((r) => r.id !== row.id));
                                },
                                dialogContent: (row) => (
                                        <div className="space-y-3">
                                                <p>
                                                        You are about to permanently delete{" "}
                                                        <span className="font-semibold text-neutral-800">{row.organization}</span>.
                                                </p>
                                                <p className="text-gray-400 text-xs">
                                                        This will remove all associated vehicles, billing history, and user access.
                                                        This action cannot be undone.
                                                </p>
                                        </div>
                                ),
                        }}
                />
        );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 2 — Transactions
// linkAction → plain "View receipt" text link, no icon
// dateSort   → sort by createdAt
// ─────────────────────────────────────────────────────────────────────────────

export function TransactionsTable() {
        const { rows, pagination } = useTableRows({
                tableId: "transactions",
                data: MOCK_TRANSACTIONS,
                searchFields: ["reference", "currency"],
                sortField: "createdAt",    // enables the date sort toggle
                rowsPerPage: 10,
        });

        return (
                <DataTable
                        tableId="transactions"
                        columns={transactionColumns}
                        rows={rows}
                        pagination={pagination}
                        toolbar={
                                <TableToolbar
                                        search={{ placeholder: "Search by reference..." }}
                                        dateSort   // ← no sortField required on toolbar; it just writes the param
                                />
                        }

                        // Plain text link — no icon
                        linkAction={{
                                label: "View receipt",
                                href: (row) => `/transactions/${row.id}/receipt`,
                        }}
                />
        );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 3 — Reports
// No eye, no edit
// Trash → delete dialog with minimal copy
// ─────────────────────────────────────────────────────────────────────────────

export function ReportsTable() {
        const [data, setData] = useState<ReportRow[]>(MOCK_REPORTS);

        const { rows, pagination } = useTableRows({
                tableId: "reports",
                data,
                searchFields: ["title"],
                filters: [
                        { paramKey: "type", field: "type" },
                        { paramKey: "region", field: "region" },
                        { paramKey: "period", field: "period" },
                ],
                rowsPerPage: 10,
        });

        return (
                <DataTable
                        tableId="reports"
                        columns={reportColumns}
                        rows={rows}
                        pagination={pagination}
                        toolbar={
                                <TableToolbar
                                        search={{ placeholder: "Search reports..." }}
                                        filters={[
                                                {
                                                        title: "All Types",
                                                        paramKey: "type",
                                                        items: [
                                                                { label: "Revenue", value: "revenue" },
                                                                { label: "Usage", value: "usage" },
                                                                { label: "Audit", value: "audit" },
                                                        ],
                                                },
                                                {
                                                        title: "All Regions",
                                                        paramKey: "region",
                                                        items: [
                                                                { label: "North America", value: "na" },
                                                                { label: "Europe", value: "eu" },
                                                                { label: "Africa", value: "af" },
                                                        ],
                                                },
                                                {
                                                        title: "All Periods",
                                                        paramKey: "period",
                                                        items: [
                                                                { label: "Q1", value: "q1" },
                                                                { label: "Q2", value: "q2" },
                                                                { label: "Q3", value: "q3" },
                                                                { label: "Q4", value: "q4" },
                                                        ],
                                                },
                                        ]}
                                />
                        }

                        deleteAction={{
                                dataType: "Report",
                                onConfirm: (row) => {
                                        setData((prev) => prev.filter((r) => r.id !== row.id));
                                },
                                dialogContent: (row) => (
                                        <p>
                                                <span className="font-semibold text-neutral-800">{row.title}</span> will be
                                                permanently deleted and cannot be recovered.
                                        </p>
                                ),
                        }}
                />
        );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function RecentBookingsTable() {
        return (
                <>
                        <SubscribersTableSection />
                        <TransactionsTable />
                        <ReportsTable />
                </>
        );
}