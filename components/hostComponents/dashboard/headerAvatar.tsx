"use client";

import { ChevronDown, Loader2, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getInitials } from "@/components/pages/profilePages/utils";
import {
  useGetHostProfileQuery,
  useLogoutMutation,
} from "@/app/store/services/hostApi";
import { useDispatch } from "react-redux";
import { resetHostApiState } from "@/app/store/resetState";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

export const HeaderAvatar = () => {
  const dispatch = useDispatch();
  const { data } = useGetHostProfileQuery();
  const fullName = data?.data.fullName ?? "";
  const avatar = data?.data.profilePictureUrl;
  const displayName = data?.data.companyName || fullName;
  const userInitials = getInitials(displayName);
  const [logout, { isLoading }] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      resetHostApiState(dispatch);
      toast.success("Logged out successfully!");
      router.replace("/host/login");
    } catch (error) {
      resetHostApiState(dispatch);
      const message =
        error && typeof error === "object" && "data" in error
          ? String((error as { data?: unknown }).data)
          : "Logout failed!";
      toast.error(message);
      router.replace("/host/login");
    }
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
            className="flex items-center justify-start gap-2 cursor-pointer text-red-500 hover:text-red-900 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogOut className="size-4" />
            )}
            <span>Logout</span>
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};