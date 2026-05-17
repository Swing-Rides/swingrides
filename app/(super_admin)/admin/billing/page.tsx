import { fetchAdminBillings } from '@/app/services/billing'
import BillingPageComponents from '@/components/superAdminPages/pages/billingPageComponent/billingPageComponents'


export default async function BillingPage() {

        const response = await fetchAdminBillings()
        return <BillingPageComponents data={response.data} />
}
