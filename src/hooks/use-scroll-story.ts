"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionPresets, motionQueries } from "@/styles/motion";

const storyCopyTravel = 160;

export function useScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current) return;
      const root = ref.current;
      const media = gsap.matchMedia();
      media.add(
        {
          all: "(min-width: 0px)",
          eligible: motionQueries.story,
          reduced: motionQueries.reduced,
        },
        (context) => {
          if (context.conditions?.reduced) return;
          const chapters = gsap.utils.toArray<HTMLElement>(
            "[data-story-chapter]",
            root,
          );
          if (!context.conditions?.eligible) {
            chapters.forEach((chapter) =>
              gsap.from(chapter, {
                opacity: 0,
                y: motionPresets.mobileDistance,
                duration: motionPresets.reveal.mobileDuration,
                ease: motionPresets.ease,
                clearProps: "opacity,transform",
                scrollTrigger: {
                  trigger: chapter,
                  start: "top 94%",
                  once: true,
                },
              }),
            );
            return;
          }
          const panels = gsap.utils.toArray<HTMLElement>(
            "[data-story-panel]",
            root,
          );
          const contents = gsap.utils.toArray<HTMLElement>(
            "[data-story-content]",
            root,
          );
          // Keep all chapters in normal flow for zoom/short viewports or large text.
          if (
            contents.some(
              (content) => content.scrollHeight > window.innerHeight * 0.7,
            )
          )
            return;
          root.classList.add("story-enhanced");
          gsap.set(panels, { opacity: 0 });
          panels.forEach((panel, index) =>
            gsap.set(panel, { zIndex: index + 1 }),
          );
          gsap.set(panels[0], { opacity: 1 });
          gsap.set(contents, { opacity: 0 });
          gsap.set(contents[0], { opacity: 1 });
          chapters.slice(1).forEach((chapter, index) => {
            const position = index + 1;
            const transition = gsap.timeline({
              scrollTrigger: {
                trigger: chapter,
                start: "top 70%",
                end: "top 30%",
                scrub: motionPresets.scrub.story,
                invalidateOnRefresh: true,
              },
            });

            transition
              .fromTo(
                panels[position - 1],
                { opacity: 1 },
                {
                  opacity: 0,
                  ease: "none",
                  immediateRender: false,
                },
                0,
              )
              .fromTo(
                panels[position],
                { opacity: 0 },
                {
                  opacity: 1,
                  ease: "none",
                  immediateRender: false,
                },
                0,
              )
              .fromTo(
                contents[position - 1],
                { opacity: 1, y: 0 },
                {
                  opacity: 0,
                  y: -storyCopyTravel,
                  ease: "none",
                  immediateRender: false,
                },
                0,
              )
              .fromTo(
                contents[position],
                { opacity: 0, y: storyCopyTravel },
                {
                  opacity: 1,
                  y: 0,
                  ease: "none",
                  immediateRender: false,
                },
                0,
              );
          });
          return () => root.classList.remove("story-enhanced");
        },
      );
      return () => media.revert();
    },
    { scope: ref },
  );
  return ref;
}
