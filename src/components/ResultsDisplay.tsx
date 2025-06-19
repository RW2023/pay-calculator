import { CheckCircle2, BadgeDollarSign, ReceiptText } from "lucide-react";
import type { WeeklyPayResult } from "@/lib/payUtils";

interface ResultsDisplayProps {
    result: WeeklyPayResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
    const t = result.totals; // shortcut

    return (
        <section className="w-full mt-4 space-y-6">
            {/* Earnings Breakdown */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {/* Regular Pay */}
                <div className="card bg-base-100 shadow rounded-xl p-4 border-l-4 border-[var(--color-olive)]">
                    <div className="font-semibold text-lg text-[var(--color-olive)] flex items-center gap-2">
                        Regular Pay
                    </div>
                    <div className="text-2xl font-bold">${(t.regularPay ?? 0).toFixed(2)}</div>
                </div>
                {/* Overtime Pay */}
                <div className="card bg-base-100 shadow rounded-xl p-4 border-l-4 border-[var(--color-teal)]">
                    <div className="font-semibold text-lg text-[var(--color-teal)] flex items-center gap-2">
                        Overtime Pay
                    </div>
                    <div className="text-2xl font-bold">${(t.overtimePay ?? 0).toFixed(2)}</div>
                </div>
                {/* Holiday Pay */}
                <div className="card bg-base-100 shadow rounded-xl p-4 border-l-4 border-yellow-500">
                    <div className="font-semibold text-lg text-yellow-500 flex items-center gap-2">
                        Holiday Pay
                        {(t.lieuDaysAccrued ?? 0) > 0 && (
                            <span className="badge badge-warning text-xs ml-2">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Lieu Day{t.lieuDaysAccrued > 1 ? "s" : ""} Accrued ({t.lieuDaysAccrued})
                            </span>
                        )}
                    </div>
                    <div className="text-2xl font-bold">${(t.holidayPay ?? 0).toFixed(2)}</div>
                </div>
                {/* Lieu (Sick/Leu) Pay */}
                <div className="card bg-base-100 shadow rounded-xl p-4 border-l-4 border-blue-500">
                    <div className="font-semibold text-lg text-blue-500 flex items-center gap-2">
                        Lieu (Sick/Leu) Pay
                    </div>
                    <div className="text-2xl font-bold">${(t.lieuPay ?? 0).toFixed(2)}</div>
                </div>
                {/* BUMP Pay */}
                <div className="card bg-base-100 shadow rounded-xl p-4 border-l-4 border-purple-500">
                    <div className="font-semibold text-lg text-purple-500 flex items-center gap-2">
                        BUMP Pay
                    </div>
                    <div className="text-2xl font-bold">${(t.bumpPay ?? 0).toFixed(2)}</div>
                </div>
                {/* Gross Pay */}
                <div className="card bg-base-100 shadow rounded-xl p-4 border-l-4 border-gray-400">
                    <div className="font-semibold text-lg text-gray-500 flex items-center gap-2">
                        Gross Pay
                    </div>
                    <div className="text-2xl font-bold">${(t.grossPay ?? 0).toFixed(2)}</div>
                </div>
            </div>

            {/* Deductions */}
            <div className="card bg-base-100 shadow rounded-xl p-6 border-t-4 border-[var(--color-neutral-dark)]">
                <div className="flex items-center gap-2 font-semibold text-lg text-[var(--color-neutral-dark)] mb-2">
                    <ReceiptText className="w-5 h-5" /> Deductions
                </div>
                <ul className="mt-1 text-base space-y-1">
                    <li>
                        Tax: <span className="font-bold text-rose-700">${(t.federalTax ?? 0).toFixed(2)}</span>
                    </li>
                    <li>
                        EI: <span className="font-bold text-sky-600">${(t.ei ?? 0).toFixed(2)}</span>
                    </li>
                    <li>
                        CPP: <span className="font-bold text-indigo-600">${(t.cpp ?? 0).toFixed(2)}</span>
                    </li>
                    <li>
                        Pension: <span className="font-bold text-[var(--color-teal-dark)]">${(t.pensionDeducted ?? 0).toFixed(2)}</span>
                    </li>
                    <li>
                        Union Dues: <span className="font-bold text-[var(--color-teal-dark)]">${(t.unionDuesDeducted ?? 0).toFixed(2)}</span>
                    </li>
                </ul>
            </div>

            {/* Net Pay and Quick Stats */}
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="card bg-[var(--color-teal)] shadow-xl rounded-xl p-6 flex flex-col items-center border-none">
                    <div className="flex items-center gap-2 text-2xl font-extrabold text-white uppercase tracking-wider">
                        <BadgeDollarSign className="w-8 h-8" />
                        Net Pay
                    </div>
                    <div className="mt-2 text-4xl font-extrabold text-white">
                        ${Number.isFinite(t.netPay) ? t.netPay.toFixed(2) : "0.00"}
                    </div>
                </div>
                <div className="card bg-base-100 shadow-xl rounded-xl p-6 flex flex-col justify-center border-none">
                    <div className="font-semibold text-lg text-[var(--color-olive)] mb-2">
                        Quick Stats
                    </div>
                    <ul className="space-y-1">
                        <li>
                            <span className="font-semibold">Total Hours Paid:</span>{" "}
                            <span>{(t.totalHours ?? 0).toFixed(2)} hrs</span>
                        </li>
                        <li>
                            <span className="font-semibold">Lieu Days Accrued:</span>{" "}
                            <span>{t.lieuDaysAccrued ?? 0}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
