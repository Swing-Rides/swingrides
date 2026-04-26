import { Skeleton } from '@/components/ui/skeleton'

export const CarCardSkeleton = () => {
        return (
                <div className='bg-white rounded-[10px] overflow-clip shadow-sm'>
                        {/* Image */}
                        <Skeleton className='w-full aspect-video' />
                        <div className='p-4 flex flex-col gap-3'>
                                {/* Car name */}
                                <Skeleton className='h-5 w-3/4' />
                                {/* Specs row */}
                                <div className='flex gap-2'>
                                        <Skeleton className='h-4 w-16' />
                                        <Skeleton className='h-4 w-16' />
                                        <Skeleton className='h-4 w-16' />
                                </div>
                                {/* Rating */}
                                <div className='flex gap-2 items-center'>
                                        <Skeleton className='h-4 w-24' />
                                        <Skeleton className='h-4 w-12' />
                                </div>
                                {/* Price + button */}
                                <div className='flex justify-between items-center pt-1'>
                                        <Skeleton className='h-6 w-20' />
                                        <Skeleton className='h-9 w-24 rounded-xs' />
                                </div>
                        </div>
                </div>
        )
}

export const CarCardSkeletonGrid = ({ count = 9 }: { count?: number }) => {
        return (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-5 mt-8'>
                        {Array.from({ length: count }, (_, i) => (
                                <CarCardSkeleton key={i} />
                        ))}
                </div>
        )
}