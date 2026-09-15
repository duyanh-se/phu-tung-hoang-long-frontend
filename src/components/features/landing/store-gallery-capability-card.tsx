import { MediaFrame } from "@/components/ui/media-frame";
type StoreGalleryCapabilityCardProps = {
  photo: {
    image: string;
    alt: string;
  };
};

export function StoreGalleryCapabilityCard({
  photo,
}: StoreGalleryCapabilityCardProps) {
  return (
    <article
      data-gallery-item
      className="gallery-capability-card overflow-hidden rounded-card border border-border bg-surface shadow-card"
    >
      <MediaFrame
        src={photo.image}
        alt={photo.alt}
        className="gallery-frame aspect-[4/3] rounded-none"
        imageClassName="gallery-photo"
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
      />
    </article>
  );
}
