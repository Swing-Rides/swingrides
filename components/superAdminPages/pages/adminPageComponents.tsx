import { ReactNode, Suspense } from 'react'
import PageIntro from '../dashboard/pageIntro'
import {
        ActiveSubscribersOverviewCardContent,
        RecurringRevenueOverviewCardContent,
        TotalRenterOverviewCardContent,
        ActiveRentalsOverviewCardContent,
        testDonutChartData
} from '@/constants/superAdminSidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { UsersDonutChart } from "../dashboard/dynamicImport";
import { SalesChart } from "../dashboard/dynamicImport";
import { CardIntro } from '../dashboard/cardIntro';
import { calcPercentageDiff } from '../utils/chart';
import { formatNumberToUSD } from '../utils/formatNumbertoUSD';
import { MonthlyRecurringRevenueChartData } from '@/constants/superAdminSidebar';

type OverviewCardProps = {
        icon: ReactNode
        title: string
        presentDayNumber: number    
        last30Days: number
        formatValue?: (n: number) => string 
        invertColors?: boolean           
}

export default function AdminPageComponents() {
        return (
                <div className='p-3 md:p-8'>
                        <div>
                                <PageIntro
                                        pageTitle='Platform Overview'
                                        pageDesc={`Here's what's happening across SwingRides today.`}
                                />

                                <div className='flex flex-wrap gap-4 mt-8'>
                                        <OverviewCard
                                                {...ActiveSubscribersOverviewCardContent}
                                        />

                                        <OverviewCard
                                                {...RecurringRevenueOverviewCardContent}
                                                formatValue={formatNumberToUSD}
                                        />

                                        <OverviewCard
                                                {...TotalRenterOverviewCardContent}
                                        />

                                        <OverviewCard
                                                {...ActiveRentalsOverviewCardContent}
                                        />
                                </div>

                                <div className='flex flex-wrap gap-4 my-4'>
                                        <div className='basis-183 grow p-3 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-6'>
                                                <SalesChart 
                                                        graphData={MonthlyRecurringRevenueChartData}
                                                />
                                        </div>
                                        <div className='basis-95 grow md:grow-0 p-3 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-6'>
                                                <div>
                                                        <CardIntro
                                                                title='Subscriber Distribution'
                                                                desc='Active plans breakdown'
                                                        />
                                                </div>
                                                <div>
                                                        <UsersDonutChart
                                                                chartData={testDonutChartData}
                                                        />
                                                </div>
                                        </div>
                                </div>

                                <div className='p-3 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-6'>
                                        <div className='flex justify-between items-center pb-6 border-b'>
                                                <CardIntro
                                                        title='Recent Activity'
                                                        desc='Latest platform events'
                                                />

                                                {/* <Link 
                                                        href={'/'}
                                                        className='text-blue-700 hover:text-blue-900 text-sm font-medium font-text leading-5 transition-colors duration-300'
                                                >
                                                        View all activity
                                                </Link> */}
                                        </div>
                                        <div>
                                                Table
                                        </div>
                                </div>
                        </div>
                </div>
        )
}


const OverviewCard = ({
        icon,
        title,
        presentDayNumber,
        last30Days,
        formatValue,
        invertColors = false,
}: OverviewCardProps) => {

        const { percentage, colorClass } = calcPercentageDiff(
                presentDayNumber,
                last30Days,
                { invertColors },
        )

        const displayValue = formatValue
                ? formatValue(presentDayNumber)
                : presentDayNumber.toLocaleString()

        return (
                <div className='basis-62.5 shrink-0 grow p-6 bg-white hover:bg-blue-100 hover:border-blue-200 transition-colors duration-300 rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2'>
                        <div>{icon}</div>
                        <div>
                                <span className="text-gray-500 text-xs font-semibold font-text uppercase">
                                        {title}
                                </span>
                        </div>
                        <Suspense fallback={<Skeleton className='w-20 h-10' />}>
                                <div>
                                        <span className="text-neutral-950 text-3xl font-medium font-text">
                                                {displayValue}
                                        </span>
                                </div>
                        </Suspense>
                        <Suspense fallback={<Skeleton className='w-30 h-4' />}>
                                <div>
                                        <span className={`text-xs font-semibold font-text ${colorClass}`}>
                                                {percentage} vs last month
                                        </span>
                                </div>
                        </Suspense>
                </div>
        )
}