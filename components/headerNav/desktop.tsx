"use client"

import Link from 'next/link'
import Logo from './logo'
import { navLinks } from '@/constants/header'
import { PriBtn } from '../buttons'
import { UserCircle, LogOut } from 'lucide-react'
import { useGetProfileQuery } from "@/app/store/services/renterApi"
import { Skeleton } from '../ui/skeleton'

type NavLinksProps = {
        navLinks: {
                id: number
                label: string
                href: string
        }[]
}

type LoginButtonsProps = {
        isLoggedIn: boolean
        username?: string | null
}

export default function Desktop() {
        const { data, isLoading } = useGetProfileQuery()
        const renterProfile = data?.renter ?? null

        const username = renterProfile?.userName
        const isLoggedIn = renterProfile !== null

        return (
                <div className='hidden w-full lg:flex items-center justify-between gap-5 text-base font-regular text-neutral-950'>
                        <Link href={'/'} title='Swing Rides Logo'>
                                <Logo />
                        </Link>

                        <NavLinks
                                navLinks={navLinks}
                        />

                        <div className='flex items-center justify-start gap-5'>
                                {isLoading ? (
                                        <Skeleton className='bg-gray-300 h-5 w-16' />
                                ) : (
                                        <LoginButtons isLoggedIn={isLoggedIn} username={username} />
                                )}
                                <NavButtons />
                        </div>
                </div>
        )
}

const NavLinks = ({ navLinks }: NavLinksProps) => {
        return (
                <nav className='flex items-center gap-6'>
                        {navLinks.map((link) => (
                                <Link
                                        key={link.id}
                                        href={link.href}
                                        title={link.label}
                                        className='text-sm font-medium text-neutral-950 hover:text-blue-700 duration-300 transition-colors'
                                >
                                        {link.label}
                                </Link>
                        ))}
                </nav>
        )
}

const LoginButtons = ({ isLoggedIn, username }: LoginButtonsProps) => {
        return (
                <div className='relative group'>
                        <button
                                type='button'
                                className='flex justify-start items-center gap-2 text-sm font-medium text-neutral-950 group-hover:text-blue-700 duration-300 transition-colors cursor-pointer py-2 max-w-32 truncate'
                        >
                                <UserCircle className='size-4 shrink-0' />
                                <span className='truncate'>
                                        {isLoggedIn ? username : "My Account"}
                                </span>
                        </button>

                        {/* Invisible bridge so the popup stays open while moving the cursor from button to popup */}
                        <div className='absolute left-0 top-full h-2 w-full' />

                        {/* POPUP */}
                        <div
                                className='absolute left-0 top-full flex flex-col gap-2 bg-white rounded-[10px] border border-gray-300 overflow-hidden shadow-lg min-w-45 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50'
                        >
                                {isLoggedIn ? (
                                        <>
                                                <Link
                                                        href={'/profile'}
                                                        className='text-xs font-medium text-neutral-950 py-3 px-5 hover:text-blue-700 hover:bg-gray-200 duration-300 transition-colors'
                                                >
                                                        View Profile
                                                </Link>
                                                <Link
                                                        href={'/us/host'}
                                                        className='text-xs font-medium text-neutral-950 py-3 px-5 hover:text-blue-700 hover:bg-gray-200 duration-300 transition-colors'
                                                >
                                                        Switch To Host Account
                                                </Link>
                                                {/* <button
                                                        type='button'
                                                        onClick={() => {
                                                                // TODO: wire up to your logout mutation/handler
                                                        }}
                                                        className='text-xs font-medium text-left text-red-600 py-3 px-5 hover:bg-gray-200 duration-300 transition-colors flex items-center gap-2'
                                                >
                                                        <LogOut className='size-4' />
                                                        Log Out
                                                </button> */}
                                        </>
                                ) : (
                                        <>
                                                <Link
                                                        href={'/profile'}
                                                        className='text-xs font-medium text-neutral-950 py-3 px-5 hover:text-blue-700 hover:bg-gray-200 duration-300 transition-colors'
                                                >
                                                        Login As A Renter
                                                </Link>
                                                <Link
                                                        href={'/us/host'}
                                                        className='text-xs font-medium text-neutral-950 py-3 px-5 hover:text-blue-700 hover:bg-gray-200 duration-300 transition-colors'
                                                >
                                                        Login As A Host
                                                </Link>
                                        </>
                                )}
                        </div>
                </div>
        )
}

const NavButtons = () => {
        return (
                <div>
                        <PriBtn
                                btn={{
                                        link: '/for-hosts#price-list',
                                        label: 'List Your Car'
                                }}
                        />
                </div>
        )
}