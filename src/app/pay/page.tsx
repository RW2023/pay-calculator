'use client';

import { useRef, useState, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import WeeklyPayForm, { WeeklyPayInput } from "@/components/WeeklyPayForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import PrintButton from "@/components/PrintButton";
import type { WeeklyPayResult } from "@/lib/payUtils";
import { calculatePayAction } from "@/app/actions/calculatePay";

export default function PayCalculatorPage() {
    const searchParams = useSearchParams();
    const editId = searchParams.get("editId") ?? undefined;

    const [initialValues, setInitialValues] = useState<WeeklyPayInput>();
    const [result, setResult] = useState<WeeklyPayResult | null>(null);
    const [pending, startTransition] = useTransition();
    const [formKey, setFormKey] = useState(0);
    const resultsRef = useRef<HTMLDivElement>(null);

    // Load saved week when ?editId= is present
    useEffect(() => {
        if (editId) {
            fetch(`/api/entries/${editId}`)
                .then(async (res) => {
                    if (!res.ok) throw new Error(await res.text());
                    return res.json() as Promise<WeeklyPayInput & { createdAt: string }>;
                })
                .then((entry) => {
                    setInitialValues({
                        days: entry.days,
                        hasPension: entry.hasPension,
                        hasUnionDues: entry.hasUnionDues,
                    });
                    // remount form to pick up new initialValues
                    setFormKey((k) => k + 1);
                })
                .catch((err) => {
                    console.error("Failed to load entry for edit:", err);
                });
        }
    }, [editId]);

    // Submit: re-save (snapshot) + calculate
    function handleFormSubmit(values: WeeklyPayInput) {
        startTransition(async () => {
            // optional: snapshot new version
            await fetch("/api/entries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const res = await calculatePayAction(values);
            setResult(res);
        });
    }

    const handleReset = () => {
        setResult(null);
        setInitialValues(undefined);
        setFormKey((k) => k + 1);
    };

    return (
        <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center font-poppins">
                Weekly Pay Calculator
            </h1>

            <WeeklyPayForm
                key={formKey}
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
            />

            {pending && (
                <div className="text-center text-gray-500">
                    {editId ? "Loading & saving…" : "Calculating…"}
                </div>
            )}

            {result && (
                <section className="w-full mt-4 space-y-4">
                    <div className="flex justify-end gap-2">
                        <PrintButton targetRef={resultsRef} />
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
