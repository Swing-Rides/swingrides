import SingleIssueReportPage from '@/components/hostComponents/pages/reportAnIssuePageComponents/singleIssueReportPage'

export default async function ReportPage({
        params,
}: {
        params: Promise<{ id: string }>;
}) {
        const { id } = await params;

        return (
                <SingleIssueReportPage 
                        reportId={id}
                        issueType='Booking Issue'
                        bookingReference='BR-12345'
                        dateSubmitted='Apr 28, 2026 at 3:42 PM'
                        urgent={true}
                        issueDescription={`Renter returned the vehicle with significant scratches on the rear bumper. The damage was not present during the pre-rental inspection, as documented in my photos. The scratches appear to be from reversing into a concrete barrier or pole. The renter did not mention this damage during drop-off and left quickly.  I have attached photos of the damage. The repair estimate from my usual body shop is $180. The renter's deposit was $75, so there is a shortfall of $105. I would like SwingRides to review the evidence and help recover the full repair cost from the renter.`}
                        attachedPhotos={[
                                { id: "IMG-001", src: "/images/host/damage-front-bumper.webp" },
                                { id: "IMG-002", src: "/images/host/damage-side-panel.jpeg" },
                                { id: "IMG-003", src: "/images/host/receipt-oil-change.png" },
                                { id: "IMG-004", src: "/images/host/tire-tread-depth.webp" }
                        ]}
                        status='inReview'
                        responseMessage={`Thank you for reporting this issue. Our claims team has reviewed the photos and documentation you provided.  Based on our assessment, the damage appears consistent with impact damage that occurred during the rental period. We have contacted the renter and requested their side of the story.  We are currently waiting for the renter to respond to our inquiry. Once we receive their response, we will make a determination on liability and the appropriate resolution.  You should expect a final decision within the next 2-3 business days. We will notify you via email as soon as we have an update.`}
                        responseDate='Apr 29, 2026 at 11:18 AM'
                        respondedBy='Sarah Admin'
                />
        )
}
