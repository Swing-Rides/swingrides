import Image from "next/image"
import { ListProps } from "../connectToHostPage"
import { Fragment } from "react/jsx-runtime"
import FAQsSection from '@/components/faqs';
import { Compass } from "lucide-react";
import Link from "next/link";

const NumberContent = [
        {
                id: `300+`,
                label: `Vehicles Listed`,
        },
        {
                id: `90+`,
                label: `Happy Renters`,
        },
        {
                id: 50,
                label: `Active Hosts`,
        },
        {
                id: 4.9,
                label: `Average Rating`,
        },
]

export default function AboutPageComponents() {
        return (
                <>
                        <HeroSection/>
                        <BestRentalSection/>
                        <NumberSection/>
                        <OurStorySection />
                        <FAQsSection />
                </>
        )
}

const HeroSection = () => {
        return (
                <section className='relative overflow-clip min-h-fit z-2'>
                                        <div>
                                                <Image
                                                        src={"/images/to-rent-cars.png"}
                                                        alt={`We' re building a better way, to rent cars..`}
                                                        title={`We' re building a better way, to rent cars..`}
                                                        width={1441}
                                                        height={579}
                                                        className='w-full min-h-[70dvh] object-cover'
                                                />
                                        </div>
                                        <div className='absolute inset-0 size-full z-10 px-4 md:px-8 flex items-center'>
                                                <div className='py-20 md:py-37.5 md:max-w-7xl space-y-6'>
                                                        <div className='space-y-5'>
                                                                <span className="block text-blue-700 text-sm font-semibold font-text">
                                                                        WHO WE ARE
                                                                </span>
                                                                <h1 className='text-4xl md:text-6xl leading-16 font-black max-w-148'>
                                                                        <span className='text-neutral-950 font-sans'>We&apos;re building a better</span>{' '}
                                                                        <span className='text-blue-700 font-sans'>way to rent cars.</span>
                                                                </h1>
                                                                <p className='max-w-148 w-full text-lg font-normal font-text text-gray-600'>
                                                                        SwingRides connects you with trusted independent rental businesses so you can enjoy quality cars, great service, and real value.
                                                                </p>
                                                        </div>
                                                </div>
                                        </div>
                                </section>
        )
}

const BestRentalSection = () => {
        return (
                <section className="relative px-4 pt-20 pb-33">
                        <div className="absolute top-0 left-0">
                                <Image
                                        src={'/images/Hennessey-VelociRaptoR-1000-Ford-Raptor-R-Red-2.png'}
                                        alt="TOOLS FOR HOW REAL FLEETS RUN"
                                        title="TOOLS FOR HOW REAL FLEETS RUN"
                                        width={317}
                                        height={317} 
                                />
                        </div>
                        <div className="space-y-5">
                                <h3 className="w-full max-w-170 mx-auto text-center text-neutral-950 text-4xl md:text-7xl font-black">
                                        THE BEST RENTAL EXPERIENCES COME FROM PEOPLE WHO  <span className='text-blue-700 font-sans'>TAKE PRIDE </span>IN THEIR VEHICLES.
                                </h3>
                                <p className="max-w-159.25 mx-auto text-center text-[#333333] text-lg font-normal leading-7">
                                        We&apos;ve seen it thousands of times. A car from an independent host isn&apos;t just a
                                        vehicle; it&apos;s a reflection of their commitment to quality. SwingRides exists to
                                        bring those dedicated owners directly to the modern traveler.
                                </p>
                        </div>
                </section>
        )
}

const NumberSection = () => {
        return (
                <section className="px-4 pt-20 pb-33">
                        <div className="p-8 mx-auto max-w-7xl w-fit md:w-full rounded-2xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] outline outline-offset-[-0.89px] outline-gray-200">
                                <div>
                                        <h3 className="text-neutral-950 text-4xl md:text-[64px] font-black font-sans">
                                                swingrides by the numbers
                                        </h3>
                                </div>
                                <div className="flex flex-wrap gap-8 justify-center item-center">
                                        {NumberContent.map((item) => (
                                                <Fragment key={item.id}>
                                                        <NumberCard 
                                                                content={item}
                                                        />
                                                </Fragment>
                                        ))}
                                </div>
                        </div>
                </section>
        )
}

const NumberCard = ({ content }: ListProps ) => {
        return (
                <div className="max-w-66 w-full">
                        <h4 className="text-center text-blue-700 text-5xl font-black leading-12 font-text">
                                {content.id}
                        </h4>
                        <p className="text-center text-gray-500 text-sm font-normal uppercase leading-5 tracking-tight">
                                {content.label}
                        </p>
                </div>
        )
}

const OurStorySection = () => {
        return (
                <section className='py-12 px-4 md:px-8 md:py-20 section-bg-gradient'>
                        <div className="space-y-6 md:space-y-10">
                                <div>
                                        <span className="text-blue-700 text-xs font-bold font-text uppercase leading-4 tracking-wider">
                                                Our Story
                                        </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 justify-center">
                                        <div className="flex flex-col gap-5 justify-center">
                                                <h3 className="text-neutral-950 text-2xl font-bold font-text leading-8 max-w-102.5">
                                                        Built from real experiences. Driven by a simple idea.
                                                </h3>
                                                <p className="text-gray-500 text-base font-normal font-text leading-6">
                                                        SwingRides was founded by people who believe renting a car should be easy, fair, and trustworthy. We saw the challenges renters face — and the hard work independent operators put in every day. SwingRides is our way of making things better for both.
                                                </p>
                                        </div>
                                        <div>
                                                <Image 
                                                        src={'/images/driven-by-a-simple-idea.png'}
                                                        alt={`Built from real experiences. Driven by a simple idea.`}
                                                        title={`Built from real experiences. Driven by a simple idea.`}
                                                        width={411}
                                                        height={395}
                                                        className="aspect-411/395 object-cover w-full rounded-[14px]"
                                                />
                                        </div>
                                        <div className="p-8 bg-blue-950 rounded-2xl flex flex-col gap-6 md:gap-8 justify-between items-stretch">
                                                <div className="space-y-4">
                                                        <div className="size-11 bg-blue-700 rounded-full flex justify-center items-center">
                                                                <Compass className='size-5 text-white' />
                                                        </div>
                                                        <h4 className="justify-center text-white text-xl font-bold font-text leading-7">
                                                                The road ahead
                                                        </h4>
                                                        <p className="text-slate-400 text-sm font-normal font-text leading-6">
                                                                We&apos;re just getting started. Our goal is to become the most trusted car rental platform for renters and the most powerful growth partner for independent rental businesses worldwide.
                                                        </p>
                                                </div>
                                                <div className="w-full">
                                                        <Link 
                                                                href={'/'} 
                                                                className="flex justify-center text-white text-base font-semibold font-text leading-6 w-full px-8 py-3.5 rounded-xs border border-white"
                                                        >
                                                                Join the Journey
                                                        </Link>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </section>
        )
}