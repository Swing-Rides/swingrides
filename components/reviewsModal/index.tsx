'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { memo } from 'react'

type Review = {
        id: string
        name: string
        date: string
        rating: number
        comment: string
}

type ReviewsModalProps = {
        reviews?: Review[]
        averageRating?: number
}

export default function CarReviewsModal({ reviews, averageRating }: ReviewsModalProps) {
        const searchParams = useSearchParams()
        const router = useRouter()
        const pathname = usePathname()

        const isOpen = searchParams.get('reviews') === 'all'

        const handleClose = useCallback(() => {
                const params = new URLSearchParams(searchParams.toString())
                params.delete('reviews')
                const query = params.toString()
                router.push(query ? `${pathname}?${query}` : pathname)
        }, [searchParams, router, pathname])

        if (!isOpen || !reviews) return null

        return (
                <div
                        className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
                        onClick={handleClose}
                >
                        <div
                                className='relative bg-white rounded-[10px] shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]'
                                onClick={(e) => e.stopPropagation()}
                        >
                                {/* Header — fixed so it doesn't scroll away */}
                                <div className='flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]'>
                                        <div className='flex flex-col gap-0.5'>
                                                <h2 className='text-[#1F2937] text-lg font-bold font-text leading-6'>
                                                        All Reviews
                                                </h2>
                                                <span className='text-[#6B7280] text-xs font-normal font-text'>
                                                        {averageRating} avg · {reviews.length} reviews
                                                </span>
                                        </div>
                                        <button
                                                onClick={handleClose}
                                                className='text-[#6B7280] hover:text-[#1F2937] transition-colors duration-200 cursor-pointer'
                                                aria-label='Close reviews modal'
                                        >
                                                <CloseIcon />
                                        </button>
                                </div>

                                {/* Scrollable review list */}
                                <div className='overflow-y-auto divide-y divide-[#E5E7EB] px-6'>
                                        {reviews.map((review) => (
                                                <ModalReviewCard key={review.id} review={review} />
                                        ))}
                                </div>
                        </div>
                </div>
        )
}

const ModalReviewCard = memo(({ review }: { review: Review }) => {
        return (
                <div className='py-5 flex flex-col gap-2'>
                        <div className='flex items-center justify-between'>
                                <div className='flex flex-col gap-0.5'>
                                        <span className='text-[#1F2937] text-sm font-semibold font-text leading-5'>
                                                {review.name}
                                        </span>
                                        <span className='text-[#9CA3AF] text-xs font-normal font-text'>
                                                {review.date}
                                        </span>
                                </div>
                                <StarRating rating={review.rating} />
                        </div>
                        <p className='text-[#6B7280] text-sm font-normal font-text leading-5'>
                                {review.comment}
                        </p>
                </div>
        )
})
ModalReviewCard.displayName = 'ModalReviewCard'

const StarRating = ({ rating }: { rating: number }) => {
        return (
                <div className='flex items-center gap-0.5'>
                        {Array.from({ length: 5 }, (_, i) => (
                                <svg
                                        key={i}
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill={i < rating ? '#F59E0B' : 'none'}
                                        xmlns="http://www.w3.org/2000/svg"
                                >
                                        <path
                                                d="M7 1L8.854 4.757L13 5.364L10 8.293L10.708 12.422L7 10.477L3.292 12.422L4 8.293L1 5.364L5.146 4.757L7 1Z"
                                                stroke="#F59E0B"
                                                strokeWidth="1"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                        />
                                </svg>
                        ))}
                </div>
        )
}

const CloseIcon = () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
)