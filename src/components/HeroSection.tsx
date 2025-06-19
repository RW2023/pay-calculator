// components/HeroSection.tsx
import Link from 'next/link';
import { Logo } from './Logo';

export default function HeroSection() {
    return (
        <section className="hero min-h-screen bg-primary text-white flex items-center justify-center px-4">
            <div className="max-w-2xl text-center space-y-6">
                <Logo size={80}/>
                <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold font-poppins">
                    Welcome to PayCalc
                </h1>
                <p className="text-lg sm:text-xl leading-relaxed">
                    Easily calculate your weekly pay, overtime, holiday rates, and deductions
                    with one simple tool.
                </p>
                <Link href="/calculator" className="btn btn-accent btn-lg px-8">
                    Get Started
                </Link>
            </div>
        </section>
    );
}
