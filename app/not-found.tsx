import Link from 'next/link'
import React from 'react'

export default function NotFound() {
        return (
                <div className='w-full h-dvh grid place-content-center section-bg-gradient'>
                        <div className='flex flex-col gap-4 items-center justify-center bg-white border p-10 border-zinc-300 rounded-[10px]'>
                                <span className='text-lg text-center'>
                                        Page Not Found
                                </span>
                                <h1 className='text-3xl font-text font-bold text-center uppercase'>
                                        Error 404
                                </h1>
                                <Link
                                        href={'/'}
                                        className='w-fit justify-self-center text-sm text-center border-b border-b-blue-700 text-blue-700 hover:text-blue-900 transition-colors mt-2.5'
                                >
                                        Go back home
                                </Link>
                        </div>
                </div>
        )
}
