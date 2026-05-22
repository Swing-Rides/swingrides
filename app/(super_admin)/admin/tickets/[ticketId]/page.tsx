import TicketTypePageComponent from "@/components/superAdminPages/pages/ticketsPageComponents/ticketTypePageComponent";

export default async function TicketTypePage({
        params,
}: {
        params: Promise<{ ticketId: string }>;
}) {

        const { ticketId } = await params;

        return (
                <div>
                        {ticketId}
                        <TicketTypePageComponent />
                </div>
        )
}
