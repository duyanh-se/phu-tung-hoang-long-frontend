import type { Metadata } from "next";
import { CatalogScreen } from "@/components/features/products/catalog-screen";
import { parseCatalogQuery } from "@/lib/catalog-query";

export const metadata: Metadata = { title: "Danh mục phụ tùng" };

export default async function CatalogPage({
  searchParams,
}: PageProps<"/san-pham">) {
  return <CatalogScreen query={parseCatalogQuery(await searchParams)} />;
}
