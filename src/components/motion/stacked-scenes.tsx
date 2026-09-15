"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motionQueries } from "@/styles/motion";

type StackedScenesProps = {
  children: ReactNode;
};

export function StackedScenes({ children }: StackedScenesProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      const root = ref.current;
      const media = gsap.matchMedia();

      media.add(
        {
          stack: motionQueries.stack,
          reduced: motionQueries.reduced,
        },
        (context) => {
          if (!context.conditions?.stack || context.conditions?.reduced) return;

          const scenes = gsap.utils.toArray<HTMLElement>(
            "[data-stack-scene]",
            root,
          );

          scenes.forEach((scene, index) => {
            const nextScene = scenes[index + 1];
            gsap.set(scene, { zIndex: index + 1 });

            if (!nextScene || scene.dataset.stackPin !== "true") return;

            ScrollTrigger.create({
              trigger: scene,
              start: "top top",
              endTrigger: nextScene,
              end: "top top",
              pin: true,
              pinSpacing: false,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onToggle: ({ isActive }) =>
                scene.toggleAttribute("data-stack-pinned", isActive),
            });
          });
        },
      );

      return () => media.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="stacked-scenes">
      {children}
    </div>
  );
}
