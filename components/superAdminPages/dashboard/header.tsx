"use client"

import { getInitials } from "@/components/pages/profilePages/utils"
import { Search } from "lucide-react"
import Image from "next/image"
import { userContent } from "@/constants/superAdminSidebar"

export function DashboardHeader() {
        return (
                <header className="sticky top-0 z-10 flex items-center justify-between gap-4 h-16 px-6 bg-white border-b border-gray-100">

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

                        {/* Right — Avatar */}
                        <HeaderAvatar user={userContent} />
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

        return (
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
        )
}