"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HomeButtonProps {
    title?: string;
    className?: string;
    href?: string;
}

/**
 * A gradient pill button built for prominent calls-to-action
 * (ideal for hero sections).  If you pass a `className` prop
 * it’ll be merged *after* the defaults so you can override
 * anything you need.
 */
export default function HomeButton({
    title = "Get Started",
    className = "",
    href = "#",
}: HomeButtonProps) {
    return (
        <Link href={href} className="inline-block group">
            <button
                type="button"
                className={[
                    // shape & spacing
                    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-lg font-semibold",
                    // gradient brand fill (light)
                    "bg-gradient-to-r from-[var(--color-teal)] via-[var(--color-olive)] to-[var(--color-teal-dark)] text-[var(--background)]",
                    // dark-mode gradient flips to keep contrast
                    "dark:from-[var(--color-olive)] dark:via-[var(--color-teal)] dark:to-[var(--color-teal-dark)] dark:text-[var(--foreground)]",
                    // motion & feedback
                    "transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 active:scale-95",
                    // focus ring for accessibility
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-teal)]",
                    // optional external overrides
                    className,
                ].join(" ")}
            >
                {title}
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
        </Link>
    );
}
