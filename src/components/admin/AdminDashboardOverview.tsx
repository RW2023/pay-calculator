// components/admin/AdminDashboardOverview.tsx
import React from 'react'
import { startOfISOWeek, endOfISOWeek } from 'date-fns'
import AdminStatCard from './AdminStatCard'
import {
    CalendarDays,
    Clock,
    DollarSign,
    Percent,
    Zap,
} from 'lucide-react'

import { getDb } from '@/lib/mongodb'
import {
    calculateWeeklyPay,
    type DayEntry,
    type WeeklyPayInput,
} from '@/lib/payUtils'

export default async function AdminDashboardOverview() {
    /* 1 ▸ Week bounds */
    const today = new Date()
    const weekStart = startOfISOWeek(today)
    const weekEnd = endOfISOWeek(today)

    /* 2 ▸ Fetch this week’s document */
    const db = await getDb()
    const weekDoc = await db
        .collection('shiftEntries')
        .findOne({ createdAt: { $gte: weekStart, $lte: weekEnd } })

    /* 3 ▸ Normalize all seven days */
    const allDays: DayEntry[] = (weekDoc?.days ?? []).map((d: DayEntry) => ({
        scheduledStart: d.scheduledStart,
        scheduledEnd: d.scheduledEnd,
        actualStart: d.actualStart || undefined,
        actualEnd: d.actualEnd || undefined,
        breakMinutes: d.breakMinutes,
        isHoliday: d.isHoliday,
        isBump: d.isBump,
        lieuHoursUsed: d.lieuHoursUsed,
    }))

    /* 4 ▸ Only keep days with real punches */
    const validDays = allDays.filter(d => d.actualStart && d.actualEnd)

    /* 5 ▸ Build the payload for your calculator util */
    const weeklyInput: WeeklyPayInput = {
        days: validDays,
        hasPension: weekDoc?.hasPension ?? true,
        hasUnionDues: weekDoc?.hasUnionDues ?? true,
    }

    /* 6 ▸ Run the full calculation */
    const { totals } = calculateWeeklyPay(weeklyInput)

    /* 7 ▸ Map into your stats cards */
    const stats = [
        {
            label: 'Total Entries This Week',
            value: validDays.length,
            icon: <CalendarDays />,
        },
        {
            label: 'Total Hours Logged',
            value: `${totals.totalHours.toFixed(2)}h`,
            icon: <Clock />,
        },
        {
            label: 'Total Gross Pay',
            value: `$${totals.grossPay.toFixed(2)}`,
            icon: <DollarSign />,
        },
        {
            label: 'Total Pension Contributions',
            value: `$${totals.pensionDeducted.toFixed(2)}`,
            icon: <Percent />,
        },
        {
            label: 'Total Union Dues Collected',
            value: `$${totals.unionDuesDeducted.toFixed(2)}`,
            icon: <Percent />,
        },
        {
            label: 'Overtime Pay This Week',
            value: `$${totals.overtimePay.toFixed(2)}`,
            icon: <Zap />,
        },
    ]

    /* 8 ▸ Render */
    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map(({ label, value, icon }) => (
                    <AdminStatCard key={label} label={label} value={value} icon={icon} />
                ))}
            </div>
        </section>
    )
}
