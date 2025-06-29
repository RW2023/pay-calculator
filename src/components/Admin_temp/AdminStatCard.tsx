// components/admin/AdminStatCard.tsx
import React from 'react'

interface AdminStatCardProps {
    label: string
    value: string | number
    icon: React.ReactNode
}

export default function AdminStatCard({ label, value, icon }: AdminStatCardProps) {
    return (
        <div className="card bg-[var(--background)] shadow-md hover:shadow-lg transition p-4 flex items-center text-[var(--foreground)]">
            <div className="mr-4 text-3xl text-primary">
                {icon}
            </div>
            <div className="flex flex-col items-center text-center">
                <div className="text-sm">{label}</div>
                <div className="text-2xl font-semibold">{value}</div>
            </div>
        </div>
    )
}
