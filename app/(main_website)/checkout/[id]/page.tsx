"use client" 

import CheckoutForm from "@/components/forms/checkoutForm"
import { Elements } from "@stripe/react-stripe-js"
import { stripePromise } from '@/lib/stripe';
import { SITE_URL } from "@/constants/constant";

export default function CheckoutPage({ id }: { id: string }) {
        const summary = {
                imageUrl: '/images/swingrides-default-img.webp',
                vehicleName: "Toyota Corolla 2025",
                vehicleType: "Sedan",
                vehicleGearType: "Automatic",
                duration: "13 days",
                totalPrice: "$2380",
                subTotalFee: "$2300",
                taxPercentageRate: "8%",
                taxFee: "$80",
        }
        const clientSecret = 'vussiucbswqi2b'
        const user = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'string@aol.com',
                phoneNumber: '+12123456789'
        }

        return (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm
                                id={id}
                                {...summary}
                                user={user}
                                clientSecret={clientSecret}
                                returnUrl={`${SITE_URL}/checkout/${id}/confirm`}
                                onSubmit={async (values) => { console.log("Booking Processing", values) }}
                        />
                </Elements>
        )
}