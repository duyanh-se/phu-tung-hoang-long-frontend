export interface CatalogQuery {
  search: string;
  page: number;
  manufacturer?: string;
  error?: string;
}
type SearchParams = Record<string, string | string[] | undefined>;

export function parseCatalogQuery(params: SearchParams): CatalogQuery {
  const { search, page, manufacturer } = params;
  if ([search, page, manufacturer].some(Array.isArray)) {
    return { search: "", page: 1, error: "Tham số tìm kiếm không hợp lệ." };
  }
  const text = typeof search === "string" ? search.trim() : "";
  const name =
    typeof manufacturer === "string" ? manufacturer.trim() : undefined;
  const pageNumber =
    typeof page === "string" && /^\d+$/.test(page)
      ? Number(page)
      : page === undefined
        ? 1
        : NaN;
  if (
    text.length > 200 ||
    (name !== undefined && (!name || name.length > 200)) ||
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    pageNumber > 1000000
  ) {
    return {
      search: text.slice(0, 200),
      page: 1,
      error: "Bộ lọc hoặc số trang không hợp lệ.",
    };
  }
  return { search: text, page: pageNumber, manufacturer: name };
}

export function catalogHref(
  query: Pick<CatalogQuery, "search" | "page" | "manufacturer">,
) {
  const params = new URLSearchParams();
  if (query.manufacturer) params.set("manufacturer", query.manufacturer);
  if (query.search) params.set("search", query.search);
  if (query.page > 1) params.set("page", String(query.page));
  return "/san-pham" + (params.size ? "?" + params.toString() : "");
}
