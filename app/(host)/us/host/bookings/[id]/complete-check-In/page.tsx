import CheckInPage from "@/components/hostComponents/pages/bookingsPageComponents/checkIn";

export default function CompleteCheckInPage({ params }: { params: { id: string } }) {
  return (
    <CheckInPage bookingId={params.id} />
  )
}
