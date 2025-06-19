'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import {Logo} from '@/components/Logo'; // Assuming you have a Logo c

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Calculator', href: '/calculator' },
    { name: 'History', href: '/history' },
    { name: 'Settings', href: '/settings' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav
            role="navigation"
            aria-label="Main menu"
            className="sticky top-0 z-50 shadow-sm border-b transition-colors duration-300"
            style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                borderColor: 'rgba(0,0,0,0.1)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
                {/* Brand / Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Logo size={60} />

                    {/* Your brand name */}
                    <span className="font-bold text-xl">PayCalc</span>
                </Link>


                {/* Desktop nav links */}
                <div className="hidden lg:flex items-center space-x-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="font-medium hover:underline transition"
                            style={{ color: 'var(--foreground)' }}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <ThemeToggle />
                </div>

                {/* Mobile menu button */}
                <button
                    title='Toggle mobile menu'
                    type="button"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="lg:hidden p-2"
                    aria-label="Toggle menu"
                    aria-controls="mobile-menu"
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile nav panel */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="lg:hidden border-t"
                        style={{
                            backgroundColor: 'var(--background)',
                            color: 'var(--foreground)',
                            borderColor: 'rgba(0,0,0,0.1)',
                        }}
                        role="menu"
                        aria-label="Mobile navigation"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-lg font-medium hover:underline transition"
                                    role="menuitem"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <ThemeToggle />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
