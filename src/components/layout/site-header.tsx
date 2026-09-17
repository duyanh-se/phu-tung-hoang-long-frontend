"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Typography } from "@/components/ui/typography";
import { Container } from "./container";
import { LandingSectionLink } from "./landing-section-link";
import { useUserSession } from "@/hooks/use-user-session";

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout } = useUserSession();
  const [loggingOut, setLoggingOut] = useState(false);
  const [authError, setAuthError] = useState("");
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
          {user ? (
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`max-w-32 truncate text-label ${pathname === "/" ? "text-surface" : "text-foreground"}`}
                title={user.fullName || user.email}
              >
                {user.fullName || user.email}
              </span>
              <button
                type="button"
                disabled={loggingOut}
                onClick={async () => {
                  setLoggingOut(true);
                  setAuthError("");
                  try {
                    await logout();
                  } catch {
                    setAuthError("Chưa đăng xuất được. Vui lòng thử lại.");
                  } finally {
                    setLoggingOut(false);
                  }
                }}
                className={`motion-interaction min-h-control rounded-control border px-3 text-label disabled:opacity-50 ${pathname === "/" ? "border-surface/40 text-surface hover:bg-surface/10" : "border-border text-brand-600 hover:bg-brand-50"}`}
              >
                {loggingOut ? "Đang đăng xuất…" : "Đăng xuất"}
              </button>
            </div>
          ) : (
            <Link
              href="/dang-nhap"
              aria-current={pathname === "/dang-nhap" ? "page" : undefined}
              className={`motion-interaction inline-flex min-h-control items-center rounded-control border px-4 text-label font-semibold ${pathname === "/" ? "border-surface/40 text-surface hover:bg-surface/10" : "border-brand-600 bg-brand-600 text-surface hover:bg-brand-700"}`}
            >
              Đăng nhập
            </Link>
          )}
          {authError && (
            <span role="alert" className="text-label">
              {authError}
            </span>
          )}
        </nav>
      </Container>
    </header>
  );
}
