import Link from 'next/link'
import React from 'react'

export default function NotFound() {
        return (
                <div>
                        <span>Page Not Found</span>
                        <h1>Error 404</h1>
                        <Link
                                href={'/'}
                        >
                                Go back home
                        </Link>
                </div>
        )
}
