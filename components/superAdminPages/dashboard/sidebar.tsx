"use client"

import Logo from "@/components/headerNav/logo"
import { getInitials } from "@/components/pages/profilePages/utils"
import {
        Sidebar,
        SidebarContent,
        SidebarFooter,
        SidebarGroup,
        SidebarHeader,
        SidebarGroupLabel,
        SidebarGroupContent,
        SidebarMenu,
        SidebarMenuItem,
        SidebarMenuSub,
        SidebarMenuSubItem,
        useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useState } from "react"
import { sidebarContent, userContent } from "@/constants/superAdminSidebar"
import { AnimatePresence, motion } from "motion/react"

const linkBase = [
        "flex items-center gap-3 py-2 px-3 w-full rounded-[10px]",
        "border-l-4 transition-all duration-200",
        "text-sm font-medium leading-5",
        "[&_svg]:transition-colors [&_svg]:duration-200 [&_svg]:size-5 [&_svg]:shrink-0",
].join(" ")

const linkInactive = [
        "border-l-transparent text-gray-500 [&_svg]:text-gray-400",
        "hover:border-l-blue-700 hover:bg-indigo-50 hover:text-gray-900 hover:[&_svg]:text-blue-700",
].join(" ")

const linkActive = [
        "border-l-blue-700 bg-indigo-50 text-blue-700 [&_svg]:text-blue-700",
].join(" ")


type MenuItem = {
        icon: React.ReactNode
        label: string
        url: string
        subMenu?: Omit<MenuItem, "subMenu">[]
}


export function SuperAdminSidebar() {
        return (
                <Sidebar collapsible="icon">
                        <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
                                <LogoCard />
                        </SidebarHeader>

                        <SidebarContent className="py-2">
                                {sidebarContent.map((section) => (
                                        <SidebarGroup key={section.title} className="px-3 py-1">
                                                <SidebarGroupLabel className="text-zinc-800 text-xs font-semibold font-text uppercase leading-4">
                                                        {section.title}
                                                </SidebarGroupLabel>
                                                <SidebarGroupContent>
                                                        <SidebarMenu className="gap-1">
                                                                {section.menu.map((item) => (
                                                                        <NavItem key={item.label} item={item} />
                                                                ))}
                                                        </SidebarMenu>
                                                </SidebarGroupContent>
                                        </SidebarGroup>
                                ))}
                        </SidebarContent>

                        <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
                                <UserCard user={userContent} />
                                <SidebarTriggerButton />
                        </SidebarFooter>
                </Sidebar>
        )
}

function NavItem({ item }: { item: MenuItem }) {
        const pathname = usePathname()
        const { state } = useSidebar()
        const isCollapsed = state === "collapsed"

        const isActive = pathname === item.url
        const hasSubMenu = Boolean(item.subMenu?.length)
        const isSubMenuActive = hasSubMenu && item.subMenu!.some((sub) => pathname === sub.url)

        const [isOpen, setIsOpen] = useState(isSubMenuActive)

        const itemPadding = isCollapsed ? "px-0 justify-center" : "px-3"

        if (!hasSubMenu) {
                return (
                        <SidebarMenuItem>
                                <Link 
                                        href={item.url}
                                        className={[linkBase, itemPadding, isActive ? linkActive : linkInactive].join(" ")}
                                >
                                        {item.icon}
                                        {!isCollapsed && <span>{item.label}</span>}
                                </Link>
                        </SidebarMenuItem>
                )
        }

        return (
                <SidebarMenuItem>
                        <button
                                onClick={() => setIsOpen((prev) => !prev)}
                                className={[
                                        linkBase,
                                        itemPadding,
                                        isActive || isSubMenuActive ? linkActive : linkInactive,
                                        !isCollapsed && "justify-between",
                                ].join(" ")}
                        >
                                <span className="flex items-center gap-3">
                                        {item.icon}
                                        {!isCollapsed && <span>{item.label}</span>}
                                </span>
                                {!isCollapsed && (
                                        <motion.span
                                                animate={{ rotate: isOpen ? 90 : 0 }}
                                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                                className="flex items-center shrink-0"
                                        >
                                                <ChevronRight className="size-4 text-gray-400" />
                                        </motion.span>
                                )}
                        </button>

                        <AnimatePresence initial={false}>
                                {isOpen && !isCollapsed && (
                                        <motion.div
                                                key="submenu"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                                style={{ overflow: "hidden" }}
                                        >
                                                <SidebarMenuSub className="ml-4 mt-0.5 border-l border-gray-100 pl-2 gap-0.5">
                                                        {item.subMenu!.map((subItem, i) => {
                                                                const subIsActive = pathname === subItem.url
                                                                return (
                                                                        <SidebarMenuSubItem key={subItem.label}>
                                                                                <motion.div
                                                                                        initial={{ x: -6, opacity: 0 }}
                                                                                        animate={{ x: 0, opacity: 1 }}
                                                                                        transition={{
                                                                                                duration: 0.2,
                                                                                                delay: i * 0.05,
                                                                                                ease: "easeOut",
                                                                                        }}
                                                                                >
                                                                                        <Link
                                                                                                href={subItem.url}
                                                                                                className={[
                                                                                                        linkBase,
                                                                                                        "px-3",
                                                                                                        subIsActive ? linkActive : linkInactive,
                                                                                                ].join(" ")}
                                                                                        >
                                                                                                {subItem.icon}
                                                                                                <span>{subItem.label}</span>
                                                                                        </Link>
                                                                                </motion.div>
                                                                        </SidebarMenuSubItem>
                                                                )
                                                        })}
                                                </SidebarMenuSub>
                                        </motion.div>
                                )}
                        </AnimatePresence>
                </SidebarMenuItem>
        )
}

const LogoCard = () => {
        const { state } = useSidebar()
        return (
                <div className={state === "collapsed" ? "flex justify-center" : ""}>
                        <Logo />
                </div>
        )
}

type UserCardProps = {
        user: {
                fullname: string
                avatar?: string
                role: string
        }
}

const UserCard = ({ user }: UserCardProps) => {
        const { state } = useSidebar()
        const isCollapsed = state === "collapsed"
        const userInitials = getInitials(user.fullname)

        return (
                <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
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

                        {!isCollapsed && (
                                <div className="flex flex-col gap-1.5 min-w-0 cursor-pointer">
                                        <span className="text-neutral-950 text-sm font-medium font-text leading-5 truncate">
                                                {user.fullname}
                                        </span>
                                        <span className="text-xs truncate py-0.5 px-2 rounded-full text-blue-700 bg-[#EBF0FB]">
                                                {user.role}
                                        </span>
                                </div>
                        )}
                </div>
        )
}

const SidebarTriggerButton = () => {
        const { toggleSidebar, state } = useSidebar()
        const isCollapsed = state === "collapsed"

        return (
                <button
                        onClick={toggleSidebar}
                        className={[
                                "flex items-center gap-3 py-2 px-3 w-full rounded-[10px]",
                                "text-sm font-medium text-gray-500",
                                "hover:bg-indigo-50 hover:text-gray-900",
                                "transition-colors duration-200",
                                isCollapsed ? "justify-center" : "",
                        ].join(" ")}
                >
                        {isCollapsed
                                ? <PanelLeftOpen className="size-5 shrink-0" />
                                : <>
                                        <PanelLeftClose className="size-5 shrink-0" />
                                        <span>Collapse sidebar</span>
                                </>
                        }
                </button>
        )
}