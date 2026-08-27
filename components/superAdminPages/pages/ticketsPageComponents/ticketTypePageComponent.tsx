"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight as BreadcrumbChevron } from "lucide-react"
import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
} from "@/components/ui/dialog"
import { AdminTicketStatusPill, AdminUserTypePill } from "../../dashboard/statusPill"
import { TableUserCard } from "../settingsPageComponent/adminUsersSettingsPageComponent"
import { formatDate } from "../../utils/formatDate"
import { useGetAdminTicketDetailQuery, useResolveAdminTicketMutation } from "@/app/store/services/adminApi"

type TicketTypePageComponentProps = {
        ticketId: string
}

export default function TicketTypePageComponent({ ticketId }: TicketTypePageComponentProps) {
        const { data, isLoading, isError } = useGetAdminTicketDetailQuery(ticketId)
        const [resolveTicket, { isLoading: isResolving }] = useResolveAdminTicketMutation()

        if (isLoading) {
                return (
                        <section className="p-3 md:p-8">
                                <span className="text-gray-400 text-sm font-normal font-text">Loading ticket…</span>
                        </section>
                )
        }

        if (isError || !data?.data) {
                return (
                        <section className="p-3 md:p-8">
                                <span className="text-gray-400 text-sm font-normal font-text">Ticket not found.</span>
                        </section>
                )
        }

        const ticket = data.data

        return (
                <section className="p-3 md:p-8 space-y-6">
                        {/* Breadcrumb */}
                        <div className="flex gap-2 items-center">
                                <Link
                                        href="/admin/tickets"
                                        className="text-gray-500 text-sm font-normal font-text leading-5 hover:text-gray-700 transition-colors"
                                >
                                        Tickets
                                </Link>
                                <BreadcrumbChevron className="size-4 text-[#6B7280]" />
                                <span className="text-cyan-600 text-sm font-semibold font-text leading-5">
                                        Ticket Details
                                </span>
                        </div>

                        {/* Header */}
                        <div className="w-full flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                                <div className="flex items-center flex-wrap gap-3">
                                        <h2 className="text-blue-700 text-2xl md:text-3xl font-semibold font-text">
                                                {ticket.ticketCode}
                                        </h2>
                                        <AdminTicketStatusPill status={ticket.status} />
                                        <AdminUserTypePill status={ticket.submitterType} />
                                        {ticket.isUrgent && (
                                                <span className="px-2.5 py-1 bg-rose-100 rounded-full flex justify-center items-center text-red-500 text-xs font-semibold font-text leading-4">
                                                        Urgent
                                                </span>
                                        )}
                                </div>

                                {ticket.status !== "resolved" && (
                                        <Dialog>
                                                <DialogTrigger asChild>
                                                        <button
                                                                disabled={isResolving}
                                                                className="text-white text-nowrap text-sm font-semibold font-text py-3 px-8 rounded-xs border bg-emerald-500 border-emerald-500 hover:bg-emerald-700 hover:border-emerald-700 flex justify-center items-center gap-2.5 cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none w-fit"
                                                        >
                                                                Mark as Resolved
                                                        </button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-sm px-6">
                                                        <DialogHeader>
                                                                <DialogTitle className="text-neutral-950 text-lg font-semibold font-text">
                                                                        Confirm Resolution
                                                                </DialogTitle>
                                                                <DialogDescription className="text-gray-500 text-sm font-normal font-text">
                                                                        Are you sure you want to mark ticket <span className="font-semibold text-neutral-950">{ticket.ticketCode}</span> as resolved? This action cannot be undone.
                                                                </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter className="mt-4">
                                                                <DialogClose asChild>
                                                                        <button className="px-5 py-2.5 text-gray-700 text-sm font-medium font-text bg-white rounded-xs border border-gray-300 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                                                                                Cancel
                                                                        </button>
                                                                </DialogClose>
                                                                <DialogClose asChild>
                                                                        <button
                                                                                onClick={() => resolveTicket({ ticketId })}
                                                                                className="px-5 py-2.5 text-white text-sm font-medium font-text bg-emerald-500 rounded-xs hover:bg-emerald-700 transition-colors duration-200 cursor-pointer"
                                                                        >
                                                                                Yes, Mark Resolved
                                                                        </button>
                                                                </DialogClose>
                                                        </DialogFooter>
                                                </DialogContent>
                                        </Dialog>
                                )}
                        </div>

                        {/* Details */}
                        <div className="bg-white rounded-lg border border-gray-200 p-5 md:p-8 space-y-6">
                                <div className="flex flex-wrap gap-8">
                                        <DetailField label="Submitted By">
                                                <TableUserCard name={ticket.submitterName} email={ticket.submitterEmail || "—"} />
                                        </DetailField>
                                        <DetailField label="Type">
                                                <span className="text-neutral-950 text-sm font-normal font-text capitalize">{ticket.issueType}</span>
                                        </DetailField>
                                        <DetailField label="Booking Reference">
                                                <span className="text-neutral-950 text-sm font-normal font-text">{ticket.bookingReference}</span>
                                        </DetailField>
                                        <DetailField label="Date Submitted">
                                                <span className="text-neutral-950 text-sm font-normal font-text">{formatDate(ticket.dateSubmitted)}</span>
                                        </DetailField>
                                </div>

                                <div className="space-y-1.5">
                                        <span className="text-gray-500 text-xs uppercase font-semibold font-text">Description</span>
                                        <p className="text-neutral-950 text-sm font-normal font-text leading-6">{ticket.description}</p>
                                </div>

                                {ticket.photoUrls.length > 0 && (
                                        <div className="space-y-1.5">
                                                <span className="text-gray-500 text-xs uppercase font-semibold font-text">Photos</span>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                        {ticket.photoUrls.map((url, index) => (
                                                                <div key={index} className="relative rounded-md overflow-clip border border-gray-200">
                                                                        <Image
                                                                                src={url}
                                                                                alt={`Attachment ${index + 1}`}
                                                                                width={250}
                                                                                height={250}
                                                                                className="object-cover object-center aspect-square"
                                                                        />
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>
                                )}

                                {ticket.status === "resolved" && (
                                        <div className="space-y-1.5 border-t border-gray-200 pt-6">
                                                <span className="text-gray-500 text-xs uppercase font-semibold font-text">Resolution</span>
                                                {ticket.responseMessage && (
                                                        <p className="text-neutral-950 text-sm font-normal font-text leading-6">{ticket.responseMessage}</p>
                                                )}
                                                <span className="block text-gray-500 text-xs font-normal font-text">
                                                        Resolved by {ticket.respondedBy || "Admin"}{ticket.responseDate ? ` on ${formatDate(ticket.responseDate)}` : ""}
                                                </span>
                                        </div>
                                )}
                        </div>
                </section>
        )
}

const DetailField = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div className="flex flex-col gap-1.5">
                <span className="text-gray-500 text-xs uppercase font-semibold font-text">{label}</span>
                {children}
        </div>
)
