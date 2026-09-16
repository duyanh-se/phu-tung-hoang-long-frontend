"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionPresets, motionQueries } from "@/styles/motion";
import { landingContent } from "@/config/landing";
import { Container } from "@/components/layout/container";
import { Typography } from "@/components/ui/typography";
import { ActionLink } from "@/components/ui/action-link";
import { MediaFrame } from "@/components/ui/media-frame";
import { MotionText } from "@/components/motion/motion-text";
import { typographyVariants } from "@/styles/typography";

export function LandingHero() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          all: "(min-width: 0px)",
          reduced: motionQueries.reduced,
          desktop: motionQueries.desktop,
        },
        (context) => {
          if (context.conditions?.reduced) return;
          gsap.from("[data-hero-enter]", {
            y: context.conditions?.desktop
              ? motionPresets.hero.distance
              : motionPresets.mobileDistance,
            opacity: 0,
            duration: context.conditions?.desktop
              ? motionPresets.hero.duration
              : motionPresets.hero.mobileDuration,
            stagger: motionPresets.hero.stagger,
            ease: motionPresets.ease,
            clearProps: "opacity,transform",
          });
          gsap.from("[data-hero-title] [data-motion-line]", {
            yPercent: 112,
            duration: context.conditions?.desktop
              ? motionPresets.hero.duration
              : motionPresets.hero.mobileDuration,
            stagger: motionPresets.hero.stagger,
            ease: motionPresets.ease,
            clearProps: "transform",
          });
          if (context.conditions?.desktop) {
            gsap.fromTo(
              "[data-hero-image]",
              { scale: 1.06, y: 0 },
              {
                y: -motionPresets.heroParallax,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: ref.current,
                  start: "top top",
                  end: "bottom top",
                  scrub: motionPresets.scrub.hero,
                  invalidateOnRefresh: true,
                },
              },
            );
            gsap.to("[data-hero-title] [data-motion-line]", {
              x: (index) => (index % 2 ? -24 : 24),
              opacity: 0.35,
              ease: "none",
              scrollTrigger: {
                trigger: ref.current,
                start: "45% top",
                end: "bottom top",
                scrub: motionPresets.scrub.hero,
                invalidateOnRefresh: true,
              },
            });
            gsap.fromTo(
              "[data-hero-shade]",
              { opacity: 0.88 },
              {
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: ref.current,
                  start: "top top",
                  end: "bottom top",
                  scrub: motionPresets.scrub.hero,
                },
              },
            );
          }
        },
      );
      return () => media.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="hoang-long"
      data-stack-scene
      data-stack-pin="true"
      className="landing-hero isolate relative overflow-hidden bg-foreground text-surface"
      aria-labelledby="hero-title"
    >
      <div data-hero-image className="absolute inset-0 -bottom-12">
        <MediaFrame
          src={landingContent.hero.image}
          alt={landingContent.hero.alt}
          className="h-full w-full"
          sizes="100vw"
          preload
          imageClassName="hero-photo"
        />
      </div>
      <div data-hero-shade className="hero-shade absolute inset-0" />
      <Container className="relative z-10 flex flex-col justify-center pb-8 sm:pb-12">
        <div
          data-hero-enter
          data-hero-line
          className="flex items-center justify-between gap-4 border-b border-inverse pb-4"
        >
          <Typography variant="eyebrow">
            Phụ tùng xe máy · Hoàng Long
          </Typography>
        </div>
        <div className="max-w-4xl space-y-6 py-12">
          <MotionText
            id="hero-title"
            as="h1"
            lines={["Hoàng Long.", "Trao giá trị nhận niềm tin"]}
            data-hero-title
            data-hero-line
            className={typographyVariants.display}
            lineClassName="hero-motion-line last:text-inverse-muted"
          />
          <div
            data-hero-enter
            data-hero-line
            className="flex flex-wrap gap-3 pt-2"
          >
            <ActionLink href="#denis">Khám phá Sản phẩm nổi bật</ActionLink>
            <ActionLink
              href="#cau-chuyen"
              variant="ghost"
              className="text-surface hover:bg-surface/10 hover:text-surface"
            >
              Bước vào cửa hàng
            </ActionLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
