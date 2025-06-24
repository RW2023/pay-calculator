import React, { forwardRef } from 'react';
import { CheckCircle2, BadgeDollarSign, ReceiptText } from 'lucide-react';
import type { WeeklyPayResult } from '@/lib/payUtils';

interface ResultsDisplayProps {
    result: WeeklyPayResult;
}
interface PayRow {
    label: string;
    value: number;
    colorClass: string;
    borderClass: string;
}
interface DeductionRow {
    label: string;
    value: number;
    colorClass: string;
}

const ResultsDisplay = forwardRef<HTMLDivElement, ResultsDisplayProps>(
    ({ result }, ref) => {
        const {
            days,
            totals: {
                regularPay,
                overtimePay,
                holidayPay,
                lieuPay,
                bumpPay,
                nightShiftPay,
                weekendPay,
                weekendOTPay,
                grossPay,
                federalTax,
                ei,
                cpp,
                pensionDeducted,
                unionDuesDeducted,
                netPay,
                totalHours,
                lieuDaysAccrued,
            },
        } = result;

        const saturday = days.find((d) => d.day === 'Saturday');
        const satWorked = saturday?.hoursWorked ?? 0;
        const satOT = saturday?.overtimePay ?? 0;

        /* ─────────────  Earnings rows (all green)  ───────────── */
        const greenText = 'text-green-500 font-semibold';
        const greenBorder = 'border-green-500';

        const payRows: PayRow[] = [
            { label: 'Regular Pay', value: regularPay },
            { label: satOT > 0 ? 'DT OT Pay' : 'Overtime Pay', value: overtimePay },
            { label: 'Holiday Pay', value: holidayPay },
            { label: 'Lieu (Sick/Lieu) Pay', value: lieuPay },
            { label: 'BUMP Pay', value: bumpPay },
            { label: 'Night Shift Premium', value: nightShiftPay },
            { label: 'Weekend Premium', value: weekendPay },
            { label: 'Weekend OT Premium', value: weekendOTPay },
            { label: 'Gross Pay', value: grossPay },
        ]
            .filter((r) => r.value > 0.009)
            .map((r) => ({ ...r, colorClass: greenText, borderClass: greenBorder }));

        /* ─────────────  Deductions rows  ───────────── */
        const deductionRows: DeductionRow[] = [
            { label: 'Tax', value: federalTax, colorClass: 'text-red-500' },
            { label: 'EI', value: ei, colorClass: 'text-blue-500' },
            { label: 'CPP', value: cpp, colorClass: 'text-purple-500' },
            { label: 'Pension', value: pensionDeducted, colorClass: 'text-neutral-dark' },
            { label: 'Union Dues', value: unionDuesDeducted, colorClass: 'text-accent' },
        ].filter((r) => r.value > 0.009);

        return (
            <section ref={ref} className="w-full mt-4 space-y-6">

                {/* ── Earnings ────────────────── */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {payRows.map(({ label, value, colorClass, borderClass }) => (
                        <div
                            key={label}
                            className={`card shadow rounded-xl p-4 border-l-4 ${borderClass} bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300`}
                        >
                            <div className={`flex items-center gap-2 font-semibold text-lg ${colorClass}`}>
                                {label}
                                {label === 'Holiday Pay' && lieuDaysAccrued > 0 && (
                                    <span className="badge badge-warning text-xs ml-2">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Lieu Day{lieuDaysAccrued > 1 ? 's' : ''} Accrued ({lieuDaysAccrued})
                                    </span>
                                )}
                            </div>
                            <div className="text-2xl font-bold">${value.toFixed(2)}</div>
                        </div>
                    ))}
                </div>

                {/* ── Deductions ──────────────── */}
                <div className="card shadow rounded-xl p-6 border-t-4 border-neutral-dark bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
                    <div className="flex items-center gap-2 font-semibold text-lg text-neutral-dark mb-2">
                        <ReceiptText className="w-5 h-5" /> Deductions
                    </div>
                    <ul className="mt-1 text-base space-y-1">
                        {deductionRows.map(({ label, value, colorClass }) => (
                            <li
                                key={label}
                                className={`flex justify-between items-center ${colorClass}`}
                            >
                                <span className="font-medium">{label}:</span>
                                <span className="font-bold">${value.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Net Pay & Stats ──────────── */}
                <div className="grid sm:grid-cols-2 gap-6">
                    {/* Net Pay */}
                    <div className="card shadow-xl rounded-xl p-6 flex flex-col items-center border-none bg-[var(--color-teal)] text-[var(--background)] dark:bg-[var(--color-neutral-dark)] dark:text-[var(--foreground)] transition-colors duration-300">
                        <div className="flex items-center gap-2 text-2xl font-extrabold uppercase tracking-wider">
                            <BadgeDollarSign className="w-8 h-8" /> Net Pay
                        </div>
                        <div className="mt-2 text-4xl font-extrabold">
                            ${Number.isFinite(netPay) ? netPay.toFixed(2) : '0.00'}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="card shadow-xl rounded-xl p-6 flex flex-col justify-center border-none bg-neutral text-[var(--foreground)]">
                        <div className="font-semibold text-lg text-[--color-olive] mb-2">Quick Stats</div>
                        <ul className="space-y-1">
                            <li>
                                <span className="font-semibold">Total Hours Paid:</span> {totalHours.toFixed(2)} hrs
                            </li>
                            {satWorked > 0 && (
                                <li>
                                    <span className="font-semibold">DT Rate:</span> 2×
                                </li>
                            )}
                            {satOT > 0 && (
                                <li>
                                    <span className="font-semibold">DT OT Rate:</span> 2.5×
                                </li>
                            )}
                            {lieuDaysAccrued > 0 && (
                                <li>
                                    <span className="font-semibold">Lieu Days Accrued:</span> {lieuDaysAccrued}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </section>
        );
    }
);

ResultsDisplay.displayName = 'ResultsDisplay';
export default ResultsDisplay;
