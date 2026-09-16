import { LandingHero } from "./landing-hero";
import { StoreStory } from "./store-story";
import { DenisSpotlight } from "./denis-spotlight";
import { FeaturedDenisProducts } from "./featured-denis-products";
import { StackedScenes } from "@/components/motion/stacked-scenes";
import { LandingHeaderPin } from "@/components/motion/landing-header-pin";

export function LandingScreen() {
  return (
    <>
      <LandingHeaderPin />
      <StackedScenes>
        <LandingHero />
        <StoreStory />
        <DenisSpotlight />
        <FeaturedDenisProducts />
      </StackedScenes>
    </>
  );
}
