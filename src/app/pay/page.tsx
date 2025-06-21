// app/pay/page.tsx
"use client";
import { useRef, useState } from "react";
import WeeklyPayForm from "@/components/WeeklyPayForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import PrintButton from "@/components/PrintButton";
import { calculateWeeklyPay, WeeklyPayInput, WeeklyPayResult } from "@/lib/payUtils";
import DownloadPDFButton from "@/components/DownloadPDFButton";

export default function PayCalculatorPage() {
    const [result, setResult] = useState<WeeklyPayResult | null>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const handleFormSubmit = (values: WeeklyPayInput) => {
        setResult(calculateWeeklyPay(values));
    };

    return (
        <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center font-poppins">
                Weekly Pay Calculator
            </h1>
            <WeeklyPayForm onSubmit={handleFormSubmit} />
            {result && (
                <section className="w-full mt-4 space-y-4">
                    <div className="flex justify-end">
                        <PrintButton targetRef={resultsRef} />
                        <DownloadPDFButton targetRef={resultsRef} />
                    </div>
                    <ResultsDisplay ref={resultsRef} result={result} />
                </section>
            )}
        </main>
    );
}
