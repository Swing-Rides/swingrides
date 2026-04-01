'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
// import { motion, AnimatePresence } from 'motion/react-client'
import Logo from './logo'
import { navLinks } from '@/constants/header'

export default function Mobile() {

        const [isMenuOpen, setIsMenuOpen] = useState(false)

        const handleMenuToggle = () => {
                setIsMenuOpen(!isMenuOpen)
        }

        return (
                <div className='flex items-center justify-between md:hidden gap-20'>
                        <Link href={'/'} title='Swing Rides Logo'>
                                <Logo />
                        </Link>

                        <div className='cursor-pointer' onClick={handleMenuToggle}>
                                {isMenuOpen ? <CloseMenuIcon /> : <HamburgerMenuIcon />}
                        </div>

                        <AnimatePresence>
                                {isMenuOpen && (
                                        <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className='fixed top-20 right-4 max-w-[70vw] w-full'
                                        >
                                                <MobileNav />
                                        </motion.div>
                                )}
                        </AnimatePresence>
                </div>
        )
}

const HamburgerMenuIcon = () => {
        return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.3335 6.25H19.6668" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.3335 12H19.6668" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.3335 17.75H19.6668" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

        )
}

const CloseMenuIcon = () => {
        return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12H13" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 7L17.8423 17.8423" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 18L17.8423 7.1577" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

        )
}

const MobileNav = () => {
        return (
                <div className='flex flex-col gap-2.5 w-full md:hidden py-5 border border-solid border-[#DFE3E6] bg-white backdrop-blur-[50%] rounded-sm'>
                        {navLinks.map(( link ) => (
                                <Link
                                        key={link.id}
                                        href={link.href}
                                        className='py-2.5 px-4 text-base text-[#333333] font-medium'
                                >
                                        {link.label}
                                </Link>
                        ))}
                        <div className='flex py-2.5 px-4'>
                                <Link
                                        href={'/list-your-car'}
                                        className='bg-[#1A56DB] py-2 px-6 w-full text-white rounded-xs text-center'>
                                        List Your Car
                                </Link>
                        </div>
                </div>
        )
}