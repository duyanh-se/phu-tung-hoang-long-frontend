"use client";

import { useRef } from "react";
import { landingContent } from "@/config/landing";
import { Container } from "@/components/layout/container";
import { Typography } from "@/components/ui/typography";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionPresets, motionQueries } from "@/styles/motion";
import { StoreGalleryCapabilityCard } from "./store-gallery-capability-card";

export function StoreGallery() {
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
          if (context.conditions?.reduced || !ref.current) return;
          const items = gsap.utils.toArray<HTMLElement>(
            "[data-gallery-item]",
            ref.current,
          );
          items.forEach((item) => {
            const frame = item.querySelector<HTMLElement>(".gallery-frame");
            const image = item.querySelector<HTMLElement>("img");
            if (!frame) return;
            gsap.fromTo(
              frame,
              { clipPath: "inset(10% 0 10% 0)" },
              {
                clipPath: "inset(0 0 0 0)",
                ease: "none",
                scrollTrigger: {
                  trigger: item,
                  start: "top 86%",
                  end: "bottom 28%",
                  scrub: motionPresets.scrub.gallery,
                  invalidateOnRefresh: true,
                },
              },
            );
            if (context.conditions?.desktop && image) {
              gsap.fromTo(
                image,
                { yPercent: 8 },
                {
                  yPercent: -4,
                  ease: "none",
                  scrollTrigger: {
                    trigger: item,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: motionPresets.scrub.gallery,
                    invalidateOnRefresh: true,
                  },
                },
              );
            }
          });
        },
      );
      return () => media.revert();
    },
    { scope: ref },
  );

  return (
    <section
      id="khong-gian"
      ref={ref}
      data-stack-scene
      className="gallery-section bg-background"
      aria-labelledby="gallery-title"
    >
      <Container className="section-content-center">
        <ScrollReveal className="section-heading">
          <div>
            <Typography as="h2" id="gallery-title" variant="title">
              Những hình ảnh
              <br />
              từ cửa hàng.
            </Typography>
          </div>
        </ScrollReveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {landingContent.gallery.map((photo) => (
            <StoreGalleryCapabilityCard key={photo.image} photo={photo} />
          ))}
        </div>
      </Container>
    </section>
  );
}
