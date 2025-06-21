// components/FeaturesSection.tsx
export interface FeaturesSectionProps {
    features: string[];
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-semibold font-poppins text-[var(--color-teal)]">
                Key Features
            </h2>
            <ul className="list-disc list-inside space-y-2 font-karla text-base text-[var(--foreground)]">
                {features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                ))}
            </ul>
        </section>
    );
}
  