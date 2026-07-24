"use client"

import Logo from "../headerNav/logo";
import Link from "next/link";
import {
  GoogleIcon,
  HostRegisterPageRightContent,
} from "./registerPageComponents";
import HostLoginForm from "../forms/hostLoginForm";
import apiClient from "@/lib";

export default function LoginPageComponent() {
  const handleGoogleLogin = () => {
    window.location.href = `${apiClient.defaults.baseURL}/api/host/google`;
  };
  return (
    <section className="grid lg:grid-cols-2 min-h-screen bg-white">
      <HostLoginPageLeftContent handleGoogleLogin={handleGoogleLogin} />
      <HostRegisterPageRightContent />
    </section>
  );
}

export const HostLoginPageLeftContent = ({
  handleGoogleLogin,
}: {
  handleGoogleLogin: () => void;
}) => {
  return (
    <div className="flex justify-center p-10 md:p-20 bg-white">
      <div className="max-w-137.75 w-full flex flex-col gap-4.5 md:gap-10">
        <div className="flex flex-col gap-4.5">
          <Logo />
          <span className="px-2.5 py-1 bg-indigo-50 w-fit rounded-full flex justify-start items-start text-blue-700 text-xs font-semibold font-text uppercase leading-4 cursor-pointer">
            HOST PORTAL
          </span>
        </div>

        <div className="flex flex-col gap-4.5">
          <div className="flex flex-col gap-2">
            <h2 className="text-gray-800 text-4xl font-bold font-sans leading-10">
              Welcome Back
            </h2>
            <span className="text-gray-500 text-base font-normal font-text leading-6">
              Sign in to your host account.
            </span>
          </div>

          <div className="w-full flex flex-col justify-center gap-4.5">
            <div>
              <HostLoginForm />
            </div>
            <div className="flex gap-4 items-center">
              <div className="bg-gray-200 w-full h-px" />
              <span>or</span>
              <div className="bg-gray-200 w-full h-px" />
            </div>
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex gap-3 justify-center items-center py-3 px-15 w-full bg-white rounded-xs border border-gray-300 hover:bg-gray-300 cursor-pointer duration-300 transition-colors"
              >
                <GoogleIcon />
                <span className="text-gray-800 text-sm font-medium font-text leading-5">
                  Continue with Google
                </span>
              </button>
            </div>
            <div className="text-center flex justify-center items-center gap-1 text-wrap">
              <span className="text-gray-500 text-xs font-normal font-text leading-5">
                Don&apos;t have an account?
              </span>
              <Link
                href={"/host/register"}
                className="text-blue-700 text-xs font-semibold font-text leading-5 hover:text-blue-900 duration-300 transition-colors"
              >
                Register now →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-5 md:mt-10 self-center">
          <span className="text-center text-gray-500 text-xs font-normal font-text leading-4">
            © 2026 SwingRides. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
};
