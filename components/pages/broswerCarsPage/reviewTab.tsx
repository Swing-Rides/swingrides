'use client'

import { memo, Suspense } from "react"
import { useSearchParams, usePathname } from 'next/navigation'
import { Progress } from "@/components/ui/progress"
import { getStarPercentage } from "./util"
import { getInitials } from "../profilePages/utils"
import ReviewsModal from "@/components/reviewsModal"
import { ReviewCardProps, ReviewTabProps, StarProgressProps } from "./types"
import Link from "next/link"

export default function ReviewTab({ reviewsAndRatings }: ReviewTabProps) {
        const searchParams = useSearchParams()
        const pathname = usePathname()

        const totalRatings = reviewsAndRatings.starRatingBreakdown.reduce(
                (sum, item) => sum + item.starRated, 0
        )

        const reviewsHref = (() => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('reviews', 'all')
                return `${pathname}?${params.toString()}`
        })()


        return (
                <div className="space-y-8">
                        <div className="flex flex-col md:flex-row gap-2 pb-6.25 border-b border-b-[#E5E7EB]">
                                <div className="flex flex-col gap-2">
                                        <span className="text-[#1A56DB] text-4xl font-medium font-text leading-9">
                                                {reviewsAndRatings.averageRating}
                                        </span>
                                        <span className="md:max-w-32 text-gray-500 text-sm font-normal font-text leading-5">
                                                out of 5 · Based on {reviewsAndRatings.reviews.length} reviews
                                        </span>
                                </div>
                                <div className="w-full grow flex flex-col gap-2">
                                        {reviewsAndRatings.starRatingBreakdown.map((item) => (
                                                <StarProgress
                                                        key={item.starNumber}
                                                        starNumber={item.starNumber}
                                                        starRated={item.starRated}
                                                        totalRatings={totalRatings}
                                                />
                                        ))}
                                </div>
                        </div>
                        <div className=" divide-y">
                                {reviewsAndRatings.reviews.map((review) => (
                                        <ReviewCard
                                                key={review.id}
                                                review={review}
                                        />
                                ))}
                        </div>
                        <div className="flex justify-center items-center">
                                {reviewsAndRatings.reviews.length > 2 &&
                                        <Link 
                                                href={reviewsHref}
                                        >
                                                <button className="text-center text-[#1A56DB] text-base font-medium font-text leading-6 cursor-pointer">
                                                        View all {reviewsAndRatings.reviews.length} reviews
                                                </button>
                                        </Link>
                                }

                        </div>

                        <Suspense>
                                <ReviewsModal
                                        reviews={reviewsAndRatings.reviews}
                                        averageRating={reviewsAndRatings.averageRating}
                                />
                        </Suspense>
                </div>
        )
}

const StarProgress = memo(({ starRated, starNumber, totalRatings }: StarProgressProps) => {
        const percentage = getStarPercentage(starRated, totalRatings)

        return (
                <div className="flex items-center gap-3">
                        <span
                                className="w-8 grow-0 text-gray-500 text-xs font-normal font-text leading-4"
                        >
                                {starNumber}★
                        </span>
                        <Progress
                                className="grow"
                                value={percentage}
                        />
                        <span
                                className="w-10 grow-0 text-right text-gray-500 text-xs font-normal font-text leading-4"
                        >
                                {percentage}%
                        </span>
                </div>
        )
})
StarProgress.displayName = "StarProgress"

const ReviewCard = memo(({ review }: ReviewCardProps) => {
        const initials = getInitials(review.name)

        return (
                <div className="flex items-start gap-4 py-4 md:py-6">
                        <div className="size-10 aspect-square rounded-full grid place-content-center bg-[#E5E7EB]">
                                <span className="text-[#6B7280]">{initials}</span>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                                <div className="flex gap-3 justify-between items-center">
                                        <h4 className="text-[#1F2937] text-sm font-semibold font-text leading-5">
                                                {review.name}
                                        </h4>
                                        <span className="text-[#6B7280] text-xs font-normal font-text leading-4">
                                                {review.date}
                                        </span>
                                </div>
                                <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }, (_, i) => (
                                                <span
                                                        key={i}
                                                        className={i < review.rating ? "opacity-100" : "opacity-25"}
                                                >
                                                        <StarIcon />
                                                </span>
                                        ))}
                                </div>
                                <p className="text-[#6B7280] text-sm font-normal font-text leading-6">
                                        {review.comment}
                                </p>
                        </div>
                </div>
        )
})
ReviewCard.displayName = "ReviewCard"

const StarIcon = memo(() => (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_123_884)">
                        <path d="M5.75706 1.14633C5.77895 1.10211 5.81277 1.06488 5.85469 1.03885C5.89662 1.01282 5.94499 0.999023 5.99434 0.999023C6.04369 0.999023 6.09206 1.01282 6.13398 1.03885C6.17591 1.06488 6.20973 1.10211 6.23162 1.14633L7.38556 3.48368C7.46157 3.63752 7.57379 3.77062 7.71257 3.87155C7.85134 3.97248 8.01254 4.03822 8.18232 4.06314L10.7629 4.4408C10.8118 4.44788 10.8578 4.46851 10.8956 4.50034C10.9333 4.53217 10.9615 4.57395 10.9768 4.62093C10.992 4.66792 10.9939 4.71824 10.982 4.76621C10.9702 4.81418 10.9452 4.85789 10.9098 4.89238L9.04353 6.7097C8.92045 6.82964 8.82836 6.9777 8.77519 7.14112C8.72202 7.30454 8.70936 7.47844 8.73831 7.64784L9.1789 10.2155C9.18753 10.2643 9.18225 10.3147 9.16366 10.3607C9.14508 10.4067 9.11393 10.4466 9.07377 10.4757C9.03362 10.5049 8.98607 10.5222 8.93656 10.5256C8.88705 10.5291 8.83756 10.5185 8.79376 10.4952L6.48688 9.28233C6.33488 9.20252 6.16577 9.16082 5.99409 9.16082C5.82241 9.16082 5.65329 9.20252 5.50129 9.28233L3.19492 10.4952C3.15113 10.5184 3.10171 10.5288 3.05228 10.5253C3.00285 10.5218 2.9554 10.5045 2.91533 10.4753C2.87525 10.4462 2.84416 10.4064 2.82559 10.3604C2.80702 10.3145 2.80171 10.2643 2.81028 10.2155L3.25037 7.64834C3.27944 7.47886 3.26685 7.30485 3.21367 7.14133C3.1605 6.9778 3.06834 6.82967 2.94515 6.7097L1.07887 4.89288C1.0432 4.85843 1.01792 4.81465 1.00592 4.76653C0.993916 4.71842 0.995667 4.6679 1.01097 4.62073C1.02628 4.57356 1.05453 4.53163 1.0925 4.49973C1.13047 4.46783 1.17663 4.44724 1.22574 4.4403L3.80586 4.06314C3.97583 4.03842 4.13725 3.97276 4.27622 3.87181C4.41518 3.77087 4.52754 3.63767 4.60362 3.48368L5.75706 1.14633Z" fill="#FDC700" stroke="#FDC700" strokeWidth="0.999079" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs><clipPath id="clip0_123_884"><rect width="11.9889" height="11.9889" fill="white" /></clipPath></defs>
        </svg>
))
StarIcon.displayName = "StarIcon"