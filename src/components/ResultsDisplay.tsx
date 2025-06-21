// components/ResultsDisplay.tsx
import React, { forwardRef } from "react";
import { CheckCircle2, BadgeDollarSign, ReceiptText } from "lucide-react";
import type { WeeklyPayResult } from "@/lib/payUtils";

interface ResultsDisplayProps {
    result: WeeklyPayResult;
}

interface PayRow {
    label: string;
    value: number;
    color: string;
    border: string;
}

interface DeductionRow {
    label: string;
    value: number;
    color: string;
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

        // Determine if Saturday DT or DT OT applies
        const saturday = days.find(d => d.day === "Saturday");
        const satWorked = saturday?.hoursWorked ?? 0;
        const satOT = saturday?.overtimePay ?? 0;

        // Only include rows with a non-trivial value (> $0.009)
        const payRows: PayRow[] = [
            { label: "Regular Pay", value: regularPay, color: "text-[var(--color-olive)]", border: "border-[var(--color-olive)]" },
            {
                label: satOT > 0 ? "DT OT Pay" : "Overtime Pay",
                value: overtimePay,
                color: satOT > 0 ? "text-red-600" : "text-[var(--color-teal)]",
                border: satOT > 0 ? "border-red-500" : "border-[var(--color-teal)]",
            },
            { label: "Holiday Pay", value: holidayPay, color: "text-yellow-500", border: "border-yellow-500" },
            { label: "Lieu (Sick/Lieu) Pay", value: lieuPay, color: "text-blue-500", border: "border-blue-500" },
            { label: "BUMP Pay", value: bumpPay, color: "text-purple-500", border: "border-purple-500" },
            { label: "Night Shift Premium", value: nightShiftPay, color: "text-slate-700", border: "border-slate-500" },
            { label: "Weekend Premium", value: weekendPay, color: "text-amber-700", border: "border-amber-500" },
            { label: "Weekend OT Premium", value: weekendOTPay, color: "text-rose-700", border: "border-rose-500" },
            { label: "Gross Pay", value: grossPay, color: "text-gray-500", border: "border-gray-400" },
        ].filter(row => row.value > 0.009);

        const deductionRows: DeductionRow[] = [
            { label: "Tax", value: federalTax, color: "text-rose-700" },
            { label: "EI", value: ei, color: "text-sky-600" },
            { label: "CPP", value: cpp, color: "text-indigo-600" },
            { label: "Pension", value: pensionDeducted, color: "text-[var(--color-teal-dark)]" },
            { label: "Union Dues", value: unionDuesDeducted, color: "text-[var(--color-teal-dark)]" },
        ].filter(row => row.value > 0.009);

        return (
            <section ref={ref} className="w-full mt-4 space-y-6">
                {/* Earnings Breakdown */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {payRows.map(({ label, value, color, border }) => (
                        <div
                            key={label}
                            className={`card shadow rounded-xl p-4 border-l-4 ${border} bg-[var(--color-neutral)]`}
                        >
                            <div className={`font-semibold text-lg ${color} flex items-center gap-2`}>
                                {label}
                                {label === "Holiday Pay" && lieuDaysAccrued > 0 && (
                                    <span className="badge badge-warning text-xs ml-2">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Lieu Day{lieuDaysAccrued > 1 ? "s" : ""} Accrued ({lieuDaysAccrued})
                                    </span>
                                )}
                            </div>
                            <div className="text-2xl font-bold">${value.toFixed(2)}</div>
                        </div>
                    ))}
                </div>

                {/* Deductions */}
                <div className="card shadow rounded-xl p-6 border-t-4 border-[var(--color-neutral-dark)] bg-[var(--color-neutral)]">
                    <div className="flex items-center gap-2 font-semibold text-lg text-[var(--color-neutral-dark)] mb-2">
                        <ReceiptText className="w-5 h-5" /> Deductions
                    </div>
                    <ul className="mt-1 text-base space-y-1">
                        {deductionRows.map(({ label, value, color }) => (
                            <li key={label}>
                                {label}: <span className={`font-bold ${color}`}>${value.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Net Pay and Quick Stats */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="card shadow-xl rounded-xl p-6 flex flex-col items-center border-none bg-[var(--color-teal)]">
                        <div className="flex items-center gap-2 text-2xl font-extrabold text-white uppercase tracking-wider">
                            <BadgeDollarSign className="w-8 h-8" />
                            Net Pay
                        </div>
                        <div className="mt-2 text-4xl font-extrabold text-white">
                            ${Number.isFinite(netPay) ? netPay.toFixed(2) : "0.00"}
                        </div>
                    </div>
                    <div className="card shadow-xl rounded-xl p-6 flex flex-col justify-center border-none bg-[var(--color-neutral)]">
                        <div className="font-semibold text-lg text-[var(--color-olive)] mb-2">
                            Quick Stats
                        </div>
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

ResultsDisplay.displayName = "ResultsDisplay";
export default ResultsDisplay;
