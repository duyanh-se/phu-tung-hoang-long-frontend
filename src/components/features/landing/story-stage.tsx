import { landingContent } from "@/config/landing";
import { MediaFrame } from "@/components/ui/media-frame";
import { StoryContent } from "./story-content";

export function StoryStage() {
  return (
    <div className="story-stage" aria-hidden="true">
      <div className="story-stage-copy">
        {landingContent.chapters.map((chapter) => (
          <div
            key={chapter.number}
            className="story-stage-content absolute inset-0 flex items-center"
          >
            <div data-story-content className="space-y-6">
              <StoryContent chapter={chapter} />
            </div>
          </div>
        ))}
      </div>
      <div className="story-stage-visual">
        {landingContent.chapters.map((chapter) => (
          <div
            key={chapter.number}
            data-story-panel
            className="story-panel absolute inset-0 overflow-hidden rounded-card"
          >
            <MediaFrame
              src={chapter.image}
              alt=""
              className="h-full w-full"
              sizes="(min-width: 1024px) 48vw, 1px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
