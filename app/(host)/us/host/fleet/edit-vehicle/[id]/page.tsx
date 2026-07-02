import EditFleetComponents from '@/components/hostComponents/pages/fleet/editFleetPage'

export default async function EditVehiclePage({
        params,
}: {
        params: Promise<{ id: string }>;
}) {
        const { id } = await params;

        return (
                <EditFleetComponents 
                        fleetId={id}
                />
        )
}