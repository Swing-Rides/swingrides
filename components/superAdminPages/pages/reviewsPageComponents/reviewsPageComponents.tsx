'use client'

import { Suspense, useCallback, useMemo, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, EllipsisVertical, Flag, MessageSquare, Search, Star, Trash2, X } from 'lucide-react'
import PageWrapper from '../../dashboard/pageWrapper'
import ReviewOverviewCard from './reviewOverviewCard'
import { SelectUI } from '../subscribersPageComponents'
import { reviewStarRatingItems, ReviewStarRatingType } from '../../utils/helpers'
import {
        Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { TableUserCard } from '../settingsPageComponent/adminUsersSettingsPageComponent'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// ─── Types ────────────────────────────────────────────────────────────────────

type ReviewRow = {
        id: string
        flag: boolean
        email: string
        name: string
        host: string
        vehicle: string
        rating: ReviewStarRatingType
        comment: string
        date: string
}

type ReviewListTableProps = {
        reviewListRows: ReviewRow[]
}

// ─── Sample data ──────────────────────────────────────────────────────────────

const REVIEW_ROWS: ReviewRow[] = [
        { id: 'REV-001', flag: false, name: 'Alice Johnson', email: 'alice@example.com', host: 'John Doe', vehicle: 'Toyota Camry 2022', rating: '5', comment: 'Absolutely fantastic experience. The car was spotless and the host was very responsive throughout the booking process.', date: '12 Jan, 2025' },
        { id: 'REV-002', flag: true, name: 'Bob Smith', email: 'bob@example.com', host: 'Jane Roe', vehicle: 'Honda Civic 2021', rating: '2', comment: 'Car had a weird smell and the AC was broken. Host was unresponsive when I tried to report the issue.', date: '18 Jan, 2025' },
        { id: 'REV-003', flag: false, name: 'Carol White', email: 'carol@example.com', host: 'Sam Green', vehicle: 'Ford Focus 2020', rating: '4', comment: 'Good overall. Minor scratch on the bumper that was not in the listing photos but host acknowledged it immediately.', date: '25 Jan, 2025' },
        { id: 'REV-004', flag: false, name: 'David Lee', email: 'david@example.com', host: 'John Doe', vehicle: 'BMW 3 Series 2023', rating: '5', comment: 'Premium experience. Car was brand new and host was incredibly professional. Will definitely book again.', date: '02 Feb, 2025' },
        { id: 'REV-005', flag: true, name: 'Eva Brown', email: 'eva@example.com', host: 'Jane Roe', vehicle: 'Kia Sportage 2022', rating: '1', comment: 'Car broke down mid-trip. Took hours to get support. Extremely disappointing and stressful experience.', date: '10 Feb, 2025' },
]

// ─── Placeholder API handlers ─────────────────────────────────────────────────

const handleFlagReview = (id: string) => console.log('Flag Review', id)
const handleUnflag = (id: string) => console.log('Unflag Review', id)
const handleDelete = (id: string) => console.log('Delete Review', id)

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReviewsPageComponents() {
        return (
                <PageWrapper
                        pageTitle="Reviews"
                        pageDescription="Platform-wide review moderation and rating activity"
                >
                        <div className="flex flex-col gap-5 md:gap-8">
                                <div className="flex flex-wrap gap-4 mt-8">
                                        <ReviewOverviewCard
                                                icon={<MessageSquare className='size-5 text-blue-700' />}
                                                iconBG='bg-indigo-50'
                                                label='Total Reviews'
                                                number={1847}
                                        />
                                        <ReviewOverviewCard
                                                icon={<Flag className='size-5 text-amber-500' />}
                                                iconBG='bg-orange-50'
                                                label='Flagged Reviews'
                                                number={23}
                                        />
                                        <ReviewOverviewCard
                                                icon={<Trash2 className='size-5 text-red-500' />}
                                                iconBG='bg-rose-100'
                                                label='Removed Reviews'
                                                number={156}
                                        />
                                        <ReviewOverviewCard
                                                icon={<Star className='size-5 text-emerald-500' />}
                                                iconBG='bg-green-100'
                                                label='Average Rating'
                                                number={4.6}
                                        />
                                </div>
                                <Suspense>
                                        {/* Fix 1: render the table, not just the search bar */}
                                        <ReviewListTable reviewListRows={REVIEW_ROWS} />
                                </Suspense>
                        </div>
                </PageWrapper>
        )
}

// ─── Table ────────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 8

const ReviewListTable = ({ reviewListRows }: ReviewListTableProps) => {
        const searchParams = useSearchParams()
        const router = useRouter()
        const pathname = usePathname()

        // Fix 2: modal state lives here so onViewReview can set it
        const [viewReview, setViewReview] = useState<ReviewRow | null>(null)

        const search = searchParams.get('search')?.toLowerCase() ?? ''
        const ratingFilter = searchParams.get('rating') ?? ''
        const currentPage = Number(searchParams.get('page') ?? 1)

        const filtered = useMemo(() => {
                return reviewListRows.filter(row => {
                        const matchSearch = !search ||
                                row.name.toLowerCase().includes(search) ||
                                row.email.toLowerCase().includes(search) ||
                                row.id.toLowerCase().includes(search)
                        const matchRating = !ratingFilter || row.rating === ratingFilter
                        return matchSearch && matchRating
                })
        }, [reviewListRows, search, ratingFilter])

        const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
        const paginated = filtered.slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE,
        )

        const goToPage = useCallback((page: number) => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('page', String(page))
                router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }, [searchParams, router, pathname])

        const startItem = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
        const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)

        return (
                <>
                        <div className='space-y-5 md:space-y-8'>
                                <SearchFilterSection />
                                <div>
                                        <Table className='py-2.5 bg-white rounded-lg border border-gray-200'>
                                                <TableHeader className='bg-gray-100'>
                                                        <TableRow>
                                                                {['Review ID', 'Renter Name', 'Host / Vehicle', 'Rating', 'Comment', 'Date', 'Actions'].map(h => (
                                                                        <TableHead key={h} className='pl-5 text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight'>
                                                                                {h}
                                                                        </TableHead>
                                                                ))}
                                                        </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                        {paginated.length === 0 ? (
                                                                <TableRow>
                                                                        <TableCell colSpan={7} className='text-center py-16 text-gray-400 text-sm'>
                                                                                No reviews match your filters.
                                                                        </TableCell>
                                                                </TableRow>
                                                        ) : paginated.map(item => (
                                                                <TableRow key={item.id}>
                                                                        <TableCell className='pl-5'>
                                                                                <div className='flex items-center gap-2'>
                                                                                        <span className='text-blue-700 text-xs font-medium font-text leading-5'>
                                                                                                {item.id}
                                                                                        </span>
                                                                                        {item.flag && <Flag className='size-3.5 text-amber-500' />}
                                                                                </div>
                                                                        </TableCell>
                                                                        <TableCell className='pl-5'>
                                                                                <TableUserCard name={item.name} email={item.email} />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                                <div className='flex flex-col gap-0.5'>
                                                                                        <span className='text-neutral-950 text-sm font-semibold font-text leading-5'>{item.host}</span>
                                                                                        <span className='text-gray-500 text-xs font-normal font-text leading-5'>{item.vehicle}</span>
                                                                                </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                                <StarRating rating={Number(item.rating)} />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                                <span className='text-gray-500 text-sm font-normal font-text leading-5 text-wrap line-clamp-2 max-w-sm'>
                                                                                        {item.comment}
                                                                                </span>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                                <span className='text-gray-500 text-sm font-normal font-text leading-5'>{item.date}</span>
                                                                        </TableCell>
                                                                        <TableCell className='pr-5'>
                                                                                <TableAction
                                                                                        flag={item.flag}
                                                                                        onViewReview={() => setViewReview(item)} // Fix 3: wired up
                                                                                        onFlag={() => handleFlagReview(item.id)}
                                                                                        onUnflag={() => handleUnflag(item.id)}
                                                                                        onDelete={() => handleDelete(item.id)}
                                                                                />
                                                                        </TableCell>
                                                                </TableRow>
                                                        ))}
                                                </TableBody>
                                        </Table>

                                        {/* Pagination */}
                                        <div className='flex items-center justify-between p-5 rounded-b-sm bg-white border border-gray-200'>
                                                <span className='block text-gray-500 text-sm font-normal font-text'>
                                                        Showing {startItem}–{endItem} of {filtered.length} review{filtered.length !== 1 ? 's' : ''}
                                                </span>
                                                <div className='flex items-center gap-1'>
                                                        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className='p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors duration-150' aria-label='Previous page'>
                                                                <ChevronLeft className='size-4' />
                                                        </button>
                                                        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages} className='p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors duration-150' aria-label='Next page'>
                                                                <ChevronRight className='size-4' />
                                                        </button>
                                                </div>
                                        </div>
                                </div>
                        </div>

                        {/* Fix 4: modal trigger */}
                        {viewReview && (
                                <Modal onClose={() => setViewReview(null)}>
                                        <ViewReviewModal review={viewReview} onClose={() => setViewReview(null)} />
                                </Modal>
                        )}
                </>
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
                        <SelectUI title='All Ratings' items={reviewStarRatingItems} paramKey='rating' />
                </div>
        )
}

// ─── Table action ─────────────────────────────────────────────────────────────

type TableActionProps = {
        flag: boolean
        onViewReview: () => void
        onFlag: () => void
        onUnflag: () => void
        onDelete: () => void
}

const TableAction = ({ flag, onViewReview, onFlag, onUnflag, onDelete }: TableActionProps) => (
        <Popover>
                <PopoverTrigger asChild>
                        <EllipsisVertical className='size-5 cursor-pointer' />
                </PopoverTrigger>
                <PopoverContent className='max-w-62.5 min-w-37.5 w-full p-0'>
                        <div className='flex flex-col justify-start divide-y gap-0'>
                                <ActionButton label='View Full Review' onClick={onViewReview} color='default' />
                                {/* Fix 5: inverted flag logic corrected */}
                                {flag
                                        ? <ActionButton label='Unflag Review' onClick={onUnflag} color='black' />
                                        : <ActionButton label='Flag Review' onClick={onFlag} color='black' />
                                }
                                <ActionButton label='Delete Review' onClick={onDelete} color='red' />
                        </div>
                </PopoverContent>
        </Popover>
)

type ActionButtonColor = 'default' | 'black' | 'red'

const colorClass: Record<ActionButtonColor, string> = {
        default: 'text-blue-700',
        black: 'text-neutral-950',
        red: 'text-red-500',
}

const ActionButton = ({ label, onClick, color = 'default' }: { label: string; onClick: () => void; color?: ActionButtonColor }) => (
        <div>
                <button onClick={onClick} className={`p-3.5 text-sm font-semibold font-text leading-4 outline-none border-none cursor-pointer w-full text-left ${colorClass[color]}`}>
                        {label}
                </button>
        </div>
)

// ─── Modal wrapper ────────────────────────────────────────────────────────────

const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
        <div className='fixed inset-0 z-999 flex items-center justify-center backdrop-blur-md bg-black/50 px-4' onClick={onClose}>
                <div onClick={(e) => e.stopPropagation()}>{children}</div>
        </div>
)

// ─── View review modal ────────────────────────────────────────────────────────

const ViewReviewModal = ({ review, onClose }: { review: ReviewRow; onClose: () => void }) => (
        <div className='w-full max-w-md p-6 bg-white border border-gray-200 rounded-sm flex flex-col gap-4'>
                {/* Header */}
                <div className='flex items-start justify-between gap-2'>
                        <div className='flex flex-col gap-3 w-full'>
                                <div className='flex gap-3 items-center'>
                                        <span className='text-blue-700 text-lg font-medium font-text leading-6'>{review.id}</span>
                                        {review.flag && (
                                                <span className='flex items-center gap-1.5 text-amber-600 text-xs font-medium font-text leading-4'>
                                                        <Flag className='size-3' />
                                                        Flagged
                                                </span>
                                        )}
                                </div>
                                <TableUserCard name={review.name} email={review.email} />
                                <div className='flex gap-4'>
                                        {/* Fix 6: inline DataList, no external import needed */}
                                        <div className='flex flex-col gap-0.5'>
                                                <span className='text-gray-500 text-xs font-normal font-text uppercase leading-4 tracking-tight'>Host</span>
                                                <span className='text-neutral-950 text-sm font-medium font-text leading-5'>{review.host}</span>
                                        </div>
                                        <div className='flex flex-col gap-0.5'>
                                                <span className='text-gray-500 text-xs font-normal font-text uppercase leading-4 tracking-tight'>Vehicle</span>
                                                <span className='text-neutral-950 text-sm font-medium font-text leading-5'>{review.vehicle}</span>
                                        </div>
                                </div>
                                <div className='flex justify-between items-center'>
                                        <div className='flex flex-col gap-1.5'>
                                                <h4 className='text-gray-500 text-xs font-normal font-text uppercase leading-4 tracking-tight'>Rating</h4>
                                                <StarRating rating={Number(review.rating)} />
                                        </div>
                                        <div className='flex flex-col gap-1.5 text-right'>
                                                <h4 className='text-gray-500 text-xs font-normal font-text uppercase leading-4 tracking-tight'>Date</h4>
                                                <span className='text-gray-700 text-sm font-normal font-text leading-5'>{review.date}</span>
                                        </div>
                                </div>
                        </div>
                        <button onClick={onClose} className='cursor-pointer' aria-label='Close'>
                                <X className='size-4 text-red-500 hover:text-red-900 transition-colors duration-300' />
                        </button>
                </div>

                {/* Comment */}
                <div className='flex flex-col gap-1.5'>
                        <h4 className='text-neutral-950 text-base font-semibold font-text leading-6'>Full Review</h4>
                        <span className='text-gray-700 text-sm font-normal font-text leading-6'>{review.comment}</span>
                </div>

                {/* Actions — Fix 7: py-3 typo corrected */}
                <div className='flex justify-end gap-3'>
                        {review.flag
                                ? <button onClick={() => handleUnflag(review.id)} className='py-2 px-3.5 flex items-center gap-2 border border-amber-500 text-amber-600 text-sm font-medium rounded-xs hover:bg-amber-50 transition-colors duration-200 cursor-pointer'>
                                        <Flag className='size-4' />
                                        Unflag Review
                                </button>
                                : <button onClick={() => handleFlagReview(review.id)} className='py-2 px-3.5 flex items-center gap-2 border border-amber-500 text-amber-600 text-sm font-medium rounded-xs hover:bg-amber-50 transition-colors duration-200 cursor-pointer'>
                                        <Flag className='size-4' />
                                        Flag Review
                                </button>
                        }
                        <button onClick={() => handleDelete(review.id)} className='py-2 px-3.5 flex items-center gap-2 border border-red-500 text-red-500 text-sm font-medium rounded-xs hover:bg-red-50 transition-colors duration-200 cursor-pointer'>
                                <Trash2 className='size-4' />
                                Delete Review
                        </button>
                </div>
        </div>
)

export const StarRating = ({ rating }: { rating: number }) => {
        return (
                <div className='flex items-center gap-0.5'>
                        {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                        key={i}
                                        className='size-4'
                                        style={{
                                                fill: i < rating ? '#EAB308' : 'transparent',
                                                color: i < rating ? '#EAB308' : '#D1D5DB',
                                        }}
                                />
                        ))}
                </div>
        )
}