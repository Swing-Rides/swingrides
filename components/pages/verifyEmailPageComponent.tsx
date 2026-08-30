"use client";

import { Suspense } from "react";
import Link from "next/link";
import Logo from "../headerNav/logo";
import VerifyEmailForm from "../forms/verifyEmailForm";

export default function VerifyEmailPageComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12 gap-10">
        <Link href="/">
          <Logo />
        </Link>
        <VerifyEmailForm />
      </section>
    </Suspense>
  );
}
