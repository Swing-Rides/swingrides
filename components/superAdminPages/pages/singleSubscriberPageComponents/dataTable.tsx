"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from "@/components/ui/table";
import { formatNumberToUSD } from "../../utils/formatNumbertoUSD";
import { DataTableVariant, SlugType } from "./subscriberDetail.types";
import { COLUMN_CONFIG, ROWS_PER_PAGE, normalise } from "./dataTable.config";
import StatusBadge from "./statusBadge";
import TableSkeletonRows from "./tableSkeletonRows";
import TableUIActionTab from "./tableUIActionTab";
import DeleteDialogUI from "./deleteDialogUI";

export default function DataTable(props: DataTableVariant & SlugType) {
        const { dataType, slug } = props;
        const config = COLUMN_CONFIG[dataType];

        const router = useRouter();
        const pathname = usePathname();
        const searchParams = useSearchParams();

        // ── URL param helper ──────────────────────────────────────────────────
        // Each tab uses its own page param key to avoid collisions
        const pageKey = `${dataType.replace(" ", "_").toLowerCase()}_page`;

        const setParam = useCallback(
                (key: string, value: string) => {
                        const params = new URLSearchParams(searchParams.toString());
                        if (value) params.set(key, value);
                        else params.delete(key);
                        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                },
                [router, pathname, searchParams],
        );

        // ── Delete dialog ─────────────────────────────────────────────────────
        const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

        const confirmDelete = useCallback(() => {
                if (!pendingDeleteId) return;
                // Type-safe delete for each variant
                if (props.dataType === "Vehicle") {
                        props.setRows((prev) => prev.filter((r) => r.id !== pendingDeleteId));
                } else if (props.dataType === "Booking") {
                        props.setRows((prev) => prev.filter((r) => r.id !== pendingDeleteId));
                } else {
                        props.setRows((prev) => prev.filter((r) => r.id !== pendingDeleteId));
                }
                setPendingDeleteId(null);
        }, [pendingDeleteId, props]);

        // ── Normalise + paginate ──────────────────────────────────────────────
        const displayRows = useMemo(() => normalise(props), [props]);

        const page = Math.max(1, Number(searchParams.get(pageKey) ?? 1));
        const totalPages = Math.max(1, Math.ceil(displayRows.length / ROWS_PER_PAGE));
        const paginated = useMemo(
                () => displayRows.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
                [displayRows, page],
        );

        const pendingRow = displayRows.find((r) => r.id === pendingDeleteId);
        const goToPage = (p: number) => setParam(pageKey, String(p));
        const paginationLabel =
                displayRows.length === 0
                        ? "0 results"
                        : `${(page - 1) * ROWS_PER_PAGE + 1}–${Math.min(page * ROWS_PER_PAGE, displayRows.length)} of ${displayRows.length}`;

        return (
                <>
                        <div className="rounded-lg border border-gray-200 overflow-hidden mt-4">
                                <Table>
                                        <TableHeader>
                                                <TableRow>
                                                        <TableHead className="w-50 md:w-80">{config.nameTitle}</TableHead>
                                                        <TableHead>{config.idTitle}</TableHead>
                                                        <TableHead>{config.statusTitle}</TableHead>
                                                        <TableHead>{config.costTitle}</TableHead>
                                                        <TableHead>{config.dateTitle}</TableHead>
                                                        <TableHead className="w-25">Actions</TableHead>
                                                </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                                <Suspense fallback={<TableSkeletonRows />}>
                                                        {paginated.length === 0 ? (
                                                                <TableRow>
                                                                        <TableCell
                                                                                colSpan={6}
                                                                                className="text-center py-16 text-gray-400 text-sm"
                                                                        >
                                                                                {config.emptyMsg}
                                                                        </TableCell>
                                                                </TableRow>
                                                        ) : (
                                                                paginated.map((item) => (
                                                                        <TableRow key={item.id}>
                                                                                <TableCell className="py-4">
                                                                                        <span className="text-neutral-950 text-sm font-medium font-text leading-5">
                                                                                                {item.name}
                                                                                        </span>
                                                                                </TableCell>
                                                                                <TableCell className="py-4">
                                                                                        <span className="text-gray-500 text-xs font-normal font-text leading-5">
                                                                                                {item.id}
                                                                                        </span>
                                                                                </TableCell>
                                                                                <TableCell className="py-4">
                                                                                        <StatusBadge dataType={dataType} status={item.status} />
                                                                                </TableCell>
                                                                                <TableCell className="py-4">
                                                                                        <span className="text-neutral-950 text-sm font-medium font-text leading-5">
                                                                                                {formatNumberToUSD(item.cost)}
                                                                                        </span>
                                                                                </TableCell>
                                                                                <TableCell className="py-4">
                                                                                        <span className="text-gray-500 text-sm font-normal font-text leading-5">
                                                                                                {item.date}
                                                                                        </span>
                                                                                </TableCell>
                                                                                <TableCell className="py-4">
                                                                                        <TableUIActionTab
                                                                                                slug={slug}
                                                                                                itemId={item.id}
                                                                                                dataType={dataType}
                                                                                                onDelete={() => setPendingDeleteId(item.id)}
                                                                                                onDownload={() =>
                                                                                                        console.log("Downloading billing history")
                                                                                                }
                                                                                        />
                                                                                </TableCell>
                                                                        </TableRow>
                                                                ))
                                                        )}
                                                </Suspense>
                                        </TableBody>
                                </Table>

                                {/* Pagination — outside <Table> so flex layout is respected */}
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                                        <div className="flex items-center gap-2">
                                                <span className="text-gray-500 text-sm font-normal font-text">
                                                        Rows per page:
                                                </span>
                                                <span className="px-2.5 py-1 rounded-lg border border-gray-200 text-sm text-neutral-800">
                                                        {ROWS_PER_PAGE}
                                                </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-500">{paginationLabel}</span>
                                                <button
                                                        onClick={() => goToPage(page - 1)}
                                                        disabled={page <= 1}
                                                        className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                >
                                                        <ChevronLeft className="size-4 text-gray-600" />
                                                </button>
                                                <button
                                                        onClick={() => goToPage(page + 1)}
                                                        disabled={page >= totalPages}
                                                        className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                >
                                                        <ChevronRight className="size-4 text-gray-600" />
                                                </button>
                                        </div>
                                </div>
                        </div>

                        <DeleteDialogUI
                                open={!!pendingDeleteId}
                                onOpenChange={(open) => {
                                        if (!open) setPendingDeleteId(null);
                                }}
                                name={pendingRow?.name}
                                dataType={dataType}
                                onConfirm={confirmDelete}
                        />
                </>
        );
}