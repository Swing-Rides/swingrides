import { PriBtn, SecBtn } from "@/components/buttons"
import { FieldSeparator } from "@/components/ui/field"
import Image from "next/image"
import Link from "next/link"
import { ListProps } from "../connectToHostPage"
import { Fragment } from "react/jsx-runtime"

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
                </>
        )
}

const HeroSection = () => {
        return (
                <section className="relative px-4 pb-57.5 md:px-20 mt-10 md:mt-27">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                        <span className="text-zinc-800 text-xs font-medium uppercase leading-4 tracking-[3px]">
                                                WHO WE ARE
                                        </span>
                                        <h1 className="w-full max-w-162.5 text-neutral-950 text-4xl md:text-7xl font-black mt-2.5">
                                                THE RENTAL INDUSTRY WASN&apos;T BUILT FOR INDEPENDENT <span className='text-blue-700 font-sans'>HOSTS.</span>
                                        </h1>
                                        <FieldSeparator className="max-w-120"/>
                                        <p className="max-w-135.5 w-full justify-center text-zinc-800 text-xl font-normal mt-5">
                                                So we built something that is. SwingRides gives small and mid-sized hosts the same power once reserved for giant rental chains.
                                        </p>
                                        <div className="flex gap-3 mt-9">
                                                <PriBtn 
                                                        btn={{
                                                                link: "/",
                                                                label: "List Your Car",
                                                        }}
                                                />
                                                <Link
                                                        href={'/browse-cars'}                                                        
                                                >
                                                        <button
                                                                className="text-center text-cyan-600 text-base font-semibold capitalize py-2 px-6 rounded-xs outline -outline-offset-1 outline-cyan-600 hover:bg-blue-800 hover:text-white transition-colors duration-300 cursor-pointer"
                                                        >
                                                                Browse Cars
                                                        </button>
                                                </Link>
                                        </div>
                                </div>
                                <div>
                                        <Image 
                                                src={'/images/about-hero-section.png'}
                                                alt="THE RENTAL INDUSTRY WASN'T BUILT FOR INDEPENDENT HOSTS."
                                                title="THE RENTAL INDUSTRY WASN'T BUILT FOR INDEPENDENT HOSTS."
                                                width={726}
                                                height={454}
                                        />
                                </div>
                        </div>
                        <div className="mt-10 md:mt-33.75 flex flex-col gap-5 md:flex-row md:gap-10 lg:gap-50">
                                <div className="w-full max-w-120">
                                        <h3 className="text-neutral-950 text-4xl md:text-7xl font-black">
                                                TOOLS FOR HOW REAL FLEETS  <span className='text-blue-700 font-sans'>RUN</span>
                                        </h3>
                                </div>
                                <div className="space-y-4">
                                        <p className="text-[#333333] text-base font-normal leading-7">
                                                Managing a car rental business shouldn&apos;t require a legacy software suite or
                                                a fleet of a thousand vehicles. We believe that local hosts provide the best
                                                quality service when they have the right technology supporting them.
                                        </p>
                                        <p className="text-[#333333] text-base font-normal leading-7">
                                                Our platform provides end-to-end management, from automated booking
                                                systems to real-time tracking and maintenance alerts. We are leveling the
                                                playing field so you can focus on what matters most: the drive.
                                        </p>
                                </div>
                        </div>
                        <div className="absolute bottom-5 -right-25">
                                <Image 
                                        src={'/images/2025-Toyota-Camry-at-Burnsville-Toyota.png'}
                                        alt="TOOLS FOR HOW REAL FLEETS RUN"
                                        title="TOOLS FOR HOW REAL FLEETS RUN"
                                        width={495}
                                        height={260}
                                />
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