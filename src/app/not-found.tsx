"use client";

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    const router = useRouter()

    return (
        <main
            role="main"
            className="h-screen flex items-center justify-center bg-[var(--background)] px-4"
        >
            <div className="card rounded-2xl max-w-md text-center p-8 bg-[var(--color-neutral)] dark:bg-[var(--color-neutral-dark)] shadow-xl">
                <AlertCircle
                    size={64}
                    className="mx-auto mb-4 text-[var(--color-teal)]"
                    aria-hidden="true"
                />
                <h1 className="font-poppins text-4xl font-extrabold mb-2 text-[var(--color-teal)]">
                    Page Not Found
                </h1>
                <p className="font-karla text-lg text-[var(--foreground)] mb-6">
                    Oops! We can’t find the page you’re looking for. It may have moved or no longer exists.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="btn flex items-center gap-2 border border-[var(--color-teal)] text-[var(--color-teal)] bg-transparent hover:bg-[var(--color-neutral)]"
                        aria-label="Go back to previous page"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                    <Link href="/" passHref>
                        <button
                            className="btn flex items-center gap-2 bg-[var(--color-teal)] text-white hover:opacity-90"
                            aria-label="Go to home page"
                        >
                            <Home size={20} />
                            Home
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    )
}
