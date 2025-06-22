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

    const [initialValues, setInitialValues] = useState<WeeklyPayInput | undefined>(undefined);
    const [result, setResult] = useState<WeeklyPayResult | null>(null);
    const [pending, startTransition] = useTransition();
    const [formKey, setFormKey] = useState(0);
    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!editId) {
            setInitialValues(undefined);
            return;
        }
        const loadEntry = async () => {
            try {
                const res = await fetch(`/api/entries/${editId}`);
                if (!res.ok) {
                    throw new Error(`Failed to load entry: ${res.statusText}`);
                }
                const raw = (await res.json()) as {
                    days: unknown;
                    hasPension: boolean;
                    hasUnionDues: boolean;
                };
                if (!Array.isArray(raw.days)) {
                    throw new Error('Invalid data format: days is not an array');
                }
                const daysArray = raw.days as Array<unknown>;
                const mappedDays: DayEntry[] = DAYS.map((_, i) => {
                    const item = daysArray[i] as Partial<Record<keyof DayEntry, unknown>>;
                    return {
                        scheduledStart: typeof item.scheduledStart === 'string' ? item.scheduledStart : '',
                        scheduledEnd: typeof item.scheduledEnd === 'string' ? item.scheduledEnd : '',
                        actualStart: typeof item.actualStart === 'string' ? item.actualStart : '',
                        actualEnd: typeof item.actualEnd === 'string' ? item.actualEnd : '',
                        breakMinutes: typeof item.breakMinutes === 'number'
                            ? item.breakMinutes
                            : DEFAULT_BREAK_MINUTES,
                        isHoliday: Boolean(item.isHoliday),
                        isBump: Boolean(item.isBump),
                        lieuHoursUsed: typeof item.lieuHoursUsed === 'number' ? item.lieuHoursUsed : 0,
                    };
                });
                setInitialValues({
                    days: mappedDays,
                    hasPension: raw.hasPension,
                    hasUnionDues: raw.hasUnionDues,
                });
                setFormKey(k => k + 1);
            } catch (error) {
                console.error(error instanceof Error ? error.message : 'Unknown error');
            }
        };
        void loadEntry();
    }, [editId]);

    const handleFormSubmit = (values: WeeklyPayInput) => {
        startTransition(async () => {
            try {
                await fetch('/api/entries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });
            } catch (error) {
                console.error('Failed to save snapshot:', error);
            }
            const res = await calculatePayAction(values);
            setResult(res);
        });
    };

    const handleReset = () => {
        setResult(null);
        setInitialValues(undefined);
        setFormKey(k => k + 1);
    };

    return (
        <>
            <WeeklyPayForm
                key={formKey}
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
            />

            {pending && (
                <div className="text-center text-gray-500">
                    {editId ? 'Loading & calculating…' : 'Calculating…'}
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
        </>
    );
}
