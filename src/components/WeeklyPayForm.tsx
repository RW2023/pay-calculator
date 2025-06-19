'use client';

import { useState } from 'react';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type DayEntry = {
    startTime: string;
    endTime: string;
    isHoliday: boolean;
};

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
            startTime: '',
            endTime: '',
            isHoliday: false,
        }))
    );
    const [hasPension, setHasPension] = useState(true);
    const [hasUnionDues, setHasUnionDues] = useState(true);

    // Responsive grid for days
    return (
        <form
            className="bg-[var(--color-neutral)] rounded-2xl shadow p-4 sm:p-6 flex flex-col gap-6"
            onSubmit={e => {
                e.preventDefault();
                onSubmit({ days, hasPension, hasUnionDues });
            }}
        >
            <div className="overflow-x-auto">
                <table className="table w-full min-w-[600px]">
                    <thead>
                        <tr>
                            <th className="text-left">Day</th>
                            <th className="text-left">Start Time</th>
                            <th className="text-left">End Time</th>
                            <th className="text-left">Holiday?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DAYS.map((label, idx) => (
                            <tr key={label}>
                                <td className="font-semibold">{label}</td>
                                <td>
                                    <input
                                        type="time"
                                        className="input input-bordered w-full"
                                        value={days[idx].startTime}
                                        onChange={e =>
                                            setDays(prev =>
                                                prev.map((d, i) =>
                                                    i === idx ? { ...d, startTime: e.target.value } : d
                                                )
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="time"
                                        className="input input-bordered w-full"
                                        value={days[idx].endTime}
                                        onChange={e =>
                                            setDays(prev =>
                                                prev.map((d, i) =>
                                                    i === idx ? { ...d, endTime: e.target.value } : d
                                                )
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-success"
                                        checked={days[idx].isHoliday}
                                        onChange={e =>
                                            setDays(prev =>
                                                prev.map((d, i) =>
                                                    i === idx ? { ...d, isHoliday: e.target.checked } : d
                                                )
                                            )
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
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
                    Pension Deduction
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
