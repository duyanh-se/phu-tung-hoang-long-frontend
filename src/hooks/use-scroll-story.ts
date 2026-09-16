"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
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
          let active = 0;
          let requested = 0;
          let changing = false;
          let transition: gsap.core.Timeline | undefined;
          const changeScene = () => {
            if (requested === active || changing) return;
            changing = true;
            const direction = requested > active ? 1 : -1;
            transition = gsap.timeline();
            // Finish the outgoing scene before revealing either incoming layer.
            transition
              .to(
                panels[active],
                { opacity: 0, duration: motionPresets.story.exit },
                0,
              )
              .to(
                contents[active],
                {
                  opacity: 0,
                  y: -storyCopyTravel * direction,
                  duration: motionPresets.story.exit,
                },
                0,
              )
              .add(() => {
                active = requested;
                gsap.set(contents[active], { y: storyCopyTravel * direction });
              })
              .add(() => {
                // Resolve the latest scroll destination after the exit finishes.
                transition = gsap
                  .timeline({
                    onComplete: () => {
                      changing = false;
                      changeScene();
                    },
                  })
                  .to(
                    panels[active],
                    {
                      opacity: 1,
                      duration: motionPresets.story.enter,
                      ease: motionPresets.ease,
                    },
                    0,
                  )
                  .to(
                    contents[active],
                    {
                      opacity: 1,
                      y: 0,
                      duration: motionPresets.story.enter,
                      ease: motionPresets.ease,
                    },
                    0,
                  );
              });
          };
          const syncScene = () => {
            requested = chapters.reduce(
              (position, chapter, index) =>
                chapter.getBoundingClientRect().top <= window.innerHeight * 0.5
                  ? index
                  : position,
              0,
            );
            changeScene();
          };
          const trigger = ScrollTrigger.create({
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            onUpdate: syncScene,
            onRefresh: syncScene,
          });
          syncScene();
          return () => {
            trigger.kill();
            transition?.kill();
            gsap.set([...panels, ...contents], {
              clearProps: "opacity,transform",
            });
            root.classList.remove("story-enhanced");
          };
        },
      );
      return () => media.revert();
    },
    { scope: ref },
  );
  return ref;
}
