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
