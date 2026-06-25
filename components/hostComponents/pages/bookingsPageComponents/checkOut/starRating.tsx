'use client'

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from '@/lib/utils'


type StarRatingProps = {
        value: number
        onChange?: (value: number) => void
        size?: number
}

export default function StarRating ({ value, onChange, size = 24 }: StarRatingProps) {

        const [hovered, setHovered] = useState<number | null>(null)
        const interactive = !!onChange
        const displayValue = hovered ?? value

        return (
                <div className='flex items-center gap-1'>
                        {[1, 2, 3, 4, 5].map((star) => {
                                const filled = star <= displayValue
                                return (
                                        <button
                                                key={star}
                                                type='button'
                                                disabled={!interactive}
                                                onClick={() => onChange?.(star)}
                                                onMouseEnter={() => interactive && setHovered(star)}
                                                onMouseLeave={() => interactive && setHovered(null)}
                                                className={cn(
                                                        'transition-transform duration-100',
                                                        interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                                                )}
                                                aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                                        >
                                                <Star
                                                        width={size}
                                                        height={size}
                                                        fill={filled ? '#F59E0B' : 'none'}
                                                        stroke={filled ? '#F59E0B' : '#9CA3AF'}
                                                        strokeWidth={1.5}
                                                />
                                        </button>
                                )
                        })}
                </div>
        )
}
