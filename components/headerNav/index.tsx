import React from 'react'
import Desktop from './desktop'
import Mobile from './mobile'

export default function HeaderNav() {
        return (
                <header 
                        className='bg-white/70 py-3 px-4 md:py-4 md:px-8 fixed top-0 left-0 right-0 z-50'
                >
                        <Desktop/>
                        <Mobile/>
                </header>
        )
}
