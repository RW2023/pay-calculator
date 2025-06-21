// app/about/page.tsx
import HeaderSection from "@/components/About/HeaderSection";
import AboutSection from "@/components/About/AboutSection";
import HowItWorksSection, { Step } from "@/components/About/HowItWorksSection";
import FeaturesSection from "@/components/About/FeaturesSection";
import SupportSection from "@/components/About/SupportSection";

export default function AboutPage() {
    const steps: Step[] = [
        {
            title: "1. Enter Your Shift",
            description:
                "Fill in your scheduled and actual start/end times for each day. Toggle lunch breaks, holidays, and bump days as needed.",
            screenshot: "/screenshots/step1.png",
            alt: "Step 1 screenshot",
        },
        {
            title: "2. Review Your Totals",
            description:
                "The app immediately shows your regular pay, overtime, total hours, and any unpaid breaks—compare against your ADP report.",
            screenshot: "/screenshots/step2.png",
            alt: "Step 2 screenshot",
        },
        // add more steps here...
    ];

    const features = [
        "Automatic break deduction based on your schedule",
        "Overtime & double-time holiday calculations",
        "Union dues & pension toggles",
        "Dark & light mode support",
        "Printable PDF export of your weekly report",
    ];

    return (
        <main className="max-w-3xl mx-auto px-4 py-10 space-y-12">
            <HeaderSection
                title="About & Instructions"
                subtitle="A quick guide to getting the most out of your Weekly Pay Calculator."
            />
            <AboutSection text="This app mirrors your ADP reports by calculating daily hours, bump rates, pension and union dues. Enter your actual clock-in/out times, and the calculator handles breaks, overtime, and special holiday rates automatically." />
            <HowItWorksSection steps={steps} />
            <FeaturesSection features={features} />
            <SupportSection email="support@example.com" />
        </main>
    );
}
