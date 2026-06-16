import { ReactNode } from "react";
import { HostNotificationType } from "../types/navbar.type";
import { Calendar, CheckCircle2, LogIn, Send, Wrench } from "lucide-react";

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
