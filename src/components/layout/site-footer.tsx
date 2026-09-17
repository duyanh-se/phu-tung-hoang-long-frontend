"use client";

import { usePathname } from "next/navigation";
import { ContactSection } from "@/components/features/landing/contact-section";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Typography } from "@/components/ui/typography";
import { Container } from "./container";
import { FooterContactForm } from "./footer-contact-form";

export function SiteFooter() {
  const isHome = usePathname() === "/";

  return (
    <footer
      className={
        isHome
          ? "site-footer site-footer-home relative mt-auto"
          : "site-footer mt-auto pt-10 sm:pt-16"
      }
    >
      {isHome && <ContactSection />}
      <div className="site-footer-panel relative isolate overflow-hidden">
        <Typography
          aria-hidden="true"
          className="site-footer-wordmark pointer-events-none absolute inset-x-0 bottom-0 -z-10 text-center"
        >
          HOÀNG LONG
        </Typography>
        <Container className="grid gap-12 py-12 lg:grid-cols-[0.78fr_1.22fr] lg:py-16">
          <div className="space-y-8">
            <Link
              href="/"
              className="motion-interaction inline-flex items-center gap-3 rounded-control text-foreground hover:text-brand-700"
            >
              <BrandLogo size="small" decorative />
              <Typography as="span" variant="label">
                {siteConfig.name}
              </Typography>
            </Link>
            <div className="space-y-3">
              <Typography as="h2" variant="title">
                Theo dõi chúng tôi
              </Typography>

              <Typography muted>
                <a
                  href="https://www.facebook.com/ptxmhoanglong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="motion-interaction rounded-control hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700"
                >
                  Facebook
                </a>
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography variant="label">
                © 2026 {siteConfig.name}. Bản quyền được bảo hộ.
              </Typography>
              <Typography variant="caption" className="text-muted">
                Điều khoản · Quyền riêng tư · Cài đặt cookie
              </Typography>
            </div>
          </div>
          <div className="space-y-6">
            <Typography as="h2" variant="title">
              Liên hệ
            </Typography>
            <FooterContactForm />
          </div>
        </Container>
      </div>
    </footer>
  );
}
