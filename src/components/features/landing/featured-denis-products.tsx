"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionPresets, motionQueries } from "@/styles/motion";
import { useDenisProducts } from "@/hooks/use-denis-products";
import { landingContent } from "@/config/landing";
import { Container } from "@/components/layout/container";
import { Typography, Paragraph } from "@/components/ui/typography";
import { ActionLink } from "@/components/ui/action-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/feedback";
import { ProductCard } from "@/components/features/products/product-card";
import { ProductSkeleton } from "@/components/features/products/product-skeleton";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ProductsStage } from "./products-stage";

function ProductsRail({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const viewport = ref.current;
      const section = viewport?.closest<HTMLElement>("#san-pham-denis");
      const track = section?.querySelector<HTMLElement>(".products-track");
      const rail = viewport?.querySelector<HTMLElement>("[data-products-rail]");
      if (!section || !track || !rail) return;
      const media = gsap.matchMedia();
      media.add(motionQueries.stack, () => {
        if (window.matchMedia(motionQueries.reduced).matches) return;
        section.classList.add("products-rail-enhanced");
        gsap.to(rail, {
          x: () => -(rail.scrollWidth - rail.clientWidth),
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom+=100%",
            scrub: motionPresets.scrub.gallery,
            invalidateOnRefresh: true,
          },
        });
        return () => section.classList.remove("products-rail-enhanced");
      });
      return () => media.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="products-rail-viewport">
      {children}
    </div>
  );
}

export function FeaturedDenisProducts() {
  const { data, error, isLoading, refetch } = useDenisProducts();
  return (
    <section
      id="san-pham-denis"
      data-stack-scene
      className="products-section bg-brand-50"
      aria-labelledby="products-title"
    >
      <Container className="products-track">
        <ProductsStage>
          <ScrollReveal className="section-heading items-end">
            <div>
              <Typography as="h2" id="products-title" variant="title">
                Tìm lựa chọn của bạn.
              </Typography>
            </div>
            <ActionLink href={landingContent.denisHref} variant="ghost">
              Xem tất cả DENIS
            </ActionLink>
          </ScrollReveal>
          <div className="mt-10" aria-live="polite" aria-busy={isLoading}>
            {isLoading ? (
              <ProductSkeleton />
            ) : error ? (
              <Card role="alert" className="space-y-4">
                <Paragraph className="text-danger">{error.message}</Paragraph>
                <Button onClick={refetch}>Thử lại</Button>
              </Card>
            ) : data?.data.length ? (
              <ProductsRail>
                <div data-products-rail className="products-rail">
                  <div className="products-rail-items">
                    {data.data.map((product) => (
                      <ProductCard compact key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </ProductsRail>
            ) : (
              <EmptyState />
            )}
          </div>
        </ProductsStage>
      </Container>
    </section>
  );
}
