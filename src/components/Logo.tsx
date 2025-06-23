// components/Logo.tsx
import React from 'react';

export type LogoProps = {
    /** width & height in pixels */
    size?: number;
    /** any tailwind or other classes to apply */
    className?: string;
};

export const Logo: React.FC<LogoProps> = ({ size = 64, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="WeeklyPay logo"
        className={className}
        fill="currentColor"
    >
        <title>WeeklyPay logo</title>
        <text
            x="50"
            y="68"
            textAnchor="middle"
            fontFamily="Poppins, sans-serif"
            fontWeight="700"
            fontSize="72"
        >
            $
        </text>
    </svg>
);
