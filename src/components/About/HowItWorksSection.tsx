'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

export interface Step {
    title: string;
    description: string;
    screenshot: string;
    alt: string;
}

export interface HowItWorksSectionProps {
    steps: Step[];
}

export default function HowItWorksSection({ steps }: HowItWorksSectionProps) {
    const [enlarged, setEnlarged] = useState<Step | null>(null);

    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-semibold font-poppins text-[var(--color-teal)]">
                How It Works
            </h2>

            <div className="space-y-8">
                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className={`bg-[var(--color-neutral)] shadow rounded-xl p-6 flex flex-col md:flex-row gap-6 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''
                            }`}
                    >
                        <div className="flex-shrink-0 w-full md:w-1/2">
                            <button
                                title='Enlarge screenshot'
                                type="button"
                                onClick={() => setEnlarged(step)}
                                className="rounded-lg overflow-hidden border border-[var(--color-neutral-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-olive)] transition"
                            >
                                <Image
                                    src={step.screenshot}
                                    alt={step.alt}
                                    width={600}
                                    height={360}
                                    className="w-full h-auto"
                                />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold font-poppins text-[var(--color-olive)]">
                                {step.title}
                            </h3>
                            <p className="font-karla text-base text-[var(--foreground)]">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {enlarged && (
                    <motion.div
                        key="fullscreen-modal"
                        className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEnlarged(null)}
                    >
                        <motion.div
                            className="relative max-w-[90%] max-h-[90%] bg-[var(--background)] p-4 rounded-lg shadow-lg"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={enlarged.screenshot}
                                alt={enlarged.alt}
                                width={1200}
                                height={800}
                                className="w-full h-auto object-contain rounded"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
