// components/FeaturesSection.tsx
import { Clock, Gift, DollarSign } from 'lucide-react';

const features = [
    { icon: Clock, title: 'Overtime Rules', desc: 'Auto-apply time-and-a-half and double-time on holidays.' },
    { icon: Gift, title: 'Holiday Pay', desc: 'Accrue Lieu days with enhanced holiday rates.' },
    { icon: DollarSign, title: 'Deductions', desc: 'Track pension, union dues, and other withholdings.' },
];

export default function FeaturesSection() {
    return (
        <section className="py-20 bg-base-100">
            <div className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div
                            key={title}
                            className="card border border-base-200 rounded-2xl shadow-sm hover:shadow-lg transition p-6 bg-base-100"
                        >
                            <div className="flex items-center justify-center mb-4">
                                <Icon className="w-12 h-12 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-base-content">
                                {title}
                            </h3>
                            <p className="text-base-content opacity-80">
                                {desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}