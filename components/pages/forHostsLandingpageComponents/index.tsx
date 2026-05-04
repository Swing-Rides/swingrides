import { Fragment, Suspense } from 'react'
import { PriBtn } from '@/components/buttons'
import Image from 'next/image'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger , TabsContent } from '@/components/ui/tabs'
import { TabContentProps } from './types'
import { bookingContent, fleetManagementContent, financesContent, maintenanceContent, reportsContent, pricingContents } from '@/constants/forHostPageContents'
import { Skeleton } from '@/components/ui/skeleton'
import PriceSection from './priceSection'


export default function ForHostLandingPage() {
        return (
                <>
                        <HeroSection/>
                        <NumberSection/>
                        <HowItWork />
                        <EverythingYouNeedSection />
                        <PriceSection 
                                pricingContents={pricingContents}
                        />
                </>
        )
}

const HeroSection = () => {
        return (
                <section className='section-bg-gradaint'>
                        <div className='mx-auto py-12 px-2.5'>
                                <div className='flex flex-col items-center gap-5 max-w-157.25 mx-auto'>
                                        <Pill 
                                                label='For Car Owners & Fleet Operators'
                                        />
                                        <h2 className='text-6xl text-center font-normal leading-16.25'>
                                                YOUR <span className="text-blue-700 font-sans"> CAR.</span> <br/>
                                                <span className=" text-blue-700 font-sans">YOUR EARNINGS.</span> <br />
                                                <span className="text-blue-700 font-sans">ZERO </span>COMMISSION<span className="text-blue-700 font-sans">.</span>
                                        </h2>
                                        <p className='text-center'>
                                                List your vehicles on SwingRides and keep 100% of every rental. Manage your fleet, bookings, and finances from one powerful dashboard.
                                        </p>
                                        <div className='flex gap-3 items-center justify-center'>
                                                <PriBtn
                                                        btn={{
                                                                link: '/us/host',
                                                                label: 'List Your Car'
                                                        }}
                                                />
                                                <Link
                                                        href={'/us/host/register'}
                                                        title={'Log in'}
                                                >
                                                        <button
                                                                className='py-2 px-6 rounded-xs border text-[#0891B2] border-[#0891B2] bg-transparent hover:bg-[#0891B2] hover:text-white transition-colors duration-300 cursor-pointer'
                                                        >
                                                                Log In
                                                        </button>
                                                </Link> 
                                        </div>
                                </div>
                                <div>
                                        <Image 
                                                src={'/images/for-host-dashboard.png'}
                                                alt={'List your vehicles on SwingRides and keep 100% of every rental'}
                                                title={'List your vehicles on SwingRides and keep 100% of every rental'}
                                                width={1160}
                                                height={919}
                                                className='max-w-300 w-full mx-auto'
                                        />
                                </div>
                        </div>
                </section>
        )
}

const NumberSection = () => {
        
        const contentLeft = [
                {
                        number: '0%',
                        title: 'Commission',
                        desc: 'Competitors take up to 33% of every rental. On SwingRides, you keep every Dollar you earn.',
                },
                {
                        number: '4.9',
                        title: 'Average Host Rating',
                        desc: 'Our verification system keeps your fleet filled with quality, trusted renters only.',
                },
        ]

        const contentRight = [
                {
                        number: '40',
                        title: 'Max Vehicles',
                        desc: 'Scale from a single car to a full fleet of 40 vehicles — all under one dashboard.',
                },
                {
                        number: '$50K+',
                        title: 'Avg Monthly Earnings',
                        desc: 'Top hosts on SwingRides earn over ₦500,000 monthly across their fleet.',
                },
        ]

        return (
                <section className='section-bg-gradaint px-4 py-12.5 md:px-20 md:py-20 '>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto'>
                                <div className='col-span-1'>
                                        <Pill 
                                                label='Why Hosts Choose SwingRides'
                                        />
                                        <h2 className='text-6xl font-bold leading-16.25'>
                                                <span className="text-blue-700 font-sans">The Numbers</span> <br />
                                                Don&apos;t Lie
                                        </h2>
                                </div>
                                <div className='col-span-2 gap-6 grid md:grid-cols-2'>
                                        <div className='flex flex-col gap-6 max-w-102.5 w-full'>
                                                {contentLeft.map(( item ) => (
                                                        <Fragment key={item.number}>
                                                                <NumberCard 
                                                                        number={item.number}
                                                                        title={item.title}
                                                                        desc={item.desc}
                                                                />
                                                        </Fragment>
                                                ))}
                                        </div>
                                        <div className='flex flex-col gap-6 mt-0 md:mt-15 max-w-102.5 w-full'>
                                                {contentRight.map(( item ) => (
                                                        <Fragment key={item.number}>
                                                                <NumberCard 
                                                                        number={item.number}
                                                                        title={item.title}
                                                                        desc={item.desc}
                                                                />
                                                        </Fragment>
                                                ))}
                                        </div>
                                </div>
                        </div>
                </section>
        )
}

const HowItWork = () => {

        const content: HowItWorksCardProps[] = [
                {
                        image: {
                                src: '/images/sign-up-and-subscribe.webp',
                                alt: 'Sign Up & Subscribe.',
                        },
                        number: '01',
                        title: 'Sign Up & Subscribe.',
                        desc: 'Create your host account and pick a subscription plan that fits your fleet size.',
                },
                {
                        image: {
                                src: '/images/list-your-vehicle.webp',
                                alt: 'List Your Vehicle.',
                        },
                        number: '02',
                        title: 'List Your Vehicle.',
                        desc: 'Add your cars with photos, daily rates, and availability. Set your own prices. Your vehicles go live on the SwingRides renter portal immediately.',
                },
                {
                        image: {
                                src: '/images/get-booked-and-paid.webp',
                                alt: 'Get Booked & Paid.',
                        },
                        number: '03',
                        title: 'Get Booked & Paid.',
                        desc: 'Renters book directly. You get notified, confirm via the dashboard, and receive payment straight — zero commission deducted, ever.',
                },
        ]
        
        return (
                <section className='section-bg-gradaint'>
                        <div className='px-4 py-12.5 md:px-20 md:py-20 space-y-10.5'>
                                <div className='flex flex-col items-center max-w-120 mx-auto'>
                                        <Pill 
                                                label='Getting Started'
                                        />
                                        <h3 className='text-6xl font-bold leading-16.25 mt-5 mb-4'>
                                                How It <span className='text-[#1A56DB] font-sans'> Works</span>
                                        </h3>
                                        <span className="text-center text-[#333333] text-lg font-medium font-text">
                                                Start earning in three simple steps. No middlemen, no commission cuts, no complications.
                                        </span>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 max-w-246 mx-auto'>
                                        {content.map((item) => (
                                                <Fragment key={item.number}>
                                                        <HowItWorksCard 
                                                                {...item}
                                                        />
                                                </Fragment>
                                        ))}
                                </div>
                        </div>
                </section>
        )
}

type HowItWorksCardProps = {
        image: {
                src: string;
                alt: string;
        };
        number: string;
        title: string;
        desc: string;
}

const HowItWorksCard = ({ image, number, title, desc }: HowItWorksCardProps ) => {
        return (
                <div className='divide-y bg-white rounded-xs overflow-clip'>
                        <div className='overflow-clip rounded-xs aspect-320/200 object-cover'>
                                <Image 
                                        src={image.src}
                                        alt={image.alt}
                                        title={image.alt}
                                        width={320}
                                        height={200}
                                        className='size-full aspect-320/200 object-cover'
                                />
                        </div>
                        <div className='p-6 space-y-3 text-center'>
                                <h4 className='text-[#1A56DB] text-xl font-medium font-text leading-7'>
                                        {number}
                                </h4>
                                <span className='text-[#6B7280] font-medium font-text leading-6'>
                                        <span className='text-[#0B0B0B] font-semibold'>{title} </span>{desc}
                                </span>
                        </div>
                </div>
        )
}

const EverythingYouNeedSection = () => {

        const content = [
                {
                        value: 'fleet-management',
                        label: 'Fleet Management',
                },
                {
                        value: 'bookings',
                        label: 'Bookings',
                },
                {
                        value: 'finances',
                        label: 'Finances',
                },
                {
                        value: 'maintenance',
                        label: 'Maintenance',
                },
                {
                        value: 'reports',
                        label: 'Reports',
                },
        ]

        return (
                <section className='section-bg-gradaint'>
                        <div className='px-4 py-12.5 md:px-20 md:py-20 space-y-10.5'>
                                <div className='flex flex-col items-start max-w-120'>
                                        <Pill
                                                label='Dashboard Features'
                                        />
                                        <h3 className='text-6xl font-bold leading-16.25 mt-5 mb-4'>
                                                EVERYTHING YOU <br/><span className='text-[#1A56DB] font-sans'> NEED</span> TO RUN YOUR FLEET
                                        </h3>
                                        <span className="text-left text-[#333333] text-lg font-medium font-text">
                                                One dashboard. Every tool you need to manage, monitor, and grow your car rental business.
                                        </span>
                                </div>
                                <div className='flex justify-center mt-5 md:mt-17.5'>
                                        <Tabs 
                                                defaultValue='fleet-management'
                                                className='justify-center items-center'
                                        >
                                                <TabsList
                                                        className='divide-x py-6.25 border-y-2 rounded-none bg-transparent overflow-clip'
                                                >
                                                        {content.map(( item ) => (
                                                                <div key={item.value}>
                                                                        <TabsTrigger 
                                                                                value={item.value}
                                                                                className='text-center text-[#333333] data-active:text-[#1A56DB] bg-transparent data-active:bg-transparent text-base font-semibold font-text px-12.5 py-6.25 rounded-none cursor-pointer divide-x-[#6B7280] opacity-30 data-active:opacity-100 transition-colors duration-300'
                                                                        >
                                                                                {item.label}
                                                                        </TabsTrigger>
                                                                </div>
                                                        ))}
                                                </TabsList>

                                                <TabsContent 
                                                       value="fleet-management"
                                                       className='mt-5 md:mt-12.5'
                                                >
                                                        <TabContent 
                                                                {...fleetManagementContent}
                                                        />
                                                </TabsContent>
                                                <TabsContent 
                                                       value="bookings"
                                                       className='mt-5 md:mt-12.5'
                                                >
                                                        <TabContent 
                                                                {...bookingContent}
                                                        />
                                                </TabsContent>
                                                <TabsContent 
                                                        value="finances"
                                                       className='mt-5 md:mt-12.5'
                                                >
                                                        <TabContent 
                                                                {...financesContent}
                                                        />
                                                </TabsContent>
                                                <TabsContent 
                                                        value="maintenance"
                                                       className='mt-5 md:mt-12.5'
                                                >
                                                        <TabContent 
                                                                {...maintenanceContent}
                                                        />
                                                </TabsContent>
                                                <TabsContent 
                                                        value="reports"
                                                       className='mt-5 md:mt-12.5'
                                                >
                                                        <TabContent 
                                                                {...reportsContent}
                                                        />
                                                </TabsContent>
                                        </Tabs>
                                </div>
                        </div>
                </section>
        )
}

export const Pill = ({ label }: { label: string; } ) => {
        return (
                <div
                        className='mb-5 py-1 px-3 w-fit flex gap-2.5 items-center border border-[#1A56DB] bg-[#DCE6FB] rounded-full'
                >
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="3" cy="3" r="3" fill="#1A56DB" />
                        </svg>
                        <span className="text-[#1A56DB] text-xs font-semibold font-text uppercase leading-4 text-nowrap">
                                {label}
                        </span>
                </div>
        )
}

type NumberCardProps = {
        number: string;
        title: string;
        desc: string;
}

const NumberCard = ({ number, title, desc }: NumberCardProps ) => {
        return (
                <div className='p-4 bg-white rounded flex flex-col gap-10.5 overflow-hidden'>
                        <div>
                                <span className='justify-start text-[#1A56DB] text-6xl font-bold font-text leading-12'>
                                        {number}
                                </span>
                        </div>
                        <div className='flex flex-col gap-3'>
                                <h3 className='text-[#6B7280] text-xl font-medium font-text uppercase'>
                                        {title}
                                </h3>
                                <span className="text-[#333333] text-base font-medium font-text leading-5">
                                        {desc}
                                </span>
                        </div>
                </div>
        )
}

const TabContent = ({ image, content }: TabContentProps) => {

        return (
                <div className='flex flex-col md:flex-row gap-15.5'>
                        <div>
                                <Suspense
                                        fallback={<Skeleton className="size-full min-w-50 aspect-630/508" />}
                                >
                                        <Image
                                                src={image.src}
                                                alt={image.alt}
                                                title={image.alt}
                                                width={630}
                                                height={508}
                                                className='size-full aspect-630/508 object-cover'
                                        />
                                </Suspense>
                        </div>
                        <div>
                                <div className='grid gap-10'>
                                        {content.map(( item ) => (
                                                <div 
                                                        key={item.label}
                                                        className='flex items-center justify-start gap-3 bg-white border-l-[6px] border-l-[#1A56DB] py-5.5 px-7.5 rounded-[8px]'
                                                >
                                                        {item.icon}
                                                        <span>
                                                                {item.label}
                                                        </span>
                                                </div>
                                        ))}
                                </div>
                        </div>
                </div>
        )
}