// components/EntryHistory.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DayEntry {
    scheduledStart: string;
    scheduledEnd: string;
    actualStart: string;
    actualEnd: string;
    lunchTaken: boolean;
    isHoliday: boolean;
    isBump: boolean;
    lieuHoursUsed: number;
}

interface Entry {
    _id: { toString(): string } | string;
    days: DayEntry[];
    hasPension: boolean;
    hasUnionDues: boolean;
    createdAt: string; // ISO timestamp
}

export default function EntryHistory() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/entries?limit=10')
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text());
                return res.json() as Promise<Entry[]>;
            })
            .then(setEntries)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <p role="status" aria-live="polite" className="text-[var(--foreground)]">
                Loading history…
            </p>
        );
    }

    if (error) {
        return (
            <p role="alert" className="text-[var(--foreground)] opacity-70">
                Error: {error}
            </p>
        );
    }

    if (entries.length === 0) {
        return (
            <p role="status" aria-live="polite" className="text-[var(--foreground)] opacity-70">
                No saved entries yet.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Saved Pay Weeks</h2>
            <ul className="space-y-3">
                {entries.map((e) => {
                    const rawId = e._id;
                    const id = typeof rawId === 'string' ? rawId : rawId.toString();
                    const d = new Date(e.createdAt);
                    const date = d.toLocaleDateString();
                    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                        <li key={id}>
                            <Link
                                href={`/admin/history/${id}`}
                                aria-label={`View saved week from ${date} ${time}`}
                                className="
                  block p-4 rounded-lg shadow border
                  bg-[var(--background)] text-[var(--foreground)]
                  border-[var(--color-neutral)] dark:border-[var(--color-neutral)]/40
                  dark:bg-[var(--color-neutral-dark)] dark:text-[var(--foreground)]
                  hover:shadow-md hover:border-[var(--color-teal)]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]
                  transition-all duration-200
                "
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">{`${date} ${time}`}</span>
                                    <span className="text-sm opacity-70">
                                        {e.days.length} day{e.days.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm opacity-70">
                                    Pension: {e.hasPension ? 'Yes' : 'No'}, Union Dues:{' '}
                                    {e.hasUnionDues ? 'Yes' : 'No'}
                                </p>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
