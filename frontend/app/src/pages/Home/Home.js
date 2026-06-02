import HeroSection from "./sections/HeroSection";
import WhyChoseUsSection from "./sections/WhyChoseUsSection";
import FeatureSection from "./sections/FeatureSection";
import CtaSection from "./sections/CtaSection";

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <WhyChoseUsSection />
      <FeatureSection />
      <CtaSection />
    </main>
  );
}