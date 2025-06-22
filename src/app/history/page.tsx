// app/history/page.tsx
import EntryHistory from "@/components/EntryHistory";
import type { ReactElement } from "react";

export default function HistoryPage(): ReactElement {
    return (
        <main className="max-w-2xl mx-auto px-4 py-10 space-y-8 text-[var(--foreground)]">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-center font-poppins">
                History
            </h1>
            <EntryHistory />
        </main>
    );
}
