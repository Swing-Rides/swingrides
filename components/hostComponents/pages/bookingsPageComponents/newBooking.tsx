'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '../../dashboard/pageWrapper'
import NewBookingForm, { NewBookingFormValues } from '../../forms/newBookingForm'

const FORM_ID = 'new-booking-form'

export default function NewBookingPageComponent() {

        const bookingId = "SR-2026-0043"
        const router = useRouter()

        // Stable references — required so NewBookingForm's use()-backed promises
        // don't get recreated (and re-suspended) on every render
        const fetchVehicles = useCallback(async () => {
                // TODO: replace with real API call
                return [
                        { id: 'veh_001', name: 'Toyota Camry 2024', imageUrl: '/images/toyota-camry-2024.webp', dailyPrice: 65, weeklyPrice: 380, monthlyPrice: 1400 },
                        { id: 'veh_002', name: 'Tesla Model S', imageUrl: '/images/test-cars/2026_tesla_model-s_sedan_base_fqn_izmo_1_1600x1067.webp', dailyPrice: 120, weeklyPrice: 700, monthlyPrice: 2600 },
                        { id: 'veh_003', name: 'Porsche-911 Carrera 2024', imageUrl: '/images/test-cars/Porsche-911-Carrera-2024.webp', dailyPrice: 155, weeklyPrice: 930, monthlyPrice: 4340 },
                ]
        }, [])

        const fetchAddons = useCallback(async () => {
                // TODO: replace with real API call
                return [
                        { id: 'addon_insurance', label: 'Insurance', price: 15 },
                        { id: 'addon_gps', label: 'GPS Navigation', price: 5 },
                        { id: 'addon_childseat', label: 'Driver', price: 280 },
                ]
        }, [])

        const checkAvailability = useCallback(async (vehicleId: string, startDate: Date, endDate: Date) => {
                // TODO: replace with real API call checking existing bookings against this range
                console.log('checking availability for', vehicleId, startDate, endDate)
                return true
        }, [])

        // Returns both the tax amount and the rate so the UI can display "Tax (8%)"
        const fetchTax = useCallback(async (subtotal: number) => {
                // TODO: replace with real tax calculation from server
                // const res = await fetch(`/api/tax?subtotal=${subtotal}`)
                // return res.json() // { amount, rate }
                const rate = 0.08
                return { amount: subtotal * rate, rate }
        }, [])

        const handleSubmit = useCallback(async (values: NewBookingFormValues) => {
                // TODO: replace with real API call
                console.log('creating booking:', { ...values, bookingId })
                router.push('/bookings')
        }, [bookingId, router])

        return (
                <PageWrapper
                        pageTitle='New Booking'
                        pageDescription={`Auto-generated ref: ${bookingId}`}
                        pageButton={
                                <button
                                        type='submit'
                                        form={FORM_ID}
                                        className='px-6 py-2 bg-blue-700 rounded-xs text-center text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none'
                                >
                                        Create Booking
                                </button>
                        }
                >
                        <div className='mt-4 md:mt-6'>
                                <NewBookingForm
                                        formId={FORM_ID}
                                        bookingId={bookingId}
                                        fetchVehicles={fetchVehicles}
                                        fetchAddons={fetchAddons}
                                        checkAvailability={checkAvailability}
                                        fetchTax={fetchTax}
                                        onSubmit={handleSubmit}
                                />
                        </div>
                </PageWrapper>
        )
}