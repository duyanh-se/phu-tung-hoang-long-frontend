"use client";

import { useRef } from "react";
import { Container } from "@/components/layout/container";
import { Typography, Paragraph } from "@/components/ui/typography";
import { ActionLink } from "@/components/ui/action-link";
import { MotionText } from "@/components/motion/motion-text";
import { typographyVariants } from "@/styles/typography";
import { landingContent } from "@/config/landing";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionPresets, motionQueries } from "@/styles/motion";

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          all: "(min-width: 0px)",
          desktop: motionQueries.desktop,
          reduced: motionQueries.reduced,
        },
        (context) => {
          if (context.conditions?.reduced) return;
          gsap.from("[data-contact-title] [data-motion-line]", {
            yPercent: 112,
            duration: context.conditions?.desktop
              ? motionPresets.hero.duration
              : motionPresets.hero.mobileDuration,
            stagger: motionPresets.hero.stagger,
            ease: motionPresets.ease,
            clearProps: "transform",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 76%",
              once: true,
            },
          });
          gsap.from("[data-contact-reveal]", {
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
              trigger: ref.current,
              start: "top 76%",
              once: true,
            },
          });
          gsap.fromTo(
            "[data-contact-art]",
            { x: context.conditions?.desktop ? 32 : 12 },
            {
              x: context.conditions?.desktop ? -32 : -12,
              ease: "none",
              scrollTrigger: {
                trigger: ref.current,
                start: "top bottom",
                end: "bottom top",
                scrub: motionPresets.scrub.gallery,
              },
            },
          );
        },
      );
      return () => media.revert();
    },
    { scope: ref },
  );

  return (
    <section
      id="ket-noi"
      ref={ref}
      data-stack-scene
      className="contact-section relative isolate overflow-hidden bg-brand-600 text-surface"
      aria-labelledby="contact-title"
    >
      <div
        data-contact-art
        className="contact-art pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      />
      <Container className="contact-content">
        <div className="grid items-end gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            <Typography data-contact-reveal variant="eyebrow">
              Khám phá thêm
            </Typography>
            <MotionText
              id="contact-title"
              as="h2"
              lines={["Câu chuyện tiếp theo,", "bắt đầu từ chiếc xe của bạn."]}
              data-contact-title
              className={typographyVariants.title}
            />
          </div>
          <div data-contact-reveal className="space-y-6">
            <Paragraph className="text-inverse-muted">
              Khám phá danh mục phụ tùng Hoàng Long và tìm hiểu các sản phẩm
              DENIS đang có tại cửa hàng.
            </Paragraph>
            <div className="flex flex-wrap gap-3">
              <ActionLink href={landingContent.denisHref} variant="secondary">
                Khám phá DENIS
              </ActionLink>
              <ActionLink
                href="/san-pham"
                variant="ghost"
                className="text-surface hover:bg-surface/10 hover:text-surface"
              >
                Toàn bộ sản phẩm
              </ActionLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
