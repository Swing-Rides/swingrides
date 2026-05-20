import { Skeleton } from '@/components/ui/skeleton'

export default function SystemSettingsFormSkeleton() {
        return (
                <div className='flex flex-col gap-6'>
                        {/* Section 1 skeleton */}
                        <div className='p-4 md:p-6 bg-white rounded-[10px] border border-[#E5E7EB] flex flex-col gap-5'>
                                <div className='flex flex-col gap-1'>
                                        <Skeleton className='h-5 w-48' />
                                        <Skeleton className='h-4 w-72' />
                                </div>
                                <Skeleton className='h-px w-full' />
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        {Array.from({ length: 6 }, (_, i) => (
                                                <div key={i} className='flex flex-col gap-1.5'>
                                                        <Skeleton className='h-4 w-32' />
                                                        <Skeleton className='h-10 w-full' />
                                                </div>
                                        ))}
                                </div>
                        </div>

                        {/* Section 2 skeleton */}
                        <div className='p-4 md:p-6 bg-white rounded-[10px] border border-[#E5E7EB] flex flex-col gap-5'>
                                <div className='flex flex-col gap-1'>
                                        <Skeleton className='h-5 w-56' />
                                        <Skeleton className='h-4 w-64' />
                                </div>
                                <Skeleton className='h-px w-full' />
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                        {Array.from({ length: 3 }, (_, i) => (
                                                <div key={i} className='flex flex-col gap-4 p-4 border border-[#E5E7EB] rounded-[10px]'>
                                                        <Skeleton className='h-6 w-20 rounded-full' />
                                                        <div className='flex flex-col gap-1.5'>
                                                                <Skeleton className='h-4 w-24' />
                                                                <Skeleton className='h-10 w-full' />
                                                        </div>
                                                        <div className='flex flex-col gap-1.5'>
                                                                <Skeleton className='h-4 w-24' />
                                                                <Skeleton className='h-10 w-full' />
                                                        </div>
                                                </div>
                                        ))}
                                </div>
                        </div>

                        <div className='flex justify-end'>
                                <Skeleton className='h-10 w-32' />
                        </div>
                </div>
        )
}
