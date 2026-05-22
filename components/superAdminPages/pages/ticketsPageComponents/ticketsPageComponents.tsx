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

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminTicketRow = {
        id: string
        ticketId: string
        submitterName: string
        submitterEmail: string
        type: AdminTicketTypesItemsType
        subject: string
        status: AdminTicketStatusItemsType
        photos: string[]
        date: string
}

type TicketSummary = {
        totalTickets: number
        open: number
        inProgress: number
        resolved: number
        damageReports: number
}

type TicketPagination = {
        page: number
        limit: number
        total: number
        totalPages: number
}

// ─── Sample data ──────────────────────────────────────────────────────────────
const SAMPLE_SUMMARY: TicketSummary = {
        totalTickets: 124,
        open: 38,
        inProgress: 21,
        resolved: 57,
        damageReports: 8,
}

const SAMPLE_ROWS: AdminTicketRow[] = [
        { id: "1", ticketId: "TKT-0001", submitterName: "Alice Johnson", submitterEmail: "alice@example.com", type: "billing query", subject: "Overcharged for last booking", status: "open", photos: ["photo1.jpg", "photo2.jpg"], date: "2025-01-10T09:00:00Z" },
        { id: "2", ticketId: "TKT-0002", submitterName: "Bob Smith", submitterEmail: "bob@example.com", type: "damage report", subject: "Scratch on rear bumper", status: "in progress", photos: ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"], date: "2025-01-14T11:30:00Z" },
        { id: "3", ticketId: "TKT-0003", submitterName: "Carol White", submitterEmail: "carol@example.com", type: "dispute", subject: "Host was unresponsive during pickup", status: "resolved", photos: [], date: "2025-01-18T08:15:00Z" },
        { id: "4", ticketId: "TKT-0004", submitterName: "David Lee", submitterEmail: "david@example.com", type: "technical issue", subject: "App crashed during booking confirmation", status: "open", photos: ["photo1.jpg", "photo2.jpg", "photo3.jpg"], date: "2025-02-01T14:00:00Z" },
        { id: "5", ticketId: "TKT-0005", submitterName: "Eva Brown", submitterEmail: "eva@example.com", type: "damage report", subject: "Windshield crack not listed in photos", status: "in progress", photos: ["photo1.jpg"], date: "2025-02-05T10:45:00Z" },
]

const SAMPLE_PAGINATION: TicketPagination = {
        page: 1,
        limit: 8,
        total: SAMPLE_ROWS.length,
        totalPages: 1,
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TicketsPageComponents() {
        return (
                <PageWrapper
                        pageTitle="Tickets / Complaints"
                        pageDescription="Manage organization, fleet, billing, and activity"
                >
                        <div>
                                <TicketContent
                                        summary={SAMPLE_SUMMARY}
                                        rows={SAMPLE_ROWS}
                                        pagination={SAMPLE_PAGINATION}
                                        isLoading={false}
                                        goToPage={(p) => console.log("go to page", p)}
                                />
                        </div>
                </PageWrapper>
        )
}

// ─── Content ──────────────────────────────────────────────────────────────────

type TicketContentProps = {
        summary: TicketSummary
        rows: AdminTicketRow[]
        pagination: TicketPagination
        isLoading: boolean
        goToPage: (page: number) => void
}

const TicketContent = ({ summary, rows, pagination, isLoading, goToPage }: TicketContentProps) => {
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
                                />
                        </Suspense>
                </div>
        )
}

// ─── Table ────────────────────────────────────────────────────────────────────

type TicketListTableProps = {
        rows: AdminTicketRow[]
        pagination: TicketPagination
        isLoading: boolean
        goToPage: (page: number) => void
}

const TicketListTable = ({ rows, pagination, isLoading, goToPage }: TicketListTableProps) => {
        const searchParams = useSearchParams()

        const search = searchParams.get("search")?.toLowerCase() ?? ""
        const statusFilter = searchParams.get("status") ?? ""
        const typeFilter = searchParams.get("type") ?? ""
        // const priorityFilter = searchParams.get("priority") ?? ""

        // Apply filters locally against the passed-in rows
        const filtered = rows.filter(row => {
                const matchSearch = !search ||
                        row.submitterName.toLowerCase().includes(search) ||
                        row.submitterEmail.toLowerCase().includes(search) ||
                        row.ticketId.toLowerCase().includes(search)

                const matchStatus = !statusFilter || row.status === statusFilter
                const matchType = !typeFilter || row.type.toLowerCase() === typeFilter.toLowerCase()

                return matchSearch && matchStatus && matchType
        })

        const total = filtered.length
        const totalPages = Math.ceil(total / pagination.limit)
        const page = pagination.page
        const paginated = filtered.slice((page - 1) * pagination.limit, page * pagination.limit)

        const startItem = total === 0 ? 0 : (page - 1) * pagination.limit + 1
        const endItem = Math.min(page * pagination.limit, total)

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
                                                ) : paginated.length === 0 ? (
                                                        <TableRow>
                                                                <TableCell colSpan={8} className="text-center py-16 text-gray-400 text-sm">
                                                                        No tickets match your filters.
                                                                </TableCell>
                                                        </TableRow>
                                                ) : paginated.map(item => (
                                                        <TableRow key={item.id}>
                                                                <TableCell className="pl-5">
                                                                        <span className="text-blue-700 text-xs font-medium font-text leading-5">
                                                                                {item.ticketId}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <TableUserCard name={item.submitterName} email={item.submitterEmail ?? "—"} />
                                                                </TableCell>
                                                                <TableCell className="max-w-26.25 w-full px-5">
                                                                        <span className="text-gray-700 text-xs font-normal font-text leading-5 capitalize">
                                                                                {item.type}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <span className="text-neutral-950 text-xs font-normal font-text leading-5">
                                                                                {item.subject}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <AdminTicketStatusPill status={item.status} />
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <div className="flex items-center gap-1.5">
                                                                                <span>📎</span>
                                                                                <span className="text-blue-700 text-xs font-medium font-text leading-4">
                                                                                        {item.photos.length} photo{item.photos.length !== 1 ? "s" : ""}
                                                                                </span>
                                                                        </div>
                                                                </TableCell>
                                                                <TableCell className="px-5">
                                                                        <span className="text-gray-500 text-sm font-normal font-text leading-5">
                                                                                {formatDate(item.date)}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell className="px-5 justify-center">
                                                                        <TableAction
                                                                                status={item.status}
                                                                                ticketId={item.ticketId}
                                                                                handleMarkResolved={() => console.log("Resolved", item.ticketId)}
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
                if (key !== "ticket-table-page") params.delete("ticket-table-page")
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
        handleMarkResolved: () => void
}

const TableAction = ({ status, ticketId, handleMarkResolved }: TableActionProps) => (
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
                                                                        Are you sure you want to mark ticket <span className="font-semibold text-neutral-950">{ticketId}</span> as resolved? This action cannot be undone.
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