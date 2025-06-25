// app/history/[id]/page.tsx
import { notFound } from 'next/navigation';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { calculateWeeklyPay } from '@/lib/payUtils';
import type { WeeklyPayInput, DayEntry } from '@/lib/payUtils';
import ResultsDisplay from '@/components/ResultsDisplay';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

const DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

export default async function EntryDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = params;

    let raw;
    try {
        const db = await getDb();
        raw = await db.collection('shiftEntries').findOne({ _id: new ObjectId(id) });
    } catch (err) {
        console.error('Error fetching entry:', err);
        return notFound();
    }

    if (!raw) return notFound();

    const values: WeeklyPayInput = {
        days: raw.days as DayEntry[],
        hasPension: raw.hasPension,
        hasUnionDues: raw.hasUnionDues,
    };
    const result = calculateWeeklyPay(values);

    return (
        <main className="min-h-screen max-w-2xl mx-auto px-4 py-10 space-y-8 text-[var(--foreground)]">
            {/* Header with responsive buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <h1 className="text-3xl sm:text-4xl font-extrabold font-poppins">
                    Week Details
                </h1>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <BackButton />
                    <Link
                        href={`/pay?editId=${id}`}
                        className="
              btn btn-xs sm:btn-sm
              w-full sm:w-auto
              whitespace-normal break-words
              bg-[var(--color-teal)] text-white hover:opacity-90
            "
                    >
                        Edit in Calculator
                    </Link>
                </div>
            </div>

            <p className="text-center text-sm opacity-70">
                {new Date(raw.createdAt).toLocaleString()}
            </p>

            <section className="bg-[var(--color-neutral)] dark:bg-[var(--color-neutral-dark)] rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">
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
                            {(raw.days as DayEntry[])
                                .map((d, idx) => ({ d, idx }))
                                .filter(({ d }) => !!d.actualStart)
                                .map(({ d, idx }) => {
                                    const label = DAYS[idx] ?? `Day ${idx + 1}`;
                                    return (
                                        <tr key={idx}>
                                            <td>{label}</td>
                                            <td>{d.scheduledStart}–{d.scheduledEnd}</td>
                                            <td>{d.actualStart || '--:--'}–{d.actualEnd || '--:--'}</td>
                                            <td>{d.breakMinutes} min</td>
                                            <td>{d.isHoliday ? 'Yes' : 'No'}</td>
                                            <td>{d.isBump ? 'Yes' : 'No'}</td>
                                            <td>{d.lieuHoursUsed} h</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </section>

            <ResultsDisplay result={result} />
        </main>
    );
}
