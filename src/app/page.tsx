// app/page.tsx
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center bg-base-100 text-base-content">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
    </main>
  );
}
