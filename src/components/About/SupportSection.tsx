// components/SupportSection.tsx
import Link from 'next/link';
export interface SupportSectionProps {
    email: string;
}


export default function SupportSection() {
    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-semibold font-poppins text-[var(--color-teal)]">
                Need Help?
            </h2>
            <p className="font-karla text-base text-[var(--foreground)]">
                Fill out the contact form and I will actually reply and follow up.
            </p>
        <Link
            href="/contact"
            className="
                inline-block
                font-karla
                text-white
                text-base
                px-6 py-3
                rounded-lg
                shadow
                bg-[var(--color-teal)]
                hover:bg-[var(--color-olive)]
                transition-colors duration-200
            "
        >
            Contact Me
        </Link>
        </section>
    );
}
