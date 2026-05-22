import React from 'react'
import Image from 'next/image'

export default function Logo() {
        return (
                <Image
                        src={'/swing-rides-logo.png'}
                        alt='Swing Rides Logo'
                        title='Swing Rides Logo'
                        width={98}
                        height={49}
                        loading="eager"
                />
        )
}
