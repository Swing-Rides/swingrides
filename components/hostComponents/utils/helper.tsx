import { ReactNode } from "react";
import { HostNotificationType, AdminNotificationType } from "../types/navbar.type";
import {
  Calendar,
  CheckCircle2,
  LogIn,
  Send,
  Wrench,
  UserPlus,
  UserCheck,
  RefreshCw,
  UserMinus,
  TrendingUp,
  TrendingDown,
  Ticket,
} from "lucide-react";

export const HOST_NOTIFICATION_TYPE_CONST: Record<HostNotificationType, { icon: ReactNode; slug: string; }> = {
        "newBooking": { 
                icon: <div className="size-9 bg-blue-700/10 rounded-full flex justify-center items-center">
                                <Calendar className="size-5 text-blue-700" />
                        </div>,
                slug: "/us/host/bookings",
        },
        "paymentReceived": {
                icon: <div className="size-9 bg-emerald-500/10 rounded-full flex justify-center items-center">
                        <CheckCircle2 className="size-5 text-emerald-500" />
                </div>,
                slug: "/us/host/bookings",
        },
        "maintenanceAlert": {
                icon: <div className="size-9 bg-red-500/10 rounded-full flex justify-center items-center">
                        <Wrench className="size-5 text-red-500" />
                </div>,
                slug: "/us/host/maintenance",
        },
        "checkInOut": {
                icon: <div className="size-9 bg-cyan-600/10 rounded-full flex justify-center items-center">
                        <LogIn className="size-5 text-cyan-600" />
                </div>,
                slug: "/us/host/bookings",
        },
        "communication": {
                icon: <div className="size-9 bg-emerald-500/10 rounded-full flex justify-center items-center">
                        <Send className="size-5 text-emerald-500" />
                </div>,
                slug: "/us/host/settings/?settingsTab=communicate",
        },
}

export const ADMIN_NOTIFICATION_TYPE_CONST: Record<AdminNotificationType, { icon: ReactNode; slug: string; }> = {
        "newRenter": {
                icon: <div className="size-9 bg-cyan-600/10 rounded-full flex justify-center items-center">
                        <UserPlus className="size-5 text-cyan-600" />
                </div>,
                slug: "/admin/renters",
        },
        "subscriberJoin": {
                icon: <div className="size-9 bg-blue-700/10 rounded-full flex justify-center items-center">
                        <UserCheck className="size-5 text-blue-700" />
                </div>,
                slug: "/admin/subscribers",
        },
        "subscriberRenew": {
                icon: <div className="size-9 bg-emerald-500/10 rounded-full flex justify-center items-center">
                        <RefreshCw className="size-5 text-emerald-500" />
                </div>,
                slug: "/admin/subscribers",
        },
        "subscriberCancel": {
                icon: <div className="size-9 bg-red-500/10 rounded-full flex justify-center items-center">
                        <UserMinus className="size-5 text-red-500" />
                </div>,
                slug: "/admin/subscribers",
        },
        "subscriberUpgrade": {
                icon: <div className="size-9 bg-indigo-600/10 rounded-full flex justify-center items-center">
                        <TrendingUp className="size-5 text-indigo-600" />
                </div>,
                slug: "/admin/subscribers",
        },
        "subscriberDowngrade": {
                icon: <div className="size-9 bg-amber-500/10 rounded-full flex justify-center items-center">
                        <TrendingDown className="size-5 text-amber-500" />
                </div>,
                slug: "/admin/subscribers",
        },
        "newTicket": {
                icon: <div className="size-9 bg-amber-500/10 rounded-full flex justify-center items-center">
                        <Ticket className="size-5 text-amber-500" />
                </div>,
                slug: "/admin/tickets",
        },
};
