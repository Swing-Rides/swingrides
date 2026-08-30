import type { Metadata } from "next";
import CancelTripClient from "@/components/pages/cancelTripPageComponents/cancelTripClient";
import { constructMetadata } from "@/lib/seo/metadata";
import { JsonLd, getWebPageSchema } from "@/components/seo/jsonLd";

type PageProps = {
  params: Promise<{ rentId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { rentId } = await params;
  return constructMetadata({
    title: "Cancel Trip",
    description: "Cancel your upcoming vehicle reservation on Swing Rides.",
    path: `/trip/${rentId}/cancel`,
    noIndex: true,
  });
}

export default async function CancelTrip({ params }: PageProps) {
  const { rentId } = await params;

  return (
    <main>
      <JsonLd
        schema={getWebPageSchema({
          name: "Cancel Trip | Swing Rides",
          description:
            "Cancel your upcoming vehicle reservation on Swing Rides.",
          path: `/trip/${rentId}/cancel`,
        })}
      />
      <CancelTripClient rentId={rentId} />
    </main>
  );
}