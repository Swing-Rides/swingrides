'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import Logo from './logo'
import { navLinks } from '@/constants/header'
import { Menu, X } from 'lucide-react'

export default function Mobile() {

        const [isMenuOpen, setIsMenuOpen] = useState(false)

        const handleMenuToggle = () => {
                setIsMenuOpen(!isMenuOpen)
        }

        return (
                <div className='relative z-50 flex items-center justify-between lg:hidden gap-20'>
                        <Link
                                href={'/'} title='Swing Rides Logo'
                                onClick={() => setIsMenuOpen(false)}
                        >
                                <Logo />
                        </Link>

                        <div
                                className='cursor-pointer'
                                onClick={handleMenuToggle}
                        >
                                {isMenuOpen ? <X /> : <Menu />}
                        </div>

                        <AnimatePresence>
                                {isMenuOpen && (
                                        <>
                                                {/* Overlay */}
                                                <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className='fixed inset-0 z-40 bg-black/30 backdrop-blur-sm'
                                                        onClick={() => setIsMenuOpen(false)}
                                                />

                                                {/* Sliding menu panel */}
                                                <motion.div
                                                        initial={{ x: '-100%' }}
                                                        animate={{ x: 0 }}
                                                        exit={{ x: '-100%' }}
                                                        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                                                        className='fixed top-0 left-0 z-50 h-screen w-[300px] max-w-[80vw]'
                                                >
                                                        <MobileNav setIsMenuOpen={setIsMenuOpen} />
                                                </motion.div>
                                        </>
                                )}
                        </AnimatePresence>
                </div>
        )
}

type MobileNavProps = {
        setIsMenuOpen: (open: boolean) => void
}

const MobileNav = ({ setIsMenuOpen }: MobileNavProps) => {
        return (
                <div className='flex flex-col h-full w-full bg-white border-r border-solid border-[#DFE3E6] shadow-xl'>
                        <div className='flex flex-col gap-2.5 pt-24 px-2'>
                                {navLinks.map((link) => (
                                        <Link
                                                key={link.id}
                                                href={link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className='py-2.5 px-4 text-base text-[#333333] font-medium rounded-md hover:bg-gray-50'
                                        >
                                                {link.label}
                                        </Link>
                                ))}
                        </div>

                        <div className='mt-auto flex p-4'>
                                <Link
                                        href={'/list-your-car'}
                                        onClick={() => setIsMenuOpen(false)}
                                        className='bg-blue-700 py-2 px-6 w-full text-white rounded-xs text-center'>
                                        List Your Car
                                </Link>
                        </div>
                </div>
        )
}