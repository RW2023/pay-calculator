'use client';

import { useState, useTransition } from 'react';
import WeeklyPayForm from '@/components/WeeklyPayForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import type { WeeklyPayInput, WeeklyPayResult } from '@/lib/payUtils';
import { calculatePayAction } from '@/app/actions/calculatePay';

export default function PayCalculatorPage() {
    const [result, setResult] = useState<WeeklyPayResult | null>(null);
    const [pending, startTransition] = useTransition();

    const handleFormSubmit = (values: WeeklyPayInput) => {
        startTransition(async () => {
            const res = await calculatePayAction(values);
            setResult(res);
        });
    };

    return (
        <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center font-poppins">
                Weekly Pay Calculator
            </h1>
            <WeeklyPayForm onSubmit={handleFormSubmit} />
            {pending && <div className="text-center text-gray-500">Calculating...</div>}
            {result && <ResultsDisplay result={result} />}
        </main>
    );
}
