import { fetchAdminRenterById } from '@/app/services/renters'
import RenterPageComponents from '@/components/superAdminPages/pages/singleRenterPageComponent/renterPageComponents'
import React from 'react'

export default async function RenterPage({
                params,
        }: {
                params: Promise<{ renterId: string }>
        }) {

        const { renterId } = await params

        const response = await fetchAdminRenterById(renterId)

        // console.log("RENTER iD PAGE", response.data)
        const { renter, stats, verification, bookings, documents } = response.data

        return (
                <div>
                        <RenterPageComponents 
                                renter={renter}
                                stats={stats}
                                verification={verification}
                                documents={documents}
                                bookings={bookings}
                        />
                </div>
        )
}
