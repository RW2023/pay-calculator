 import { Logo } from './Logo';
import HomeButton from './HomeButton';


export default function HeroSection() {
    return (
        <section className="w-full min-h-screen flex items-center justify-center px-4 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
            <div className="max-w-2xl text-center space-y-6">
                {/* Logo Pill */}
                <div className="flex justify-center">
                    <div className="rounded-full border-2 p-2 flex items-center justify-center shadow-lg bg-[var(--color-teal)] border-[var(--color-foreground)]">
                        <Logo size={100} />
                    </div>
                </div>

                {/* Headline */}
                <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold">
                    Welcome to  the PayCalc
                </h1>

                {/* Subhead */}
                <p className="text-lg sm:text-xl leading-relaxed text-[var(--color-foreground)]">
                    Easily calculate your weekly pay, overtime, holiday rates, and deductions
                    with one simple tool.
                </p>

                {/* CTA */}
              <HomeButton title='Get Started' href='/pay' />

            </div>
        </section>
    );
}
