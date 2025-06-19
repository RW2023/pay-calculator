import Link from 'next/link';
import { Logo } from './Logo';

export default function HeroSection() {
    return (
        <section className="hero bg-primary text-white min-h-screen flex flex-col items-center justify-center px-4 text-center">
            <Logo size={80} />
            <h1 className="text-5xl sm:text-6xl font-bold font-poppins mb-4">
                Welcome to PayCalc
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mb-6 leading-relaxed">
                Easily calculate your weekly pay, overtime, holiday rates, and deductions
                with one simple tool.
            </p>
            <Link href="/calculator" className="btn btn-accent btn-lg">
                Get Started
            </Link>
        </section>
    );
}
