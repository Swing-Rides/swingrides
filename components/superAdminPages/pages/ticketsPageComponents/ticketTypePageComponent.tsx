// import Link from "next/link";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   ChevronRight as BreadcrumbChevron,
//   Trash,
//   Download,
// } from "lucide-react";
// import { AdminTicketStatusPill, AdminUserTypePill } from "../../dashboard/statusPill";

export default function TicketTypePageComponent() {
        return (
                <section className="p-3 md:p-8">
                        
                </section>
        )
}

// const technicalIssueButtons = [
//         {
//                 label: "Mark as Resolved",
//                 type: "approve",
//                 onClick: () => console.log("request approved"),
//         },
//         {
//                 label: "Close Ticket",
//                 type: "close",
//                 onClick: () => console.log("Close Ticket"),
//         },
// ]

// const relistRequest = [
//         {
//                 label: "Approve Relist",
//                 type: "approve",
//                 onClick: () => console.log("Approve Relist"),
//         },
//         {
//                 label: "Reject",
//                 type: "reject",
//                 onClick: () => console.log("Reject Relist"),
//         },
//         {
//                 label: "Close Ticket",
//                 type: "close",
//                 onClick: () => console.log("Close Ticket"),
//         },
// ]

// const damageReport = [
//         {
//                 label: "Mark as Resolved",
//                 type: "approve",
//                 onClick: () => console.log("Mark as Resolved"),
//         },
//         {
//                 label: "Reject",
//                 type: "reject",
//                 onClick: () => console.log("Reject Relist"),
//         },
//         {
//                 label: "Close Ticket",
//                 type: "close",
//                 onClick: () => console.log("Close Ticket"),
//         },
// ]

// const incidentalCharges = [
//         {
//                 label: "Approve incidental charge",
//                 type: "approve",
//                 onClick: () => console.log("Approve incidental charge"),
//         },
//         {
//                 label: "Reject Insufficient Evidence",
//                 type: "reject",
//                 onClick: () => console.log("Reject Insufficient Evidence"),
//         },
//         {
//                 label: "Close Ticket",
//                 type: "close",
//                 onClick: () => console.log("Close Ticket"),
//         },
// ]

// const PageHeader = ({ ticketId, ticketStatus, userType, ticketType }) => {

//         const buttons = ticketType === "technical issue" ? damageReport
//                 : ticketType === "relist request" ? relistRequest
//                         : ticketType === "incidental charges" ? incidentalCharges
//                                 : damageReport

//         return (
//                 <div className="space-y-5">
//                         {/* Breadcrumb */}
//                         <div className="flex gap-2 items-center mb-3 md:mb-8">
//                                 <Link
//                                         href="/admin/tickets"
//                                         className="text-gray-500 text-sm font-normal font-text leading-5 hover:text-gray-700 transition-colors"
//                                 >
//                                         Tickets
//                                 </Link>
//                                 <BreadcrumbChevron className="size-4 text-[#6B7280]" />
//                                 <span className="text-cyan-600 text-sm font-semibold font-text leading-5">
//                                         Ticket Details
//                                 </span>
//                         </div>

//                         {/* Header */}
//                         <div className="w-full flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
//                                 <div className="flex flex-col gap-1.25">
//                                         <div className="flex items-center justify-start gap-3">
//                                                 <h2 className="text-blue-700 text-2xl md:text-3xl font-semibold font-text">
//                                                         {ticketId}
//                                                 </h2>
//                                                 <AdminTicketStatusPill status={ticketStatus}/>
//                                                 <AdminUserTypePill status={userType} />
//                                                 <span className="px-2.5 py-1 bg-rose-100 rounded-full flex justify-center items-center text-red-500 text-xs font-semibold font-text leading-4">
//                                                         {ticketType}
//                                                 </span>
//                                         </div>
//                                 </div>

//                                 <div className="w-full md:w-fit flex flex-col md:flex-row flex-wrap gap-3 md:items-center md:justify-end">
//                                         <button className="text-red-500 text-nowrap text-sm font-semibold font-text leading-5 py-3 px-8 rounded-xs border border-red-500 hover:text-red-100 hover:bg-red-900 flex flex-col justify-center items-center gap-2.5 cursor-pointer transition-colors duration-300">
//                                                 Suspend Account
//                                         </button>
//                                         <button className="text-white text-nowrap text-sm font-semibold font-text capitalize py-3 px-8 rounded-xs border bg-blue-700 border-blue-700 hover:bg-blue-950 hover:border-blue-950 flex flex-col justify-center items-center gap-2.5 cursor-pointer transition-colors duration-300">
//                                                 Upgrade Plan
//                                         </button>
//                                 </div>
//                         </div>
//                 </div>
//         )
// }

export type PageHeaderButtonsProps = {
        label: string;
        type: "approve" | "reject" | "close"
        onClick: () => void;
        className?: string;
}

// const PageHeaderButtons = ({ label, type, onClick, className }: PageHeaderButtonsProps) => {

//         const approve = type === 'approve';
//         const close = type === 'close';

//         const colorClass = approve
//                 ? 'border-blue-700 bg-blue-700 text-white hover:bg-blue-900'
//                 : close ? 'border-gray-500 bg-white text-gray-500 hover:bg-gray-500 hover:text-white'
//                         : 'border-red-500 bg-white text-red-500 hover:bg-red-500 hover:text-white'

//         return (
//                 <button
//                         className={`text-sm text-nowrap font-medium font-text leading-5 border rounded-xs py-2 px-4.25 bg-transparent hover:text-white transition-colors duration-300 cursor-pointer ${colorClass} ${className}`}
//                         onClick={onClick}
//                 >
//                         {label}
//                 </button>
//         )
// }