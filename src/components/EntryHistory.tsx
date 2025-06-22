// components/EntryHistory.tsx
"use client";

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
                return res.json();
            })
            .then((data: Entry[]) => setEntries(data))
            .catch((err) => {
                console.error(err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading history…</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (entries.length === 0) return <p>No saved entries yet.</p>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Saved Pay Weeks</h2>
            <ul className="space-y-2">
                {entries.map((e) => {
                    const date = new Date(e.createdAt);
                    return (
                        <li key={e._id} className="p-4 bg-base-100 rounded-lg shadow">
                            <div className="flex justify-between">
                                <span>
                                    <strong>{date.toLocaleString()}</strong>
                                </span>
                                <span>
                                    {e.days.length} day{e.days.length > 1 && "s"}
                                </span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                Pension: {e.hasPension ? "Yes" : "No"}, Union Dues: {e.hasUnionDues ? "Yes" : "No"}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

