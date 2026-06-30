import Image from "next/image"
import { Fragment } from "react/jsx-runtime"
import FAQsSection from '@/components/faqs';
import { Building, Car, Compass, Globe, Handshake, Lightbulb, ShieldCheck, Star, Target, Users } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { DISCORD_COMMUNITY_LINK } from "@/constants/constant";

const NumberContent = [
        {
                icon: <Car className="size-5 text-blue-700" />,
                number: `25,000+`,
                label: `Cars available`,
        },
        {
                icon: <Building className="size-5 text-blue-700" />,
                number: `2,500+`,
                label: `Happy Renters`,
        },
        {
                icon: <Users className="size-5 text-blue-700" />,
                number: `150,000+`,
                label: `Active Hosts`,
        },
        {
                icon: <Globe className="size-5 text-blue-700" />,
                number: `100+`,
                label: `Average Rating`,
        },
        {
                icon: <Star className="size-5 text-blue-700" />,
                number: `4.8/5`,
                label: `Average Rating`,
        },
]

const ourVisionContent = [
        {
                icon: <ShieldCheck className="size-5 text-blue-700" />,
                iconBgColor: "bg-blue-100",
                title: "Trust First",
                description: `We prioritize safety and transparency in everything we do.`,
        },
        {
                icon: <Users className="size-5 text-green-600" />,
                iconBgColor: "bg-green-100",
                title: "People Focused",
                description: `We put renters and hosts at the center of every decision.`,
        },
        {
                icon: <Lightbulb className="size-5 text-amber-600" />,
                iconBgColor: "bg-amber-100",
                title: "Innovation",
                description: `We continuously improve the rental experience through smart technology.`,
        },
        {
                icon: <Handshake className="size-5 text-purple-600" />,
                iconBgColor: "bg-purple-100",
                title: "Stronger Together",
                description: `We grow by supporting independent businesses and local communities.`
        },
]

export default function AboutPageComponents() {
        return (
                <>
                        <HeroSection/>
                        <OurMissionSection />
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

const OurMissionSection = () => {
        return (
                <section className="py-12 px-4 md:px-8 md:py-20 section-bg-gradient">
                        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x bg-white rounded-2xl shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)] border border-gray-200">
                                <div className="space-y-5 p-4 md:p-10 md:basis-102.5 grow-0 shrink">
                                        <h3 className="text-blue-700 text-xs font-bold font-text uppercase leading-4 tracking-wider">
                                                Our Mission
                                        </h3>
                                        <div className="bg-blue-100 size-12 rounded-full flex justify-center items-center">
                                                <Target className='size-6 text-blue-700' />
                                        </div>
                                        <div className="space-y-4">
                                                <h4 className="text-neutral-950 text-lg font-bold font-text leading-7">
                                                        Empower independent rental businesses. Serve renters better.
                                                </h4>
                                                <p className="text-gray-500 text-sm font-normal font-text leading-6">
                                                        We exist to empower independent rental operators with technology and visibility so renters can find reliable cars at fair prices.
                                                </p>
                                        </div>
                                </div>
                                <div className="space-y-5 p-4 md:p-10">
                                        <h3 className="text-blue-700 text-xs font-bold font-text uppercase leading-4 tracking-wider">
                                                Our Vision
                                        </h3>
                                        <div className="flex flex-wrap gap-6">
                                                {ourVisionContent.map((item) => (
                                                        <div 
                                                                key={item.title}
                                                                className="flex flex-col gap-3 basis-51.25 grow shrink"
                                                        >
                                                                <div className={`size-10 rounded-full inline-flex justify-center items-center ${item.iconBgColor}`}>
                                                                        {item.icon}
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                        <h4 className="text-neutral-950 text-sm font-bold font-text leading-5">
                                                                                {item.title}
                                                                        </h4>
                                                                        <p className="text-gray-500 text-xs font-normal font-text leading-5">
                                                                                {item.description}
                                                                        </p>
                                                                </div>
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        </div>
                </section>
        )
}

const NumberSection = () => {
        return (
                <section className="py-12 px-4 md:px-8 md:py-20 bg-white">
                        <div className="space-y-6 md:space-y-12">
                                <div>
                                        <h3 className="text-neutral-950 text-4xl md:text-[64px] font-black font-sans text-center">
                                                swingrides by the <span className='text-blue-700 font-sans'> numbers</span>
                                        </h3>
                                </div>
                                <div className="flex flex-wrap mx-auto justify-center rounded-2xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] overflow-clip bg-slate-100 border border-gray-200 divide-y md:divide-y-0 md:divide-x">
                                        {NumberContent.map((item) => (
                                                <Fragment key={item.number}>
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

type ContentProps = {
        icon: ReactNode;
        number: string;
        label: string;
}

const NumberCard = ({ content }: { content: ContentProps} ) => {
        return (
                <div className="grow shrink basis-64 max-w-66 w-full space-y-4 py-6 px-10">
                        <div className='size-10 bg-blue-50 rounded-full flex justify-center items-center mx-auto'>
                                {content.icon}
                        </div>
                        <div className="space-y-1">
                                <h4 className="text-center justify-center text-neutral-950 text-3xl font-bold font-text leading-7">
                                        {content.number}
                                </h4>
                                <p className="text-center justify-center text-gray-500 text-xs font-normal font-text leading-5">
                                        {content.label}
                                </p>
                        </div>
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
                                                        SwingRides was founded to solve the challenges renters and car rental businesses face every day. From long lines and hidden fees to lack of transparency and poor customer support, we knew there had to be a better way to rent and manage vehicles for everyone.
                                                </p>
                                        </div>
                                        <div>
                                                <Image 
                                                        src={'/images/SwingRides-our_story.png'}
                                                        alt={`Built from real experiences. Driven by a simple idea.`}
                                                        title={`Built from real experiences. Driven by a simple idea.`}
                                                        width={1536}
                                                        height={1024}
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
                                                                href={DISCORD_COMMUNITY_LINK} 
                                                                target="_blank"
                                                                rel="noopener"
                                                                title="join our community"
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