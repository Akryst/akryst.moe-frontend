import { HeroSection } from "@/components/sections/HeroSection";
import { HomeWrapper } from "@/components/ui/HomeWrapper";

export default function Home() {
  return (
    <HomeWrapper>
      <div className="relative z-[2]">
        <HeroSection />
      </div>
    </HomeWrapper>
  );
}
