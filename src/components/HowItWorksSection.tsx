// components/HowItWorksSection.tsx
export default function HowItWorksSection() {
    const steps = [
        'Enter your daily start/end times.',
        'Select any holidays or special rates.',
        'Review your breakdown and export as PDF.',
    ];

    return (
        <section className="bg-base-200 py-20">
            <div className="mx-auto max-w-4xl px-4">
                <h2 className="text-3xl font-bold text-center mb-10 text-base-content">
                    How It Works
                </h2>
                <ol className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <li
                            key={idx}
                            className="flex flex-col items-center text-center space-y-4"
                        >
                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-lg font-bold">
                                {idx + 1}
                            </span>
                            <p className="text-base-content">{step}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
  }