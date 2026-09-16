import { landingContent } from "@/config/landing";
import { Container } from "@/components/layout/container";
import { MediaFrame } from "@/components/ui/media-frame";
import { Typography, Paragraph } from "@/components/ui/typography";

const documents = landingContent.denisMedia.documents;
const descriptions = [
  "Dầu nhớt hộp số xe tay ga - Sản phẩm nổi bật",
  "Tham khảo giá các dòng dầu nhớt tại Hoàng Long",
  "Khám phá danh mục sản phẩm",
];

export function DenisDocumentCollage() {
  return (
    <div className="denis-document-track">
      <div
        className="denis-document-stage"
        aria-label="Tài liệu sản phẩm DENIS"
      >
        <div className="denis-document-copy">
          {documents.map((document, index) => (
            <div data-denis-document-copy key={document.image}>
              <Typography as="h3" variant="title">
                {index === 0 ? document.label : `${document.label} DENIS`}
              </Typography>
              <Paragraph className="mt-4 text-inverse-muted">
                {descriptions[index]}
              </Paragraph>
            </div>
          ))}
        </div>
        {documents.map((document, index) => (
          <a
            data-denis-document-panel
            data-side={index % 2 === 0 ? "left" : "right"}
            key={document.image}
            href={document.image}
            target="_blank"
            rel="noreferrer"
            className="denis-document-panel motion-interaction"
            aria-label={`Mở ảnh ${document.label}`}
          >
            <span className="denis-document-card">
              <MediaFrame
                src={document.image}
                alt={document.alt}
                contain
                className="denis-document-frame rounded-card border border-inverse"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </span>
          </a>
        ))}
      </div>
      <Container data-denis-document-driver className="denis-document-driver">
        {documents.map((document) => (
          <div
            data-denis-document-chapter
            key={document.image}
            aria-hidden="true"
          />
        ))}
      </Container>
      <Container
        data-denis-document-collage
        className="denis-document-mobile"
        aria-label="Tài liệu sản phẩm DENIS"
      >
        {documents.map((document) => (
          <a
            data-denis-document
            key={document.image}
            href={document.image}
            target="_blank"
            rel="noreferrer"
            className="denis-document-link motion-interaction"
            aria-label={`Mở ảnh ${document.label}`}
          >
            <MediaFrame
              src={document.image}
              alt={document.alt}
              className="aspect-[3/4] rounded-card border border-inverse"
              sizes="(min-width: 1024px) 1px, 33vw"
            />
            <span className="denis-document-label">{document.label}</span>
          </a>
        ))}
      </Container>
    </div>
  );
}
