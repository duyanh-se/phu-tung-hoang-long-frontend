import { Container } from "@/components/layout/container";
import { Title, Paragraph, Typography } from "@/components/ui/typography";
import { ActionLink } from "@/components/ui/action-link";
import { ProductCatalog } from "./product-catalog";
import type { CatalogQuery } from "@/lib/catalog-query";

export function CatalogScreen({ query }: { query: CatalogQuery }) {
  return (
    <Container className="space-y-8 py-12 sm:space-y-12 sm:py-16">
      <section className="max-w-2xl space-y-4">
        <Typography variant="eyebrow" className="text-brand-600">
          Phụ tùng Hoàng Long
        </Typography>
        <Title>
          {query.manufacturer
            ? `Sản phẩm ${query.manufacturer}`
            : "Danh mục phụ tùng"}
        </Title>
        <Paragraph muted>
          Tìm kiếm phụ tùng theo tên hoặc mã sản phẩm.
        </Paragraph>
        {query.manufacturer && (
          <ActionLink href="/san-pham" variant="ghost">
            Xem tất cả hãng
          </ActionLink>
        )}
      </section>
      {query.error ? (
        <div role="alert" className="space-y-4">
          <Paragraph className="text-danger">{query.error}</Paragraph>
          <ActionLink href="/san-pham">Đặt lại bộ lọc</ActionLink>
        </div>
      ) : (
        <ProductCatalog query={query} />
      )}
    </Container>
  );
}
