'use client'

import { useTransition, Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
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
        Pagination,
        PaginationContent,
        PaginationItem,
        PaginationLink,
        PaginationNext,
        PaginationPrevious,
} from '@/components/ui/pagination'
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
        carsSortData, 
        carsTestData, 
        CarDataType
} from '@/constants/carsTestData'
import { 
        filterAndSortCars, 
        getPriceRange, 
        getUniqueVehicleTypes, 
        getUniqueSeats, 
        getUniqueTransmissions 
} from './util'
import { 
        parseFilterParams, 
        buildFilterParams, 
        toggleArrayParam 
} from './carsFilterUrl.utils'
import CarCard from '@/components/cars/carCard'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { SideBarProps } from './types'
import { CarCardSkeleton, CarCardSkeletonGrid } from '@/components/loading/carCardSkeleton'

const CARS_PER_PAGE = 9

export default function BrowseCarsComponentPage() {

        const searchParams = useSearchParams()
        const router = useRouter()
        const pathname = usePathname()

        const [isPending, startTransition] = useTransition()

        const filterParams = useMemo(() => parseFilterParams(searchParams), [searchParams])

        // Derive dynamic filter options from the full dataset
        const vehicleTypeOptions = useMemo(() => getUniqueVehicleTypes(carsTestData), [])
        const seatOptions = useMemo(() => getUniqueSeats(carsTestData), [])
        const transmissionOptions = useMemo(() => getUniqueTransmissions(carsTestData), [])

        // Price range boundaries shift when rental type changes
        const priceRange = useMemo(
                () => getPriceRange(carsTestData, filterParams.rentalType),
                [filterParams.rentalType]
        )

        // Effective price bounds — clamp to dataset range when unset
        const effectivePriceMin = filterParams.priceMin || priceRange.min
        const effectivePriceMax = filterParams.priceMax === 9999 ? priceRange.max : filterParams.priceMax

        const filteredCars = useMemo(
                () => filterAndSortCars(carsTestData, {
                        ...filterParams,
                        priceMin: effectivePriceMin,
                        priceMax: effectivePriceMax,
                }),
                [filterParams, effectivePriceMin, effectivePriceMax]
        )

        const updateParams = useCallback((
                updates: Parameters<typeof buildFilterParams>[1]
        ) => {
                startTransition(() => {
                        const params = buildFilterParams(new URLSearchParams(searchParams.toString()), updates)
                        router.push(`${pathname}?${params.toString()}`, { scroll: false })
                })
        }, [searchParams, router, pathname])

        const handleSearch = useDebouncedCallback((value: string) => {
                updateParams({ search: value })
        }, 350)

        const handleRentalType = (value: string) => {
                // Reset price range when rental type changes since boundaries differ
                updateParams({ rentalType: value, priceMin: '', priceMax: '' })
        }

        const handleAvailableOnly = (checked: boolean) => {
                updateParams({ availableOnly: checked })
        }

        const handlePriceRange = useDebouncedCallback((value: [number, number]) => {
                updateParams({ priceMin: value[0], priceMax: value[1] })
        }, 300)

        const handleCheckboxFilter = (
                key: 'vehicleTypes' | 'seats' | 'transmissions',
                value: string
        ) => {
                const current = filterParams[key]
                updateParams({ [key]: toggleArrayParam(current, value) })
        }

        const handleSort = (value: string) => {
                updateParams({ sort: value })
        }

        const handleResetAll = () => {
                router.push(pathname, { scroll: false })
        }

        return (
                <>
                        <NotificationBar/>
                        <div className='flex flex-col px-2.5 md:px-0 md:flex-row w-full'>
                                <SideBar
                                        filterParams={filterParams}
                                        priceRange={priceRange}
                                        effectivePriceMin={effectivePriceMin}
                                        effectivePriceMax={effectivePriceMax}
                                        vehicleTypeOptions={vehicleTypeOptions}
                                        seatOptions={seatOptions}
                                        transmissionOptions={transmissionOptions}
                                        onSearch={handleSearch}
                                        onRentalType={handleRentalType}
                                        onAvailableOnly={handleAvailableOnly}
                                        onPriceRange={handlePriceRange}
                                        onCheckboxFilter={handleCheckboxFilter}
                                        onResetAll={handleResetAll}
                                />
                                <PageMainContent
                                        cars={filteredCars}
                                        totalCount={filteredCars.length}
                                        currentSort={filterParams.sort}
                                        onSort={handleSort}
                                        isPending={isPending} 
                                />
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

const SideBar = ({
        filterParams, priceRange, effectivePriceMin, effectivePriceMax,
        vehicleTypeOptions, seatOptions, transmissionOptions,
        onSearch, onRentalType, onAvailableOnly, onPriceRange, onCheckboxFilter, onResetAll,
}: SideBarProps ) => {
        return (
                <div className='flex flex-col gap-6 md:max-w-90.5 w-full p-2.5 md:p-6 bg-white'>
                        <div className='flex justify-between items-center'>
                                <span className='text-lg text-[#0B0B0B] font-semibold'>
                                        Filter by
                                </span>
                                <span
                                        onClick={onResetAll}
                                        className='text-base text-[#1A56DB] font-medium cursor-pointer hover:underline'
                                >
                                        Reset all
                                </span>
                        </div>
                        <div>
                                <Searchbar defaultValue={filterParams.search} onChange={onSearch} />
                        </div>
                        <FieldSeparator />
                        <RentalType 
                                value={filterParams.rentalType} 
                                onChange={onRentalType} 
                        />
                        <FieldSeparator />
                        <AvailableNowOnly 
                                checked={filterParams.availableOnly} 
                                onChange={onAvailableOnly} 
                        />
                        <FieldSeparator />
                        <PriceRange
                                min={priceRange.min}
                                max={priceRange.max}
                                value={[effectivePriceMin, effectivePriceMax]}
                                onChange={onPriceRange}
                                rentalType={filterParams.rentalType}
                        />
                        <FieldSeparator />
                        <ListFilter
                                filterTitle="Vehicle Type"
                                content={vehicleTypeOptions}
                                selected={filterParams.vehicleTypes}
                                onChange={(value) => onCheckboxFilter('vehicleTypes', value)}
                        />
                        <FieldSeparator />
                        <ListFilter
                                filterTitle="Transmission"
                                content={transmissionOptions}
                                selected={filterParams.transmissions}
                                onChange={(value) => onCheckboxFilter('transmissions', value)}
                        />
                        <FieldSeparator />
                        <ListFilter
                                filterTitle="Seats"
                                content={seatOptions}
                                selected={filterParams.seats}
                                onChange={(value) => onCheckboxFilter('seats', value)}
                        />
                </div>
        )
}

const Searchbar = ({
        defaultValue,
        onChange,
}: {
        defaultValue: string
        onChange: (value: string) => void
}) => {
        // Local state so the input stays responsive while debounce fires to URL
        const [value, setValue] = useState(defaultValue)

        useEffect(() => { setValue(defaultValue) }, [defaultValue])

        return (
                <Field className="max-w-sm font-text text-sm font-normal">
                        <InputGroup className='rounded-[5px]'>
                                <InputGroupInput
                                        id="inline-start-input"
                                        placeholder="Search vehicles..."
                                        value={value}
                                        onChange={(e) => {
                                                setValue(e.target.value)
                                                onChange(e.target.value)
                                        }}
                                />
                                <InputGroupAddon align="inline-start">
                                        <SearchIcon className="text-muted-foreground" />
                                </InputGroupAddon>
                        </InputGroup>
                </Field>
        )
}

const RentalType = ({
        value,
        onChange,
}: {
        value: string
        onChange: (value: string) => void
}) => {
        const content = [
                { label: 'Any', value: 'any' },
                { label: 'Per day', value: 'per day' },
                { label: 'Per hour', value: 'per hour' },
                { label: 'Per week', value: 'per week' },
        ]

        return (
                <div className='flex flex-col gap-3'>
                        <span className='text-sm font-semibold text-[#0B0B0B]'>Rental Type</span>
                        <ToggleGroup
                                type='single'
                                size="sm"
                                value={value}  
                                onValueChange={(val) => { if (val) onChange(val) }}
                                variant="default"
                                spacing={2}
                        >
                                {content.map((item) => (
                                        <ToggleGroupItem value={item.value} key={item.value}>
                                                {item.label}
                                        </ToggleGroupItem>
                                ))}
                        </ToggleGroup>
                </div>
        )
}

const AvailableNowOnly = ({
        checked,
        onChange,
}: {
        checked: boolean
        onChange: (checked: boolean) => void
}) => {
        return (
                <Field orientation="horizontal" className="w-full justify-between font-text">
                        <FieldLabel htmlFor="carAvailability" className='text-sm font-semibold text-[#0B0B0B]'>
                                Available Now Only
                        </FieldLabel>
                        <Switch
                                id="carAvailability"
                                checked={checked}
                                onCheckedChange={onChange}
                                className='border border-solid border-[#D1D5DC] bg-[#D1D5DC] data-checked:bg-[#1A56DB]'
                        />
                </Field>
        )
}

const PriceRange = ({
        min,
        max,
        value,
        onChange,
        rentalType,
}: {
        min: number
        max: number
        value: [number, number]
        onChange: (value: [number, number]) => void
        rentalType: string
}) => {
        const [localValue, setLocalValue] = useState<[number, number]>(value)

        // Sync when rental type changes and URL resets price bounds
        useEffect(() => { setLocalValue(value) }, [value])

        const label = rentalType === 'per hour' ? '/hr' : rentalType === 'per week' ? '/wk' : '/day'

        return (
                <Field className="w-full">
                        <FieldTitle className='text-sm font-semibold font-text text-[#0B0B0B]'>
                                Price Range
                                <span className='ml-1 text-[#6B7280] font-normal'>{label}</span>
                        </FieldTitle>
                        <Slider
                                value={localValue}
                                onValueChange={(val) => {
                                        setLocalValue(val as [number, number])
                                        onChange(val as [number, number])
                                }}
                                max={max}
                                min={min}
                                step={1}
                                className="mt-2 w-full"
                                aria-label="Price Range"
                        />
                        <FieldDescription className='flex justify-between items-center'>
                                <span className='text-xs font-normal text-[#6B7280]'>
                                        From $<span className="font-medium tabular-nums">{localValue[0]}</span>
                                </span>
                                <span className='text-xs font-normal text-[#6B7280]'>
                                        To $<span className="font-medium tabular-nums">{localValue[1]}</span>
                                </span>
                        </FieldDescription>
                </Field>
        )
}

const ListFilter = ({
        filterTitle,
        content,
        selected,
        onChange,
}: {
        filterTitle: string
        content: { id: string; title: string }[]
        selected: string[]
        onChange: (value: string) => void
}) => {
        return (
                <FieldGroup className="w-full gap-3">
                        <FieldTitle className='text-sm font-semibold font-text text-[#0B0B0B]'>
                                {filterTitle}
                        </FieldTitle>
                        <FieldGroup className="gap-2">
                                {content.map((item) => (
                                        <Field key={item.id} orientation="horizontal">
                                                <Checkbox
                                                        id={item.id}
                                                        checked={selected.includes(item.title)}
                                                        onCheckedChange={() => onChange(item.title)}
                                                />
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

const PageMainContent = ({
        cars,
        totalCount,
        currentSort,
        onSort,
}: {
        cars: CarDataType[]
        totalCount: number
        currentSort: string
        onSort: (value: string) => void
        isPending: boolean
}) => {

        const searchParams = useSearchParams()
        const router = useRouter()
        const pathname = usePathname()

        const [isPending, startTransition] = useTransition()

        const currentPage = Number(searchParams.get('page') ?? 1)
        const totalPages = Math.ceil(totalCount / CARS_PER_PAGE)

        const paginatedCars = useMemo(() => {
                const start = (currentPage - 1) * CARS_PER_PAGE
                return cars.slice(start, start + CARS_PER_PAGE)
        }, [cars, currentPage])

        const createPageHref = useCallback((page: number) => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('page', String(page))
                return `${pathname}?${params.toString()}`
        }, [searchParams, pathname])

        const handlePageChange = (page: number) => {
                startTransition(() => {
                        router.push(createPageHref(page), { scroll: true })
                })
        }

        // Determine page number buttons to show — always show first, last, current ± 1
        const pageNumbers = useMemo(() => {
                const pages = new Set<number>()
                pages.add(1)
                pages.add(totalPages)
                pages.add(currentPage)
                if (currentPage > 1) pages.add(currentPage - 1)
                if (currentPage < totalPages) pages.add(currentPage + 1)
                return Array.from(pages).sort((a, b) => a - b)
        }, [currentPage, totalPages])

        return (
                <div className='w-full'>
                        <div className='flex flex-wrap justify-between items-center gap-2.5 md:gap-10 py-2 px-2.5 md:px-10 bg-white'>
                                <span className='text-base md:text-lg text-[#1F2937] font-semibold text-nowrap'>
                                        {isPending
                                                ? 'Filtering...'
                                                : `${totalCount} vehicle${totalCount !== 1 ? 's' : ''} available`
                                        }
                                </span>
                                <div className='flex gap-2 items-center justify-between'>
                                        <span className='text-sm text-[#6B7280] font-normal text-nowrap'>Sort by</span>
                                        <CarsDataSort
                                                sortData={carsSortData}
                                                value={currentSort}
                                                onChange={onSort}
                                        />
                                </div>
                        </div>
                        <div className='p-6 flex flex-col gap-8'>
                                {isPending ? (
                                        <CarCardSkeletonGrid count={CARS_PER_PAGE} />
                                ) : totalCount === 0 ? (
                                        <div className='flex flex-col items-center justify-center py-20 gap-3'>
                                                <span className='text-[#6B7280] text-base font-normal font-text'>
                                                        No vehicles match your filters.
                                                </span>
                                        </div>
                                ) : (
                                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-5 mt-8'>
                                                {paginatedCars.map((item) => (
                                                        <Fragment key={item.id}>
                                                                <CarCard
                                                                        slug={item.slug}
                                                                        featuredImage={item.featuredImage}
                                                                        carName={item.carName}
                                                                        specifications={item.specifications}
                                                                        dailyPrice={item.price.daily}
                                                                        averageRating={item.reviewsAndRatings.averageRating}
                                                                        totalRatings={item.reviewsAndRatings.totalRatings}
                                                                />
                                                        </Fragment>
                                                ))}
                                        </div>
                                )}

                                {/* Pagination */}
                                {!isPending && totalPages > 1 && (
                                        <Pagination>
                                                <PaginationContent>
                                                        {/* Previous */}
                                                        <PaginationItem>
                                                                <PaginationPrevious
                                                                        href={createPageHref(currentPage - 1)}
                                                                        onClick={(e) => {
                                                                                e.preventDefault()
                                                                                if (currentPage > 1) handlePageChange(currentPage - 1)
                                                                        }}
                                                                        aria-disabled={currentPage === 1}
                                                                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                                />
                                                        </PaginationItem>

                                                        {/* Page numbers with ellipsis */}
                                                        {pageNumbers.map((page, index) => {
                                                                const prev = pageNumbers[index - 1]
                                                                const showEllipsisBefore = prev && page - prev > 1

                                                                return (
                                                                        <Fragment key={page}>
                                                                                {showEllipsisBefore && (
                                                                                        <PaginationItem>
                                                                                                <span className='px-3 py-2 text-[#6B7280] text-sm'>
                                                                                                        …
                                                                                                </span>
                                                                                        </PaginationItem>
                                                                                )}
                                                                                <PaginationItem>
                                                                                        <PaginationLink
                                                                                                href={createPageHref(page)}
                                                                                                isActive={page === currentPage}
                                                                                                onClick={(e) => {
                                                                                                        e.preventDefault()
                                                                                                        handlePageChange(page)
                                                                                                }}
                                                                                                className='cursor-pointer'
                                                                                        >
                                                                                                {page}
                                                                                        </PaginationLink>
                                                                                </PaginationItem>
                                                                        </Fragment>
                                                                )
                                                        })}

                                                        {/* Next */}
                                                        <PaginationItem>
                                                                <PaginationNext
                                                                        href={createPageHref(currentPage + 1)}
                                                                        onClick={(e) => {
                                                                                e.preventDefault()
                                                                                if (currentPage < totalPages) handlePageChange(currentPage + 1)
                                                                        }}
                                                                        aria-disabled={currentPage === totalPages}
                                                                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                                />
                                                        </PaginationItem>
                                                </PaginationContent>
                                        </Pagination>
                                )}

                                {/* Page count label */}
                                {!isPending && totalPages > 1 && (
                                        <p className='text-center text-[#6B7280] text-xs font-normal font-text'>
                                                Page {currentPage} of {totalPages}
                                        </p>
                                )}
                        </div>
                </div>
        )
}

const CarsDataSort = ({
        sortData,
        value,
        onChange,
}: {
        sortData: { id: number; value: string; label: string }[]
        value: string
        onChange: (value: string) => void
}) => {
        return (
                <Select value={value} onValueChange={onChange}>
                        <SelectTrigger className="w-full max-w-40 font-text">
                                <SelectValue placeholder="Default Sorting" />
                        </SelectTrigger>
                        <SelectContent>
                                <SelectGroup>
                                        <SelectLabel className="font-text">Sort by</SelectLabel>
                                        {sortData.map((data) => (
                                                <SelectItem key={data.id} value={data.value}>
                                                        {data.label}
                                                </SelectItem>
                                        ))}
                                </SelectGroup>
                        </SelectContent>
                </Select>
        )
}