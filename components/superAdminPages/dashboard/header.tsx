"use client"

import { useMemo, useState } from "react"
import { getInitials } from "@/components/pages/profilePages/utils"
import { useSidebar } from "@/components/ui/sidebar"
import { ChevronDown, LogOut, Search, Menu } from "lucide-react"
import Image from "next/image"
import { userContent } from "@/constants/superAdminSidebar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Notification } from "@/components/hostComponents/notification/notification"
import { NotificationCardProps } from "@/components/hostComponents/types/navbar.type"

const INITIAL_TODAY_NOTIFICATIONS: NotificationCardProps[] = [
        {
                id: "admin-notif-1",
                title: "New Renter Joined",
                description: "Marcus Chen registered and submitted identity verification documents.",
                time: "10 mins ago",
                unread: true,
                notificationType: "newRenter",
                category: "renters",
                href: "/admin/renters",
        },
        {
                id: "admin-notif-2",
                title: "New Support Ticket",
                description: "Ticket #TCK-2041 created: Mechanical issue reported during trip.",
                time: "25 mins ago",
                unread: true,
                notificationType: "newTicket",
                category: "tickets",
                href: "/admin/tickets",
        },
        {
                id: "admin-notif-3",
                title: "Subscription Upgraded",
                description: "Apex Fleet upgraded subscription from Solo to Fleet Plan.",
                time: "1 hour ago",
                unread: true,
                notificationType: "subscriberUpgrade",
                category: "subscribers",
                href: "/admin/subscribers",
        },
];

const INITIAL_EARLIER_NOTIFICATIONS: NotificationCardProps[] = [
        {
                id: "admin-notif-4",
                title: "New Subscriber Joined",
                description: "Skyline Auto Group subscribed to the Fleet Plan.",
                time: "Yesterday",
                unread: false,
                notificationType: "subscriberJoin",
                category: "subscribers",
                href: "/admin/subscribers",
        },
        {
                id: "admin-notif-5",
                title: "Subscription Renewed",
                description: "Horizon Motors renewed their Solo Plan monthly billing.",
                time: "2 days ago",
                unread: false,
                notificationType: "subscriberRenew",
                category: "subscribers",
                href: "/admin/subscribers",
        },
        {
                id: "admin-notif-6",
                title: "Subscription Cancelled",
                description: "Velo Drive cancelled their Flex Plan subscription.",
                time: "3 days ago",
                unread: false,
                notificationType: "subscriberCancel",
                category: "subscribers",
                href: "/admin/subscribers",
        },
        {
                id: "admin-notif-7",
                title: "Subscription Downgraded",
                description: "Urban Wheels downgraded from Fleet Plan to Solo Plan.",
                time: "4 days ago",
                unread: false,
                notificationType: "subscriberDowngrade",
                category: "subscribers",
                href: "/admin/subscribers",
        },
];

export function DashboardHeader() {
        const { toggleSidebar } = useSidebar()

        const [todayNotifications, setTodayNotifications] = useState<NotificationCardProps[]>(
                INITIAL_TODAY_NOTIFICATIONS
        )
        const [earlierNotifications, setEarlierNotifications] = useState<NotificationCardProps[]>(
                INITIAL_EARLIER_NOTIFICATIONS
        )

        const unreadCount = useMemo(() => {
                return (
                        todayNotifications.filter((n) => n.unread).length +
                        earlierNotifications.filter((n) => n.unread).length
                )
        }, [todayNotifications, earlierNotifications])

        const handleMarkAllAsRead = () => {
                setTodayNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
                setEarlierNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
        }

        const handleItemClick = (id: string) => {
                setTodayNotifications((prev) =>
                        prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
                )
                setEarlierNotifications((prev) =>
                        prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
                )
        }

        return (
                <header className="sticky top-0 z-10 flex items-center justify-between gap-4 h-16 px-2.5 md:px-6 bg-white border-b border-gray-100">
                        {/* Mobile-only hamburger */}
                        <button
                                onClick={toggleSidebar}
                                className="md:hidden flex items-center justify-center size-9 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-300 shrink-0 cursor-pointer"
                        >
                                <Menu className="size-5" />
                        </button>

                        {/* Search */}
                        <div className="relative flex items-center w-full max-w-md">
                                <Search className="absolute left-3 size-4 text-gray-400 pointer-events-none shrink-0" />
                                <input
                                        type="text"
                                        placeholder="Search vehicles, bookings, customers..."
                                        className={[
                                                "w-full pl-9 pr-4 py-2 rounded-lg",
                                                "bg-gray-50 border border-gray-300",
                                                "text-xs text-[#0B0B0B]/50 placeholder:text-gray-400 font-text",
                                                "outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                                "transition-all duration-200",
                                        ].join(" ")}
                                />
                        </div>

                        {/* Right — Avatar & Notifications */}
                        <div className="flex items-center gap-4">
                                <Notification
                                        role="superAdmin"
                                        unreadCount={unreadCount}
                                        today={todayNotifications}
                                        earlier={earlierNotifications}
                                        onMarkAllAsRead={handleMarkAllAsRead}
                                        onItemClick={handleItemClick}
                                />
                                <HeaderAvatar user={userContent} />
                        </div>
                </header>
        )
}

type HeaderAvatarProps = {
        user: {
                fullname: string
                avatar?: string
        }
}

const HeaderAvatar = ({ user }: HeaderAvatarProps) => {
        const userInitials = getInitials(user.fullname)

        const handleLogout = () => {
                console.log("user logout")
        }

        return (
                <div className="flex gap-2 items-center justify-start">
                        <div className="rounded-full aspect-square size-10 overflow-clip bg-blue-700 text-white flex items-center justify-center text-sm font-semibold font-text shrink-0">
                                {user.avatar ? (
                                        <Image
                                                src={user.avatar}
                                                alt={user.fullname}
                                                title={user.fullname}
                                                width={40}
                                                height={40}
                                                className="w-full aspect-square object-cover"
                                        />
                                ) : (
                                        userInitials
                                )}
                        </div>
                        <Popover>
                                <PopoverTrigger asChild>
                                        <button className="cursor-pointer">
                                                <ChevronDown className="size-4" />
                                        </button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-25">
                                        <button
                                                className="flex items-center justify-start gap-2 cursor-pointer text-red-500 hover:text-red-900 transition-colors duration-300"
                                                onClick={handleLogout}
                                        >
                                                <LogOut className="size-4" />
                                                <span>
                                                        logout
                                                </span>
                                        </button>
                                </PopoverContent>
                        </Popover>

                </div>
        )
}