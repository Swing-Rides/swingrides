import React, { Fragment } from 'react'
import Image from 'next/image'
import { howItWorksContent, trustContent } from '@/constants/homePage';
import { carsCardData } from '@/constants/carsTestData';
import CarCard from '@/components/cars/carCard';
import Link from 'next/link';

type HowItWorksProps = {
        content: {
                number: number;
                title: string;
                body: string;
                imageUrl: string;
        }
}

type TrustContentProps = {
        content: {
                title: string;
                imageUrl: string;
        }
}

export default function HomePageComponent() {
        return (
                <div className='z-1'>
                        <HeroSection />
                        <OrderForm />
                        <NumberSection />
                        <HowItWorksSection />
                        <FeaturedCars />
                        <TrustSection />
                </div>
        )
}

const HeroSection = () => {
        return (
                <section className='relative overflow-clip'>
                        <div>
                                <Image
                                        src={"/images/swing-rides-homepage-hero-section.webp"}
                                        alt='Rent From Local Car Owners. Zero Commission.'
                                        title='Rent From Local Car Owners. Zero Commission.'
                                        width={1440}
                                        height={774}
                                        className='w-full min-h-110 object-cover'
                                />
                        </div>
                        <div className='absolute inset-0 size-full z-10 px-4 md:px-8'>
                                <div className='pt-25 md:pt-37.5 max-w-80 md:max-w-147.5 mx-auto text-center'>
                                        <h1 className='text-4xl md:text-[64px] text-white leading-[101.563%]'>
                                                <span className='text-[#1A56DB] font-sans'>Rent </span>From Local Car Owners. Zero <span className='text-[#1A56DB] font-sans'> Commission.</span>
                                        </h1>
                                        <p className='max-w-97.5 mx-auto mt-1.5 md:mt-4'>
                                                Pick your car, choose your dates, and hit the road. It takes less than 3 minutes.
                                        </p>
                                </div>
                        </div>
                </section>
        )
}

const OrderForm = () => {
        return (
                <div className='relative py-6 px-7 -mt-27.5 -mb-17.25 rounded bg-white max-w-240.5 min-h-44 mx-auto shadow-[0_-8px_60px_-12px_rgba(0,0,0,0.16)] z-10'>
                        <div className='text-center'>
                                The Form Comes Here
                        </div>
                </div>
        )
}

const NumberSection = () => {
        return (
                <section className='bg-[#F4F6F9] pt-32.5 pb-10 px-4 md:px-20 md:pt-44.25 md:pb-11.25'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto'>
                                <div className='max-w-70.25 col-span-1'>
                                        <h3 className='text-4xl md:text-[64px] text-[#333333] leading-[101.563%] text-center mx-auto md:mx-0 md:text-left'>
                                                <span className='text-[#1A56DB] font-sans'>The Numbers </span> Don&apos;t Lie
                                        </h3>
                                </div>
                                <div className='flex gap-6 col-span-2'>
                                        <div className='flex flex-col gap-6 max-w-102.5 w-full'>
                                                <NumberCard
                                                        number={`100+`}
                                                        label={`Vehicles Listed`}
                                                />
                                                <NumberCard
                                                        number={`4.9`}
                                                        label={`average rating`}
                                                />
                                        </div>

                                        <div className='flex flex-col gap-6 mt-0 md:mt-15 max-w-102.5 w-full'>
                                                <NumberCard
                                                        number={`500+`}
                                                        label={`Happy renters`}
                                                />
                                                <NumberCard
                                                        number={`10`}
                                                        label={`active hosts`}
                                                />
                                        </div>
                                </div>
                        </div>
                </section>
        )
}

const NumberCard = ({ number, label }: { number: string; label: string }) => {
        return (
                <div className='flex flex-col p-4 gap-10 md:gap-20 bg-white rounded aspect-41/18 max-w-102.5 w-full'>
                        <span className='text-[#1A56DB] font-medium text-3xl md:text-[56px] leading-[85.714%]'>
                                {number}
                        </span>
                        <span className='uppercase text-base text-[#6B7280] font-medium'>
                                {label}
                        </span>
                </div>
        )
}

const HowItWorksSection = () => {
        return (
                <section className='px-4 py-12.5 md:px-20 md:py-20 bg-[#F4F6F9] '>
                        <div className='flex flex-col gap-6 md:gap-15'>
                                <div className='flex flex-col gap-3.5 max-w-120 w-full mx-auto text-center'>
                                        <h3 className='text-4xl md:text-[64px]'>
                                                How it <span className='text-[#1A56DB] font-sans'>works</span>
                                        </h3>
                                        <p className='text-[#333333]'>
                                                Get on the road in three simple steps. No middlemen, no hassle.
                                        </p>
                                </div>
                                <div className='flex flex-col md:flex-row items-center gap-4 max-w-246 w-full mx-auto'>
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
                <div className='flex flex-col items-center max-w-79.5 rounded-xs bg-white text-center'>
                        <div>
                                <Image
                                        src={content.imageUrl}
                                        alt={content.title}
                                        title={content.title}
                                        width={253}
                                        height={199}
                                />
                        </div>
                        <div className='p-6 gap-3'>
                                <h4 className='px-2 py-1 text-[20px] text-[#1A56DB] font-text font-medium'>
                                        0{content.number}
                                </h4>
                                <p className='text-base leading-6'>
                                        <span className='text-[#0B0B0B] font-semibold'>{content.title} </span> <span className='text-[#6B7280] font-medium'>{content.body}</span>
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
                                        <h3 className='text-4xl md:text-[64px]'>
                                                Featured<span className='text-[#1A56DB] font-sans'> Cars</span>
                                        </h3>
                                        <p className='text-[#333333]'>
                                                Popular picks from verified local hosts
                                        </p>
                                </div>
                                <div>
                                        <div className='grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-5 mt-8'>
                                                {carsCardData ? carsCardData.map((item) => (
                                                        <Fragment key={item.id}>
                                                                <CarCard content={item} />
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

const FeaturedCarsErrorMessage = () => {
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
                <section className='px-4 py-12.5 md:px-20 md:py-20 bg-[#F4F6F9]'>
                        <div className='max-w-240 w-full mx-auto text-center'>
                                <div className='max-w-156 mx-auto'>
                                        <h3 className='text-4xl md:text-[64px]'>
                                                The smarter way to <span className='text-[#1A56DB] font-sans'> rent</span> and <span className='text-[#1A56DB] font-sans'> manage</span> your fleet
                                        </h3>
                                </div>
                                <div className='grid grid-cols-2'>
                                        {trustContent.map((items) => (
                                                <TrustCard
                                                        key={items.title}
                                                        content={items}
                                                />
                                        ))}
                                </div>
                        </div>
                </section>
        )
}

const TrustCard = ({ content }: TrustContentProps) => {
        return (
                <div className='flex flex-col items-center gap-6 p-12'>
                        <Image
                                src={content.imageUrl}
                                alt={content.title}
                                title={content.title}
                                width={80}
                                height={80}
                        />
                        <p className='text-[#1F2937]'>
                                {content.title}
                        </p>
                </div>
        )
}