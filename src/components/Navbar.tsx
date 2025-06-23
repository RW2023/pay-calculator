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
        bg-[var(--background)] text-[var(--foreground)]
        border-b border-[var(--border)]
        shadow-sm
        transition-colors duration-300
      "
        >
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary">
                    <Logo size={60} />
                    <span className="font-bold text-xl">PayCalc</span>
                </Link>

                {/* Desktop */}
                <div className="hidden lg:flex items-center space-x-6">
                    {navItems.map(item => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="font-medium hover:underline focus:outline-none focus:underline"
                        >
                            {item.name}
                        </Link>
                    ))}

                    {/* Admin Dropdown */}
                    <div className="dropdown dropdown-hover">
                        <button
                            tabIndex={0}
                            aria-haspopup="true"
                            className="font-medium hover:underline focus:outline-none"
                        >
                            Admin
                        </button>
                        <ul
                            tabIndex={0}
                            className="
                dropdown-content menu p-2 shadow-md
                bg-[var(--background)] text-[var(--foreground)]
                rounded-box w-48
                ring-1 ring-[var(--border)]
              "
                        >
                            <li><Link href="/admin">Dashboard</Link></li>
                            <li><Link href="/history">Entry History</Link></li>
                        </ul>
                    </div>

                    <ThemeToggle />
                </div>

                {/* Mobile Toggle */}
                <button
                    title="Toggle mobile menu"
                    type="button"
                    onClick={() => setMobileOpen(o => !o)}
                    className="lg:hidden p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Toggle menu"
                    aria-controls="mobile-menu"
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Panel */}
            <motion.div
                id="mobile-menu"
                variants={{
                    open: { height: 'auto', opacity: 1, display: 'block' },
                    closed: { height: 0, opacity: 0, transitionEnd: { display: 'none' } },
                }}
                initial={false}
                animate={mobileOpen ? 'open' : 'closed'}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="
          lg:hidden overflow-hidden 
          bg-[var(--background)] text-[var(--foreground)]
          border-t border-[var(--border)]
        "
                role="menu"
                aria-hidden={!mobileOpen}
            >
                <div className="px-4 py-6 space-y-4">
                    {navItems.map(item => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block text-lg font-medium hover:underline focus:outline-none"
                            role="menuitem"
                        >
                            {item.name}
                        </Link>
                    ))}

                    <div className="pt-4 border-t border-[var(--border)] space-y-2">
                        <span className="font-semibold">Admin</span>
                        <Link
                            href="/admin"
                            onClick={() => setMobileOpen(false)}
                            className="block ml-4 hover:underline focus:outline-none"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/history"
                            onClick={() => setMobileOpen(false)}
                            className="block ml-4 hover:underline focus:outline-none"
                        >
                            Entry History
                        </Link>
                    </div>

                    <ThemeToggle />
                </div>
            </motion.div>
        </nav>
    );
}
