// components/FeaturesSection.tsx
import { Clock, DollarSign, Gift } from 'lucide-react';

const features = [
    { icon: Clock, title: 'Overtime Rules', desc: 'Auto-apply time-and-a-half and double-time on holidays.' },
    { icon: Gift, title: 'Holiday Pay', desc: 'Accrue Lieu days with enhanced holiday rates.' },
    { icon: DollarSign, title: 'Deductions', desc: 'Track pension, union dues, and other withholdings.' },
];

export default function FeaturesSection() {
    return (
        <section className="py-20 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
                const Icon = f.icon;
                return (
                    <div key={f.title} className="card p-6 shadow-lg">
                        <Icon className="w-12 h-12 mb-4 text-primary" />
                        <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                        <p>{f.desc}</p>
                    </div>
                );
            })}
        </section>
    );
}
