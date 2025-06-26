// app/page.tsx
import HeroSection from '@/components/Hero/HeroSection';
import FeaturesSection from '@/components/Hero/FeaturesSection';
import HowItWorksSection from '@/components/Hero/HowItWorksSection';
import DisclaimerBanner from '@/components/Hero/DisclaimerBanner';

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
