import { MediaFrame } from "@/components/ui/media-frame";
import { landingContent } from "@/config/landing";
import { StoryContent } from "./story-content";

export function StoryChapter({
  chapter,
}: {
  chapter: (typeof landingContent.chapters)[number];
}) {
  return (
    <article data-story-chapter className="story-chapter">
      <div className="story-content-pin">
        <div className="space-y-6">
          <StoryContent chapter={chapter} />
        </div>
      </div>
      <MediaFrame
        src={chapter.image}
        alt={chapter.alt}
        className="story-inline mt-8 aspect-[4/3] rounded-card"
      />
    </article>
  );
}
