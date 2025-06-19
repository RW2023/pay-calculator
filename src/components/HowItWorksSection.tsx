// components/HowItWorksSection.tsx
export default function HowItWorksSection() {
    const steps = [
        'Enter your daily start/end times.',
        'Select any holidays or special rates.',
        'Review your breakdown and export as PDF.'
    ];

    return (
        <section className="px-4 py-20 bg-base-200 w-full max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            <ol className="list-decimal list-inside space-y-4">
                {steps.map((step, i) => (
                    <li key={i} className="text-lg">{step}</li>
                ))}
            </ol>
        </section>
    );
}
  