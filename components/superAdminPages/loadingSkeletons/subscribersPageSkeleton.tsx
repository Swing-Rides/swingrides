import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import PageWrapper from "../dashboard/pageWrapper"


const ROWS_PER_PAGE = 10

export const SubscribersPageSkeleton = () => {
        return (
                <PageWrapper
                        pageTitle="Subscribers"
                        pageDescription="Manage all host organisations on the platform"
                >
                        <div>
                                {/* Overview cards */}
                                <div className="flex flex-wrap gap-4 mt-8">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                                <div key={i} className="p-6 bg-white rounded-md border border-gray-200 flex flex-col gap-2 flex-1 basis-47.5 grow shrink-0">
                                                        <Skeleton className="h-3 w-28 rounded-md bg-gray-300" />
                                                        <Skeleton className="h-8 w-16 rounded-md bg-gray-300" />
                                                </div>
                                        ))}
                                </div>

                                {/* Toolbar */}
                                <div className="p-4 my-4 md:mt-6 md:mb-8 bg-white rounded-[10px] border border-gray-200">
                                        <div className="flex flex-wrap gap-4 items-center">
                                                <Skeleton className="h-9 w-full max-w-5xl rounded-lg bg-gray-300" />
                                                <Skeleton className="h-9 w-32 rounded-md bg-gray-300" />
                                                <Skeleton className="h-9 w-32 rounded-md bg-gray-300" />
                                                <Skeleton className="h-9 w-28 rounded-[10px] bg-gray-300" />
                                        </div>
                                </div>

                                {/* Table */}
                                <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
                                        <Table>
                                                <TableHeader>
                                                        <TableRow>
                                                                {["Organisation", "Plan", "Vehicles", "Status", "Total Earnings", "Joined Date", "Actions"].map(h => (
                                                                        <TableHead key={h}>
                                                                                <Skeleton className="h-3 w-20 bg-gray-300 rounded-md" />
                                                                        </TableHead>
                                                                ))}
                                                        </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                        {Array.from({ length: ROWS_PER_PAGE }).map((_, i) => (
                                                                <TableRow key={i}>
                                                                        {/* Organisation */}
                                                                        <TableCell>
                                                                                <div className="flex gap-3 items-center">
                                                                                        <Skeleton className="size-10 rounded shrink-0 bg-gray-300" />
                                                                                        <div className="flex flex-col gap-1.5">
                                                                                                <Skeleton className="h-3.5 w-32 rounded bg-gray-300" />
                                                                                                <Skeleton className="h-3 w-24 rounded bg-gray-300" />
                                                                                        </div>
                                                                                </div>
                                                                        </TableCell>
                                                                        {/* Plan */}
                                                                        <TableCell>
                                                                                <Skeleton className="h-3.5 w-20 rounded bg-gray-300" />
                                                                        </TableCell>
                                                                        {/* Vehicles */}
                                                                        <TableCell>
                                                                                <Skeleton className="h-3.5 w-10 rounded bg-gray-300" />
                                                                        </TableCell>
                                                                        {/* Status */}
                                                                        <TableCell>
                                                                                <Skeleton className="h-6 w-20 rounded-full bg-gray-300" />
                                                                        </TableCell>
                                                                        {/* Total Earnings */}
                                                                        <TableCell>
                                                                                <Skeleton className="h-3.5 w-16 rounded bg-gray-300" />
                                                                        </TableCell>
                                                                        {/* Joined Date */}
                                                                        <TableCell>
                                                                                <Skeleton className="h-3.5 w-28 rounded bg-gray-300" />
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
                </PageWrapper>
        )
}