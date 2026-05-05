import React, { Fragment, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FieldSeparator } from '@/components/ui/field'
import { ListProps } from '.'
import { benefitOfConnecting } from '@/constants/connectToHost'

export default function ConfirmHostPageComponent() {
        return (
                <Suspense>
                        <div className='w-full mx-auto py-12.5 px-4 overflow-clip bg-[#F4F6F9]'>
                                <div className='max-w-146 mx-auto'>
                                        <div>
                                                <Image
                                                        src={'/images/you-are-connected.svg'}
                                                        alt='Connect to host'
                                                        title='Connect to host'
                                                        width={196}
                                                        height={156}
                                                        loading="eager"
                                                        className='max-w-48 size-full mx-auto'
                                                />
                                        </div>
                                        <div>
                                                <h2 className="text-center text-neutral-950 text-4xl font-normal leading-10">
                                                        {`You’re connected`}
                                                </h2>
                                                <p className="text-center text-zinc-800 text-base font-medium font-text leading-6 mt-2">
                                                        {`You are now linked to Metro Car Rentals. Their vehicles will be highlighted when you browse.`}
                                                </p>
                                        </div>
                                </div>

                                <div className='max-w-146 mx-auto w-full p-4 md:p-8 bg-white rounded-[10px] outline outline-offset-[-0.89px] outline-gray-200 mt-8 mb-6'>
                                        <div className='grid gap-5'>

                                                <HostCard/>
                                                
                                                <FieldSeparator />

                                                <div className='grid gap-3'>
                                                        {benefitOfConnecting.map((item) => (
                                                                <Fragment key={item.id}>
                                                                        <List content={item}/>
                                                                </Fragment>
                                                        ))}
                                                </div>

                                                <FieldSeparator />

                                                <div className='flex items-center flex-wrap gap-3'>
                                                        <Link 
                                                                href={'/'}
                                                                className='w-full md:w-fit'  
                                                        >
                                                                <button className='w-full px-8 md:px-24 py-3 bg-blue-700 rounded-xs text-white text-base font-semibold leading-6 cursor-pointer'>
                                                                        Browse Their Fleet →
                                                                </button>
                                                        </Link>

                                                        <Link 
                                                                href={'/'}  
                                                                className='w-full md:w-fit'                                                      
                                                        >
                                                                <button className='w-full px-6 py-3 rounded-xs outline outline-offset-[-0.89px] outline-red-500 text-red-500 text-base font-semibold leading-6 cursor-pointer'>
                                                                        Disconnect
                                                                </button>
                                                        </Link>
                                                </div>
                                                <div className='flex justify-center'>
                                                        <span className='text-center text-zinc-800 text-xs font-normal leading-4'>
                                                                {`Disconnecting will remove fleet priority from your search results.`}
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
                </Suspense>
        )
}

const HostCard = () => {
        return (
                <div className='flex flex-wrap gap-4 justify-between items-start'>
                        <div className='flex flex-col md:flex-row gap-4 md:items-start'>
                                <div>
                                        <div className='flex items-center justify-center size-12 overflow-hidden rounded-full bg-blue-700'>
                                                <span className='text-white text-lg font-semibold leading-7'>
                                                        {'M'}
                                                </span>
                                        </div>
                                </div>
                                <div className='flex flex-col gap-1.25'>
                                        <h3 className='text-neutral-950 text-base font-bold font-text leading-6'>
                                                Metro Car Rentals
                                        </h3>
                                        <p className='text-[#6B7280] text-sm font-normal leading-5'>
                                                Connected since Mar 14, 2026
                                        </p>
                                        <div className='flex items-center gap-1'>
                                                <StarIcon/> 
                                                <span className='text-neutral-950 text-sm font-normal leading-5'>
                                                        4.9
                                                </span>
                                        </div>
                                        <div>
                                                <p className='text-gray-500 text-sm font-normal leading-5'>
                                                        47 trips completed
                                                </p>
                                        </div>
                                </div>
                        </div>
                        <div>
                                <div data-property-1="2" className="px-2.5 py-1 bg-green-100 rounded-full inline-flex justify-center items-center gap-2.5">
                                        <button className="justify-start text-emerald-500 text-xs font-semibold font-['DM_Sans'] leading-4">
                                                Connected
                                        </button>
                                </div>
                        </div>
                </div>
        )
}

const List = ({ content }: ListProps) => {
        return (
                <div className='flex gap-3 items-center'>
                        <div>
                                <CheckIcon/>
                        </div>
                        <div>
                                <p className='text-neutral-900 text-sm font-normal leading-5'>
                                        {content.label}
                                </p>
                        </div>
                </div>
        )
}

const StarIcon = () => {
        return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_159_10019)">
                                <path d="M7.68106 1.52954C7.71027 1.47053 7.75538 1.42086 7.81132 1.38614C7.86725 1.35141 7.93178 1.33301 7.99762 1.33301C8.06346 1.33301 8.12798 1.35141 8.18392 1.38614C8.23985 1.42086 8.28497 1.47053 8.31418 1.52954L9.85365 4.6478C9.95507 4.85304 10.1048 5.03061 10.2899 5.16526C10.4751 5.29991 10.6901 5.38763 10.9166 5.42087L14.3594 5.9247C14.4247 5.93415 14.486 5.96167 14.5364 6.00414C14.5868 6.04661 14.6243 6.10234 14.6447 6.16502C14.6651 6.22771 14.6675 6.29484 14.6517 6.35884C14.6359 6.42284 14.6026 6.48114 14.5554 6.52716L12.0656 8.95167C11.9014 9.11168 11.7785 9.3092 11.7076 9.52722C11.6366 9.74524 11.6198 9.97724 11.6584 10.2032L12.2462 13.6287C12.2577 13.6939 12.2506 13.7611 12.2258 13.8225C12.201 13.8838 12.1595 13.937 12.1059 13.9759C12.0523 14.0149 11.9889 14.0379 11.9229 14.0425C11.8568 14.0471 11.7908 14.0331 11.7323 14.0019L8.65473 12.3838C8.45194 12.2773 8.22633 12.2217 7.99728 12.2217C7.76824 12.2217 7.54263 12.2773 7.33984 12.3838L4.2629 14.0019C4.20447 14.0329 4.13854 14.0468 4.07259 14.0421C4.00665 14.0374 3.94335 14.0143 3.88989 13.9754C3.83642 13.9365 3.79494 13.8834 3.77017 13.8221C3.74539 13.7609 3.73831 13.6938 3.74974 13.6287L4.33687 10.2039C4.37565 9.9778 4.35885 9.74566 4.28791 9.5275C4.21697 9.30934 4.09403 9.11171 3.92968 8.95167L1.43986 6.52783C1.39227 6.48186 1.35855 6.42346 1.34254 6.35927C1.32652 6.29507 1.32886 6.22767 1.34928 6.16474C1.3697 6.10182 1.40738 6.04589 1.45804 6.00333C1.50869 5.96077 1.57029 5.9333 1.63579 5.92403L5.07795 5.42087C5.30471 5.38788 5.52006 5.30029 5.70546 5.16562C5.89086 5.03095 6.04076 4.85325 6.14225 4.6478L7.68106 1.52954Z" fill="#FDC700" stroke="#FDC700" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                                <clipPath id="clip0_159_10019">
                                        <rect width="15.9945" height="15.9945" fill="white" />
                                </clipPath>
                        </defs>
                </svg>
        )
}

const CheckIcon = () => {
        return (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_159_10032)">
                                <path d="M9.99263 18.3207C14.5918 18.3207 18.3202 14.5923 18.3202 9.99311C18.3202 5.39391 14.5918 1.66553 9.99263 1.66553C5.39343 1.66553 1.66504 5.39391 1.66504 9.99311C1.66504 14.5923 5.39343 18.3207 9.99263 18.3207Z" stroke="#10B981" strokeWidth="1.66552" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.49512 9.99315L9.16063 11.6587L12.4917 8.32764" stroke="#10B981" strokeWidth="1.66552" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                                <clipPath id="clip0_159_10032">
                                        <rect width="19.9862" height="19.9862" fill="white" />
                                </clipPath>
                        </defs>
                </svg>
        )
}