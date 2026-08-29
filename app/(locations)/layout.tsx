import type { Metadata } from "next";
import "@/app/globals.css";
import LocationHeader from "@/components/locationComponents/header";
import LocationFooter from "@/components/locationComponents/footer";
import GuestSignUpModal from "@/components/signUp/guestSignUpModal";

export const metadata: Metadata = {
        title: "Swing Rides | Rent & Ride in Your City",
        description: "Discover and rent vehicles from trusted local hosts across USA cities and states.",
};

export default function LocationsLayout({
        children,
}: Readonly<{
        children: React.ReactNode;
}>) {
        return (
                <>
                        <LocationHeader />
                        <main className="overflow-x-clip min-h-[calc(100vh-140px)]">{children}</main>
                        <LocationFooter />
                        <GuestSignUpModal />
                </>
        );
}

