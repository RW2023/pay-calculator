import { Printer } from "lucide-react";
import { RefObject } from "react";

interface PrintButtonProps {
    targetRef: RefObject<HTMLDivElement | null>; // Accept null!
    label?: string;
}

export default function PrintButton({ targetRef, label = "Print Results" }: PrintButtonProps) {
    const handlePrint = () => {
        if (!targetRef.current) return;
        const printContents = targetRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    return (
        <button
            onClick={handlePrint}
            className="btn btn-sm flex gap-2 items-center print:hidden border border-[var(--color-teal)] text-[var(--color-teal)] bg-transparent hover:bg-[var(--color-neutral)]"
            aria-label={label}
            type="button"
        >
            <Printer className="w-4 h-4" />
            {label}
        </button>
    );
}
