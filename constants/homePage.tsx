import { Building2, Car, DollarSign, Headphones, MapPin, MessageCircle, ShieldCheck, Tag, Search, Star, Calendar, CarFront, UserCheck, CreditCard, HeadphonesIcon } from "lucide-react"

export const featureContent = [
        {
                id: 1,
                icon: (<Car className="text-blue-700 size-5" />),
                title: 'Wide selection',
                label: 'From compact cars to SUVs and more.',
        },
        {
                id: 2,
                icon: (<Building2 className="text-blue-700 size-5" />),
                title: 'Local & independent',
                label: 'Support local rental businesses.',
        },
        {
                id: 3,
                icon: (<Tag className="text-blue-700 size-5" />),
                title: 'Great value',
                label: 'Competitive rates. No middleman.',
        },
        {
                id: 4,
                icon: (<ShieldCheck className="text-blue-700 size-5" />),
                title: 'Trusted & verified',
                label: 'Every host and vehicle is verified.',
        },
        {
                id: 5,
                icon: (<Headphones className="text-blue-700 size-5" />),
                title: 'Real support',
                label: 'Get help from real people, anytime.',
        },
]

export const whyRentContent = [
        {
                icon: <ShieldCheck className="size-5 text-green-600"/>,
                iconBgColor: "bg-green-100",
                title: "Safe & Reliable",
                description: `All hosts and vehicles are verified for your peace of mind.`,
        },
        {
                icon: <DollarSign className="size-5 text-blue-700"/>,
                iconBgColor: "bg-blue-100",
                title: "Better Prices",
                description: `Rent directly from local businesses and save more.`,
        },
        {
                icon: <MapPin className="size-5 text-amber-600"/>,
                iconBgColor: "bg-amber-100",
                title: "Convenient Locations",
                description: `Find cars near you, airports, and popular destinations.`,
        },
        {
                icon: <MessageCircle className="size-5 text-purple-600"/>,
                iconBgColor: "bg-purple-100",
                title: "Support When You Need It",
                description: `We're here to help with anything you need.`,
        },
]

export const howItWorksContent = [
        {
                number: 1,
                title: 'Search and Browse.',
                body: 'Find the right car for your trip.',
                icon: <Search className="size-7 text-blue-700" />,
                iconBgColor: "bg-blue-100",
        },
        {
                number: 2,
                title: 'Book Instantly.',
                body: `Choose your dates and book securely.`,
                icon: <Calendar className="size-7 text-green-500" />,
                iconBgColor: "bg-green-100",
        },
        {
                number: 3,
                title: 'Pick Up.',
                body: `Meet your host and hit the road.`,
                icon: <CarFront className="size-7 text-amber-500" />,
                iconBgColor: "bg-amber-100",
        },
        {
                number: 4,
                title: 'Enjoy.',
                body: `Return the car and leave a review.`,
                icon: <Star className="size-7 text-purple-500" />,
                iconBgColor: "bg-purple-100",
        },
]

export const trustContent = [
        {
                icon: <ShieldCheck className="size-5 text-blue-700" />,
                title: `Secure platform`,
                description: `Your data is protected`
        },
        {
                icon: <UserCheck className="size-5 text-blue-700" />,
                title: `Verified hosts`,
                description: `All hosts are verified`
        },
        {
                icon: <CreditCard className="size-5 text-blue-700" />,
                title: `Secure payments`,
                description: `Safe and encrypted`
        },
        {
                icon: <HeadphonesIcon className="size-5 text-blue-700" />,
                title: `24/7 support`,
                description: `We're here to help`
        },
]