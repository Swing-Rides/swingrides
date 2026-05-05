'use client'

import BrowseCarsComponentPage from '@/components/pages/broswerCarsPage'
import { Suspense } from 'react'

export default function BrowseCarsPage() {
        return (
                <main>
                        <Suspense>
                                <BrowseCarsComponentPage/>
                        </Suspense>
                </main>
        )
}
