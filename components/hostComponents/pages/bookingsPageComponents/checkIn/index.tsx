import PageWrapper from "../../../dashboard/pageWrapper";

type CheckInPageProps = {
    bookingId: string;
}

export default function CheckInPage({ bookingId }: CheckInPageProps) {
    return (
        <PageWrapper
            pageTitle="Complete Check-In"
            pageDescription={`Process vehicle pickup for booking ${bookingId}`}
        >
            <div className="border-t mt-3">

            </div>
        </PageWrapper>
    )
}
