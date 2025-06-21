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
            onClick={handlePrint}
            className="btn btn-outline btn-sm flex gap-2 items-center print:hidden"
            aria-label={label}
            type="button"
        >
            <Printer className="w-4 h-4" />
            {label}
        </button>
    );
}
