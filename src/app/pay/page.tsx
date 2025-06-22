//src/app/pay/page.tsx

'use client';

import { useRef, useState, useTransition, useEffect } from "react";
import WeeklyPayForm from "@/components/WeeklyPayForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import PrintButton from "@/components/PrintButton";
// import DownloadPDFButton from "@/components/DownloadPDFButton";
import type { WeeklyPayInput, WeeklyPayResult } from "@/lib/payUtils";
import { calculatePayAction } from "@/app/actions/calculatePay";

export default function PayCalculatorPage() {
    const [result, setResult] = useState<WeeklyPayResult | null>(null);
    const [pending, startTransition] = useTransition();
    const [formKey, setFormKey] = useState(0);           // ← add this
    const resultsRef = useRef<HTMLDivElement>(null);

    // load any saved result
    useEffect(() => {
        const stored = localStorage.getItem("weeklyPayResult");
        if (stored) {
            try { setResult(JSON.parse(stored)); }
            catch { localStorage.removeItem("weeklyPayResult"); }
        }
    }, []);

    // persist result whenever it changes
    useEffect(() => {
        if (result) {
            localStorage.setItem("weeklyPayResult", JSON.stringify(result));
        }
    }, [result]);

    const handleFormSubmit = (values: WeeklyPayInput) => {
        startTransition(async () => {
            const res = await calculatePayAction(values);
            setResult(res);
        });
    };

    const handleReset = () => {
        // 1) clear both storage keys
        localStorage.removeItem("weeklyPayResult");
        localStorage.removeItem("weeklyPayForm");

        // 2) clear displayed result
        setResult(null);

        // 3) force WeeklyPayForm to remount (and pick up its defaults)
        setFormKey((k) => k + 1);
    };

    return (
        <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center font-poppins">
                Weekly Pay Calculator
            </h1>

            {/* use `formKey` so remounting resets the form */}
            <WeeklyPayForm key={formKey} onSubmit={handleFormSubmit} />

            {pending && (
                <div className="text-center text-gray-500">Calculating...</div>
            )}

            {result && (
                <section className="w-full mt-4 space-y-4">
                    <div className="flex justify-end gap-2">
                        <PrintButton targetRef={resultsRef} />
                        {/* <DownloadPDFButton targetRef={resultsRef} /> */}
                        <button onClick={handleReset} className="btn btn-outline btn-sm">
                            Reset All
                        </button>
                    </div>
                    <div ref={resultsRef}>
                        <ResultsDisplay result={result} />
                    </div>
                </section>
            )}
        </main>
    );
}
