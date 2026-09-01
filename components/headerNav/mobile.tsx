'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import Logo from './logo'
import { navLinks } from '@/constants/header'
import { Menu, X, UserCircle, ChevronDown } from 'lucide-react'
import { useGetProfileQuery } from '@/app/store/services/renterApi'
import { Skeleton } from '../ui/skeleton'

export default function Mobile() {
        const [isMenuOpen, setIsMenuOpen] = useState(false)
        const [isProfileOpen, setIsProfileOpen] = useState(false)

        const { data, isLoading } = useGetProfileQuery()
        const renterProfile = data?.renter ?? null
        const username = renterProfile?.userName
        const isLoggedIn = renterProfile !== null

        const handleCloseMenu = () => {
                setIsMenuOpen(false)
                if (typeof document !== 'undefined') {
                        document.body.style.overflow = ''
                        document.body.style.touchAction = ''
                }
        }

        const handleToggleMenu = () => {
                setIsProfileOpen(false)
                setIsMenuOpen((prev) => {
                        const next = !prev
                        if (typeof document !== 'undefined') {
                                document.body.style.overflow = next ? 'hidden' : ''
                                document.body.style.touchAction = next ? 'none' : ''
                        }
                        return next
                })
        }

        const handleToggleProfile = () => {
                if (isMenuOpen) {
                        handleCloseMenu()
                }
                setIsProfileOpen((prev) => !prev)
        }

        return (
                <div className='flex items-center justify-between w-full lg:hidden'>
                        <Link
                                href={'/'}
                                title='Swing Rides Logo'
                                onClick={() => {
                                        handleCloseMenu()
                                        setIsProfileOpen(false)
                                }}
                        >
                                <Logo />
                        </Link>

                        <div className='flex items-center gap-1 sm:gap-2'>
                                {/* Profile Dropdown Trigger */}
                                {isLoading ? (
                                        <Skeleton className='size-9 rounded-full bg-gray-200' />
                                ) : (
                                        <div className='relative'>
                                                <button
                                                        type='button'
                                                        aria-label='Account menu'
                                                        aria-expanded={isProfileOpen}
                                                        onClick={handleToggleProfile}
                                                        className='flex items-center gap-1 p-1.5 text-neutral-900 hover:text-blue-700 transition-colors cursor-pointer rounded-full hover:bg-gray-100'
                                                >
                                                        <UserCircle className='size-6 shrink-0' />
                                                        <ChevronDown className={`size-3.5 shrink-0 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                                </button>

                                                {isProfileOpen && (
                                                        <>
                                                                {/* Backdrop for tapping outside to dismiss */}
                                                                <div
                                                                        className='fixed inset-0 z-40'
                                                                        onClick={() => setIsProfileOpen(false)}
                                                                        aria-hidden='true'
                                                                />

                                                                {/* Dropdown Menu */}
                                                                <div className='absolute right-0 top-full mt-2 flex flex-col bg-white rounded-[10px] border border-gray-200 shadow-xl min-w-48 z-50 py-1 overflow-hidden'>
                                                                        {isLoggedIn && username && (
                                                                                <div className='px-4 py-2.5 bg-slate-50 border-b border-gray-100'>
                                                                                        <p className='text-xs text-neutral-500'>Signed in as</p>
                                                                                        <p className='text-sm font-semibold text-neutral-900 truncate'>{username}</p>
                                                                                </div>
                                                                        )}

                                                                        <div className='flex flex-col py-1'>
                                                                                {isLoggedIn ? (
                                                                                        <>
                                                                                                <Link
                                                                                                        href={'/profile'}
                                                                                                        onClick={() => setIsProfileOpen(false)}
                                                                                                        className='text-sm font-medium text-neutral-900 py-2.5 px-4 hover:text-blue-700 hover:bg-gray-100 transition-colors'
                                                                                                >
                                                                                                        View Profile
                                                                                                </Link>
                                                                                                <Link
                                                                                                        href={'/us/host'}
                                                                                                        onClick={() => setIsProfileOpen(false)}
                                                                                                        className='text-sm font-medium text-neutral-900 py-2.5 px-4 hover:text-blue-700 hover:bg-gray-100 transition-colors'
                                                                                                >
                                                                                                        Switch To Host Account
                                                                                                </Link>
                                                                                        </>
                                                                                ) : (
                                                                                        <>
                                                                                                <Link
                                                                                                        href={'/profile'}
                                                                                                        onClick={() => setIsProfileOpen(false)}
                                                                                                        className='text-sm font-medium text-neutral-900 py-2.5 px-4 hover:text-blue-700 hover:bg-gray-100 transition-colors'
                                                                                                >
                                                                                                        Login As A Renter
                                                                                                </Link>
                                                                                                <Link
                                                                                                        href={'/us/host'}
                                                                                                        onClick={() => setIsProfileOpen(false)}
                                                                                                        className='text-sm font-medium text-neutral-900 py-2.5 px-4 hover:text-blue-700 hover:bg-gray-100 transition-colors'
                                                                                                >
                                                                                                        Login As A Host
                                                                                                </Link>
                                                                                        </>
                                                                                )}
                                                                        </div>
                                                                </div>
                                                        </>
                                                )}
                                        </div>
                                )}

                                {/* Menu Hamburger Button */}
                                <button
                                        type='button'
                                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                                        className='p-1.5 -mr-1 text-neutral-900 hover:text-blue-700 transition-colors cursor-pointer rounded-full hover:bg-gray-100'
                                        onClick={handleToggleMenu}
                                >
                                        {isMenuOpen ? <X className='size-6' /> : <Menu className='size-6' />}
                                </button>
                        </div>

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
                                                                        <MobileNav
                                                                                onClose={handleCloseMenu}
                                                                                isLoggedIn={isLoggedIn}
                                                                                username={username}
                                                                        />
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
        isLoggedIn: boolean
        username?: string | null
}

const MobileNav = ({ onClose, isLoggedIn, username }: MobileNavProps) => {
        return (
                <div className='flex flex-col h-full w-full justify-between overflow-y-auto'>
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

                                {/* Account Section in Drawer */}
                                <div className='mt-6 pt-4 px-4 border-t border-gray-100 flex flex-col gap-1'>
                                        <p className='text-xs font-semibold uppercase tracking-wider text-neutral-400 px-3 mb-1'>Account</p>
                                        {isLoggedIn ? (
                                                <>
                                                        <Link
                                                                href='/profile'
                                                                onClick={onClose}
                                                                className='py-2.5 px-3 text-sm text-neutral-800 font-medium rounded-lg hover:bg-gray-100 hover:text-blue-700 transition-colors flex items-center justify-between'
                                                        >
                                                                <span>View Profile</span>
                                                                {username && <span className='text-xs text-neutral-500 font-normal truncate max-w-[100px]'>{username}</span>}
                                                        </Link>
                                                        <Link
                                                                href='/us/host'
                                                                onClick={onClose}
                                                                className='py-2.5 px-3 text-sm text-neutral-800 font-medium rounded-lg hover:bg-gray-100 hover:text-blue-700 transition-colors'
                                                        >
                                                                Switch To Host Account
                                                        </Link>
                                                </>
                                        ) : (
                                                <>
                                                        <Link
                                                                href='/profile'
                                                                onClick={onClose}
                                                                className='py-2.5 px-3 text-sm text-neutral-800 font-medium rounded-lg hover:bg-gray-100 hover:text-blue-700 transition-colors'
                                                        >
                                                                Login As A Renter
                                                        </Link>
                                                        <Link
                                                                href='/us/host'
                                                                onClick={onClose}
                                                                className='py-2.5 px-3 text-sm text-neutral-800 font-medium rounded-lg hover:bg-gray-100 hover:text-blue-700 transition-colors'
                                                        >
                                                                Login As A Host
                                                        </Link>
                                                </>
                                        )}
                                </div>
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