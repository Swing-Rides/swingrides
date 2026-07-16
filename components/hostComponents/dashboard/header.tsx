"use client";

import { getInitials } from "@/components/pages/profilePages/utils";
import { Bell, ChevronDown, LogOut, Search, X, Menu } from "lucide-react";
import Image from "next/image";
import { useGetHostProfileQuery } from "@/app/store/services/hostApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Close as PopoverClose } from "@radix-ui/react-popover";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  HostNotificationType,
  NotificationCardProps,
} from "../types/navbar.type";
import { HOST_NOTIFICATION_TYPE_CONST } from "../utils/helper";
import { Fragment, useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSocket } from "@/components/providers/socketProvider";
import {
  NotificationCategory,
  notificationApi,
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "@/app/store/services/notificationApi";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type FilterValue = NotificationCategory | "all";

const CATEGORY_TO_TYPE: Record<NotificationCategory, HostNotificationType> = {
  bookings: "newBooking",
  payments: "paymentReceived",
  maintenance: "maintenanceAlert",
  general: "communication",
};

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

// ---------------------------------------------------------------------------
// DashboardHeader
// ---------------------------------------------------------------------------

export function DashboardHeader() {
  const { toggleSidebar } = useSidebar();
  const dispatch = useDispatch();
  const { socket } = useSocket();

  const { data } = useGetNotificationsQuery({ limit: 50 });

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notif: any) => {
      console.log("🔌 Real-time notification received via WebSocket:", notif);
      dispatch(
        notificationApi.util.invalidateTags([
          { type: "Notifications", id: "LIST" },
          { type: "Notifications", id: "UNREAD" },
        ])
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
        <Search className="absolute left-3 size-4 text-gray-400 pointer-events-none shrink-0" />
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
        />
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

// ---------------------------------------------------------------------------
// Notification
// ---------------------------------------------------------------------------

type NotificationProps = {
  unreadCount: number;
  today: NotificationCardProps[];
  earlier: NotificationCardProps[];
  onMarkAllAsRead: () => void;
};

const Notification = ({
  unreadCount,
  today,
  earlier,
  onMarkAllAsRead,
}: NotificationProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative cursor-pointer">
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 size-2 aspect-square bg-red-500 rounded-full" />
          )}
          <Bell className="text-gray-500 size-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-w-125 w-full bg-white rounded-[10px] shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.10)] border border-gray-200 p-0">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between pt-4 px-4">
            <div className="flex items-center gap-2">
              <span className="text-neutral-950 text-base font-bold font-text leading-6">
                Notifications
              </span>
              {unreadCount > 0 && (
                <div className="grid place-content-center size-5 aspect-square bg-red-500 rounded-full">
                  <span className="text-white text-xs font-bold font-text leading-4">
                    {unreadCount}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                className="text-center text-blue-700 text-xs font-semibold font-text leading-4 hover:text-blue-900 transition-colors duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={onMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all read
              </button>
              <PopoverClose asChild>
                <button
                  aria-label="Close notifications"
                  className="text-gray-700 hover:text-red-700 transition-colors duration-300 cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </PopoverClose>
            </div>
          </div>

          <NotificationPanel today={today} earlier={earlier} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

// ---------------------------------------------------------------------------
// Notification filter groups
// ---------------------------------------------------------------------------

const notificationGroups: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Bookings", value: "bookings" },
  { label: "Payments", value: "payments" },
  { label: "Maintenance", value: "maintenance" },
  { label: "General", value: "general" },
];

type NotificationPanelProps = {
  today: NotificationCardProps[];
  earlier: NotificationCardProps[];
};

const NotificationPanel = ({ today, earlier }: NotificationPanelProps) => {
  const [filter, setFilter] = useState<FilterValue>("all");

  const applyFilter = (list: NotificationCardProps[]) => {
    if (filter === "all") return list;
    const targetType = CATEGORY_TO_TYPE[filter as NotificationCategory];
    return list.filter((n) => n.notificationType === targetType);
  };

  const filteredToday = applyFilter(today);
  const filteredEarlier = applyFilter(earlier);

  return (
    <div className="flex flex-col">
      {/* Select filter */}
      <div className="px-4 pb-3">
        <Select
          value={filter}
          onValueChange={(val) => setFilter(val as FilterValue)}
        >
          <SelectTrigger className="w-full h-8 text-xs font-text border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-500">
            <SelectValue placeholder="Filter notifications" />
          </SelectTrigger>
          <SelectContent>
            {notificationGroups.map((group) => (
              <SelectItem
                key={group.value}
                value={group.value}
                className="text-xs font-text"
              >
                {group.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Scrollable notification list — 700px desktop, 450px mobile */}
      <div className="overflow-y-auto max-h-80.5 md:max-h-143">
        <NotificationTabContent
          today={filteredToday}
          earlier={filteredEarlier}
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Notification list content
// ---------------------------------------------------------------------------

type NotificationTabContentProps = {
  today: NotificationCardProps[];
  earlier: NotificationCardProps[];
};

const NotificationTabContent = ({
  today,
  earlier,
}: NotificationTabContentProps) => {
  const hasToday = today.length > 0;
  const hasEarlier = earlier.length > 0;

  if (!hasToday && !hasEarlier) {
    return (
      <p className="py-6 text-center text-gray-400 text-sm font-text">
        No notifications
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {hasToday && (
        <div>
          <div className="py-2 px-4">
            <h3 className="text-gray-500 text-xs font-bold font-text uppercase leading-4">
              Today
            </h3>
          </div>
          <div className="divide-y">
            {today.map((item) => (
              <Fragment key={item.id}>
                <NotificationCard {...item} />
              </Fragment>
            ))}
          </div>
        </div>
      )}

      {hasEarlier && (
        <div>
          <div className="py-2 px-4">
            <h3 className="text-gray-500 text-xs font-bold font-text uppercase leading-4">
              Earlier
            </h3>
          </div>
          <div className="divide-y">
            {earlier.map((item) => (
              <Fragment key={item.id}>
                <NotificationCard {...item} />
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Notification card
// ---------------------------------------------------------------------------

const NotificationCard = ({
  id,
  title,
  unread,
  description,
  time,
  notificationType,
}: NotificationCardProps) => {
  const [markAsRead] = useMarkAsReadMutation();
  const notificationObject = HOST_NOTIFICATION_TYPE_CONST[notificationType];

  const icon = notificationObject?.icon ?? (
    <div className="grid place-content-center size-9 aspect-square bg-blue-200 rounded-full">
      <Bell className="text-blue-500 size-5" />
    </div>
  );
  const slug = notificationObject?.slug ?? "#";

  return (
    <Link
      href={slug}
      onClick={() => {
        if (unread) markAsRead(id);
      }}
      className={`${unread ? "bg-indigo-50" : "bg-white"} hover:bg-indigo-100 duration-300 transition-colors block`}
    >
      <div className="flex gap-3 items-start py-3 px-4">
        <div className="shrink-0">{icon}</div>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-5">
            <h4 className="text-neutral-950 text-sm font-semibold font-text leading-5 truncate">
              {title}
            </h4>
            {unread && (
              <div className="size-2 rounded-full aspect-square bg-blue-500 shrink-0" />
            )}
          </div>
          <span className="text-gray-500 text-xs font-medium font-text leading-4">
            {description}
          </span>
          <span className="text-gray-500 text-xs font-medium font-text leading-4">
            {time}
          </span>
        </div>
      </div>
    </Link>
  );
};

// ---------------------------------------------------------------------------
// Header avatar
// ---------------------------------------------------------------------------

const HeaderAvatar = () => {
  const { data } = useGetHostProfileQuery();
  const fullName = data?.data.fullName ?? "";
  const avatar = data?.data.profilePictureUrl;
  const displayName = data?.data.companyName || fullName;
  const userInitials = getInitials(displayName);

  const handleLogout = () => {
    console.log("user logout");
  };

  return (
    <div className="flex gap-2 items-center justify-start">
      <div className="rounded-full aspect-square size-10 overflow-clip bg-blue-700 text-white flex items-center justify-center text-sm font-semibold font-text shrink-0">
        {avatar ? (
          <Image
            src={avatar}
            alt={displayName}
            title={displayName}
            width={40}
            height={40}
            className="w-full aspect-square object-cover"
          />
        ) : (
          userInitials
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <button className="cursor-pointer">
            <ChevronDown className="size-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-25">
          <button
            className="flex items-center justify-start gap-2 cursor-pointer text-red-500 hover:text-red-900 transition-colors duration-300"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
