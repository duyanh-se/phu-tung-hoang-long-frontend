import { Paragraph, Typography } from "@/components/ui/typography";
import { landingContent } from "@/config/landing";

export type StoryChapterData = (typeof landingContent.chapters)[number];

export function StoryContent({ chapter }: { chapter: StoryChapterData }) {
  return (
    <>
      <Typography as="h3" variant="title" className="whitespace-pre-line">
        {chapter.title}
      </Typography>
      <Paragraph muted className="max-w-md">
        {chapter.description}
      </Paragraph>
      <div className="h-px w-16 bg-brand-600" aria-hidden="true" />
    </>
  );
}
