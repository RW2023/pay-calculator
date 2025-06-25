// components/admin/AdminDashboardOverview.tsx
import React from 'react'
import AdminStatCard from './AdminStatCard'
import {
    CalendarDays,
    Clock,
    DollarSign,
    Percent,
    Zap,
} from 'lucide-react'

export default function AdminDashboardOverview() {
    // TODO: Replace these placeholder values with real metrics fetched via SWR/Server Components
    const stats = [
        { label: 'Total Entries This Week', value: 42, icon: <CalendarDays /> },
        { label: 'Total Hours Logged', value: '160h', icon: <Clock /> },
        { label: 'Total Gross Pay', value: '$4,000', icon: <DollarSign /> },
        { label: 'Total Pension Contributions', value: '$200', icon: <Percent /> },
        { label: 'Total Union Dues Collected', value: '$150', icon: <Percent /> },
        { label: 'Overtime Hours This Week', value: '10h', icon: <Zap /> },
    ]

    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <AdminStatCard
                        key={stat.label}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                    />
                ))}
            </div>
        </section>
    )
}
