import { describe, expect, it } from "vitest";
import { catalogHref, parseCatalogQuery } from "./catalog-query";

describe("catalog URL filters", () => {
  it("preserves manufacturer through search and pagination", () => {
    const query = parseCatalogQuery({
      manufacturer: " DENIS ",
      search: " MAXSPEED ",
      page: "2",
    });
    expect(catalogHref(query)).toBe(
      "/san-pham?manufacturer=DENIS&search=MAXSPEED&page=2",
    );
    expect(catalogHref({ ...query, page: 1 })).toBe(
      "/san-pham?manufacturer=DENIS&search=MAXSPEED",
    );
  });
  it.each([
    { minPrice: "-1" },
    { maxPrice: "NaN" },
    { minPrice: "200", maxPrice: "100" },
    { minPrice: "1.001" },
    { maxPrice: "1000000000000" },
    { sort: "wrong" },
    { minPrice: ["1", "2"] },
    { manufacturer: "" },
    { manufacturer: ["DENIS", "OTHER"] },
    { page: "0" },
    { page: "1.5" },
    { search: "a".repeat(201) },
  ])("rejects malformed params %j", (params) => {
    expect(parseCatalogQuery(params).error).toBeTruthy();
  });
  it("round-trips combined filters including a zero bound", () => {
    const query = parseCatalogQuery({
      search: "oil",
      manufacturer: "DENIS",
      sort: "price_desc",
      minPrice: "0",
      maxPrice: "200000",
      page: "2",
    });
    expect(query.error).toBeUndefined();
    expect(catalogHref(query)).toBe(
      "/san-pham?manufacturer=DENIS&search=oil&page=2&sort=price_desc&minPrice=0&maxPrice=200000",
    );
  });
});
