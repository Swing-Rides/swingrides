"use client"

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { EllipsisVertical, Search } from "lucide-react"
import { SelectUI } from "../subscribersPageComponents"
import { adminUsersRoleItems, AdminUsersRoleType, adminUsersStatusItems, AdminUsersStatusType } from "../../utils/helpers"
import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from "@/components/ui/table";
import {
        Popover,
        PopoverContent,
        PopoverTrigger,
} from "@/components/ui/popover"
import { getInitials } from "@/components/pages/profilePages/utils";


export default function AdminUsersSettingsPageComponent() {

        const row = [
                {
                        id: "12334",
                        name: "name",
                        email: "emai@mail.cc",
                        role: "admin",
                        status: "active",
                        lastActive: "2 hours ago",
                        dateAdded: "15 Jan, 2024",
                },
                {
                        id: "12434",
                        name: "name",
                        email: "emai@mail.cc",
                        role: "admin",
                        status: "invited",
                        lastActive: "2 hours ago",
                        dateAdded: "15 Jan, 2024",
                },
                {
                        id: "12534",
                        name: "name",
                        email: "emai@mail.cc",
                        role: "admin",
                        status: "suspended",
                        lastActive: "2 hours ago",
                        dateAdded: "15 Jan, 2024",
                },
        ]

        return (
                <div className='p-3 md:p-8'>
                        <div className="space-y-8">
                                <PageTitle/>
                                <Suspense>
                                        <AdminUserListTable 
                                                adminUserRows={row}
                                        />
                                </Suspense>
                        </div>
                </div>
        )
}

const PageTitle = () => {
        return (
                <section className='flex justify-between items-center gap-5'>
                        <div className='flex flex-col gap-1.25'>
                                <h2 className="text-neutral-950 text-2xl font-semibold font-text">
                                        Admin Users
                                </h2>
                                <span className="text-gray-500 text-sm font-normal font-text">
                                        Manage admin access, roles, and monitor platform activity
                                </span>
                        </div>
                        <div>
                                <button className="py-2 px-10 bg-blue-700 rounded-xs text-white text-sm font-semibold font-text capitalize hover:bg-blue-900 transition-color duration-300 cursor-pointer">
                                        Invite Admin
                                </button>
                        </div>
                </section>
        )
}

type AdminUserListTableProps = {
        adminUserRows: {
                id:string;
                name:string;
                email:string;
                role: AdminUsersRoleType;
                status: AdminUsersStatusType;
                lastActive: string;
                dateAdded: string;
        }[]
}

const AdminUserListTable = ({ adminUserRows }: AdminUserListTableProps) => {
        return (
                <div className="space-y-5 md:space-y-8">
                        <SearchFilterSection />
                        <Table className="py-2.5 bg-white rounded-lg border border-gray-200">
                                <TableHeader className="bg-gray-100">
                                        <TableRow>
                                                <TableHead className="pl-5 text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight">
                                                        User
                                                </TableHead>
                                                <TableHead className="text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight">
                                                        Role
                                                </TableHead>
                                                <TableHead className="text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight">
                                                        Status
                                                </TableHead>
                                                <TableHead className="text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight">
                                                        Last Active
                                                </TableHead>
                                                <TableHead className="pr-5 text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight">
                                                        Date Added
                                                </TableHead>
                                                <TableHead className="pr-5 text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight">
                                                        Actions
                                                </TableHead>
                                        </TableRow>
                                </TableHeader>
                                <TableBody>
                                        {adminUserRows.length === 0 ? (
                                                <TableRow>
                                                        <TableCell
                                                                colSpan={5}
                                                                className="text-center py-16 text-gray-400 text-sm"
                                                        >
                                                                No user data match your filters.
                                                        </TableCell>
                                                </TableRow>
                                        ) : (adminUserRows.map((item) => (
                                                <TableRow key={item.id} className="px-5">
                                                        <TableCell className="pl-5">
                                                                <TableUserCard 
                                                                        name={item.name}
                                                                        email={item.email}
                                                                />
                                                        </TableCell>
                                                        <TableCell>
                                                                {item.role}
                                                        </TableCell>
                                                        <TableCell>
                                                                <span className="text-neutral-950 text-sm font-medium font-text leading-5">
                                                                        {item.status}
                                                                </span>
                                                        </TableCell>
                                                        <TableCell>
                                                                <span className="text-gray-500 text-sm font-normal font-text leading-5">
                                                                        {item.lastActive}
                                                                </span>
                                                        </TableCell>
                                                        <TableCell className="pr-5">
                                                                {item.dateAdded}
                                                        </TableCell>
                                                        <TableCell className="pr-5">
                                                                <Popover>
                                                                        <PopoverTrigger asChild>
                                                                                <EllipsisVertical className="size-5" />
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="max-w-62.5 w-full">
                                                                                <button>
                                                                                        Edit Role
                                                                                </button>
                                                                        </PopoverContent>
                                                                </Popover>
                                                        </TableCell>
                                                </TableRow>))
                                        )}
                                </TableBody>
                        </Table>
                </div>
        )
}

const SearchFilterSection = () => {

        const router = useRouter();
        const pathname = usePathname();
        const searchParams = useSearchParams();

        const setParam = useCallback(
                (key: string, value: string) => {
                        const params = new URLSearchParams(searchParams.toString());
                        if (value) params.set(key, value);
                        else params.delete(key);
                        // reset page on filter change, but not when navigating pages
                        if (key !== "page") params.delete("page");
                        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                },
                [router, pathname, searchParams],
        );

        const search = searchParams.get("search") ?? "";

        return (
                <div className="flex flex-wrap gap-4 items-center p-4 bg-white rounded-[10px] border border-gray-200">
                        {/* Search */}
                        <div className="relative flex items-center w-full max-w-6xl">
                                <Search className="absolute left-3 size-4 text-gray-400 pointer-events-none shrink-0" />
                                <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setParam("search", e.target.value)}
                                        placeholder="Search by name, owner or ID..."
                                        className={[
                                                "w-full pl-9 pr-4 py-2 rounded-lg",
                                                "bg-gray-50 border border-gray-300",
                                                "text-xs text-[#0B0B0B]/50 placeholder:text-gray-400 font-text",
                                                "outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                                "transition-all duration-200",
                                        ].join(" ")}
                                />
                        </div>
        
                        <SelectUI title="All Roles" items={adminUsersRoleItems} paramKey="status" />
                        <SelectUI title="All Status" items={adminUsersStatusItems} paramKey="plan" />
                </div>
        )
}

const TableUserCard = ({ name, email }: { name:string; email: string; }) => {
        return (
                <div className="flex items-center justify-start gap-3">
                        <div className="flex justify-center items-center aspect-square size-10 rounded-full text-white bg-blue-700">
                                {getInitials(name)}
                        </div>
                        <div className="flex flex-col gap-px">
                                <span className="text-neutral-950 text-sm font-semibold font-text leading-5">
                                        {name}
                                </span>
                                <span className="text-gray-500 text-xs font-normal font-text leading-4">
                                        {email}
                                </span>
                        </div>
                </div>
        )
}