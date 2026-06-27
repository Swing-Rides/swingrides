import React, { Fragment, ReactNode } from 'react'
import Image from 'next/image'
import { featureContent, howItWorksContent, trustContent, whyRentContent } from '@/constants/homePage';
import { carsTestData } from '@/constants/carsTestData';
import CarCard from '@/components/cars/carCard';
import Link from 'next/link';
import HomePageSearchForm from '@/components/forms/homePageSearchForm';
import { Check } from 'lucide-react';
import FAQsSection from '@/components/faqs';

type HowItWorksProps = {
        content: {
                number: number;
                title: string;
                body: string;
                icon: ReactNode;
                iconBgColor: string;
        }
}

type TrustContentProps = {
        content: {
                icon: ReactNode;
                title: string;
                description: string;
        }
}

export default function HomePageComponent() {
        return (
                <div className='z-1'>
                        <HeroSection />
                        <Skip />
                        <FeaturePillsBar />
                        <WhySwingRides />
                        <HowItWorksSection />
                        <FeaturedCars />
                        <TrustSection />
                        <FAQsSection />
                </div>
        )
}

const HeroSection = () => {

        const trustList = [ "No hidden fees", "Free cancellation options", "Secure payments", "Verified hosts" ]

        return (
                <section className='relative overflow-clip min-h-fit z-2'>
                        <div>
                                <Image
                                        src={"/images/swingRides-homepage.webp"}
                                        alt='Rent From Local Car Owners. Zero Commission.'
                                        title='Rent From Local Car Owners. Zero Commission.'
                                        width={1440}
                                        height={774}
                                        className='w-full min-h-dvh object-cover'
                                />
                        </div>
                        <div className='absolute inset-0 size-full z-10 px-4 md:px-8'>
                                <div className='pt-20 md:pt-37.5 max-w-80 md:max-w-7xl space-y-6'>
                                        <div className='space-y-5'>
                                                <h1 className='text-4xl md:text-6xl leading-16 font-black flex flex-col'>
                                                        <span className='text-neutral-950 font-sans'>Rent the perfect car,</span>
                                                        <span className='text-blue-700 font-sans'>your way.</span>
                                                </h1>
                                                <p className='max-w-125.75 w-full text-lg font-normal font-text'>
                                                        <span className='text-gray-600 block w-full'>
                                                                Discover cars from independent rental businesses near you.
                                                        </span>
                                                        <span className='text-neutral-950'>
                                                                Great cars. Local service. Better prices.
                                                        </span>
                                                </p>
                                        </div>
                                        <OrderForm />
                                        <div className='grid grid-cols-2 md:grid-cols-4 justify-start justify-self-start items-center gap-5'>
                                                {trustList.map((item) => (
                                                        <div 
                                                                key={item}
                                                                className='flex gap-1.5 items-center justify-start'
                                                        >
                                                                <div className='rounded-full bg-blue-700 size-4 flex items-center justify-center'>
                                                                        <Check className='size-2.5 text-white' />
                                                                </div>
                                                                <span className="text-gray-700 text-xs font-medium font-text leading-5">
                                                                        {item}
                                                                </span>
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        </div>
                </section>
        )
}

const OrderForm = () => {
        return (
                <div className='relative py-6 px-7 rounded bg-white max-w-243.5 min-h-44 shadow-[0_-8px_60px_-12px_rgba(0,0,0,0.16)] z-10'>
                        <HomePageSearchForm/>
                </div>
        )
}

const Skip = () => {
        return (
                <section className='relative px-4 md:px-20 -mt-7 z-9'>
                        <div className='max-w-202 p-5 border-l-4 border-blue-700 bg-indigo-50 rounded-xs overflow-hidden'>
                                <p className="text-blue-700 text-sm md:text-xl font-semibold font-text">
                                        Skip the big rental chains. Rent from trusted independent businesses near you.
                                </p>
                        </div>
                </section>
        )
}

const FeaturePillsBar = () => {
        return (
                <div className='max-w-7xl mx-auto mt-9 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 justify-center divide-x'>
                        {featureContent.map((item) => (
                                <div key={item.id} className="border-gray-200 border-t flex items-start justify-start py-7 px-8 gap-3">
                                        <div className="flex items-center justify-center py-0 px-2 size-9 rounded-[10px] bg-blue-50">
                                                {item.icon}
                                        </div>
                                        <div className="flex flex-col items-start gap-0.5">
                                                <h3 className="text-neutral-950 text-sm font-bold font-text leading-5">
                                                        {item.title}
                                                </h3>
                                                <p className="text-gray-500 text-xs font-normal font-text leading-4">
                                                        {item.label}
                                                </p>
                                        </div>
                                </div>
                        ))}
                </div>
        )
}

const WhySwingRides = () => {
        return (
                <section className='section-bg-gradient py-12 px-4 md:px-20 md:py-24'>
                        <div className='flex flex-col gap-6 md:gap-12 max-w-7xl mx-auto'>
                                <div className='max-w-135 mx-auto'>
                                        <h3 className='flex flex-col text-4xl md:text-6xl font-black leading-[101.563%] text-center'>
                                                <span className='text-neutral-950 font-sans'>
                                                        Why rent with 
                                                </span>
                                                <span className='text-blue-700 font-sans'>
                                                        Swingrides
                                                </span>
                                        </h3>
                                </div>
                                <div className='flex flex-wrap justify-center items-center gap-6'>
                                        {whyRentContent.map((item) => (
                                                <div 
                                                        key={item.title} 
                                                        className="basis-75 grow-0 shrink p-6 bg-white rounded-[10px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)] border border-gray-200 flex flex-col gap-3"
                                                >
                                                        <div className={`size-11 px-3 rounded-full flex justify-center items-center ${item.iconBgColor}`}>
                                                                {item.icon}
                                                        </div>
                                                        <h4 className="text-neutral-950 text-base font-bold font-text leading-6">
                                                                {item.title}
                                                        </h4>
                                                        <p className="text-gray-500 text-sm font-normal font-text leading-6">
                                                                {item.description}
                                                        </p>
                                                </div>
                                        ))}
                                </div>
                        </div>
                </section>
        )
}

const HowItWorksSection = () => {
        return (
                <section className='py-12 px-4 md:px-20 md:py-24 bg-slate-100' id='how-it-works' >
                        <div className='flex flex-col gap-6 md:gap-15'>
                                <div className='flex flex-col gap-3.5 max-w-120 w-full mx-auto text-center'>
                                        <h3 className='text-4xl md:text-[64px] font-black'>
                                                How it <span className='text-blue-700 font-sans'>works</span>
                                        </h3>
                                </div>
                                <div className='flex flex-wrap justify-center gap-6'>
                                        {howItWorksContent.map((item) => (
                                                <Fragment key={item.number}>
                                                        <HowItWorksCard
                                                                content={item}
                                                        />
                                                </Fragment>
                                        ))}
                                </div>
                        </div>
                </section>
        )
}

const HowItWorksCard = ({ content }: HowItWorksProps) => {
        return (
                <div className='flex flex-col items-center gap-15.5 py-6 basis-79.5 grow-0 shrink rounded-[10px] bg-white text-center'>
                        <div className={`size-16 px-4.5 rounded-full flex justify-center items-center ${content.iconBgColor}`}>
                                {content.icon}
                        </div>
                        <div className='flex flex-col px-6 gap-3'>
                                <h4 className='text-center text-blue-700 text-xl font-medium font-text leading-7'>
                                        0{content.number}
                                </h4>
                                <p className='text-base leading-6'>
                                        <span className='text-neutral-950 font-semibold'>{content.title} </span> <span className='text-gray-500 font-medium'>{content.body}</span>
                                </p>
                        </div>
                </div>
        )
}

const FeaturedCars = () => {
        return (
                <section className='px-4 py-12.5 md:px-20 md:py-20 bg-white'>
                        <div>
                                <div className='text-center'>
                                        <h3 className='text-4xl md:text-[64px] font-black'>
                                                Featured<span className='text-[#1A56DB] font-sans'> Cars</span>
                                        </h3>
                                        <p className='text-[#333333]'>
                                                Popular picks from verified local hosts
                                        </p>
                                </div>
                                <div>
                                        <div className='grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-5 mt-8'>
                                                {carsTestData ? carsTestData.slice(0, 6).map((item) => (
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
                                                )) : <FeaturedCarsErrorMessage /> }
                                        </div>                                        
                                </div>
                                <div className='flex justify-center mt-8'>
                                        <Link href={'/browse-cars'} title='Go to browser cars page'>
                                                <button className='py-3.5 px-8 text-base font-semibold rounded-xs border-solid border-[1.5px] border-[#1A56DB] text-[#1A56DB] bg-transparent hover:text-white hover:bg-[#1A56DB] transition-colors duration-300 cursor-pointer'>
                                                        View All Available Cars
                                                </button>
                                        </Link>
                                </div>
                        </div>
                </section>
        )
}

export const FeaturedCarsErrorMessage = () => {
        return (
                <div className='max-w-200 bg-[#6B7280] p-5 rounded-xs mx-auto mt-6'>
                        <p className='text-center text-red-700'>
                                No cars available at the moment. Please check back later.
                        </p>
                </div>
        )
}

const TrustSection = () => {
        return (
                <section className='px-4 py-10 md:px-20 section-bg-gradient'>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                                {trustContent.map((items) => (
                                        <TrustCard
                                                key={items.title}
                                                content={items}
                                        />
                                ))}
                        </div>
                </section>
        )
}

const TrustCard = ({ content }: TrustContentProps) => {
        return (
                <div className='basis-80 shrink grow-0 block space-y-3 md:flex items-center justify-start gap-3 p-3 md:p-8'>
                        <div className='size-9 px-2 bg-white rounded-[10px] border border-slate-200 flex justify-center items-center m-0'>
                                {content.icon}
                        </div>
                        <div className='flex flex-col'>
                                <p className='text-neutral-950 text-sm font-bold font-text leading-5'>
                                        {content.title}
                                </p>
                                <span className='text-gray-500 text-xs font-normal font-text leading-4'>
                                        {content.description}
                                </span>
                        </div>
                </div>
        )
}
