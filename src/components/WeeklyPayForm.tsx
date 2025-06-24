'use client';

import { useState, useEffect } from 'react';
import type { DayEntry } from '@/lib/payUtils';
import IconToggle from '@/components/IconToggle';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

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

    const renderTimeInput = (
        id: string,
        value: string,
        onChange: (v: string) => void,
        aria: string
    ) => (
        <input
            id={id}
            type="time"
            className="input input-bordered w-full bg-[var(--card-bg)] text-[var(--foreground)]"
            aria-label={aria}
            value={safeTime(value)}
            onChange={e => onChange(e.target.value)}
        />
    );

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                onSubmit({ days, hasPension, hasUnionDues });
            }}
            className="bg-[var(--background)] text-[var(--foreground)] rounded-2xl shadow p-4 sm:p-6 flex flex-col gap-6 transition-colors duration-300 min-h-screen"
            aria-label="Weekly Pay Input Form"
            autoComplete="off"
        >
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
                                    <td>
                                        {renderTimeInput(
                                            `${label}-scheduled-start`,
                                            day.scheduledStart,
                                            v => setDays(prev => prev.map((d, i) => (i === idx ? { ...d, scheduledStart: v } : d))),
                                            `${label} scheduled start time`
                                        )}
                                    </td>
                                    <td>
                                        {renderTimeInput(
                                            `${label}-scheduled-end`,
                                            day.scheduledEnd,
                                            v => setDays(prev => prev.map((d, i) => (i === idx ? { ...d, scheduledEnd: v } : d))),
                                            `${label} scheduled end time`
                                        )}
                                    </td>
                                    <td>
                                        {renderTimeInput(
                                            `${label}-actual-start`,
                                            day.actualStart,
                                            v => setDays(prev => prev.map((d, i) => (i === idx ? { ...d, actualStart: v } : d))),
                                            `${label} actual start time`
                                        )}
                                    </td>
                                    <td>
                                        {renderTimeInput(
                                            `${label}-actual-end`,
                                            day.actualEnd,
                                            v => setDays(prev => prev.map((d, i) => (i === idx ? { ...d, actualEnd: v } : d))),
                                            `${label} actual end time`
                                        )}
                                    </td>
                                    <td>
                                        <select
                                            id={`${label}-break-minutes`}
                                            className="input input-sm w-full bg-[var(--card-bg)] text-[var(--foreground)]"
                                            aria-label={`${label} break minutes`}
                                            value={day.breakMinutes}
                                            onChange={e => setDays(prev => prev.map((d, i) => (i === idx ? { ...d, breakMinutes: Number(e.target.value) } : d)))}
                                        >
                                            {[0, 30, 45, 60].map(v => (
                                                <option key={v} value={v}>
                                                    {v}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        <IconToggle
                                            id={`${label}-is-holiday`}
                                            defaultChecked={day.isHoliday}
                                            onChange={checked => setDays(prev => prev.map((d, i) => (i === idx ? { ...d, isHoliday: checked } : d)))}
                                            color="success"
                                        />
                                    </td>
                                    <td className="text-center">
                                        <IconToggle
                                            id={`${label}-is-bump`}
                                            defaultChecked={day.isBump}
                                            onChange={checked => setDays(prev => prev.map((d, i) => (i === idx ? { ...d, isBump: checked } : d)))}
                                            color="warning"
                                        />
                                    </td>
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
                                            onChange={e =>
                                                setDays(prev =>
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
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <label htmlFor="pension-toggle" className="flex items-center gap-2 font-medium">
                    <IconToggle
                        id="pension-toggle"
                        defaultChecked={hasPension}
                        onChange={checked => setHasPension(checked)}
                        color="success"
                    />
                    Pension
                </label>
                <label htmlFor="union-toggle" className="flex items-center gap-2 font-medium">
                    <IconToggle
                        id="union-toggle"
                        defaultChecked={hasUnionDues}
                        onChange={checked => setHasUnionDues(checked)}
                        color="warning"
                    />
                    Union Dues
                </label>
                <button
                    type="submit"
                    className="ml-auto px-8 py-2 font-semibold rounded-md shadow bg-[var(--color-teal)] text-[var(--background)] transition-colors duration-200 hover:bg-[var(--color-teal-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal-dark)]"
                >
                    Calculate
                </button>
            </div>
        </form>
    );
}
