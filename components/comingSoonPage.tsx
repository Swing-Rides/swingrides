import Image from "next/image";

export default function ComingSoonPage() {
        return (
                <div className="relative h-screen overflow-clip flex items-center justify-center">
                        <div className="absolute inset-0 w-full h-full object-cover z-1">
                                <Image 
                                        src={'/images/car-lot.webp'}
                                        alt="Car Lot"
                                        width={1000}
                                        height={667}
                                        className="w-full h-full object-cover brightness-65"
                                />
                        </div>
                        <div className="relative max-w-250 mx-auto p-10 md:p-20 z-10 bg-white/40 backdrop-blur-sm rounded-lg">
                                <div className="flex items-center justify-center">
                                        <Image 
                                                src={'/swingrides_logo.svg'}
                                                alt="Swing Rides Logo"
                                                width={260}
                                                height={68}
                                        />
                                </div>
                                <div className="text-center max-w-82.5 md:max-w-155 mx-auto my-20">
                                        <h1 className="text-[54px] md:text-[110px] font-bold mt-4 leading-[0.95]">
                                                We Are Almost Ready To Launch!
                                        </h1>

                                        <p className="text-lg mt-2">
                                                {`We're working hard to bring you an amazing experience. Stay tuned!`}
                                        </p>
                                </div>
                        </div>
                </div>
        )
}
