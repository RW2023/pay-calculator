// app/page.tsx
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
    </main>
  );
}
