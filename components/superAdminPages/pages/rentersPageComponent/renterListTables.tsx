"use client"

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SelectUI, TableSkeletonRows } from '../subscribersPageComponents'
import { Check, ChevronLeft, ChevronRight, CircleAlert, Download, Eye, Search, Trash, X } from 'lucide-react'
import { exportRentersToCSV } from '../../utils/exportToCSV'
import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from "@/components/ui/table"
import {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getInitials } from '@/components/pages/profilePages/utils'
import { formatNumberToUSD } from '../../utils/formatNumbertoUSD'
import { RenterStatusPill } from '../../dashboard/statusPill'
import { renterStatusItems } from '../../utils/helpers'
import Image from 'next/image'
import { AdminRenterData, AdminRenterDataRow, AdminRenterDataStatus, AdminVerificationPendingRenterData, AdminVerificationPendingRenterRow } from '@/types/renters.type'
import { formatDate } from '../../utils/formatDate'
import { approveRenterAction, rejectRenterAction } from '@/app/actions/renters.actions'


// ─── Constants ────────────────────────────────────────────────────────────────

const ROWS_PER_PAGE = 10
const FAKE_LOAD_MS = 1500

type RentersListTableProps = {
        data: AdminRenterData
        pendingVerificationData: AdminVerificationPendingRenterData
}

export const RentersListTable = ({ data, pendingVerificationData }: RentersListTableProps ) => {
        return (
                <>
                        <Suspense>
                                <TableSection rowData={data.rows} />
                        </Suspense>

                        <div className='my-3 md:my-8 space-y-5'>
                                <h3 className="text-neutral-950 text-2xl font-semibold font-text">
                                        Verification Queue ({data.summary.newlyPendingThisMonth})
                                </h3>
                                <div className="p-4 bg-amber-50 rounded border border-amber-100 flex justify-start items-center gap-3">
                                        <CircleAlert className="size-5 text-amber-500" />
                                        <span className='text-amber-800 text-sm font-normal font-text leading-5'>
                                                These renters have uploaded documents awaiting your review. High priority verification ensures a seamless rental experience.
                                        </span>
                                </div>
                        </div>

                        <Suspense>
                                <VerificationTableSection rowData={pendingVerificationData.queue} />
                        </Suspense>
                </>
        )
}

const TableSection = ({ rowData }: { rowData: AdminRenterDataRow[] }) => {

        const [rows, setRows] = useState<AdminRenterDataRow[]>(rowData)

        const router = useRouter()
        const pathname = usePathname()
        const searchParams = useSearchParams()

        // ── Fake loading — swap for real isLoading from your data fetch ───────
        const [isLoading, setIsLoading] = useState(true)

        useEffect(() => {
                const timer = setTimeout(() => setIsLoading(false), FAKE_LOAD_MS)
                return () => clearTimeout(timer)   // cleanup on unmount
        }, [])

        // ── URL param helper ──────────────────────────────────────────────────
        const setParam = useCallback(
                (key: string, value: string) => {
                        const params = new URLSearchParams(searchParams.toString())
                        if (value) params.set(key, value)
                        else params.delete(key)
                        // reset page on filter change, but not when navigating pages
                        if (key !== 'page') params.delete('page')
                        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
                },
                [router, pathname, searchParams]
        )

        // ── Local search state (instant, no URL change) ───────────────────────
        const [search, setSearch] = useState('')

        // ── Delete dialog state ───────────────────────────────────────────────
        const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
        const pendingRow = rows.find((r) => r.id === pendingDeleteId)

        const confirmDelete = () => {
                if (!pendingDeleteId) return
                setRows((prev) => prev.filter((r) => r.id !== pendingDeleteId))
                setPendingDeleteId(null)
        }

        // ── Filters from URL ──────────────────────────────────────────────────
        const statusFilter = (searchParams.get('status') ?? '') as AdminRenterDataStatus | ''
        // const planFilter = (searchParams.get('plan') ?? '') as RenterPlan | ''
        const page = Math.max(1, Number(searchParams.get('page') ?? 1))

        const filtered = useMemo(() => rows.filter((r) => {
                const matchesStatus = statusFilter ? r.status === statusFilter : true
                const q = search.trim().toLowerCase()
                const matchesSearch = q
                        ? r.name.toLowerCase().includes(q) ||
                        r.email.toLowerCase().includes(q) ||
                        r.id.toLowerCase().includes(q)
                        : true
                return matchesStatus && matchesSearch
        }), [rows, statusFilter, search])

        // ── Pagination ────────────────────────────────────────────────────────
        const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
        const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)
        const goToPage = (p: number) => setParam('page', String(p))

        const paginationLabel = filtered.length === 0
                ? '0 results'
                : `${(page - 1) * ROWS_PER_PAGE + 1}-${Math.min(page * ROWS_PER_PAGE, filtered.length)} of ${filtered.length}`

        return (
                <>
                        {/* Toolbar */}
                        <div className="p-4 my-4 md:mt-6 md:mb-8 bg-white rounded-[10px] border border-gray-200">
                                <div className='flex flex-wrap gap-4 items-center'>

                                        {/* Search */}
                                        <div className="relative flex items-center w-full max-w-5xl">
                                                <Search className="absolute left-3 size-4 text-gray-400 pointer-events-none shrink-0" />
                                                <input
                                                        type="text"
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        placeholder="Search by name, email or ID..."
                                                        className={[
                                                                "w-full pl-9 pr-4 py-2 rounded-lg",
                                                                "bg-gray-50 border border-gray-300",
                                                                "text-xs text-[#0B0B0B]/50 placeholder:text-gray-400 font-text",
                                                                "outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                                                "transition-all duration-200",
                                                        ].join(" ")}
                                                />
                                        </div>

                                        <SelectUI title='All Status' items={renterStatusItems} paramKey='status' />

                                        <button
                                                onClick={() => exportRentersToCSV(filtered)}
                                                className='flex flex-nowrap text-nowrap gap-3.5 items-center px-3 py-2 rounded-[10px] border border-blue-700 cursor-pointer hover:bg-blue-900 duration-300 transition-colors group'
                                        >
                                                <span className="text-blue-700 text-sm font-medium font-text leading-5 group-hover:text-blue-200 duration-300 transition-colors">
                                                        Export CSV
                                                </span>
                                                <Download className='size-4 text-blue-700 group-hover:text-blue-200 duration-300 transition-colors' />
                                        </button>
                                </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
                                <Table>
                                        <TableHeader>
                                                <TableRow>
                                                        <TableHead className="w-56">Renters</TableHead>
                                                        <TableHead>Phone</TableHead>
                                                        <TableHead>Total Bookings</TableHead>
                                                        <TableHead>Total Spent</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Joined date</TableHead>
                                                        <TableHead className="w-25">Actions</TableHead>
                                                </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                                {isLoading ? (
                                                        <TableSkeletonRows />
                                                ) : paginated.length === 0 ? (
                                                        <TableRow>
                                                                <TableCell colSpan={7} className="text-center py-16 text-gray-400 text-sm">
                                                                        No renter match your filters.
                                                                </TableCell>
                                                        </TableRow>
                                                ) : paginated.map((item) => (
                                                        <TableRow key={item.id}>
                                                                <TableCell>
                                                                        <TableUIUser
                                                                                fullName={item.name}
                                                                                email={item.email}
                                                                        />
                                                                </TableCell>
                                                                <TableCell>
                                                                        <span className="capitalize text-sm text-neutral-800">
                                                                                {item.phone}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell>
                                                                        <span className="text-sm text-neutral-800">{item.totalBookings}</span>
                                                                </TableCell>
                                                                <TableCell>
                                                                        <span className="text-sm text-neutral-800">
                                                                                {formatNumberToUSD(item.totalSpent)}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell>
                                                                        <RenterStatusPill status={item.status} />
                                                                </TableCell>
                                                                <TableCell>
                                                                        <span className="text-sm text-neutral-800">
                                                                                {formatDate(item.joinedDate)}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell>
                                                                        <TableUIActionTab
                                                                                id={item.id}
                                                                                onDelete={() => setPendingDeleteId(item.id)}
                                                                        />
                                                                </TableCell>
                                                        </TableRow>
                                                ))}
                                        </TableBody>
                                </Table>

                                {/* Pagination — outside <Table> so flex layout is respected */}
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                                        <div className="flex items-center gap-2">
                                                <span className="text-gray-500 text-sm font-normal font-text">
                                                        Rows per page:
                                                </span>
                                                <span className='px-2.5 py-1 rounded-lg border border-gray-200 text-sm text-neutral-800'>
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

                        {/* Delete confirmation dialog */}
                        <DeleteDialogUI
                                pendingDeleteId={pendingDeleteId}
                                setPendingDeleteId={setPendingDeleteId}
                                pendingRow={pendingRow}
                                confirmDelete={confirmDelete}
                        />
                </>
        )
}

const VerificationTableSection = ({ rowData }: { rowData: AdminVerificationPendingRenterRow[] }) => {

        const [rows, setRows] = useState<AdminVerificationPendingRenterRow[]>(
                rowData.filter((r) => r.status.toLowerCase() === "pending")
        )

        const router = useRouter()
        const pathname = usePathname()
        const searchParams = useSearchParams()

        // ── URL param helper ──────────────────────────────────────────────────
        const setParam = useCallback(
                (key: string, value: string) => {
                        const params = new URLSearchParams(searchParams.toString())
                        if (value) params.set(key, value)
                        else params.delete(key)
                        // reset page on filter change, but not when navigating pages
                        if (key !== 'verification-page') params.delete('verification-page')
                        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
                },
                [router, pathname, searchParams]
        )


        // ── Approval dialog state ───────────────────────────────────────────────
        const [pendingApproveId, setPendingApproveId] = useState<string | null>(null)
        const [pendingRejectId, setPendingRejectId] = useState<string | null>(null)

        const pendingApproveRow = rows.find((r) => r.id === pendingApproveId)
        const pendingRejectRow = rows.find((r) => r.id === pendingRejectId)

        const confirmApprove = async () => {
                if (!pendingApproveId) return
                try {
                        await approveRenterAction(pendingApproveId)
                        // Remove from queue on success
                        setRows((prev) => prev.filter((r) => r.id !== pendingApproveId))
                } catch (error) {
                        console.error('Approve failed:', error)
                } finally {
                        setPendingApproveId(null)
                }
        }

        const confirmReject = async () => {
                if (!pendingRejectId) return
                try {
                        await rejectRenterAction(pendingRejectId)
                        // Remove from queue on success
                        setRows((prev) => prev.filter((r) => r.id !== pendingRejectId))
                } catch (error) {
                        console.error('Reject failed:', error)
                } finally {
                        setPendingRejectId(null)
                }
        }


        const page = Math.max(1, Number(searchParams.get('verification-page') ?? 1))

        // ── Pagination ────────────────────────────────────────────────────────
        const totalPages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE))
        const paginated = rows.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)
        const goToPage = (p: number) => setParam('verification-page', String(p))

        const paginationLabel = rows.length === 0
                ? '0 results'
                : `${(page - 1) * ROWS_PER_PAGE + 1}-${Math.min(page * ROWS_PER_PAGE, rows.length)} of ${rows.length}`

        return (
                <>
                        <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
                                <Table>
                                        <TableHeader>
                                                <TableRow>
                                                        <TableHead className="w-56">Renters</TableHead>
                                                        <TableHead>Phone</TableHead>
                                                        <TableHead>Document Type</TableHead>
                                                        <TableHead>Submitted</TableHead>
                                                        <TableHead>Preview</TableHead>
                                                        <TableHead className="w-25">Actions</TableHead>
                                                </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                                <Suspense fallback={<TableSkeletonRows />}>
                                                        {paginated.length === 0 ? (
                                                                <TableRow>
                                                                        <TableCell colSpan={7} className="text-center py-16 text-gray-400 text-sm">
                                                                                No renter match your filters.
                                                                        </TableCell>
                                                                </TableRow>
                                                        ) : paginated.map((item) => (
                                                                <TableRow key={item.id}>
                                                                        <TableCell>
                                                                                <TableUIUser
                                                                                        fullName={item.name}
                                                                                        email={item.email}
                                                                                />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                                <span className="capitalize text-sm text-neutral-800">
                                                                                        {item.phone}
                                                                                </span>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                                <span className="text-sm text-neutral-800">
                                                                                        {item.documentType}
                                                                                </span>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                                <span className="text-sm text-neutral-800">
                                                                                        {item.submittedAt}
                                                                                </span>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                                <DocumentPreviewImage
                                                                                        imageSrc={item.documentUrl}
                                                                                        fullname={item.name}
                                                                                />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                                <VerificationTableUIActionTab
                                                                                        id={item.id}
                                                                                        onApprove={() => setPendingApproveId(item.id)}
                                                                                        onReject={() => setPendingRejectId(item.id)}
                                                                                />
                                                                        </TableCell>
                                                                </TableRow>
                                                        ))}
                                                </Suspense>
                                        </TableBody>
                                </Table>

                                {/* Pagination — outside <Table> so flex layout is respected */}
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                                        <div className="flex items-center gap-2">
                                                <span className="text-gray-500 text-sm font-normal font-text">
                                                        Rows per page:
                                                </span>
                                                <span className='px-2.5 py-1 rounded-lg border border-gray-200 text-sm text-neutral-800'>
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

                        <ApproveDialogUI
                                pendingApproveId={pendingApproveId}
                                setPendingApproveId={setPendingApproveId}
                                pendingRow={pendingApproveRow}
                                confirmApprove={confirmApprove}
                        />

                        <RejectDialogUI
                                pendingRejectId={pendingRejectId}
                                setPendingRejectId={setPendingRejectId}
                                pendingRow={pendingRejectRow}
                                confirmReject={confirmReject}
                        />
                </>
        )
}

const TableUIUser = ({ fullName, email }: { fullName: string; email: string }) => {
        const initials = getInitials(fullName)
        return (
                <div className='flex gap-3 items-center'>
                        <div
                                className='size-10 aspect-square rounded flex justify-center items-center shrink-0'
                                style={{ backgroundColor: '#EBF0FB' }}
                        >
                                <span
                                        className="text-center text-base font-semibold font-text uppercase"
                                        style={{ color: '#1A56DB' }}
                                >
                                        {initials}
                                </span>
                        </div>
                        <div className='flex flex-col gap-px'>
                                <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
                                        {fullName}
                                </span>
                                <span className="text-gray-500 text-xs font-normal font-text leading-4">
                                        {email}
                                </span>
                        </div>
                </div>
        )
}

// ─── Action cell ──────────────────────────────────────────────────────────────

export const TableUIActionTab = ({ id, onDelete }: { id: string; onDelete: () => void }) => (
        <div className='flex gap-5 items-center'>
                <Link
                        href={`/admin/renters/${id}`}
                        className="text-[#6B7280] hover:text-blue-600 transition-colors"
                >
                        <Eye className='size-4' />
                </Link>
                <button
                        onClick={onDelete}
                        className="text-[#6B7280] hover:text-red-500 transition-colors cursor-pointer"
                >
                        <Trash className='size-4' />
                </button>
        </div>
)

export const VerificationTableUIActionTab = ({ onApprove, onReject }: { id: string; onApprove: () => void; onReject: () => void; }) => (
        <div className='flex gap-5 items-center'>
                <button
                        onClick={onApprove}
                        className="text-[#6B7280] hover:text-green-800 transition-colors cursor-pointer"
                >
                        <Check className='size-4' />
                </button>
                <button
                        onClick={onReject}
                        className="text-[#6B7280] hover:text-red-500 transition-colors cursor-pointer"
                >
                        <X className='size-4' />
                </button>
        </div>
)


type DeleteDialogUIProps = {
        pendingDeleteId: string | null
        setPendingDeleteId: React.Dispatch<React.SetStateAction<string | null>>
        pendingRow: AdminRenterDataRow | undefined
        confirmDelete: () => void
}

type ApproveDialogUIProps = {
        pendingApproveId: string | null
        setPendingApproveId: React.Dispatch<React.SetStateAction<string | null>>
        pendingRow: AdminVerificationPendingRenterRow | undefined
        confirmApprove: () => void
}

type RejectDialogUIProps = {
        pendingRejectId: string | null
        setPendingRejectId: React.Dispatch<React.SetStateAction<string | null>>
        pendingRow: AdminVerificationPendingRenterRow | undefined
        confirmReject: () => void
}

// ─── Dialogs ────────────────────────────────────────────────────────────

export const DeleteDialogUI = ({ pendingDeleteId, setPendingDeleteId, pendingRow, confirmDelete }: DeleteDialogUIProps) => (
        <AlertDialog
                open={!!pendingDeleteId}
                onOpenChange={(open) => { if (!open) setPendingDeleteId(null) }}
        >
                <AlertDialogContent>
                        <AlertDialogHeader>
                                <AlertDialogTitle className='text-neutral-950 text-lg font-semibold font-text leading-7'>
                                        Delete subscriber?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                        <span className='text-gray-500 text-sm font-normal font-text leading-5'>
                                                You are about to permanently remove{' '}
                                                <span className="font-semibold text-neutral-900">
                                                        {pendingRow?.name}
                                                </span>{' '}
                                                from the platform. This action cannot be undone.
                                        </span>
                                </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                        onClick={confirmDelete}
                                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                >
                                        Yes, delete
                                </AlertDialogAction>
                        </AlertDialogFooter>
                </AlertDialogContent>
        </AlertDialog>
)

export const ApproveDialogUI = ({ pendingApproveId, setPendingApproveId, pendingRow, confirmApprove }: ApproveDialogUIProps) => (
        <AlertDialog
                open={!!pendingApproveId}
                onOpenChange={(open) => { if (!open) setPendingApproveId(null) }}
        >
                <AlertDialogContent>
                        <AlertDialogHeader>
                                <AlertDialogTitle className='text-neutral-950 text-lg font-semibold font-text leading-7'>
                                        Approve subscriber?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                        <span className='text-gray-500 text-sm font-normal font-text leading-5'>
                                                You are about to verify{' '}
                                                <span className="font-semibold text-neutral-900">
                                                        {pendingRow?.name}
                                                </span>{' '}
                                                on the platform. Would you like to proceed.
                                        </span>
                                </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                        onClick={confirmApprove}
                                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                >
                                        Yes, Proceed
                                </AlertDialogAction>
                        </AlertDialogFooter>
                </AlertDialogContent>
        </AlertDialog>
)

export const RejectDialogUI = ({ pendingRejectId, setPendingRejectId, pendingRow, confirmReject }: RejectDialogUIProps) => (
        <AlertDialog
                open={!!pendingRejectId}
                onOpenChange={(open) => { if (!open) setPendingRejectId(null) }}
        >
                <AlertDialogContent>
                        <AlertDialogHeader>
                                <AlertDialogTitle className='text-neutral-950 text-lg font-semibold font-text leading-7'>
                                        Reject verification?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                        <span className='text-gray-500 text-sm font-normal font-text leading-5'>
                                                You are about to reject the verification for{' '}
                                                <span className="font-semibold text-neutral-900">
                                                        {pendingRow?.name}
                                                </span>.
                                                This action can be reversed by re-submitting documents.
                                        </span>
                                </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                        onClick={confirmReject}
                                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                >
                                        Yes, Reject
                                </AlertDialogAction>
                        </AlertDialogFooter>
                </AlertDialogContent>
        </AlertDialog>
)

const DocumentPreviewImage = ({ imageSrc, fullname }: { imageSrc?: string; fullname: string }) => {
        return (
                <Image
                        src={imageSrc || '/images/preview.svg'}
                        alt={`${fullname} document preview`}
                        title={`${fullname} document preview`}
                        width={96}
                        height={96}
                        className='max-w-8 aspect-square w-full object-cover'
                />
        )
}