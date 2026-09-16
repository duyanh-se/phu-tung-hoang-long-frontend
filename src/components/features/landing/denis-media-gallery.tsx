import { landingContent } from "@/config/landing";
import { MediaFrame } from "@/components/ui/media-frame";

export function DenisMediaGallery() {
  const { feature } = landingContent.denisMedia;

  return (
    <div data-denis-reveal className="denis-media-gallery">
      <MediaFrame
        src={feature.image}
        alt={feature.alt}
        className="denis-feature-image aspect-[4/3] rounded-card border border-inverse"
        sizes="(min-width: 1024px) 34vw, 100vw"
      />
    </div>
  );
}
