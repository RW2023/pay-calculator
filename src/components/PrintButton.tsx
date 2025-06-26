'use client'

import { Printer } from 'lucide-react'
import { RefObject } from 'react'
import { useReactToPrint } from 'react-to-print'

interface PrintButtonProps {
    targetRef: RefObject<HTMLDivElement | null>
    label?: string
}

export default function PrintButton({ targetRef, label = 'Print Results' }: PrintButtonProps) {
    const handlePrint = useReactToPrint({
        contentRef: targetRef,
    })

    return (
        <button
            type="button"
            onClick={handlePrint}
            aria-label={label}
            className={`
          print:hidden flex items-center gap-2
          px-3 py-1.5 text-sm font-medium rounded-md
          border border-[var(--border)]
          text-[var(--foreground)] bg-transparent
          hover:bg-[var(--foreground)] hover:text-[var(--background)]
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary
        `}
        >
            <Printer className="w-4 h-4" />
            {label}
        </button>
    );
}
