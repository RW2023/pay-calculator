import { CheckCircle2, BadgeDollarSign, ReceiptText } from "lucide-react";
import type { WeeklyPayResult } from "@/lib/payUtils";

interface ResultsDisplayProps {
    result: WeeklyPayResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
    const t = result.totals;

    // Helper: only show rows for positive values
    const payRows = [
        { label: "Regular Pay", value: t.regularPay, color: "text-[var(--color-olive)]", border: "border-[var(--color-olive)]" },
        { label: "Overtime Pay", value: t.overtimePay, color: "text-[var(--color-teal)]", border: "border-[var(--color-teal)]" },
        { label: "Holiday Pay", value: t.holidayPay, color: "text-yellow-500", border: "border-yellow-500" },
        { label: "Lieu (Sick/Leu) Pay", value: t.lieuPay, color: "text-blue-500", border: "border-blue-500" },
        { label: "BUMP Pay", value: t.bumpPay, color: "text-purple-500", border: "border-purple-500" },
        { label: "Gross Pay", value: t.grossPay, color: "text-gray-500", border: "border-gray-400" }
    ].filter(r => r.value && Math.abs(r.value) > 0.009); // Hide zeroes

    const deductionRows = [
        { label: "Tax", value: t.federalTax, color: "text-rose-700" },
        { label: "EI", value: t.ei, color: "text-sky-600" },
        { label: "CPP", value: t.cpp, color: "text-indigo-600" },
        { label: "Pension", value: t.pensionDeducted, color: "text-[var(--color-teal-dark)]" },
        { label: "Union Dues", value: t.unionDuesDeducted, color: "text-[var(--color-teal-dark)]" }
    ].filter(r => r.value && Math.abs(r.value) > 0.009);

    return (
        <section className="w-full mt-4 space-y-6">
            {/* Earnings Breakdown */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {payRows.map((r) => (
                    <div
                        key={r.label}
                        className={`card bg-base-100 shadow rounded-xl p-4 border-l-4 ${r.border}`}
                    >
                        <div className={`font-semibold text-lg ${r.color} flex items-center gap-2`}>
                            {r.label}
                            {r.label === "Holiday Pay" && (t.lieuDaysAccrued ?? 0) > 0 && (
                                <span className="badge badge-warning text-xs ml-2">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Lieu Day{t.lieuDaysAccrued > 1 ? "s" : ""} Accrued ({t.lieuDaysAccrued})
                                </span>
                            )}
                        </div>
                        <div className="text-2xl font-bold">${(r.value ?? 0).toFixed(2)}</div>
                    </div>
                ))}
            </div>

            {/* Deductions */}
            <div className="card bg-base-100 shadow rounded-xl p-6 border-t-4 border-[var(--color-neutral-dark)]">
                <div className="flex items-center gap-2 font-semibold text-lg text-[var(--color-neutral-dark)] mb-2">
                    <ReceiptText className="w-5 h-5" /> Deductions
                </div>
                <ul className="mt-1 text-base space-y-1">
                    {deductionRows.map(r => (
                        <li key={r.label}>
                            {r.label}: <span className={`font-bold ${r.color}`}>${(r.value ?? 0).toFixed(2)}</span>
                        </li>
                    ))}
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
                        {t.lieuDaysAccrued > 0 && (
                            <li>
                                <span className="font-semibold">Lieu Days Accrued:</span>{" "}
                                <span>{t.lieuDaysAccrued ?? 0}</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </section>
    );
}
