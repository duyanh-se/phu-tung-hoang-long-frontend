import type { Metadata } from "next";
import { AppProvider } from "@/providers/app-provider";
import { PublicShell } from "@/components/layout/public-shell";
import { SkipToContent } from "@/components/layout/landing-section-link";
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
          <SkipToContent />
          <PublicShell>{children}</PublicShell>
        </AppProvider>
      </body>
    </html>
  );
}
