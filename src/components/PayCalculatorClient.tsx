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

    /* ─────────────────────────────────────────────────────────
       1.  LOAD ENTRY DATA (unchanged)
    ──────────────────────────────────────────────────────────*/
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
                        breakMinutes:
                            typeof d.breakMinutes === 'number' ? d.breakMinutes : DEFAULT_BREAK_MINUTES,
                        isHoliday: !!d.isHoliday,
                        isBump: !!d.isBump,
                        lieuHoursUsed: typeof d.lieuHoursUsed === 'number' ? d.lieuHoursUsed : 0,
                    };
                });

                setInitialValues({
                    days: mappedDays,
                    hasPension: raw.hasPension,
                    hasUnionDues: raw.hasUnionDues,
                });
                setFormKey(k => k + 1); // force form re-mount
            } catch (err) {
                console.error(err);
            }
        };
        void loadEntry();
    }, [editId]);

    /* ─────────────────────────────────────────────────────────
       2.  AUTO-CALCULATE WHEN INITIAL VALUES POPULATE  ← NEW
    ──────────────────────────────────────────────────────────*/
    useEffect(() => {
        if (!initialValues) return;
        startTransition(async () => {
            const res = await calculatePayAction(initialValues);
            setResult(res);
        });
    }, [initialValues, startTransition]);

    /* ─────────────────────────────────────────────────────────
       3.  HANDLE FORM SUBMIT (unchanged)
    ──────────────────────────────────────────────────────────*/
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

    /* ─────────────────────────────────────────────────────────
       4.  RENDER
    ──────────────────────────────────────────────────────────*/
    return (
        <>
            <WeeklyPayForm key={formKey} onSubmit={handleFormSubmit} initialValues={initialValues} />

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
