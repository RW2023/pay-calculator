'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import { Logo } from '@/components/Logo';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Pay', href: '/pay' },
    { name: 'About', href: '/about' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav
            role="navigation"
            aria-label="Main menu"
            className="
        sticky top-0 z-50
        shadow-sm
        border-b border-[rgba(0,0,0,0.1)]
        bg-[var(--background)] text-[var(--foreground)]
        transition-colors duration-300
      "
        >
            {/* --- Top bar ----------------------------------------------------- */}
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
                <Link href="/" className="flex items-center gap-2">
                    <Logo size={60} />
                    <span className="font-bold text-xl">PayCalc</span>
                </Link>

                <div className="hidden lg:flex items-center space-x-6">
                    {navItems.map(item => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="font-medium hover:underline transition text-[var(--foreground)]"
                        >
                            {item.name}
                        </Link>
                    ))}
                    <ThemeToggle />
                </div>

                {/* Mobile toggle button */}
                <button
                    title="Toggle mobile menu"
                    type="button"
                    onClick={() => setMobileOpen(o => !o)}
                    className="lg:hidden p-2"
                    aria-label="Toggle menu"
                    aria-controls="mobile-menu"
                    aria-expanded={mobileOpen ? 'true' : 'false'}  // string, not boolean
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* --- Mobile panel (always in DOM) -------------------------------- */}
            <motion.div
                id="mobile-menu"
                /*
                 * We keep the element mounted so aria-controls is always valid.
                 * Closed state: display:none (via variants.transitionEnd).
                 */
                variants={{
                    open: { height: 'auto', opacity: 1, display: 'block' },
                    closed: { height: 0, opacity: 0, transitionEnd: { display: 'none' } },
                }}
                initial={false}
                animate={mobileOpen ? 'open' : 'closed'}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="lg:hidden overflow-hidden border-t"
                style={{
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    borderColor: 'rgba(0,0,0,0.1)',
                }}
                role="menu"
                aria-hidden={mobileOpen ? 'false' : 'true'}
            >
                <div className="px-4 py-6 space-y-4">
                    {navItems.map(item => (
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
        </nav>
    );
}
