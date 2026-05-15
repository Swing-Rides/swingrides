import PageWrapper from '../../dashboard/pageWrapper'
import { OverviewCard } from '../subscribersPageComponents'
import { RentersListTable } from './renterListTables'
import fetchAdminRenters, { fetchAdminVerificationPendingRenters } from '@/app/services/renters'


export default async function RentersPageComponents() {

        const renter = await fetchAdminRenters()
        const pendingVerificationRenter = await fetchAdminVerificationPendingRenters()
        const data = renter.data
        const pendingVerificationData = pendingVerificationRenter.data

        // console.log("Renter Data ==", data)
        // console.log("pendingVerificationData +++==", pendingVerificationData)

        return (
                <PageWrapper
                        pageTitle='Renters'
                        pageDescription='Manage all registered renters and verify driver documents'
                >
                        <div>
                                <div className='flex flex-wrap gap-4 mt-8'>
                                        <OverviewCard
                                                label='Total Registered renters'
                                                number={data.summary.totalRegisteredRenters}
                                                textColor='#1A56DB'
                                        />
                                        <OverviewCard
                                                label='verified renters'
                                                number={data.summary.verifiedRenters}
                                                textColor='#0891B2'
                                        />
                                        <OverviewCard
                                                label='pending Verifications'
                                                number={data.summary.pendingVerifications}
                                                textColor='#EF4444'
                                        />
                                </div>
                        </div>

                        <RentersListTable 
                                data={data}
                                pendingVerificationData={pendingVerificationData}
                        />
                </PageWrapper>
        )
}

