import SubscriberDetailPageClient from "@/components/superAdminPages/pages/subscriberDetailPageClient";

export default async function SubscriberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <SubscriberDetailPageClient slug={slug} />
    </div>
  );
}
