'use client';

import { useState } from 'react';
import WeeklyPayForm from '@/components/WeeklyPayForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import { calculatePay, PayInput, PayResult } from '@/lib/payUtils';

export default function PayCalculatorPage() {
    const [result, setResult] = useState<PayResult | null>(null);

    const handleFormSubmit = (values: PayInput) => {
        setResult(calculatePay(values));
    };

    return (
        <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center font-poppins">
                Weekly Pay Calculator
            </h1>
            <WeeklyPayForm onSubmit={handleFormSubmit} />
            {result && <ResultsDisplay result={result} />}
        </main>
    );
}
