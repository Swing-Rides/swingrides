import type { Metadata } from "next";
import ProfileClient from "@/components/pages/profilePages/profileClient";
import { constructMetadata } from "@/lib/seo/metadata";
import { JsonLd, getWebPageSchema } from "@/components/seo/jsonLd";

export const metadata: Metadata = constructMetadata({
  title: "My Profile & Bookings",
  description:
    "Manage your account, view your reservations, and update your profile on Swing Rides.",
  path: "/profile",
  noIndex: true,
});

export default function ProfilePage() {
  return (
    <main>
      <JsonLd
        schema={getWebPageSchema({
          name: "My Profile & Bookings | Swing Rides",
          description:
            "Manage your account, view your reservations, and update your profile on Swing Rides.",
          path: "/profile",
        })}
      />
      <ProfileClient />
    </main>
  );
}