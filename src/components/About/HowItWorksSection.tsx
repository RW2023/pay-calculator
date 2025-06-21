// components/About/HowItWorksSection.tsx
import Image from "next/image";

export interface Step {
    title: string;
    description: string;
    screenshot: string;
    alt: string;
}

export interface HowItWorksSectionProps {
    steps: Step[];
}

export default function HowItWorksSection({ steps }: HowItWorksSectionProps) {
    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-semibold font-poppins text-[var(--color-teal)]">
                How It Works
            </h2>
            <div className="space-y-8">
                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className="bg-[var(--color-neutral)] shadow rounded-xl p-6 flex flex-col md:flex-row gap-6"
                    >
                        <div className="flex-shrink-0 w-full md:w-1/2">
                            <Image
                                src={step.screenshot}
                                alt={step.alt}
                                width={600}
                                height={360}
                                className="w-full rounded-lg border border-[var(--color-neutral-dark)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold font-poppins text-[var(--color-olive)]">
                                {step.title}
                            </h3>
                            <p className="font-karla text-base text-[var(--foreground)]">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
