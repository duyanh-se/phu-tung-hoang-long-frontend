"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionPresets, motionQueries } from "@/styles/motion";
import { typographyVariants } from "@/styles/typography";
import { Container } from "@/components/layout/container";
import { Typography, Paragraph } from "@/components/ui/typography";
import { ActionLink } from "@/components/ui/action-link";
import { MotionText } from "@/components/motion/motion-text";
import { landingContent } from "@/config/landing";
import { DenisMediaGallery } from "./denis-media-gallery";
import { DenisDocumentCollage } from "./denis-document-collage";
import { MediaFrame } from "@/components/ui/media-frame";

const ranges = [
  { label: "MAXSPEED", detail: "Dầu nhớt xe số" },
  { label: "SUPERIOR", detail: "Dầu nhớt xe tay ga" },
  { label: "SCOOTER GEAR OIL", detail: "Dầu nhớt hộp số tay ga" },
];

export function DenisSpotlight() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const media = gsap.matchMedia();
      media.add(
        {
          all: "(min-width: 0px)",
          reduced: motionQueries.reduced,
          desktop: motionQueries.stack,
        },
        (context) => {
          if (context.conditions?.reduced) return;

          gsap.from("[data-denis-reveal]", {
            opacity: 0,
            y: context.conditions?.desktop
              ? motionPresets.reveal.distance
              : motionPresets.mobileDistance,
            duration: context.conditions?.desktop
              ? motionPresets.reveal.duration
              : motionPresets.reveal.mobileDuration,
            stagger: motionPresets.reveal.stagger,
            ease: motionPresets.ease,
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: "[data-denis-content]",
              start: "top 80%",
              once: true,
            },
          });
          gsap.from("[data-denis-rule]", {
            scaleX: 0,
            transformOrigin: "left",
            duration: motionPresets.reveal.duration,
            ease: motionPresets.ease,
            scrollTrigger: {
              trigger: "[data-denis-content]",
              start: "top 80%",
              once: true,
            },
          });
          gsap.from("[data-denis-range]", {
            x: (index) => (index % 2 ? 20 : -20),
            opacity: 0,
            duration: motionPresets.reveal.duration,
            stagger: motionPresets.reveal.stagger,
            ease: motionPresets.ease,
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: "[data-denis-ranges]",
              start: "top 86%",
              once: true,
            },
          });

          const documents = gsap.utils.toArray<HTMLElement>(
            "[data-denis-document]",
          );

          if (context.conditions?.desktop) {
            ref.current?.classList.add("denis-enhanced");
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: "[data-denis-bridge]",
                  start: "top top",
                  end: () => "+=" + window.innerHeight * 1.3,
                  scrub: motionPresets.scrub.denis,
                  invalidateOnRefresh: true,
                },
              })
              .fromTo(
                "[data-denis-bridge-title] [data-motion-line]",
                { scale: 0.76, y: 36 },
                { scale: 1.12, y: -24, ease: "none" },
                0,
              )
              .fromTo(
                "[data-denis-bridge-copy]",
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, ease: "none" },
                0.15,
              )
              .to(
                "[data-denis-bridge-copy]",
                { opacity: 0, y: -24, ease: "none" },
                0.52,
              )
              .fromTo(
                "[data-denis-panel]",
                { yPercent: 100 },
                { yPercent: 0, ease: "none" },
                0.52,
              )
              .to(
                "[data-denis-bridge-title]",
                { opacity: 0, ease: "none" },
                0.62,
              );
            gsap.fromTo(
              "[data-denis-art]",
              { x: motionPresets.spotlightParallax },
              {
                x: -motionPresets.spotlightParallax,
                ease: "none",
                scrollTrigger: {
                  trigger: ref.current,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: motionPresets.scrub.denis,
                },
              },
            );
            gsap.fromTo(
              ".denis-banner-image",
              { scale: 1.08, yPercent: 5 },
              {
                scale: 1,
                yPercent: -3,
                ease: "none",
                scrollTrigger: {
                  trigger: ref.current,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: motionPresets.scrub.denis,
                },
              },
            );
            const documentTrack = root.querySelector<HTMLElement>(
              ".denis-document-track",
            );
            const documentPanels = gsap.utils.toArray<HTMLElement>(
              "[data-denis-document-panel]",
              root,
            );
            const documentChapters = gsap.utils.toArray<HTMLElement>(
              "[data-denis-document-chapter]",
              root,
            );
            if (
              documentTrack &&
              documentPanels.length &&
              documentChapters.length
            ) {
              documentTrack.classList.add("denis-documents-enhanced");
              const copies = gsap.utils.toArray<HTMLElement>(
                "[data-denis-document-copy]",
                root,
              );
              gsap.set(copies, { autoAlpha: 0, y: 20 });
              gsap.set(copies[0], { autoAlpha: 1, y: 0 });
              gsap.set(documentPanels, { yPercent: 100 });
              documentPanels.forEach((panel, index) =>
                gsap.set(panel, { zIndex: index + 1 }),
              );
              const documentStory = gsap.timeline({
                scrollTrigger: {
                  trigger: documentTrack,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: motionPresets.scrub.denis,
                  invalidateOnRefresh: true,
                },
              });
              documentStory
                .to(
                  documentPanels[0],
                  { yPercent: 0, ease: "none", duration: 1 },
                  0,
                )
                .to(
                  documentPanels[0],
                  { yPercent: -100, ease: "none", duration: 1 },
                  1,
                )
                .to(copies[0], { autoAlpha: 0, y: -16, duration: 0.22 }, 0.9)
                .to(copies[1], { autoAlpha: 1, y: 0, duration: 0.32 }, 1)
                .to(
                  documentPanels[1],
                  { yPercent: 0, ease: "none", duration: 1 },
                  1,
                )
                .to(
                  documentPanels[1],
                  { yPercent: -100, ease: "none", duration: 1 },
                  2,
                )
                .to(copies[1], { autoAlpha: 0, y: -16, duration: 0.22 }, 1.9)
                .to(copies[2], { autoAlpha: 1, y: 0, duration: 0.32 }, 2)
                .to(
                  documentPanels[2],
                  { yPercent: 0, ease: "none", duration: 1 },
                  2,
                )
                .to(
                  documentPanels[2],
                  { yPercent: -100, ease: "none", duration: 1 },
                  3,
                )
                .to(copies[2], { autoAlpha: 0, y: -16, duration: 0.22 }, 3.78);
            }
          } else {
            gsap.from("[data-denis-bridge-title] [data-motion-line]", {
              yPercent: 110,
              duration: motionPresets.hero.mobileDuration,
              ease: motionPresets.ease,
              clearProps: "transform",
              scrollTrigger: {
                trigger: "[data-denis-bridge]",
                start: "top 85%",
                once: true,
              },
            });
            gsap.from(documents, {
              opacity: 0,
              y: motionPresets.mobileDistance,
              duration: motionPresets.reveal.mobileDuration,
              stagger: motionPresets.reveal.stagger,
              ease: motionPresets.ease,
              clearProps: "opacity,transform",
              scrollTrigger: {
                trigger: "[data-denis-document-collage]",
                start: "top 86%",
                once: true,
              },
            });
          }
          return () => {
            ref.current?.classList.remove("denis-enhanced");
            root
              .querySelector(".denis-document-track")
              ?.classList.remove("denis-documents-enhanced");
          };
        },
      );
      return () => media.revert();
    },
    { scope: ref },
  );

  return (
    <section
      id="denis"
      ref={ref}
      data-stack-scene
      className="denis-spotlight relative isolate bg-foreground text-surface"
      aria-labelledby="denis-title"
    >
      <div
        className="denis-banner pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <MediaFrame
          src={landingContent.denisMedia.banner.image}
          alt=""
          className="h-full w-full"
          imageClassName="denis-banner-image"
          sizes="100vw"
          preload
        />
        <div className="denis-banner-shade absolute inset-0" />
      </div>
      <div
        data-denis-art
        className="denis-art pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div data-denis-bridge className="denis-bridge">
        <div className="denis-bridge-pin">
          <Container className="denis-bridge-content">
            <MotionText
              id="denis-title"
              as="h2"
              lines={["DENIS."]}
              data-denis-bridge-title
              className={typographyVariants.display}
              lineClassName="overflow-visible"
            />
            <Typography
              data-denis-bridge-copy
              variant="subtitle"
              className="max-w-sm text-inverse-muted"
            >
              Một cái tên.
              <br />
              Nhiều lựa chọn để khám phá.
            </Typography>
          </Container>
          <Container
            data-denis-content
            data-denis-panel
            className="denis-content"
          >
            <div className="grid gap-12 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
              <div className="space-y-8">
                <div
                  data-denis-rule
                  className="h-1 w-24 bg-brand-600"
                  aria-hidden="true"
                />
                <Typography data-denis-reveal variant="subtitle">
                  Những dòng dầu nhớt
                  <br />
                  đang có tại Hoàng Long.
                </Typography>
                <DenisMediaGallery />
              </div>
              <div className="space-y-8 lg:pt-20 ">
                <Paragraph
                  data-denis-reveal
                  className="max-w-lg text-inverse-muted"
                >
                  Tìm hiểu các dòng dầu nhớt DENIS đang có tại cửa hàng:
                </Paragraph>
                <div
                  data-denis-ranges
                  className="divide-y divide-inverse border-y border-inverse"
                >
                  {ranges.map((range) => (
                    <div data-denis-range key={range.label} className="py-5">
                      <div className="space-y-1">
                        <Typography variant="cardTitle">
                          {range.label}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="text-inverse-muted"
                        >
                          {range.detail}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
                <ActionLink data-denis-reveal href={landingContent.denisHref}>
                  Xem sản phẩm DENIS
                </ActionLink>
              </div>
            </div>
          </Container>
        </div>
      </div>
      <DenisDocumentCollage />
    </section>
  );
}
