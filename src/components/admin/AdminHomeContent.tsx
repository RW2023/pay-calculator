// components/admin/AdminHomeContent.tsx
import React from 'react'
import AdminDashboardOverview from './AdminDashboardOverview'
import OvertimeTakeHomeEstimator from './OvertimeTakeHomeEstimator'

export default function AdminHomeContent() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Welcome, Admin</h2>
            <p>Use the navigation above to manage entries, users, settings, etc.</p>
            <div>
                <AdminDashboardOverview />
                <OvertimeTakeHomeEstimator />
            </div>
        </div>
    )
}
