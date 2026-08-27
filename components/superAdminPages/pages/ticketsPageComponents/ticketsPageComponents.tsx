"use client"

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
        ChevronLeft, ChevronRight, CircleAlert, CircleCheckBig,
        Clock, EllipsisVertical, Search, Ticket, TriangleAlert,
} from "lucide-react";
import PageWrapper from "../../dashboard/pageWrapper";
import ReviewOverviewCard from "../reviewsPageComponents/reviewOverviewCard";
import {
        Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { TableUserCard } from "../settingsPageComponent/adminUsersSettingsPageComponent";
import { SelectUI } from "../subscribersPageComponents";
import {
        adminTicketPriorityItems,
        adminTicketStatusItems,
        AdminTicketStatusItemsType,
        adminTicketTypesItems,
        AdminTicketTypesItemsType,
} from "../../utils/helpers";
import { formatDate } from "../../utils/formatDate";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { AdminTicketStatusPill } from "../../dashboard/statusPill";
import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
} from "@/components/ui/dialog";
import { useGetAdminTicketsQuery, useResolveAdminTicketMutation } from "@/app/store/services/adminApi";
import { AdminTicketPagination, AdminTicketRow, AdminTicketSummary } from "@/types/admin-tickets.type";
import ErrorStateUI from "../../dashboard/errorState";

const ROWS_PER_PAGE = 8

const EMPTY_SUMMARY: AdminTicketSummary = {
        totalTickets: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        damageReports: 0,
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TicketsPageComponents() {
        return (
                <Suspense>
                        <TicketsPageContent />
                </Suspense>
        )
}

const TicketsPageContent = () => {
        const router = useRouter()
        const pathname = usePathname()
        const searchParams = useSearchParams()

        const search = searchParams.get("search") || undefined
        const status = (searchParams.get("status") as AdminTicketStatusItemsType) || undefined
        const issueType = (searchParams.get("type") as AdminTicketTypesItemsType) || undefined
        const page = Math.max(1, Number(searchParams.get("page") ?? 1))

        const { data, isLoading, isError } = useGetAdminTicketsQuery(
                { search, status, issueType, page, limit: ROWS_PER_PAGE },
                { pollingInterval: 30_000 },
        )

        const [resolveTicket] = useResolveAdminTicketMutation()

        const goToPage = useCallback((p: number) => {
                const params = new URLSearchParams(searchParams.toString())
                params.set("page", String(Math.max(1, p)))
                router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }, [router, pathname, searchParams])

        if (isError) {
                return (
                        <PageWrapper
                                pageTitle="Tickets / Complaints"
                                pageDescription="Manage organization, fleet, billing, and activity"
                        >
                                <div className="mt-8">
                                        <ErrorStateUI
                                                title="We couldn't load tickets"
                                                description="Something went wrong while fetching tickets. Please check your connection and try again."
                                        />
                                </div>
                        </PageWrapper>
                )
        }

        const summary = data?.data.summary ?? EMPTY_SUMMARY
        const rows = data?.data.rows ?? []
        const pagination: AdminTicketPagination = data?.data.pagination ?? {
                page,
                limit: ROWS_PER_PAGE,
                total: 0,
                totalPages: 1,
        }

        return (
                <PageWrapper
                        pageTitle="Tickets / Complaints"
                        pageDescription="Manage organization, fleet, billing, and activity"
                >
                        <div>
                                <TicketContent
                                        summary={summary}
                                        rows={rows}
                                        pagination={pagination}
                                        isLoading={isLoading}
                                        goToPage={goToPage}
                                        onResolve={(ticketId) => resolveTicket({ ticketId })}
                                />
                        </div>
                </PageWrapper>
        )
}

// ─── Content ──────────────────────────────────────────────────────────────────

type TicketContentProps = {
        summary: AdminTicketSummary
        rows: AdminTicketRow[]
        pagination: AdminTicketPagination
        isLoading: boolean
        goToPage: (page: number) => void
        onResolve: (ticketId: string) => void
}

const TicketContent = ({ summary, rows, pagination, isLoading, goToPage, onResolve }: TicketContentProps) => {
        return (
                <div className="flex flex-col gap-5 md:gap-8">
                        <div className="flex flex-wrap gap-4 mt-8">
                                <ReviewOverviewCard icon={<Ticket className="size-5 text-blue-700" />} iconBG="bg-indigo-50" label="Total Tickets" number={summary.totalTickets} />
                                <ReviewOverviewCard icon={<CircleAlert className="size-5 text-amber-500" />} iconBG="bg-orange-50" label="Open" number={summary.open} />
                                <ReviewOverviewCard icon={<Clock className="size-5 text-blue-700" />} iconBG="bg-indigo-50" label="In Progress" number={summary.inProgress} />
                                <ReviewOverviewCard icon={<CircleCheckBig className="size-5 text-emerald-500" />} iconBG="bg-green-100" label="Resolved" number={summary.resolved} />
                                <ReviewOverviewCard icon={<TriangleAlert className="size-5 text-red-500" />} iconBG="bg-rose-100" label="Damage Reports" number={summary.damageReports} />
                        </div>
                        <Suspense>
                                <TicketListTable
                                        rows={rows}
                                        pagination={pagination}
                                        isLoading={isLoading}
                                        goToPage={goToPage}
                                        onResolve={onResolve}
                                />
                        </Suspense>
                </div>
        )
}

// ─── Table ────────────────────────────────────────────────────────────────────

type TicketListTableProps = {
        rows: AdminTicketRow[]
        pagination: AdminTicketPagination
        isLoading: boolean
        goToPage: (page: number) => void
        onResolve: (ticketId: string) => void
}

const TicketListTable = ({ rows, pagination, isLoading, goToPage, onResolve }: TicketListTableProps) => {
        const { page, limit, total } = pagination
        const totalPages = Math.max(1, pagination.totalPages)

        const startItem = total === 0 ? 0 : (page - 1) * limit + 1
        const endItem = Math.min(page * limit, total)

        return (
                <div className="space-y-5 md:space-y-8">
                        <Suspense>
                                <SearchFilterSection />
                        </Suspense>
                        <div>
                                <Table className="py-2.5 bg-white rounded-lg border border-gray-200">
                                        <TableHeader className="bg-gray-100">
                                                <TableRow>
                                                        {["Ticket ID", "Submitted By", "Type", "Subject", "Status", "Photos", "Date Created", "Actions"].map(h => (
                                                                <TableHead key={h} className="pl-5 text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight">
                                                                        {h}
                                                                </TableHead>
                                                        ))}
                                                </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                                {isLoading ? (
                                                        <TableRow>
                                                                <TableCell colSpan={8} className="text-center py-16 text-gray-400 text-sm">
                                                                        Loading tickets…
                                                                </TableCell>
                                                        </TableRow>
                                                ) : rows.length === 0 ? (
                                                        <TableRow>
                                                                <TableCell colSpan={8} className="text-center py-16 text-gray-400 text-sm">
                                                                        No tickets match your filters.
                                                                </TableCell>
                                                        </TableRow>
                                                ) : rows.map(item => (
                                                        <TableRow key={item.id}>
                                                                <TableCell className="pl-5">
                                                                        <span className="text-blue-700 text-xs font-medium font-text leading-5">
                                                                                {item.ticketCode}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <TableUserCard name={item.submitterName} email={item.submitterEmail ?? "—"} />
                                                                </TableCell>
                                                                <TableCell className="max-w-26.25 w-full px-5">
                                                                        <span className="text-gray-700 text-xs font-normal font-text leading-5 capitalize">
                                                                                {item.issueType}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <span className="text-neutral-950 text-xs font-normal font-text leading-5">
                                                                                {item.description}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <AdminTicketStatusPill status={item.status} />
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <div className="flex items-center gap-1.5">
                                                                                <span>📎</span>
                                                                                <span className="text-blue-700 text-xs font-medium font-text leading-4">
                                                                                        {item.photoUrls.length} photo{item.photoUrls.length !== 1 ? "s" : ""}
                                                                                </span>
                                                                        </div>
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <span className="text-gray-500 text-sm font-normal font-text leading-5">
                                                                                {formatDate(item.dateSubmitted)}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell className="px-5 justify-center">
                                                                        <TableAction
                                                                                status={item.status}
                                                                                ticketId={item.id}
                                                                                ticketCode={item.ticketCode}
                                                                                handleMarkResolved={() => onResolve(item.id)}
                                                                        />
                                                                </TableCell>
                                                        </TableRow>
                                                ))}
                                        </TableBody>
                                </Table>

                                {/* Pagination */}
                                <div className="flex items-center justify-between p-5 rounded-b-sm bg-white border border-gray-200">
                                        <span className="block text-gray-500 text-sm font-normal font-text">
                                                Showing {startItem}–{endItem} of {total} ticket{total !== 1 ? "s" : ""}
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
                </div>
        )
}

// ─── Search / filter ──────────────────────────────────────────────────────────
const SearchFilterSection = () => {
        const router = useRouter()
        const pathname = usePathname()
        const searchParams = useSearchParams()

        const setParam = useCallback((key: string, value: string) => {
                const params = new URLSearchParams(searchParams.toString())
                if (value) params.set(key, value)
                else params.delete(key)
                if (key !== "page") params.delete("page")
                router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }, [router, pathname, searchParams])

        const search = searchParams.get("search") ?? ""

        return (
                <div className="flex flex-wrap gap-4 items-center p-4 bg-white rounded-[10px] border border-gray-200">
                        <div className="relative flex items-center w-full max-w-5xl">
                                <Search className="absolute left-3 size-4 text-gray-400 pointer-events-none shrink-0" />
                                <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setParam("search", e.target.value)}
                                        placeholder="Search by name, owner or ID..."
                                        className={[
                                                "w-full pl-9 pr-4 py-2 rounded-lg",
                                                "bg-gray-50 border border-gray-300",
                                                "text-xs text-[#0B0B0B]/50 placeholder:text-gray-400 font-text",
                                                "outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                                "transition-all duration-200",
                                        ].join(" ")}
                                />
                        </div>
                        <SelectUI title="All Status" items={adminTicketStatusItems} paramKey="status" />
                        <SelectUI title="All Types" items={adminTicketTypesItems} paramKey="type" />
                        <SelectUI title="All Priority" items={adminTicketPriorityItems} paramKey="priority" />
                </div>
        )
}

// ─── Table action ─────────────────────────────────────────────────────────────

type TableActionProps = {
        status: AdminTicketStatusItemsType
        ticketId: string
        ticketCode: string
        handleMarkResolved: () => void
}

const TableAction = ({ status, ticketId, ticketCode, handleMarkResolved }: TableActionProps) => (
        <Popover>
                <PopoverTrigger asChild>
                        <EllipsisVertical className="size-5 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="max-w-62.5 min-w-37.5 w-full p-0">
                        <div className="flex flex-col justify-start divide-y">
                                <Link href={`/admin/tickets/${ticketId}`} className="w-full">
                                        <button className="p-3.5 text-neutral-950 text-sm font-semibold font-text leading-4 outline-none cursor-pointer w-full text-left">
                                                View Ticket
                                        </button>
                                </Link>

                                {/* Confirmation dialog for Mark as Resolved */}
                                {status !== "resolved" && (
                                        <Dialog>
                                                <DialogTrigger asChild>
                                                        <button className="p-3.5 text-emerald-500 text-sm font-semibold font-text leading-4 cursor-pointer w-full text-left">
                                                                Mark as Resolved
                                                        </button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-sm px-6">
                                                        <DialogHeader>
                                                                <DialogTitle className="text-neutral-950 text-lg font-semibold font-text">
                                                                        Confirm Resolution
                                                                </DialogTitle>
                                                                <DialogDescription className="text-gray-500 text-sm font-normal font-text">
                                                                        Are you sure you want to mark ticket <span className="font-semibold text-neutral-950">{ticketCode}</span> as resolved? This action cannot be undone.
                                                                </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter className="mt-4">
                                                                <DialogClose asChild>
                                                                        <button className="px-5 py-2.5 text-gray-700 text-sm font-medium font-text bg-white rounded-xs border border-gray-300 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                                                                                Cancel
                                                                        </button>
                                                                </DialogClose>
                                                                <DialogClose asChild>
                                                                        <button
                                                                                onClick={handleMarkResolved}
                                                                                className="px-5 py-2.5 text-white text-sm font-medium font-text bg-emerald-500 rounded-xs hover:bg-emerald-700 transition-colors duration-200 cursor-pointer"
                                                                        >
                                                                                Yes, Mark Resolved
                                                                        </button>
                                                                </DialogClose>
                                                        </DialogFooter>
                                                </DialogContent>
                                        </Dialog>
                                )}
                        </div>
                </PopoverContent>
        </Popover>
)
