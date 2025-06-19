// components/Logo.tsx
import React from "react";

type LogoProps = {
    /** Width and height in pixels */
    size?: number;
};

/**
 * A six-segment circular arrow logo.
 * Segments alternate between two colors and are evenly rotated.
 */
export const Logo: React.FC<LogoProps> = ({ size = 64 }) => {
    // Primary (teal) and secondary (olive) colors:
    const colors = ["#008c85", "#7a9e00"];

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            role="img"
            aria-label="Circular cycle logo"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>Circular cycle logo</title>
            <defs>
                {/* 
          A single curved‐arrow shape pointing “up” at 12 o’clock. 
          The d‐attribute here draws a rounded arrow head and tail.
        */}
                <path
                    id="logo-segment"
                    d="
            M50,12
            C57,12 62,19 60,26
            L50,22
            L40,26
            C38,19 43,12 50,12
            Z
          "
                />
            </defs>

            {
                // Place six copies, rotated around center (50,50)
                Array.from({ length: 6 }).map((_, i) => {
                    const angle = i * 60;
                    return (
                        <use
                            key={i}
                            href="#logo-segment"
                            fill={colors[i % 2]}
                            transform={`rotate(${angle} 50 50)`}
                        />
                    );
                })
            }
        </svg>
    );
};
