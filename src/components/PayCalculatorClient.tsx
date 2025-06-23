// components/PayCalculatorClient.tsx
'use client';

import { useRef, useState, useTransition, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import WeeklyPayForm, { WeeklyPayInput } from '@/components/WeeklyPayForm';
import type { DayEntry, WeeklyPayResult } from '@/lib/payUtils';
import ResultsDisplay from '@/components/ResultsDisplay';
import PrintButton from '@/components/PrintButton';
import { calculatePayAction } from '@/app/actions/calculatePay';

const DEFAULT_BREAK_MINUTES = 30;
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function PayCalculatorClient() {
    const searchParams = useSearchParams();
    const editId = searchParams.get('editId') ?? undefined;

    const [initialValues, setInitialValues] = useState<WeeklyPayInput | undefined>();
    const [result, setResult] = useState<WeeklyPayResult | null>(null);
    const [pending, startTransition] = useTransition();
    const [formKey, setFormKey] = useState(0);
    const resultsRef = useRef<HTMLDivElement>(null);

    /* 1. Load saved entry if ?editId= */
    useEffect(() => {
        if (!editId) {
            setInitialValues(undefined);
            return;
        }

        const loadEntry = async () => {
            try {
                const res = await fetch(`/api/entries/${editId}`);
                if (!res.ok) throw new Error(`Failed to load entry: ${res.statusText}`);

                const raw = (await res.json()) as {
                    days: unknown;
                    hasPension: boolean;
                    hasUnionDues: boolean;
                };
                if (!Array.isArray(raw.days)) throw new Error('Invalid data format');

                const mappedDays: DayEntry[] = DAYS.map((_, i) => {
                    const d = (raw.days as Partial<DayEntry>[])[i] ?? {};
                    return {
                        scheduledStart: typeof d.scheduledStart === 'string' ? d.scheduledStart : '',
                        scheduledEnd: typeof d.scheduledEnd === 'string' ? d.scheduledEnd : '',
                        actualStart: typeof d.actualStart === 'string' ? d.actualStart : '',
                        actualEnd: typeof d.actualEnd === 'string' ? d.actualEnd : '',
                        breakMinutes: typeof d.breakMinutes === 'number' ? d.breakMinutes : DEFAULT_BREAK_MINUTES,
                        isHoliday: !!d.isHoliday,
                        isBump: !!d.isBump,
                        lieuHoursUsed: typeof d.lieuHoursUsed === 'number' ? d.lieuHoursUsed : 0,
                    };
                });

                setInitialValues({ days: mappedDays, hasPension: raw.hasPension, hasUnionDues: raw.hasUnionDues });
                setFormKey(k => k + 1);
            } catch (err) {
                console.error(err);
            }
        };

        void loadEntry();
    }, [editId]);

    /* 2. Auto-calculate when initial values appear */
    useEffect(() => {
        if (!initialValues) return;
        startTransition(async () => {
            const res = await calculatePayAction(initialValues);
            setResult(res);
        });
    }, [initialValues, startTransition]);

    /* 3. Submit handler */
    const handleFormSubmit = (values: WeeklyPayInput) => {
        startTransition(async () => {
            try {
                await fetch('/api/entries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });
            } catch (err) {
                console.error('Failed to save snapshot:', err);
            }

            const res = await calculatePayAction(values);
            setResult(res);
        });
    };

    /* 4. Reset handler */
    const handleReset = () => {
        setResult(null);
        setInitialValues(undefined);
        setFormKey(k => k + 1);
    };

    return (
        <section className="space-y-8" aria-labelledby="weekly-pay-form-heading">
            <h2 id="weekly-pay-form-heading" className="sr-only">Weekly Pay Calculator</h2>

            {/* Form card */}
            <div className="p-6 rounded-lg shadow bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
                <WeeklyPayForm key={formKey} onSubmit={handleFormSubmit} initialValues={initialValues} />
            </div>

            {/* Pending indicator */}
            {pending && (
                <div role="status" aria-live="polite" className="text-center opacity-60 text-[var(--foreground)]">
                    {editId ? 'Loading & calculating…' : 'Calculating…'}
                </div>
            )}

            {/* Results */}
            {result && (
                <section className="space-y-4" aria-labelledby="results-heading">
                    <h2 id="results-heading" className="sr-only">Calculation Results</h2>

                    <div className="flex justify-end gap-2">
                        <PrintButton targetRef={resultsRef} />
                        <button
                            type="button"
                            onClick={handleReset}
                            aria-label="Reset all fields"
                            className="btn btn-outline btn-neutral btn-sm"
                        >
                            Reset All
                        </button>
                    </div>

                    <div
                        ref={resultsRef}
                        className="p-6 rounded-lg shadow bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300"
                    >
                        <ResultsDisplay result={result} />
                    </div>
                </section>
            )}
        </section>
    );
}
