// app/admin/history/page.tsx
import EntryHistory from '@/components/admin/EntryHistory';
import Link from 'next/link';
import type { ReactElement } from 'react';

export default function HistoryPage(): ReactElement {
    return (
        <main
            className="
        min-h-screen max-w-2xl mx-auto px-4 py-10 space-y-8
        bg-[var(--background)] text-[var(--foreground)]
        dark:bg-[var(--color-neutral-dark)] dark:text-[var(--foreground)]
        transition-colors duration-300
      "
        >
            <div className="flex justify-between items-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold font-poppins">
                    History
                </h1>

                <Link
                    href="/pay"
                    className="
            inline-flex items-center justify-center gap-2
            rounded-md px-4 py-2 font-semibold
            border-2 border-[var(--color-teal)] text-[var(--color-teal)]
            bg-transparent
            hover:bg-[var(--color-teal)] hover:text-[var(--background)]
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-teal)]
            transition-colors duration-200
          "
                >
                    New Calculation
                </Link>
            </div>

            <EntryHistory />
        </main>
    );
}
