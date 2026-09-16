"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ComponentProps } from "react";
import { buttonStyles, type ButtonVariant } from "@/styles/button";
import { cn } from "@/lib/cn";
import { ScrollTrigger } from "@/lib/gsap";

const pendingSectionKey = "hoang-long:landing-section";

function scrollToSection(id: string) {
  const section = document.getElementById(id);
  if (!section) return;
  // Refresh pin measurements before jumping, including after returning from a route.
  ScrollTrigger.refresh();
  // The landing header leaves with the hero; its old anchor offset must not
  // leave the preceding scene visible above the destination.
  const top = section.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "instant" });
  ScrollTrigger.update();
  // A direct jump should land on the destination frame, without scrub lag.
  ScrollTrigger.getAll().forEach((trigger) => {
    const tween = trigger.getTween();
    if (tween) tween.progress(1);
  });
  if (!section.hasAttribute("tabindex")) section.tabIndex = -1;
  section.focus({ preventScroll: true });
}

export function LandingSectionLink({
  section,
  variant,
  className,
  children,
  onClick,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & {
  section: string;
  variant?: ButtonVariant;
}) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      href="/"
      className={cn(
        variant && buttonStyles(variant),
        variant && "action-link gap-6",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        if (pathname === "/") {
          event.preventDefault();
          scrollToSection(section);
        } else {
          sessionStorage.setItem(pendingSectionKey, section);
        }
      }}
    >
      {children}
      {variant && (
        <span className="action-link-arrow" aria-hidden="true">
          ↗
        </span>
      )}
    </Link>
  );
}

export function LandingSectionNavigation() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== "/") return;
    let frame = 0;
    function navigate() {
      const pending = sessionStorage.getItem(pendingSectionKey);
      let legacySection = "";
      try {
        legacySection = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        /* Invalid old fragments are removed too. */
      }
      if (window.location.hash)
        window.history.replaceState(
          window.history.state,
          "",
          window.location.pathname + window.location.search,
        );
      const target = pending || legacySection;
      if (!target) return;
      // Wait for the landing's layout effects to register its scroll scenes.
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        sessionStorage.removeItem(pendingSectionKey);
        scrollToSection(target);
      });
    }
    navigate();
    window.addEventListener("hashchange", navigate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", navigate);
    };
  }, [pathname]);
  return null;
}

export function SkipToContent() {
  return (
    <button
      type="button"
      className="sr-only focus:not-sr-only focus:p-4"
      onClick={() => scrollToSection("main-content")}
    >
      Đến nội dung chính
    </button>
  );
}
