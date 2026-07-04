import { Suspense, Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FieldSeparator } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { whatHappens, pageIntro, PageIntroProps } from '@/constants/connectToHost'
import ConnectHostForm from '@/components/forms/connectHostForm'

export type ListProps = {
        content: {
                id: number | string
                label: string
        }
}

export default function ConnectToHostPageComponent() {
        return (
                <div className='w-full mx-auto py-12.5 px-4 overflow-clip section-bg-gradient'>
                        <PageIntro 
                                {...pageIntro}
                        />
                        <div className='max-w-146 mx-auto w-full p-4 md:p-8 overflow-clip bg-white rounded-[10px] outline outline-offset-[-0.89px] outline-gray-200 mt-8 mb-6'>
                                <div className='grid gap-5'>
                                        <div className='text-center md:text-left'>
                                                <h3 className='text-neutral-950 text-base font-semibold font-text leading-6'>
                                                        Enter Your Phone Number
                                                </h3>
                                                <p className='text-gray-500 text-sm font-normal leading-5'>
                                                        Use the same phone number you use for bookings.
                                                </p>
                                        </div>
                                        <FieldSeparator/>
                                        <div className='w-full'>
                                                <Suspense fallback={<ConnectHostFormSkeleton />}>
                                                        <ConnectHostForm/>
                                                </Suspense>
                                        </div>
                                        <FieldSeparator />
                                        <div className='grid gap-4'>
                                                <h3 className='text-gray-500 text-sm font-semibold font-text uppercase leading-5'>
                                                        What happens when you connect?
                                                </h3>
                                                <div className='grid gap-3'>
                                                        {whatHappens.map((item) => (
                                                                <Fragment key={item.id}>
                                                                        <List content={item}/>
                                                                </Fragment>
                                                        ))}
                                                </div>
                                                <span className='max-w-117.5 w-full mx-auto text-center text-gray-500 text-xs font-normal leading-4'>
                                                        🔒 Your phone number is only shared with your connected host. You can disconnect anytime.
                                                </span>
                                        </div>
                                </div>
                        </div>
                        <div className='flex flex-col items-center gap-2'>
                                <p className='text-center text-zinc-800 text-base font-normal leading-5'>
                                        {`Don't have a specific host?`}
                                </p>
                                <Link 
                                        href={'/browse-cars'} 
                                        className='text-blue-700 text-base font-medium leading-5'
                                >
                                        Browse all available cars →
                                </Link>
                        </div>
                </div>
        )
}

export const PageIntro = ({ imageSrc, pageTitle, description }: PageIntroProps ) => {
        return (
                <div className='max-w-146 mx-auto space-y-4'>
                        <div>
                                <Image
                                        src={imageSrc}
                                        alt={pageTitle}
                                        title={pageTitle}
                                        width={196}
                                        height={156}
                                        loading="eager"
                                        className='max-w-48 size-full mx-auto'
                                />
                        </div>
                        <div>
                                <h2 className="text-center text-neutral-950 text-4xl font-normal leading-10">
                                        {pageTitle}
                                </h2>
                                <p className="text-center text-zinc-800 text-base font-medium font-text leading-6 mt-2">
                                        {description}
                                </p>
                        </div>
                </div>
        )
}

const List = ({ content }: ListProps) => {
        return (
                <div className='flex gap-3 items-center'>
                        <div className='grid place-content-center size-6 aspect-square p-1 overflow-hidden rounded-full bg-blue-700'>
                                <span className='text-white text-xs font-semibold leading-4'>
                                        {content.id}
                                </span>
                        </div>
                        <div>
                                <p className='text-neutral-900 text-sm text-wrap font-normal leading-5'>
                                        {content.label}
                                </p>
                        </div>
                </div>
        )
}

const ConnectHostFormSkeleton = () => (
        <div className='flex flex-col gap-5'>
                <div className='flex flex-col gap-1'>
                        <Skeleton className='h-6 w-40' />
                        <Skeleton className='h-4 w-72' />
                </div>
                <div className='flex flex-col gap-1.5'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-10 w-full' />
                        <Skeleton className='h-3 w-64' />
                </div>
                <Skeleton className='h-10 w-full' />
        </div>
)