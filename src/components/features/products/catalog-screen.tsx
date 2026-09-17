import { Container } from "@/components/layout/container";
import { Title, Paragraph, Typography } from "@/components/ui/typography";
import { ActionLink } from "@/components/ui/action-link";
import { ProductCatalog } from "./product-catalog";
import type { CatalogQuery } from "@/lib/catalog-query";
import { CatalogHero } from "./catalog-hero";

export function CatalogScreen({ query }: { query: CatalogQuery }) {
  return (
    <div className="catalog-page">
      <CatalogHero>
        <Typography variant="eyebrow" className="text-surface/80">
          Phụ tùng Hoàng Long
        </Typography>
        <Title variant="display" className="max-w-4xl break-words">
          {query.manufacturer
            ? `Sản phẩm ${query.manufacturer}`
            : "Danh mục phụ tùng"}
        </Title>
        <Paragraph className="max-w-xl text-surface/80">
          Tìm kiếm phụ tùng theo tên hoặc mã sản phẩm.
        </Paragraph>
        {query.manufacturer && (
          <ActionLink href="/san-pham" variant="secondary">
            Xem tất cả hãng
          </ActionLink>
        )}
      </CatalogHero>
      <Container className="py-10 sm:py-16">
        {query.error ? (
          <div role="alert" className="space-y-4">
            <Paragraph className="text-danger">{query.error}</Paragraph>
            <ActionLink href="/san-pham">Đặt lại bộ lọc</ActionLink>
          </div>
        ) : (
          <ProductCatalog query={query} />
        )}
      </Container>
    </div>
  );
}
