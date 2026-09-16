"use client";
import { landingContent } from "@/config/landing";
import { useScrollStory } from "@/hooks/use-scroll-story";
import { Container } from "@/components/layout/container";
import { Typography } from "@/components/ui/typography";
import { StoryChapter } from "./story-chapter";
import { StoryStage } from "./story-stage";

export function StoreStory() {
  const ref = useScrollStory();
  return (
    <section
      id="cau-chuyen"
      data-stack-scene
      className="landing-section store-story-section"
      aria-label="Câu chuyện cửa hàng"
    >
      <Container>
        <div ref={ref} className="story-track">
          <div className="story-stage-shell">
            <header data-story-heading className="story-heading">
              <Typography as="h2" variant="title">
                Khám phá cửa hàng
              </Typography>
            </header>
            <StoryStage />
          </div>
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
