// components/DownloadPDFButton.tsx
"use client";
import { Download } from "lucide-react";
import { RefObject } from "react";
// @ts-expect-error: html2pdf.js has no TypeScript types available
import html2pdf from "html2pdf.js";

interface DownloadPDFButtonProps {
    targetRef: RefObject<HTMLDivElement | null>;
    filename?: string;
    label?: string;
}

export default function DownloadPDFButton({ targetRef, filename = "pay-results.pdf", label = "Download PDF" }: DownloadPDFButtonProps) {
    const handleDownload = () => {
        if (!targetRef.current) return;
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
            className="btn btn-outline btn-sm flex gap-2 items-center"
            type="button"
            aria-label={label}
        >
            <Download className="w-4 h-4" />
            {label}
        </button>
    );
}
