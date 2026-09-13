import { PriceCardProps, TabContentProps } from "@/components/pages/forHostsLandingpageComponents/types"
import { HOST_PLANS } from "./hostPlans";
import { CalendarDays, Car, ChartColumnBig, CirclePlus, FileText, RotateCw, ScrollText, SquareActivity, Wallet } from "lucide-react";

export const fleetManagementContent: TabContentProps = {
        image: {
                src: '/images/fleet-management.png',
                alt: 'Fleet Management',
        },
        content: [
                {
                        icon: (
                                <Car className="size-7 text-blue-700 stroke-1"/>
                        ),
                        label: 'Manage all vehicles in one place',
                },
                {
                        icon: (
                                <SquareActivity className="size-7 text-blue-700 stroke-1"/>
                        ),
                        label: 'Track availability and status in real-time',
                },
                {
                        icon: (
                                <FileText className="size-7 text-blue-700 stroke-1"/>
                        ),
                        label: 'View full vehicle details and service history',
                },
        ],
};

export const bookingContent: TabContentProps = {
        image: {
                src: '/images/bookings.png',
                alt: 'Booking',
        },
        content: [
                {
                        icon: (
                                <CalendarDays className="size-7 text-blue-700 stroke-1"/>
                        ),
                        label: 'Manage bookings from request to completion',
                },
                {
                        icon: (
                                <RotateCw className="size-7 text-blue-700 stroke-1"/>
                        ),
                        label: 'Track status: Pending → Active → Completed',
                },
                {
                        icon: (
                                <CirclePlus className="size-7 text-blue-700 stroke-1"/>
                        ),
                        label: 'Create bookings manually or receive them instantly',
                },
        ],
};

export const financesContent: TabContentProps = {
        image: {
                src: '/images/finances.png',
                alt: 'Finances',
        },
        content: [
                {
                        icon: (
                                <ChartColumnBig className="size-7 text-blue-700 stroke-1"/>
                        ),
                        label: `Track every dollar, know exactly what you're making`,
                },
                {
                        icon: (
                                <Wallet className="size-7 text-blue-700 stroke-1"/>

                        ),
                        label: 'See revenue, expenses, and profit in one place',
                },
                {
                        icon: (
                                <ScrollText className="size-7 text-blue-700 stroke-1"/>
                        ),
                        label: 'Generate invoices and payment links instantly',
                },
        ],
};

export const maintenanceContent: TabContentProps = {
        image: {
                src: '/images/maintenance.png',
                alt: 'Maintenance',
        },
        content: [
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_1223_16189)">
                                <path d="M26.8187 7.19262C26.7801 6.98304 26.6979 6.78392 26.5773 6.60818C26.4567 6.43246 26.3005 6.28406 26.1187 6.17262L22.1187 10.1726C21.9321 10.3662 21.7085 10.5202 21.4611 10.6253C21.2137 10.7305 20.9475 10.7847 20.6787 10.7847C20.4099 10.7847 20.1439 10.7305 19.8964 10.6253C19.649 10.5202 19.4253 10.3662 19.2388 10.1726L17.7188 8.81262C17.3523 8.43876 17.1471 7.93612 17.1471 7.41262C17.1471 6.88912 17.3523 6.38648 17.7188 6.01262L21.7187 2.01262C21.6315 1.80769 21.5003 1.62444 21.3345 1.47583C21.1685 1.32722 20.9721 1.21688 20.7587 1.15262C19.3631 0.874298 17.9174 0.993434 16.5861 1.49646C15.2548 1.99949 14.0916 2.8662 13.2287 3.99792C12.3658 5.12964 11.8381 6.4809 11.7055 7.89784C11.5813 9.22516 11.8086 10.5602 12.3622 11.7694L1.62876 22.5028C0.83642 23.2952 0.84956 24.5838 1.65789 25.3598L2.77945 26.4366C3.56173 27.1876 4.80003 27.1784 5.57101 26.4156L16.4277 15.6765C17.6019 16.1615 18.881 16.3459 20.1485 16.2101C21.5499 16.0598 22.8823 15.5238 23.9973 14.6616C25.1125 13.7994 25.9665 12.6448 26.4645 11.3262C26.9627 10.0076 27.0853 8.57672 26.8187 7.19262Z" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_1223_16189">
                                <rect width="28" height="28" fill="white"/>
                                </clipPath>
                                </defs>
                                </svg>
                        ),
                        label: 'Track service history and vehicle health',
                },
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 10.6455V15.1177" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12.17 4.59862L3.10709 19.7304C2.92026 20.0539 2.82139 20.4208 2.82032 20.7944C2.81925 21.168 2.91602 21.5354 3.10099 21.86C3.28597 22.1846 3.55271 22.4551 3.87468 22.6447C4.19665 22.8342 4.56264 22.9361 4.93623 22.9403H23.0644C23.4378 22.936 23.8036 22.8341 24.1254 22.6446C24.4472 22.4551 24.7139 22.1847 24.8988 21.8603C25.0838 21.5358 25.1806 21.1686 25.1797 20.7952C25.1787 20.4217 25.0801 20.055 24.8935 19.7315L15.8306 4.5975C15.6399 4.28277 15.3713 4.02253 15.0507 3.84191C14.7301 3.6613 14.3683 3.56641 14.0003 3.56641C13.6323 3.56641 13.2706 3.6613 12.9499 3.84191C12.6293 4.02253 12.3607 4.28389 12.17 4.59862Z" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M14 18.4727H14.0112" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

                        ),
                        label: 'Get alerts for upcoming or overdue service',
                },
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.17578 4.74414C7.47312 4.83166 6.77824 4.92268 6.09188 5.007C5.13372 5.12472 4.37648 5.89274 4.3087 6.85572C3.8971 12.7024 3.8971 18.2261 4.3087 24.0727C4.3765 25.0357 5.1339 25.8061 6.09588 25.8869C11.3914 26.3307 16.2336 26.3307 21.5292 25.8869C22.4912 25.8061 23.2486 25.0357 23.3164 24.0727C23.7278 18.2261 23.7278 12.7024 23.3164 6.85572C23.2486 5.89274 22.4912 5.12472 21.5332 5.007C20.8468 4.92268 20.1518 4.83166 19.4492 4.74414" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M11.1242 1.5H16.5002C16.5002 1.5 19.4683 1.5 19.4683 4.468C19.4683 4.468 19.4682 7.438 16.5002 7.438H11.1242C11.1242 7.438 8.15625 7.438 8.15625 4.47C8.15625 4.47 8.15625 1.5 11.1242 1.5Z" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

                        ),
                        label: 'Log costs and maintenance records easily',
                },
        ],
};

export const reportsContent: TabContentProps = {
        image: {
                src: '/images/reports.png',
                alt: 'Reports',
        },
        content: [
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.9375 3.9375V24.0625H24.0625" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M21.8268 10.6455L16.2365 16.2358L11.7643 11.7636L8.41016 15.1177" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                        ),
                        label: 'See exactly how your fleet is performing',
                },
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M27.7203 6.43085V13.9995C27.7203 15.0919 26.5377 15.7747 25.5916 15.2285C25.1525 14.975 24.8821 14.5065 24.8821 13.9995V9.86039L15.9522 18.7914C15.3976 19.3479 14.4964 19.3479 13.9418 18.7914L10.2178 15.0638L2.7071 22.5722C1.93329 23.346 0.611975 22.9919 0.328749 21.9349C0.197291 21.4443 0.337553 20.9209 0.696675 20.5617L9.21141 12.047C9.76601 11.4905 10.6672 11.4905 11.2218 12.047L14.9482 15.7734L22.8716 7.84997H18.7325C17.6401 7.84992 16.9573 6.66728 17.5036 5.72123C17.7571 5.28218 18.2255 5.01172 18.7325 5.01172H26.3012C27.0849 5.01172 27.7203 5.64709 27.7203 6.43085Z" fill="#1A56DB" />
                                </svg>

                        ),
                        label: 'Track revenue, bookings, and profit',
                },
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M23.1416 26.209C24.0424 26.209 24.7696 25.4817 24.7696 24.5809V6.54356C24.7696 6.10953 24.5958 5.68624 24.2811 5.38235L21.0253 2.25672C20.7213 1.95283 20.309 1.79004 19.8858 1.79004H4.85836C3.95765 1.79004 3.23047 2.51722 3.23047 3.41804V24.5809C3.23047 25.4817 3.95765 26.209 4.85836 26.209H23.1416Z" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M10.2969 11.8485L14.0015 8.14355L17.7064 11.8485" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M13.998 8.14355V19.855" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                        ),
                        label: 'Export reports for accounting',
                },
        ],
};

export const pricingContents: PriceCardProps[] = [
        {
                cardTitle: HOST_PLANS.solo.name,
                planTier: 'solo',
                price: HOST_PLANS.solo.price,
                vechileQuantity: HOST_PLANS.solo.vehicleLimit.display,
                description: HOST_PLANS.solo.description,
                features: HOST_PLANS.solo.features,
        },
        {
                badge: HOST_PLANS.flex.badge,
                cardTitle: HOST_PLANS.flex.name,
                planTier: 'flex',
                price: HOST_PLANS.flex.price,
                vechileQuantity: HOST_PLANS.flex.vehicleLimit.display,
                description: HOST_PLANS.flex.description,
                features: HOST_PLANS.flex.features,
        },
        {
                cardTitle: HOST_PLANS.fleet.name,
                planTier: 'fleet',
                price: HOST_PLANS.fleet.price,
                vechileQuantity: HOST_PLANS.fleet.vehicleLimit.display,
                description: HOST_PLANS.fleet.description,
                features: HOST_PLANS.fleet.features,
        },
        {
                cardTitle: 'Enterprise',
                price: 'Custom',
                planTier: 'custom',
                vechileQuantity: '16+ Vehicles',
                description: 'Custom-built for large operations needing dedicated support and platform-level integrations.',
                features: [
                        'Everything in Fleet',
                        'Unlimited vehicles',
                        'Custom API integrations',
                        'Multi-location fleet support',
                        'Dedicated account manager',
                        'SLA-backed escalation support',
                        'White-label platform (your domain)',
                        'Team accounts & role permissions',
                        'Custom reporting & compliance tools',
                ]
        },
]