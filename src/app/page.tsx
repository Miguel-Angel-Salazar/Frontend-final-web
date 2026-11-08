import { CategoryShowcase } from "@/features/landing/components/CategoryShowcase";
import { FeaturedProducts } from "@/features/landing/components/FeaturedProducts";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import { MarqueeBand } from "@/features/landing/components/MarqueeBand";
import { RolesSection } from "@/features/landing/components/RolesSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <MarqueeBand />
      <CategoryShowcase />
      <FeaturedProducts />
      <HowItWorks />
      <RolesSection />
    </main>
  );
}
