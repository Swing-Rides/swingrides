'use client'

import { ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'
import {
        CreditCard,
        Mail,
        Phone,
        User,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Controller, useFormContext } from 'react-hook-form'
import { CheckOutFormValues } from './checkOutPage'

type StepOneProps = {
        renterName: string
        phoneNumber: string
        emailAddress: string
        licenseNumber: string
}


const confirmReturn = [
        {
                id: 'vehicleReturned',
                label: 'I confirm the renter has returned the vehicle',
        },
        {
                id: 'vehicleKeyReturned',
                label: 'Vehicle keys have been returned',
        },
]

export default function StepOne ({ renterName, phoneNumber, emailAddress, licenseNumber }: StepOneProps) {
        const { control } = useFormContext<CheckOutFormValues>()

        return (
                <div className='shrink grow basis-132.5 space-y-4 p-4 bg-gray-50 rounded-[10px] border border-gray-200 flex flex-col justify-start items-start gap-4'>
                        <h3 className='text-neutral-950 text-base font-medium font-text'>
                                Confirm Renter Identity
                        </h3>
                        <Separator />
                        <div className='space-y-4 w-full'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <RenterInfoCard
                                                icon={<User className='text-gray-500 size-4' />}
                                                label={'Renter Name'}
                                                info={renterName}
                                        />
                                        <RenterInfoCard
                                                icon={<Phone className='text-gray-500 size-4' />}
                                                label={'Phone Number'}
                                                info={phoneNumber}
                                        />
                                        <RenterInfoCard
                                                icon={<Mail className='text-gray-500 size-4' />}
                                                label={'Email Address'}
                                                info={emailAddress}
                                        />
                                        <RenterInfoCard
                                                icon={<CreditCard className='text-gray-500 size-4' />}
                                                label={'License Number'}
                                                info={licenseNumber}
                                        />
                                </div>
                                <Separator />
                                <Controller
                                        name='confirmReturnIds'
                                        control={control}
                                        render={({ field }) => (
                                                <div className='flex flex-col gap-2 w-full'>
                                                        {confirmReturn.map(item => {
                                                                const checked = field.value?.includes(item.id) ?? false
                                                                const inputId = `confirmReturn-${item.id}`
                                                                return (
                                                                        <label
                                                                                key={item.id}
                                                                                htmlFor={inputId}
                                                                                className='flex items-center justify-between gap-3 p-3 rounded-md border border-[#E5E7EB] cursor-pointer hover:bg-[#F9FAFB] transition-colors duration-150'
                                                                        >
                                                                                <div className='flex items-center gap-3'>
                                                                                        <Checkbox
                                                                                                id={inputId}
                                                                                                checked={checked}
                                                                                                onCheckedChange={(isChecked) => {
                                                                                                        const current: string[] = field.value ?? []
                                                                                                        field.onChange(
                                                                                                                isChecked
                                                                                                                        ? [...current, item.id]
                                                                                                                        : current.filter((id: string) => id !== item.id)
                                                                                                        )
                                                                                                }}
                                                                                                className='border-[#E5E7EB] data-[state=checked]:bg-[#1A56DB] data-[state=checked]:border-[#1A56DB]'
                                                                                        />
                                                                                        <span className='text-[#1F2937] text-sm font-medium font-text'>
                                                                                                {item.label}
                                                                                        </span>
                                                                                </div>
                                                                        </label>
                                                                )
                                                        })}
                                                </div>
                                        )}
                                />
                        </div>
                </div>
        )
}

type RenterInfoCardProps = {
        icon: ReactNode
        label: string
        info: string
}

const RenterInfoCard = ({ icon, label, info }: RenterInfoCardProps) => {
        return (
                <div className='flex flex-col gap-1'>
                        <div className='flex gap-2 items-center'>
                                {icon}
                                <span className='text-gray-500 text-xs font-normal font-text leading-4'>
                                        {label}
                                </span>
                        </div>
                        <span className='text-neutral-950 text-sm font-medium font-text leading-5'>
                                {info}
                        </span>
                </div>
        )
}