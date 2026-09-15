"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motionQueries } from "@/styles/motion";

export function LandingHeaderPin() {
  useGSAP(() => {
    const header = document.querySelector<HTMLElement>(
      ".site-header[data-home-stack]",
    );
    const story = document.querySelector<HTMLElement>("#cau-chuyen");
    if (!header || !story) return;

    const media = gsap.matchMedia();
    media.add(
      {
        stack: motionQueries.stack,
        reduced: motionQueries.reduced,
      },
      (context) => {
        if (!context.conditions?.stack || context.conditions?.reduced) return;

        ScrollTrigger.create({
          trigger: header,
          start: "top top",
          endTrigger: story,
          end: "top top",
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: ({ isActive }) =>
            header.toggleAttribute("data-home-pinned", isActive),
        });
      },
    );

    return () => media.revert();
  });

  return null;
}
