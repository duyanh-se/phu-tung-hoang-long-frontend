"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { BackToTopButton } from "./back-to-top-button";
import { LandingSectionNavigation } from "./landing-section-link";

export function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const admin = pathname === "/admin" || pathname.startsWith("/admin/");
  return (
    <>
      <LandingSectionNavigation />
      {!admin && <SiteHeader />}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {!admin && (
        <>
          <SiteFooter />
          <BackToTopButton />
        </>
      )}
    </>
  );
}
