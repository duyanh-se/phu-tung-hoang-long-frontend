import type { Metadata } from "next";
import { AppProvider } from "@/providers/app-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BackToTopButton } from "@/components/layout/back-to-top-button";
import { siteConfig } from "@/config/site";
import { beVietnamPro } from "@/config/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: "%s | " + siteConfig.name },
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AppProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:p-4"
          >
            Đến nội dung chính
          </a>
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <BackToTopButton />
        </AppProvider>
      </body>
    </html>
  );
}
