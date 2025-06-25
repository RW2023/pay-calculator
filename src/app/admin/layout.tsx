// app/admin/layout.tsx
import { ReactNode } from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <header className="border-b px-6 py-4 bg-[var(--neutral)] dark:bg-[var(--neutral-dark)]">
                <h1 className="text-2xl font-bold">Admin Console</h1>
                <nav className="mt-2 space-x-4">
                    <Link href="/admin" className="hover:underline">Dashboard</Link>
                    <Link href="/admin/history" className="hover:underline">Entry History</Link>
                </nav>
            </header>
            <main className="p-6">{children}</main>
        </div>
    )
}
