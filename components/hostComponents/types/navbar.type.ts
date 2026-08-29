import { NotificationCategory } from "@/app/store/services/notificationApi";
import { ReactNode } from "react";

export type HostNotificationType =
  | "newBooking"
  | "paymentReceived"
  | "maintenanceAlert"
  | "checkInOut"
  | "communication";

export type AdminNotificationType =
  | "newRenter"
  | "subscriberJoin"
  | "subscriberRenew"
  | "subscriberCancel"
  | "subscriberUpgrade"
  | "subscriberDowngrade"
  | "newTicket";

export type NotificationType = HostNotificationType | AdminNotificationType;

export type NotificationRole = "host" | "admin" | "superAdmin";

export type NotificationGroupsType = {
  value: string;
  label: string;
};

export type NotificationCardProps = {
  id: string;
  title: string;
  unread: boolean;
  description: string;
  time: string;
  notificationType?: NotificationType;
  category?: string;
  href?: string;
  icon?: ReactNode;
  onItemClick?: (id: string) => void;
};

export type HeaderAvatarProps = {
  user: {
    fullname: string;
    avatar?: string;
  };
};

export type NotificationSocketEvent = {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  category: NotificationCategory;
};
