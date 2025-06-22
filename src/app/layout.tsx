// app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Karla } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";

// font vars
const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
const karla = Karla({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Pay Calculator",
  description: "Calculate hours worked and pay earned in real-time.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Add suppressHydrationWarning and initial 'light' class on html to match client
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${poppins.variable} ${karla.variable} antialiased`}>
        {/* wraps your entire app in theme context with static default theme */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} enableColorScheme={false}>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
