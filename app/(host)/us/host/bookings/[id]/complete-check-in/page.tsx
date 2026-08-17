import CheckInPage from "@/components/hostComponents/pages/bookingsPageComponents/checkIn";

export default async function CompleteCheckInPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <CheckInPage bookingId={id} />
    </>
  );
}