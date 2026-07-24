import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { ROWS_PER_PAGE } from "./dataTable.config";

export default function TableSkeletonRows() {
        return (
                <>
                        {Array.from({ length: ROWS_PER_PAGE }).map((_, i) => (
                                <TableRow key={i}>
                                        <TableCell>
                                                <Skeleton className="h-4 w-40" />
                                        </TableCell>
                                        <TableCell>
                                                <Skeleton className="h-4 w-28" />
                                        </TableCell>
                                        <TableCell>
                                                <Skeleton className="h-6 w-20 rounded-full" />
                                        </TableCell>
                                        <TableCell>
                                                <Skeleton className="h-4 w-16" />
                                        </TableCell>
                                        <TableCell>
                                                <Skeleton className="h-4 w-24" />
                                        </TableCell>
                                        <TableCell>
                                                <div className="flex gap-5">
                                                        <Skeleton className="size-4" />
                                                        <Skeleton className="size-4" />
                                                </div>
                                        </TableCell>
                                </TableRow>
                        ))}
                </>
        );
}