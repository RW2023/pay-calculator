// app/history/[id]/page.tsx
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { calculateWeeklyPay } from "@/lib/payUtils";
import type { WeeklyPayInput, DayEntry } from "@/lib/payUtils";
import ResultsDisplay from "@/components/ResultsDisplay";
import type { ReactElement } from "react";

interface Params {
    params: { id: string };
}

// Hard-code the labels to match your form
const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export default async function EntryDetailPage({
    params: { id },
}: Params): Promise<ReactElement> {
    // 1️⃣ Fetch the raw document from Mongo
    const db = await getDb();
    const raw = await db
        .collection("shiftEntries")
        .findOne({ _id: new ObjectId(id) });

    if (!raw) {
        return notFound();
    }

    // 2️⃣ Re-run the pay calculation
    const values: WeeklyPayInput = {
        days: raw.days as DayEntry[],
        hasPension: raw.hasPension,
        hasUnionDues: raw.hasUnionDues,
    };
    const result = calculateWeeklyPay(values);

    return (
        <main className="max-w-2xl mx-auto px-4 py-10 space-y-8 text-[var(--foreground)] min-h-screen">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-center font-poppins">
                Week Details
            </h1>
            <p className="text-center text-sm opacity-70">
                {new Date(raw.createdAt).toLocaleString()}
            </p>

            {/* ———————————————————————————————————————— */}
            {/* Input Data Table (uses raw.days to show your original times) */}
            <section className="bg-[var(--color-neutral)] dark:bg-[var(--color-neutral-dark)] rounded-lg shadow p-4">
                <h2 className="font-semibold text-lg mb-2 text-[var(--foreground)]">
                    Daily Entries
                </h2>
                <div className="overflow-x-auto">
                    <table className="table w-full text-[var(--foreground)]">
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Scheduled</th>
                                <th>Actual</th>
                                <th>Break</th>
                                <th>Holiday</th>
                                <th>BUMP</th>
                                <th>Lieu Used</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(raw.days as DayEntry[]).map((d, idx) => {
                                const label = DAYS[idx] ?? `Day ${idx + 1}`;
                                return (
                                    <tr key={idx}>
                                        <td>{label}</td>
                                        <td>
                                            {d.scheduledStart}–{d.scheduledEnd}
                                        </td>
                                        <td>
                                            {(d.actualStart || "--:--")}–{(d.actualEnd || "--:--")}
                                        </td>
                                        <td>{d.breakMinutes} min</td>
                                        <td>{d.isHoliday ? "Yes" : "No"}</td>
                                        <td>{d.isBump ? "Yes" : "No"}</td>
                                        <td>{d.lieuHoursUsed} h</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ———————————————————————————————————————— */}
            {/* Computed Pay Breakdown */}
            <ResultsDisplay result={result} />
        </main>
    );
}
