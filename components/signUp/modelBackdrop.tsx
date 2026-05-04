import React, { ReactNode } from 'react'

export default function ModelBackdrop({ children } : { children: ReactNode }) {
        return (
                <div className='fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm grid place-content-center'>
                        {children}
                </div>
        )
}
