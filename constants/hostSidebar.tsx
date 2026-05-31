import { BarChart3, Calendar, Car, FileExclamationPoint, Receipt, Settings, Star, Wrench } from "lucide-react"

export const userContent = {
        fullname: 'Metro Rentals',
        role: 'Host Account',
}

export const sidebarContent = [
        {
                title: 'Main',
                menu: [
                        {
                                icon: (
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.49969 2.5H3.33328C2.87307 2.5 2.5 2.87307 2.5 3.33328V9.16625C2.5 9.62646 2.87307 9.99953 3.33328 9.99953H7.49969C7.95989 9.99953 8.33297 9.62646 8.33297 9.16625V3.33328C8.33297 2.87307 7.95989 2.5 7.49969 2.5Z" stroke="currentColor" strokeWidth="1.66656" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M16.6657 2.5H12.4993C12.0391 2.5 11.666 2.87307 11.666 3.33328V5.83312C11.666 6.29333 12.0391 6.6664 12.4993 6.6664H16.6657C17.1259 6.6664 17.499 6.29333 17.499 5.83312V3.33328C17.499 2.87307 17.1259 2.5 16.6657 2.5Z" stroke="currentColor" strokeWidth="1.66656" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M16.6657 9.99902H12.4993C12.0391 9.99902 11.666 10.3721 11.666 10.8323V16.6653C11.666 17.1255 12.0391 17.4986 12.4993 17.4986H16.6657C17.1259 17.4986 17.499 17.1255 17.499 16.6653V10.8323C17.499 10.3721 17.1259 9.99902 16.6657 9.99902Z" stroke="currentColor" strokeWidth="1.66656" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M7.49969 13.332H3.33328C2.87307 13.332 2.5 13.7051 2.5 14.1653V16.6652C2.5 17.1254 2.87307 17.4984 3.33328 17.4984H7.49969C7.95989 17.4984 8.33297 17.1254 8.33297 16.6652V14.1653C8.33297 13.7051 7.95989 13.332 7.49969 13.332Z" stroke="currentColor" strokeWidth="1.66656" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                ),
                                label: 'Dashboard',
                                url: '/'
                        },
                        {
                                icon: (<Car />),
                                label: 'Fleet',
                                url: '/fleet'
                        },
                        {
                                icon: (<Calendar />),
                                label: 'Bookings',
                                url: '/bookings'
                        },
                ]
        },
        {
                title: 'OPERATIONS',
                menu: [
                        {
                                icon: (<Wrench />),
                                label: 'Maintenance',
                                url: '/maintenance'
                        },
                        {
                                icon: (<Receipt />),
                                label: 'Expenses',
                                url: '/expenses'
                        }
                ]
        },
        {
                title: 'MANAGEMENT',
                menu: [
                        {
                                icon: (<BarChart3 /> ),
                                label: 'Reports',
                                url: '/reports',
                        },
                        {
                                icon: (<Star />),
                                label: 'Reviews',
                                url: '/reviews'
                        }
                ]
        },
        {
                title: 'SYSTEM',
                menu: [
                        {
                                icon: (<Settings /> ),
                                label: 'Settings',
                                url: '/settings',
                        },
                        {
                                icon: (<FileExclamationPoint />),
                                label: 'Report an Issue',
                                url: '/report-an-issue'
                        }
                ]
        },
]