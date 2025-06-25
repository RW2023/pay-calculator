// components/OvertimeWorthIt.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function OvertimeWorthIt() {
    // form state
    const [rate, setRate] = useState(25)   // $/hr
    const [multiplier, setMultiplier] = useState(1.5)  // overtime ×
    const [taxRate, setTaxRate] = useState(0.25) // 25%
    const [otHours, setOtHours] = useState(2)    // hrs

    // result state
    const [netExtra, setNetExtra] = useState(0)
    const [worthIt, setWorthIt] = useState(true)

    // perform calculation whenever inputs change
    useEffect(() => {
        // gross extra before tax
        const grossExtra = rate * otHours * (multiplier - 1)
        // net extra after tax
        const net = grossExtra * (1 - taxRate)
        setNetExtra(net)
        setWorthIt(net > 0)
    }, [rate, multiplier, taxRate, otHours])

    return (
        <section className="p-6 bg-base-200 dark:bg-base-300 rounded-lg space-y-6">
            <h3 className="text-xl font-semibold">Is Overtime Worth It?</h3>

            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="form-control">
                    <label className="label" htmlFor="rate-input">
                        <span className="label-text">Hourly Rate ($)</span>
                    </label>
                    <input
                        id="rate-input"
                        type="number"
                        min="0"
                        step="0.01"
                        value={rate}
                        onChange={e => setRate(parseFloat(e.target.value) || 0)}
                        className="input input-bordered w-full"
                        aria-label="Hourly Rate in dollars"
                    />
                </div>

                <div className="form-control">
                    <label className="label" htmlFor="multiplier-input">
                        <span className="label-text">OT Multiplier</span>
                    </label>
                    <input
                        id="multiplier-input"
                        type="number"
                        min="1"
                        step="0.1"
                        value={multiplier}
                        onChange={e => setMultiplier(parseFloat(e.target.value) || 1)}
                        className="input input-bordered w-full"
                        aria-label="Overtime multiplier"
                    />
                </div>

                <div className="form-control">
                    <label className="label" htmlFor="taxrate-input">
                        <span className="label-text">Tax Rate (%)</span>
                    </label>
                    <input
                        id="taxrate-input"
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={taxRate * 100}
                        onChange={e => setTaxRate((parseFloat(e.target.value) || 0) / 100)}
                        className="input input-bordered w-full"
                        aria-label="Tax rate as percent"
                    />
                </div>

                <div className="form-control">
                    <label className="label" htmlFor="othours-input">
                        <span className="label-text">OT Hours</span>
                    </label>
                    <input
                        id="othours-input"
                        type="number"
                        min="0"
                        step="0.25"
                        value={otHours}
                        onChange={e => setOtHours(parseFloat(e.target.value) || 0)}
                        className="input input-bordered w-full"
                        aria-label="Overtime hours"
                    />
                </div>
            </div>

            {/* Result Card */}
            <div
                className={`
          flex items-center p-4 rounded-lg
          ${worthIt ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-rose-100 dark:bg-rose-900'}
        `}
                aria-live="polite"
            >
                {worthIt ? (
                    <CheckCircle2 className="text-emerald-600 dark:text-emerald-300 w-8 h-8 mr-4" />
                ) : (
                    <XCircle className="text-rose-600 dark:text-rose-300 w-8 h-8 mr-4" />
                )}
                <div>
                    <p className="text-lg">
                        Net Extra Pay:{' '}
                        <span className="font-bold">
                            ${netExtra.toFixed(2)}
                        </span>
                    </p>
                    <p
                        className={`mt-1 font-semibold ${worthIt ? 'text-emerald-700 dark:text-emerald-200' : 'text-rose-700 dark:text-rose-200'
                            }`}
                    >
                        {worthIt ? 'Worth It!' : 'Not Worth It'}
                    </p>
                </div>
            </div>
        </section>
    )
}
