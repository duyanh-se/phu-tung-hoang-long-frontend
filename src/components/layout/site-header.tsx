"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Typography } from "@/components/ui/typography";
import { Container } from "./container";
import { LandingSectionLink } from "./landing-section-link";

export function SiteHeader() {
  const pathname = usePathname();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setIsCompact(window.scrollY > 48);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <header
      className="site-header"
      data-home-stack={pathname === "/" ? true : undefined}
      data-compact={pathname === "/" && isCompact ? true : undefined}
    >
      <Container className="site-header-inner flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          className={`motion-interaction flex min-w-0 items-center gap-3 rounded-control ${pathname === "/" ? "text-surface hover:text-surface" : "text-foreground hover:text-brand-700"}`}
        >
          <BrandLogo decorative />
          <Typography as="span" variant="cardTitle" className="min-w-0">
            {siteConfig.name}
          </Typography>
        </Link>
        <nav
          aria-label="Điều hướng chính"
          className="flex flex-wrap items-center gap-1 sm:gap-4"
        >
          <LandingSectionLink
            section="cau-chuyen"
            className={`motion-interaction inline-flex min-h-control items-center rounded-control px-3 text-label font-medium ${pathname === "/" ? "text-surface hover:bg-surface/10 hover:text-surface" : "text-muted hover:text-brand-600"}`}
          >
            Cửa hàng
          </LandingSectionLink>
          <LandingSectionLink
            section="denis"
            className={`motion-interaction inline-flex min-h-control items-center rounded-control px-3 text-label font-medium ${pathname === "/" ? "text-surface hover:bg-surface/10 hover:text-surface" : "text-muted hover:text-brand-600"}`}
          >
            DENIS
          </LandingSectionLink>
          <Link
            href="/san-pham"
            aria-current={pathname === "/san-pham" ? "page" : undefined}
            className={`motion-interaction inline-flex min-h-control items-center rounded-control px-3 ${pathname === "/" ? "text-surface hover:bg-surface/10 hover:text-surface" : "text-brand-600 hover:bg-brand-50 hover:text-brand-700"}`}
          >
            <Typography as="span" variant="label">
              Sản phẩm ↗
            </Typography>
          </Link>
        </nav>
      </Container>
    </header>
  );
}
