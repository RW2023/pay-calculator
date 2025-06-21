'use client';

import { useRef, useState, useTransition, useEffect } from "react";
import WeeklyPayForm from "@/components/WeeklyPayForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import PrintButton from "@/components/PrintButton";
// import DownloadPDFButton from "@/components/DownloadPDFButton"; <-- troubleshooting. will enable later 
import type { WeeklyPayInput, WeeklyPayResult } from "@/lib/payUtils";
import { calculatePayAction } from "@/app/actions/calculatePay";

export default function PayCalculatorPage() {
    const [result, setResult] = useState<WeeklyPayResult | null>(null);
    const [pending, startTransition] = useTransition();
    const resultsRef = useRef<HTMLDivElement>(null);

    // 1. Load persisted result on mount
    useEffect(() => {
        const stored = localStorage.getItem("weeklyPayResult");
        if (stored) {
            try {
                setResult(JSON.parse(stored));
            } catch {
                localStorage.removeItem("weeklyPayResult");
            }
        }
    }, []);

    // 2. Persist to localStorage whenever result changes
    useEffect(() => {
        if (result) {
            localStorage.setItem("weeklyPayResult", JSON.stringify(result));
        }
    }, [result]);

    const handleFormSubmit = (values: WeeklyPayInput) => {
        startTransition(async () => {
            const res = await calculatePayAction(values); // <- Runs on server!
            setResult(res);
        });
    };

    // 3. Reset handler
    const handleReset = () => {
        setResult(null);
        localStorage.removeItem("weeklyPayResult");
    };

    return (
        <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center font-poppins">
                Weekly Pay Calculator
            </h1>

            <WeeklyPayForm onSubmit={handleFormSubmit} />

            {pending && (
                <div className="text-center text-gray-500">Calculating...</div>
            )}

            {result && (
                <section className="w-full mt-4 space-y-4">
                    <div className="flex justify-end gap-2">
                        <PrintButton targetRef={resultsRef} />
                        {/* <DownloadPDFButton targetRef={resultsRef} /> */}
                        <button
                            onClick={handleReset}
                            className="btn btn-outline btn-sm"
                        >
                            Reset
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
