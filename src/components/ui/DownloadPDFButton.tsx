// components/DownloadPDFButton.tsx
"use client";
import { Download } from "lucide-react";
import { RefObject } from "react";

interface DownloadPDFButtonProps {
    targetRef: RefObject<HTMLDivElement | null>;
    filename?: string;
    label?: string;
}

export default function DownloadPDFButton({
    targetRef,
    filename = "pay-results.pdf",
    label = "Download PDF",
}: DownloadPDFButtonProps) {
    const handleDownload = async () => {
        if (!targetRef.current) return;
        const html2pdf = (await import("html2pdf.js")).default;
        html2pdf()
            .from(targetRef.current)
            .set({
                margin: 0.5,
                filename,
                html2canvas: { scale: 2 },
                jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
            })
            .save();
    };

    return (
        <button
            onClick={handleDownload}
            className="btn btn-sm flex gap-2 items-center border border-[var(--color-teal)] text-[var(--color-teal)] bg-transparent hover:bg-[var(--color-neutral)]"
            type="button"
            aria-label={label}
        >
            <Download className="w-4 h-4" />
            {label}
        </button>
    );
}
