import RenterPageClient from "@/components/superAdminPages/pages/singleRenterPageComponent/renterPageClient";
import React from "react";

export default async function RenterPage({
  params,
}: {
  params: Promise<{ renterId: string }>;
}) {
  const { renterId } = await params;

  return (
    <div>
      <RenterPageClient renterId={renterId} />
    </div>
  );
}
