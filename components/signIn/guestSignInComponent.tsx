"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import GuestLoginForm from "../forms/GuestLoginForm";
import { Suspense } from "react";
import apiClient from "@/lib";

export default function GuestSignInComponent() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
}

const SignIn = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const href = (() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", "sign-up");
    return `${pathname}?${params.toString()}`;
  })();

  return (
    <div className="max-w-120 p-6 bg-white rounded-[10px] flex flex-col justify-start items-center gap-5">
      <div>
        <h3 className="text-[#1F2937] text-xl font-bold font-text">
          Sign In To Your Account
        </h3>
      </div>

      <div>
        <span className="text-[#333333] text-sm font-normal font-text leading-5">
          Sign into your account to complete your booking. It only takes 30
          seconds.
        </span>
      </div>

      <GuestLoginForm />

      <div className="flex gap-4 items-center w-full">
        <div className="flex-1 h-px bg-[#E5E7EB]" />
        <span className="text-[#6B7280] text-sm font-normal font-text">or</span>
        <div className="flex-1 h-px bg-[#E5E7EB]" />
      </div>

      <div className="w-full">
        <button
          onClick={() => {
            window.location.href = `${apiClient.defaults.baseURL}/api/auth/google`;
          }}
          className="w-full flex gap-3 items-center justify-center px-10 py-3 bg-transparent hover:bg-blue-900 hover:text-white transition-color duration-300 rounded-xs border border-[#E5E7EB] cursor-pointer"
        >
          <GoogleIcon />
          <span className="text-nowrap">Continue with Google</span>
        </button>
      </div>

      <div>
        <span className="text-center text-[#6B7280] text-xs font-normal font-text leading-5">
          Don&apos;t have an account?{" "}
          <Link href={href} className="text-[#1A56DB]">
            Sign Up →
          </Link>{" "}
        </span>
      </div>

      <div>
        <span className="text-center text-[#6B7280] text-xs font-normal font-text leading-5">
          🔒 Your information is encrypted and secure.
        </span>
      </div>
    </div>
  );
};

const GoogleIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_297_8341)">
        <path
          d="M19.5865 10.2199C19.5865 9.51135 19.5226 8.83082 19.4047 8.17627H9.99316V12.0416H15.3715C15.2601 12.653 15.026 13.2355 14.6831 13.7539C14.3403 14.2723 13.8959 14.7158 13.3768 15.0575V17.5658H16.6066C18.4963 15.825 19.5865 13.2628 19.5865 10.2199Z"
          fill="#4285F4"
        />
        <path
          d="M9.99331 19.9863C12.6915 19.9863 14.9539 19.0919 16.6068 17.5649L13.377 15.0577C12.4826 15.6572 11.3384 16.012 9.99331 16.012C7.39011 16.012 5.18663 14.2532 4.40217 11.8918H1.06348V14.4801C1.89491 16.1357 3.17039 17.5274 4.74737 18.4998C6.32434 19.4722 8.14066 19.9868 9.99331 19.9863Z"
          fill="#34A853"
        />
        <path
          d="M4.40196 11.8917C4.2021 11.2921 4.08818 10.6526 4.08818 9.99301C4.08818 9.33346 4.2021 8.6939 4.40196 8.09432V5.5061H1.06327C0.363764 6.89835 -0.000359185 8.43492 2.65871e-07 9.99301C2.65871e-07 11.6059 0.385734 13.1318 1.06327 14.4799L4.40096 11.8917H4.40196Z"
          fill="#FBBC05"
        />
        <path
          d="M9.99331 3.97426C11.4603 3.97426 12.7774 4.47891 13.8137 5.46923L16.6797 2.6032C14.9489 0.989317 12.6865 0 9.99331 0C6.08601 0 2.70834 2.23846 1.06348 5.5062L4.40117 8.09441C5.18663 5.73205 7.39011 3.97426 9.99331 3.97426Z"
          fill="#EA4335"
        />
      </g>
      <defs>
        <clipPath id="clip0_297_8341">
          <rect width="19.9862" height="19.9862" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
