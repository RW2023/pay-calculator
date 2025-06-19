'use client';

import { useState } from 'react';
import type { DayEntry } from '@/lib/payUtils'; // <-- adjust import path if needed

const DAYS = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

type WeeklyPayFormProps = {
    onSubmit: (values: {
        days: DayEntry[];
        hasPension: boolean;
        hasUnionDues: boolean;
    }) => void;
};

export default function WeeklyPayForm({ onSubmit }: WeeklyPayFormProps) {
    const [days, setDays] = useState<DayEntry[]>(
        DAYS.map(() => ({
            scheduledStart: '21:00',
            scheduledEnd: '05:30',
            actualStart: '',
            actualEnd: '',
            lunchTaken: true,
            isHoliday: false,
            isBump: false,
            lieuHoursUsed: 0,
        }))
    );
    const [hasPension, setHasPension] = useState(true);
    const [hasUnionDues, setHasUnionDues] = useState(true);

    return (
        <form
            className="bg-[var(--color-neutral)] rounded-2xl shadow p-4 sm:p-6 flex flex-col gap-6"
            onSubmit={e => {
                e.preventDefault();
                onSubmit({ days, hasPension, hasUnionDues });
            }}
            aria-label="Weekly Pay Input Form"
        >
            <div className="overflow-x-auto">
                <table className="table w-full min-w-[1050px]">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Sched. Start</th>
                            <th>Sched. End</th>
                            <th>Actual Start</th>
                            <th>Actual End</th>
                            <th>Lunch?</th>
                            <th>Holiday?</th>
                            <th>BUMP?</th>
                            <th>Lieu Used (hrs)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DAYS.map((label, idx) => {
                            const day = days[idx] ?? {
                                scheduledStart: '',
                                scheduledEnd: '',
                                actualStart: '',
                                actualEnd: '',
                                lunchTaken: true,
                                isHoliday: false,
                                isBump: false,
                                lieuHoursUsed: 0,
                            };
                            return (
                                <tr key={label}>
                                    <td className="font-semibold">{label}</td>
                                    <td>
                                        <input
                                        title='Scheduled Start Time'
                                            type="time"
                                            className="input input-bordered w-full"
                                            value={day?.scheduledStart ?? ''}
                                            onChange={e =>
                                                setDays(prev =>
                                                    prev.map((d, i) =>
                                                        i === idx
                                                            ? { ...d, scheduledStart: e.target.value }
                                                            : d
                                                    )
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                        title='Scheduled End Time'
                                            type="time"
                                            className="input input-bordered w-full"
                                            value={day?.scheduledEnd ?? ''}
                                            onChange={e =>
                                                setDays(prev =>
                                                    prev.map((d, i) =>
                                                        i === idx
                                                            ? { ...d, scheduledEnd: e.target.value }
                                                            : d
                                                    )
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="time"
                                            className="input input-bordered w-full"
                                            value={day?.actualStart ?? ''}
                                            onChange={e =>
                                                setDays(prev =>
                                                    prev.map((d, i) =>
                                                        i === idx
                                                            ? { ...d, actualStart: e.target.value }
                                                            : d
                                                    )
                                                )
                                            }
                                            placeholder="--:--"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="time"
                                            className="input input-bordered w-full"
                                            value={day?.actualEnd ?? ''}
                                            onChange={e =>
                                                setDays(prev =>
                                                    prev.map((d, i) =>
                                                        i === idx
                                                            ? { ...d, actualEnd: e.target.value }
                                                            : d
                                                    )
                                                )
                                            }
                                            placeholder="--:--"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="toggle toggle-info"
                                            checked={day.lunchTaken}
                                            onChange={e =>
                                                setDays(prev =>
                                                    prev.map((d, i) =>
                                                        i === idx
                                                            ? { ...d, lunchTaken: e.target.checked }
                                                            : d
                                                    )
                                                )
                                            }
                                            title="Lunch taken (deduct 0.5h)"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="toggle toggle-success"
                                            checked={day.isHoliday}
                                            onChange={e =>
                                                setDays(prev =>
                                                    prev.map((d, i) =>
                                                        i === idx
                                                            ? { ...d, isHoliday: e.target.checked }
                                                            : d
                                                    )
                                                )
                                            }
                                            title="Holiday (time & half + Lieu day)"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="toggle toggle-warning"
                                            checked={day.isBump}
                                            onChange={e =>
                                                setDays(prev =>
                                                    prev.map((d, i) =>
                                                        i === idx
                                                            ? { ...d, isBump: e.target.checked }
                                                            : d
                                                    )
                                                )
                                            }
                                            title="BUMP (pay to full scheduled shift if ended early)"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="input input-bordered w-16"
                                            min={0}
                                            max={8}
                                            step={0.25}
                                            value={day.lieuHoursUsed}
                                            onChange={e =>
                                                setDays(prev =>
                                                    prev.map((d, i) =>
                                                        i === idx
                                                            ? { ...d, lieuHoursUsed: Math.max(0, Number(e.target.value) || 0) }
                                                            : d
                                                    )
                                                )
                                            }
                                            title="Lieu/Sick Hours Used"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* Deductions toggles */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <label className="flex items-center gap-2 font-medium">
                    <input
                        type="checkbox"
                        className="toggle toggle-info"
                        checked={hasPension}
                        onChange={e => setHasPension(e.target.checked)}
                    />
                    Pension
                </label>
                <label className="flex items-center gap-2 font-medium">
                    <input
                        type="checkbox"
                        className="toggle toggle-warning"
                        checked={hasUnionDues}
                        onChange={e => setHasUnionDues(e.target.checked)}
                    />
                    Union Dues
                </label>
                <button type="submit" className="btn btn-primary ml-auto px-8">
                    Calculate
                </button>
            </div>
        </form>
    );
}
