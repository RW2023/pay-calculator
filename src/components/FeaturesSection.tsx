// components/FeaturesSection.tsx
import { Clock, Gift, DollarSign } from 'lucide-react';

const features = [
    { icon: Clock, title: 'Overtime Rules', desc: 'Auto-apply time-and-a-half and double-time on holidays.' },
    { icon: Gift, title: 'Holiday Pay', desc: 'Accrue Lieu days with enhanced holiday rates.' },
    { icon: DollarSign, title: 'Deductions', desc: 'Track pension, union dues, and other withholdings.' },
];

export default function FeaturesSection() {
    return (
        <section className="py-20 w-full bg-[var(--color-neutral)] text-[var(--color-neutral-dark)] dark:bg-[var(--color-neutral-dark)] dark:text-[var(--color-neutral)] transition-colors">
            <div className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div
                            key={title}
                            className="border border-[var(--color-teal)] rounded-2xl shadow-sm hover:shadow-lg transition p-6 bg-[var(--background)] text-[var(--foreground)]"
                        >
                            <div className="flex items-center justify-center mb-4">
                                <Icon className="w-12 h-12 text-[var(--color-olive)]" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{title}</h3>
                            <p className="opacity-80">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
