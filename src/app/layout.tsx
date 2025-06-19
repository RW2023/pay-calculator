// app/layout.tsx

import type { Metadata } from "next";
import { Poppins, Karla } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${karla.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
