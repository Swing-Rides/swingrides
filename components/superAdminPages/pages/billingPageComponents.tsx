import { ReactNode, Suspense } from 'react'
import PageWrapper from '../dashboard/pageWrapper'
import { SalesChart, RevenueByPlanChart } from '../dashboard/dynamicImport';
import { CardIntro } from '../dashboard/cardIntro';
import { Skeleton } from '@/components/ui/skeleton'
import {
        MonthlyRevenueBillingOverviewCardContent,
        AnnualRevenueBillingOverviewCardContent,
        FailedPaymentsBillingOverviewCardContent,
        ChurnRateBillingOverviewCardContent
} from '@/constants/superAdminSidebar';
import { formatNumberToUSD } from '../utils/formatNumbertoUSD';
import { calcPercentageDiff } from '../utils/chart';
import { MonthlyRecurringRevenueChartData } from '@/constants/superAdminSidebar';

type OverviewCardProps = {
        icon: ReactNode
        title: string
        presentDayNumber: number          // always raw number
        last30Days: number
        formatValue?: (n: number) => string   // optional display formatter
        invertColors?: boolean            // true for churn rate, failed payments
}


export default function BillingPageComponents() {
        return (
                <PageWrapper
                        pageTitle='Billing'
                        pageDescription='Platform-wide subscription revenue and payment activity'
                >
                        <div>
                                <div className='flex flex-wrap gap-4 mt-8'>
                                        <OverviewCard
                                                {...MonthlyRevenueBillingOverviewCardContent}
                                                formatValue={formatNumberToUSD}
                                        />

                                        <OverviewCard
                                                {...AnnualRevenueBillingOverviewCardContent}
                                                formatValue={formatNumberToUSD}
                                        />

                                        <OverviewCard
                                                {...FailedPaymentsBillingOverviewCardContent}
                                                invertColors
                                        />

                                        <OverviewCard
                                                {...ChurnRateBillingOverviewCardContent}
                                                formatValue={(n) => `${n}%`}
                                                invertColors
                                        />
                                </div>

                                <div className='flex flex-wrap gap-4 my-4'>
                                        <div className='basis-183 grow p-3 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-6'>
                                                <SalesChart 
                                                        graphData={MonthlyRecurringRevenueChartData}
                                                />
                                        </div>
                                        <div className='basis-95 grow md:grow-0 p-3 md:p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-6'>
                                                <div className='flex flex-col gap-3 md:gap-6'>
                                                        <CardIntro
                                                                title='Revenue by Plan'
                                                                desc='Monthly revenue breakdown by subscription tier'
                                                        />
                                                        <RevenueByPlanChart/>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </PageWrapper>
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