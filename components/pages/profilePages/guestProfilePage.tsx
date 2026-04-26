'use client'

import { useState, Suspense } from 'react'
import Image from 'next/image'
import MainContent from './mainContent'
import ModifyTripModal from '@/components/modifyTripModal'
import CancelTripDialog from '@/components/cancelTripDialog'
import { 
        User, 
        AccountDetailProps,
        Rentals
} from './types'
import { 
        getInitials, 
        getTotalTrips, 
        getAverageRating, 
        getTotalSpent,
} from './utils'
import { FieldSeparator } from '@/components/ui/field'
import ContentLoading from '@/components/loading/contentLoading'

export default function GuestProfilePage(
        { 
                userAvaterUrl, 
                fullName, 
                email, 
                memberSince, 
                rentals: initialRentals, 
                phoneNumber 
        }: User) {
        
        const [rentals, setRentals] = useState<Rentals[] | undefined>(initialRentals)

        return (
                <>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 px-4 md:px-8 py-10 md:py-12.5'>
                                <div className='col-span-1 flex flex-col gap-4 md:gap-6'>
                                        <UserCard
                                                userAvaterUrl={userAvaterUrl}
                                                fullName={fullName}
                                                email={email}
                                                memberSince={memberSince}
                                                rentals={rentals}
                                        />
                                        <AccountDetail
                                                fullName={fullName}
                                                email={email}
                                                phoneNumber={phoneNumber}
                                                memberSince={memberSince}
                                        />
                                        <WarningCard />
                                </div>
                                <div className='col-span-1 md:col-span-2'>
                                        <Suspense fallback={<ContentLoading/>}>
                                                <MainContent rentals={rentals} />
                                        </Suspense>
                                </div>
                        </div>

                        <Suspense>
                                <ModifyTripModal rentals={rentals} />
                        </Suspense>

                        <Suspense>
                                <CancelTripDialog
                                        rentals={rentals}
                                        onCancel={setRentals}
                                />
                        </Suspense>
                </>
        )
}

const UserCard = ({ userAvaterUrl, fullName, email, memberSince, rentals }: User) => {

        const totalTrip = getTotalTrips(rentals)
        const averageRating = getAverageRating(rentals)
        const totalCost = getTotalSpent(rentals).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

        return (
                <div className='p-2.5 md:p-6 flex flex-col gap-5 bg-white rounded-[10px] shadow-[0px_1px_3px_1px_rgba(0,0,0,0.30)] overflow-clip'>
                        <div className='flex flex-col gap-2.25 items-center'>
                                {userAvaterUrl
                                        ? <Image
                                                src={userAvaterUrl}
                                                alt={`${fullName} 'swing ride profile picture'`}
                                                width={100}
                                                height={100}
                                                fill
                                        /> : <DefaultUserAvater
                                                fullName={fullName}
                                        />}
                                <div>
                                        <h2 className='text-[#0B0B0B] text-lg font-bold font-text'>
                                                {fullName}
                                        </h2>
                                </div>
                                <div>
                                        <span className='text-gray-500 text-sm font-normal font-text'>
                                                {email}
                                        </span>
                                </div>
                                <div>
                                        <span className='text-gray-500 text-sm font-normal font-text'>
                                                Member since {memberSince}
                                        </span>
                                </div>
                        </div>
                        <FieldSeparator />
                        <div className='grid grid-cols-3 gap-4'>
                                <div className="px-3.5 flex flex-col justify-start items-center gap-1 text-center">
                                        <h3 className="text-center text-[#1A56DB] text-xl font-medium font-text">
                                                {totalTrip}
                                        </h3>
                                        <span className="text-center text-[#6B7280] text-xs font-normal uppercase">
                                                Total Trips
                                        </span>
                                </div>

                                <div className="px-3.5 flex flex-col justify-start items-center gap-1 text-center">
                                        <h3 className="text-center text-[#1A56DB] text-xl font-medium font-text">
                                                {averageRating}
                                        </h3>
                                        <span className="text-center text-[#6B7280] text-xs font-normal uppercase">
                                                Avg Rating
                                        </span>
                                </div>

                                <div className="px-3.5 flex flex-col justify-start items-center gap-1 text-center">
                                        <h3 className="text-center text-[#1A56DB] text-xl font-medium font-text">
                                                {totalCost}
                                        </h3>
                                        <span className="text-center text-[#6B7280] text-xs font-normal uppercase">
                                                Total Spent
                                        </span>
                                </div>
                        </div>
                        <FieldSeparator />
                </div>
        )
}

const AccountDetail = ({ fullName, email, phoneNumber, memberSince }: AccountDetailProps) => {
        return (
                <div className='p-2.5 md:p-6 flex flex-col gap-4 bg-white rounded-[10px] shadow-[0px_1px_3px_1px_rgba(0,0,0,0.30)] overflow-clip'>
                        <div>
                                <h3 className='text-[#1F2937] text-base font-semibold font-text leading-6'>
                                        Account Details
                                </h3>
                        </div>
                        <FieldSeparator />
                        <div className='flex flex-col gap-3'>
                                <div className='flex justify-between items-center'>
                                        <div>
                                                <span className='text-[#6B7280] text-xs font-normal font-text leading-5'>
                                                        Full Name
                                                </span>
                                        </div>
                                        <div>
                                                <span className='text-[#1F2937] text-right text-sm font-semibold font-text leading-5'>
                                                        {fullName}
                                                </span>
                                        </div>
                                </div>
                                <FieldSeparator />
                                <div className='flex justify-between items-center'>
                                        <div>
                                                <span className='text-[#6B7280] text-xs font-normal font-text leading-5'>
                                                        Email
                                                </span>
                                        </div>
                                        <div>
                                                <span className='text-[#1F2937] text-right text-sm font-semibold font-text leading-5'>
                                                        {email}
                                                </span>
                                        </div>
                                </div>
                                <FieldSeparator />
                                <div className='flex justify-between items-center'>
                                        <div>
                                                <span className='text-[#6B7280] text-xs font-normal font-text leading-5'>
                                                        Phone
                                                </span>
                                        </div>
                                        <div>
                                                <span className='text-[#1F2937] text-right text-sm font-semibold font-text leading-5'>
                                                        {phoneNumber}
                                                </span>
                                        </div>
                                </div>
                                <FieldSeparator />
                                <div className='flex justify-between items-center'>
                                        <div>
                                                <span className='text-[#6B7280] text-xs font-normal font-text leading-5'>
                                                        Member Since
                                                </span>
                                        </div>
                                        <div>
                                                <span className='text-[#1F2937] text-right text-sm font-semibold font-text leading-5'>
                                                        {memberSince}
                                                </span>
                                        </div>
                                </div>
                        </div>
                </div>
        )
}

const DefaultUserAvater = ({ fullName }: { fullName?: string }) => {
        const initials = getInitials(fullName)

        return (
                <div className='flex size-20 items-center justify-center rounded-full bg-[#1A56DB] text-white text-3xl font-bold font-text leading-10 uppercase overflow-clip'>
                        {initials || '?'}
                </div>
        )
}

const WarningCard = () => {
        return (
                <div className='bg-[#FEF3C7] p-2.5 md:p-3 rounded-md flex gap-2 items-start justify-between'>
                        <div className='pt-px'>
                                <WarningIcon />
                        </div>
                        <div className='flex'>
                                <span className='flex text-[#6B7280] text-xs font-normal font-text leading-4'>
                                        Documents are not saved for security reasons. You will be asked to re-upload your license for each new booking.
                                </span>
                        </div>
                </div>
        )
}

const WarningIcon = () => {
        return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_272_1066)">
                                <path d="M7.99642 14.6618C11.6771 14.6618 14.6608 11.678 14.6608 7.9974C14.6608 4.31676 11.6771 1.33301 7.99642 1.33301C4.31578 1.33301 1.33203 4.31676 1.33203 7.9974C1.33203 11.678 4.31578 14.6618 7.99642 14.6618Z" stroke="#F59E0B" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.99805 10.6628V7.99707" stroke="#F59E0B" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.99805 5.33154H8.00471" stroke="#F59E0B" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                                <clipPath id="clip0_272_1066">
                                        <rect width="15.9945" height="15.9945" fill="white" />
                                </clipPath>
                        </defs>
                </svg>

        )
}