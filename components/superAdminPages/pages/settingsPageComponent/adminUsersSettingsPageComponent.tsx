'use client'

import { Suspense, useCallback, useState, useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { EllipsisVertical, Search, ChevronLeft, ChevronRight, X, Download } from 'lucide-react'
import { SelectUI } from '../subscribersPageComponents'
import {
        adminUsersRoleItems,
        AdminUsersRoleType,
        adminUsersStatusItems,
        AdminUsersStatusType,
} from '../../utils/helpers'
import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from '@/components/ui/table'
import {
        Popover,
        PopoverContent,
        PopoverTrigger,
} from '@/components/ui/popover'
import { getInitials } from '@/components/pages/profilePages/utils'
import { AdminUsersRolePill, AdminUsersStatusPill } from '../../dashboard/statusPill'
import InviteNewAdminForm from '../../forms/inviteNewAdmin'
import EditAdminRoleForm from '../../forms/editAdminRoleForm'
import { exportActivityLog } from '../../utils/exportToCSV'

const ITEMS_PER_PAGE = 8

type AdminUserRow = {
        id: string
        name: string
        email: string
        role: AdminUsersRoleType
        status: AdminUsersStatusType
        lastActive: string
        dateAdded: string
}

const ALL_ROWS: AdminUserRow[] = [
        { id: '12334', name: 'name surname', email: 'email@mail.cc', role: 'super admin', status: 'active', lastActive: '2 hours ago', dateAdded: '15 Jan, 2024' },
        { id: '12434', name: 'name name', email: 'email@mail.cc', role: 'admin', status: 'invited', lastActive: '2 hours ago', dateAdded: '15 Jan, 2024' },
        { id: '12534', name: 'name name', email: 'email@mail.cc', role: 'support', status: 'suspended', lastActive: '2 hours ago', dateAdded: '15 Jan, 2024' },
]

export type ActivityLogRow = {
        id: string
        name: string
        action: string
        target: string
        timestamp: string
}

const ACTIVITY_LOG_ROWS: ActivityLogRow[] = [
        { id: 'log-001', name: 'name surname', action: 'Invited admin user', target: 'newadmin@mail.cc', timestamp: '15 Jan, 2024 · 10:32 AM' },
        { id: 'log-002', name: 'name surname', action: 'Suspended user', target: 'user@mail.cc', timestamp: '15 Jan, 2024 · 09:14 AM' },
        { id: 'log-003', name: 'name name', action: 'Changed role', target: 'other@mail.cc', timestamp: '14 Jan, 2024 · 04:55 PM' },
        { id: 'log-004', name: 'name name', action: 'Removed user', target: 'gone@mail.cc', timestamp: '13 Jan, 2024 · 11:00 AM' },
]

export default function AdminUsersSettingsPageComponent() {
        const [inviteOpen, setInviteOpen] = useState(false)
        const [editUser, setEditUser] = useState<AdminUserRow | null>(null)

        return (
                <div className='p-3 md:p-8'>
                        <div className='space-y-8'>
                                <PageTitle onInvite={() => setInviteOpen(true)} />
                                <Suspense>
                                        <AdminUserListTable
                                                adminUserRows={ALL_ROWS}
                                                onEditRole={(user) => setEditUser(user)}
                                        />
                                </Suspense>
                                <Suspense>
                                        <ActivityLogSection activityLogRows={ACTIVITY_LOG_ROWS} />
                                </Suspense>
                        </div>

                        {/* Invite modal */}
                        {inviteOpen && (
                                <Modal onClose={() => setInviteOpen(false)}>
                                        <InviteNewAdminModal onClose={() => setInviteOpen(false)} />
                                </Modal>
                        )}

                        {/* Edit role modal */}
                        {editUser && (
                                <Modal onClose={() => setEditUser(null)}>
                                        <EditAdminRoleModal
                                                user={editUser}
                                                onClose={() => setEditUser(null)}
                                        />
                                </Modal>
                        )}
                </div>
        )
}

// ─── Page title ───────────────────────────────────────────────────────────────

const PageTitle = ({ onInvite }: { onInvite: () => void }) => (
        <section className='flex justify-between items-center gap-5'>
                <div className='flex flex-col gap-1.25'>
                        <h2 className='text-neutral-950 text-2xl font-semibold font-text'>
                                Admin Users
                        </h2>
                        <span className='text-gray-500 text-sm font-normal font-text'>
                                Manage admin access, roles, and monitor platform activity
                        </span>
                </div>
                <button
                        onClick={onInvite}
                        className='py-2 px-10 bg-blue-700 rounded-xs text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300 cursor-pointer'
                >
                        Invite Admin
                </button>
        </section>
)

// ─── Table ────────────────────────────────────────────────────────────────────

type AdminUserListTableProps = {
        adminUserRows: AdminUserRow[]
        onEditRole: (user: AdminUserRow) => void
}

const AdminUserListTable = ({ adminUserRows, onEditRole }: AdminUserListTableProps) => {
        const searchParams = useSearchParams()
        const router = useRouter()
        const pathname = usePathname()

        const search = searchParams.get('search')?.toLowerCase() ?? ''
        const roleFilter = searchParams.get('status') ?? ''
        const statusFilter = searchParams.get('plan') ?? ''
        const currentPage = Number(searchParams.get('page') ?? 1)

        // Filter
        const filtered = useMemo(() => {
                return adminUserRows.filter(row => {
                        const matchSearch = !search ||
                                row.name.toLowerCase().includes(search) ||
                                row.email.toLowerCase().includes(search) ||
                                row.id.toLowerCase().includes(search)

                        const matchRole = !roleFilter || row.role === roleFilter
                        const matchStatus = !statusFilter || row.status === statusFilter

                        return matchSearch && matchRole && matchStatus
                })
        }, [adminUserRows, search, roleFilter, statusFilter])

        const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
        const paginated = filtered.slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE
        )

        const goToPage = useCallback((page: number) => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('page', String(page))
                router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }, [searchParams, router, pathname])

        const startItem = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
        const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)

        return (
                <div className='space-y-5 md:space-y-8'>
                        <SearchFilterSection />
                        <div>
                                <Table className='py-2.5 bg-white rounded-lg border border-gray-200'>
                                        <TableHeader className='bg-gray-100'>
                                                <TableRow>
                                                        {['User', 'Role', 'Status', 'Last Active', 'Date Added', 'Actions'].map(h => (
                                                                <TableHead
                                                                        key={h}
                                                                        className='pl-5 text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight'
                                                                >
                                                                        {h}
                                                                </TableHead>
                                                        ))}
                                                </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                                {paginated.length === 0 ? (
                                                        <TableRow>
                                                                <TableCell colSpan={6} className='text-center py-16 text-gray-400 text-sm'>
                                                                        No users match your filters.
                                                                </TableCell>
                                                        </TableRow>
                                                ) : paginated.map(item => (
                                                        <TableRow key={item.id} className='px-5'>
                                                                <TableCell className='pl-5'>
                                                                        <TableUserCard name={item.name} email={item.email} />
                                                                </TableCell>
                                                                <TableCell>
                                                                        <AdminUsersRolePill status={item.role} />
                                                                </TableCell>
                                                                <TableCell>
                                                                        <AdminUsersStatusPill status={item.status} />
                                                                </TableCell>
                                                                <TableCell>
                                                                        <span className='text-gray-500 text-sm font-normal font-text leading-5'>
                                                                                {item.lastActive}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell className='pr-5'>
                                                                        {item.dateAdded}
                                                                </TableCell>
                                                                <TableCell className='pr-5'>
                                                                        <TableAction
                                                                                status={item.status}
                                                                                onEditRole={() => onEditRole(item)}
                                                                                onResendInvite={() => handleResendInvite(item.id)}
                                                                                onSuspend={() => handleSuspend(item.id)}
                                                                                onReactivate={() => handleReactivate(item.id)}
                                                                                onRemove={() => handleRemove(item.id)}
                                                                        />
                                                                </TableCell>
                                                        </TableRow>
                                                ))}
                                        </TableBody>
                                </Table>

                                {/* Pagination */}
                                <div className='flex items-center justify-between p-5 rounded-b-sm bg-white border border-gray-200'>
                                        <span className='block text-gray-500 text-sm font-normal font-text'>
                                                Showing {startItem}-{endItem} of {filtered.length} admin user{filtered.length !== 1 ? 's' : ''}
                                        </span>
                                        <div className='flex items-center gap-1'>
                                                <button
                                                        onClick={() => goToPage(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className='p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors duration-150'
                                                        aria-label='Previous page'
                                                >
                                                        <ChevronLeft className='size-4' />
                                                </button>
                                                <button
                                                        onClick={() => goToPage(currentPage + 1)}
                                                        disabled={currentPage >= totalPages}
                                                        className='p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors duration-150'
                                                        aria-label='Next page'
                                                >
                                                        <ChevronRight className='size-4' />
                                                </button>
                                        </div>
                                </div>
                        </div>
                </div>
        )
}

// ─── Placeholder API handlers ─────────────────────────────────────────────────

const handleResendInvite = (id: string) => console.log('resend invite', id)
const handleSuspend = (id: string) => console.log('suspend', id)
const handleReactivate = (id: string) => console.log('reactivate', id)
const handleRemove = (id: string) => console.log('remove', id)

// ─── Table action ─────────────────────────────────────────────────────────────

type TableActionProps = {
        status: AdminUsersStatusType
        onEditRole: () => void
        onResendInvite: () => void
        onSuspend: () => void
        onReactivate: () => void
        onRemove: () => void
}

const TableAction = ({
        status,
        onEditRole,
        onResendInvite,
        onSuspend,
        onReactivate,
        onRemove,
}: TableActionProps) => (
        <Popover>
                <PopoverTrigger asChild>
                        <EllipsisVertical className='size-5 cursor-pointer' />
                </PopoverTrigger>
                <PopoverContent className='max-w-62.5 min-w-37.5 w-full p-0'>
                        <div className='flex flex-col justify-start divide-y gap-0'>
                                <ActionButton label='Edit Role' onClick={onEditRole} color='default' />

                                {/* Invited only */}
                                {status === 'invited' && (
                                        <ActionButton label='Resend Invite' onClick={onResendInvite} color='blue' />
                                )}

                                {/* Active only */}
                                {status === 'active' && (
                                        <ActionButton label='Suspend Access' onClick={onSuspend} color='red' />
                                )}

                                {/* Suspended only */}
                                {status === 'suspended' && (
                                        <ActionButton label='Reactivate Access' onClick={onReactivate} color='green' />
                                )}

                                <ActionButton label='Remove Access' onClick={onRemove} color='red' />
                        </div>
                </PopoverContent>
        </Popover>
)

type ActionButtonColor = 'default' | 'blue' | 'red' | 'green'

const colorClass: Record<ActionButtonColor, string> = {
        default: 'text-neutral-950',
        blue: 'text-blue-700',
        red: 'text-red-500',
        green: 'text-emerald-500',
}

const ActionButton = ({
        label,
        onClick,
        color = 'default',
}: {
        label: string
        onClick: () => void
        color?: ActionButtonColor
}) => (
        <div>
                <button
                        onClick={onClick}
                        className={`p-3.5 text-sm font-semibold font-text leading-4 outline-none border-none cursor-pointer w-full text-left ${colorClass[color]}`}
                >
                        {label}
                </button>
        </div>
)

// ─── Search / filter ──────────────────────────────────────────────────────────

const SearchFilterSection = () => {
        const router = useRouter()
        const pathname = usePathname()
        const searchParams = useSearchParams()

        const setParam = useCallback((key: string, value: string) => {
                const params = new URLSearchParams(searchParams.toString())
                if (value) params.set(key, value)
                else params.delete(key)
                if (key !== 'page') params.delete('page')
                router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }, [router, pathname, searchParams])

        const search = searchParams.get('search') ?? ''

        return (
                <div className='flex flex-wrap gap-4 items-center p-4 bg-white rounded-[10px] border border-gray-200'>
                        <div className='relative flex items-center w-full max-w-6xl'>
                                <Search className='absolute left-3 size-4 text-gray-400 pointer-events-none shrink-0' />
                                <input
                                        type='text'
                                        value={search}
                                        onChange={(e) => setParam('search', e.target.value)}
                                        placeholder='Search by name, email or ID...'
                                        className={[
                                                'w-full pl-9 pr-4 py-2 rounded-lg',
                                                'bg-gray-50 border border-gray-300',
                                                'text-xs text-[#0B0B0B]/50 placeholder:text-gray-400 font-text',
                                                'outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
                                                'transition-all duration-200',
                                        ].join(' ')}
                                />
                        </div>
                        <SelectUI title='All Roles' items={adminUsersRoleItems} paramKey='status' />
                        <SelectUI title='All Status' items={adminUsersStatusItems} paramKey='plan' />
                </div>
        )
}

// ─── User card ────────────────────────────────────────────────────────────────

const TableUserCard = ({ name, email }: { name: string; email: string }) => (
        <div className='flex items-center justify-start gap-3'>
                <div className='flex justify-center items-center aspect-square size-10 rounded-full text-white bg-blue-700 text-sm font-bold font-text'>
                        {getInitials(name)}
                </div>
                <div className='flex flex-col gap-px'>
                        <span className='text-neutral-950 text-sm font-semibold font-text leading-5'>{name}</span>
                        <span className='text-gray-500 text-xs font-normal font-text leading-4'>{email}</span>
                </div>
        </div>
)

// ─── Generic modal wrapper ────────────────────────────────────────────────────

const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
        <div
                className='fixed inset-0 z-999 flex items-center justify-center backdrop-blur-md bg-black/50 px-4'
                onClick={onClose}
        >
                <div onClick={(e) => e.stopPropagation()}>
                        {children}
                </div>
        </div>
)

// ─── Invite modal ─────────────────────────────────────────────────────────────

const InviteNewAdminModal = ({ onClose }: { onClose: () => void }) => (
        <div className='w-full max-w-md p-6 bg-white border border-gray-200 rounded-sm flex flex-col gap-4'>
                <div className='flex items-center justify-between'>
                        <h3 className='text-[#1F2937] text-lg font-bold font-text'>Invite New Admin</h3>
                        <button
                                onClick={onClose}
                                className='text-gray-400 hover:text-gray-600 transition-colors duration-150 cursor-pointer'
                                aria-label='Close'
                        >
                                <X className='size-4 text-red-500 hover:text-red-900 transition-colors duration-300' />
                        </button>
                </div>
                <InviteNewAdminForm onSubmit={(values) => console.log(values)} />
        </div>
)

// ─── Edit role modal ──────────────────────────────────────────────────────────

const EditAdminRoleModal = ({
        user,
        onClose,
}: {
        user: AdminUserRow
        onClose: () => void
}) => {
        const [first, ...rest] = user.name.trim().split(' ')
        const firstName = first ?? ''
        const lastName = rest.join(' ')

        return (
                <div className='w-full max-w-md p-6 bg-white border border-gray-200 rounded-sm flex flex-col gap-4'>
                        <div className='flex items-center justify-between'>
                                <h3 className='text-[#1F2937] text-lg font-bold font-text'>Edit Admin Role</h3>
                                <button
                                        onClick={onClose}
                                        className='text-gray-400 hover:text-gray-600 transition-colors duration-150 cursor-pointer'
                                        aria-label='Close'
                                >
                                        <X className='size-4 text-red-500 hover:text-red-900 transition-colors duration-300' />
                                </button>
                        </div>
                        <EditAdminRoleForm
                                firstName={firstName}
                                lastName={lastName}
                                email={user.email}
                                onSubmit={(values) => {
                                        console.log('update role', values)
                                        onClose()
                                }}
                        />
                </div>
        )
}

const ActivityLogSection = ({ activityLogRows }: { activityLogRows: ActivityLogRow[] }) => {
        return (
                <section className='space-y-4'>
                        <div className='flex justify-between items-start gap-4'>
                                <div className='flex flex-col gap-1'>
                                        <h3 className='text-neutral-950 text-lg font-semibold font-text leading-6'>
                                                Activity Log
                                        </h3>
                                        <span className='text-gray-500 text-sm font-normal font-text leading-5'>
                                                A full audit trail of all admin actions on the platform
                                        </span>
                                </div>
                                <div>
                                        <button 
                                                onClick={() => exportActivityLog(activityLogRows)}
                                                className='py-2 px-3 border border-blue-700 bg-transparent flex gap-2 items-center text-blue-700 text-sm font-medium font-text leading-5 hover:text-white hover:bg-blue-700 transition-colors duration-300 cursor-pointer'
                                        >
                                                <Download className='size-4'/>
                                                <span>Export Log</span>
                                        </button>
                                </div>
                        </div>
                        <div>
                                <ActivityLogTable activityLogRows={activityLogRows}/>
                        </div>
                </section>
        )
}

const ActivityLogTable = ({ activityLogRows }: { activityLogRows: ActivityLogRow[] }) => {
        const searchParams = useSearchParams()
        const router = useRouter()
        const pathname = usePathname()

        // Fix 1: read currentPage from searchParams (was missing entirely)
        const currentPage = Number(searchParams.get('activity-log') ?? 1)

        const totalPages = Math.ceil(activityLogRows.length / ITEMS_PER_PAGE)
        const paginated = activityLogRows.slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE
        )

        const goToPage = useCallback((page: number) => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('activity-log', String(page))
                router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }, [searchParams, router, pathname])

        const startItem = activityLogRows.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
        const endItem = Math.min(currentPage * ITEMS_PER_PAGE, activityLogRows.length)

        return (
                <>
                        <Table className='py-2.5 bg-white rounded-lg border border-gray-200'>
                                <TableHeader className='bg-gray-100'>
                                        <TableRow>
                                                {['Admin', 'Action', 'Target', 'Timestamp'].map(h => (
                                                        <TableHead
                                                                key={h}
                                                                className='pl-5 text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight'
                                                        >
                                                                {h}
                                                        </TableHead>
                                                ))}
                                        </TableRow>
                                </TableHeader>
                                <TableBody>
                                        {paginated.length === 0 ? (
                                                <TableRow>
                                                        <TableCell colSpan={4} className='text-center py-16 text-gray-400 text-sm'>
                                                                No activity found.
                                                        </TableCell>
                                                </TableRow>
                                        ) : paginated.map(item => (
                                                <TableRow key={item.id}>
                                                        <TableCell className='pl-5'>
                                                                {/* Fix 3: removed duplicate {item.name} text node */}
                                                                <div className='flex items-center justify-start gap-2.5'>
                                                                        <div className='flex justify-center items-center aspect-square size-10 rounded-full text-white bg-blue-700 text-sm font-bold font-text'>
                                                                                {getInitials(item.name)}
                                                                        </div>
                                                                        <span className='text-neutral-950 text-xs font-medium font-text leading-5'>
                                                                                {item.name}
                                                                        </span>
                                                                </div>
                                                        </TableCell>
                                                        <TableCell>
                                                                <span className='text-gray-700 text-xs font-normal font-text leading-5'>
                                                                        {item.action}
                                                                </span>
                                                        </TableCell>
                                                        <TableCell>
                                                                <span className='text-neutral-950 text-xs font-medium font-text leading-5'>
                                                                        {item.target}
                                                                </span>
                                                        </TableCell>
                                                        <TableCell className='pr-5'>
                                                                <span className='text-gray-500 text-xs font-normal font-text leading-5'>
                                                                        {item.timestamp}
                                                                </span>
                                                        </TableCell>
                                                </TableRow>
                                        ))}
                                </TableBody>
                        </Table>

                        {/* Pagination */}
                        <div className='flex items-center justify-between p-5 rounded-b-sm bg-white border border-gray-200'>
                                <span className='block text-gray-500 text-sm font-normal font-text'>
                                        Showing {startItem}-{endItem} of {activityLogRows.length} log entr{activityLogRows.length !== 1 ? 'ies' : 'y'}
                                </span>
                                <div className='flex items-center gap-1'>
                                        <button
                                                onClick={() => goToPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className='p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors duration-150'
                                                aria-label='Previous page'
                                        >
                                                <ChevronLeft className='size-4' />
                                        </button>
                                        <button
                                                onClick={() => goToPage(currentPage + 1)}
                                                disabled={currentPage >= totalPages}
                                                className='p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors duration-150'
                                                aria-label='Next page'
                                        >
                                                <ChevronRight className='size-4' />
                                        </button>
                                </div>
                        </div>
                </>
        )
}