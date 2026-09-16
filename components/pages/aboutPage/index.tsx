import Image from "next/image"
import { Fragment } from "react/jsx-runtime"
import FAQsSection from '@/components/faqs';
import { BarChart3, Car, CarFront, Compass, Handshake, LayoutGrid, Lightbulb, MapPin, Percent, Settings, ShieldCheck, Target, Users } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { DISCORD_COMMUNITY_LINK } from "@/constants/constant";

const NumberContent = [
        {
                icon: <Car className="size-5 text-blue-700" />,
                number: `One Vehicle or a Fleet`,
                label: `Built for hosts of every size`,
        },
        {
                icon: <Percent className="size-5 text-blue-700" />,
                number: `0% Commission`,
                label: `No percentage taken from bookings`,
        },
        {
                icon: <Users className="size-5 text-blue-700" />,
                number: `Own Your Customers`,
                label: `Build direct customer relationships`,
        },
        {
                icon: <MapPin className="size-5 text-blue-700" />,
                number: `Reach Local Renters`,
                label: `List your vehicles on the marketplace`,
        },
        {
                icon: <LayoutGrid className="size-5 text-blue-700" />,
                number: `All-in-One Platform`,
                label: `Manage bookings, vehicles, and more`,
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
                        <HeroSection />
                        <OurMissionSection />
                        <SwingNumberSection />
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

export const SwingNumberSection = () => {
        return (
                <section className="py-12 px-4 md:px-8 md:py-20 bg-white">
                        <div className="space-y-6 md:space-y-12">
                                <div>
                                        <h3 className="text-neutral-950 text-4xl md:text-[64px] font-black font-sans text-center">
                                                Every <span className='text-blue-700 font-sans'>ride</span>, Every <span className='text-blue-700 font-sans'>Journey</span>, Every <span className='text-blue-700 font-sans'>day</span>.
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

const NumberCard = ({ content }: { content: ContentProps }) => {
        return (
                <div className="grow shrink basis-64 max-w-66 w-full space-y-4 py-6 px-10">
                        <div className='size-10 bg-blue-50 rounded-full flex justify-center items-center mx-auto'>
                                {content.icon}
                        </div>
                        <div className="space-y-1">
                                <h4 className="text-center justify-center text-neutral-950 text-base font-bold font-text leading-7">
                                        {content.number}
                                </h4>
                                <p className="text-center justify-center text-gray-500 text-xs font-normal font-text leading-5">
                                        {content.label}
                                </p>
                        </div>
                </div>
        )
}

const storyFeatures = [
        {
                icon: <Users className="size-6 sm:size-7 text-blue-600 shrink-0 mt-0.5" />,
                title: "Local connections",
                description: "Renters connect directly with independent hosts.",
        },
        {
                icon: <CarFront className="size-6 sm:size-7 text-blue-600 shrink-0 mt-0.5" />,
                title: "Host independence",
                description: "Hosts control their vehicles, pricing and customer relationships.",
        },
        {
                icon: <Settings className="size-6 sm:size-7 text-blue-600 shrink-0 mt-0.5" />,
                title: "One connected platform",
                description: "Bookings, payments and business tools in one place.",
        },
];

const roadAheadGoals = [
        {
                icon: <BarChart3 className="size-5 text-slate-200" />,
                title: "Grow city by city",
                description: "Build trusted local rental communities.",
        },
        {
                icon: <Users className="size-5 text-slate-200" />,
                title: "Strengthen host businesses",
                description: "Create tools and partnerships that support growth.",
        },
        {
                icon: <MapPin className="size-5 text-slate-200" />,
                title: "Expand thoughtfully",
                description: "Bring the SwingRides model to more markets over time.",
        },
];

const OurStorySection = () => {
        return (
                <section className='py-12 px-4 md:px-8 lg:px-12 md:py-20 section-bg-gradient'>
                        <div className="w-full">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                                        {/* Column 1: Story Details */}
                                        <div className="flex flex-col justify-center py-1">
                                                <div>
                                                        <span className="text-blue-600 text-xs font-bold font-text uppercase tracking-wider block mb-3">
                                                                OUR STORY
                                                        </span>
                                                        <h2 className="text-neutral-950 text-3xl sm:text-4xl lg:text-[34px] xl:text-[38px] font-bold font-text leading-[1.18] tracking-tight">
                                                                Built from real experiences. <br className="hidden sm:inline" />
                                                                Driven by a simple idea.
                                                        </h2>
                                                        <p className="text-slate-500 text-sm sm:text-base font-normal font-text leading-relaxed mt-4">
                                                                SwingRides was created to give renters a more personal way to find vehicles and to give independent hosts the tools to run and grow their businesses.
                                                        </p>
                                                </div>

                                                <div className="mt-8 space-y-6">
                                                        {storyFeatures.map((item) => (
                                                                <div key={item.title} className="flex items-start gap-4">
                                                                        {item.icon}
                                                                        <div className="space-y-0.5">
                                                                                <h4 className="text-neutral-950 text-base font-bold font-text leading-snug">
                                                                                        {item.title}
                                                                                </h4>
                                                                                <p className="text-slate-500 text-sm font-normal font-text leading-relaxed">
                                                                                        {item.description}
                                                                                </p>
                                                                        </div>
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>

                                        {/* Column 2: Center Image */}
                                        <div className="relative w-full aspect-1536/1024 rounded-2xl overflow-hidden shadow-sm">
                                                <Image
                                                        src="/images/SwingRides-our_story.webp"
                                                        alt="Built from real experiences. Driven by a simple idea."
                                                        title="Built from real experiences. Driven by a simple idea."
                                                        fill
                                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                                        className="object-cover"
                                                />
                                        </div>

                                        {/* Column 3: The Road Ahead Card */}
                                        <div className="p-6 sm:p-8 bg-[#0f1f38] rounded-2xl flex flex-col justify-between text-white shadow-md">
                                                <div>
                                                        <div className="size-10 bg-blue-600 rounded-full flex items-center justify-center mb-5">
                                                                <Compass className="size-5 text-white" />
                                                        </div>
                                                        <h3 className="text-white text-2xl font-bold font-text leading-tight mb-3">
                                                                The road ahead
                                                        </h3>
                                                        <p className="text-slate-400 text-sm font-normal font-text leading-relaxed">
                                                                We&apos;re building toward a future where renters have more choice and independent hosts have more control.
                                                        </p>

                                                        <div className="border-t border-slate-700/60 my-6" />

                                                        <div className="space-y-5">
                                                                {roadAheadGoals.map((item) => (
                                                                        <div key={item.title} className="flex items-center gap-4">
                                                                                <div className="size-10 rounded-full border border-slate-600/70 flex items-center justify-center shrink-0">
                                                                                        {item.icon}
                                                                                </div>
                                                                                <div>
                                                                                        <h4 className="text-white text-sm font-bold font-text leading-tight">
                                                                                                {item.title}
                                                                                        </h4>
                                                                                        <p className="text-slate-400 text-xs font-normal font-text leading-tight mt-0.5">
                                                                                                {item.description}
                                                                                        </p>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>

                                                <div className="mt-8 pt-2">
                                                        <Link
                                                                href={DISCORD_COMMUNITY_LINK}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                title="Join the Journey"
                                                                className="flex justify-center items-center text-white text-sm font-semibold font-text leading-5 w-full py-3 px-6 rounded-lg border border-slate-600/70 hover:border-white hover:bg-white/5 transition-all text-center"
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