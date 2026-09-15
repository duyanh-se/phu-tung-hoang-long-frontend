"use client";
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
              <ScrollReveal
                group
                variant="cards"
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {data.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ScrollReveal>
            ) : (
              <EmptyState />
            )}
          </div>
        </ProductsStage>
      </Container>
    </section>
  );
}
