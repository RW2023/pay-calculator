// components/ResultsDisplay.tsx
import { CheckCircle2, BadgeDollarSign } from "lucide-react";
import type { PayResult } from "@/lib/payUtils";

interface ResultsDisplayProps {
    result: PayResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
    return (
        <section className="w-full mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                {/* Regular Pay */}
                <div className="card bg-base-100 shadow rounded-xl p-4 border-l-4 border-[var(--color-olive)]">
                    <div className="font-semibold text-lg text-[var(--color-olive)] flex items-center gap-2">
                        Regular Pay
                    </div>
                    <div className="text-2xl font-bold">${result.regularPay.toFixed(2)}</div>
                </div>
                {/* Overtime Pay */}
                <div className="card bg-base-100 shadow rounded-xl p-4 border-l-4 border-[var(--color-teal)]">
                    <div className="font-semibold text-lg text-[var(--color-teal)] flex items-center gap-2">
                        Overtime Pay
                    </div>
                    <div className="text-2xl font-bold">${result.overtimePay.toFixed(2)}</div>
                </div>
                {/* Holiday Pay */}
                <div className="card bg-base-100 shadow rounded-xl p-4 border-l-4 border-yellow-500">
                    <div className="font-semibold text-lg text-yellow-500 flex items-center gap-2">
                        Holiday Pay
                        {result.lieuDayAccrued && (
                            <span className="badge badge-warning text-xs ml-2">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Lieu Day Accrued
                            </span>
                        )}
                    </div>
                    <div className="text-2xl font-bold">${result.holidayPay.toFixed(2)}</div>
                </div>
                {/* Deductions */}
                <div className="card bg-base-100 shadow rounded-xl p-4 border-l-4 border-[var(--color-neutral-dark)]">
                    <div className="font-semibold text-lg text-[var(--color-neutral-dark)]">
                        Deductions
                    </div>
                    <ul className="mt-1 text-base">
                        <li>Pension: <span className="font-bold text-[var(--color-teal-dark)]">${result.pensionDeducted.toFixed(2)}</span></li>
                        <li>Union Dues: <span className="font-bold text-[var(--color-teal-dark)]">${result.unionDuesDeducted.toFixed(2)}</span></li>
                    </ul>
                </div>
            </div>

            {/* Net Pay */}
            <div className="card bg-[var(--color-teal)] shadow-xl rounded-xl p-6 flex flex-col items-center border-none">
                <div className="flex items-center gap-2 text-2xl font-extrabold text-white uppercase tracking-wider">
                    <BadgeDollarSign className="w-8 h-8" />
                    Net Pay
                </div>
                <div className="mt-2 text-4xl font-extrabold text-white">
                    ${result.netPay.toFixed(2)}
                </div>
            </div>
        </section>
    );
}
