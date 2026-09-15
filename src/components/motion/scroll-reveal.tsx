"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionPresets, motionQueries } from "@/styles/motion";

export function ScrollReveal({
  children,
  className,
  group = false,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  group?: boolean;
  variant?: "default" | "cards";
}) {
  const ref = useRef<HTMLDivElement>(null);
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
          if (context.conditions?.reduced || !ref.current) return;
          const targets = group
            ? Array.from(ref.current.children)
            : [ref.current];
          gsap.from(targets, {
            opacity: 0,
            y: context.conditions?.desktop
              ? variant === "cards"
                ? 40
                : motionPresets.reveal.distance
              : motionPresets.mobileDistance,
            rotation:
              variant === "cards" && context.conditions?.desktop
                ? (index) =>
                    index % 2
                      ? motionPresets.cardRotation
                      : -motionPresets.cardRotation
                : 0,
            duration: context.conditions?.desktop
              ? motionPresets.reveal.duration
              : motionPresets.reveal.mobileDuration,
            stagger: group ? motionPresets.reveal.stagger : 0,
            ease: motionPresets.ease,
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 94%",
              once: true,
            },
          });
        },
      );
      return () => media.revert();
    },
    { scope: ref, dependencies: [children], revertOnUpdate: true },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
