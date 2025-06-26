// components/OvertimeTakeHomeEstimator.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Info, CheckCircle2, XCircle } from 'lucide-react'

const DEFAULT_RATE = Number(process.env.NEXT_PUBLIC_REGULAR_RATE)
const DEFAULT_MULTIPLIER = Number(process.env.NEXT_PUBLIC_OT_MULTIPLIER)
const DEFAULT_TAX_RATE = Number(process.env.NEXT_PUBLIC_TAX_RATE)
const DEFAULT_OT_HOURS = Number(process.env.NEXT_PUBLIC_DEFAULT_OT_HOURS)

export default function OvertimeTakeHomeEstimator() {
    const [rate, setRate] = useState(DEFAULT_RATE)
    const [multiplier, setMultiplier] = useState(DEFAULT_MULTIPLIER)
    const [taxRate, setTaxRate] = useState(DEFAULT_TAX_RATE)
    const [otHours, setOtHours] = useState(DEFAULT_OT_HOURS)

    const [netOtRate, setNetOtRate] = useState(0)               // $/hr after tax
    const [breakEvenMultiplier, setBreakEvenMultiplier] = useState(0)
    const [netExtraPay, setNetExtraPay] = useState(0)           // $ total for otHours
    const [percentGain, setPercentGain] = useState(0)           // % above base

    useEffect(() => {
        // 1. Net OT rate per hour
        const grossOtRate = rate * multiplier
        const netRate = grossOtRate * (1 - taxRate)
        setNetOtRate(netRate)

        // 2. Break-even multiplier
        setBreakEvenMultiplier(1 / (1 - taxRate))

        // 3. Net extra pay for the given OT hours
        const grossExtra = rate * otHours * (multiplier - 1)
        setNetExtraPay(grossExtra * (1 - taxRate))

        // 4. Percent gain over base
        setPercentGain((netRate / rate - 1) * 100)
    }, [rate, multiplier, taxRate, otHours])

    const controls = [
        {
            label: 'Base Rate ($/hr)',
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
            label: 'OT Hours',
            value: otHours,
            onChange: (v: number) => setOtHours(v),
            step: 0.25,
            min: 0,
        },
    ]

    const isWorthIt = netOtRate > rate

    return (
        <section className="space-y-8 p-4">
            <h2 className="text-3xl font-semibold text-[var(--primary)]">
                OT Take-Home Calculator
            </h2>

            {/* Inputs */}
            <div
                className="card border shadow-lg"
                style={{
                    background: 'var(--card-bg)',
                    borderColor: 'var(--border)',
                }}
            >
                <div className="card-body space-y-4">
                    <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-medium">Parameters</h3>
                        <Info className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {controls.map(({ label, value, onChange, step, min, max }) => (
                            <div className="form-control" key={label}>
                                <label className="label">
                                    <span className="label-text font-medium">{label}</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered input-lg w-full"
                                    value={value}
                                    step={step}
                                    min={min}
                                    {...(max !== undefined ? { max } : {})}
                                    onChange={e =>
                                        onChange(parseFloat(e.target.value) || 0)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div
                className="card border shadow-lg"
                style={{
                    background: 'var(--card-bg)',
                    borderColor: 'var(--border)',
                }}
                aria-live="polite"
            >
                <div className="card-body space-y-4">
                    <div className="flex items-center space-x-3">
                        {isWorthIt ? (
                            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-300" />
                        ) : (
                            <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-300" />
                        )}
                        <h3
                            className={`text-2xl font-semibold ${isWorthIt
                                    ? 'text-emerald-700 dark:text-emerald-200'
                                    : 'text-rose-700 dark:text-rose-200'
                                }`}
                        >
                            {isWorthIt ? 'You’re Ahead!' : 'No Net Gain'}
                        </h3>
                    </div>

                    <ul className="space-y-2">
                        <li>
                            <span className="font-medium">Effective OT Rate:</span>{' '}
                            ${netOtRate.toFixed(2)}/hr
                        </li>
                        <li>
                            <span className="font-medium">Break-Even Multiplier:</span>{' '}
                            {breakEvenMultiplier.toFixed(2)}×
                        </li>
                        <li>
                            <span className="font-medium">Net Extra Pay:</span>{' '}
                            ${netExtraPay.toFixed(2)}
                        </li>
                        <li>
                            <span className="font-medium">% Gain Over Base:</span>{' '}
                            {percentGain.toFixed(1)}%
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}
