// components/HeroSection.tsx
import Link from 'next/link';
import { Logo } from './Logo';

export default function HeroSection() {
    return (
        <section className="w-full min-h-screen flex items-center justify-center px-4 bg-[var(--color-teal)] text-[var(--color-neutral)]">
            <div className="max-w-2xl text-center space-y-6">
                {/* Logo pill */}
                <div className="flex justify-center">
                    <div
                        className="rounded-full border-2 p-2 flex items-center justify-center shadow-lg"
                        style={{
                            backgroundColor: 'var(--color-neutral-dark)',
                            borderColor: 'var(--color-neutral)',
                        }}
                    >
                        <Logo size={100} />
                    </div>
                </div>
                {/* Headline */}
                <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold">
                    Welcome to PayCalc
                </h1>
                {/* Subhead */}
                <p className="text-lg sm:text-xl leading-relaxed">
                    Easily calculate your weekly pay, overtime, holiday rates, and deductions
                    with one simple tool.
                </p>
                {/* Solid CTA */}
                <Link
                    href="/pay"
                    className="inline-block px-8 py-3 font-semibold rounded-md shadow-md transition-shadow hover:shadow-lg"
                    style={{
                        backgroundColor: 'var(--color-olive)',
                        color: 'var(--color-neutral)',
                    }}
                >
                    Get Started
                </Link>
            </div>
        </section>
    );
}
