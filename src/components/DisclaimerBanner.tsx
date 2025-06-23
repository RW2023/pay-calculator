import Link from 'next/link';

export default function DisclaimerBanner() {
    return (
        <section className="w-full bg-[var(--color-neutral)] dark:bg-[var(--color-neutral-dark)] text-[var(--foreground)] py-6 px-4 text-center font-semibold">
            <p>
                <span className="font-bold">Disclaimer:</span> This is an estimation tool. Currently, the options are to wait until Thursday at midnight to have an idea of your upcoming pay or to set up an Excel spreadsheet to track the various variables—this software offers a streamlined alternative. It should not be used as a source of truth for wages; it is simply a revenue forecasting tool.
            </p>
            <Link href="/about" className="btn btn-sm mt-4 bg-[var(--color-teal)] text-white hover:opacity-90">
                How to Use
            </Link>
        </section>
    );
}
