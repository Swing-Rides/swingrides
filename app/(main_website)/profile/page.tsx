"use client";

import GuestProfilePage from "@/components/pages/profilePages/guestProfilePage";
import GuestSignInComponent from "@/components/signIn/guestSignInComponent";
import { useGetProfileQuery } from "@/app/store/services/renterApi";
import ProfilePageLoading from "@/components/pages/profilePages/profilePageLoading";

export default function ProfilePage() {
  const { data, isLoading } = useGetProfileQuery();
  const renterProfile = data?.renter ?? null;

  if (isLoading) {
    return <ProfilePageLoading />;
  }

  if (!renterProfile) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center py-10">
        <GuestSignInComponent />
      </div>
    );
  }

  return (
    <main>
      <GuestProfilePage {...renterProfile} />
    </main>
  );
}