// app/history/page.tsx
import EntryHistory from "@/components/EntryHistory";

export default function HistoryPage() {
    return (
        <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
            <h1 className="text-3xl font-extrabold text-center">History</h1>
            <EntryHistory />
        </main>
    );
}
