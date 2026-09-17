export interface CatalogQuery {
  search: string;
  page: number;
  manufacturer?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  minPrice?: number;
  maxPrice?: number;
  error?: string;
}
type SearchParams = Record<string, string | string[] | undefined>;

export function parseCatalogQuery(params: SearchParams): CatalogQuery {
  const { search, page, manufacturer, sort, minPrice, maxPrice } = params;
  if (
    [search, page, manufacturer, sort, minPrice, maxPrice].some(Array.isArray)
  ) {
    return { search: "", page: 1, error: "Tham số tìm kiếm không hợp lệ." };
  }
  const text = typeof search === "string" ? search.trim() : "";
  const name =
    typeof manufacturer === "string" ? manufacturer.trim() : undefined;
  const priceValue = (value: string | string[] | undefined) =>
    value === undefined
      ? undefined
      : typeof value === "string" &&
          /^\d+(\.\d{1,2})?$/.test(value) &&
          Number(value) <= 999999999999.99
        ? Number(value)
        : NaN;
  const min = priceValue(minPrice);
  const max = priceValue(maxPrice);
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
    pageNumber > 1000000 ||
    (sort !== undefined &&
      !["newest", "price_asc", "price_desc"].includes(String(sort))) ||
    Number.isNaN(min) ||
    Number.isNaN(max) ||
    (min !== undefined && max !== undefined && min > max)
  ) {
    return {
      search: text.slice(0, 200),
      page: 1,
      error: "Bộ lọc hoặc số trang không hợp lệ.",
    };
  }
  return {
    search: text,
    page: pageNumber,
    manufacturer: name,
    sort: sort as CatalogQuery["sort"],
    minPrice: min,
    maxPrice: max,
  };
}

export function catalogHref(query: Omit<CatalogQuery, "error">) {
  const params = new URLSearchParams();
  if (query.manufacturer) params.set("manufacturer", query.manufacturer);
  if (query.search) params.set("search", query.search);
  if (query.page > 1) params.set("page", String(query.page));
  if (query.sort && query.sort !== "newest") params.set("sort", query.sort);
  if (query.minPrice !== undefined)
    params.set("minPrice", String(query.minPrice));
  if (query.maxPrice !== undefined)
    params.set("maxPrice", String(query.maxPrice));
  return "/san-pham" + (params.size ? "?" + params.toString() : "");
}
