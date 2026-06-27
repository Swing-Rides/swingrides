import { Car, Headphones, Lock, Mail, Phone, ShieldCheck } from "lucide-react"

export const contactSupportPageContent = [
        {
                id: 1,
                imageUrl: `/images/email-Icon.svg`,
                title: 'Email us',
                label: 'support@swingrides.com',
                link: 'mailto:support@swingrides.com'
        },
        {
                id: 2,
                imageUrl: `/images/tel-Icon.svg`,
                title: 'Call us',
                label: '+1 (888) 555-1234',
                link: 'tel:18885551234'
        },
]

export const trustContent = [
        {
                icon: <ShieldCheck className="size-7 text-blue-700" /> ,
                title: "Verified Hosts",
                description: `Every host is verified to ensure a safe and reliable experience.`
        },
        {
                icon: <Car className="size-7 text-blue-700" /> ,
                title: "Verified Vehicles",
                description: `All vehicles are inspected for quality and safety before listing.`
        },
        {
                icon: <Lock className="size-7 text-blue-700" /> ,
                title: "Secure Payments",
                description: `Your payments are encrypted and processed securely via Stripe.`
        },
        {
                icon: <Headphones className="size-7 text-blue-700" /> ,
                title: "Dedicated Support",
                description: `Our support team is here to help you with any questions or concerns.`
        },
]

export const contactLink = [
        {
                icon: <Mail className="text-gray-500 size-5" />,
                label: 'support@swingrides.com',
                href: 'mailto:support@swingrides.com',
        },
        {
                icon: <Phone className="text-gray-500 size-5" />,
                label: '+1 (888) 555-1234',
                href: 'tel:18885551234',
        },
]