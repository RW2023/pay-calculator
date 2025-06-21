// components/SupportSection.tsx
export interface SupportSectionProps {
    email: string;
}

export default function SupportSection({ email }: SupportSectionProps) {
    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-semibold font-poppins text-[var(--color-teal)]">
                Need Help?
            </h2>
            <p className="font-karla text-base text-[var(--foreground)]">
                Reach out at{" "}
                <a
                    href={`mailto:${email}`}
                    className="underline text-[var(--color-teal)]"
                >
                    {email}
                </a>
                .
            </p>
        </section>
    );
}
  