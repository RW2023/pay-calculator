// components/IconToggle.tsx
'use client'

import React, { useState } from 'react'
import { Check, X } from 'lucide-react'

/**
 * Lucide-based toggle switch
 * - Uses hidden checkbox for a11y and form integration
 * - Shows Check icon when on, X icon when off
 * - Knob slides with Tailwind peer classes
 * - `color` prop chooses active track colour: 'success' (green) or 'warning' (yellow)
 */
export default function IconToggle({
    id,
    defaultChecked = false,
    onChange,
    color = 'success',
    className = '',
}: {
    id: string
    defaultChecked?: boolean
    onChange?: (checked: boolean) => void
    color?: 'success' | 'warning'
    className?: string
}) {
    const [checked, setChecked] = useState(defaultChecked)
    const activeClass = color === 'success' ? 'bg-success' : 'bg-warning'
    return (
        <label
            htmlFor={id}
            className={
                `relative inline-flex items-center cursor-pointer w-12 h-6 rounded-full transition-colors ` +
                `${checked ? activeClass : 'bg-base-300'} ` +
                className
            }
        >
            <input
                id={id}
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={e => {
                    setChecked(e.target.checked)
                    onChange?.(e.target.checked)
                }}
                aria-checked={checked}
            />
            {/* Track icons */}
            <Check className="absolute left-1 text-base-100 pointer-events-none" size={14} />
            <X className="absolute right-1 text-base-100 pointer-events-none" size={14} />
            {/* Sliding knob */}
            <span
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-base-100 rounded-full shadow transition-transform peer-checked:translate-x-6"
            />
        </label>
    )
}
