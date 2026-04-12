'use client'

import { Fragment, useState } from 'react'
import Link from 'next/link'

import { SearchIcon } from "lucide-react"
import {
        Field,
        FieldSeparator,
        FieldLabel,
        FieldDescription,
        FieldTitle,
        FieldGroup
} from "@/components/ui/field"
import {
        InputGroup,
        InputGroupAddon,
        InputGroupInput,
} from "@/components/ui/input-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
        Select,
        SelectContent,
        SelectGroup,
        SelectItem,
        SelectLabel,
        SelectTrigger,
        SelectValue,
} from "@/components/ui/select"

import { 
        carsCardData, 
        carSeatsFilterData, 
        carsSortData, 
        transmissionFilterData, 
        vehicleTypeFilterData 
} from '@/constants/carsTestData'
import CarCard, { Content } from '@/components/cars/carCard'
import { FeaturedCarsErrorMessage } from '../homepage'

type ListFilterProps = {
        filterTitle: string;
        content: {
                id: string;
                title: string;
        }[];
}

type CarsDataSortProps = {
        sortData: {
                id: number;
                value: string;
                label: string;
        }[]
}

type CarsCardProps = {
        content: Content[]
}

export default function BrowseCarsComponentPage() {
        return (
                <>
                        <NotificationBar/>
                        <div className='flex flex-col px-2.5 md:px-0 md:flex-row w-full'>
                                <SideBar/>
                                <PageMainContent content={carsCardData}/>
                        </div>
                </>
        )
}

const NotificationBar = () => {
        return (
                <div className='bg-[#EBF0FB] py-2.5 px-2.5 md:px-8'>
                        <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
                                <div className='flex flex-wrap items-center gap-2 md:text-nowrap'>
                                        <LinkIcon/>
                                        <span className='font-semibold text-base text-[#0B0B0B]'>
                                                Want to see your favourite host
                                        </span>
                                        <span className='font-normal text-base text-[#333]'>
                                                Connect your phone number and see their fleet first.
                                        </span>
                                </div>
                                <div className='flex justify-start items-center gap-3'>
                                        Form Input comes here
                                        <Link 
                                                href={'/connect-host'}
                                        >
                                                <button className='px-4 py-1.5 cursor-pointer text-white bg-blue-700 hover:bg-blue-950 transition-colors duration-300 rounded-xs text-nowrap'>
                                                        Connect →
                                                </button>
                                        </Link>
                                        <div>
                                                <CloseIcon/>
                                        </div>
                                </div>
                        </div>
                </div>
        )
}

const LinkIcon = () => {
        return (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_157_8848)">
                                <path d="M6.74922 12.7482H5.24944C4.25503 12.7482 3.30134 12.3531 2.59819 11.65C1.89503 10.9468 1.5 9.99312 1.5 8.99871C1.5 8.0043 1.89503 7.05061 2.59819 6.34745C3.30134 5.6443 4.25503 5.24927 5.24944 5.24927H6.74922" stroke="#1A56DB" strokeWidth="1.49978" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M11.248 5.24927H12.7478C13.7422 5.24927 14.6959 5.6443 15.3991 6.34745C16.1022 7.05061 16.4973 8.0043 16.4973 8.99871C16.4973 9.99312 16.1022 10.9468 15.3991 11.65C14.6959 12.3531 13.7422 12.7482 12.7478 12.7482H11.248" stroke="#1A56DB" strokeWidth="1.49978" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M5.99902 8.99866H11.9981" stroke="#1A56DB" strokeWidth="1.49978" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                                <clipPath id="clip0_157_8848">
                                        <rect width="17.9973" height="17.9973" fill="white" />
                                </clipPath>
                        </defs>
                </svg>
        )
}

const CloseIcon = () => {
        return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.9963 3.99866L3.99902 11.9959" stroke="#0B0B0B" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3.99902 3.99866L11.9963 11.9959" stroke="#0B0B0B" strokeWidth="1.33288" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
        )
}

const SideBar = () => {
        return (
                <div className='flex flex-col gap-6 md:max-w-90.5 w-full p-2.5 md:p-6 bg-white'>
                        <div className='flex justify-between items-center'>
                                <span className='text-lg text-[#0B0B0B] font-semibold'>
                                        Filter by
                                </span>
                                <span className='text-base text-[#1A56DB] font-medium cursor-pointer'>
                                        Reset all
                                </span>
                        </div>
                        <div>
                                <Searchbar/>
                        </div>
                        <FieldSeparator />
                        <RentalType />
                        <FieldSeparator />
                        <AvaliableNowOnly />
                        <FieldSeparator />
                        <PriceRange />
                        <FieldSeparator />
                        <ListFilter {...vehicleTypeFilterData}/>
                        <FieldSeparator />
                        <ListFilter {...transmissionFilterData}/>
                        <FieldSeparator />
                        <ListFilter {...carSeatsFilterData}/>
                </div>
        )
}

const Searchbar = () => {
        return (
                <Field className="max-w-sm font-text text-sm font-normal">
                        <InputGroup className='rounded-[5px]'>
                                <InputGroupInput id="inline-start-input" placeholder="Search vehicles..." />
                                <InputGroupAddon align="inline-start">
                                        <SearchIcon className="text-muted-foreground" />
                                </InputGroupAddon>
                        </InputGroup>
                </Field>
        )
}

const RentalType = () => {
        return (
                <div className='flex flex-col gap-3'>
                        <span className='text-sm font-semibold text-[#0B0B0B]'>
                                Rental Type
                        </span>
                        <div>

                        </div>
                </div>
        )
}

const AvaliableNowOnly = () => {
        return (
                <Field orientation="horizontal" className="w-full justify-between font-text">
                        <FieldLabel 
                                htmlFor="carAvailability" 
                                className='text-sm font-semibold text-[#0B0B0B]'
                        >
                                Available Now Only
                        </FieldLabel>
                        <Switch id="carAvailability" className='border border-solid border-[#D1D5DC] bg-[#D1D5DC] data-checked:bg-[#1A56DB]'/>
                </Field>
        )
}

const PriceRange = () => {

        const [ value, setValue ] = useState([22, 250])

        return (
                <Field className="w-full">
                        <FieldTitle className='text-sm font-semibold font-text text-[#0B0B0B]'>
                                Price Range
                        </FieldTitle>
                        <Slider
                                value={value}
                                onValueChange={(value) => setValue(value as [number, number])}
                                max={500}
                                min={1}
                                step={10}
                                className="mt-2 w-full"
                                aria-label="Price Range"
                        />
                        <FieldDescription className='flex justify-between items-center'>
                                <span className='text-xs font-normal text-[#6B7280]'>
                                        From $<span className="font-medium tabular-nums">{value[0]}</span>
                                </span>
                                <span className='text-xs font-normal text-[#6B7280]'>
                                        From $<span className="font-medium tabular-nums">{value[1]}</span>
                                </span>
                        </FieldDescription>
                </Field>
        )
}

const ListFilter = ({ filterTitle, content }: ListFilterProps ) => {
        return (
                <FieldGroup className="w-full gap-3">
                        <FieldTitle className='text-sm font-semibold font-text text-[#0B0B0B]'>
                                {filterTitle}
                        </FieldTitle>
                        <FieldGroup className="gap-2">
                                {content.map((item) => (
                                        <Field 
                                                key={item.id}
                                                orientation="horizontal"
                                        >
                                                <Checkbox id={item.id} />
                                                <FieldLabel
                                                        htmlFor={item.id}
                                                        className="font-normal text-sm font-text text-[#6B7280]"
                                                >
                                                        {item.title}
                                                </FieldLabel>
                                        </Field>
                                ))}
                        </FieldGroup>
                </FieldGroup>
        )
}

const PageMainContent = ({ content }: CarsCardProps ) => {
        return (
                <div className='bg-[#F4F6F9]'>
                        <div className='flex flex-wrap justify-between items-center gap-2.5 md:gap-10 py-2 px-2.5 md:px-10 bg-[#ffffff]'>
                                <div>
                                        <span className='text-base md:text-lg text-[#1F2937] font-semibold text-nowrap'>
                                                {content.length} vehicles available
                                        </span>
                                </div>
                                <div className='flex gap-2 items-center justify-between'>
                                        <span className='text-sm text-[#6B7280] font-normal text-nowrap'>
                                                Sort by
                                        </span>
                                        <CarsDataSort sortData={carsSortData}/>
                                </div>
                        </div>
                        <div className='p-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-5 mt-8'>
                                        {carsCardData ? carsCardData.map((item) => (
                                                <Fragment key={item.id}>
                                                        <CarCard content={item} />
                                                </Fragment>
                                        )) : <FeaturedCarsErrorMessage /> }
                                </div>
                        </div>
                </div>
        )
}

const CarsDataSort = ({ sortData }: CarsDataSortProps ) => {
        return (
                <Select>
                        <SelectTrigger className="w-full max-w-28 font-text">
                                <SelectValue placeholder="Default Sorting" />
                        </SelectTrigger>
                        <SelectContent>
                                <SelectGroup>
                                        <SelectLabel className="font-text">
                                                Sort by
                                        </SelectLabel>
                                        {sortData.map((data) => (
                                                <SelectItem 
                                                        key={data.id}
                                                        value={data.value}
                                                >
                                                        {data.label}
                                                </SelectItem>
                                        ))}
                                </SelectGroup>
                        </SelectContent>
                </Select>
        )
}
