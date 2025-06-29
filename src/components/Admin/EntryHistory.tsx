'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

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
    createdAt: string;
}

export default function EntryHistory() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
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

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this entry?')) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/entries/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(await res.text());
            setEntries((prev) =>
                prev.filter((e) => {
                    const raw = e._id;
                    const eid = typeof raw === 'string' ? raw : raw.toString();
                    return eid !== id;
                })
            );
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <p role="status" aria-live="polite" className="text-[var(--foreground)]">
                Loading history…
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
        <div className="max-w-7xl mx-auto px-4 space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">Saved Pay Weeks</h2>
            {error && (
                <p role="alert" className="text-[var(--foreground)] opacity-70">
                    Error: {error}
                </p>
            )}
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entries.map((e) => {
                    const rawId = e._id;
                    const id = typeof rawId === 'string' ? rawId : rawId.toString();
                    const dateObj = new Date(e.createdAt);
                    const date = dateObj.toLocaleDateString();
                    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                        <li key={id} className="relative">
                            <Link
                                href={`/admin/history/${id}`}
                                aria-label={`View saved week from ${date} ${time}`}
                                className="
                  block p-6 rounded-2xl shadow-sm border
                  bg-[var(--background)] text-[var(--foreground)]
                  border-[var(--color-neutral)] 
                  dark:bg-[var(--color-neutral-dark)] dark:border-[var(--color-neutral)]/40
                  hover:shadow-lg hover:border-[var(--color-teal)]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]
                  transition-all duration-200
                "
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">{`${date} ${time}`}</span>
                                    {(() => {
                                        const realDays = e.days.filter(d => !!d.actualStart).length;
                                        return (
                                            <span className="text-sm opacity-70">
                                                {realDays} day{realDays > 1 ? 's' : ''}
                                            </span>
                                        );
                                    })()}
                                </div>
                                <p className="mt-2 text-sm opacity-70">
                                    Pension: {e.hasPension ? 'Yes' : 'No'}, Union Dues: {e.hasUnionDues ? 'Yes' : 'No'}
                                </p>
                            </Link>
                            <button
                                onClick={() => handleDelete(id)}
                                disabled={deletingId === id}
                                aria-label={`Delete entry from ${date} ${time}`}
                                className="
                  absolute bottom-3 right-3 p-2 rounded-full
                  bg-[var(--background)] border border-[var(--color-neutral)]
                  dark:bg-[var(--color-neutral-dark)] dark:border-[var(--color-neutral)]/40
                  hover:bg-[var(--color-teal)] hover:text-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-150
                "
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
