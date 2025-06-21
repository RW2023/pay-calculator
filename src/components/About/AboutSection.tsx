// components/About/AboutSection.tsx
export interface AboutSectionProps {
    text: string;
}

export default function AboutSection({ text }: AboutSectionProps) {
    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-semibold font-poppins text-[var(--color-teal)]">
                About This App
            </h2>
            <p className="text-base font-karla text-[var(--foreground)]">
                {text}
            </p>
        </section>
    );
}
  