// components/EntryHistory.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
    _id: string;
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
        fetch("/api/entries?limit=10")
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text());
                return res.json() as Promise<Entry[]>;
            })
            .then(setEntries)
            .catch((err) => {
                console.error(err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-[var(--foreground)]">Loading history…</p>;
    if (error) return <p className="text-[var(--foreground)] opacity-70">Error: {error}</p>;
    if (entries.length === 0) return <p className="text-[var(--foreground)] opacity-70">No saved entries yet.</p>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Saved Pay Weeks</h2>
            <ul className="space-y-2">
                {entries.map((e) => {
                    const date = new Date(e.createdAt);
                    return (
                        <li key={e._id}>
                            <Link
                                href={`/history/${e._id}`}
                                className="block p-4 rounded-lg shadow bg-[var(--color-neutral)] dark:bg-[var(--color-neutral-dark)] hover:shadow-md transition"
                            >
                                <div className="flex justify-between text-[var(--foreground)]">
                                    <span><strong>{date.toLocaleString()}</strong></span>
                                    <span>{e.days.length} day{e.days.length > 1 && 's'}</span>
                                </div>
                                <div className="mt-2 text-sm text-[var(--foreground)] opacity-70">
                                    Pension: {e.hasPension ? "Yes" : "No"}, Union Dues: {e.hasUnionDues ? "Yes" : "No"}
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
