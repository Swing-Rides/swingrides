export interface IBIllingsResponse {
        success: boolean
        data: {
                summaryCards: {
                        key: string
                        label: string
                        value: number
                        formattedValue: string
                        trend: string
                        trendDirection: 'up' | 'down' | 'flat'
                        icon?: React.ReactNode        // optional — set client-side if needed
                }[]
                charts: {
                        mrrTrend: {
                                range: string
                                data: { month: string; key: string; value: number }[]
                        }
                        revenueByPlan: {
                                month: string
                                total: number
                                breakdown: { plan: string; value: number; percentage: number }[]
                        }
                }
                tabs: {
                        active: string
                        available: string[]
                }
                filters: {
                        search: string
                        plan: string
                        status: string
                        startDate: string | null
                        endDate: string | null
                }
                payments: {
                        rows: {
                                id: string
                                organization: string
                                email: string
                                plan: string
                                amount: number
                                amountFormatted: string
                                billingDate: string
                                paymentMethod: string
                                status: 'Paid' | 'Pending' | 'Failed'
                                actions: {
                                        canRetry: boolean
                                        canDownloadInvoice: boolean
                                }
                        }[]
                        pagination: {
                                page: number
                                limit: number
                                total: number
                                totalPages: number
                        }
                }
                planChanges: {
                        rows: {
                                id: string
                                name: string
                                changedFrom: string
                                changedTo: string
                                changeType: string
                                date: string
                                actionedBy: string
                        }[]
                        pagination: {
                                page: number
                                limit: number
                                total: number
                                totalPages: number
                        }
                }
                dataCoverage: {
                        planChangesEstimated: boolean
                        note: string
                }
        }
}