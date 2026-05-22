"use client"

import { useCallback, useState } from "react";
import {
        Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { AdminOverviewRecentActivityItem } from "@/types/admin.type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 8;

type RecentActivityTableProps = {
        rows: AdminOverviewRecentActivityItem[];
        isLoading: boolean;
}

export default function RecentActivityTable({ isLoading, rows }: RecentActivityTableProps) {

        const [page, setPage] = useState(1);

        const total = rows.length;
        const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
        const paginated = rows.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
        const startItem = total === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
        const endItem = Math.min(page * ITEMS_PER_PAGE, total);

        const goToPage = useCallback((p: number) => {
                setPage(p);
        }, []);

        return (
                <div>
                        <Table className="py-2.5 bg-white rounded-lg border border-gray-200">
                                <TableHeader className="bg-gray-100">
                                        <TableRow>
                                                {["Time", "Event Type", "Entity", "Details"].map(h => (
                                                        <TableHead key={h} className="pl-5 text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight">
                                                                {h}
                                                        </TableHead>
                                                ))}
                                        </TableRow>
                                </TableHeader>
                                <TableBody>
                                        {isLoading ? (
                                                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                                                        <TableRow key={i} className="opacity-80">
                                                                <TableCell className="px-5">
                                                                        <Skeleton className="h-4 w-16" />
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <Skeleton className="h-4 w-24" />
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <Skeleton className="h-4 w-28" />
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <Skeleton className="h-4 w-48" />
                                                                </TableCell>
                                                                {/* <TableCell className="px-5">
                                                                        <Skeleton className="h-4 w-16" />
                                                                </TableCell> */}
                                                        </TableRow>
                                                ))
                                        ) : paginated.length === 0 ? (
                                                <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-16 text-gray-400 text-sm">
                                                                No recent activity found.
                                                        </TableCell>
                                                </TableRow>
                                        ) : (
                                                paginated.map((item, index) => (
                                                        <TableRow key={`${item.eventType}-${item.time}-${item.action}-${index}`}>
                                                                <TableCell className="px-5">
                                                                        <span className="text-gray-500 text-sm font-normal font-text leading-5">
                                                                                {item.time}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <span className="text-neutral-950 text-sm font-medium font-text leading-5">
                                                                                {item.eventType}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
                                                                                {item.entity}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <span className="text-gray-500 text-sm font-normal font-text leading-5">
                                                                                {item.details}
                                                                        </span>
                                                                </TableCell>
                                                                {/* <TableCell className="px-5">
                                                                        <span className="text-blue-700 text-sm font-medium font-text leading-5">
                                                                                {item.action}
                                                                        </span>
                                                                </TableCell> */}
                                                        </TableRow>
                                                ))
                                        )}
                                </TableBody>
                        </Table>

                        {/* Pagination */}
                        <div className="flex items-center justify-between p-5 rounded-b-sm bg-white border border-gray-200">
                                <span className="block text-gray-500 text-sm font-normal font-text">
                                        Showing {startItem}–{endItem} of {total} recent activit{total !== 1 ? "ies" : "y"}
                                </span>
                                <div className="flex items-center gap-1">
                                        <button onClick={() => goToPage(page - 1)} disabled={page === 1} className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors duration-150" aria-label="Previous page">
                                                <ChevronLeft className="size-4" />
                                        </button>
                                        <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors duration-150" aria-label="Next page">
                                                <ChevronRight className="size-4" />
                                        </button>
                                </div>
                        </div>
                </div>
        )
}