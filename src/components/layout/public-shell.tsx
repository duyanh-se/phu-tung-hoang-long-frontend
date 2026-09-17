"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { BackToTopButton } from "./back-to-top-button";
import { LandingSectionNavigation } from "./landing-section-link";
import { UserSessionProvider } from "@/hooks/use-user-session";

export function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const admin = pathname === "/admin" || pathname.startsWith("/admin/");
  const standaloneLogin = pathname === "/dang-nhap" || pathname === "/dang-ky";
  return (
    <UserSessionProvider>
      <LandingSectionNavigation />
      {!admin && !standaloneLogin && <SiteHeader />}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {!admin && !standaloneLogin && (
        <>
          <SiteFooter />
          <BackToTopButton />
        </>
      )}
    </UserSessionProvider>
  );
}
