'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import Logo from './logo'
import { navLinks } from '@/constants/header'
import { Menu, X } from 'lucide-react'

export default function Mobile() {
        const [isMenuOpen, setIsMenuOpen] = useState(false)

        const handleCloseMenu = () => {
                setIsMenuOpen(false)
                if (typeof document !== 'undefined') {
                        document.body.style.overflow = ''
                        document.body.style.touchAction = ''
                }
        }

        const handleToggleMenu = () => {
                setIsMenuOpen((prev) => {
                        const next = !prev
                        if (typeof document !== 'undefined') {
                                document.body.style.overflow = next ? 'hidden' : ''
                                document.body.style.touchAction = next ? 'none' : ''
                        }
                        return next
                })
        }

        return (
                <div className='flex items-center justify-between w-full lg:hidden'>
                        <Link
                                href={'/'}
                                title='Swing Rides Logo'
                                onClick={handleCloseMenu}
                        >
                                <Logo />
                        </Link>

                        <button
                                type='button'
                                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                                className='p-2 -mr-2 text-neutral-900 hover:text-blue-700 transition-colors cursor-pointer'
                                onClick={handleToggleMenu}
                        >
                                {isMenuOpen ? <X className='size-6' /> : <Menu className='size-6' />}
                        </button>

                        {typeof document !== 'undefined' &&
                                createPortal(
                                        <AnimatePresence>
                                                {isMenuOpen && (
                                                        <div className='fixed inset-0 z-[9999] overflow-hidden'>
                                                                {/* Backdrop Overlay */}
                                                                <motion.div
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        exit={{ opacity: 0 }}
                                                                        transition={{ duration: 0.25 }}
                                                                        className='fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm'
                                                                        onClick={handleCloseMenu}
                                                                        aria-hidden='true'
                                                                />

                                                                {/* Sliding Menu Panel */}
                                                                <motion.div
                                                                        initial={{ x: '100%' }}
                                                                        animate={{ x: 0 }}
                                                                        exit={{ x: '100%' }}
                                                                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                                                                        className='fixed inset-y-0 right-0 z-[9999] h-dvh max-h-dvh w-[280px] sm:w-[320px] max-w-[80vw] bg-white shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#DFE3E6]'
                                                                >
                                                                        <MobileNav onClose={handleCloseMenu} />
                                                                </motion.div>
                                                        </div>
                                                )}
                                        </AnimatePresence>,
                                        document.body
                                )}
                </div>
        )
}

type MobileNavProps = {
        onClose: () => void
}

const MobileNav = ({ onClose }: MobileNavProps) => {
        return (
                <div className='flex flex-col h-full w-full justify-between overflow-hidden'>
                        {/* Drawer Top Bar */}
                        <div>
                                <div className='flex items-center justify-between p-4 border-b border-gray-100 shrink-0'>
                                        <Link href={'/'} title='Swing Rides Logo' onClick={onClose}>
                                                <Logo />
                                        </Link>
                                        <button
                                                type='button'
                                                aria-label='Close menu'
                                                className='p-2 -mr-2 text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer rounded-md'
                                                onClick={onClose}
                                        >
                                                <X className='size-5' />
                                        </button>
                                </div>

                                {/* Main Nav Links */}
                                <nav className='flex flex-col gap-2 pt-6 px-4'>
                                        {navLinks.map((link) => (
                                                <Link
                                                        key={link.id}
                                                        href={link.href}
                                                        onClick={onClose}
                                                        className='py-2.5 px-3 text-base text-neutral-800 font-medium rounded-lg hover:bg-gray-100 hover:text-blue-700 transition-colors'
                                                >
                                                        {link.label}
                                                </Link>
                                        ))}
                                </nav>
                        </div>

                        {/* Bottom CTA Button */}
                        <div className='p-4 border-t border-gray-100 shrink-0 bg-white'>
                                <Link
                                        href='/for-hosts#price-list'
                                        onClick={onClose}
                                        className='w-full block bg-blue-700 hover:bg-blue-900 py-3 px-6 text-white text-base font-semibold rounded-xs text-center transition-colors shadow-xs'
                                >
                                        List Your Car
                                </Link>
                        </div>
                </div>
        )
}