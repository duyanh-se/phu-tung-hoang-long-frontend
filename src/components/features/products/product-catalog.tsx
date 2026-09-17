"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { catalogHref, type CatalogQuery } from "@/lib/catalog-query";
import { useProducts } from "@/hooks/use-products";
import { useAppStore } from "@/providers/app-store-provider";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/feedback";
import { Pagination } from "@/components/ui/pagination";
import { Paragraph, Typography } from "@/components/ui/typography";
import { CatalogProductCard } from "./catalog-product-card";
import { ProductSkeleton } from "./product-skeleton";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ProductToolbar } from "./product-toolbar";
import { ProductFilters } from "./product-filters";
import { formatMoney } from "@/lib/format-money";

export function ProductCatalog({ query: routeQuery }: { query: CatalogQuery }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setOptimisticQuery] = useOptimistic(
    routeQuery,
    (current, next: Partial<CatalogQuery>) => ({ ...current, ...next }),
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { search, page, manufacturer } = query;
  const navigate = (next: Partial<CatalogQuery>) =>
    startTransition(() => {
      setOptimisticQuery(next);
      router.push(catalogHref({ ...query, ...next }), { scroll: false });
    });
  const view = useAppStore((state) => state.productView);
  const filterCount =
    Number(!!manufacturer) +
    Number(query.minPrice !== undefined || query.maxPrice !== undefined);
  const clearFilters = () =>
    navigate({
      manufacturer: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      page: 1,
    });
  const { data, error, isLoading, refetch } = useProducts(
    {
      search,
      page,
      limit: 12,
      sort: query.sort,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
    },
    manufacturer,
  );
  return (
    <section aria-label="Danh sách sản phẩm" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <Typography variant="eyebrow" className="text-brand-600">
            Danh mục sản phẩm
          </Typography>
          <Typography as="h2" variant="title">
            Tìm phụ tùng bạn cần.
          </Typography>
        </div>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside
          aria-label="Bộ lọc sản phẩm"
          className="min-w-0 rounded-card border border-border bg-surface lg:sticky lg:top-28 lg:max-h-[calc(100svh-8rem)] lg:overflow-y-auto"
        >
          <div className="hidden items-center justify-between border-b border-border p-5 lg:flex">
            <Typography as="h3" variant="subtitle">
              Bộ lọc
            </Typography>
            {filterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-label text-brand-600 hover:underline"
              >
                Xóa tất cả
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-expanded={filtersOpen}
            aria-controls="catalog-filter-panel"
            className="flex min-h-control w-full items-center justify-between gap-3 p-4 text-label font-semibold lg:hidden"
          >
            <span>Bộ lọc{filterCount > 0 ? ` (${filterCount})` : ""}</span>
            <span aria-hidden="true">{filtersOpen ? "−" : "+"}</span>
          </button>
          <div
            id="catalog-filter-panel"
            className={cn(!filtersOpen && "hidden", "lg:block")}
          >
            <ProductFilters
              query={query}
              onApply={(filters) => navigate({ ...filters, page: 1 })}
            />
            <div className="flex gap-2 border-t border-border p-4 lg:hidden">
              <Button onClick={() => setFiltersOpen(false)} className="flex-1">
                Xem kết quả
              </Button>
              {filterCount > 0 && (
                <Button variant="secondary" onClick={clearFilters}>
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>
        </aside>
        <div className="min-w-0 space-y-5">
          <ProductToolbar
            key={search}
            initialSearch={search}
            onSearch={(value) => {
              navigate({ search: value, page: 1 });
            }}
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <Typography variant="label" muted aria-live="polite">
              {isLoading
                ? "Đang tìm sản phẩm…"
                : data
                  ? `${data.total.toLocaleString("vi-VN")} sản phẩm`
                  : "Kết quả tìm kiếm"}
            </Typography>
            <div className="flex min-w-0 items-center gap-2">
              <label
                htmlFor="product-sort"
                className="shrink-0 text-label text-muted"
              >
                Sắp xếp
              </label>
              <select
                id="product-sort"
                value={query.sort || "newest"}
                onChange={(event) =>
                  navigate({
                    sort: event.target.value as CatalogQuery["sort"],
                    page: 1,
                  })
                }
                className="min-h-control min-w-0 rounded-control border border-input-border bg-surface px-3 text-label"
              >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá thấp → cao</option>
                <option value="price_desc">Giá cao → thấp</option>
              </select>
            </div>
          </div>
          {(filterCount > 0 || search) && (
            <div
              aria-label="Bộ lọc đang áp dụng"
              className="flex flex-wrap items-center gap-2"
            >
              {search && (
                <Button
                  variant="secondary"
                  onClick={() => navigate({ search: "", page: 1 })}
                  aria-label={`Bỏ từ khóa ${search}`}
                  className="max-w-full whitespace-normal text-left"
                >
                  “{search}” <span aria-hidden="true">×</span>
                </Button>
              )}
              {manufacturer && (
                <Button
                  variant="secondary"
                  onClick={() => navigate({ manufacturer: undefined, page: 1 })}
                  aria-label={`Bỏ nhà phân phối ${manufacturer}`}
                  className="max-w-full whitespace-normal text-left"
                >
                  {manufacturer} <span aria-hidden="true">×</span>
                </Button>
              )}
              {(query.minPrice !== undefined ||
                query.maxPrice !== undefined) && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate({
                      minPrice: undefined,
                      maxPrice: undefined,
                      page: 1,
                    })
                  }
                  aria-label="Bỏ khoảng giá"
                  className="max-w-full whitespace-normal text-left"
                >
                  {query.minPrice !== undefined
                    ? `Từ ${formatMoney(query.minPrice)}`
                    : ""}
                  {query.minPrice !== undefined && query.maxPrice !== undefined
                    ? " · "
                    : ""}
                  {query.maxPrice !== undefined
                    ? `Đến ${formatMoney(query.maxPrice)}`
                    : ""}{" "}
                  <span aria-hidden="true">×</span>
                </Button>
              )}
            </div>
          )}
          <div aria-live="polite" aria-busy={isLoading}>
            {isLoading ? (
              <ProductSkeleton />
            ) : error ? (
              <Card role="alert" className="space-y-4">
                <Paragraph className="text-danger">{error.message}</Paragraph>
                <Button onClick={refetch}>Thử lại</Button>
              </Card>
            ) : data?.data.length ? (
              <div className="space-y-5">
                <ScrollReveal
                  key={`${catalogHref(query)}-${view}`}
                  group
                  variant="cards"
                  className={cn(
                    "grid items-stretch gap-5",
                    view === "grid" && "sm:grid-cols-2 xl:grid-cols-3",
                  )}
                >
                  {data.data.map((product) => (
                    <div key={product.id} className="min-w-0">
                      <CatalogProductCard
                        product={product}
                        list={view === "list"}
                      />
                    </div>
                  ))}
                </ScrollReveal>
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
        </div>
      </div>
    </section>
  );
}
