
export type HostNotificationType = "newBooking" | "paymentReceived" | "maintenanceAlert" | "checkInOut" | "communication";

export type NotificationGroupsType = {
        value: "bookings" | "payments" | "maintenance" | "check-in-out";
        label: string;
}

export type NotificationCardProps = {
        id: string;
        title: string;
        unread: boolean;
        description: string;
        time: string;
        notificationType: HostNotificationType;
}

export type HeaderAvatarProps = {
        user: {
                fullname: string
                avatar?: string
        }
}
