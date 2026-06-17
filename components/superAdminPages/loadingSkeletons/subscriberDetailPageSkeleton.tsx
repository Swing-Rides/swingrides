import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const ROWS_PER_PAGE = 10

export const SubscriberDetailPageSkeleton = () => {
        return (
                <div className="p-3 md:p-8">

                        {/* Breadcrumb */}
                        <div className="flex gap-2 items-center mb-3 md:mb-8">
                                <Skeleton className="h-3.5 w-28 rounded bg-gray-300" />
                                <Skeleton className="size-4 rounded bg-gray-300" />
                                <Skeleton className="h-3.5 w-32 rounded bg-gray-300" />
                        </div>

                        {/* Header */}
                        <div className="w-full flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                                {/* Page intro */}
                                <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                                <Skeleton className="h-7 w-48 rounded bg-gray-300" />
                                                <Skeleton className="h-5 w-16 rounded-full bg-gray-300" />
                                        </div>
                                        <Skeleton className="h-3.5 w-64 rounded bg-gray-300" />
                                </div>
                                {/* Action buttons */}
                                <div className="flex gap-3">
                                        <Skeleton className="h-11 w-36 rounded-xs bg-gray-300" />
                                        <Skeleton className="h-11 w-32 rounded-xs bg-gray-300" />
                                </div>
                        </div>

                        {/* Overview cards */}
                        <div className="flex flex-wrap gap-4 my-3 md:mt-10.5 md:mb-10">
                                {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="basis-62.5 shrink-0 grow p-6 bg-white rounded-md border border-gray-200 flex flex-col gap-2">
                                                <Skeleton className="size-12 rounded-lg bg-gray-300" />
                                                <Skeleton className="h-3 w-28 rounded bg-gray-300" />
                                                <Skeleton className="h-8 w-24 rounded bg-gray-300" />
                                        </div>
                                ))}
                        </div>

                        {/* Revenue chart */}
                        <div className="p-3 md:p-6 bg-white rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                        <div className="flex flex-col gap-1.5">
                                                <Skeleton className="h-5 w-32 rounded bg-gray-300" />
                                                <Skeleton className="h-3.5 w-48 rounded bg-gray-300" />
                                        </div>
                                        <div className="flex gap-2">
                                                {Array.from({ length: 3 }).map((_, i) => (
                                                        <Skeleton key={i} className="h-7 w-16 rounded-lg bg-gray-300" />
                                                ))}
                                        </div>
                                </div>
                                <Skeleton className="w-full h-87.5 rounded-lg bg-gray-300" />
                        </div>

                        {/* Tabs */}
                        <div className="p-3 md:p-6 my-4 bg-white rounded-lg border border-gray-200">
                                {/* Tab triggers */}
                                <div className="flex gap-6 border-b border-gray-200 mb-4">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                                <Skeleton key={i} className="h-8 w-24 rounded bg-gray-300" />
                                        ))}
                                </div>

                                {/* Table */}
                                <div className="rounded-lg border border-gray-200 overflow-hidden mt-4">
                                        <Table>
                                                <TableHeader>
                                                        <TableRow>
                                                                {Array.from({ length: 6 }).map((_, i) => (
                                                                        <TableHead key={i}>
                                                                                <Skeleton className="h-3 w-20 rounded bg-gray-300" />
                                                                        </TableHead>
                                                                ))}
                                                        </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                        {Array.from({ length: ROWS_PER_PAGE }).map((_, i) => (
                                                                <TableRow key={i}>
                                                                        {/* Name */}
                                                                        <TableCell>
                                                                                <Skeleton className="h-4 w-40 rounded bg-gray-300" />
                                                                        </TableCell>
                                                                        {/* ID */}
                                                                        <TableCell>
                                                                                <Skeleton className="h-4 w-28 rounded bg-gray-300" />
                                                                        </TableCell>
                                                                        {/* Status */}
                                                                        <TableCell>
                                                                                <Skeleton className="h-6 w-20 rounded-full bg-gray-300" />
                                                                        </TableCell>
                                                                        {/* Cost */}
                                                                        <TableCell>
                                                                                <Skeleton className="h-4 w-16 rounded bg-gray-300" />
                                                                        </TableCell>
                                                                        {/* Date */}
                                                                        <TableCell>
                                                                                <Skeleton className="h-4 w-24 rounded bg-gray-300" />
                                                                        </TableCell>
                                                                        {/* Actions */}
                                                                        <TableCell>
                                                                                <div className="flex gap-5">
                                                                                        <Skeleton className="size-4 rounded bg-gray-300" />
                                                                                        <Skeleton className="size-4 rounded bg-gray-300" />
                                                                                </div>
                                                                        </TableCell>
                                                                </TableRow>
                                                        ))}
                                                </TableBody>
                                        </Table>

                                        {/* Pagination */}
                                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                                                <div className="flex items-center gap-2">
                                                        <Skeleton className="h-3.5 w-24 rounded bg-gray-300" />
                                                        <Skeleton className="h-7 w-10 rounded-lg bg-gray-300" />
                                                </div>
                                                <div className="flex items-center gap-3">
                                                        <Skeleton className="h-3.5 w-24 rounded bg-gray-300" />
                                                        <Skeleton className="size-6 rounded-md bg-gray-300" />
                                                        <Skeleton className="size-6 rounded-md bg-gray-300" />
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        )
}