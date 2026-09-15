"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { buttonStyles } from "@/styles/button";

const visibilityThreshold = 480;

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frame = requestAnimationFrame(updateVisibility);
    function updateVisibility() {
      frame = 0;
      setIsVisible(window.scrollY > visibilityThreshold);
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(updateVisibility);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  function scrollToTop() {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      aria-label="Về đầu trang"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      data-visible={isVisible || undefined}
      onClick={scrollToTop}
      className={cn(buttonStyles(), "back-to-top size-12 p-0")}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
