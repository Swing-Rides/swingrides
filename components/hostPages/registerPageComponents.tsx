import Image from "next/image"
import Logo from "../headerNav/logo"
import Link from "next/link"
import HostRegisterForm from "../forms/hostRegisterForm"

export default function RegisterPageComponents() {
        return (
                <section className="grid lg:grid-cols-2 min-h-screen bg-white">
                        <HostRegisterPageLeftContent/>
                        <HostRegisterPageRightContent/>
                </section>
        )
}

export const HostRegisterPageLeftContent = () => {
        return (
                <div className="flex justify-center p-10 md:p-20 bg-white">
                        <div className="max-w-137.75 w-full flex flex-col gap-4.5 md:gap-10">
                                <div className="flex flex-col gap-4.5">
                                        <Logo />
                                        <span className="px-2.5 py-1 bg-indigo-50 w-fit rounded-full flex justify-start items-start text-blue-700 text-xs font-semibold font-text uppercase leading-4 cursor-pointer">
                                                HOST PORTAL
                                        </span>
                                </div>
                        
                                <div className="flex flex-col gap-4.5">
                                        <div className="flex flex-col gap-2">
                                                <h2 className="text-gray-800 text-4xl font-bold font-sans leading-10">
                                                        Create your account
                                                </h2>
                                                <span className="text-gray-500 text-base font-normal font-text leading-6">
                                                        List your vehicles and start earning with SwingRides.
                                                </span>
                                        </div>
                                
                                        <div className="w-full flex flex-col justify-center gap-4.5">
                                                <div>
                                                        <HostRegisterForm />
                                                </div>
                                                <div className="flex gap-4 items-center">
                                                        <div className="bg-gray-200 w-full h-px" />
                                                        <span>or</span>
                                                        <div className="bg-gray-200 w-full h-px" />
                                                </div>
                                                <div>
                                                        <button className="flex gap-3 justify-center items-center py-3 px-15 w-full bg-white rounded-xs border border-gray-300 hover:bg-gray-300 cursor-pointer duration-300 transition-colors">
                                                                <GoogleIcon/>
                                                                <span className="text-gray-800 text-sm font-medium font-text leading-5">
                                                                        Continue with Google
                                                                </span>
                                                        </button>
                                                </div>
                                                <div className="text-center flex justify-center items-center gap-1 text-wrap">
                                                        <span className="text-gray-500 text-xs font-normal font-text leading-5">
                                                                Already have an account? 
                                                        </span>
                                                        <Link
                                                                href={'/us/host/login'}
                                                                className="text-blue-700 text-xs font-semibold font-text leading-5 hover:text-blue-900 duration-300 transition-colors"
                                                        >
                                                                Sign in →
                                                        </Link>
                                                </div>
                                        </div>

                                </div>

                                <div className="mt-5 md:mt-10 self-center">
                                        <span className="text-center text-gray-500 text-xs font-normal font-text leading-4">
                                                © 2026 SwingRides. All rights reserved.
                                        </span>
                                </div>
                        </div>
                </div>
        )
}

export const HostRegisterPageRightContent = () => {
        return (
                <div className="bg-white">
                        <Image 
                                src={'/images/host-login-page.png'}
                                alt="Swing Rides host dashboard sample image"
                                title="Swing Rides host dashboard sample image"
                                width={729}
                                height={1151}
                                loading="eager"
                                className="w-full"
                        />
                </div>
        )
}

export const GoogleIcon = () => {
        return (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_175_2032)">
                                <path d="M19.5856 10.2199C19.5856 9.51135 19.5216 8.83082 19.4037 8.17627H9.99219V12.0416H15.3705C15.2591 12.653 15.025 13.2355 14.6822 13.7539C14.3393 14.2723 13.8949 14.7158 13.3759 15.0575V17.5658H16.6056C18.4953 15.825 19.5856 13.2628 19.5856 10.2199Z" fill="#4285F4" />
                                <path d="M9.99234 19.9863C12.6905 19.9863 14.9529 19.0919 16.6058 17.5649L13.376 15.0577C12.4816 15.6572 11.3374 16.012 9.99234 16.012C7.38913 16.012 5.18566 14.2532 4.4012 11.8918H1.0625V14.4801C1.89394 16.1357 3.16942 17.5274 4.74639 18.4998C6.32336 19.4722 8.13968 19.9868 9.99234 19.9863Z" fill="#34A853" />
                                <path d="M4.40196 11.8917C4.2021 11.2921 4.08818 10.6526 4.08818 9.99301C4.08818 9.33346 4.2021 8.6939 4.40196 8.09432V5.5061H1.06327C0.363764 6.89835 -0.000359185 8.43492 2.65871e-07 9.99301C2.65871e-07 11.6059 0.385734 13.1318 1.06327 14.4799L4.40096 11.8917H4.40196Z" fill="#FBBC05" />
                                <path d="M9.99234 3.97426C11.4593 3.97426 12.7764 4.47891 13.8127 5.46923L16.6787 2.6032C14.9479 0.989317 12.6855 0 9.99234 0C6.08503 0 2.70736 2.23846 1.0625 5.5062L4.4002 8.09441C5.18565 5.73205 7.38913 3.97426 9.99234 3.97426Z" fill="#EA4335" />
                        </g>
                        <defs>
                                <clipPath id="clip0_175_2032">
                                        <rect width="19.9862" height="19.9862" fill="white" />
                                </clipPath>
                        </defs>
                </svg>

        )
}