import React from 'react'
import { SecBtn, TetBtn } from '../buttons'
import Link from 'next/link'
import Logo from '../headerNav/logo'
import { footerLinksOne, footerLinksThree, footerLinksTwo } from '@/constants/footer'
import SocialMediaIconLink from './socialMediaIconLink'

type FootLinksProps = {
        footerLinks: {
                linksTitle: string;
                links: {
                        id: number;
                        label: string;
                        href: string;
                }[];
        }
}

export default function Footer() {
        return (
                <footer className='px-4 pt-10 pb-4 md:px-10 md:pb-10 bg-[#0F1F3D]'>
                        <div>
                                <div className='text-white'>
                                        <h3 className='text-[40px] md:text-[80px]'>
                                                READY TO HIT THE ROAD?
                                        </h3>
                                        <p className='mt-4 mb-6 md:mt-6 text-[#D1D5DC] font-medium text-base md:text-lg '>
                                                Join thousands of renters and hosts already on SwingRides.
                                        </p>
                                        <div className='flex gap-6'>
                                                <SecBtn 
                                                        btn={{
                                                                label: 'Browse Cars',
                                                                link: '/browse-cars'
                                                        }}
                                                />
                                                <TetBtn 
                                                        btn={{
                                                                label: 'List Your Car',
                                                                link: '/list-your-car'
                                                        }}
                                                />
                                        </div>
                                </div>

                                <div className='mt-10 bg-[#F4F6F9] py-5 px-4 md:px-6 md:py-6 rounded-xs space-y-8'>
                                        <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-5'>
                                                <div className='max-w-[288px] flex flex-col gap-4'>
                                                        <Link href={'/'} title='Swing Rides Logo'>
                                                                <Logo />
                                                        </Link>
                                                        <p className='text-sm font-normal'>
                                                                The smarter way to rent and manage your fleet. Connect directly with local car owners.
                                                        </p>  
                                                        <div>
                                                                   <SocialMediaIconLink/>     
                                                        </div>
                                                </div>

                                                <div className='flex md:hidden w-full h-px bg-[#D1D5DB]'></div>

                                                <div>
                                                        <FootLinks 
                                                                footerLinks={footerLinksOne}
                                                        />
                                                </div>

                                                <div>
                                                        <FootLinks 
                                                                footerLinks={footerLinksTwo}
                                                        />
                                                </div>

                                                <div>
                                                        <FootLinks 
                                                                footerLinks={footerLinksThree}
                                                        />
                                                </div>
                                        </div>

                                        <div className='py-4 block md:flex justify-between items-center gap-4 border-t border-[#364153] text-[#333333]'>
                                                <div>
                                                        <span className='hover:text-black transition-colors duration-300'>
                                                                © 2026 SwingRides. All rights reserved.
                                                        </span>
                                                </div>

                                                <div className='flex items-center justify-between gap-2 text-sm'>
                                                        <Link
                                                                href='/privacy-policy'
                                                                className='hover:text-black transition-colors duration-300'
                                                        >
                                                                Privacy Policy
                                                        </Link>

                                                        <div>
                                                                <span></span>
                                                        </div>

                                                        <Link
                                                                href='/terms-of-service'
                                                                className='hover:text-black transition-colors duration-300'
                                                        >
                                                                Terms of Service
                                                        </Link>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </footer>
        )
}

const FootLinks = ({ footerLinks }: FootLinksProps ) => {
        return (
                <div className='flex flex-col gap-2 md:gap-4'>
                        <div>
                                <h4 className='font-text font-bold text-base'>
                                        {footerLinks.linksTitle}
                                </h4>
                        </div>
                        <div className='flex flex-col gap-2 text-sm font-normal text-[#333333]'>
                                {footerLinks.links.map(( link ) => (
                                        <Link
                                                key={link.id}
                                                href={link.href}
                                                className='hover:text-black transition-colors duration-300'
                                        >
                                                {link.label}
                                        </Link>
                                ))}
                        </div>
                </div>
        )
}