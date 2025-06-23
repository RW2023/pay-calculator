// app/page.tsx
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DisclaimerBanner from '@/components/DisclaimerBanner';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <HeroSection />
      <DisclaimerBanner />
      <FeaturesSection />
      <HowItWorksSection />
    </main>
  );
}
