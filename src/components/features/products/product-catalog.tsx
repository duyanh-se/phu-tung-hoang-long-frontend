"use client";

import { useRouter } from "next/navigation";
import { catalogHref, type CatalogQuery } from "@/lib/catalog-query";
import { useProducts } from "@/hooks/use-products";
import { useAppStore } from "@/providers/app-store-provider";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, LoadingState } from "@/components/ui/feedback";
import { Pagination } from "@/components/ui/pagination";
import { Paragraph } from "@/components/ui/typography";
import { ProductCard } from "./product-card";
import { ProductToolbar } from "./product-toolbar";

export function ProductCatalog({ query }: { query: CatalogQuery }) {
  const router = useRouter();
  const { search, page, manufacturer } = query;
  const navigate = (next: Partial<CatalogQuery>) =>
    router.push(catalogHref({ ...query, ...next }), { scroll: false });
  const view = useAppStore((state) => state.productView);
  const { data, error, isLoading, refetch } = useProducts(
    {
      search,
      page,
      limit: 12,
    },
    manufacturer,
  );
  return (
    <section aria-label="Danh sách sản phẩm" className="space-y-6">
      <ProductToolbar
        key={search}
        initialSearch={search}
        onSearch={(value) => {
          navigate({ search: value, page: 1 });
        }}
      />
      <div aria-live="polite" aria-busy={isLoading}>
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <Card role="alert" className="space-y-4">
            <Paragraph className="text-danger">{error.message}</Paragraph>
            <Button onClick={refetch}>Thử lại</Button>
          </Card>
        ) : data?.data.length ? (
          <div
            className={cn(
              "grid gap-4",
              view === "grid" && "sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {data.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
      {data && !isLoading && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onChange={(page) => navigate({ page })}
        />
      )}
    </section>
  );
}
