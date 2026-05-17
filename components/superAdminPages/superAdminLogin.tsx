import React from "react";
import Logo from "../headerNav/logo";
import SuperAdminLoginForm from "../forms/superAdminLoginForm";
import Link from "next/link";

export default function SuperAdminLogin() {
  return (
    <div className="section-bg-gradient h-dvh w-full flex justify-center items-center">
      <div className="max-w-141 w-full p-8 bg-white rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)] border border-gray-200 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Logo />
          <span className="px-2.5 py-1 bg-indigo-50 w-fit rounded-full flex justify-start items-start text-blue-700 text-xs font-semibold font-text uppercase leading-4 cursor-pointer">
            SUPER ADMIN
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-gray-800 text-4xl font-normal font-sans leading-10">
            Admin Access
          </h2>
          <span className="text-gray-500 text-base font-normal font-text leading-6">
            Sign in to the admin portal
          </span>
        </div>

        <div className="w-full flex flex-col justify-center gap-3">
          <SuperAdminLoginForm />
          <Link
            href={"/"}
            className="text-center text-blue-700 text-sm font-medium font-text hover:text-blue-900 transition-colors duration-300"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
