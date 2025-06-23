// components/WeeklyPayForm.tsx
'use client';

import { useState, useEffect } from 'react';
import type { DayEntry } from '@/lib/payUtils';

const DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

export type WeeklyPayInput = {
    days: DayEntry[];
    hasPension: boolean;
    hasUnionDues: boolean;
};

type WeeklyPayFormProps = {
    onSubmit: (values: WeeklyPayInput) => void;
    initialValues: WeeklyPayInput | undefined;
};

export default function WeeklyPayForm({ onSubmit, initialValues }: WeeklyPayFormProps) {
    const defaultDays: DayEntry[] = DAYS.map(() => ({
        scheduledStart: '21:00',
        scheduledEnd: '05:30',
        actualStart: '',
        actualEnd: '',
        breakMinutes: 30,
        isHoliday: false,
        isBump: false,
        lieuHoursUsed: 0,
    }));

    const [days, setDays] = useState<DayEntry[]>(initialValues?.days ?? defaultDays);
    const [hasPension, setHasPension] = useState(initialValues?.hasPension ?? true);
    const [hasUnionDues, setHasUnionDues] = useState(initialValues?.hasUnionDues ?? true);

    useEffect(() => {
        if (initialValues) {
            setDays(initialValues.days);
            setHasPension(initialValues.hasPension);
            setHasUnionDues(initialValues.hasUnionDues);
        }
    }, [initialValues]);

    const safeTime = (val?: string) => (typeof val === 'string' ? val : '');

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ days, hasPension, hasUnionDues });
            }}
            className="bg-[var(--background)] text-[var(--foreground)] rounded-2xl shadow p-4 sm:p-6 flex flex-col gap-6 transition-colors duration-300"
            aria-label="Weekly Pay Input Form"
            autoComplete="off"
        >
            {/* --- Table --- */}
            <div className="overflow-x-auto">
                <table className="table w-full min-w-[1050px]">
                    <thead className="text-[var(--foreground)]/80">
                        <tr>
                            <th>Day</th>
                            <th>Scheduled Start</th>
                            <th>Scheduled End</th>
                            <th>Actual Start</th>
                            <th>Actual End</th>
                            <th>Break (min)</th>
                            <th>Holiday?</th>
                            <th>BUMP?</th>
                            <th>Lieu Used (hrs)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DAYS.map((label, idx) => {
                            const day = days[idx] ?? defaultDays[idx]!;
                            return (
                                <tr key={label} className="even:bg-muted/20">
                                    <th scope="row" className="font-semibold">
                                        {label}
                                    </th>
                                    {/* Scheduled Start */}
                                    <td>
                                        <input
                                            id={`${label}-scheduled-start`}
                                            type="time"
                                            className="input input-bordered w-full bg-[var(--card-bg)] text-[var(--foreground)]"
                                            aria-label={`${label} scheduled start time`}
                                            value={safeTime(day.scheduledStart)}
                                            onChange={(e) =>
                                                setDays((prev) =>
                                                    prev.map((d, i) => (i === idx ? { ...d, scheduledStart: e.target.value } : d))
                                                )
                                            }
                                            required
                                        />
                                    </td>
                                    {/* Scheduled End */}
                                    <td>
                                        <input
                                            id={`${label}-scheduled-end`}
                                            type="time"
                                            className="input input-bordered w-full bg-[var(--card-bg)] text-[var(--foreground)]"
                                            aria-label={`${label} scheduled end time`}
                                            value={safeTime(day.scheduledEnd)}
                                            onChange={(e) =>
                                                setDays((prev) =>
                                                    prev.map((d, i) => (i === idx ? { ...d, scheduledEnd: e.target.value } : d))
                                                )
                                            }
                                            required
                                        />
                                    </td>
                                    {/* Actual Start */}
                                    <td>
                                        <input
                                            id={`${label}-actual-start`}
                                            type="time"
                                            className="input input-bordered w-full bg-[var(--card-bg)] text-[var(--foreground)]"
                                            aria-label={`${label} actual start time`}
                                            value={safeTime(day.actualStart)}
                                            onChange={(e) =>
                                                setDays((prev) =>
                                                    prev.map((d, i) => (i === idx ? { ...d, actualStart: e.target.value } : d))
                                                )
                                            }
                                        />
                                    </td>
                                    {/* Actual End */}
                                    <td>
                                        <input
                                            id={`${label}-actual-end`}
                                            type="time"
                                            className="input input-bordered w-full bg-[var(--card-bg)] text-[var(--foreground)]"
                                            aria-label={`${label} actual end time`}
                                            value={safeTime(day.actualEnd)}
                                            onChange={(e) =>
                                                setDays((prev) =>
                                                    prev.map((d, i) => (i === idx ? { ...d, actualEnd: e.target.value } : d))
                                                )
                                            }
                                        />
                                    </td>
                                    {/* Break Minutes */}
                                    <td>
                                        <select
                                            id={`${label}-break-minutes`}
                                            className="input input-sm w-full bg-[var(--card-bg)] text-[var(--foreground)]"
                                            aria-label={`${label} break minutes`}
                                            value={day.breakMinutes}
                                            onChange={(e) =>
                                                setDays((prev) =>
                                                    prev.map((d, i) => (i === idx ? { ...d, breakMinutes: Number(e.target.value) } : d))
                                                )
                                            }
                                        >
                                            {[0, 30, 45, 60].map((v) => (
                                                <option key={v} value={v}>
                                                    {v}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    {/* Holiday */}
                                    <td>
                                        <input
                                            id={`${label}-is-holiday`}
                                            type="checkbox"
                                            className="toggle toggle-success"
                                            aria-label={`${label} is holiday`}
                                            checked={day.isHoliday}
                                            onChange={(e) =>
                                                setDays((prev) =>
                                                    prev.map((d, i) => (i === idx ? { ...d, isHoliday: e.target.checked } : d))
                                                )
                                            }
                                        />
                                    </td>
                                    {/* BUMP */}
                                    <td>
                                        <input
                                            id={`${label}-is-bump`}
                                            type="checkbox"
                                            className="toggle toggle-warning"
                                            aria-label={`${label} is bump`}
                                            checked={day.isBump}
                                            onChange={(e) =>
                                                setDays((prev) =>
                                                    prev.map((d, i) => (i === idx ? { ...d, isBump: e.target.checked } : d))
                                                )
                                            }
                                        />
                                    </td>
                                    {/* Lieu Used */}
                                    <td>
                                        <input
                                            id={`${label}-lieu-hours-used`}
                                            type="number"
                                            min={0}
                                            max={8}
                                            step={0.25}
                                            className="input input-bordered w-16 bg-[var(--card-bg)] text-[var(--foreground)]"
                                            aria-label={`${label} lieu hours used`}
                                            value={Number.isFinite(day.lieuHoursUsed) ? day.lieuHoursUsed : 0}
                                            onChange={(e) =>
                                                setDays((prev) =>
                                                    prev.map((d, i) =>
                                                        i === idx
                                                            ? { ...d, lieuHoursUsed: Math.max(0, Number(e.target.value) || 0) }
                                                            : d
                                                    )
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* --- Bottom Controls --- */}
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-center">
                {/* DaisyUI Pension toggle */}
                <label htmlFor="pension-toggle" className="flex items-center gap-2 font-medium">
                    <input
                        id="pension-toggle"
                        type="checkbox"
                        className="toggle toggle-info"
                        aria-label="Toggle pension deductions"
                        checked={hasPension}
                        onChange={(e) => setHasPension(e.target.checked)}
                    />
                    Pension
                </label>

                {/* DaisyUI Union Dues toggle */}
                <label htmlFor="union-toggle" className="flex items-center gap-2 font-medium">
                    <input
                        id="union-toggle"
                        type="checkbox"
                        className="toggle toggle-warning"
                        aria-label="Toggle union dues deductions"
                        checked={hasUnionDues}
                        onChange={(e) => setHasUnionDues(e.target.checked)}
                    />
                    Union Dues
                </label>

                {/* Teal Calculate button */}
                <button
                    type="submit"
                    className="ml-auto px-8 py-2 font-semibold rounded-md shadow bg-[var(--color-teal)] text-[var(--background)] hover:bg-[var(--color-teal-dark)] dark:bg-[var(--color-neutral-dark)] dark:hover:bg-[var(--color-neutral)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal-dark)] transition-colors duration-300"
                >
                    Calculate
                </button>
            </div>
        </form>
    );
}