"use client"

import { Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageWrapper from "../../dashboard/pageWrapper";
import Link from "next/link";
import { HOST_DASHBOARD_PATH } from "@/constants/constant";
import AllBookingsTable, { BookingRecordsRow } from './allBookingsTable';
import UpcomingBookingsRecordsTable, { UpcomingBookingRecordsRow } from './upcomingRecordsTable';
import LateReturnsTable, { LateReturnsTableRow } from './lateReturnsTable';
import DamageAlertTable, { DamageAlertTableRow } from './damageAlertTable';

const MOCK_BOOKING_DATA: BookingRecordsRow[] = [
        { id: "BK-901", vehicle: "Tesla Model 3", renter: "Alexander Pierce", pickupDate: "2026-06-21", returnDate: "2026-06-24", duration: "3 days", amount: "$450.00", status: "active" },
        { id: "BK-902", vehicle: "BMW X5", renter: "Sarah Jenkins", pickupDate: "2026-06-25", returnDate: "2026-06-30", duration: "5 days", amount: "$900.00", status: "reserved" },
        { id: "BK-903", vehicle: "Audi A4", renter: "Michael Chen", pickupDate: "2026-07-01", returnDate: "2026-07-05", duration: "4 days", amount: "$600.00", status: "confirmed" },
        { id: "BK-904", vehicle: "Honda Accord", renter: "David Smith", pickupDate: "2026-06-15", returnDate: "2026-06-18", duration: "3 days", amount: "$300.00", status: "completed" },
        { id: "BK-905", vehicle: "Toyota RAV4", renter: "Elena Rodriguez", pickupDate: "2026-06-10", returnDate: "2026-06-12", duration: "2 days", amount: "$200.00", status: "noShow" },
        { id: "BK-906", vehicle: "Ford F-150", renter: "Jordan Taylor", pickupDate: "2026-06-22", returnDate: "2026-06-25", duration: "3 days", amount: "$480.00", status: "confirmed" },
        { id: "BK-907", vehicle: "Porsche 911", renter: "Samantha Reed", pickupDate: "2026-07-10", returnDate: "2026-07-12", duration: "2 days", amount: "$800.00", status: "reserved" },
        { id: "BK-908", vehicle: "Nissan Rogue", renter: "Olivia Martinez", pickupDate: "2026-06-01", returnDate: "2026-06-05", duration: "4 days", amount: "$350.00", status: "completed" }
];

const MOCK_UPCOMING_BOOKING_DATA: UpcomingBookingRecordsRow[] = [
        { id: "UB-001", vehicle: "Tesla Model 3", renter: "Alexander Pierce", returnDate: "2026-06-21", returnStatus: "dueToday", amount: "$450.00" },
        { id: "UB-002", vehicle: "BMW X5", renter: "Sarah Jenkins", returnDate: "2026-06-22", returnStatus: "dueTomorrow", amount: "$900.00" },
        { id: "UB-003", vehicle: "Audi A4", renter: "Michael Chen", returnDate: "2026-06-20", returnStatus: "overdue", amount: "$600.00" },
        { id: "UB-004", vehicle: "Honda Accord", renter: "David Smith", returnDate: "2026-07-05", returnStatus: "notSoon", amount: "$300.00" },
        { id: "UB-005", vehicle: "Toyota RAV4", renter: "Elena Rodriguez", returnDate: "2026-06-21", returnStatus: "dueToday", amount: "$200.00" },
        { id: "UB-006", vehicle: "Ford F-150", renter: "Jordan Taylor", returnDate: "2026-06-22", returnStatus: "dueTomorrow", amount: "$480.00" },
        { id: "UB-007", vehicle: "Porsche 911", renter: "Samantha Reed", returnDate: "2026-06-19", returnStatus: "overdue", amount: "$800.00" },
        { id: "UB-008", vehicle: "Nissan Rogue", renter: "Olivia Martinez", returnDate: "2026-07-15", returnStatus: "notSoon", amount: "$350.00" },
        { id: "UB-009", vehicle: "Tesla Model S", renter: "Thomas Müller", returnDate: "2026-06-21", returnStatus: "dueToday", amount: "$550.00" }
];

const MOCK_LATE_RETURN_DATA: LateReturnsTableRow[] = [
        {
                id: "LR-001",
                vehicle: "Audi A4",
                renter: "Michael Chen",
                returnDate: "2026-06-20",
                returnStatus: "lateReturn",
                renterPhoneNumber: "+1-555-010-2345"
        },
        {
                id: "LR-002",
                vehicle: "Porsche 911",
                renter: "Samantha Reed",
                returnDate: "2026-06-19",
                returnStatus: "lateReturn",
                renterPhoneNumber: "+1-555-019-8765"
        },
        {
                id: "LR-003",
                vehicle: "BMW M4",
                renter: "Julian Vane",
                returnDate: "2026-06-18",
                returnStatus: "lateReturn",
                renterPhoneNumber: "+1-555-012-3344"
        }
];

const MOCK_DAMAGE_ALERT_DATA: DamageAlertTableRow[] = [
        { id: "DA-001", vehicle: "Tesla Model 3", damageType: "Front Bumper Scratch", renter: "Alexander Pierce", reportedDate: "2026-06-20", status: "damageReported" },
        { id: "DA-002", vehicle: "BMW X5", damageType: "Windshield Crack", renter: "Sarah Jenkins", reportedDate: "2026-06-19", status: "damageReported" },
        { id: "DA-003", vehicle: "Toyota RAV4", damageType: "Rear Panel Dent", renter: "Elena Rodriguez", reportedDate: "2026-06-18", status: "damageReported" },
        { id: "DA-004", vehicle: "Ford F-150", damageType: "Tire Puncture", renter: "Jordan Taylor", reportedDate: "2026-06-17", status: "damageReported" },
        { id: "DA-005", vehicle: "Audi A4", damageType: "Side Mirror Damage", renter: "Michael Chen", reportedDate: "2026-06-16", status: "damageReported" }
];

export default function BookingsPageComponents() {
        return (
                <PageWrapper
                        pageTitle="Bookings"
                        pageDescription="Manage all your rentals and reservations"
                        pageButton={<PageButton />}
                >
                        <div className="mt-4 md:mt-8 space-y-5">
                                <div className="flex flex-wrap items-center gap-4">
                                        <OverviewCard 
                                                title="Total Bookings"
                                                number="216"
                                                numberColor="text-neutral-950"
                                                label="All time"
                                        />
                                        <OverviewCard 
                                                title="Active"
                                                number="42"
                                                numberColor="text-emerald-500"
                                                label="Currently rented"
                                        />
                                        <OverviewCard 
                                                title="Pending"
                                                number="18"
                                                numberColor="text-amber-500"
                                                label="Awaiting confirmation"
                                        />
                                        <OverviewCard 
                                                title="Completed"
                                                number="148"
                                                numberColor="text-gray-500"
                                                label="This month"
                                        />
                                        <OverviewCard 
                                                title="Revenue MTD"
                                                number="$24,500"
                                                numberColor="text-emerald-500"
                                                label="This month"
                                        />
                                </div>
                                <div>
                                        <Suspense>
                                                <BookingPageTab/>
                                        </Suspense>
                                </div>
                        </div>
                </PageWrapper>
        )
}

const PageButton = () => {
        return (
                <Link
                        href={`${HOST_DASHBOARD_PATH}bookings/new-booking`}
                        className="px-6 py-2 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300"
                >
                        New Booking
                </Link>
        )
}

type OverviewCardProps = {
        title: string;
        number: string;
        numberColor: string;
        label: string;
}

const OverviewCard = ({ title, number, numberColor, label }: OverviewCardProps) => {
        return (
                <div className="basis-62.5 shrink-0 grow p-4 md:p-6 bg-white rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
                        <div>
                                <span className="text-gray-500 text-xs font-semibold font-text uppercase">
                                        {title}
                                </span>
                        </div>
                        <div className="self-stretch h-9 relative">
                                <span className={`text-3xl font-medium font-text ${numberColor}`}>
                                        {number}
                                </span>
                        </div>
                        <div>
                                <span className="justify-start text-gray-500 text-xs font-normal font-text">
                                        {label}
                                </span>
                        </div>
                </div>
        )
}

const bookingsTabTitle = [
        { value: 'allBookings', title: 'All Bookings' },
        { value: 'upcomingReturns', title: 'Upcoming Returns' },
        { value: 'lateReturns', title: 'Late Returns' },
        { value: 'damageAlerts', title: 'Damage Alerts' },
]

const BookingPageTab = () => {
        
        const router = useRouter()
        const pathname = usePathname()
        const searchParams = useSearchParams()

        const activeTab = searchParams.get('tab') ?? 'allBookings'

        const handleTabChange = (value: string) => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('tab', value)
                router.push(`${pathname}?${params.toString()}`)
        }
        
        return (
                <Tabs
                        value={activeTab}
                        onValueChange={handleTabChange}
                        className='w-full space-y-4 md:space-y-6'
                >
                        <TabsList
                                variant='line'
                                className='gap-20 border-b-2'
                        >
                                {bookingsTabTitle.map((item) => (
                                        <TabsTrigger
                                                key={item.value}
                                                value={item.value}
                                                className='flex gap-2 item-center justify-start data-[state=active]:text-blue-700 group-data-[variant=line]/tabs-list:data-active:after:bg-blue-700 cursor-pointer'
                                        >
                                                {item.title}
                                        </TabsTrigger>
                                ))}
                        </TabsList>
                        <TabsContent value='allBookings'>
                                <AllBookingsTable tableData={MOCK_BOOKING_DATA} />
                        </TabsContent>
                        <TabsContent value='upcomingReturns'>
                                <UpcomingBookingsRecordsTable tableData={MOCK_UPCOMING_BOOKING_DATA} />
                        </TabsContent>
                        <TabsContent value='lateReturns'>
                                <LateReturnsTable tableData={MOCK_LATE_RETURN_DATA} />
                        </TabsContent>
                        <TabsContent value='damageAlerts'>
                                <DamageAlertTable tableData={MOCK_DAMAGE_ALERT_DATA} />
                        </TabsContent>
                </Tabs>
        )
}