"use client";
import { landingContent } from "@/config/landing";
import { useScrollStory } from "@/hooks/use-scroll-story";
import { Container } from "@/components/layout/container";
import { StoryChapter } from "./story-chapter";
import { StoryStage } from "./story-stage";

export function StoreStory() {
  const ref = useScrollStory();
  return (
    <section
      id="cau-chuyen"
      data-stack-scene
      className="landing-section bg-surface"
      aria-label="Câu chuyện cửa hàng"
    >
      <Container>
        <div ref={ref} className="story-track">
          <StoryStage />
          <div className="story-driver">
            <div className="story-copy">
              {landingContent.chapters.map((chapter) => (
                <StoryChapter key={chapter.number} chapter={chapter} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
