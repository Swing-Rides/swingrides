import { Fragment } from 'react'
import { PageIntro } from '../connectToHostPage'
import { happenNextList, pageIntro, WhatHappenNextListProps } from '@/constants/reportIssue'
import { FieldSeparator } from '@/components/ui/field'
import ReportAnIssueForm from '@/components/forms/reportAnIssueForm'

export default function ReportIssuePageComponents() {
        return (
                <div className='w-full mx-auto py-12.5 px-4 overflow-clip section-bg-gradient space-y-10'>
                        <PageIntro 
                                {...pageIntro}
                        />
                        <div className='flex flex-col gap-10'>
                                <div className='max-w-146 mx-auto w-full p-4 md:p-8 overflow-clip bg-white rounded-[10px] border border-gray-200'>
                                        <div className='flex flex-col gap-4'>
                                                <h3 className="text-gray-800 text-base font-semibold font-text leading-6">
                                                        Issue Details
                                                </h3>
                                                <FieldSeparator />
                                                <div className='flex flex-col gap-3 w-full justify-center'>
                                                        <ReportAnIssueForm />
                                                        <span className="text-center text-gray-500 text-xs font-normal font-text leading-4">
                                                                Our support team will review your report and respond within 24 hours. For urgent safety concerns please also call our support line directly.
                                                        </span>
                                                </div>
                                        </div>
                                </div>
                                <div className='max-w-146 mx-auto w-full p-4 md:p-8 overflow-clip bg-white rounded-[10px] border border-gray-200'>
                                        <WhatHappenNextCard/>
                                </div>
                        </div>
                </div>
        )
}

const WhatHappenNextCard = () => {
        return (
                <div className='flex flex-col gap-4'>
                        <h3 className="text-gray-800 text-base font-semibold font-text leading-6">
                                What Happens Next
                        </h3>
                        <FieldSeparator/>
                        <div className='space-y-4'>
                                {happenNextList.map((item) => (
                                        <Fragment key={item.number}>
                                                <WhatHappenNextList 
                                                        {...item}
                                                />
                                        </Fragment>
                                ))}
                        </div>
                </div>
        )
}

const WhatHappenNextList = ({ number, label, desc }: WhatHappenNextListProps ) => {
        return (
                <div className='flex gap-3'>
                        <div className='size-8 aspect-square rounded-full bg-[#1A56DB] flex justify-center items-center'>
                                <span className="text-white text-sm font-semibold font-text leading-5">
                                        {number}
                                </span>
                        </div>
                        <div>
                                <h4 className="text-gray-800 text-sm font-semibold font-text leading-5">
                                        {label}
                                </h4>
                                <span className="text-gray-500 text-xs font-normal font-text leading-5">
                                        {desc}
                                </span>
                        </div>
                </div>
        )
}