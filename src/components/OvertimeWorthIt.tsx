// components/OvertimeWorthIt.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

// pull from your .env
const defaultRate = Number(process.env.NEXT_PUBLIC_REGULAR_RATE)
const defaultMultiplier = Number(process.env.NEXT_PUBLIC_OT_MULTIPLIER)
const defaultTaxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE)
const defaultOtHours = Number(process.env.NEXT_PUBLIC_DEFAULT_OT_HOURS)

export default function OvertimeWorthIt() {
    const [rate, setRate] = useState(defaultRate)
    const [multiplier, setMultiplier] = useState(defaultMultiplier)
    const [taxRate, setTaxRate] = useState(defaultTaxRate)
    const [otHours, setOtHours] = useState(defaultOtHours)
    const [netExtra, setNetExtra] = useState(0)
    const [worthIt, setWorthIt] = useState(true)

    useEffect(() => {
        const grossExtra = rate * otHours * (multiplier - 1)
        const net = grossExtra * (1 - taxRate)
        setNetExtra(net)
        setWorthIt(net > 0)
    }, [rate, multiplier, taxRate, otHours])

    return (
        <section className="space-y-6">
            <h3 className="text-xl font-semibold">Is Overtime Worth It?</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Hourly Rate ($)',
                        value: rate,
                        onChange: (v: number) => setRate(v),
                        step: 0.01,
                        min: 0,
                    },
                    {
                        label: 'OT Multiplier',
                        value: multiplier,
                        onChange: (v: number) => setMultiplier(v),
                        step: 0.1,
                        min: 1,
                    },
                    {
                        label: 'Tax Rate (%)',
                        value: taxRate * 100,
                        onChange: (v: number) => setTaxRate(v / 100),
                        step: 0.1,
                        min: 0,
                        max: 100,
                    },
                    {
                        label: 'Overtime Hours',
                        value: otHours,
                        onChange: (v: number) => setOtHours(v),
                        step: 0.25,
                        min: 0,
                    },
                ].map(({ label, value, onChange, step, min, max }) => (
                    <div className="form-control" key={label}>
                        <label className="label">
                            <span className="label-text">{label}</span>
                        </label>
                        <input
                            type="number"
                            className="input input-bordered w-full"
                            value={value}
                            step={step}
                            min={min}
                            {...(max !== undefined ? { max } : {})}
                            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                        />
                    </div>
                ))}
            </div>

            <div className="card bg-base-200 dark:bg-base-300 shadow-md">
                <div className="card-body flex items-center space-x-4" aria-live="polite">
                    {worthIt ? (
                        <CheckCircle2 className="text-emerald-600 dark:text-emerald-300 w-8 h-8" />
                    ) : (
                        <XCircle className="text-rose-600 dark:text-rose-300 w-8 h-8" />
                    )}
                    <div>
                        <p className="text-lg">
                            Net Extra Pay: <span className="font-bold">${netExtra.toFixed(2)}</span>
                        </p>
                        <p
                            className={`mt-1 font-semibold ${worthIt
                                    ? 'text-emerald-700 dark:text-emerald-200'
                                    : 'text-rose-700 dark:text-rose-200'
                                }`}
                        >
                            {worthIt ? 'Worth It!' : 'Not Worth It'}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
