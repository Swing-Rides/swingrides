import { fetchAdminSubscribers } from '@/app/services/subscribers'
import SubscribersPageComponents from '@/components/superAdminPages/pages/subscribersPageComponents'


export default async function SubscribersPage() {

        const subscriber = await fetchAdminSubscribers()
        const data = subscriber.data

        // console.log("SUBSCRIBER DATA", data)

        return (
                <div>
                        <SubscribersPageComponents
                                subscriberData={data}
                        />
                </div>
        )
}
