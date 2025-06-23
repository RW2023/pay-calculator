// components/Logo.tsx
import React from "react";

type LogoProps = {
    /** width & height in pixels */
    size?: number;
};

export const Logo: React.FC<LogoProps> = ({ size = 64 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="WeeklyPay logo"
    >
        <title>WeeklyPay logo</title>

        <defs>
            <linearGradient id="dollarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                {/* Top: a bright sunset orange */}
                <stop offset="0%" stopColor="var(--color-logo-start)" />
                {/* Bottom: a vivid magenta */}
                <stop offset="100%" stopColor="var(--color-logo-end)" />
            </linearGradient>
        </defs>


        <text
            x="50"
            y="68"
            textAnchor="middle"
            fontFamily="Poppins, sans-serif"
            fontWeight="700"
            fontSize="72"
            fill="url(#dollarGradient)"
        >
            $
        </text>
    </svg>
);
