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
        shadow-sm
        border-b border-neutral/10
        bg-[var(--background)] text-[var(--foreground)]
        transition-colors duration-300
      "
        >
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
                <Link href="/" className="flex items-center gap-2">
                    <Logo size={60} />
                    <span className="font-bold text-xl">PayCalc</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center space-x-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="font-medium hover:underline transition"
                        >
                            {item.name}
                        </Link>
                    ))}

                    {/* Admin Dropdown */}
                    <div className="dropdown dropdown-hover">
                        <button tabIndex={0} className="font-medium hover:underline transition">
                            Admin
                        </button>
                        <ul
                            tabIndex={0}
                            className="
                dropdown-content menu p-2 shadow
                bg-[var(--background)] text-[var(--foreground)]
                rounded-box w-48
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
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="lg:hidden p-2"
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
          lg:hidden overflow-hidden border-t border-neutral/10
          bg-[var(--background)] text-[var(--foreground)]
        "
                role="menu"
                aria-hidden={!mobileOpen}
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

                    {/* Admin Section */}
                    <div className="pt-4 border-t border-neutral/10 space-y-2">
                        <span className="font-semibold">Admin</span>
                        <Link
                            href="/admin"
                            onClick={() => setMobileOpen(false)}
                            className="block ml-4 hover:underline transition"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/history"
                            onClick={() => setMobileOpen(false)}
                            className="block ml-4 hover:underline transition"
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
