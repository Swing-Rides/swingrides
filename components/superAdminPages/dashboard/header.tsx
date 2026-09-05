"use client"

import { useMemo } from "react"
import { getInitials } from "@/components/pages/profilePages/utils"
import { useSidebar } from "@/components/ui/sidebar"
import { ChevronDown, Loader2, LogOut, Search, Menu, UserPlus, Calendar, CreditCard, Ticket, Star, TriangleAlert, Bell } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { adminApi, useAdminLogoutMutation } from "@/app/store/services/adminApi"
import { userContent } from "@/constants/superAdminSidebar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Notification, formatRelativeTime, isToday } from "@/components/hostComponents/notification/notification"
import { NotificationCardProps } from "@/components/hostComponents/types/navbar.type"
import {
        AdminNotificationCategory,
        useGetAdminNotificationsQuery,
        useMarkAdminNotificationAsReadMutation,
        useMarkAllAdminNotificationsAsReadMutation,
} from "@/app/store/services/adminNotificationApi"
import { resetAdminApiState } from "@/app/store/resetState"

const CATEGORY_ICON: Record<AdminNotificationCategory, React.ReactNode> = {
        registrations: (
                <div className="size-9 bg-cyan-600/10 rounded-full flex justify-center items-center">
                        <UserPlus className="size-5 text-cyan-600" />
                </div>
        ),
        bookings: (
                <div className="size-9 bg-blue-700/10 rounded-full flex justify-center items-center">
                        <Calendar className="size-5 text-blue-700" />
                </div>
        ),
        billing: (
                <div className="size-9 bg-emerald-500/10 rounded-full flex justify-center items-center">
                        <CreditCard className="size-5 text-emerald-500" />
                </div>
        ),
        reports: (
                <div className="size-9 bg-amber-500/10 rounded-full flex justify-center items-center">
                        <Ticket className="size-5 text-amber-500" />
                </div>
        ),
        reviews: (
                <div className="size-9 bg-indigo-600/10 rounded-full flex justify-center items-center">
                        <Star className="size-5 text-indigo-600" />
                </div>
        ),
        alerts: (
                <div className="size-9 bg-red-500/10 rounded-full flex justify-center items-center">
                        <TriangleAlert className="size-5 text-red-500" />
                </div>
        ),
        system: (
                <div className="size-9 bg-gray-500/10 rounded-full flex justify-center items-center">
                        <Bell className="size-5 text-gray-500" />
                </div>
        ),
}

export function DashboardHeader() {
        const { toggleSidebar } = useSidebar()

        const { data } = useGetAdminNotificationsQuery({ limit: 50 }, { pollingInterval: 30_000 })
        const [markAsRead] = useMarkAdminNotificationAsReadMutation()
        const [markAllAsRead] = useMarkAllAdminNotificationsAsReadMutation()

        const { todayNotifications, earlierNotifications } = useMemo(() => {
                const raw = data?.data.notifications ?? []
                const today: NotificationCardProps[] = []
                const earlier: NotificationCardProps[] = []

                raw.forEach((n) => {
                        const card: NotificationCardProps = {
                                id: n._id,
                                title: n.title,
                                unread: !n.isRead,
                                description: n.message,
                                time: formatRelativeTime(n.createdAt),
                                category: n.category,
                                href: n.actionUrl || "#",
                                icon: CATEGORY_ICON[n.category],
                        }
                                ; (isToday(n.createdAt) ? today : earlier).push(card)
                })

                return { todayNotifications: today, earlierNotifications: earlier }
        }, [data])

        const unreadCount = data?.data.summary.unreadCount ?? 0

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
                                {/* <Search className="absolute left-3 size-4 text-gray-400 pointer-events-none shrink-0" />
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
                                /> */}
                        </div>

                        {/* Right — Avatar & Notifications */}
                        <div className="flex items-center gap-4">
                                <Notification
                                        role="superAdmin"
                                        unreadCount={unreadCount}
                                        today={todayNotifications}
                                        earlier={earlierNotifications}
                                        onMarkAllAsRead={() => markAllAsRead()}
                                        onItemClick={(id) => markAsRead(id)}
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
        const [adminLogout, { isLoading }] = useAdminLogoutMutation()
        const dispatch = useDispatch()
        const router = useRouter()

        // Success and failure toasts are raised by adminApi's base query, which
        // shows the response `message` for any mutating request, so there is
        // nothing to announce here.
        const handleLogout = async () => {
                try {
                        await adminLogout().unwrap()
                        // Drop every cached admin response before leaving: the next
                        // person to sign in on this machine must not briefly see the
                        // previous admin's data while their own requests are in flight.
                        resetAdminApiState(dispatch)
                        router.replace("/admin/login")
                } catch (error) {
                        // Only the server can clear the httpOnly cookie, so a failed
                        // request means the session is still live — stay put rather
                        // than redirecting to a page that would bounce straight back.
                        resetAdminApiState(dispatch)
                        router.replace("/admin/login")
                }
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
                                                className="flex items-center justify-start gap-2 cursor-pointer text-red-500 hover:text-red-900 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                                onClick={handleLogout}
                                                disabled={isLoading}
                                        >
                                                {isLoading ? (
                                                        <Loader2 className="size-4 animate-spin" />
                                                ) : (
                                                        <LogOut className="size-4" />
                                                )}
                                                <span>
                                                        logout
                                                </span>
                                        </button>
                                </PopoverContent>
                        </Popover>

                </div>
        )
}
