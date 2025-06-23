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
