import type { Metadata } from "next";
import "@/app/globals.css";
import HeaderNav from "@/components/headerNav";
import Footer from "@/components/footer";
import GuestSignUpModal from "@/components/signUp/guestSignUpModal";

export const metadata: Metadata = {
  title: "Swing Rides",
  description: "Drive your fleet. Own your data.",
};

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <HeaderNav/>
        <main className="pt-17.5 overflow-x-clip">
          {children}
        </main>
        <Footer/>
        <GuestSignUpModal/>
    </>
  );
}
