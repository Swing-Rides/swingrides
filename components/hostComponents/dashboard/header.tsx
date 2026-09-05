"use client";

import { useEffect, useMemo } from "react";
import { Menu, Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { useSidebar } from "@/components/ui/sidebar";
import { useSocket } from "@/components/providers/socketProvider";
import {
  notificationApi,
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
} from "@/app/store/services/notificationApi";
import {
  NotificationCardProps,
} from "../types/navbar.type";
import {
  CATEGORY_TO_TYPE,
  formatRelativeTime,
  isToday,
  Notification,
} from "../notification/notification";
import { HeaderAvatar } from "./headerAvatar";

export function DashboardHeader() {
  const { toggleSidebar } = useSidebar();
  const dispatch = useDispatch();
  const { socket } = useSocket();

  const { data } = useGetNotificationsQuery({ limit: 50 });

  useEffect(() => {
    if (!socket) return;

    const handleNotification = () => {
      dispatch(
        notificationApi.util.invalidateTags([
          { type: "Notifications", id: "LIST" },
          { type: "Notifications", id: "UNREAD" },
        ]),
      );
    };

    socket.on("notification_received", handleNotification);

    return () => {
      socket.off("notification_received", handleNotification);
    };
  }, [socket, dispatch]);

  const [markAllAsRead] = useMarkAllAsReadMutation();

  const { todayNotifications, earlierNotifications } = useMemo(() => {
    const raw = data?.data.notifications ?? [];
    const today: NotificationCardProps[] = [];
    const earlier: NotificationCardProps[] = [];
    raw.forEach((n) => {
      const card: NotificationCardProps = {
        id: n._id,
        title: n.title,
        unread: !n.isRead,
        description: n.message,
        time: formatRelativeTime(n.createdAt),
        notificationType: CATEGORY_TO_TYPE[n.category],
      };
      (isToday(n.createdAt) ? today : earlier).push(card);
    });
    return { todayNotifications: today, earlierNotifications: earlier };
  }, [data]);
  const unreadCount = data?.data.summary.unreadCount ?? 0;

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 h-16 px-2 md:px-6 bg-white border-b border-gray-100">
      <button
        onClick={toggleSidebar}
        className="md:hidden flex items-center justify-center size-9 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-300 shrink-0 cursor-pointer"
      >
        <Menu className="size-5" />
      </button>
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
            "transition-all duration-300",
          ].join(" ")}
        /> */}
      </div>

      <div className="flex items-center gap-4">
        <Notification
          unreadCount={unreadCount}
          today={todayNotifications}
          earlier={earlierNotifications}
          onMarkAllAsRead={() => markAllAsRead()}
        />
        <HeaderAvatar />
      </div>
    </header>
  );
}