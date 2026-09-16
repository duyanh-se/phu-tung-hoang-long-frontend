// HOME-001 approved motion presets. GSAP durations are in seconds.
export const motionPresets = {
  ease: "power3.out",
  hero: { duration: 0.9, mobileDuration: 0.55, stagger: 0.08, distance: 28 },
  reveal: { duration: 0.7, mobileDuration: 0.45, stagger: 0.09, distance: 24 },
  micro: 0.22,
  story: { exit: 0.4, enter: 0.7 },
  scrub: { hero: 0.8, story: 0.6, denis: 0.75, gallery: 0.85 },
  cardRotation: 1.25,
  mobileDistance: 12,
  heroParallax: 64,
  spotlightParallax: 32,
} as const;
export const motionQueries = {
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  story: "(min-width: 1024px) and (min-height: 700px)",
  stack: "(min-width: 1024px) and (min-height: 700px)",
};
