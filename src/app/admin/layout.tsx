// app/admin/layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <header className="border-b px-6 py-4 bg-[var(--color-neutral)] dark:bg-[var(--color-neutral-dark)] transition-colors duration-300">
                <h1 className="text-2xl font-bold">Admin Console</h1>
                <nav className="mt-2 space-x-4">
                    <Link href="/admin" className="hover:underline">
                        Dashboard
                    </Link>
                    <Link href="/history" className="hover:underline">
                        Entry History
                    </Link>
                </nav>
            </header>
            <main className="p-6">{children}</main>
        </div>
    );
}
