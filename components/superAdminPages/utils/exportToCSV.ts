import { AdminRenterDataRow } from "@/types/renters.type"
import { AdminSubscriberRow } from "@/types/subscribers.type"
import { formatDate } from "./formatDate"

export function exportToCSV(rows: AdminSubscriberRow[]) {
        const headers = ['ID', 'Organisation', 'Email', 'Plan', 'Vehicles', 'Status', 'Monthly Revenue', 'Date Joined']
        const csvRows = [
                headers.join(','),
                ...rows.map((r) =>
                        [
                                r.id,
                                `"${r.organization}"`,
                                r.ownerEmail,
                                r.plan,
                                r.vehicles,
                                r.status,
                                r.monthlyRevenue,
                                `"${formatDate(r.joinedDate)}"`,
                        ].join(',')
                ),
        ]
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'subscribers.csv'
        link.click()
        URL.revokeObjectURL(url)
}

export function exportRentersToCSV(rows: AdminRenterDataRow[]) {
        const headers = ['ID', 'Renter Fullname', 'Email', 'Phone number', 'Total Booking', 'Total Spent', 'Status', 'Date Joined']
        const csvRows = [
                headers.join(','),
                ...rows.map((r) =>
                        [
                                r.id,
                                `"${r.name}"`,
                                r.email,
                                r.phone,
                                r.totalBookings,
                                r.totalSpent,
                                r.status,
                                `"${formatDate(r.joinedDate)}"`,
                        ].join(',')
                ),
        ]
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'renters.csv'
        link.click()
        URL.revokeObjectURL(url)
}

type PaymentCSVRow = {
        id: string
        organization: string
        email: string
        plan: string
        amountFormatted: string
        billingDate: string
        paymentMethod: string
        status: string
}

type PlanChangeCSVRow = {
        id: string
        name: string
        changedFrom: string
        changedTo: string
        changeType: string
        date: string
        actionedBy: string
}

function downloadCSV(filename: string, headers: string[], rows: string[][]): void {
        const csv = [
                headers.join(','),
                ...rows.map((row) =>
                        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
                ),
        ].join('\n')

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        URL.revokeObjectURL(url)
}

export function exportAllPaymentsToCSV(rows: PaymentCSVRow[]): void {
        const headers = [
                'ID', 'Organisation', 'Email', 'Plan',
                'Amount', 'Billing Date', 'Payment Method', 'Status',
        ]
        const data = rows.map((r) => [
                r.id,
                r.organization,
                r.email,
                r.plan,
                r.amountFormatted,
                new Date(r.billingDate).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                }),
                r.paymentMethod,
                r.status,
        ])
        downloadCSV('payments.csv', headers, data)
}

export function exportAllChangeHistoryToCSV(rows: PlanChangeCSVRow[]): void {
        const headers = [
                'ID', 'Organisation', 'Changed From',
                'Changed To', 'Change Type', 'Date', 'Actioned By',
        ]
        const data = rows.map((r) => [
                r.id,
                r.name,
                r.changedFrom,
                r.changedTo,
                r.changeType,
                r.date,
                r.actionedBy,
        ])
        downloadCSV('plan-change-history.csv', headers, data)
}