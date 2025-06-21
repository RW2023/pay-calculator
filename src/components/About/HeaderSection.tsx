// components/About/HeaderSection.tsx
export interface HeaderSectionProps {
    title: string;
    subtitle: string;
}

export default function HeaderSection({ title, subtitle }: HeaderSectionProps) {
    return (
        <header className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold font-poppins text-[var(--color-olive)]">
                {title}
            </h1>
            <p className="text-lg font-karla text-[var(--foreground)]">
                {subtitle}
            </p>
        </header>
    );
}
  