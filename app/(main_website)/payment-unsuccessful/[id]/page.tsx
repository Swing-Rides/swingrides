import PaymentUnsuccessful from "@/components/pages/paymentUnsuccessfulPageComponents";

export default async function PaymentUnsuccessfulPage({
        params,
}: {
        params: Promise<{ id: string }>;
}) {
        const { id } = await params;

        return (
                <main className="min-h-[70dvh] flex justify-center items-center">
                        <PaymentUnsuccessful 
                                paymentId={id}
                        />
                </main>
        )
}
