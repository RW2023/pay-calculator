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

// your page metadata stays on the server
export const metadata: Metadata = {
  title: "Pay Calculator",
  description: "Calculate hours worked and pay earned in real-time.",
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${karla.variable} antialiased`}>
        {/* wraps your entire app in theme context */}
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
