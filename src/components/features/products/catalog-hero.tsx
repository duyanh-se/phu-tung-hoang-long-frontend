"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionPresets, motionQueries } from "@/styles/motion";
import { Container } from "@/components/layout/container";
import { Typography } from "@/components/ui/typography";

export function CatalogHero({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          desktop: motionQueries.desktop,
          reduced: motionQueries.reduced,
          all: "(min-width: 0px)",
        },
        (context) => {
          if (context.conditions?.reduced) return;
          gsap.from("[data-catalog-intro] > *", {
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
          if (context.conditions?.desktop) {
            gsap.to("[data-catalog-art]", {
              y: motionPresets.heroParallax,
              ease: "none",
              scrollTrigger: {
                trigger: ref.current,
                start: "top top",
                end: "bottom top",
                scrub: motionPresets.scrub.hero,
              },
            });
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
      className="catalog-hero relative isolate overflow-hidden bg-brand-600 text-surface"
    >
      <div
        data-catalog-art
        aria-hidden="true"
        className="contact-art pointer-events-none absolute -inset-y-24 inset-x-0 -z-10"
      />
      <Container className="relative py-7 sm:py-10">
        <nav
          aria-label="Đường dẫn"
          className="mb-5 flex items-center gap-3 text-label"
        >
          <Link
            href="/"
            className="rounded-control text-surface/80 hover:text-surface focus-visible:outline-surface"
          >
            Trang chủ
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Sản phẩm</span>
        </nav>
        <div data-catalog-intro className="space-y-5">
          {children}
        </div>
        <div className="mt-5 flex items-center justify-between gap-6 border-t border-surface/30 pt-3">
          <Typography variant="label">Đúng phụ tùng. Đúng nhu cầu.</Typography>
          <span aria-hidden="true" className="text-title">
            ↘
          </span>
        </div>
      </Container>
    </section>
  );
}
