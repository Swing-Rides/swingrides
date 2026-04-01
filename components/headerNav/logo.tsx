import React from 'react'
import Image from 'next/image'

export default function Logo() {
        return (
                <Image
                        src={'/swingrides_logo.svg'}
                        alt='Swing Rides Logo'
                        title='Swing Rides Logo'
                        width={148}
                        height={38}
                        loading="eager"
                />
        )
}
