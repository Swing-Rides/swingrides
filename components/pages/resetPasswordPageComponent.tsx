"use client";

import { Suspense } from "react";
import Link from "next/link";
import Logo from "../headerNav/logo";
import ResetPasswordForm from "../forms/resetPasswordForm";

// Suspense is required because ResetPasswordForm reads useSearchParams —
// without it Next refuses to statically render the route.
export default function ResetPasswordPageComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12 gap-10">
        <Link href="/">
          <Logo />
        </Link>
        <ResetPasswordForm />
      </section>
    </Suspense>
  );
}
