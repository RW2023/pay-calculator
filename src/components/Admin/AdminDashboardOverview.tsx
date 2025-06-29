// components/admin/AdminDashboardOverview.tsx
'use client'

import React from 'react'
import useSWR from 'swr'
import AdminStatCard from './AdminStatCard'
import {
    CalendarDays,
    Clock,
    DollarSign,
    Percent,
    Zap,
} from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AdminDashboardOverview() {
    // 🔥 Note the new URL
    const { data, error, mutate } = useSWR(
        '/api/entries?summary=true',
        fetcher,
        { refreshInterval: 15000, revalidateOnFocus: true }
    )

    if (error) return <p className="text-red-500">Failed to load stats.</p>
    if (!data) return <p>Loading dashboard…</p>

    const stats = [
        { label: 'Total Entries This Week', value: data.totalEntries, icon: <CalendarDays /> },
        { label: 'Total Hours Logged', value: `${data.totalHours.toFixed(2)}h`, icon: <Clock /> },
        { label: 'Total Gross Pay', value: `$${data.grossPay.toFixed(2)}`, icon: <DollarSign /> },
        { label: 'Total Pension Contributions', value: `$${data.pension.toFixed(2)}`, icon: <Percent /> },
        { label: 'Total Union Dues Collected', value: `$${data.unionDues.toFixed(2)}`, icon: <Percent /> },
        { label: 'Overtime Pay This Week', value: `$${data.overtimePay.toFixed(2)}`, icon: <Zap /> },
    ]

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
                <button onClick={() => mutate()} className="btn btn-sm btn-outline">
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map(({ label, value, icon }) => (
                    <AdminStatCard key={label} label={label} value={value} icon={icon} />
                ))}
            </div>
        </section>
    )
}
