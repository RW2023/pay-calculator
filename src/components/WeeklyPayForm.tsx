'use client';

import { useState, useEffect } from 'react';
import type { DayEntry } from '@/lib/payUtils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

    const safeTime = (val: string | undefined) => (typeof val === 'string' ? val : '');

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                onSubmit({ days, hasPension, hasUnionDues });
            }}
            className="bg-[var(--background)] text-[var(--foreground)] rounded-2xl shadow p-4 sm:p-6 flex flex-col gap-6 transition-colors duration-300"
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
                                    <th scope="row" className="font-semibold">{label}</th>
                                    <td>
                                        <input
                                            id={`${label}-scheduled-start`}
                                            type="time"
                                            className="input input-bordered w-full"
                                            value={safeTime(day.scheduledStart)}
                                            aria-label={`${label} scheduled start`}
                                            onChange={e =>
                                                setDays(prev =>
                                                    prev.map((d, i) =>
                                                        i === idx ? { ...d, scheduledStart: e.target.value } : d
                                                    )
                                                )
                                            }
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            id={`${label}-scheduled-end`}
                                            type="time"
                                            className="input input-bordered w-full"
                                            value={safeTime(day.scheduledEnd)}
                                            aria-label={`${label} scheduled end`}
                                            onChange={e =>
                                                setDays(prev =>
                                                    prev.map((d, i) =>
                                                        i === idx ? { ...d, scheduledEnd: e.target.value } : d
                                                    )
                                                )
                                            }
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            id={`${label}-actual-start`}
                                            type="time"
                                            className="input input-bordered w-full"
                                            value={safeTime(day.actualStart)}
                                            aria-label={`${label} actual start`}
                                            onChange={e =>
                                                setDays(prev =>
                                                    prev.map((d, i) =>
                                                        i === idx ? { ...d, actualStart: e.target.value } : d
                                                    )
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            id={`${label}-actual-end`}
                                            type="time"
                                            className="input input-bordered w-full"
                                            value={safeTime(day.actualEnd)}
                                            aria-label={`${label} actual end`}
                                            onChange={e =>
                                                setDays(prev =>
                                                    prev.map((d, i) =>
                                                        i === idx ? { ...d, actualEnd: e.target.value } : d
                                                    )
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <select
                                            id={`${label}-break-minutes`}
                                            className="input input-sm w-full"
                                            value={day.breakMinutes}
                                            aria-label={`${label} break minutes`}
                                            onChange={e =>
                                                setDays(prev =>
                                                    prev.map((d, i) =>
                                                        i === idx ? { ...d, breakMinutes: Number(e.target.value) } : d
                                                    )
                                                )
                                            }
                                        >
                                            <option value={0}>0</option>
                                            <option value={30}>30</option>
                                            <option value={45}>45</option>
                                            <option value={60}>60</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            id={`${label}-is-holiday`}
                                            type="checkbox"
                                            className="toggle toggle-success"
                                            checked={day.isHoliday}
                                            aria-label={`${label} is holiday`}
                                            onChange={e =>
                                                setDays(prev =>
                                                    prev.map((d, i) =>
                                                        i === idx ? { ...d, isHoliday: e.target.checked } : d
                                                    )
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            id={`${label}-is-bump`}
                                            type="checkbox"
                                            className="toggle toggle-warning"
                                            checked={day.isBump}
                                            aria-label={`${label} is bump`}
                                            onChange={e =>
                                                setDays(prev =>
                                                    prev.map((d, i) =>
                                                        i === idx ? { ...d, isBump: e.target.checked } : d
                                                    )
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            id={`${label}-lieu-hours-used`}
                                            type="number"
                                            className="input input-bordered w-16"
                                            min={0}
                                            max={8}
                                            step={0.25}
                                            value={Number.isFinite(day.lieuHoursUsed) ? day.lieuHoursUsed : 0}
                                            aria-label={`${label} lieu hours used`}
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

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <label className="flex items-center gap-2 font-medium">
                    <input
                        type="checkbox"
                        className="toggle toggle-info"
                        checked={hasPension}
                        aria-label="Pension deductions?"
                        onChange={e => setHasPension(e.target.checked)}
                    />
                    Pension
                </label>
                <label className="flex items-center gap-2 font-medium">
                    <input
                        type="checkbox"
                        className="toggle toggle-warning"
                        checked={hasUnionDues}
                        aria-label="Union dues deductions?"
                        onChange={e => setHasUnionDues(e.target.checked)}
                    />
                    Union Dues
                </label>
                <button
                    type="submit"
                    className="btn btn-primary ml-auto px-8"
                    aria-label="Calculate weekly pay"
                >
                    Calculate
                </button>
            </div>
        </form>
    );
}
