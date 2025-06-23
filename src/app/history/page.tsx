// app/history/page.tsx
import EntryHistory from "@/components/EntryHistory";
import Link from "next/link";
import type { ReactElement } from "react";

export default function HistoryPage(): ReactElement {
    return (
        <main className="min-h-screen max-w-2xl mx-auto px-4 py-10 space-y-8 text-[var(--foreground)]">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center font-poppins">
                    History
                </h1>
                <Link
                    href="/pay"
                    className="btn btn-sm border border-[var(--color-teal)] text-[var(--color-teal)] bg-transparent hover:bg-[var(--color-neutral)]"
                >
                    New Calculation
                </Link>
            </div>

            <EntryHistory />
        </main>
    );
}
