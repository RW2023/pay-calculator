'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import { Logo } from '@/components/Logo';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Calculate', href: '/pay' },
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
        border-b border-[var(--color-neutral)]/30
        bg-[var(--background)] text-[var(--foreground)]
        dark:border-[var(--color-neutral)]/10
        transition-colors duration-300
      "
        >
            <div className="max-w-7xl mx-auto h-20 px-4 flex items-center justify-between">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2">
                    {/* now Logo will inherit this red color */}
                    <Logo size={44} className="text-red-500" />
                    <span className="font-bold text-xl">PayCalc</span>
                </Link>


                {/* Desktop links */}
                <ul className="hidden lg:flex items-center gap-6">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className="font-medium hover:text-[var(--color-teal)] transition-colors"
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}

                    {/* Admin dropdown */}
                    <li className="dropdown dropdown-hover">
                        <button tabIndex={0} className="font-medium hover:text-[var(--color-teal)]">
                            Admin
                        </button>
                        <ul
                            tabIndex={0}
                            className="
                dropdown-content menu p-2 shadow-md
                bg-[var(--background)] text-[var(--foreground)]
                dark:bg-[var(--color-neutral-dark)]
                rounded-box w-48
              "
                        >
                            <li><Link href="/admin">Dashboard</Link></li>
                            <li><Link href="/history">Entry History</Link></li>
                        </ul>
                    </li>

                    <ThemeToggle />
                </ul>

                {/* Mobile toggle */}
                <button
                    type="button"
                    title="Toggle menu"
                    onClick={() => setMobileOpen((v) => !v)}
                    className="lg:hidden p-2"
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile panel */}
            <motion.div
                id="mobile-menu"
                initial={false}
                animate={mobileOpen ? 'open' : 'closed'}
                variants={{
                    open: { height: 'auto', opacity: 1, display: 'block' },
                    closed: { height: 0, opacity: 0, transitionEnd: { display: 'none' } },
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                className="
          lg:hidden overflow-hidden border-t
          border-[var(--color-neutral)]/20
          bg-[var(--background)] text-[var(--foreground)]
        "
            >
                <div className="px-4 py-6 space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            role="menuitem"
                            onClick={() => setMobileOpen(false)}
                            className="block text-lg font-medium hover:text-[var(--color-teal)] transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}

                    {/* Admin shortcuts */}
                    <div className="pt-4 border-t border-[var(--color-neutral)]/20 space-y-2">
                        <span className="font-semibold">Admin</span>
                        <Link href="/admin" onClick={() => setMobileOpen(false)} className="block ml-4 hover:text-[var(--color-teal)]">
                            Dashboard
                        </Link>
                        <Link href="/admin/history" onClick={() => setMobileOpen(false)} className="block ml-4 hover:text-[var(--color-teal)]">
                            Entry History
                        </Link>
                    </div>

                    <ThemeToggle />
                </div>
            </motion.div>
        </nav>
    );
}
