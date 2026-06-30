import React from 'react'
import Link from 'next/link'
import Logo from './logo'
import { navLinks } from '@/constants/header'
import { PriBtn } from '../buttons'
import { HOST_DASHBOARD_PATH } from '@/constants/constant'

type NavLinksProps = {
        navLinks: {
                id: number
                label: string
                href: string
        }[]
}

export default function Desktop() {
        return (
                <div className='hidden w-full md:flex items-center justify-between text-base font-regular text-[#0B0B0B]'>
                        <Link href={'/'} title='Swing Rides Logo'>
                                <Logo/>
                        </Link>

                        <NavLinks 
                                navLinks={navLinks} 
                        />

                        <NavButtons />
                </div>
        )
}

const NavLinks = ({ navLinks }: NavLinksProps ) => {
        return (
                <nav className='flex items-center gap-6'>
                        {navLinks.map(( link ) => (
                                <Link 
                                        key={link.id}
                                        href={link.href}
                                        title={link.label}
                                >
                                        {link.label}
                                </Link>
                        ))}
                </nav>
        )
}

const NavButtons = () => {
        return (
                <div>
                        <PriBtn 
                                btn={{
                                        link: HOST_DASHBOARD_PATH,
                                        label: 'List Your Car'
                                }}                        
                        />
                </div>
        )
}